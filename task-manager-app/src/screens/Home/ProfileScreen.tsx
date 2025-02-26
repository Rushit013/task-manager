import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, List, useTheme, Button } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { get, random } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";

const HEADER_HEIGHT = 270;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const { userData } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  const userName = get(userData, "name", "");
  const userEmail = get(userData, "email", "");
  const randomNumber = random(1, 100);
  const userAvatar = `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;

  const handleResetPassword = () => {
    console.log("Reset Password Clicked");
    navigation.navigate("ChangePassword" as never);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <Text variant="titleMedium" style={styles.userName}>
            {userName}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.userEmail, { color: theme.colors.secondary }]}
          >
            {userEmail}
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <List.Section style={styles.options}>
          <List.Item
            title="Change Password"
            titleStyle={{ color: theme.colors.outlineVariant }}
            style={styles.listItemContainer}
            left={(props) => (
              <List.Icon
                {...props}
                icon="key-outline"
                color={theme.colors.primary}
              />
            )}
            onPress={handleResetPassword}
          />
        </List.Section>

        <Button mode="contained" onPress={logout} style={styles.logoutButton}>
          Logout
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    height: HEADER_HEIGHT,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  userInfoContainer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginBottom: 8,
  },
  userName: {
    fontWeight: "bold",
  },
  userEmail: {
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  logoutButton: {
    width: "100%",
    marginBottom: 8,
  },
  options: {
    flex: 1,
    width: "100%",
  },
  listItemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
