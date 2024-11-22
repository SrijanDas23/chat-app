import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { app, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	signInFailure,
	signInStart,
	signInSuccess,
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess,
} from "../redux/user/userSlice";
import { useToast } from "../context/ToastContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function OAuth() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);
	const { showToast } = useToast();

	const handleGoogleClick = async () => {
		try {
			dispatch(signInStart());

			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);
			const { uid, displayName, email, photoURL } = result.user;

			const userRef = doc(db, "users", uid);
			let userData = {
				userUid: uid,
				userName: displayName,
				email: email,
				photoURL: photoURL,
			};

			const userSnap = await getDoc(userRef);
			if (!userSnap.exists()) {
				await setDoc(userRef, {
					...userData,
					createdAt: new Date().toISOString(),
				});
			} else {
				userData = userSnap.data();
			}

			dispatch(signInSuccess(userData));

			showToast(`Welcome, ${userData.userName}!`);
			navigate("/");
		} catch (e) {
			console.error("Sign in failed:", e);
			dispatch(signInFailure(e));
			showToast("Sign in failed. Please try again");
		}
	};

	const handleLogout = async () => {
		try {
			dispatch(signOutUserStart());
			const auth = getAuth(app);
			await signOut(auth);

			showToast("Signed out successfully!");
			dispatch(signOutUserSuccess(null));
		} catch (error) {
			console.error("Error signing out: ", error);
			dispatch(signOutUserFailure(error));
			showToast("Error signing out. Please try again.");
		}
	};

	return (
		<div>
			{currentUser === null ? (
				<button onClick={handleGoogleClick} type="button">
					Sign In
				</button>
			) : (
				<button onClick={handleLogout}>Sign out</button>
			)}
		</div>
	);
}
