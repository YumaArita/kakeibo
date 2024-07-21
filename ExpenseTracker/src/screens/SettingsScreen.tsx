import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const TodayScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button
        title="Log Out"
        onPress={() => {
          /* ログアウト処理を追加 */
        }}
      />
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

export default TodayScreen;
