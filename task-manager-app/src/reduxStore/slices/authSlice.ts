import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  userToken: string | null;
  userData: IUserResponse | null;
}

const initialState: AuthState = {
  userToken: null,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: IUserResponse }>
    ) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.user;
    },
    logoutSuccess: (state) => {
      state.userToken = null;
      state.userData = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
