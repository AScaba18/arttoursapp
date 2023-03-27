import * as SecureStore from 'expo-secure-store';

export const getWidgetTime = async () => {
  console.log('getWidgetTime start');

  try {
    const widgetTime = await SecureStore.getItemAsync('WidgetTime');
    return JSON.parse(widgetTime)
  } catch (error) {
      console.log('getWidgetTime error \n', error)
  }
}