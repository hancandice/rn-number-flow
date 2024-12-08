import React, { memo, useEffect, useRef } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DecimalPoint from "./components/DecimalPoint";
import Digit from "./components/Digit";
import ThousandsSeparator from "./components/ThousandsSeparator";
import { DIGIT_WIDTH, NON_DIGIT_WIDTH, STEP_HEIGHT } from "./constants";
import parseNumber from "./utils/parseNumber";
interface NumberFlowProps {
  value: number | string;
  duration?: number;
  increaseColor?: string;
  decreaseColor?: string;
  defaultColor?: string;
  digitWidth?: number;
  nonDigitWidth?: number;
  stepHeight?: number;
  textStyle?: StyleProp<TextStyle>;
}

const NumberFlow = memo(
  ({
    value,
    duration = 1000,
    defaultColor = "white",
    increaseColor = "#68DBBC",
    decreaseColor = "grey",
    digitWidth = DIGIT_WIDTH,
    nonDigitWidth = NON_DIGIT_WIDTH,
    stepHeight = STEP_HEIGHT,
    textStyle,
  }: NumberFlowProps) => {
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

    const valueIntDigits = paddedValueInt
      .split("")
      .map((char) => (isNaN(Number(char)) ? char : Number(char)));

    const prevValueIntDigits = paddedPrevValueInt
      .split("")
      .map((char) => (isNaN(Number(char)) ? char : Number(char)));

    const valueDecDigits = paddedValueDec
      .split("")
      .map((char) => (isNaN(Number(char)) ? char : Number(char)));

    const prevValueDecDigits = paddedPrevValueDec
      .split("")
      .map((char) => (isNaN(Number(char)) ? char : Number(char)));

    const direction =
      parseNumber(value) >= parseNumber(prevValueRef.current) ? "up" : "down";

    const translateX = useSharedValue(0);

    // Calculate disappearing digits on the left (integer part)
    const disappearingLeftCount = valueIntDigits.reduce(
      (count: number, _, index: number) =>
        index < maxIntLength - valueIntPart.length ? count + 1 : count,
      0
    );

    const prevNonNumericCount = prevValueIntDigits.filter((digit) =>
      isNaN(Number(digit))
    ).length;

    // Calculate disappearing digits on the right (decimal part)
    const disappearingRightCount = valueDecDigits.reduce(
      (count: number, _, index: number) =>
        index >= valueDecPart.length ? count + 1 : count,
      0
    );

    // Check if the decimal point is disappearing
    const isDecimalPointDisappearing =
      prevValueDecPart.length > 0 && valueDecPart.length === 0;

    // Compute the offset based on disappearing digits
    const leftOffset = -(disappearingLeftCount * digitWidth);
    const rightOffset = disappearingRightCount * digitWidth;
    const decimalAdjustment = isDecimalPointDisappearing ? nonDigitWidth : 0;
    const nonNumericAdjustment =
      disappearingLeftCount > 0
        ? prevNonNumericCount * (digitWidth - nonDigitWidth)
        : 0;

    const offset =
      (leftOffset + rightOffset + decimalAdjustment + nonNumericAdjustment) / 2;

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
          width={digitWidth}
          height={stepHeight}
          textStyle={textStyle}
        />
      );
    };

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Integer Part */}
        {valueIntDigits.map((digit, index) => {
          const prevDigit = prevValueIntDigits[index];
          if (typeof digit === "number" && typeof prevDigit === "number") {
            return renderDigit(`int-${index}`, digit, prevDigit, index, false);
          }
          return (
            <ThousandsSeparator
              key={`thousands-separator-${index}`}
              direction={direction}
              shouldChangeColor={shouldChangeColor}
              duration={duration}
              fadeOut={index < maxIntLength - valueIntPart.length}
              fadeIn={
                index < maxIntLength - prevValueIntPart.length &&
                prevDigit === 0
              }
              increaseColor={increaseColor}
              decreaseColor={decreaseColor}
              defaultColor={defaultColor}
              width={nonDigitWidth}
              height={stepHeight}
              textStyle={textStyle}
            />
          );
        })}

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
            width={nonDigitWidth}
            height={stepHeight}
            textStyle={textStyle}
          />
        )}

        {/* Decimal Part */}
        {valueDecDigits.map((digit, index) => {
          if (
            typeof digit === "number" &&
            typeof prevValueDecDigits[index] === "number"
          ) {
            return renderDigit(
              `dec-${index}`,
              digit,
              prevValueDecDigits[index],
              index,
              true
            );
          }
        })}
      </Animated.View>
    );
  }
);

NumberFlow.displayName = "NumberFlow";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NumberFlow;
