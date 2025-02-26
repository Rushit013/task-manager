import React, { createContext, useState, ReactNode, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export interface LoaderContextType {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      <GlobalLoader />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

const GlobalLoader: React.FC = () => {
  const { loading } = useContext(LoaderContext);
  const theme = useTheme();

  if (!loading) return null;

  return (
    <View style={styles.loaderContainer} pointerEvents="box-none">
      <ActivityIndicator
        animating
        size="large"
        color={theme.colors.background}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
});

export default LoaderProvider;
