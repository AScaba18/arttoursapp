import React, { useEffect, useState, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput, StatusBar, Modal, Alert, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import { onLogOut } from '../store/actions/auth'
import { PostsList } from '../components/PostsList';
import { Weather } from '../components/Weather';
import { Zmanim } from '../components/Zmanim';
import { THEME } from '../theme'

export const WidgetsScreen = ({navigation}) => {
  
  const dispatch = useDispatch()
  const [ valueCurrency, setValueCurrency] = useState('');
  const [ valueFirst, setValueFirst] = useState('ILS');
  const [ valueSecond, setValueSecond] = useState('USD');
  const [ convValue, setConvValue] = useState();

  const groupInfo = useSelector(state => state.user.groupInfo)
  //console.log('groupInfo', groupInfo)

  const [title, setTitle] = useState(' ');

    useLayoutEffect(() => {
      if(groupInfo !== null) {
        setTitle(groupInfo.g_name)
        
      } else {
        setTitle(' ')
      }
        navigation.setOptions({
          title: title !== ' ' ? title : ' ',
        });
      
  }, [title, groupInfo]);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(false);
  
  const inGroup = useSelector(state=>state.user.inGroup)
  
  useEffect(() => {
    if(!inGroup) {
      setModalVisible(true)
      setLoadingGroup(true)
    } else if (inGroup) {
      setModalVisible(false)
      setLoadingGroup(false)
    }

  },[inGroup])

  //выход
  const logOutHandler =  () => {
    console.log('logOutHandler')
    dispatch(onLogOut())
  }
  useEffect(() => {
    logOutHandler
  }, [])


  //Rss post
  const rssPost = useSelector(state => state.widgets.rssPost)
  // console.log('rssPost WS', rssPost);
  
  //convert
  const currency = useSelector(state => state.widgets.currency)
  //console.log('currency WS', currency);

  const getCurrConvercy = (valF, valS, valCur, curr) => {

    const inputValue = valCur
    // console.log('inputValue', inputValue);
    const currObj = curr
    // console.log('currObj', currObj);
    const exchCurr = valF + '_' + valS

    for (let key in currObj) {
      if(key == exchCurr) {
        //console.log('key', key);
        setConvValue((inputValue*currObj[key]).toFixed(3))
        //console.log(currObj[key]*inputValue);
      } 
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={THEME.MAIN_COLOR} barStyle='light-content' />
      {groupInfo == null ? null : <Image source={{uri: groupInfo.g_img}} style={styles.img}/>}
      <View style={styles.inner}>
      
        <View style={styles.section}>
          {
          groupInfo == null ? null 
          : <>
              <Text style={[styles.header, {paddingBottom: 10, paddingTop: 24}]}>{groupInfo.g_name}</Text>
              <Text style={styles.header}>Trip dates: <Text style={styles.text}>{groupInfo.g_tour_dates}</Text></Text>
            </>
          }
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.header, styles.widgetHeader]}>Weather</Text>
          <View style={styles.separator}>
            <Weather />
            </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.header, styles.widgetHeader]}>Currency converter</Text>
          <View style={styles.separator}>
            <View style={[styles.row]}>
              <View style={{width: '30%', height: 40}}>
                <Picker
                  selectedValue={valueFirst}
                  onValueChange={(itemValue, itemIndex) =>
                    setValueFirst(itemValue)
                  }>
                  <Picker.Item label="USD" value="USD" />
                  <Picker.Item label="EUR" value="EUR" />
                  <Picker.Item label="ILS" value="ILS" />
                </Picker>
              </View>
              <View style={{width: '70%'}}>
                  <TextInput style={styles.convInput} keyboardType='numeric' value={valueCurrency} onChangeText={(valueCurrency)=> {setValueCurrency(valueCurrency)}}/>
              </View>
            </View>
            <View style={styles.row}>
              <View style={{width: '30%', height: 40}}>
                <Picker
                  selectedValue={valueSecond}
                  onValueChange={(itemValue, itemIndex) =>
                    setValueSecond(itemValue)
                  }>
                  <Picker.Item label="ILS" value="ILS" />
                  <Picker.Item label="USD" value="USD" />
                  <Picker.Item label="EUR" value="EUR" />
                </Picker>
              </View> 
              {convValue == null ? <Text style={{fontSize: 18, paddingLeft: 10}}>0.00</Text> : <Text style={{fontSize: 18, paddingLeft: 10}}>{convValue}</Text>}
            </View>

            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <TouchableOpacity style={[styles.buttonV, {backgroundColor: THEME.MAIN_COLOR}]} onPress={()=>{getCurrConvercy(valueFirst, valueSecond, valueCurrency, currency)}}>
                <Text style={styles.button}>Convert</Text>
              </TouchableOpacity>
            </View>
              
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.header, styles.widgetHeader]}>Zmanim</Text>
          <View style={styles.separator}>
            <Zmanim />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.header, styles.widgetHeader]}>Log out</Text>
          <View style={styles.separator}>
            <TouchableOpacity style={styles.buttonV} onPress={()=>{logOutHandler()}}>
              <Text style={styles.button}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.header, styles.widgetHeader]}>The Jerusalem Post</Text>
          <View style={styles.separator}> 
             {rssPost == null || rssPost.length == 0 ? <ActivityIndicator size={'small'} color={THEME.MAIN_COLOR}/> : <PostsList />}
          </View>
        </View>

      </View> 
      {loadingGroup == false ? null
      :<Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <Pressable
              style={styles.modalView}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalText}>Some app features are not available until you are added to a group</Text>
            </Pressable>
          </View>
        </Modal>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    paddingHorizontal: 15,
  },
  section: {
    paddingVertical: 10,
  },
  header: {
    fontFamily: 'sf-text-medium',
    fontSize: 18,
    lineHeight: 22,
    paddingBottom: 5,
  },
  widgetHeader: {
    color: '#123c96',
  },
  text: {
    fontFamily: 'sf-text-regular',
    fontSize: 18,
    lineHeight: 22,
  },
  buttonV: {
    width: 150,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#f4434f',
    borderRadius: 30,
    marginVertical: 20
  },
  button: {  
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: '#fff',
  },
  img: {
    width: '100%',
    height: 200
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 5,
    alignItems: 'center',
  },
  separator: {
    paddingVertical: 20,
    borderBottomColor: '#d8d8d8',
    borderTopColor: '#d8d8d8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 15
  },
  convInput: {
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8c8b8b',
    borderRadius: 3,
    paddingLeft: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: '30%',
    backgroundColor: "white",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    padding: 35,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontFamily: 'sf-display-regular',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  }
})