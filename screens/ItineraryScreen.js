import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, StatusBar,  SafeAreaView, SectionList } from 'react-native';
import { useSelector } from 'react-redux';
import { formatDateDayMonth, formatDateHours } from '../util/formatDate'
import { ItinerarySchedule } from '../components/ItinerarySchedule'
import { THEME } from '../theme';


export const ItineraryScreen = ({navigation}) => {
  //console.log('ItineraryScreen');

  const pressHandler = (title) => {
    return navigation.navigate('Itinerary item', title)
  }
  const groupItiner = useSelector(state => state.user.groupItiner)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.MAIN_COLOR} translucent={false} barStyle='light-content'/>
      <View style={styles.inner}>      
        { groupItiner == null ? <Text style={{justifyContent: 'center', marginVertical: 20, paddingHorizontal: 15}}>Itinerary loading...</Text> 
        : <SectionList
          sections={groupItiner}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: {title} }) => (
            <View style={styles.day}>
              <Text style={styles.dayTitle}>{title}</Text>  
            </View>
          )}
          renderItem={({ item }) => <ItinerarySchedule title={item} onOpen={pressHandler}/>}
          ListEmptyComponent={() => <Text style={styles.dayT}>Itinerary list is empty</Text>}
          showsVerticalScrollIndicator={false}
        />}
      </View> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    width: '100%',
    paddingLeft: 15,
    paddingTop: 20
  },
  day: {
    paddingTop: 40
  },
  dayTitle: {
    fontFamily: 'helvetica',
    fontSize: 24,
    lineHeight: 28,
  },
  dayT: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center'
  },
});