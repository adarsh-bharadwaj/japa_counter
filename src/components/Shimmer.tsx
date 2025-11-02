import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  baseColor?: string;      // background base
  highlightColor?: string; // moving light stripe
  duration?: number;       // ms for one sweep
};

const Shimmer: React.FC<Props> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  baseColor = '#E6E8EF',
  highlightColor = '#F6F7FB',
  duration = 1200,
}) => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [duration, translateX]);

  const shimmerWidth = 0.6; // width of the highlight stripe (as fraction of mask size)

  const translate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300], // big enough to sweep across most widths
  });

  return (
    <View style={[{ width, height, overflow: 'hidden', borderRadius, backgroundColor: baseColor }, style]}>
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={<View style={{ backgroundColor: 'black', flex: 1 }} />}
      >
        {/* Base layer */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: baseColor }]} />

        {/* Moving gradient highlight */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: translate }] }]}>
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[baseColor, highlightColor, baseColor]}
            locations={[0, 0.5, 1]}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>
      </MaskedView>
    </View>
  );
};

export default Shimmer;