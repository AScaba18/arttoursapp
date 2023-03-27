import { COORDS_USER, WEATHER, WEATHER_OBJ, PRAYERS_TIME, RSS_POSTS, FETCH_CURENCY, ERROR_WEATHER_PERMIS, ERROR_WEATHER_COORDS, ERROR_FETCH_WEATHER } from '../types'
import * as Location from 'expo-location';
import * as Localization from 'expo-localization';
import * as rssParser from 'react-native-rss-parser';
import * as SecureStore from 'expo-secure-store';
import { getCurrency } from '../../util/currency'
//import { askForPermissions } from '../../components/AppNavigator'

export const userLocSetState = () => {
console.log('userLocSetState start')

  return async (dispatch) => {
    try {
      let { status } = await Location.requestBackgroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({})
      .then(location => {
        if(location.coords) {
          dispatch({
            type: COORDS_USER,
            payload: location.coords
          })
          //console.log('location widgets actions', location)
        }
      })
      } catch (error) {
        console.log('userLocSetState widgets error', error);
      }
  }
}

export const getWeather = (dataObj = null)  => {
  console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 37 store/actions/widgets ', `getWeather start ${dataObj!==null?dataObj.error:''}` )
  
  return async (dispatch) => {
    try {
      let lat
      let lon

      const { status } = await Location.requestBackgroundPermissionsAsync()
      if (status !== 'granted') {
        dispatch({type: ERROR_WEATHER_PERMIS,payload: true})
        console.log('\n\x1b[47m\x1b\x1b[31m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[37m%s\x1b[0m\n', 'ERROR', ' 44 store/actions/widgets ', 'Permission to access location was denied')
        return
      }
      console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s%s\x1b[0m\n', 'INFO', ' 55 ', 'status: ', status)

      await Location.getCurrentPositionAsync({})
      .then(location => {
        lat = location.coords.latitude
        lon = location.coords.longitude
        console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 55 ', 'location widgets actions:')
        console.log(location)
        dispatch({
          type: COORDS_USER,
          payload: location
        })
      })
      .catch(error => {
        console.log('getWeather location fetch error \n', error)
        dispatch({
          type: ERROR_WEATHER_COORDS,
          payload: error
        })
      });
      console.log('getWeather actions 2');

      const api = 'bea303af3c2500a7f6cf767900f26bb1'
      //lat = '59.9386300' //latitude //'40.7142700'
      //console.log(lat);
      //lon = '30.3141300'//longitude //'-74.0059700'
      //console.log(lon);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=imperial`

      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      await fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result) {
            // const kelvToFarin = 273.15
            // let curTemp = result.main.temp
            // let temp = Math.ceil(curTemp - kelvToFarin)
            // console.log('getWeather actions before dispatch 3', result.main.temp);
            dispatch({
              type: WEATHER,
              payload: {
                temp: result.main.temp,
                name: result.name,
                country: result.sys.country,
                icon: result.weather[0].icon,
                curWeath: result.weather[0].main,
                id: result.weather[0].id,
              }
            })
            //добавить в локал стораж дату 
            const date = Date.now()+10800000
            console.log('weather date getWeather', date);
            SecureStore.setItemAsync('WidgetTime', JSON.stringify(date))
            //console.log('fetch result \n', result);
          }
        })
        .catch(error => {
          console.log('getWeather fetch error \n', error)
          dispatch({
            type: ERROR_FETCH_WEATHER,
            payload: error
          })
        })
        //console.log('getWeather actions after dispatch 4');
      } catch (error) {
        console.log('getWeather widgets error \n', error);
      }
    }
}

//получение объекта с расписанием
export const getPrayersTime = () => {
  console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 37 store/actions/widgets ', `getPrayersTime start` )
  
  return async (dispatch) => {
    try {
      let lat
      let lon

      let { status } = await Location.requestBackgroundPermissionsAsync()
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

      //console.log('getPrayersTime actions 1');
        let location = await Location.getCurrentPositionAsync({})
        .then(location => {
          lat = location.coords.latitude
          lon = location.coords.longitude
        })
      //console.log('getPrayersTime actions 2');
      const timeZone =  Localization.timezone
      console.log('timeZone',timeZone);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      await fetch(`https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}&tzid=${timeZone}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          //console.log('getPrayersTime result fetch', result)
          if(result) {
            //console.log('getPrayersTime actions before dispatch 3');
            dispatch({
              type: PRAYERS_TIME,
              payload: result.times
            })
          }
        })
        .catch(error => console.log('error', error));
        //console.log('getPrayersTime actions after dispatch 4');
    } catch (error) {
      console.log('getPrayersTime widget error', error);
    }
  }
}

export const getRss = () => {
  //console.log('getRss start');
  
  return async (dispatch) => {
    
    try {  
      await fetch(`https://www.jpost.com/rss/rssfeedsheadlines.aspx`)
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) => {
          //console.log('rss_____________________________________________________________');
          if(rss.items) {
            dispatch({
              type: RSS_POSTS,
              payload: rss.items
            })
          }
        })
        .catch(error => console.log('rssParser error', error));
      
    } catch (error) {
      console.log('getRss widget error', error);
    }
  }
}

export const getFetchCurr = (dataObj = null) => {
  console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 201 ', `getFetchCurr start ${dataObj!==null?dataObj.error:''}`);

  return async (dispatch) => {
    try {
      const curr = {
        USD_ILS: null,
        USD_EUR: null,
        EUR_ILS: null,
        EUR_USD: null,
        ILS_USD: null,
        ILS_EUR: null,
        time: null,
      }
      const apiKey = '19fa1cc594e325b5729a'

      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      //console.log('12');
      await fetch(`https://free.currconv.com/api/v7/convert?q=USD_ILS&compact=ultra&apiKey=${apiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('1 result', result.USD_ILS)
          if (result) {
            curr.USD_ILS = result.USD_ILS
            //console.log(curr)
            //SecureStore.setItemAsync('USD_ILS', JSON.stringify(result))
          }
        })
        .catch(error => console.log('getFetchCurr fetch error', error));

      await fetch(`https://free.currconv.com/api/v7/convert?q=USD_EUR&compact=ultra&apiKey=${apiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('2 result', result.USD_EUR)
          if (result) {
            curr.USD_EUR = result.USD_EUR
            //console.log(curr)
            //SecureStore.setItemAsync('USD_EUR', JSON.stringify(result))
          }
        })
        .catch(error => console.log('getFetchCurr fetch error', error));

      await fetch(`https://free.currconv.com/api/v7/convert?q=EUR_ILS&compact=ultra&apiKey=${apiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('3 result', result.EUR_ILS)
          if (result) {
            curr.EUR_ILS = result.EUR_ILS
            //console.log(curr)
            //SecureStore.setItemAsync('EUR_ILS', JSON.stringify(result))
          }
        })
        .catch(error => console.log('getFetchCurr fetch error', error));
        
        //если приходит ошибка status: '400' - это количество запросов исчерпано (100 в час) обрабатывать и не класть в стейт но указывать ошибку и чистить стораж и стейт
        //console.log('curr', curr);
        
      if(curr.USD_EUR, curr.EUR_ILS, curr.EUR_ILS !== null ) {
        curr.time = Date.now()+86400000
        curr.EUR_USD = 1/curr.USD_EUR
        curr.ILS_USD = 1/curr.USD_ILS
        curr.ILS_EUR = 1/curr.EUR_ILS

        await SecureStore.setItemAsync('Currency', JSON.stringify(curr))
        console.log('getFetchCurr setItemAsync curr', curr);

        dispatch({
          type: FETCH_CURENCY,
          payload: curr
        })
      }
    } catch (error) {
      console.log('getFetchCurr func error', error);
    }
  }
}

export const setCurr = () => {
  console.log('setCurr start');
  return async (dispatch) => {
    const dateCurr = await getCurrency()
    dispatch({
      type: FETCH_CURENCY,
      payload: dateCurr
    })
  }
}