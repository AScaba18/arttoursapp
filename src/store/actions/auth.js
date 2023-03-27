import { clearToken, setUserId, setToken, getToken, getUserId, setUserInfo, getUserInfo } from '../../util/token';
import { setConnectCounter, getConnectCounter } from '../../util/ConnectCounter';
import { userLocation } from '../../util/location';
import { 
  LOGIN_USER,
  LOGOUT_USER, 
  AUTOLOGIN, 
  LOGIN_ERROR, 
  SOCKET_ERROR, 
  CONNECT_SOCKET, 
  COORDS_USER, 
  IN_GROUP, 
  USER_INFO,
  GROUP_INFO, 
  GROUP_ITINERARY,
  USERS_INFO,
  LOGIN_ERROR_RESET,
  UPDATE_FILE_UPLOAD_STATUS
} from '../types'
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';


export const onRegistrationUser = (user) => {
  return async (dispatch) => {
    console.log('user actions/auth', user);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic WlB3Y0diRkdGRmpNWjM0aENNNHI0WEV5QUw4U0NMOjd3UDRqZT1OZVIzJnpKYUp6MyMzNSNiSFo/VUErZ1AtOEVHSGNQVC0=");
      myHeaders.append("Cookie", "ci_session=u2o1mh4fi7nu65tobuqs3tok16j0atlr");
      
      const name = user.firstName + ' ' + user.lastName

      const formdata = new FormData();
      formdata.append("email", user.email);
      formdata.append("password", user.password);
      formdata.append("p_phone", user.mobileNumber);
      formdata.append("scope", "app_pass");
      formdata.append("name", name);

      if(user.img !== null) {
        let localUri = user.img;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formdata.append("p_img_ava", { uri: localUri, name: filename, type })
      }
      
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("http://dev.arttoursapp.com/api/appuser/register", requestOptions)
        .then(response => response.json())
        .then((result) => {
          console.log('REGESTRATION RESULT 1', result)
          if(result.status == 400) {
            dispatch({
              type: LOGIN_ERROR,
              payload: result
             })
            return
          }
          dispatch(onLoginUser({email:result.au_email, password:result.au_pass}))
        })
        .catch(error => console.log('onRegistrationUser error', error))

    } catch (e) {
      console.log('onReg error', e);
    }
  }
}

export const onLoginUser = (user) => {
  //console.log('user actions/auth LOGIN 2', user)

  return async (dispatch) => {
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic WlB3Y0diRkdGRmpNWjM0aENNNHI0WEV5QUw4U0NMOjd3UDRqZT1OZVIzJnpKYUp6MyMzNSNiSFo/VUErZ1AtOEVHSGNQVC0=");
      myHeaders.append("Cookie", "ci_session=qv0mcvd7gip968v4sjual9g8amnqrsk1");

      const formdata = new FormData();
      formdata.append("username", user.email);
      formdata.append("password", user.password);
      formdata.append("grant_type", "password");

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      await fetch("http://dev.arttoursapp.com/api/appuser/login", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(`\n\n\n--- ACTIONS auth onLoginUser ---\nServer response on login:\n`, result, `\n`);

          if(result.access_token) {
            //console.log('result);
            dispatch({
             type: LOGIN_USER,
             payload: result
            })
            // console.log('--------- in login after dispatch LOGIN_USER ---------')
            //setUserInfo(result)
            setToken(result.access_token)
            setUserId(result.app_user.au_id)
            dispatch( openSocket( result.access_token, result.app_user.au_id ) )
          } else {
            dispatch({
              type: LOGIN_ERROR,
              payload: result
             })
             console.log('onLoginUser:\n Ответ сервера: Не зарегистрированный пользователь/не правильный email')
          }
        })
        .catch(error => console.log('actions error', error))
        
    } catch (error) {
      console.log('onLogin error', error);
    }
  }
}

export const autologin = () => {
  console.log('autologin start')
  
  return async (dispatch) => {
    try {
      await SecureStore.getItemAsync('isLogged')
      .then(isLogged => {
        console.log(`\n\n\n--- ACTIONS auth autologin ---\nSecureStore isLogged:`, isLogged, `\n`)
        if (isLogged === "true") {
          dispatch({
            type: AUTOLOGIN
          })
        }
      })
      .catch(error => {
        console.log('\n\n\n--- ACTIONS auth autologin ---\nSecureStore error:', error)
        dispatch({type: LOGOUT_USER})
      })
    } catch(e) {
      console.log('\n\n\n--- ACTIONS auth autologin ---\ntryCatch error:', e, `\n`)    
    }
  }
}

export const onLogOut = () => {

  return async (dispatch) => {
    try {
      //удаляем токен
      await clearToken()
      console.log('logOut');
      dispatch({type: LOGOUT_USER})
    } catch(e) {
      console.log('onLogOut error',e);
      // remove error
    }
  }
}

export const openSocket = ( access_token = null, au_id = null ) => {
  console.log('\n\n\n--- ACTIONS auth openSocket start ---\n')
  
  return async (dispatch) => {
    const token = access_token !== null ? access_token : await getToken();
    let userCords = await userLocation();
    const userId = au_id !== null ? au_id : await getUserId();
    //let reconnectCounter = await getConnectCounter();
    //console.log('userCords', userCords);
    console.log('\n--- ACTIONS auth openSocket ---\nSecureStore token:', token, '\nSecureStore userId:', userId, '\n')

    let socket = new WebSocket( `ws://dev.arttoursapp.com:8092?access_token=${token}` )
    dispatch({
      type: CONNECT_SOCKET,
      payload: socket
    })
    
    socket.onopen = (event) => {
      console.log("onopen:\n", event)

      // Сделать отправку координат+
      socket.send(JSON.stringify(userCords));

    };
    
    socket.onmessage = (event) => {
      //console.log("auth 243, onmessage event.data:\n", JSON.parse(event.data))
       
      const dataObj = JSON.parse(event.data)
      console.log('dataObj 208 line\n', dataObj);
      
      if(dataObj.hasOwnProperty('groupUpdate')) {
        //console.log('dataObj groupUpdate 211\n', dataObj.groupUpdate);
  
        if(dataObj.groupUpdate.hasOwnProperty('group_users')) {
          //console.log('dataObj.groupUpdate.group_users 2014\n', dataObj.groupUpdate.group_users);
          const addedUser = dataObj.groupUpdate.group_users.find(item => item.au_id == userId)
          //console.log('userId 216', userId);
          console.log('addedUser 217 \n', addedUser);
  
          if(addedUser === undefined) {
            dispatch({
              type: IN_GROUP,
              payload: dataObj.groupUpdate.group_users
            })
          }
          //если идет реконект к сокету то не нужно добавлять инфу
          // dispatch({
          //   type: GROUP_INFO,
          //   payload: dataObj.groupUpdate
          // })
          // dispatch({
          //   type: GROUP_ITINERARY,
          //   payload: dataObj.groupUpdate.itineraries
          // })
        }
      }
      
      if (dataObj.users) {
        const curUser = dataObj.users.find(item => item.c_user_id == userId)
        console.log('curUser \n', curUser);

        if(curUser.hasOwnProperty('inGroup')) {
          if(curUser.inGroup !== null) {
            console.log('dataObj hasOwnProperty inGroup !==null');

            //инфо по группе и расписание
            dispatch({
              type: GROUP_ITINERARY,
              payload: curUser.inGroup
            })
            dispatch({
              type: GROUP_INFO,
              payload: curUser.inGroup
            })
            //инфо по всем юзерам(для аватарки в чате)
            dispatch({
              type: USERS_INFO,
              payload: dataObj.users
            })
          }

          if(curUser.inGroup == null) {
            console.log('dataObj hasOwnProperty inGroup null');
            dispatch({
              type: IN_GROUP,
              payload: curUser.inGroup
            })
          }
        }

      }
    };
    socket.onerror = (event) => {
      console.log('tab dispatch auth - 294 - onerror e.message \n', event)
      //для реконекта сокета
      // let countConnect
      // setConnectCounter(countConnect)
      //getConnectCounter
      // reconnectCounter++
    }
    socket.onclose = (socket, ev) => {
      console.log("tab dispatch auth - 297\nonclose code:\n", ev, "\nonclose reason:\n", socket, "\nonclose e:\n")
      dispatch({
        type: SOCKET_ERROR
      })
      // if (reconnectCounter < 10) {
      //   console.log('try to reconnect: ' + reconnectCounter++);
      //   // send reconnectCounter++ somewhere
      //   openSocket()
      // }
    }
  }
}

export const resetErr = () => {
  return  (dispatch) => {
    dispatch({type: LOGIN_ERROR_RESET})
  }
}

export const updateFileUploadStatus = (data) => {
  const {newStatus} = data
  return  (dispatch) => {
    dispatch({ type: UPDATE_FILE_UPLOAD_STATUS, payload: {newStatus: newStatus} })
  }
}

export const sendFileToServer = (data) => {
  console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'DEBUG', ' 292 ACTIONS ', 'sendFileToServer', data)
  const {res,author_id} = data
  return async (dispatch) => {
    try {
      const token = await getToken();
  
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Cookie", "ci_session=u2o1mh4fi7nu65tobuqs3tok16j0atlr");
  
      const formdata = new FormData();
      const filename = res.uri.split('/').pop();
      const fileInfo = await FileSystem.getInfoAsync(res.uri)
      const match = /\.(\w+)$/.exec(filename);
      const type = fileInfo.type === 'image' ? `image/${match[1]}` : `video/${match[1]}`;

  
      formdata.append("file_name", filename);
      formdata.append("author_id", author_id);
      formdata.append("name", 'name');
      formdata.append("app_user_file", { uri: res.uri, name: filename, type: type })
      console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'DEBUG', ' 316 ACTIONS ', 'sendFileToServer fileInfo: ', formdata)
    
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
  
      await fetch('http://dev.arttoursapp.com/api/chat/sendfile', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'DEBUG', ' 334 ACTIONS ', 'sendFileToServer', result)
        if ( result.hasOwnProperty('status') && result.status ) dispatch({ type: UPDATE_FILE_UPLOAD_STATUS, payload: {newStatus: 'uploaded', result: {...result, type: res.type}} })
        else dispatch({ type: UPDATE_FILE_UPLOAD_STATUS, payload: {newStatus: 'error', result: result} })
      })
      .catch(error => {
        console.log('\n\x1b[47m\x1b\x1b[31m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'ERROR', ' 339 ACTIONS ', 'sendFileToServer', error)
        dispatch({ type: UPDATE_FILE_UPLOAD_STATUS, payload: {newStatus: 'error', result: error} })
      })
    } catch (error) {
      console.log('\n\x1b[47m\x1b\x1b[31m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'ERROR', ' 339 ACTIONS ', 'sendFileToServer', error)
      dispatch({ type: UPDATE_FILE_UPLOAD_STATUS, payload: {newStatus: 'error', result: error} })
    }
  }
}