import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedTheme: ["#7e56c6", "#24063d"],
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme: (state, action) => {
			state.selectedTheme = action.payload;
		},
	},
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
