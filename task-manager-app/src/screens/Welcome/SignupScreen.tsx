import React, { useContext } from "react";
import { View, StyleSheet, Image, TextInput } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { useLoader } from "../../context/LoaderContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function SignupScreen({ navigation }: any) {
  const theme = useTheme();
  const { signup } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const handleSignup = async (data: SignupFormData) => {
    try {
      showLoader();
      await signup(data?.name, data?.email, data?.password);
    } catch (error) {
      console.error("Signup error:", error);
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
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text variant="headlineSmall" style={styles.title}>
            Create an Account
          </Text>
          <Text style={styles.subtitle}>
            Join to Make your job easier with your task list
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

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
                  keyboardType="email-address"
                  autoCapitalize="none"
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(handleSignup)}
            buttonColor={theme.colors.primary}
            textColor="#000"
            style={styles.button}
          >
            Sign Up
          </Button>

          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <Text
              style={[styles.link, { marginLeft: 4 }]}
              onPress={() => navigation.navigate("Login")}
            >
              Login
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
  bodyScrollContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  illustration: {
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
