import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NumberFlow from "./NumberFlow"; // Import the NumberFlow component

const App: React.FC = () => {
  const [value, setValue] = useState(1234); // Initial numeric value
  const [isAutoChanging, setIsAutoChanging] = useState(false); // Toggle for auto-change mode

  // Function to generate random numbers for testing with more dynamic ranges
  const generateRandomValue = () => {
    const isLargeChange = Math.random() > 0.5; // 50% chance of large or small changes
    if (isLargeChange) {
      // Large change: Randomize from 1 to 999999
      return Math.floor(Math.random() * 999999);
    } else {
      // Small change: Randomize from 0.01 to 999.99
      const randomIntPart = Math.floor(Math.random() * 1000);
      const randomDecPart = Math.floor(Math.random() * 100) / 100;
      return parseFloat((randomIntPart + randomDecPart).toFixed(2));
    }
  };

  // Automatically update value every second if auto-changing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoChanging) {
      interval = setInterval(() => {
        setValue(generateRandomValue());
      }, 800); // Update every 800ms
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      } // Cleanup interval on unmount or when auto-change is disabled
    };
  }, [isAutoChanging]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Number Flow 🎰</Text>
      {/* Slot Machine Display */}
      <View style={styles.slotContainer}>
        <NumberFlow value={value} duration={800} color="white" />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Auto Change"
          onPress={() => setIsAutoChanging(true)}
        />
        <Button
          title="Stop Auto Change"
          onPress={() => setIsAutoChanging(false)}
        />
        <Button
          title="Increase to Max (999999)"
          onPress={() => setValue(999999)}
        />
        <Button title="Decrease to Min (0.01)" onPress={() => setValue(0.01)} />
        <Button
          title="Random Large Change"
          onPress={() => setValue(generateRandomValue())}
        />
        <Button title="Reset to 1234" onPress={() => setValue(1234)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // 슬롯머신의 어두운 배경
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#f9ff42", // 네온 노란색
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  slotContainer: {
    marginVertical: 50,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff1493", // 핑크 네온
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#222", // 슬롯머신 내부 배경
    shadowColor: "#ff1493",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#444", // 버튼의 어두운 색상
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "#ff1493",
    shadowColor: "#ff1493",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default App;
