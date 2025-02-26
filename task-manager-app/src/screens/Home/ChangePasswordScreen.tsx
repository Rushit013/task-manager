import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { changePasswordAPI } from "../../api/Services/userService";
import { useLoader } from "../../context/LoaderContext";
import { useToast } from "../../context/ToastContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SaferAreaContainer from "../../components/SaferAreaContainer";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
}

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .min(6, "New Password must be at least 6 characters")
    .required("New Password is required"),
});

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    showLoader();
    changePasswordAPI({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
      .then(() => {
        showToast("Password changed successfully!");
        navigation.goBack();
      })
      .catch((error) => {
        showToast("Something went wrong.");
        console.error("Change Password Error:", error);
      })
      .finally(() => {
        setLoading(false);
        hideLoader();
      });
  };

  return (
    <SaferAreaContainer>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backIconContainer}
          >
            <Ionicons name="chevron-back" size={20} color={"black"} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Change Password
            </Text>
          </View>
        </View>

        <KeyboardAwareScrollView style={styles.bodyContainer}>
          <View style={styles.bodyContainer}>
            <Text style={styles.labelText}>Old Password</Text>
            <Controller
              control={control}
              name="oldPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Old Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    secureTextEntry
                  />
                  {errors.oldPassword && (
                    <Text style={styles.errorText}>
                      {errors.oldPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Text style={styles.labelText}>New Password</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="New Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    secureTextEntry
                  />
                  {errors.newPassword && (
                    <Text style={styles.errorText}>
                      {errors.newPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          buttonColor={theme.colors.primary}
          style={styles.button}
        >
          Update Password
        </Button>
      </View>
    </SaferAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  backIconContainer: {
    height: 34,
    width: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    zIndex: 99,
  },
  headerTitleContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    // marginBottom: 16,
    height: 50,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    borderColor: "#666",
  },
  button: {
    marginTop: 8,
  },
  labelText: {
    color: "#666",
    fontWeight: "700",
    marginBottom: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ChangePasswordScreen;
