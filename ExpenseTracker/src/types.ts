import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { DrawerScreenProps } from "@react-navigation/drawer";

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<DrawerParamList>;
  DrawerNavigator: undefined;
  Signup: undefined;
};

export type DrawerParamList = {
  MainScreens: NavigatorScreenParams<TabParamList>;
  // 他のドロワー画面があればここに追加
};

export type TabParamList = {
  Home: undefined;
  Daily: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
export type MyDrawerScreenProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;
