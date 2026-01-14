import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../api/authApi";
import {parkingApi} from "../api/parkingApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [parkingApi.reducerPath]: parkingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, parkingApi.middleware),
});