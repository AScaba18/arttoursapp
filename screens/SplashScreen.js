import React from 'react'
import { StyleSheet, Image, View, StatusBar} from 'react-native';

import ButtonMain from '../components/ButtonMain'
import ButtonSecond from '../components/ButtonSecond'

export const SplashScreen = ({navigation}) => {

  const signUpHandler = () => {
    return navigation.navigate('Auth', {screen: 'Create profile'})
  }
  const logInHandler = () => {
    return navigation.navigate('Auth', {screen: 'Log in'})
  }
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle='dark-content'/>
      <View style={styles.boxImg}>
        <Image source={require('../../assets/Logo.png')} style={styles.img}/>
      </View>
      <View style={styles.boxButton}>
        <View style={styles.button}>
          <ButtonSecond label='log in' onPress={logInHandler}/>
        </View>
        <View style={styles.button}>
          <ButtonMain label='sign up' onPress={signUpHandler}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  boxImg: {
    flex: 2.8,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  boxButton: {
    flex: 1,
  },
  img: {
    //width: '100%',
    height: 211,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8
  },
});
