import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DigitProps {
  direction: "up" | "down";
  shouldChangeColor: boolean;
  duration?: number;
  fadeOut?: boolean;
  fadeIn?: boolean;
  increaseColor: string;
  decreaseColor: string;
  defaultColor: string;
}

const DecimalPoint: React.FC<DigitProps> = ({
  direction,
  shouldChangeColor,
  duration = 1000,
  fadeOut = false,
  fadeIn = false,
  increaseColor,
  decreaseColor,
  defaultColor,
}) => {
  const opacity = useSharedValue(fadeIn ? 0 : 1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    opacity.value = fadeIn ? 0 : 1;
    colorProgress.value = 0;

    if (fadeIn) {
      opacity.value = withTiming(1, { duration });
    } else if (fadeOut) {
      opacity.value = withTiming(0, { duration });
    }

    colorProgress.value = shouldChangeColor ? withTiming(1, { duration }) : 1;
  });

  const animatedStyle = useAnimatedStyle(() => ({
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
    <View style={styles.container}>
      <Animated.View style={[styles.animatedDigit, animatedStyle]}>
        <Animated.Text style={[styles.digit, animatedTextStyle]}>
          .
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

export default DecimalPoint;

const styles = StyleSheet.create({
  container: {
    width: 5,
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
