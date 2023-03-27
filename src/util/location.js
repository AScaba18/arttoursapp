import * as Location from 'expo-location';

export const userLocation = async () => {

  let myCoords = {
   my_cur_loc: {
     lat: null,
     lng: null
 },
   msg_timestamp_sent: Date.now(),
   msg_reciever_id: 1,
   msg_reciever_type: "admin",
 }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    await Location.getCurrentPositionAsync({})
    .then(location => {
      if(location.coords) {
        myCoords.my_cur_loc.lat = location.coords.latitude
        myCoords.my_cur_loc.lng = location.coords.longitude
        //console.log('location utils', location)
      }
    })
    return  myCoords
    
  } catch (error) {
    console.log('userLocation error', error);
  }
}