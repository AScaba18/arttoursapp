import React, {useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, VirtualizedList } from 'react-native';
import { useSelector } from 'react-redux';
import { THEME } from '../theme'

export const Zmanim = () => {

  const prayersTime = useSelector(state => state.widgets.prayersTime)
  
  useEffect(() => {
    prayersTime
  }, [prayersTime])

  const Item = ({data}) => (
    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.key}>{data.key}</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.time}>{data.time}</Text>
      </View>
    </View>
  )
  
  return (
    prayersTime == null ? <ActivityIndicator size={'small'} color={THEME.MAIN_COLOR}/>
    : 
    <View>
      {prayersTime.map((item, index) => ( 
        <Item key={index} data={item}/>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingBottom: 5,
    alignItems: 'center',
  },
  //prayers  
  key: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  time: {
    paddingLeft: 10,
    fontSize: 16
  },
  col: {
    width: '40%'
  },
})