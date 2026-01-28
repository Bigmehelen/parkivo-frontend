import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://smrt-park-backend.onrender.com/api/users',
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error fetching token from storage:", error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/me',
    }),
  }),
});

export const { useGetUserQuery } = userApi;