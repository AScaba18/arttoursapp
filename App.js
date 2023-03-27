import React, {useState} from 'react';
import AppLoading from 'expo-app-loading'
import { bootstrap } from './src/bootstrap'
import { Provider } from 'react-redux';
import { AppNavigator } from './src/components/AppNavigator';
import { store } from './src/store'
import  { persistor } from './src/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  const [isReady, setIsReady] = useState(false)

  if(!isReady) {
    return <AppLoading
    startAsync={bootstrap}
    onFinish={() => setIsReady(true)}
    onError={() => console.log(e)}
    />
  }
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  )
}