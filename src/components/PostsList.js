import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Linking from 'expo-linking';
import { THEME } from '../theme'

export const PostsList = () => {
  //console.log('data', data);
  // const [loading, setLoading] = useState(false)
  const [render, setRender] = useState(false)
  const rssPost = useSelector(state => state.widgets.rssPost)
  //console.log('rssPost PL 0', rssPost);
  // console.log('\n\n\n --- rssPost: ---\n', rssPost) // DISABLED
  
  
  // const timeoutLoading = setTimeout(()=> {
  //   if(rssPost !== null) {
  //     setLoading(true)
  //     console.log('PostsList loading');
  //     console.log('2');
  //   }
  // }, 5000)

  useEffect(()=>{
    // timeoutLoading
    console.log('1');
    if(rssPost !== null || rssPost.length !== 0) {
      //console.log('rssPost PL 1', rssPost[0]);
      setRender(true)
      // setLoading(true)
      console.log('PostsList loading');
      //console.log('2');
    }

    // return () => {
    //   clearTimeout(timeoutLoading)
    // }
  },[rssPost])

  // useEffect(()=>{
  //   if(loading == true && rssPost !== null) {
  //     setRender(true)
  //     console.log('3');
  //   }
  // }, [rssPost, loading])

  console.log('--- POSTS LIST RENDER ---')
  return (
    render == false && rssPost == null || rssPost.length == 0 ? <ActivityIndicator size={'small'} color={THEME.MAIN_COLOR}/>
    : <>
        <View style={styles.postInner}>
          <View style={styles.postImgC}>
            <Image source={{uri: rssPost[0].description}} style={styles.postImg}/>
            <View style={styles.postTextC}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.postText}>{rssPost[0].title}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{rssPost[0].published}</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => {Linking.openURL(rssPost[0].links)}}>
            <Text style={styles.postText}>Open</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postInner}>
          <View style={styles.postImgC}>
            <Image source={{uri: rssPost[1].description}} style={styles.postImg}/>
            <View style={styles.postTextC}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.postText}>{rssPost[1].title}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{rssPost[1].published}</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => {Linking.openURL(rssPost[1].links)}}>
            <Text style={styles.postText}>Open</Text>
          </TouchableOpacity>
        </View>  
        <View style={styles.postInner}>
          <View style={styles.postImgC}>
            <Image source={{uri: rssPost[2].description}} style={styles.postImg}/>
            <View style={styles.postTextC}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.postText}>{rssPost[2].title}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{rssPost[2].published}</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => {Linking.openURL(rssPost[2].links)}}>
            <Text style={styles.postText}>Open</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postInner}>
          <View style={styles.postImgC}>
            <Image source={{uri: rssPost[3].description}} style={styles.postImg}/>
            <View style={styles.postTextC}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.postText}>{rssPost[3].title}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{rssPost[3].published}</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => {Linking.openURL(rssPost[3].links)}}>
            <Text style={styles.postText}>Open</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postInner}>
          <View style={styles.postImgC}>
            <Image source={{uri: rssPost[4].description}} style={styles.postImg}/>
            <View style={styles.postTextC}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.postText}>{rssPost[4].title}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{rssPost[4].published}</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => {Linking.openURL(rssPost[4].links)}}>
            <Text style={styles.postText}>Open</Text>
          </TouchableOpacity>
        </View> 
      </>
  )
}

const styles = StyleSheet.create({
  //post
  postInner: {
    paddingVertical: 10
  },
  postImg: {
    width: '100%',
    height: 150,
  },
  postImgC: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#ccc'
  },
  postTextC: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(249,249,249,0.8)'
  },
  postText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  postDate: {
    fontFamily: 'sf-text-regular',
    fontSize: 13,
    lineHeight: 16,
    marginVertical: 5,
    color: '#8c8b8b'
  },
  postBtn: {
    width: 100,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: THEME.SECOND_COLOR,
    borderRadius: 30,
    marginVertical: 5,
    //paddingVertical: 10,
    paddingHorizontal: 5,
  },
})