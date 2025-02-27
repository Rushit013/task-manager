import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, FAB, Button } from "react-native-paper";
import { get, isEmpty } from "lodash";
import { fetchTasksAPI } from "../../api/Services/taskService";
import { useIsFocused } from "@react-navigation/native";
import { useLoader } from "../../context/LoaderContext";
import SaferAreaContainer from "../../components/SaferAreaContainer";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import moment from "moment";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const HomeScreen = () => {
  const navigation = useNavigation();

  const isFocused = useIsFocused();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const fetchTasks = async () => {
    try {
      if (isEmpty(tasks)) {
        showLoader();
      }
      const res = await fetchTasksAPI();
      setTasks(res);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // const renderItem = ({ item }: { item: Task }) => {
  //   const isComplete = get(item, "completed", "");
  //   return (
  //     <TouchableOpacity
  //       style={styles.taskItemContainer}
  //       onPress={() => {
  //         navigation.navigate(`TaskDetails`, {
  //           taskId: item?._id,
  //         });
  //       }}
  //     >
  //       <View style={styles.taskItemBodyContainer}>
  //         <Text style={styles.taskItemLabel}>{item.title}</Text>
  //         <Text style={styles.taskItemDescription}>{item.description}</Text>
  //       </View>
  //       <View style={styles.taskItemStatusContainer}>
  //         <View
  //           style={[
  //             styles.taskItemStatusPill,
  //             {
  //               // backgroundColor: item.completed ? "#538490" : "#6F6A70",
  //               backgroundColor: "#04333C",
  //             },
  //           ]}
  //         >
  //           <Text style={styles.taskItemStatusPillText}>
  //             {item.completed ? "Completed" : "Not started"}
  //           </Text>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItem = ({ item }: { item: Task }) => {
    const isComplete = get(item, "completed", "");
    return (
      <TouchableOpacity
        style={[
          styles.taskItemContainer,
          {
            backgroundColor: isComplete ? "#DDE1C0" : "#FFEED5",
          },
        ]}
        onPress={() => {
          navigation.navigate(`TaskDetails`, {
            taskId: item?._id,
          });
        }}
      >
        <View style={styles.taskItemHeader}>
          <View
            style={[
              styles.taskStatusPillContainer,
              {
                backgroundColor: isComplete ? "#89BE63" : "#ff8729",
              },
            ]}
          >
            {isComplete ? (
              <Octicons name="check" color={"#fff"} />
            ) : (
              <Octicons name="dot-fill" />
            )}
            <Text
              style={[
                styles.taskStatusPillText,
                {
                  color: isComplete ? "#fff" : "#000",
                },
              ]}
            >
              {isComplete ? "Completed" : "Not started"}
            </Text>
          </View>
          <Text style={styles.taskTimePillText}>
            {moment(get(item, "createdAt", "")).format("MMM Do YY")}
          </Text>
        </View>

        <View style={styles.taskItemHeader}>
          <Text style={styles.taskTitlePillText}>{item?.title}</Text>

          <View style={styles.taskRightArrowContainer}>
            <Octicons name="chevron-right" size={20} color={"#666"} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SaferAreaContainer>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          My Tasks
        </Text>

        {!isEmpty(tasks) ? (
          <FlatList
            data={tasks}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No tasks at the moment 🙌</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("AddTask" as never)}
              style={styles.button}
            >
              Create a task
            </Button>
          </View>
        )}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("AddTask" as never)}
          label="New Task"
        />
      </View>
    </SaferAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  title: {
    marginVertical: 16,
    fontWeight: "bold",
    color: "black",
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  emptyListContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  emptyListText: {
    color: "black",
    textAlign: "center",
    fontWeight: "700",
    marginVertical: 10,
  },
  button: { marginTop: 16, width: "80%", alignSelf: "center" },
  // taskItemContainer: {
  //   padding: 12,
  //   borderRadius: 8,
  //   backgroundColor: "#F1D5B0",
  //   marginBottom: 16,
  //   flexDirection: "row",
  // },
  // taskItemBodyContainer: {
  //   flex: 1,
  // },
  // taskItemStatusContainer: {
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // taskItemStatusPill: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  // },
  // taskItemStatusPillText: {
  //   fontSize: 12,
  //   color: "#FAD02C",
  // },
  // taskItemLabel: {
  //   fontSize: 18,
  //   color: "black",
  //   fontWeight: "600",
  //   marginBottom: 4,
  // },
  // taskItemDescription: {
  //   fontSize: 16,
  //   color: "#666",
  // },

  //
  taskItemContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F1D5B0",
    marginBottom: 16,
    gap: 8,
  },
  taskItemHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskStatusPillContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  taskStatusPillText: {
    fontSize: 12,
    color: "black",
  },
  taskTimePillText: {
    fontSize: 12,
    color: "#666",
  },
  taskTitlePillText: {
    fontSize: 16,
    color: "#000",
    marginRight: 24,
  },
  taskRightArrowContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

export default HomeScreen;
