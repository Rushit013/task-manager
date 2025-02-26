import React, { createContext, ReactNode } from "react";
import { loginAPI, signupAPI } from "../api/Services/userService";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess } from "../reduxStore/slices/authSlice";

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    loginAPI({
      email,
      password,
    })
      .then(async (res) => {
        const token = get(res, "token");
        const user = get(res, "user");
        if (token && user) {
          dispatch(loginSuccess({ token, user }));
        }
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const signup = async (name: string, email: string, password: string) => {
    signupAPI({
      name,
      email,
      password,
    })
      .then(async (res) => {
        await login(email, password);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const logout = async () => {
    dispatch(logoutSuccess());
  };

  return (
    <AuthContext.Provider value={{ login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
