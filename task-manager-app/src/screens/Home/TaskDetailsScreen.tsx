import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Text, Button, Checkbox, useTheme } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import { get } from "lodash";
import {
  fetchTaskAPI,
  updateTask,
  deleteTaskAPI,
} from "../../api/Services/taskService";
import { useLoader } from "../../context/LoaderContext";
import { useToast } from "../../context/ToastContext";
import SaferAreaContainer from "../../components/SaferAreaContainer";
import { useNavigation, useRoute } from "@react-navigation/native";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const taskId = get(route, "params.taskId", "");
  const { colors } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isViewMode, setIsViewMode] = useState(true);
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();

  const fetchTask = async () => {
    try {
      showLoader();
      const taskData = await fetchTaskAPI(taskId);
      setTask(taskData);
      setTitle(get(taskData, "title", ""));
      setDescription(get(taskData, "description", ""));
      setCompleted(get(taskData, "completed", false));
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      hideLoader();
    }
  };

  const toggleCompleted = async () => {
    showLoader();
    if (!task) return;
    await updateTask(taskId, {
      completed: !task.completed,
    })
      .then(() => {
        showToast("Task Status updated successfully!");
        fetchTask();
      })
      .catch((error) => {
        showToast("Error updating task!");
        console.error("Error updating task:", error);
      })
      .finally(() => {
        hideLoader();
      });
  };

  const handleDelete = () => {
    showLoader();
    deleteTaskAPI(taskId)
      .then(() => {
        navigation.goBack();
        showToast("Task delete successfully!");
      })
      .catch((error) => {
        showToast("Error deleting task!");
        console.error("Error deleting task:", error);
      })
      .finally(() => {
        hideLoader();
      });
  };

  const handleUpdateTask = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in both title and description.");
      return;
    }
    showLoader();
    await updateTask(taskId, {
      title,
      description,
      completed,
    })
      .then(() => {
        fetchTask();
        showToast("Task updated successfully!");
      })
      .catch((error) => {
        showToast("Error updating task!");
        console.error("Update Task Error:", error);
      })
      .finally(() => {
        hideLoader();
        setIsViewMode(true);
      });
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) return <Text>Loading...</Text>;

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
              Details
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsViewMode(!isViewMode)}
            style={styles.backIconContainer}
          >
            <Feather
              name={isViewMode ? "edit-2" : "eye"}
              size={20}
              color={"black"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.labelText}>Task Title</Text>
          <TextInput
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            editable={!isViewMode}
          />

          <Text style={styles.labelText}>Task Description</Text>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            editable={!isViewMode}
          />
          <View style={styles.row}>
            <Text style={styles.label}>Task Completion State</Text>
            <Checkbox.Android status={completed ? "checked" : "unchecked"} />
          </View>
        </View>

        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={isViewMode ? toggleCompleted : handleUpdateTask}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            {isViewMode
              ? completed
                ? "Mark as in Complete"
                : "Mark as Complete"
              : "Update"}
          </Button>
        </View>
        <View style={styles.row}>
          {isViewMode && (
            <Button
              mode="contained"
              onPress={handleDelete}
              style={[styles.button, { backgroundColor: colors.error }]}
            >
              Delete Task
            </Button>
          )}
        </View>
      </View>
    </SaferAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  button: { marginVertical: 8, flex: 1 },
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
  title: {
    fontWeight: "bold",
    color: "black",
  },
  bodyContainer: {
    flex: 1,
  },
  labelText: {
    color: "#666",
    fontWeight: "700",
    marginBottom: 4,
  },
  input: {
    height: 50,
    marginBottom: 16,
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
  label: {
    fontSize: 16,
    color: "#0A0A0A",
  },
});

export default TaskDetailsScreen;
