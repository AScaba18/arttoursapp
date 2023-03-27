import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { ScrollView, TouchableOpacity, } from 'react-native-gesture-handler';

import Tooltip from 'rn-tooltip'
import Clipboard from 'expo-clipboard';
import { THEME } from '../theme';
import { Video } from 'expo-av';

export const Itinerary = ({ route }) => {

  const [uri, setUri] = useState(null)
  const myLocalTooltipRef = useRef(null)

  const adress = route.params.address //'Redondo Beach, CA, 91208' //где брать адрес?, route.params.???

  const copyToClipboard = (addres) => {
    Clipboard.setString(addres);
    setTimeout(() => {
      myLocalTooltipRef.current.toggleTooltip()
    }, 2000)
  };

  useEffect(() => {
    return () => copyToClipboard
  })

  const checkUriFormat = (uri) => {
    const videoExtensions = ['mp4', 'm4a', 'm4v', 'f4v', 'f4a', 'm4b', 'm4r', 'f4b', 'mov', '3gp', '3gp2', '3g2', '3gpp', '3gpp2', 'webm', 'avi', 'oog', 'wmv', 'qt']
    //const imageExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd']

    const fileNameParts = uri.split('.')
    const extansion = fileNameParts[fileNameParts.length - 1]

    if (videoExtensions.includes(extansion)) {
      setUri(false)
    } else setUri(true)
  }

  useEffect(() => {
    checkUriFormat(route.params.img)
  }, [])

  const imgUrl = "http://dev.arttoursapp.com/uploads/itineraries/" + route.params.img

  return (
    <View style={styles.container}>
      <ScrollView >
        <Text style={styles.title}>{route.params.name}</Text>
        <View style={styles.imgC}>
          {uri !== true ? <Image style={styles.img} source={{ uri: imgUrl }} />
            : <Video
              resizeMode="contain"
              useNativeControls
              shouldPlay={false}
              source={{ uri: imgUrl }}
              style={styles.video}
            />
          }
        </View>
        <View style={styles.info}>
          <View style={styles.header}>
            <View style={styles.row}>
              <Text style={styles.textMain}>When</Text>
              <Image source={require('../../assets/access_time.png')} style={styles.imgIcon} />
            </View>
            <Text style={styles.textDesc}>{route.params.timeStart}</Text>
          </View>
          <View style={styles.header}>
            <View style={styles.row}>
              <Text style={styles.textMain}>Where</Text>
              <Image source={require('../../assets/pin_drop.png')} style={styles.imgIcon} />
            </View>
            <View style={styles.row}>
              <Text style={styles.textDesc}>{adress}</Text>
              <Tooltip
                ref={myLocalTooltipRef}
                popover={<Text style={{ color: '#fff', }}>Copied</Text>}
                backgroundColor={THEME.MAIN_COLOR}
                withOverlay={false}
                width={80}
                containerStyle={{ marginRight: 20, opacity: 0.9 }}
                withPointer={false}
                onOpen={() => { copyToClipboard(adress) }}
                toggleWrapperProps={{ activeOpacity: 0.2 }}
              >
                <Image source={require('../../assets/Copy.png')} style={{ width: 30, height: 30, marginLeft: 15 }} />
              </Tooltip>

            </View>
          </View>
        </View>
        <View style={styles.innerDesc}>
          <Text style={styles.textMain} >Description</Text>
          <Text style={styles.textDesc}>{route.params.descr}</Text>

        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 15
  },
  info: {
    paddingHorizontal: 15
  },
  innerDesc: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  title: {
    color: THEME.MAIN_COLOR,
    fontSize: 21,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 40,
    paddingBottom: 20
  },
  imgC: {
    paddingVertical: 10,
    // backgroundColor: 'red'
  },
  imgIcon: {
    width: 24,
    height: 24
  },
  img: {
    //добавить тень
    width: '100%',
    height: 200,
  },
  video: {
    width: '100%',
    height: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMain: {
    fontFamily: 'sf-display-semibold',
    fontSize: 18,
    lineHeight: 22,
    color: THEME.MAIN_COLOR,
    paddingVertical: 10
  },
  textDesc: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
});