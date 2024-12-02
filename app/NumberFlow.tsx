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
}

const Digit: React.FC<DigitProps> = ({
  value,
  prevValue,
  direction,
  duration = 1000,
}) => {
  const stepHeight = 40; // 각 숫자의 높이
  const totalDigits = 10; // 0~9
  const translateY = useSharedValue(0);

  useEffect(() => {
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

    translateY.value = withTiming(targetValue, { duration }, () => {
      translateY.value = -(value + totalDigits) * stepHeight;
    });
  }, [value, prevValue, direction, duration, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const valueStr = String(value);
  const prevValueStr = String(prevValue);

  // 정수 및 소수점 분리
  const [valueIntPart, valueDecPart = ""] = valueStr.split(".");
  const [prevValueIntPart, prevValueDecPart = ""] = prevValueStr.split(".");

  // 자리수를 패딩 처리해 같은 자리수끼리 비교
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

  // 방향 계산
  const direction =
    parseFloat(valueStr) >= parseFloat(prevValueStr) ? "up" : "down";

  const hasDecimalPart = valueDecPart.length > 0;

  return (
    <View style={styles.container}>
      {/* 정수 부분 */}
      {valueIntDigits.map((digit, index) =>
        index < maxIntLength - valueIntPart.length ? null : (
          <Animated.View
            key={`int-${index}`}
            // exiting={FadeOutRight.duration(duration / 2)} // 빠르게 사라짐
          >
            <Digit
              value={digit}
              prevValue={prevValueIntDigits[index] || 0}
              direction={direction}
              duration={duration}
            />
          </Animated.View>
        )
      )}

      {/* 소수점 */}
      {hasDecimalPart && (
        <Animated.View
          key="decimal"
          // exiting={FadeOutRight.duration(duration / 2)} // 빠르게 사라짐
        >
          <Text style={styles.decimal}>.</Text>
        </Animated.View>
      )}

      {/* 소수 부분 */}
      {valueDecDigits.map((digit, index) =>
        index >= valueDecPart.length ? null : (
          <Animated.View
            key={`dec-${index}`}
            // exiting={FadeOutRight.duration(duration / 2)} // 빠르게 사라짐
          >
            <Digit
              value={digit}
              prevValue={prevValueDecDigits[index] || 0}
              direction={direction}
              duration={duration}
            />
          </Animated.View>
        )
      )}
    </View>
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
