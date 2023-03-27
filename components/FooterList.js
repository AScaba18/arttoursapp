import React from 'react'
import { StyleSheet, Text, View, Image, StatusBar, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import { THEME } from '../theme';


export const FooterList = () => {
  const groupInfo = useSelector(state => state.user.groupInfo)

  const _handlePressEmergency = () => {
    //const tel = 'tel:911'
    Linking.openURL(`tel:${groupInfo.g_emergency_phone}`);
    //props.onPress && props.onPress();
  }
  return (
    <View style={styles.inner}>
      <View style={styles.emergencyBox}>
        <Text style={styles.emergency}>Emergency number:</Text>
        <Text style={styles.textEmergency}>{groupInfo.g_emergency_phone}</Text>
      </View>
      <TouchableOpacity style={styles.btnCall} onPress={() => {_handlePressEmergency()}}>
        <Text style={styles.btnTextCall}>Call</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  inner: {  
    backgroundColor: '#fff',
    paddingBottom: 20,
    alignItems: 'center',
  },
  emergencyBox: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  emergency: {
    justifyContent: 'center',
    fontFamily: 'sf-display-bold',
    fontSize: 18,
    lineHeight: 24,
  },
  textEmergency: {
    color: '#6d7885',
    paddingVertical: 10,
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  btnCall: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
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
