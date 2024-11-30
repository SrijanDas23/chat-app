import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import SmallerScreens from "./components/SmallerScreens";
import Login from "./pages/Login/Login";
import Home from "./pages/home/Home";
import OtherProfile from "./pages/OtherProfile/OtherProfile";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { changeRootBackground } from "./utils/changeTheme";

function App() {
	const selectedTheme = useSelector((state) => state.theme.selectedTheme);
	// console.log("selected theme", selectedTheme);

	useEffect(() => {
		if (selectedTheme) {
			changeRootBackground(selectedTheme);
		}
	}, [selectedTheme]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Home />} />
					<Route element={<SmallerScreens />}>
						<Route
							path="/otherprofile/:userUid"
							element={<OtherProfile />}
						/>
					</Route>
				</Route>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<Toast />
		</BrowserRouter>
	);
}

export default App;
