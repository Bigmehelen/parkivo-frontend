import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://172.16.0.16:8085/api/users', 
    }),
  endpoints: (builder) => ({
    getUser: builder.query({ 
      query: () => '/me',
      method: 'GET',
    }),
  }),
});

export const {useGetUserQuery} = userApi;