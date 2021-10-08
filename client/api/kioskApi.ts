import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const kioskApi = createApi({
  reducerPath: "kioskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://tp15.local:1337/" }),
  endpoints: (builder) => ({
    getRestaurant: builder.query<any, string>({
      query: (id) => `restaurants/${id}`,
    }),
    getCategories: builder.query<any, string>({
      query: (restaurantId) =>
        `restaurant-categories?restaurant.id=${restaurantId}`,
    }),
    getMenus: builder.query<any, string>({
      query: (categoryId) => `menus?category.id=${categoryId}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetRestaurantQuery, useGetCategoriesQuery, useGetMenusQuery } = kioskApi;
