import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const DailyScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Daily Transactions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DailyScreen;
