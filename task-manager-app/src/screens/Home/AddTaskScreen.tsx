import React from "react";
import { View, StyleSheet, TextInput, Platform } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createTaskAPI } from "../../api/Services/taskService";
import { useLoader } from "../../context/LoaderContext";
import { useToast } from "../../context/ToastContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SaferAreaContainer from "../../components/SaferAreaContainer";
import { get } from "lodash";

interface CreateTaskFormData {
  title: string;
  description: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Task title is required"),
  description: yup.string().required("Task description is required"),
});

const CreateTaskScreen = () => {
  const navigation = useNavigation();
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: yupResolver(schema),
  });

  const handleCreateTask = async (data: CreateTaskFormData) => {
    showLoader();
    createTaskAPI({ title: data?.title, description: data?.description })
      .then(() => {
        navigation.goBack();
        showToast("Task created successfully!");
        reset();
      })
      .catch((error) => {
        const errorText = get(
          error,
          "response.data.error",
          get(error, "message", "")
        );
        showToast(`Error deleting task: ${errorText}`);
        console.error("Error deleting task:", error);
      })
      .finally(() => {
        hideLoader();
      });
  };

  return (
    <SaferAreaContainer>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Task
        </Text>

        <KeyboardAwareScrollView style={styles.bodyContainer}>
          <View style={styles.bodyContainer}>
            <Text style={styles.labelText}>Task Title</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Task Title"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}
                </View>
              )}
            />

            <Text style={styles.labelText}>Task Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Description"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={4}
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>
                      {errors.description.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          mode="contained"
          onPress={handleSubmit(handleCreateTask)}
          style={styles.button}
        >
          Create Task
        </Button>
        <Button
          mode="text"
          textColor="gray"
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
      </View>
    </SaferAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? -16 : 16,
  },
  title: {
    marginVertical: 16,
    fontWeight: "bold",
    color: "black",
  },
  header: {
    marginBottom: 24,
    textAlign: "center",
  },
  bodyContainer: {
    flex: 1,
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
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#0A0A0A",
  },
  button: {
    marginBottom: 16,
  },
  cancelText: {
    color: "black",
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

export default CreateTaskScreen;
