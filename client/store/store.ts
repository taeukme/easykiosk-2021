import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { kioskApi } from "../api/kioskApi";
import orderSlice from "./slices/orderSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    order: orderSlice,
    [kioskApi.reducerPath]: kioskApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(kioskApi.middleware);
  },
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
