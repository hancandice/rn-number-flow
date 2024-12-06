import React, { useEffect } from "react";
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
  shouldChangeColor: boolean;
  duration?: number;
  fadeOut?: boolean;
  fadeIn?: boolean;
  increaseColor: string;
  decreaseColor: string;
  defaultColor: string;
}

const TOTAL_DIGITS = 10; // 0-9

const DIGITS = Array.from(
  { length: TOTAL_DIGITS * 3 },
  (_, i) => i % TOTAL_DIGITS
);

const Digit: React.FC<DigitProps> = ({
  value,
  prevValue,
  direction,
  shouldChangeColor,
  duration = 1000,
  fadeOut = false,
  fadeIn = false,
  increaseColor,
  decreaseColor,
  defaultColor,
}) => {
  const stepHeight = 40; // Each digit's height

  const initialPosition = -(prevValue + TOTAL_DIGITS) * stepHeight;

  const translateY = useSharedValue(initialPosition);
  const opacity = useSharedValue(fadeIn ? 0 : 1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    translateY.value = initialPosition;
    opacity.value = fadeIn ? 0 : 1;
    colorProgress.value = 0;

    const distance =
      direction === "up"
        ? (value + TOTAL_DIGITS - prevValue) % TOTAL_DIGITS
        : (prevValue + TOTAL_DIGITS - value) % TOTAL_DIGITS;

    const targetValue =
      direction === "up"
        ? initialPosition - distance * stepHeight
        : initialPosition + distance * stepHeight;

    // Animate digit position
    translateY.value = withTiming(targetValue, { duration });

    // Handle fadeOut and fadeIn animations
    if (fadeIn) {
      opacity.value = withTiming(1, { duration });
    } else if (fadeOut) {
      opacity.value = withTiming(0, { duration });
    }

    // Start color animation based on direction
    colorProgress.value = shouldChangeColor ? withTiming(1, { duration }) : 1;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => {
    const animatedColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [direction === "up" ? increaseColor : decreaseColor, defaultColor]
    );
    return { color: animatedColor };
  });

  return (
    <View style={styles.digitContainer}>
      <Animated.View style={[styles.animatedDigit, animatedStyle]}>
        {DIGITS.map((digit, index) => (
          <Animated.Text key={index} style={[styles.digit, animatedTextStyle]}>
            {digit}
          </Animated.Text>
        ))}
      </Animated.View>
    </View>
  );
};

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
