import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { persistReducer } from "redux-persist";
import persistConfig from "./persistConfig";

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
});

export default rootReducer;
