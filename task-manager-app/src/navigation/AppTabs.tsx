import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/Home/HomeScreen";
import AddTaskScreen from "../screens/Home/AddTaskScreen";
import ProfileScreen from "../screens/Home/ProfileScreen";
import TaskDetailsScreen from "../screens/Home/TaskDetailsScreen";
import ChangePasswordScreen from "../screens/Home/ChangePasswordScreen";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

function BottomTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      labeled={false}
      shifting={false}
      barStyle={{ backgroundColor: theme.colors.surface }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          tabBarLabel: "AddTask",
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="add-circle-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="user" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ headerShown: false, title: "TaskDetails" }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false, title: "ChangePassword" }}
      />
    </Stack.Navigator>
  );
}
