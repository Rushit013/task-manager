import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import { RootState } from "../reduxStore/store";
import { useSelector } from "react-redux";

export default function RootNavigator() {
  const { userToken } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {userToken ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
