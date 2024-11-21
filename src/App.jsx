import Chatroom from "./pages/Chatroom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/home";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Home />} />
					<Route
						path="/chatroom/:chatroomId"
						element={<Chatroom />}
					/>
				</Route>
			</Routes>
			<Toast />
		</BrowserRouter>
	);
}

export default App;
