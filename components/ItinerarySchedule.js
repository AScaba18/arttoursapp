import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground  } from 'react-native';

export const ItinerarySchedule = ({title, onOpen}) => {
//console.log('ItinerarySchedule', title);

const [uri, setUri] = useState(null)

  const checkUriFormat = (uri) => {
    const videoExtensions = ['mp4', 'm4a', 'm4v', 'f4v', 'f4a', 'm4b', 'm4r', 'f4b', 'mov', '3gp', '3gp2', '3g2', '3gpp', '3gpp2', 'webm', 'avi', 'oog', 'wmv', 'qt']
    //const imageExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd']
    const fileNameParts = uri.split('.')
    const extansion = fileNameParts[fileNameParts.length - 1]
    if (videoExtensions.includes(extansion)) {
      setUri(false)
    } else setUri(true)
  }

useEffect(()=> {
  checkUriFormat(title.img)
},[])


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=> onOpen(title)}>
        <View style={[styles.row, styles.sep]}>
          <View style={styles.timeC}>
            <Text style={styles.time}>{title.timeStart}</Text>
          </View>
          {uri == true ? <ImageBackground source={{uri: 'http://dev.arttoursapp.com/uploads/itineraries/' + title.img}} style={styles.imgBg}>
            <View style={styles.row}>
              <View style={styles.doingsC}>
                <Text style={[styles.doings, {color: '#fff'}]}>{title.name}</Text>
              </View>
              <View style={styles.imgC}>
                <Image source={require('../../assets/BackIconWhite.png')} style={styles.img}/>
              </View>
            </View>
          </ImageBackground>
          :
            <View style={styles.vinner}>
              <View style={styles.vrow}>
                <View style={styles.doingsC}>
                  <Text style={styles.doings}>{title.name}</Text>
                </View>
                <View style={styles.imgC}>
                  <Image source={require('../../assets/backIcon.png')} style={styles.img}/>
                </View>
              </View>
            </View>
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imgBg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    paddingVertical: 24,
  },
  imgC: {
    //width: '100%',
    justifyContent: 'flex-end',
    textAlign: 'right',
    paddingRight: 10
  },
  img: {
    width: 16,
    height: 19.48,
    // backgroundColor: 'red'
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sep: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  timeC: {
    width: '30%',
  },
  time: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  doingsC: {
    flexDirection: 'column',
    paddingLeft: 15
    //width: '65%'
  },
  doings: {
    fontFamily: 'sf-display-semibold',
    fontSize: 18,
    lineHeight: 22,
    paddingRight: 10,
  },
  vrow: {
    width: '70%',
    paddingVertical: 24,
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vinner: {
    width: '100%',
    // backgroundColor: 'pink',
  }
});