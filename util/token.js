import * as SecureStore from 'expo-secure-store';

export const getToken = async () => {
  try {
      const token = await SecureStore.getItemAsync('userToken');
      return JSON.parse(token)
  } catch (error) {
      console.log('getToken error \n', error)
  }
}

export const setToken = async (token) => {
  console.log('setToken');

  await SecureStore.setItemAsync('userToken', JSON.stringify(token))
  .then(
    SecureStore.setItemAsync('isLogged', "true").catch((error)=>{
      // Здесь должна быть работа с ошибкой сохранения в сторедж.
      console.log(`setToken isLogged error \n`, error);
      // throw error
    })
  )
  .catch((error) => {
    // Здесь должна быть работа с ошибкой сохранения в сторедж.
    console.log(`setToken error \n`, error);
    // throw error
  });  
}

export const clearToken = async () => {
  await SecureStore.deleteItemAsync('userToken')
  await SecureStore.deleteItemAsync('isLogged')
  await SecureStore.deleteItemAsync('userId')
  await SecureStore.deleteItemAsync('userInfo')
  await SecureStore.deleteItemAsync('Currency')  
  await SecureStore.deleteItemAsync('WidgetTime')  
}

//USER INFO
export const setUserInfo = async (user) => {
  console.log('setUserInfo');

  const userInfo = {
    userId: user.app_user.au_id,
    userAva: user.profile.p_img_ava,
    userName: user.profile.p_nice_name
  }
  await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo))
  
  .catch((error) => {
    console.log(`setUserInfo error \n`, error);
    // throw error
  });  
}

export const getUserInfo = async () => {
  console.log('getUserInfo');

  try {
    const userInfo = await SecureStore.getItemAsync('userInfo');
    return JSON.parse(userInfo)
  } catch (error) {
      console.log('getUserInfo error \n', error)
  }  
}

export const setUserId = async (userId) => {
  console.log('setUserId');

  await SecureStore.setItemAsync('userId', JSON.stringify(userId))
  .catch((error) => {
    // Здесь должна быть работа с ошибкой сохранения в сторедж.
    console.log(`setUserId error \n`, error);
    // throw error
  });
}

export const getUserId = async () => {
  console.log('getUserId');
  try {
    const userId = await SecureStore.getItemAsync('userId');
      return JSON.parse(userId)
    
  } catch (error) {
    console.log(`getUserId error \n`, error);
  }
}

// export const setStatus = async (status) => {
//   await AsyncStorage.setItem('@status', JSON.stringify(status))
// }