import * as SecureStore from 'expo-secure-store';

export const getCurrency = async () => {
  console.log('getCurrency start');

  try {
    const curr = await SecureStore.getItemAsync('Currency');
    return JSON.parse(curr)
  } catch (error) {
      console.log('getCurrency error \n', error)
  }
}