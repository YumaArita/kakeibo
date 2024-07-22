declare module "i18n-js" {
  interface I18n {
    translations: { [key: string]: object };
    locale: string;
    defaultLocale: string;
    fallbacks: boolean;
    t(key: string, options?: object): string;
  }

  const I18n: I18n;
  export default I18n;
}
