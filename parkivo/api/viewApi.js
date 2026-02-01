import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const viewApi = createApi({
  reducerPath: "viewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://smrt-park-backend.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchParkingSpots: builder.query({
      query: (name) => ({
        url: "/api/parking/search-park-name", // Updated from owner route to user route
        params: { name },
      }),
    }),
  }),
})

export const { useLazySearchParkingSpotsQuery } = viewApi;