import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import SmallerScreens from "./components/SmallerScreens";
import Login from "./pages/Login/Login";
import Home from "./pages/home/Home";
import OtherProfile from "./pages/OtherProfile/OtherProfile";

function App() {
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
