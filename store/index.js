import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import { userReducer } from "./reducers/auth";
import { widgetsReducer } from "./reducers/widgets";
import { persistStore, persistReducer } from 'redux-persist'
import createSecureStore from "redux-persist-expo-securestore";

//старый код
// const rootReducer = combineReducers({
//   //post: postReducer,
//   user: userReducer  //user: userReducer??
// })

const storage = createSecureStore();

const persistConfig = {
  key: 'user', 
  storage,
  whitelist: ['isLogged', 'user', 'inGroup'],
  blacklist: ['loginError']
}

const persistConfigWidget = {
  key: 'widgets',
  storage,
  whitelist: ['currency', 'weatherInfo'],
  blacklist: ['loading']
}

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),  //user: userReducer
    // widgets: widgetsReducer,
    widgets: persistReducer(persistConfigWidget, widgetsReducer),
    // group: groupReducer,
  })

export const store = createStore(rootReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)


//вариант использования
//const persistedReducer = persistReducer(persistConfig, rootReducer)

// export default () => {
//   let store = createStore(rootReducer, applyMiddleware(thunk))
//   let persistor = persistStore(store)
//   return { store, persistor }
// }