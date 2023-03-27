import React from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

export default function TextInput({ error, touched, ...otherProps }) {
  const validationColor = !touched ? '#ccc' : error ? '#ff002e' : '#8cf2ac';
  return (
    <View
      style={{
        width: '100%',
        height: 55,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomColor: validationColor,
        borderBottomWidth: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <RNTextInput
          underlineColorAndroid='transparent'
          placeholderTextColor='rgba(34, 62, 75, 0.7)'
          style={{
            fontFamily: 'sf-display-semibold',
            fontSize: 18,
            lineHeight: 22,
          }}
          {...otherProps}
        />
      </View>
    </View>
  );
}