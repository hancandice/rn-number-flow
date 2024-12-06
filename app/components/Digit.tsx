import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DigitProps {
  value: number;
  prevValue: number;
  direction: "up" | "down";
  animated: boolean;
  duration?: number;
  fadeOut?: boolean;
  fadeIn?: boolean;
  increaseColor: string;
  decreaseColor: string;
  defaultColor: string;
}

const Digit: React.FC<DigitProps> = memo(
  ({
    value,
    prevValue,
    direction,
    animated,
    duration = 1000,
    fadeOut = false,
    fadeIn = false,
    increaseColor,
    decreaseColor,
    defaultColor,
  }) => {
    const stepHeight = 40; // Each digit's height
    const totalDigits = 10; // 0-9
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(fadeIn ? 0 : 1);
    const animationProgress = useSharedValue(0); // For color interpolation

    useEffect(() => {
      opacity.value = fadeIn ? 0 : 1;

      const initialPosition = -(prevValue + totalDigits) * stepHeight;
      translateY.value = initialPosition;

      const distance =
        direction === "up"
          ? (value + totalDigits - prevValue) % totalDigits
          : (prevValue + totalDigits - value) % totalDigits;

      const targetValue =
        direction === "up"
          ? initialPosition - distance * stepHeight
          : initialPosition + distance * stepHeight;

      // Animate digit position
      translateY.value = withTiming(targetValue, { duration });

      // Handle fadeOut and fadeIn animations
      if (fadeOut) {
        opacity.value = withTiming(0, { duration });
      }
      if (fadeIn) {
        opacity.value = withTiming(1, { duration });
      }

      // Start color animation based on direction
      animationProgress.value = 0;
      if (!animated) {
        animationProgress.value = 1;
      }
      animationProgress.value = withTiming(1, { duration });
    }, [
      animated,
      animationProgress,
      direction,
      duration,
      fadeIn,
      fadeOut,
      opacity,
      prevValue,
      translateY,
      value,
    ]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    const animatedTextStyle = useAnimatedStyle(() => {
      const animatedColor = interpolateColor(
        animationProgress.value,
        [0, 1],
        [direction === "up" ? increaseColor : decreaseColor, defaultColor]
      );
      return { color: animatedColor };
    });

    const digits = useMemo(
      () => Array.from({ length: totalDigits * 3 }, (_, i) => i % totalDigits),
      []
    );

    return (
      <View style={styles.digitContainer}>
        <Animated.View style={[styles.animatedDigit, animatedStyle]}>
          {digits.map((digit, index) => (
            <Animated.Text
              key={index}
              style={[styles.digit, animatedTextStyle]}
            >
              {digit}
            </Animated.Text>
          ))}
        </Animated.View>
      </View>
    );
  }
);

Digit.displayName = "Digit";

export default Digit;

const styles = StyleSheet.create({
  digitContainer: {
    width: 40,
    height: 40,
    overflow: "hidden",
    alignItems: "center",
  },
  animatedDigit: {
    position: "absolute",
  },
  digit: {
    fontSize: 30,
    height: 40,
    textAlign: "center",
  },
});
