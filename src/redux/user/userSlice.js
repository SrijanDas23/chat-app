import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	error: null,
	loading: false,
	staySignedIn: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signInStart: (state) => {
			state.loading = true;
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		signOutUserStart: (state) => {
			state.loading = true;
		},
		signOutUserSuccess: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = null;
		},
		signOutUserFailure: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		setStaySignedIn: (state, action) => {
			state.staySignedIn = action.payload;
		},
	},
});

export const {
	signInStart,
	signInSuccess,
	signInFailure,
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	setStaySignedIn,
} = userSlice.actions;

export default userSlice.reducer;
