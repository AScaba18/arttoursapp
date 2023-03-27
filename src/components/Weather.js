import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { THEME } from '../theme'

export const Weather = () => {
  const weatherData = useSelector(state => state.widgets.weatherInfo)


  return (
    <View>
        {weatherData == null ? <ActivityIndicator size={'small'} color={THEME.MAIN_COLOR}/> 
        : (
          <View>
            <View style={styles.row}>
              <View style={[styles.row, {paddingBottom: 0, marginRight: 20}]}>
                <Text style={styles.tempTitle}>t{'\u00b0'}</Text>
                <Text style={styles.temp}>{weatherData.temp},</Text>
              </View>
              <View style={[styles.row, {paddingBottom: 0}]}>
                <Image source={{uri: `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}} style={styles.imgIcon}/>
                <Text style={[styles.curWeath, styles.text]}>{weatherData.curWeath}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={[styles.curWeath, styles.text, {color: '#81858d'}]}>{weatherData.country},</Text>
              <Text style={[styles.nameCity, styles.text, {color: '#81858d'}]}>{weatherData.name}</Text>
            </View>
          </View>
          )
        }
    </View> 
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'sf-text-regular',
    fontSize: 18,
    lineHeight: 22,
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
  //weather
  imgIcon: {
    width: 50,
    height: 50
  },
  tempTitle: {
    color: '#5a5d62',
    fontFamily: 'sf-text-regular',
    fontSize: 24,
    lineHeight: 28,
    //backgroundColor: 'red'
  },
  temp: {
    //backgroundColor: 'green',
    color: '#5a5d62',
    fontFamily: 'helvetica',
    fontSize: 24,
    lineHeight: 28,
    marginLeft: 5,
    paddingTop: 5
  },
  nameCity: {
    //backgroundColor: 'red',
    paddingLeft: 10,
  },
  dev: {
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 10,
    color: '#5a5a5a'
  },
  devT: {
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 2,
  },
})