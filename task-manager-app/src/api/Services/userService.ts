import axiosInstance from "../axiosInstance";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const loginAPI = async (data: LoginData) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const signupAPI = async (data: SignupData) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const changePasswordAPI = async (data: ChangePasswordData) => {
  const response = await axiosInstance.put("/auth/change-password", data);
  return response.data;
};
