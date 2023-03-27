import { COORDS_USER, PRAYERS_TIME, WEATHER, RSS_POSTS, FETCH_CURENCY, ERROR_WEATHER_PERMIS, ERROR_WEATHER_COORDS, ERROR_FETCH_WEATHER } from '../types'

const initialState = {
  prayersTime: null, //было [] //в presist
  rssPost: null,
  currency: null,
  loading: true,
  weatherInfo: null, //в presist
  coords: null,
  errorWeathPermiss: false,
  errorWeathCoords: null,
  errorWeathFetch: null,
}

export const widgetsReducer = (state = initialState, action) => {
  //console.log('action.payload', action.payload)
  
  switch (action.type) {
    case WEATHER:
      //console.log('getWeather reducer 5');
      return {
        ...state,
        weatherInfo: action.payload,
        loading: false
      }
    case COORDS_USER:
      //console.log('action.payload COORDS_USER', action.payload);
      return {
        ...state,
        coords: action.payload
      }
      case ERROR_WEATHER_PERMIS:
      console.log('action.payload ERROR_WEATHER_PERMIS', action.payload);
      return {
        ...state,
        errorWeathPermiss: true
      }
    case ERROR_WEATHER_COORDS:
      console.log('action.payload ERROR_WEATHER_COORDS', action.payload);
      return {
        ...state,
        errorWeathCoords: action.payload
      }
    case ERROR_FETCH_WEATHER:
      console.log('action.payload ERROR_FETCH_WEATHER', action.payload);
      return {
        ...state,
        errorWeathFetch: action.payload
      }
    case PRAYERS_TIME:
      console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 71 Widgets Reducer ','getPrayersTime reducer 5')
      //console.log('Prayers obj in widget reducers\n', action.payload);
      const prayersTime = []
      const arrayOfPrayers = [
        {sourceName: 'chatzotNight',niceName:'Chatzot Night'},
        {sourceName: 'alotHaShachar',niceName:'Alot Hashachar'},
        {sourceName: 'misheyakir',niceName:'Misheyakir'},
        {sourceName: 'dawn',niceName:'Dawn'},
        {sourceName: 'sunrise',niceName:'Sunrise'},
        {sourceName: 'sofZmanShma',niceName:'Sof Zman Shema'},
        {sourceName: 'sofZmanTfilla',niceName:'Sof Zman Tefillah'},
        {sourceName: 'chatzot',niceName:'Chatzot Yom'},
        {sourceName: 'minchaGedola',niceName:'Mincha Gedola'},
        {sourceName: 'minchaKetana',niceName:'Mincha Ketana'},
        {sourceName: 'plagHaMincha',niceName:'Plag Hamincha'},
        {sourceName: 'sunset',niceName:'Sunset'},
        {sourceName: 'dusk',niceName:'Dusk'},
        {sourceName: 'tzeit42min',niceName:'Tzet Hakochavim (42 min)'},
      ]
      const newArr = Object.entries(action.payload).forEach(item => {
        const prayer = arrayOfPrayers.filter(elem=>elem.sourceName===item[0])
        // console.log('\n\x1b[47m\x1b\x1b[30m%s\x1b\x1b[40m\x1b\x1b[36m%s\x1b\x1b[33m%s\x1b[0m\n', 'INFO', ' 71 Widgets Reducer ', item, prayer.length)
        if ( prayer.length ) {
          let time = new Date(item[1]).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
          prayersTime.push({
            key: prayer[0].niceName,
            time: time
          })
        }
        return prayersTime
      })
      return {
        ...state,
        prayersTime,
        loading: false
      }
    case RSS_POSTS:
      //получаем массив и отбираем данные которые нам нужны кладем в свойство стейта новый масиив с нужными данными
      const rssPost = []
      const newRss = action.payload.forEach((item, index)=> {
      if(rssPost.length >= 5) return
      //поиск url картинки в description
      const regex = /(http|ftp|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
      const url = item.description.match(regex)[0];
        rssPost.push({
          id: index,
          description: url,
          links: item.links[0].url,
          published: item.published,
          title: item.title,
        })
      })
      return {
        ...state,
        rssPost
      }
    case FETCH_CURENCY:
      //этот код в фун-ии экшина
      //const currency = action.payload
      // currency.EUR_USD = 1/action.payload.USD_EUR
      // currency.ILS_USD = 1/action.payload.USD_ILS
      // currency.ILS_EUR = 1/action.payload.EUR_ILS
      //добавлять обратные ключи и значение 
      return {
        ...state,
        currency: action.payload,
        loading: false
      }
  
    default:
      return state;
  }
}