import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NumberFlow from "./NumberFlow"; // Import the NumberFlow component

const App: React.FC = () => {
  const [value, setValue] = useState(1234); // Initial numeric value
  const [isAutoChanging, setIsAutoChanging] = useState(false); // Toggle for auto-change mode

  // Function to generate random numbers for testing with more dynamic ranges
  const generateRandomValue = () => {
    const randomIntPart = Math.floor(Math.random() * 100000); // Generate random integer part up to 99999
    const randomDecPart = Math.floor(Math.random() * 100) / 100; // Generate random decimal part
    return parseFloat((randomIntPart + randomDecPart).toFixed(2)); // Combine and format
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
        <NumberFlow value={value} duration={800} />
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
          title="Increase to 99999.99"
          onPress={() => setValue(99999.99)}
        />
        <Button title="Decrease to 0.01" onPress={() => setValue(0.01)} />
        <Button
          title="Random Value"
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
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
  },
  slotContainer: {
    marginVertical: 50,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },
});

export default App;
