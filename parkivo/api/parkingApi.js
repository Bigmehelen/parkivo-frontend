import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parkingApi = createApi({
  reducerPath: "parkingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "" // Add your backend URL here
  }),
  endpoints: (builder) => ({
    getNearbyParkingSpots: builder.query({
      query: ({ latitude, longitude, radius = 5 }) => ({
        url: `/api/parking/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
        method: "GET",
      }),
    }),
    getParkingSpotDetails: builder.query({
      query: (spotId) => ({
        url: `/api/parking/${spotId}`,
        method: "GET",
      }),
    }),
    reserveParkingSpot: builder.mutation({
      query: (data) => ({
        url: "/api/parking/reserve",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    updateParkingAvailability: builder.mutation({
      query: ({ spotId, availableSpots }) => ({
        url: `/api/parking/${spotId}/availability`,
        method: "PATCH",
        body: { availableSpots },
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
  }),
});

export const {
  useGetNearbyParkingSpotsQuery,
  useGetParkingSpotDetailsQuery,
  useReserveParkingSpotMutation,
  useUpdateParkingAvailabilityMutation,
} = parkingApi;
