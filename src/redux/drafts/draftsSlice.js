import { createSlice } from "@reduxjs/toolkit";

const draftsSlice = createSlice({
	name: "drafts",
	initialState: {},
	reducers: {
		saveDraft: (state, action) => {
			const { chatRoomId, draftMessage } = action.payload;
			state[chatRoomId] = draftMessage;
		},
		clearDraft: (state, action) => {
			const { chatRoomId } = action.payload;
			delete state[chatRoomId];
		},
	},
});

export const { saveDraft, clearDraft } = draftsSlice.actions;
export default draftsSlice.reducer;
