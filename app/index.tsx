import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NumberFlow from "./NumberFlow"; // Import the NumberFlow component

const App: React.FC = () => {
  const [value, setValue] = useState<number>(1234); // Initial numeric value
  const [isAutoChanging, setIsAutoChanging] = useState<boolean>(false); // Toggle for auto-change mode

  // Function to generate random numbers
  const generateRandomValue = (): number => {
    const isLargeChange = Math.random() > 0.1; // 10% chance of large or small changes
    if (isLargeChange) {
      return Math.floor(Math.random() * 999999); // Large change
    } else {
      const randomIntPart = Math.floor(Math.random() * 1000);
      const randomDecPart = Math.floor(Math.random() * 100) / 100;
      return parseFloat((randomIntPart + randomDecPart).toFixed(2)); // Small change
    }
  };

  // Automatically update value every second if auto-changing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoChanging) {
      interval = setInterval(() => {
        setValue(generateRandomValue());
      }, 2400); // Update every 2400ms
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      } // Cleanup interval on unmount or when auto-change is disabled
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
      case "max":
        setValue(999999);
        break;
      case "min1":
        setValue(0.01);
        break;
      case "min2":
        setValue(0.02);
        break;
      case "random":
        setValue(generateRandomValue());
        break;
      case "reset":
        setValue(1234.00123);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Number Flow 🎰</Text>
      {/* Slot Machine Display */}
      <View style={styles.slotContainer}>
        <NumberFlow
          value={value}
          duration={2000}
          defaultColor="white"
          increaseColor="#68DBBC"
          decreaseColor="grey"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Auto Change"
          onPress={() => handleButtonPress("start")}
        />
        <Button
          title="Stop Auto Change"
          onPress={() => handleButtonPress("stop")}
        />
        <Button
          title="Increase to Max (999999)"
          onPress={() => handleButtonPress("max")}
        />
        <Button
          title="Decrease to Min (0.01)"
          onPress={() => handleButtonPress("min1")}
        />
        <Button
          title="Decrease to Min (0.02)"
          onPress={() => handleButtonPress("min2")}
        />
        <Button
          title="Random Large Change"
          onPress={() => handleButtonPress("random")}
        />
        <Button
          title="Reset to 1234.00123"
          onPress={() => handleButtonPress("reset")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Dark background for the slot machine
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#f9ff42", // Neon yellow
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
    borderColor: "#ff1493", // Pink neon
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#222", // Slot machine background
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
});

export default App;
