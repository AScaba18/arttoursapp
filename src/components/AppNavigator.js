import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux'


import  { TabNavigator }  from '../screens/TabNavigator'
import { ProfileScreen } from '../screens/ProfileScreen'
import { SplashScreen } from '../screens/SplashScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { autologin, openSocket } from '../store/actions/auth'
import { getWeather } from '../store/actions/widgets'
import { getRss } from '../store/actions/widgets'
import { getPrayersTime } from '../store/actions/widgets'
import { getFetchCurr } from '../store/actions/widgets'
import { setCurr } from '../store/actions/widgets'
import { getCurrency } from '../util/currency'
import { getWidgetTime } from '../util/widgetTime'
import { THEME } from '../theme';
import { Entypo } from '@expo/vector-icons'

const Stack = createStackNavigator()

const Auth = createStackNavigator()

const LoginScreenStack = ({navigation}) => {
  return (
  <Auth.Navigator>
    <Auth.Screen name='Log in' component={LoginScreen} options={{
      headerShown: false
    }}/>
    <Auth.Screen name='Create profile' component={ProfileScreen} options={{
      headerStyle: {
        backgroundColor: THEME.MAIN_COLOR,
        elevation: 5,
        // shadowOpacity: 0,
        // shadowColor: 'black',
        // shadowOpacity: 0.9,
        // shadowOffset: { width: 0, height: 2},
        // shadowRadius: 10,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Entypo name='chevron-thin-left' color={'#fff'} size={24} style={{paddingHorizontal: 10}} onPress={() => navigation.pop()}/>
      ),
      //headerStatusBarHeight: 110
    }}/>
  </Auth.Navigator>
  )
}

export const AppNavigator = () => {
  console.log('\x1b[32m%s\x1b[0m', '\n---------- APP START ----------');

  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const {isLogged,user,usersInfo,loginError,socketsocket,inGroup,groupInfo,groupItiner,hotelInfo,isLoading,socketErr} = state.user
  const {prayersTime} = state.widgets
  console.log(`\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[${isLogged?'32':'31'}m%s\x1b[0m\x1b[37m%s\x1b\n`, 'INFO', ' 62 AppNavigator ', 'isLogged: ', isLogged, '\n')

  useEffect(()=> {
    dispatch(autologin())

    const checkCurrency = async() => {
      console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 68 AppNavigator ', 'checkCurrency start')
  
      const objCurr = await getCurrency()
      if (objCurr == null) return dispatch(getFetchCurr({error: 'objCurr null go getFetchCurr'}))
      
      Date.now() >= objCurr.time ? dispatch(getFetchCurr()) : dispatch(setCurr())
    }

    const checkWidgetsTime = async() => {
      console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 77 AppNavigator ', 'checkWidgetsTime start')
  
      const objTime = await getWidgetTime()
      if (objTime == null) return dispatch(getWeather({error: 'objTime null go getWeather'}))
  
      Date.now() >= objTime.time ? dispatch(getWeather()) : console.log('checkTimeW < ничего не делаем')
    }

    checkCurrency()
    checkWidgetsTime()
    dispatch(getRss())
  },[])
  useEffect(()=> {
    if ( prayersTime === null ) dispatch(getPrayersTime())
  },[prayersTime])
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          isLogged
            ?
              <Stack.Screen name='Home' component={TabNavigator}/>
            :
              <>
                <Stack.Screen name='Splash' component={SplashScreen}/>
                <Stack.Screen name='Auth' component={LoginScreenStack}/>
              </>
        } 
      </Stack.Navigator>
    </NavigationContainer>
  )
}