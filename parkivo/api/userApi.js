import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://172.16.0.16:8085/api/users', 
    }),
  endpoints: (builder) => ({
    getUser: builder.query({ 
      query: () => '/me',
    }),
  }),
});

export const {useGetUserQuery} = authApi;