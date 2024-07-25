import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const HeaderBackground: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
        start={{ x: 0.01, y: 0.9 }}
        end={{ x: 1, y: 0.06 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

export default HeaderBackground;
