import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createTransform from "redux-persist/es/createTransform";
import otherUserReducer from "./otherUser/otherUserSlice";

const staySignedInTransform = createTransform(
	(inboundState) => {
		if (inboundState.staySignedIn) {
			return inboundState;
		}
		return { ...inboundState, currentUser: null };
	},
	null,
	{ whitelist: ["user"] }
);

const persistConfig = {
	key: "root",
	storage,
	version: 1,
	transforms: [staySignedInTransform],
	blacklist: ["otherUser"],
};

const rootReducer = combineReducers({
	user: userReducer,
	otherUser: otherUserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
