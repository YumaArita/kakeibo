import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");
console.log("Prefix URL:", prefix);

export default {
  prefixes: [prefix, "expensetracker://"],
  config: {
    screens: {
      Verify: "verify",
    },
  },
};
