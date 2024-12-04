import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DigitProps {
  value: number;
  prevValue: number;
  direction: "up" | "down";
  duration?: number;
  fadeOut?: boolean;
  color: string;
}

const Digit: React.FC<DigitProps> = ({
  value,
  prevValue,
  direction,
  duration = 1000,
  fadeOut = false,
  color,
}) => {
  const stepHeight = 40; // Each digit's height
  const totalDigits = 10; // 0-9
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Reset opacity to 1 when the digit changes
    opacity.value = 1;

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

    translateY.value = withTiming(targetValue, { duration });

    // Fade out if required
    if (fadeOut) {
      opacity.value = withTiming(0, { duration });
    }
  }, [direction, duration, fadeOut, opacity, prevValue, translateY, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: fadeOut ? opacity.value : 1,
  }));

  const digits = Array.from(
    { length: totalDigits * 3 },
    (_, i) => i % totalDigits
  );

  return (
    <View style={styles.digitContainer}>
      <Animated.View style={[styles.animatedDigit, animatedStyle]}>
        {digits.map((digit, index) => (
          <Text key={index} style={[styles.digit, { color }]}>
            {digit}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

interface NumberFlowProps {
  value: number;
  duration?: number;
  color?: string;
}

const NumberFlow: React.FC<NumberFlowProps> = ({
  value,
  duration = 1000,
  color = "black",
}) => {
  const prevValueRef = useRef(value);
  const prevValue = prevValueRef.current;

  // Track `translateX` for left movement
  const translateX = useSharedValue(0);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const valueStr = String(value);
  const prevValueStr = String(prevValue);

  // Split integer and decimal parts
  const [valueIntPart, valueDecPart = ""] = valueStr.split(".");
  const [prevValueIntPart, prevValueDecPart = ""] = prevValueStr.split(".");

  const maxIntLength = Math.max(valueIntPart.length, prevValueIntPart.length);
  const paddedValueInt = valueIntPart.padStart(maxIntLength, "0");
  const paddedPrevValueInt = prevValueIntPart.padStart(maxIntLength, "0");

  const maxDecLength = Math.max(valueDecPart.length, prevValueDecPart.length);
  const paddedValueDec = valueDecPart.padEnd(maxDecLength, "0");
  const paddedPrevValueDec = prevValueDecPart.padEnd(maxDecLength, "0");

  const valueIntDigits = paddedValueInt.split("").map(Number);
  const prevValueIntDigits = paddedPrevValueInt.split("").map(Number);

  const valueDecDigits = paddedValueDec.split("").map(Number);
  const prevValueDecDigits = paddedPrevValueDec.split("").map(Number);

  const direction =
    parseFloat(valueStr) >= parseFloat(prevValueStr) ? "up" : "down";

  useEffect(() => {
    // Calculate disappearing digits on the left (integer part)
    const disappearingLeftCount = valueIntDigits.reduce(
      (count, _, index) =>
        index < maxIntLength - valueIntPart.length ? count + 1 : count,
      0
    );

    // Calculate disappearing digits on the right (decimal part)
    const disappearingRightCount = valueDecDigits.reduce(
      (count, _, index) => (index >= valueDecPart.length ? count + 1 : count),
      0
    );

    // Check if the decimal point is disappearing
    const isDecimalPointDisappearing =
      prevValueDecPart.length > 0 && valueDecPart.length === 0;

    // Log the disappearing counts for debugging
    console.log({
      disappearingLeftCount,
      disappearingRightCount,
      isDecimalPointDisappearing,
    });

    // Compute the offset based on disappearing digits
    const offset =
      -(disappearingLeftCount * 40) / 2 + (disappearingRightCount * 40) / 2;

    // Animate translateX to adjust positioning
    translateX.value = withTiming(offset, { duration });
  }, [
    duration,
    maxIntLength,
    prevValueDecPart.length,
    translateX,
    valueDecDigits,
    valueDecPart.length,
    valueIntDigits,
    valueIntPart.length,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderDigit = (
    digit: number,
    prevDigit: number,
    isFadingOut: boolean,
    key: string
  ) => (
    <Animated.View key={key}>
      <Digit
        value={digit}
        prevValue={prevDigit}
        direction={direction}
        duration={duration}
        fadeOut={isFadingOut}
        color={color}
      />
    </Animated.View>
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Integer Part */}
      {valueIntDigits.map((digit, index) =>
        renderDigit(
          digit,
          prevValueIntDigits[index] || 0,
          index < maxIntLength - valueIntPart.length,
          `int-${index}`
        )
      )}

      {/* Decimal Point */}
      {valueDecPart.length > 0 && (
        <Animated.View key="decimal">
          <Text style={[styles.decimal, { color }]}>.</Text>
        </Animated.View>
      )}

      {/* Decimal Part */}
      {valueDecDigits.map((digit, index) =>
        renderDigit(
          digit,
          prevValueDecDigits[index] || 0,
          index >= valueDecPart.length,
          `dec-${index}`
        )
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
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
  decimal: {
    fontSize: 30,
    height: 40,
    textAlign: "center",
    lineHeight: 40,
  },
});

export default NumberFlow;
