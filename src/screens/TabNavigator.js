import React, {useEffect, useState} from 'react'
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { THEME } from '../theme';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'

import { ItineraryScreen } from './ItineraryScreen';
import { ContactsScreen } from './ContactsScreen';
import { PrayersScreen } from './PrayersScreen';
import { WidgetsScreen } from './WidgetsScreen';
import { ChatRoomsScreen } from './ChatRoomsScreen';
import { ChatScreen } from './ChatScreen'
import { Itinerary } from '../components/ItineraryItem'

import { getToken } from '../util/token';
import { openSocket } from '../store/actions/auth'

const Contacts = createStackNavigator()
const Chat = createStackNavigator()
const Widgets = createStackNavigator()
const Prayers = createStackNavigator()
const ItineraryNav = createStackNavigator()

const Tab = createBottomTabNavigator ()

const ContactScreenStack = ({navigation}) => {
  return (
    <Contacts.Navigator screenOptions={{
      headerShown: false
    }}>
      <Contacts.Screen name="Contacts" component={ContactsScreen}/>
    </Contacts.Navigator>
  )
}

const PrayersScreenStack = ({navigation}) => {
  return (
    <Prayers.Navigator screenOptions={{
      headerStyle: {
        elevation: 10,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: THEME.MAIN_COLOR
      },
      headerTitleStyle: {
        fontFamily: 'helvetica-bold',
        fontSize: 32,
      },
      headerTitleAlign: 'center',
      headerTintColor:  '#fff'
    }}>
      <Prayers.Screen name="Prayers" component={PrayersScreen}/>
    </Prayers.Navigator>
  )
}

const WidgetsScreenStack = ({navigation, route}) => {

  return (
    <Widgets.Navigator screenOptions={{
      headerStyle: {
        elevation: 10,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: THEME.MAIN_COLOR
      },
      headerTitleStyle: {
        fontFamily: 'helvetica-bold',
        fontSize: 32,
      },
      headerTitleAlign: 'center',
      headerTintColor:  '#fff'
    }}>
      <Widgets.Screen name="Trip title" component={WidgetsScreen}/>
    </Widgets.Navigator>
  )
}

const ChatScreenStack = ({navigation}) => {
  return (
    <Chat.Navigator screenOptions={{
      headerStyle: {
        elevation: 10,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: THEME.MAIN_COLOR
      },
      headerTitleStyle: {
        fontFamily: 'helvetica-bold',
        fontSize: 32,
      },
      headerTitleAlign: 'center',
      headerTintColor:  '#fff'
    }}>
      <Chat.Screen name="Chat" component={ChatRoomsScreen}/>
      <Chat.Screen 
        name="ChatItem"
        component={ChatScreen}
        options={({route, navigation})=> ({
          //tabBarVisible: false,
          //title: route.params.name, //передача заголовка в зависимости от того на какой чат переходим
          title: route.params.nameTitle,
          //headerBackTitleVisible: false,
          // headerLeft: () => (
          //   <Entypo name='chevron-thin-left' color={'#fff'} size={24} style={{paddingHorizontal: 10}} onPress={() => navigation.pop()}/>
          // ),
          headerTitleStyle: {
            fontSize: 18,
            color: '#fff'
          },
        })}
      />
    </Chat.Navigator>
  )
}

const ItineraryScreenStack = ({navigation}) => {
  return (
    <ItineraryNav.Navigator screenOptions={{
      headerStyle: {
        elevation: 10,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: THEME.MAIN_COLOR
      },
      headerTitleStyle: {
        fontFamily: 'helvetica-bold',
        fontSize: 32,
      },
      headerTitleAlign: 'center',
      headerTintColor:  '#fff'
    }}>
      <ItineraryNav.Screen 
        name='Itinerary'
        component={ItineraryScreen}
        options={{
          //headerShown: false
        }}
      />
      <ItineraryNav.Screen name='Itinerary item' component={Itinerary}
        options={{
          title: 'Back to itinerary',
          headerTitleStyle: {
            fontSize: 18,
            color: '#fff'
          },
          headerStyle: {
            backgroundColor: THEME.MAIN_COLOR,
            //height: 80
          },
        }}
      />
    </ItineraryNav.Navigator>
  )
}

export const TabNavigator = ({navigation, route}) => {
  const dispatch = useDispatch()
  const [token, setToken] = useState(null)
  
  useEffect(() => {
    console.log('\n\n\n--- TAB NAVIGATOR useEffect[] ---\ntoken:', token)
    if (token !== null) dispatch(openSocket())
    else getTokenFromSecureStore()
  },[])

  useEffect(() => {
    console.log('\n\n\n--- TAB NAVIGATOR useEffect[token] ---\ntoken:', token)
    if (token !== null) dispatch(openSocket())
  },[token])

  const getTokenFromSecureStore = async () => {
    const tokenFromSecureStore = await getToken()
    console.log('\n\n\n--- TAB NAVIGATOR tokenFromSecureStore ---\ntokenFromSecureStore:', tokenFromSecureStore)
    setToken(tokenFromSecureStore)
  }
  
  const inGroup = useSelector(state => state.user.inGroup)
  console.log('inGroup TN ', inGroup);

  useEffect(() => {
    inGroup
  },[inGroup])
  
  const size = 28

  const getTabBarVisability = (route) => {
    //console.log(route);
    const routeName = getFocusedRouteNameFromRoute(route)
    if (routeName === 'ChatItem') {
      return false;
    }
    return true;
  }

  console.log('--- TAB NAVIGATOR RENDER ---')
  return (
    <Tab.Navigator 
      initialRouteName="Widgets"
      tabBarOptions={{
        activeTintColor: '#000',
        inactiveTintColor: '#ccc',
        tabStyle: {
          paddingVertical: 5
        },
        style: {
          height: 70
        },
        labelStyle: {
          fontFamily: 'helvetica',
          fontSize: 12,
          //backgroundColor: 'red'
        }
      }}
    >
      { inGroup === true ? 
      <Tab.Screen name="Contacts" component={ContactScreenStack}
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ focused }) => {
            return (
              focused ?
              <Image
                style={{ width: size, height: size,}}
                source={require('../../assets/Icons/phone-1.png')}
              /> :
              <Image
                style={{ width: size, height: size }}
                source={require('../../assets/Icons/phone.png')}
              />
            )}
        }}
      />
      : null
      }

      <Tab.Screen name="Prayers" component={PrayersScreenStack}
        options={{
          tabBarLabel: 'Prayers',
          tabBarIcon: ({ focused }) => {
            return (
              focused ?
              <Image
                style={{ width: size, height: size,}}
                source={require('../../assets/Icons/book-opened-1.png')}
              /> :
              <Image
                style={{ width: size, height: size }}
                source={require('../../assets/Icons/book-opened.png')}
              />
            )}
        }}
      />
      <Tab.Screen name="Widgets" component={WidgetsScreenStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            return (
              focused ?
              <Image
                style={{ width: size, height: size,}}
                source={require('../../assets/Icons/language-1.png')}
              /> :
              <Image
                style={{ width: size, height: size }}
                source={require('../../assets/Icons/language.png')}
              />
            )}
        }}
      />
      { inGroup === true ?  (
      <>
      <Tab.Screen name="ChatRoomScreen" component={ChatScreenStack}
        options={({route}) => ({
          tabBarLabel: 'Chat',
          tabBarVisible: getTabBarVisability(route),
          tabBarIcon: ({ focused }) => {
            return (
              focused ?
              <Image
                style={{ width: size, height: size,}}
                source={require('../../assets/Icons/chat-1.png')}
              /> :
              <Image
                style={{ width: size, height: size }}
                source={require('../../assets/Icons/chat.png')}
              />
            )}
        })}
      />
      <Tab.Screen name="Itinerary" component={ItineraryScreenStack}
        options={{
          tabBarLabel: 'Itinerary',
          tabBarIcon: ({ focused }) => {
            return (
              focused ?
              <Image
                style={{ width: size, height: size,}}
                source={require('../../assets/Icons/dashboard-1.png')}
              /> :
              <Image
                style={{ width: size, height: size }}
                source={require('../../assets/Icons/dashboard.png')}
              />
          )}
        }}
      />
      </>
      ) : null 
      }
    </Tab.Navigator>
  )
}