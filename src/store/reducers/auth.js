import { 
  LOGIN_USER,
  LOGOUT_USER,
  AUTOLOGIN,
  LOGIN_ERROR,
  SOCKET_ERROR,
  CONNECT_SOCKET,
  IN_GROUP,
  USER_INFO,
  GROUP_INFO,
  GROUP_ITINERARY,
  USERS_INFO,
  LOGIN_ERROR_RESET,
  UPDATE_FILE_UPLOAD_STATUS,
} from '../types'
import { formatDateDayMonth, formatDateHours } from '../../util/formatDate'

const initialState = {
  user: null,
  usersInfo: null,
  isLogged: false,
  loginError: false,
  socket: null,
  inGroup: false,
  groupInfo: null,
  groupItiner: null,
  hotelInfo: null,
  isLoading: false,
  socketErr: false,
  fileUploadStatus: 'standby',
  fileUploadData: null
}

export const userReducer = (state = initialState, action) => {
  //console.log('action.payload', action.payload)
  
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: {
          userId: action.payload.app_user.au_id,
          userAva: action.payload.profile.p_img_ava,
          userName: action.payload.profile.p_nice_name,
        },
        //token: action.payload.access_token,
        isLogged: true
      }
    case USER_INFO:
      return {
        ...state,
        user: action.payload
      }
    case AUTOLOGIN:
      return {
        ...state,
        isLogged: true,
      }
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        token: null,
        isLogged: false,
        loginError: false,
      }
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: true
      }
      case LOGIN_ERROR_RESET:
        return {
        ...state,
        loginError: false
      }
    case SOCKET_ERROR:
      return {
        ...state,
        socketErr: true
      }
    case CONNECT_SOCKET:
      console.log('connect socket reducer');
      return {
        ...state,
        socket: action.payload,
        socketErr: false
      }
    case GROUP_ITINERARY:
    const groupItiner = []
    let flag = ''
    if(action.payload.itineraries) {

      action.payload.itineraries.forEach(e => {
        //ели будут null undefind значения, обрабатывать тоже
        let title = formatDateDayMonth(e.itnr_datetime) //оформяем тайтл из ключа с датой
        let timeStart = formatDateHours(e.itnr_datetime) //если будет название ключа с датой окончания тоже обрабатывать
        if (flag != title) {
          flag = title
  
          groupItiner.push({
            title: title,
            data: [
              {
                id: e.itnr_id,
                timeStart: timeStart,
                //timeEnd: Date2 ? Date2.getHour : null,
                name: e.itnr_name,
                descr: e.itnr_description,
                img: e.itnr_img,
                address: e.itnr_address
              },
            ]
          })
          } else {
            groupItiner[groupItiner.length - 1].data.push({
              id: e.itnr_id,
              timeStart: timeStart,
              //timeEnd: Date2 ? Date2.getHour : null,
              name: e.itnr_name,
              descr: e.itnr_description,
              img: e.itnr_img,
              address: e.itnr_address
            },)
          }
          //console.log('newArr', newArr);
        })
    }
      return {
        ...state,
        groupItiner
      }
    case GROUP_INFO:
      // console.log('action.payload GROUP_INFO', action.payload);
      return {
        ...state,
        inGroup: true,
        groupInfo: {
          g_id: action.payload.g_id,
          g_emergency_phone: action.payload.g_emergency_phone,
          g_name: action.payload.g_name,
          g_tour_dates: action.payload.g_tour_dates,
          g_img: `http://dev.arttoursapp.com/uploads/groups/`+ action.payload.g_img
        },
        hotelInfo: action.payload.hotels,
      } 
    case IN_GROUP:
      console.log('action.payload IN GROUP line 141 reducer', action.payload);
      return {
        ...state,
        inGroup: false,
        groupInfo: null,
        groupItiner: null,
        hotelInfo: null,
      } 
    case USERS_INFO:
      //console.log('USERS_INFO action.payload', action.payload);
      const usersInfo = []
      action.payload.forEach((item) => {
        //нужна ли эта проверка?
        //if(item.hasOwnProperty('c_user_id'))
        //console.log('USERS_INFO', item);
        let ava = null
        if(item.c_user_profile.p_img_ava !== null) {
          ava = `http://dev.arttoursapp.com/uploads/profiles/`+ item.c_user_profile.p_img_ava
        }
        //console.log('item.c_user_profile.p_img_ava', item.c_user_profile.p_img_ava);
        usersInfo.push({
          userId: item.c_user_id,
          userName: item.c_name,
          userAva: ava
        })
      })
      return {
        ...state,
        usersInfo
      }
    case UPDATE_FILE_UPLOAD_STATUS:
      return {
        ...state,
        fileUploadStatus: action.payload.newStatus,
        fileUploadData: action.payload.result
      } 
  
    default:
      return state;
  }
}