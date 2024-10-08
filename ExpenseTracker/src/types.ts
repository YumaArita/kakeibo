import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { DrawerScreenProps } from "@react-navigation/drawer";

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<DrawerParamList>;
  DrawerNavigator: undefined;
  Signup: undefined;
  Verify: { token: string };
};

export type DrawerParamList = {
  MainScreens: NavigatorScreenParams<TabParamList>;
};

export type TabParamList = {
  Home: undefined;
  Daily: undefined;
  Settings: undefined;
  Group: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
export type MyDrawerScreenProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;
