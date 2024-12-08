import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NumberFlow from "./NumberFlow";

// Function to format numbers with commas
const formatNumber = (num: string | number): string => {
  const number = typeof num === "string" ? parseFloat(num) : num;
  const formatted = new Intl.NumberFormat("en-US").format(number);

  return formatted;
};

const App: React.FC = () => {
  const [value, setValue] = useState<string>(formatNumber("50000000")); // Initial BTC price as a formatted string
  const [isAutoChanging, setIsAutoChanging] = useState<boolean>(false); // Toggle for auto-change mode

  // Function to generate random price changes
  const generateRandomValue = (currentValue: string): string => {
    const currentNumber = parseFloat(currentValue.replace(/,/g, ""));
    const changePercentage = Math.random() * (10 - 5) + 5; // 5% to 10% change
    const isIncrease = Math.random() > 0.5; // Randomly decide increase or decrease
    const changeAmount = (currentNumber * changePercentage) / 100;
    const newValue = isIncrease
      ? currentNumber + changeAmount
      : currentNumber - changeAmount;
    return formatNumber(newValue.toFixed(2)); // Return as a formatted string
  };

  // Automatically update value every 3 seconds if auto-changing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoChanging) {
      interval = setInterval(() => {
        setValue((prevValue) => generateRandomValue(prevValue));
      }, 1000); // Update every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoChanging]);

  // Handler for button presses
  const handleButtonPress = (action: string) => {
    switch (action) {
      case "start":
        setIsAutoChanging(true);
        break;
      case "stop":
        setIsAutoChanging(false);
        break;
      case "reset":
        setValue(formatNumber("50000000")); // Reset to initial BTC price as a formatted string
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Slot Machine Display */}
      <View style={styles.slotContainer}>
        <NumberFlow
          value={value}
          duration={900}
          defaultColor="purple"
          textStyle={{ fontSize: 60 }}
          stepHeight={60}
          digitWidth={35}
          nonDigitWidth={10}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("start")}
        >
          <Text style={styles.buttonText}>Start Auto Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("stop")}
        >
          <Text style={styles.buttonText}>Stop Auto Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("reset")}
        >
          <Text style={styles.buttonText}>Reset to $50000000</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setValue(formatNumber("1.23"))}
        >
          <Text style={styles.buttonText}>Reset to $1.23</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setValue(formatNumber("52306.57"))}
        >
          <Text style={styles.buttonText}>Reset to $52,306.57</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setValue(formatNumber("62321865.57"))}
        >
          <Text style={styles.buttonText}>Reset to $62,321,865.57</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setValue(formatNumber("60299.57"))}
        >
          <Text style={styles.buttonText}>Reset to $60,299.57</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f6", // 전통 한지 느낌의 배경색
    paddingHorizontal: 20,
  },
  slotContainer: {
    width: "100%",
    height: 100,
    marginVertical: 50,
    padding: 30,
    borderRadius: 15, // 부드러운 곡선
    backgroundColor: "#FAE1D0", // 은은한 살구색 (전통 한복에서 사용되는 색감)
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E11D48", // 밝은 붉은색 (오방색 중 적색)
    shadowColor: "#00000030", // 은은한 그림자
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#FFFFFF", // 순백색 (오방색 중 흰색)
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E3A8A", // 짙은 파랑 테두리
    shadowColor: "#00000020",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A", // 짙은 파랑 텍스트
    textShadowColor: "#00000010",
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
    letterSpacing: 1,
    fontFamily: "Apple SD Gothic Neo", // 한국적인 고딕 서체
  },
});

export default App;
