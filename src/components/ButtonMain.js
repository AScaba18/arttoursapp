import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { THEME, SIZE } from '../theme'

export default function ButtonMain({ label, onPress }) {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: 56,
        borderRadius: 40,
        backgroundColor: THEME.MAIN_COLOR,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={{ 
          fontFamily: 'sf-display-bold',
          fontSize: 18,
          lineHeight: 24,
          textTransform: 'uppercase',
          color: '#fff'
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}