import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	otherUserInChat: null, // Default value
};

const otherUserSlice = createSlice({
	name: "otherUser",
	initialState,
	reducers: {
		setOtherUserInChat: (state, action) => {
			state.otherUserInChat = action.payload;
		},
	},
});

export const { setOtherUserInChat } = otherUserSlice.actions;

export default otherUserSlice.reducer;
