// ============================================
// LOADER COMPONENT
// ============================================

import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ViewStyle, Animated, Easing} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = colors.yellow,
  style,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const barWidth = size === 'large' ? 180 : 140;
  const barHeight = size === 'large' ? 3 : 2;

  useEffect(() => {
    // Progress bar animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Opacity pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Dot blinking animations with staggered delays
    const createDotAnimation = (dotAnim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createDotAnimation(dot1Anim, 0).start();
    createDotAnimation(dot2Anim, 200).start();
    createDotAnimation(dot3Anim, 400).start();
  }, [progressAnim, opacityAnim, dot1Anim, dot2Anim, dot3Anim]);

  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth, barWidth],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.appName}>KritiJob</Text>
          <View style={styles.dotsContainer}>
            <Animated.Text style={[styles.dot, {opacity: dot1Anim}]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, {opacity: dot2Anim}]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, {opacity: dot3Anim}]}>.</Animated.Text>
          </View>
        </View>
        <View style={[styles.track, {width: barWidth, height: barHeight}]}>
          <Animated.View
            style={[
              styles.bar,
              {
                width: barWidth * 0.4,
                height: barHeight,
                backgroundColor: color,
                opacity: opacityAnim,
                transform: [{translateX}],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 4,
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  dot: {
    ...typography.h3,
    color: colors.yellow,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  track: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 10,
  },
});
