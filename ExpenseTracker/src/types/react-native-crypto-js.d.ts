declare module "react-native-crypto-js" {
  export = CryptoJS;
  namespace CryptoJS {
    var AES: CryptoJS.EncryptionAlgo;
    var DES: CryptoJS.EncryptionAlgo;
    var TripleDES: CryptoJS.EncryptionAlgo;
    var RC4: CryptoJS.EncryptionAlgo;
    var Rabbit: CryptoJS.EncryptionAlgo;
    var RabbitLegacy: CryptoJS.EncryptionAlgo;
    var EvpKDF: CryptoJS.KDFAlgo;
    var HmacMD5: CryptoJS.HashAlgo;
    var HmacSHA1: CryptoJS.HashAlgo;
    var HmacSHA256: CryptoJS.HashAlgo;
    var HmacSHA224: CryptoJS.HashAlgo;
    var HmacSHA512: CryptoJS.HashAlgo;
    var HmacSHA384: CryptoJS.HashAlgo;
    var HmacSHA3: CryptoJS.HashAlgo;
    var MD5: CryptoJS.HashAlgo;
    var SHA1: CryptoJS.HashAlgo;
    var SHA256: CryptoJS.HashAlgo;
    var SHA224: CryptoJS.HashAlgo;
    var SHA512: CryptoJS.HashAlgo;
    var SHA384: CryptoJS.HashAlgo;
    var SHA3: CryptoJS.HashAlgo;
    var RIPEMD160: CryptoJS.HashAlgo;
    var PBKDF2: CryptoJS.KDFAlgo;
    var mode: CryptoJS.Mode;
    var pad: CryptoJS.Padding;

    function lib(): any;
    function enc(): any;

    interface HashAlgo {
      (
        message: string | CryptoJS.lib.WordArray,
        key?: string | CryptoJS.lib.WordArray,
        ...options: any[]
      ): CryptoJS.lib.WordArray;
    }

    interface EncryptionAlgo {
      encrypt(
        message: string | CryptoJS.lib.WordArray,
        key: string | CryptoJS.lib.WordArray,
        ...options: any[]
      ): CryptoJS.lib.CipherParams;
      decrypt(
        ciphertext: string | CryptoJS.lib.CipherParams,
        key: string | CryptoJS.lib.WordArray,
        ...options: any[]
      ): CryptoJS.lib.WordArray;
    }

    namespace lib {
      class Base {
        extend(overrides: any): any;
        create(...args: any[]): any;
        mixIn(properties: any): void;
        clone(): any;
        init(): void;
      }

      class WordArray extends Base {
        words: number[];
        sigBytes: number;
        static create(words?: number[], sigBytes?: number): WordArray;
        toString(encoder?: Encoder): string;
        concat(wordArray: WordArray): this;
        clamp(): void;
        clone(): WordArray;
        random(nBytes: number): WordArray;
      }

      class CipherParams extends Base {
        static create(cipherParams: any): CipherParams;
        toString(encoder?: any): string;
      }
    }

    namespace enc {
      var Hex: Encoder;
      var Latin1: Encoder;
      var Utf8: Encoder;
      var Base64: Encoder;

      interface Encoder {
        stringify(wordArray: CryptoJS.lib.WordArray): string;
        parse(str: string): CryptoJS.lib.WordArray;
      }
    }

    namespace mode {
      interface ModeStatic {
        create(): any;
      }
      var CBC: ModeStatic;
      var CFB: ModeStatic;
      var CTR: ModeStatic;
      var CTRGladman: ModeStatic;
      var OFB: ModeStatic;
      var ECB: ModeStatic;
    }

    namespace pad {
      var Pkcs7: Padding;
      var Iso97971: Padding;
      var AnsiX923: Padding;
      var Iso10126: Padding;
      var ZeroPadding: Padding;
      var NoPadding: Padding;

      interface Padding {
        pad(data: CryptoJS.lib.WordArray, blockSize: number): void;
        unpad(data: CryptoJS.lib.WordArray): void;
      }
    }

    namespace format {
      interface Format {
        stringify(cipherParams: CryptoJS.lib.CipherParams): string;
        parse(str: string): CryptoJS.lib.CipherParams;
      }

      var OpenSSL: Format;
      var Hex: Format;
    }

    namespace kdf {
      var OpenSSL: KDFAlgo;

      interface KDFAlgo {
        execute(
          password: string | CryptoJS.lib.WordArray,
          keySize: number,
          ivSize: number,
          salt?: CryptoJS.lib.WordArray
        ): CryptoJS.lib.CipherParams;
      }
    }
  }
}
