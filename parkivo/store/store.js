import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "../api/authApi.js";
import {parkingApi} from "../api/parkingApi.js";
import {setupListeners} from '@reduxjs/toolkit/query';
import authReducer from '../api/authSlice.js';
import {viewApi} from '../api/viewApi.js';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    [authApi.reducerPath]: authApi.reducer,
    [parkingApi.reducerPath]: parkingApi.reducer,
    [viewApi.reducerPath]: viewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, parkingApi.middleware, viewApi.middleware),
});
setupListeners(store.dispatch);