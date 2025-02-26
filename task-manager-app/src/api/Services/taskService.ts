import axiosInstance from "../axiosInstance";

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const fetchTasksAPI = async () => {
  const response = await axiosInstance.get(`/tasks`);
  return response.data;
};

export const fetchTaskAPI = async (taskId: string) => {
  const response = await axiosInstance.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId: string, data: UpdateTaskData) => {
  const response = await axiosInstance.put(`/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTaskAPI = async (taskId: string) => {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response.data;
};

export const createTaskAPI = async (data: UpdateTaskData) => {
  const response = await axiosInstance.post(`/tasks`, data);
  return response.data;
};
