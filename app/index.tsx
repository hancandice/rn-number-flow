import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import NumberFlow from "./NumberFlow"; // Import the NumberFlow component

const App: React.FC = () => {
  const [value, setValue] = useState<number>(50000); // Initial BTC price
  const [isAutoChanging, setIsAutoChanging] = useState<boolean>(false); // Toggle for auto-change mode

  // Function to generate random price changes
  const generateRandomValue = (currentValue: number): number => {
    const changePercentage = Math.random() * (10 - 5) + 5; // 5% to 10% change
    const isIncrease = Math.random() > 0.5; // Randomly decide increase or decrease
    const changeAmount = (currentValue * changePercentage) / 100;
    return isIncrease
      ? parseFloat((currentValue + changeAmount).toFixed(2))
      : parseFloat((currentValue - changeAmount).toFixed(2));
  };

  // Automatically update value every 3 seconds if auto-changing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoChanging) {
      interval = setInterval(() => {
        setValue((prevValue) => generateRandomValue(prevValue));
      }, 3000); // Update every 3 seconds
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
        setValue(50000); // Reset to initial BTC price
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>₿ Bitcoin Price Tracker</Text>
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
          <Text style={styles.buttonText}>Reset to $50,000</Text>
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
    backgroundColor: "#1a1a1a", // Dark background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f2a900", // Bitcoin orange
    marginBottom: 20,
  },
  slotContainer: {
    marginVertical: 50,
    padding: 30,
    borderRadius: 10,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f2a900",
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#f2a900", // Bitcoin orange
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a", // Dark text for contrast
  },
});

export default App;
