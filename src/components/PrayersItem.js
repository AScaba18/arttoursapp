import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, StatusBar } from 'react-native';
import { SIZE, THEME } from '../theme';
import * as Linking from 'expo-linking';

// не используется 
// как в require передать ссылку? - в закладках есть ответ
export const PrayersItem = ({ item, onPress }) => {

  return (
    <View style={styles.card}>
    {/* <Image style={styles.img} source={require(item.img)}/> */}
    <View style={styles.infoCard}>
      <Text style={styles.titleCard}>{item.title}</Text>
      <View style={styles.subTitleCard}>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.text}>{item.timePr}</Text>
      </View>
      <View style={styles.buttonCard}>
        <Text style={styles.buttonText} onPress={()=>{onPress}}>Open</Text>
      </View>
    </View>
  </View>
  );
}