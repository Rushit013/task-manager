import React, { ReactNode } from "react";
import { Platform, View, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SaferAreaContainerProps {
  children: ReactNode;
}

const SaferAreaContainer: React.FC<SaferAreaContainerProps> = ({
  children,
}) => {
  if (Platform.OS === "ios") {
    return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
  }

  return (
    <View
      style={[styles.container, { paddingTop: StatusBar.currentHeight || 0 }]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default SaferAreaContainer;
