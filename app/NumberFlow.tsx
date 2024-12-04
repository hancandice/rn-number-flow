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
}

const Digit: React.FC<DigitProps> = ({
  value,
  prevValue,
  direction,
  duration = 1000,
  fadeOut = false,
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
          <Text key={index} style={styles.digit}>
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
}

const NumberFlow: React.FC<NumberFlowProps> = ({ value, duration = 1000 }) => {
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

  // Calculate how much to move left (based on removed digits)
  useEffect(() => {
    const removedDigitsCount = prevValueIntPart.length - valueIntPart.length;
    if (removedDigitsCount > 0) {
      translateX.value = withTiming(-removedDigitsCount * 40, { duration });
    } else {
      translateX.value = withTiming(0, { duration });
    }
  }, [valueIntPart, prevValueIntPart, translateX, duration]);

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
          <Text style={styles.decimal}>.</Text>
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
