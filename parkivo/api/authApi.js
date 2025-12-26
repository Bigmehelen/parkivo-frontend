import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
// const token = import.meta.env.VITE_API_TOKEN;

export const authApi = createApi({
  reducerPath: "authorizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ""
   
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data)=> ({ 
        url: "/api/register",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
  }),
});

export const {useRegisterUserMutation, useLoginUserMutation} = authApi;