import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, Image, ScrollView, Platform, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import ButtonSecond from '../components/ButtonSecond'
import TextInput from '../components/TextInput';

import { onLoginUser } from '../store/actions/auth'
import { resetErr } from '../store/actions/auth'

import { useFormik } from 'formik';
import * as yup from 'yup';
import { TouchableOpacity } from 'react-native-gesture-handler';


export const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const [errAuth, setErrAuth] = useState(false)

  const emailError = useSelector(state => state.user.loginError)

  const loginUserHandler = (user) => {

    //отправляем объект user с нашими данными
    dispatch(onLoginUser(user))
  }

  useEffect(() => {
    if(emailError) {
      setErrAuth(true)
    }
    console.log('useEffect emailError set true / rerurn set false \n', emailError)
    return () => {
      dispatch(resetErr())
    }
  }, [emailError])

  const LoginSchema = yup.object().shape({
    email: yup.string()
      .email('email should contain @')
      .required('Required'),
      
    password: yup.string()
      .min(8, 'password must contain 8 characters')
      .max(20, 'password must contain no more than 20 characters')
      .required('Required'),
  });

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      email: '', 
      password: '',

    },
    onSubmit: values => loginUserHandler(values)
  });

  return (
    <View style={styles.container}>
    <StatusBar translucent={true} barStyle='dark-content'/>
      <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}} >
          <View style={{flex: 1,}}>
            <View style={styles.boxImg}>
              <Image source={require('../../assets/Logo.png')} style={styles.img}/>
            </View>
            {errAuth == true ? <Text style={styles.error}>Email or password error</Text> : null}
            <View style={{flex: 1}}>
              <View>
                <Text style={styles.placehRight}>Email</Text>
                <TextInput
                  autoCapitalize='none'
                  autoCompleteType='email'
                  keyboardType='email-address'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  onChangeText={handleChange('email')}
                  />
              </View>
                {errors.email && touched.email ? (
                  <Text style={styles.validationError}>{errors.email}</Text>
                ) : null}
              <View>
                <Text style={styles.placehRight}>Password</Text>
                <TextInput
                  secureTextEntry
                  autoCompleteType='password'
                  autoCapitalize='none'
                  keyboardType='default'
                  returnKeyType='send'
                  returnKeyLabel='send'
                  onBlur={handleBlur('password')}
                  error={errors.mobileNumber}
                  touched={touched.mobileNumber}
                  onChangeText={handleChange('password')}
                />
              </View>
              {errors.password && touched.password ? (
                  <Text style={styles.validationError}>{errors.password}</Text>
                ) : null}
              <View style={styles.inner}>
                <Text style={styles.text}>New user?
                </Text>
                <TouchableOpacity
                  style={styles.textwrap}
                  onPress={() => {navigation.navigate('Create profile')}}
                >
                <Text style={styles.textBold}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
            
          <View style={styles.boxButton}>
            <ButtonSecond label='Continue' onPress={handleSubmit}/>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    //paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  boxImg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '20%'
  },
  img: {
    //width: '100%',
    height: 211,
    justifyContent: 'center',
  },
  inner: {
    //backgroundColor: 'green',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',

  },
  textwrap: {
    //backgroundColor: 'red',
    alignSelf: 'flex-start'    
  },
  text: {
    marginVertical: 5,
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  textBold: {
    fontFamily: 'sf-text-medium',
    fontSize: 15,
    lineHeight: 20,
    paddingLeft: 10,
  },
  boxButton: {
    //backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
    marginBottom: 15
  },
  validationError: {
    paddingTop: 5,
    color: '#F64444'
  },
  error: {
    backgroundColor: '#fbc6c2',
    borderWidth: 1,
    borderColor: '#f5554a',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: '#f44336'
  },
  placehRight: {
    position: 'absolute',
    right: 0,
    bottom: '29%',
    color: '#808080',
    fontFamily: 'sf-display-semibold',
    fontSize: 18,
    lineHeight: 22,
  }
});