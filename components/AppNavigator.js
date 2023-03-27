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
  console.log('\n---------- AppNavigator start render ----------\n');

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(autologin())  
  },[])
  
  const checkCurrency = async() => {
    console.log('checkCurrency start');

    const objCurr = await getCurrency()
    //console.log('1objCurr', objCurr);
    
    if (objCurr == null) {
      console.log('objCurr null go getFetchCurr', objCurr);
      dispatch(getFetchCurr())
      return
    }

    let checkTime = Date.now()
    // console.log('2checkTime', checkTime);

    //если дата сейчас больше либо равно дате запроса курса + 24ч, то выполнить запрос на курсы

    if( checkTime >= objCurr.time ) {
      console.log('checkTime> go getFetchCurr')
      dispatch(getFetchCurr())
    } else if(checkTime <= objCurr.time) {
      console.log('checkTime< go setCurr')
      //если меньше то доставать из сториджа объект и класть в редакс стейт
      dispatch(setCurr())
    }
  }

  useEffect(()=> {
    checkCurrency()
  },[])

  const checkWidgetsTime = async() => {
    console.log('checkWidgetsTime start');

    const objTime = await getWidgetTime()
    // console.log('objTime', objTime);
    if (objTime == null) {
      console.log('objTime null go getWeather', objTime);
      dispatch(getWeather())
      return
    }
    let checkTimeW = Date.now()
    // console.log('checkTimeW', checkTimeW);

    //если дата сейчас больше либо равно дате запроса курса + 3ч, то выполнить запрос 
    if( checkTimeW >= objTime ) {
      console.log('checkTimeW > getWeather')
      dispatch(getWeather())
    } else if(checkTimeW <= objTime) {
      console.log('checkTimeW < ничего не делаем')
      //если меньше то доставать из сториджа объект и класть в редакс стейт
    }
  }

  useEffect(()=> {
    checkWidgetsTime()
  },[])

  const prayersTime = useSelector(state => state.widgets.prayersTime)
  //console.log('prayersTime AN', prayersTime);
  
  useEffect(() => {
    dispatch(getPrayersTime())
  },[])

  //Rss post
  // const rssPost = useSelector(state => state.widgets.rssPost)

  useEffect(()=> {
    dispatch(getRss())
  },[])

  // useEffect(()=> {
  //   dispatch(getWeather())
  // },[])

  // const rssPost = useSelector(state=> state.widgets.rssPost)
  // console.log('AN rssPost', rssPost);
  // const weatherInfo = useSelector(state=> state.widgets.weatherInfo)
  // console.log('AN weatherInfo', weatherInfo);

  //инфа по юзеру
  // const user = useSelector(state=> state.user.user)
  // console.log('AN user', user);
  // const userId = useSelector(state=> state.user.userId)
  // console.log('AN userId', userId);
  //юзеры из чата
  // const usersInfo = useSelector(state=> state.user.usersInfo)
  // console.log('AN usersInfo', usersInfo);


  // useEffect(() => {
  //   dispatch(openSocket())
  // },[])

  const isLogged = useSelector(state => state.user.isLogged)

  //console.log(`Logged in state in AppNavigator:\n`, isLogged, `\n`);


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        { isLogged ? ( 
          <Stack.Screen name='Home' component={TabNavigator}/>
        ) :
        <>
          <Stack.Screen name='Splash' component={SplashScreen}/>
          <Stack.Screen name='Auth' component={LoginScreenStack}/>
        </>
        } 
      </Stack.Navigator>
    </NavigationContainer>
  )
}