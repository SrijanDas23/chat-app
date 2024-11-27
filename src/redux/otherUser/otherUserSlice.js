import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	otherUserInChat: null,
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
