import React, { useState, useEffect, useCallback } from 'react'
import { View, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Bubble, GiftedChat, Send,  Actions, Composer, InputToolbar} from 'react-native-gifted-chat'
import { useSelector, useDispatch } from 'react-redux'
import { messageIdGenerator } from '../util/msgGenerator'
import { getToken } from '../util/token'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import { USERS_INFO } from '../store/types';
import { openSocket, sendFileToServer, updateFileUploadStatus } from '../store/actions/auth'


export const ChatScreen = ({navigation, route}) => {
  //console.log('ChatScreen', route);
  const typeChat = route.params.type
  console.log('typeChat', typeChat);
  
  //* ************* *//
  //для сохранения сообщений в redux, диспатчим в onSend методе и прочитать в документации
  //рендер отдельно сообщений чатов сапорта и группы 
  //история загрузки
  //проверить отправляется ли сообщение у пользователя без аватарки - зарегать нового

  //* ************* *//
  const dispatch = useDispatch()
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [serviceMsgId, setServiceMsgId] = useState(null);

  const userState = useSelector(state => state.user)
  const userProfile = userState.user
  const usersInfo = userState.usersInfo
  const socketErr = userState.socketErr
  const fileUploadStatus = userState.fileUploadStatus
  const fileUploadData = userState.fileUploadData
  console.log('usersInfo 35 line', usersInfo);

  useEffect(()=> {
    usersInfo
    console.log('users Effect, before ');
    // setUsers(usersInfo)
    console.log('users Effect, after ');
  }, [usersInfo])
  
  const groupInfo = useSelector(state => state.user.groupInfo)
  //console.log('groupInfo', groupInfo);

  const upperSocket = useSelector(state => state.user.socket)
  //console.log(`Logged in state in ChatScreen:\n`, upperSocket, `\n`);

  const getAvatar = (arr, id) => {
    // console.log('arr line 48', arr);
    let ava = null
    arr.forEach((arrItem, index)=>{
      //if ( index < 20) console.log('arrItem', arrItem);
      let currId = arrItem.au_id == id
      // console.log('currId', currId);
      if(currId == true && arrItem.au_status) {
        return
      }
      if(currId == true && arrItem.p_img_ava !== null) {
        ava = arrItem.p_img_ava
        // console.log('ava line 60', ava);
      }
    })
    //console.log('ava', ava);
    return ava
  }

  const getHistory = async () => {
    console.log('getHistory start');

    const token = await getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    const response = await fetch('http://dev.arttoursapp.com/api/chat/getChatHistory', requestOptions)
    const data = await response.json()
    console.log('getHistory data 83', data);
    //console.log('getHistory data 84', data.app_user_history.slice(Math.max(data.app_user_history.length - 10, 0)));
    
    
    // console.log('app_user_history - ARRAY LENGTH BEFORRE SENDING TO STORRAGE', data.app_user_history.length);
    const msgHistory = data.app_user_history.filter((item) => {
      //груп чат, юзеры, группе
      if (typeChat === "group" && item.author_type === "app_user"  && item.msg_reciever_type === "group") {
        // console.log('item', item);
        return item
      }
      //админ чат, админ юзеру, юзер админу //item.msg_reciever_type === "app_user" -- только когда админ пишет юзеру в сапорт чате
      if ( (typeChat === "admin" && item.author_type === "admin" && item.msg_reciever_type === "app_user") || (typeChat === "admin" && item.author_id == userProfile.userId && item.msg_reciever_type === "admin") ) {
        // console.log('item', item);
        
        return item
      }
      //груп чат, админ, группе -- объеденить с юзерами
      if (typeChat === "group" && item.author_type === "admin" && item.msg_reciever_type === "group" ) {
        return item
      }
    }).reverse()

    const msg = []
    // console.log('data.recievers', data.recievers);
    msgHistory.forEach((item, index) => {
      // console.log('msgHistory item', item);
      let avaResult = getAvatar(data.recievers, item.author_id)
      // console.log('avaResult 123', avaResult);
      let avatar
      let avaNull
      if(avaResult !== null) {
        // console.log('avaResult 113', avaResult);
        avatar = 'http://dev.arttoursapp.com/uploads/profiles/'+ avaResult
      }
      if(avaResult == null){
        // console.log('avaResult 116', avaResult);
        avatar = undefined
      }
      //подгрузка картинок и видео - наличие по ключу msg_type
      let getMsgTextHist, getMsgImgHist, getMsgVideoHist
      if(item.msg_type == null) {
        getMsgTextHist =  item.message
      } else if (item.msg_type === 'image' || item.msg_type === 'img') {
        getMsgImgHist =  "http://dev.arttoursapp.com/" + item.message
        //console.log('getMsgImgHist', getMsgImgHist);
      } else if (item.msg_type === 'video') {
        getMsgVideoHist =  "http://dev.arttoursapp.com/" + item.message
      }

      const dateMsg = item.msg_timestamp_sent*1000
      //console.log('dateMsg');
      msg.push({
        _id: messageIdGenerator(),
        text: getMsgTextHist,
        createdAt: dateMsg,
        user: {
          _id: item.author_id,
          name: item.author_name,
          avatar: avatar
        },
        image: getMsgImgHist,
        video: getMsgVideoHist
      })
    })
    // console.log('msg', msg);
    storeMessages(msg, 'msgHistory')
  }

  const getConnectSocket = useCallback(async () => {
    
    upperSocket.onmessage = (event) => {
      //console.log("onmessage in ChatScreen line 147, event.data :\n", JSON.parse(event.data))
      //новое сообщение
      //console.log('onmessage usersInfo line 149', usersInfo);
      
      //проверка входа юзеров
      const dataObj = JSON.parse(event.data)
      // console.log('onmessage dataObj ', dataObj);

      let usersInfoUpd = users

      if(dataObj.hasOwnProperty('users')) {
      const curUser = dataObj.users.find(item => item.c_user_id == userProfile.userId)
      // group_users
      if(curUser.inGroup !== null) {
        //когда заходит новый пользовалель то не добавляется в масиив юзеров - проверить
        console.log('before dispatch USERS_INFO');
        dispatch({
          type: USERS_INFO,
          payload: dataObj.users
        })}
        dataObj.users.forEach((item) => {
          // console.log('item 1', item);
            if(usersInfoUpd.find(elem => elem.userId == item.c_user_profile.c_user_id)) {
              // console.log('item 2',item);
              return
            }
          let avaUpdUsInf = null
          if(item.c_user_profile.p_img_ava !== null) {
            avaUpdUsInf = `http://dev.arttoursapp.com/uploads/profiles/`+ item.c_user_profile.p_img_ava
          }
          usersInfoUpd.push({
            userId: item.c_user_id,
            userName: item.c_name,
            userAva: avaUpdUsInf
          })
          // console.log('onmessage usersInfoUpd line 00', usersInfoUpd);
        })
      }
      setUsers(usersInfoUpd)
      
      // console.log('onmessage usersInfoUpd line 000', usersInfoUpd.length);
      let getUserInfo
      if(usersInfoUpd.length == 0) {
        getUserInfo = usersInfo
        // console.log('onmessage getUserIngo a ', getUserInfo);
      } else {
        getUserInfo = usersInfoUpd
        // console.log('onmessage getUserInfo b', getUserInfo);
        
      }
      // console.log('onmessage usersInfoUpd line 1', usersInfoUpd);
      // console.log('onmessage users line 2', users);
      // console.log('onmessage getUserInfo abc', getUserInfo);
      getMessage(event.data, getUserInfo);
    }
    upperSocket.onerror = (e) => console.log('onerror e.message \n', e.message);
    upperSocket.onclose = (e) => {
      console.log("onclose code:\n", e.code, "onclose reason:\n", e.reason, 'e \n', e);
    };
  }, []);
  // console.log('onmessage usersInfo line 199', usersInfo);
  // console.log('onmessage users line 200', users);

  
  const getMessage = (data, usersInfoArr) => {
    const obj = JSON.parse(data)
    //console.log('getMessage data - users array line 176 \n', usersInfoArr)

    if (obj.hasOwnProperty("message")) {
      const avaResult = usersInfoArr.find(item => item.userId == obj.author_id )
      // console.log('avaResult line 183', avaResult);
      
      let avaNewMsg
      if(avaResult !== null && avaResult !== undefined) {
        if(avaResult.userAva !== null) {
          avaNewMsg = avaResult.userAva
        }
      }
      
      let getMsgText, getMsgImg, getMsgVideo
      if(obj.msg_type == undefined) {
        getMsgText =  obj.message
      } else if (obj.msg_type === 'img') {
        getMsgImg =  "http://dev.arttoursapp.com/" + obj.message
        //console.log('getMsgImg', getMsgImg);
      } else if (obj.msg_type === 'video') {
        getMsgVideo =  "http://dev.arttoursapp.com/" + obj.message  
      }
      
      const newMsg = {
        _id: messageIdGenerator(),
        text: getMsgText,
        createdAt: obj.msg_time_sent.date,
        user: {
          _id: obj.author_id,
          name: obj.author_name,
          avatar: avaNewMsg
        },
        image: getMsgImg,
        video: getMsgVideo,
      }
      //console.log('newMsg полученное сообщение, \n', newMsg);
      
      if (typeChat === "group" && obj.author_type === "app_user" && obj.msg_reciever_type === "group") {
        storeMessages(newMsg, 'newMsg')
      } else if (typeChat === "group" && obj.author_type === "admin" && obj.msg_reciever_type === "group") {
        storeMessages(newMsg, 'newMsg')
      } else if (typeChat === "admin" && obj.author_type === "admin" && obj.msg_reciever_type === "app_user") {
        storeMessages(newMsg, 'newMsg')
      }
    }
  }

  const storeMessages = (newMessages, action = '') => {
    if (action === 'newMsg') setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages))
    else if (action === 'msgHistory') setMessages((previousMessages) => GiftedChat.append([], newMessages))
  }

  useEffect(() => {
    getConnectSocket()
  }, []);

  useEffect(() => {
    getHistory()
    // return () => 
  },[])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  
// ---------------------------------------------------chat---------------------------------------------//
 
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#EBEDF0'
          },
          right: {
            backgroundColor: '#CCE4FF'
          }
        }}
        textStyle={{
          right: {
            color: '#000'
          }
        }}
        containerStyle={{
          backgroundColor: '#fff'
        }}
        timeTextStyle={{
          right: {
            color: '#798999'
          },
          left: {
            color: '#798999'
          }
          
        }}
      />
    )
  }
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        { ... props}
        containerStyle={{backgroundColor: 'red',   }}
        primaryStyle={{backgroundColor: '#fff', paddingVertical: 10 }}
        //paddingHorizontal: '10%', paddingVertical: 5, marginHorizontal: 10 position: 'absolute', left: '-17%', bottom: 4, zIndex: 99
        >    
      </InputToolbar>
      
    )
  }
  const renderActions  = (props) => {
    return (
      <Actions 
        { ... props}
        containerStyle={{marginRight: 5 }}
        icon={()=> (<Image source={require('../../assets/Icons/Frame.png')} style={{width: 34, height: 34,}}/>) }
        // options={{
        //   ['Send Image']: pickImage,
        // }}
        // onPressActionButton={()=> pickImage()}
        //onSend={args => console.log('asd')}
        />
    )
  }
  const renderComposer  = (props) => {
    return (
      <Composer 
        { ... props}
        textInputStyle={styles.input}
        // iconTextStyle={{backgroundColor: 'blue',  marginLeft: 0, paddingLeft: 0 }}
        // wrapperStyle={{backgroundColor: 'purple', marginLeft: 0, paddingLeft: 0 }}
        >
      </Composer>
    )
  }
  const renderSend = (props) => {
    // console.log('PROPS in renderSend',props);
    return (
      <Send {...props}
        containerStyle={{paddingBottom: 5, paddingRight: 5 }}
      >
        <View>
          <Image source={require('../../assets/Icons/Vector.png')} style={{width: 34, height: 34, }}/>
        </View>
      </Send>
    )
  }

  const pickImage = async (messages = []) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (res.cancelled) return
    
    dispatch(sendFileToServer({res: res, author_id: userProfile.userId}))
    const id = messageIdGenerator()
    setServiceMsgId(id)
    setMessages(previousMessages => GiftedChat.append(previousMessages, {
      _id: id,
      createdAt: new Date(),
      text: "upload in progress",
      user:{
        _id: userProfile.userId,
        name: userProfile.userName,
        avatar: userProfile.userAva,
      },
    }))
  };

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View style={{ width: 250, height: 250, padding: 3}}>
         <Video
          resizeMode="contain"
          useNativeControls
          shouldPlay={false}
          source={{ uri: currentMessage.video }}
          style={[styles.video, {width: 250, height: 250}]}
        />
      </View>
    );
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    //console.log('onSend messages \n', messages)

    try {
      const msgSent = messages[0].text 
      const reciever_id = typeChat === 'group' ? groupInfo.g_id : 1  //1 админ или id группы g_id
      const recieverType = typeChat === 'group' ? 'group' : 'admin'
      const timeSent = Date.now()
      const consttimeFormated = new Date().toISOString().split('T')[0]
   
      const msgObj = {
        "msg": msgSent,
        "msg_reciever_id": reciever_id,
        "msg_reciever_type": recieverType,
        "msg_timestamp_sent": timeSent,
        "msg_time_sent": consttimeFormated
      }
    
      upperSocket.send(JSON.stringify(msgObj))
      console.log('socket.send');
    } catch (error) {
      console.log(error);
    }

  }, [])

  useEffect(()=> {
    switch (fileUploadStatus) {
      case 'standby':
        break;
      case 'uploaded':
        dispatch(updateFileUploadStatus({newStatus: 'standby', result: null}))
        if ( fileUploadData === null ) return alert('Error. Please reload App.')
        let msgObj = {
          _id: messageIdGenerator(),
          createdAt: new Date(),
          user:{
            _id: userProfile.userId,
            name: userProfile.userName,
            avatar: userProfile.userAva,
          },
        }
        msgObj[fileUploadData.type] = "http://dev.arttoursapp.com/" + fileUploadData.path
        console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 530 ChatScreen useEffect fileUploadStatus ', msgObj,fileUploadData)
        if ( serviceMsgId !== null ) setMessages(previousMessages => previousMessages.filter(message => message._id !== serviceMsgId))
        setServiceMsgId(null)
        setMessages(previousMessages => GiftedChat.append(previousMessages, msgObj))

        const consttimeFormated = new Date().toISOString().split('T')[0]
        upperSocket.send(JSON.stringify({
          fileUploaded: true,
          name: fileUploadData.path,
          type: fileUploadData.type,
          path: fileUploadData.path,
          msg_reciever_id: typeChat === 'group' ? groupInfo.g_id : 1,  //1 админ или id группы g_id
          msg_timestamp_sent: Date.now(),
          msg_time_sent: consttimeFormated,
          msg_type: fileUploadData.type,
          msg_reciever_type: typeChat === 'group' ? 'group' : 'admin'
        }))
        break;
      case 'error':
        dispatch(updateFileUploadStatus({newStatus: 'standby', result: null}))
        if ( serviceMsgId !== null ) setMessages(previousMessages => previousMessages.filter(message => message._id !== serviceMsgId))
        setServiceMsgId(null)
        console.log('\n\x1b[47m\x1b\x1b[31m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'ERROR', ' 549 ChatScreen ', 'useEffect fileUploadStatus', fileUploadData)
        alert('Error. File upload failed.')
        break;
    }
  }, [fileUploadStatus, fileUploadData, serviceMsgId])

  useEffect(()=> {
    if ( socketErr ) dispatch(openSocket())
    if ( upperSocket !== null && upperSocket.readyState === 3 ) dispatch(openSocket())
    console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 558 ChatScreen WEBSOCKET readyState ', upperSocket.readyState)
  }, [socketErr, upperSocket])
  
  return (
    <GiftedChat
      renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff" />}
      messages={messages}
      onSend={messages => onSend(messages)}
      onPressActionButton={(messages)=> pickImage(messages)}
      user={{
        _id: userProfile.userId,
        name: userProfile.userName,
        avatar: userProfile.userAva,
      }}
      placeholder='Start typing...'
      renderBubble={renderBubble}
      alwaysShowSend
      renderActions ={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
      renderUsernameOnMessage={true}
      messagesContainerStyle={{backgroundColor: '#fff', paddingBottom: 20}}
      renderMessageVideo={renderMessageVideo}
      keyboardShouldPersistTaps='never'
      // showAvatarForEveryMessage={true}
    />
  )
}

const styles = StyleSheet.create({
  viewText: {
    flex: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  input: {
    backgroundColor: '#F2F3F5',
    borderColor: '#E1E3E6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  video: {
    position: 'absolute',
    left: 0,
    top: 0,
    // width: 150,
    // height: 100,
    borderRadius: 13,
  }
})
