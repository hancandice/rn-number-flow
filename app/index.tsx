import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NumberFlow from "./NumberFlow"; // Import the NumberFlow component

const App: React.FC = () => {
  const [value, setValue] = useState(123.4); // Initial numeric value
  const [isAutoChanging, setIsAutoChanging] = useState(false); // Toggle for auto-change mode

  // Function to generate random numbers for testing
  const generateRandomValue = () => {
    const randomIntPart = Math.floor(Math.random() * 10000); // Generate random integer part
    const randomDecPart = Math.floor(Math.random() * 100) / 100; // Generate random decimal part
    return parseFloat((randomIntPart + randomDecPart).toFixed(2)); // Combine and format
  };

  // Automatically update value every second if auto-changing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoChanging) {
      interval = setInterval(() => {
        setValue(generateRandomValue());
      }, 5000); // Update every second
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      } // Cleanup interval on unmount or when auto-change is disabled
    };
  }, [isAutoChanging]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Jackpot Slot Machine 🎰</Text>
      {/* Slot Machine Display */}
      <View style={styles.slotContainer}>
        <NumberFlow value={value} duration={4000} />
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
        <Button title="Increase to 124.23" onPress={() => setValue(124.23)} />
        <Button title="Decrease to 2123.98" onPress={() => setValue(2123.98)} />
        <Button title="Increase to 9999" onPress={() => setValue(9999)} />
        <Button title="Decrease to 1.23" onPress={() => setValue(1.23)} />
        <Button title="Increase to 5678.9" onPress={() => setValue(5678.9)} />
        <Button
          title="Random Value"
          onPress={() => setValue(generateRandomValue())}
        />
        <Button title="Reset to 0" onPress={() => setValue(0)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  slotContainer: {
    marginVertical: 40,
    height: 50, // Ensure fixed height for consistent alignment
    flexDirection: "row",
    alignItems: "center", // Vertically center items
    justifyContent: "center", // Horizontally center items
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
});

export default App;
