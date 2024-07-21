import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

type NumberPadProps = {
  onNumberSelect: (item: number | "Clear") => void;
};

const NumberPad: React.FC<NumberPadProps> = ({ onNumberSelect }) => {
  const numbers: (number | "Clear")[][] = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [0, "Clear"],
  ];

  const [pressed, setPressed] = useState<number | "Clear" | null>(null);
  const animatedValues = useRef(
    numbers.flat().map(() => new Animated.Value(0))
  ).current;

  const animateIn = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.pad}>
      {numbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, index) => {
            const flatIndex = rowIndex * 3 + index;
            const scale = animatedValues[flatIndex].interpolate({
              inputRange: [0, 0.8],
              outputRange: [1, 0.8],
            });

            return (
              <TouchableOpacity
                key={item}
                onPressIn={() => {
                  setPressed(item);
                  animateIn(flatIndex);
                }}
                onPressOut={() => {
                  setPressed(null);
                  animateOut(flatIndex);
                  onNumberSelect(item);
                }}
                style={styles.buttonContainer}
              >
                <Animated.View
                  style={[
                    styles.button,
                    item === "Clear" && styles.clearButton,
                    { transform: [{ scale }] },
                  ]}
                >
                  <Text
                    style={[styles.text, item === "Clear" && styles.clearText]}
                  >
                    {typeof item === "number" ? item.toString() : item}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pad: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonContainer: {
    marginHorizontal: 5,
  },
  button: {
    width: 80,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 15,
    borderColor: "#BAD3FF",
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
  },
  clearButton: {
    backgroundColor: "#FF97C2",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  clearText: {
    fontSize: 18,
    color: "white",
  },
});

export default NumberPad;
