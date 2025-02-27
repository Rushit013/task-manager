// App.tsx
import React from "react";
import { Provider as PaperProvider, MD3DarkTheme } from "react-native-paper";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import LoaderProvider from "./src/context/LoaderContext";
import ToastProvider from "./src/context/ToastContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/reduxStore/store";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const theme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#FDD835",
      background: "#0A0A0A",
      surface: "#121212",
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <PaperProvider theme={theme}>
            <LoaderProvider>
              <ToastProvider>
                <StatusBar
                  style="dark"
                  translucent
                  backgroundColor="transparent"
                />
                <RootNavigator />
              </ToastProvider>
            </LoaderProvider>
          </PaperProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
