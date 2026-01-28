import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parkingApi = createApi({
  reducerPath: "parkingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://smrt-park-backend.onrender.com",
  }),
  endpoints: (builder) => ({
    getParkingSpots: builder.query({
      query: () => "/api/owner/parking-spaces/search-park-address",
    }),

    getNearbyParkingSpots: builder.query({
      query: ({ latitude, longitude, radius = 5 }) => ({
        url: `/api/parking/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
        method: "GET",
      }),
    }),

    getParkingSpotDetails: builder.query({
      query: (spotId) => `/api/parking/${spotId}`,
    }),

    reserveParkingSpot: builder.mutation({
      query: (data) => ({
        url: "/api/parking/reserve",
        method: "POST",
        body: data,
      }),
    }),

    updateParkingAvailability: builder.mutation({
      query: ({ spotId, availableSpots }) => ({
        url: `/api/parking/${spotId}/availability`,
        method: "PATCH",
        body: { availableSpots },
      }),
    }),
  }),
});

export const {
  useGetNearbyParkingSpotsQuery,
  useGetParkingSpotDetailsQuery,
  useReserveParkingSpotMutation,
  useUpdateParkingAvailabilityMutation,
  useGetParkingSpotsQuery, 
} = parkingApi;