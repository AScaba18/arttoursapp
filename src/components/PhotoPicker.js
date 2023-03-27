import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker'
import { View, Button, StyleSheet, Image, Alert } from 'react-native'
import * as Permissions from 'expo-permissions'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'


async function askForPermissions() {
  const { status } = await Permissions.askAsync(
    Permissions.CAMERA,
    Permissions.MEDIA_LIBRARY
  )
  if (status !== 'granted') {
    Alert.alert('Sorry, we need camera roll permissions to make this work!')
    return false
  }
  return true
}

export const PhotoPicker = ({onPick}) => {
  //console.log('PhotoPicker render');
  const [image, setImage] = useState(null)
  
  const takePhoto = async () => {
    const hesPermissions = await askForPermissions()

    if (!hesPermissions) {
      return
    }
    const img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: true,
      aspect: [4, 4]
    })
    setImage(img.uri)
    onPick(img.uri)

    if (img.cancelled) {
      return;
    }
  }

  return (

    <View style={styles.head}>
      <Image source={image ? {uri: image} : require('../../assets/ava.png') } style={styles.imgAvatar}/>
      <View style={styles.picker}>
        <TouchableWithoutFeedback  onPress={takePhoto}>
          <Image source={require('../../assets/edit.png')} style={styles.iconPicker}/>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
} 



const styles = StyleSheet.create({
  head: {
    
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    // position: 'relative',
  },
  imgAvatar: {
    justifyContent: 'center',
    width: 125,
    height: 125,
    borderRadius: 70,
  },
  picker: {
    position: 'absolute',
    right: '29%',
    bottom: 15,
  },
  iconPicker: {
    width: 28,
    height: 28,
  },
})


//присоединение изображения и создание поста из старого проекта
// export const addPost = (post) => async dispatch => {
//   const fileName = post.img.split('/').pop()
//   const newPath = FileSystem.documentDirectory + fileName

//   try {
//     await FileSystem.moveAsync({
//       to: newPath,
//       from: post.img
//     })
//   } catch (e) {
//     console.log('ERROR', e);
//   }

//   const payload = {...post, img: newPath}

//   const id = await DB.createPost(payload)

//   payload.id = id
//   dispatch({
//     type: ADD_POST,
//     payload
//   })
// }