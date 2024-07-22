declare module "expo-font" {
  export function loadAsync(
    nameOrMap: string | { [fontFamily: string]: FontSource }
  ): Promise<void>;
}
