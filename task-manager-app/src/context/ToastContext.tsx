import React, { createContext, useState, ReactNode, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Snackbar } from "react-native-paper";

const { height } = Dimensions.get("screen");
export interface ToastContextType {
  toastMessage: string;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  toastMessage: "",
  showToast: () => {},
  hideToast: () => {},
});

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string>("");

  const showToast = (message: string) => setToastMessage(message);
  const hideToast = () => setToastMessage("");

  return (
    <ToastContext.Provider value={{ toastMessage, showToast, hideToast }}>
      {children}
      <GlobalToast />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const GlobalToast: React.FC = () => {
  const { toastMessage, hideToast } = useContext(ToastContext);
  return (
    <Snackbar
      visible={toastMessage !== ""}
      onDismiss={hideToast}
      duration={3000}
      style={styles.snackbar}
    >
      {toastMessage}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: height * 0.17,
    left: 16,
    right: 16,
    backgroundColor: "#d7eca2",
  },
});

export default ToastProvider;
