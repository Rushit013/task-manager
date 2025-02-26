import React, { useContext } from "react";
import { View, StyleSheet, Image, TextInput } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { useLoader } from "../../context/LoaderContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }: any) {
  const theme = useTheme();
  const { login } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      showLoader();
      await login(data?.email, data?.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.bodyScrollContainer}
      >
        <View style={styles.bodyContainer}>
          <Image
            source={require("../../assets/todo_illustration.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text variant="headlineSmall" style={styles.title}>
            Welcome to TASK!
          </Text>
          <Text style={styles.subtitle}>
            Make your job easier with your task list
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            buttonColor={theme.colors.primary}
            textColor="#000"
            style={styles.button}
            onPress={handleSubmit(handleLogin)}
          >
            Login
          </Button>

          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Don't have an account?</Text>
            <Text
              style={[styles.link, { marginLeft: 4 }]}
              onPress={() => navigation.navigate("Signup")}
            >
              Register!
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  logo: {
    height: 140,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  bodyScrollContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    borderColor: "#666",
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  link: {
    color: "#FECF3A",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  bottomText: {
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
