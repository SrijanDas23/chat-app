import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import OtherProfile from "./pages/OtherProfile";
import SmallerScreens from "./components/SmallerScreens";

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
			</Routes>
			<Toast />
		</BrowserRouter>
	);
}

export default App;
