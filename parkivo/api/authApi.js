import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
// const token = import.meta.env.VITE_API_TOKEN;

export const authApi = createApi({
  reducerPath: "authorizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://172.16.0.16:8085/api/auth"
   
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data)=> ({ 
        url: "/register",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
  }),
});

export const {useRegisterUserMutation, useLoginUserMutation, useGetUserQuery} = authApi;