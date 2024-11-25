import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import Home from "./pages/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Home />} />
				</Route>
			</Routes>
			<Toast />
		</BrowserRouter>
	);
}

export default App;
