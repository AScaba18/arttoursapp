import React from 'react'
import { TouchableOpacity, Text, View, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export const ChatRoomsScreen = ({navigation, route}) => {
  console.log('ChatRoomsScreen', route);

  const groupInfo = useSelector(state => state.user.groupInfo)
  const nameTitle = groupInfo !== null ? groupInfo.g_name : 'Chat'
  
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.imgC}>
            {groupInfo == null ? null : <Image style={styles.imgI} source={{uri: groupInfo.g_img}}/>}
        </View>
        <View style={styles.inner}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChatItem', {nameTitle: 'Support', type: 'admin'})}>
            <View style={styles.imgWrap}>
              <View style={styles.img}></View>
              {/* <Image source={{uri: 'https://dev.by/storage/images/32/28/56/48/derived/cf7b1b5b433f4285fefa641f47d8f293.jpg'}} style={styles.img}/> */}
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Support</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator}>
          </View>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChatItem', {nameTitle: nameTitle, type: 'group' })}>
            <View style={styles.imgWrap}>
              <View style={styles.img}></View>
              {/* <Image source={{uri: 'https://dev.by/storage/images/32/28/56/48/derived/cf7b1b5b433f4285fefa641f47d8f293.jpg'}} style={styles.img}/> */}
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{nameTitle}</Text>
            </View>
          </TouchableOpacity>
        </View> 
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    flex: 1,
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  imgI: {
    width: '100%',
    height: 200,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '10%',
    //backgroundColor: 'pink'
  },
  contentContainer: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontFamily: 'sf-text-medium',
    fontSize: 18,
    lineHeight: 22,
    paddingRight: 10
  },
  newMsg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2329d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numMsg: {
    color: '#fff'
  },
  info: {
    width: '70%',
  },
  lastMsg: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
    color: '#6D7885',
  },
  imgWrap: {
    width: '25%',
    //paddingRight: 15,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  img: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: '#91aaf3'
  },
})
