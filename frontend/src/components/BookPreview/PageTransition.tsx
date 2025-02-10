import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction: 'left' | 'right';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = isVisible
      ? withSpring(0)
      : withSpring(direction === 'left' ? -400 : 400);

    const opacity = isVisible
      ? withTiming(1, { duration: 300 })
      : withTiming(0, { duration: 300 });

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});