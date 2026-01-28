import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../api/authApi.js";
import {parkingApi} from "../api/parkingApi.js";
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../api/authSlice';
import {userApi} from "../api/userApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [parkingApi.reducerPath]: parkingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, parkingApi.middleware),
});
setupListeners(store.dispatch);