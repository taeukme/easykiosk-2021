import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState: any = {
  predictedAge: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // Use the PayloadAction type to declare the contents of `action.payload`
  reducers: {
    setPredictedAge: (state, action: PayloadAction<number>) => {
      state.predictedAge = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {}
});

// reducers/actions go in here in order to import them into components
export const { setPredictedAge } = userSlice.actions;

export default userSlice.reducer;
