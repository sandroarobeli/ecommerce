import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    page: localStorage.getItem("page")
      ? JSON.parse(localStorage.getItem("page"))
      : 1,
    status: "idle",
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
      // We store current page in local storage as string
      localStorage.setItem("page", JSON.stringify(state.page));
    },
  },
});

// Exports reducer functions
export const { setPage } = pageSlice.actions;

// Exports individual selectors
export const selectPage = (state) => state.page.page;

export default pageSlice.reducer;
