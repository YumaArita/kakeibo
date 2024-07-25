import "react-native-toast-message";
import { ReactElement } from "react";

declare module "react-native-toast-message" {
  export interface ToastProps {
    config?: any;
    ref?: ((ref: any) => void) | React.RefObject<any>;
  }

  export default function Toast(props: ToastProps): ReactElement;
}
