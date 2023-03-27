import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { THEME } from '../theme'

export default function ButtonSecond({ label, onPress }) {

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: 56,
        borderRadius: 40,
        backgroundColor: THEME.SECOND_COLOR,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={{ 
          fontFamily: 'sf-display-bold',
          fontSize: 18,
          lineHeight: 24,
          color: '#03174C',
          textTransform: 'uppercase'
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}