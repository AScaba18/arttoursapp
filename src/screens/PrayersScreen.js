import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, StatusBar, } from 'react-native';
import { THEME } from '../theme';
import * as Linking from 'expo-linking';

export const PrayersScreen = ({navigation}) => {


  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={THEME.MAIN_COLOR} barStyle='light-content' />
      <View style={styles.inner}>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr1.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Shaharit</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Morning Prayers</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Weekday_Shacharit%2C_Morning_Prayer?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr2.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Mincha</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Afternoon prayer</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Weekday_Mincha%2C_Korbanot?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr3.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Arbit</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Evening prayer</Text>
              <Text style={styles.text}>Morning Prayers</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Weekday_Maariv%2C_The_Shema?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr4.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Birkat Hamazon</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Prayer after meal</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Birchat_HaMazon%2C_Birchat_HaMazon?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr5.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Shema Al Hamita</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Prayer before bedtime</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Bedtime_Shema?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr6.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Havdalah</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Prayer for Saturday Night</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Motzaei_Shabbat_%2C_Havdala?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr7.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Tehilim</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>The book of psalms</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Psalms.1?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr8.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Prayer for Lost Object</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Lost object prayer</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('http://www.shemayisrael.com/orgs/key/PrayerForLostObject.jpg')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr9.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Tefilat Haderech</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Prayer for the way</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://letsbench.com/wp-content/uploads/2019/02/Tefilat-Haderech-1.jpg')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr10.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Tefilah of Rabeinu Tam</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Siddur Sefarad</Text>
              <Text style={styles.text}>Prayer from Rabeinu Tam</Text>
            </View>
            
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Siddur_Sefard%2C_Various_Prayers_%26_Segulot%2C_Awesome_Prayer_of_Rabbeinu_Tam?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Image style={styles.img} source={require('../../assets/pr11.png')}/>
          <View style={styles.infoCard}>
            <Text style={styles.titleCard}>Weekly Torah Portion</Text>
            <View style={styles.subTitleCard}>
              <Text style={styles.text}>Torah for the week</Text>
            </View>
            <View style={styles.buttonCard}>
              <Text style={styles.buttonText} onPress={()=>{Linking.openURL('https://www.sefaria.org/Genesis?lang=bi')}}>Open</Text>
            </View>
          </View>
        </View>
      </View>

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
    paddingTop: 35
  },
  card: {
    justifyContent: 'center',
    marginBottom: 16
  },
  img: {
     width: '100%',
     height: 120,
     borderRadius: 10
   },
  infoCard: {
    position: 'absolute',
    flex: 1,
    paddingHorizontal: 16,
    
  },
  titleCard: {
    fontFamily: 'sf-display-semibold',
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    paddingBottom: 3
  },
  subTitleCard: {
    color: '#fff',
    paddingBottom: 5
  },
  buttonCard: {
    flex: 1,
    width: 67,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center'
  },
  buttonText: {
    fontFamily: 'sf-text-medium',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: '#000'
  },
  text: {
    fontFamily: 'sf-display-regular',
    fontSize: 13,
    lineHeight: 16,
    color: '#dbdbdb',
  }, 
 
});