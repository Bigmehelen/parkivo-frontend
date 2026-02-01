import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Handle both { user, token } and { data: { user, token } } structures
      const { user, token, data } = action.payload || {};
      const finalUser = user || data?.user || action.payload?.user;
      const finalToken = token || data?.token || action.payload?.token;

      state.user = finalUser || null;
      state.token = finalToken || null;
      state.isAuthenticated = !!finalToken;

      if (finalToken) {
        AsyncStorage.setItem('token', finalToken);
      }
      if (finalUser) {
        AsyncStorage.setItem('user', JSON.stringify(finalUser));
      }
    },
    hydrate: (state, action) => {
      const { user, token } = action.payload || {};
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = !!token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
