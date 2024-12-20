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
import PropTypes from "prop-types";
import { setTheme } from "../redux/themes/themeSlice";

const OAuth = ({ setLoading }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { currentUser } = useSelector((state) => state.user);
	// console.log(currentUser);
	const { showToast } = useToast();

	const handleGoogleClick = async () => {
		try {
			setLoading(true);
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
					theme: ["#7e56c6", "#24063d"],
				});
			} else {
				userData = userSnap.data();
			}

			dispatch(signInSuccess(userData));
			if (userData.theme) {
				dispatch(setTheme(userData.theme));
			}

			showToast(`Welcome, ${userData.userName}!`);
			navigate("/");
		} catch (e) {
			// console.error("Sign in failed:", e);
			dispatch(signInFailure(e));
			showToast("Sign in failed. Please try again");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			setLoading(true);
			dispatch(signOutUserStart());
			const auth = getAuth(app);
			await signOut(auth);
			dispatch(setTheme(["#7e56c6", "#24063d"]));

			showToast("Signed out successfully!");
			dispatch(signOutUserSuccess(null));
		} catch (error) {
			// console.error("Error signing out: ", error);
			dispatch(signOutUserFailure(error));
			showToast("Error signing out. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{currentUser === null ? (
				<button
					onClick={handleGoogleClick}
					type="button"
					style={{ background: "rgba(255,255,255,0.07)" }}
				>
					Sign In
				</button>
			) : (
				<button
					onClick={handleLogout}
					style={{ background: "rgba(255,255,255,0.07)" }}
				>
					Sign out
				</button>
			)}
		</div>
	);
};

OAuth.propTypes = {
	setLoading: PropTypes.func.isRequired,
};

export default OAuth;
