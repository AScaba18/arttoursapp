import * as Font from 'expo-font';

export async function bootstrap() {
  try {
    await Font.loadAsync({
      'helvetica': require('../assets/fonts/Helvetica.ttf'),
      'helvetica-bold': require('../assets/fonts/Helvetica-Bold.ttf'),
      'sf-display-regular': require('../assets/fonts/SFProDisplay-Regular.ttf'),
      'sf-display-semibold': require('../assets/fonts/SFProDisplay-Semibold.ttf'),
      'sf-display-bold': require('../assets/fonts/SFProDisplay-Bold.ttf'),
      'sf-text-regular': require('../assets/fonts/sf-pro-text-regular.ttf'),
      'sf-text-medium': require('../assets/fonts/sf-pro-text-medium.ttf'),
    })
  } catch(e) {
    console.log('ERROR ', e);
  }
}