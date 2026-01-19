import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../api/authApi.js";
import {parkingApi} from "../api/parkingApi.js";
import {userApi} from "../api/userApi.js";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [parkingApi.reducerPath]: parkingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, parkingApi.middleware),
});