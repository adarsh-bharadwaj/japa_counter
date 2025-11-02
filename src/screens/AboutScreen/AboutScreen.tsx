import React from 'react';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Text style={{ fontWeight: '800', fontSize: 22 }}>About</Text>
      <Text>Japa Counter helps you track repetitions, targets, and daily progress with a beautiful UI.</Text>
    </View>
  );
}
