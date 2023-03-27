import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import Tooltip from 'rn-tooltip'
import { THEME } from '../theme';

export const HotelInfo = ({item}) => {
  //console.log('HotelInfo');
  const myLocalTooltipRef = useRef(null)

  const copyToClipboard = (address) => {
    Clipboard.setString(address);

    setTimeout(() => {
      myLocalTooltipRef.current.toggleTooltip()
    }, 2000)
    console.log('close');
  };

  useEffect(()=>{
    return () => copyToClipboard
  })

  const _handlePress = () => {
    Linking.openURL(`tel:${item.h_phone}`);
  }

  const groupInfo = useSelector(state => state.user.groupInfo)
  //console.log('groupInfo', groupInfo);
  const address = item.h_address
  const imgUrl = 'http://dev.arttoursapp.com/uploads/hotels/' + item.h_img
  
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.img}
          source={{ uri: imgUrl}}

        />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={[styles.title, styles.mr]}>Hotel:</Text><Text style={styles.title}>{item.h_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textRegular, styles.mr]}>Dates:</Text><Text>{groupInfo.g_tour_dates}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textRegular}>{item.h_address}</Text>
              <TouchableOpacity style={{marginLeft: 5}}>
                <Tooltip
                  ref={myLocalTooltipRef}
                  popover={<Text style={{color: '#fff',}}>Copied</Text>}
                  backgroundColor={THEME.MAIN_COLOR}
                  withOverlay={false}
                  width={80}
                  containerStyle={{marginRight: 20, opacity: 0.9}}
                  withPointer={false}
                  onOpen={()=>{copyToClipboard(address)}}
                  toggleWrapperProps={{activeOpacity: 0.2}}
                >
                  <Image source={require('../../assets/Copy.png')} style={styles.imgCopy} />
                </Tooltip>
              </TouchableOpacity>
          </View>
  
          <View style={[styles.row, styles.tel]}>
            <Text style={[styles.textRegular, styles.mr]}>Reception number:</Text>
            <Text>{item.h_phone}</Text>
          </View>
          <View style={styles.call}>
            <TouchableOpacity
              style={styles.btnCall}
              activeOpacity={0.7}
              onPress={ () => {_handlePress()}}
            >
              <Text style={styles.btnTextCall}>call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {  
    backgroundColor: '#fff',
    flex: 1,
  },
  info: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  img: {
    width: '100%',
    height: 200
  },
  title: {
    fontFamily: 'helvetica',
    fontSize: 24,
    lineHeight: 28,
    paddingVertical: 10,
  },
  tel: {
    paddingBottom: 15
  },
  mr: {
    marginRight: 10
  },
  textRegular: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    flexWrap: 'wrap'
  },
  imgCopy: {
    width: 30,
    height: 30,
  },
  call: {
    width: '60%',
    paddingBottom: 15
  },
  btnCall: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 43,
    borderRadius: 32,
    backgroundColor: THEME.SECOND_COLOR,
  },
  btnTextCall: { 
    fontFamily: 'sf-text-medium',
    fontSize: 14,
    lineHeight: 18,
    color: '#03174C',
    textTransform: 'uppercase'
  },
});