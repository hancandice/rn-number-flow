import React, { memo, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DecimalPoint from "./components/DecimalPoint";
import Digit from "./components/Digit";
interface NumberFlowProps {
  value: number | string;
  duration?: number;
  increaseColor?: string;
  decreaseColor?: string;
  defaultColor?: string;
}

const NumberFlow: React.FC<NumberFlowProps> = memo(
  ({
    value,
    duration = 1000,
    defaultColor = "white",
    increaseColor = "#68DBBC",
    decreaseColor = "grey",
  }) => {
    const prevValueRef = useRef(value);

    useEffect(() => {
      prevValueRef.current = value;
    }, [value]);

    const valueStr = String(value);
    const prevValueStr = String(prevValueRef.current);

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

    const translateX = useSharedValue(0);

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

    // const isDecimalPointDisappearing =
    //   prevValueDecPart.length > 0 && valueDecPart.length === 0;

    // Compute the offset based on disappearing digits
    const offset =
      -(disappearingLeftCount * 40) / 2 + (disappearingRightCount * 40) / 2;

    useDerivedValue(() => {
      translateX.value = withTiming(offset, { duration });
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    let shouldChangeColor = valueIntPart.length !== prevValueIntPart.length;

    const renderDigit = (
      key: string,
      digit: number,
      prevDigit: number,
      index: number,
      isDecimal: boolean
    ) => {
      const isFadingIn = isDecimal
        ? index >= prevValueDecPart.length && prevValueDecDigits[index] === 0
        : index < maxIntLength - prevValueIntPart.length &&
          prevValueIntDigits[index] === 0;

      const isFadingOut = isDecimal
        ? index >= valueDecPart.length
        : index < maxIntLength - valueIntPart.length;

      // Once a difference is detected, animate all subsequent digits (including decimals)
      if (!shouldChangeColor && prevDigit !== digit) {
        shouldChangeColor = true;
      }

      return (
        <Digit
          key={key}
          value={digit}
          prevValue={prevDigit}
          direction={direction}
          shouldChangeColor={shouldChangeColor}
          duration={duration}
          fadeOut={isFadingOut}
          fadeIn={isFadingIn}
          increaseColor={increaseColor}
          decreaseColor={decreaseColor}
          defaultColor={defaultColor}
        />
      );
    };

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Integer Part */}
        {valueIntDigits.map((digit, index) =>
          renderDigit(
            `int-${index}`,
            digit,
            prevValueIntDigits[index],
            index,
            false
          )
        )}

        {/* Decimal Point */}
        {valueDecPart.length > 0 && (
          <DecimalPoint
            direction={direction}
            shouldChangeColor={shouldChangeColor}
            duration={duration}
            fadeOut={prevValueDecPart.length > 0 && valueDecPart.length === 0}
            fadeIn={prevValueDecPart.length === 0 && valueDecPart.length > 0}
            increaseColor={increaseColor}
            decreaseColor={decreaseColor}
            defaultColor={defaultColor}
          />
        )}

        {/* Decimal Part */}
        {valueDecDigits.map((digit, index) =>
          renderDigit(
            `dec-${index}`,
            digit,
            prevValueDecDigits[index],
            index,
            true
          )
        )}
      </Animated.View>
    );
  }
);

NumberFlow.displayName = "NumberFlow";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  decimal: {
    fontSize: 40,
    height: 40,
    textAlign: "center",
  },
});

export default NumberFlow;
