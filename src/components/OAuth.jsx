import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../utils/firebase";

export default function OAuth() {
	const handleGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);
			console.log(result);
		} catch (e) {
			console.error(e);
		}
	};

	const handleLogout = async () => {
		try {
			const auth = getAuth(app);
			await signOut(auth);
			console.log("User signed out successfully");
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	return (
		<>
			<button onClick={handleGoogleClick} type="button">
				Sign In
			</button>
			<button onClick={handleLogout}>Logout</button>
		</>
	);
}
