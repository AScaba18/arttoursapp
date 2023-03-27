import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { HotelInfo } from '../components/HotelInfo'
import { FooterList } from '../components/FooterList'
import { useSelector } from 'react-redux';

export const ContactsScreen = ({navigation}) => {

  const hotelInfo = useSelector(state => state.user.hotelInfo)
  // console.log('hotelInfo', hotelInfo);

  if (hotelInfo == null) {
    return (
      <View style={[styles.container, styles.inner]}>
        <Text style={styles.dayTitle}>No hotel information</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hotelInfo}
        keyExtractor={item => item.h_id.toString()}
        renderItem={({item}) => <HotelInfo item={item}/>}
        ListFooterComponent={() => <FooterList />}
      />    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: 'center'
  },  
  dayTitle: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center'
  },
});