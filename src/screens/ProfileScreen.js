import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, StatusBar, Alert, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { onRegistrationUser } from '../store/actions/auth'
import { resetErr } from '../store/actions/auth'
import { THEME } from '../theme';
import { PhotoPicker } from '../components/PhotoPicker';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TextInput from '../components/TextInput';
import ButtonMain from '../components/ButtonMain';


export const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch()  
  const [errAuth, setErrAuth] = useState(false)
  //checkbox
  const [toggleCheckBox, setToggleCheckBox] = useState(true)
  //imgPick
  const [image, setImage] = useState(null)

  const emailError = useSelector(state => state.user.loginError)

  useEffect(() => {
    if(emailError) {
      setErrAuth(true)
    }
    console.log('useEffect emailError set true / rerurn set false \n', emailError)
    return () => {
      dispatch(resetErr())
    }
  }, [emailError])

  const regUserHandler = (user) => {

    if(!toggleCheckBox) {

      Alert.alert(
        "checkbox alert",
        "Accept Terms & Conditions",
        [
          {
            text: "ok",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          //{ text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      )
      return
    }
    user.img = image
    //отправляем объект user с нашими данными
    dispatch(onRegistrationUser(user))
  }

  const photoPickHandler = (uri) => {
    setImage(uri)
    console.log('uri', uri)
  }

  const LoginSchema = yup.object().shape({
    firstName: yup.string()
      .required('Required'),

    lastName: yup.string()
      .required('Required'),
      
    email: yup.string()
      .email('email should contain @')
      .required('Required'),
      
    mobileNumber: yup.string()
      .required('Required')
      .max(20, 'mobile number must contain no more than 20 characters'),

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
      firstName: '', 
      lastName: '', 
      email: '', 
      mobileNumber: '',
      password: '',
    },
    onSubmit: values => regUserHandler(values)
  });

  return (
    <View
      //behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
    <StatusBar backgroundColor={THEME.MAIN_COLOR} barStyle='light-content' />
    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}} >
        <View style={{flex: 1}}>
          <PhotoPicker onPick={photoPickHandler} />
          {errAuth == true ? <Text style={styles.error}>Email error</Text> : null}
          <View>
            <View>
              <Text style={styles.placehRight}>First name</Text>
              <TextInput
                autoCompleteType='name'
                returnKeyType='next'
                returnKeyLabel='next'
                onBlur={handleBlur('firstName')}
                error={errors.firstName}
                touched={touched.firstName}
                onChangeText={handleChange('firstName')}
              />
            </View>
            <View>
            <Text style={styles.placehRight}>Last name</Text>
              <TextInput
                autoCompleteType='name'
                returnKeyType='next'
                returnKeyLabel='next'
                onBlur={handleBlur('lastName')}
                error={errors.lastName}
                touched={touched.lastName}
                onChangeText={handleChange('lastName')}
              />
            </View>
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
              <Text style={styles.placehRight}>Mobile number</Text>
              <TextInput
                maxLength={20}
                autoCompleteType='tel'
                autoCapitalize='none'
                keyboardType='phone-pad'
                returnKeyType='send'
                returnKeyLabel='send'
                onBlur={handleBlur('mobileNumber')}
                error={errors.mobileNumber}
                touched={touched.mobileNumber}
                onChangeText={handleChange('mobileNumber')}
              />
            </View>
              {errors.mobileNumber && touched.mobileNumber ? (
                  <Text style={styles.validationError}>{errors.mobileNumber}</Text>
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
                  error={errors.password}
                  touched={touched.password}
                  onChangeText={handleChange('password')}
                />
              </View>
            {errors.password && touched.password ? (
              <Text style={styles.validationError}>{errors.password}</Text>
            ) : null}
            <View style={styles.check}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                tintColors={{ true: THEME.MAIN_COLOR, false: '#808080' }}
              />
              <Text style={styles.text}>I Accept ArtTours NY <Text style={styles.textBold} onPress={() => {console.log('clic')}}>Terms & Conditions</Text></Text>
            </View>
          </View>
          </View>
          
          <View style={styles.terms}>
            <ButtonMain label='Continue' onPress={handleSubmit}/>
          </View>
      </ScrollView>
    </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  inner: {
    flex: 1,
  },
  text: {
    fontFamily: 'sf-text-regular',
    fontSize: 15,
    lineHeight: 20,
  },
  textBold: {
    fontFamily: 'sf-text-medium',
    fontSize: 15,
    lineHeight: 20,
  },
  terms: {
    alignItems: 'center',
    paddingBottom: 20
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 15
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
})