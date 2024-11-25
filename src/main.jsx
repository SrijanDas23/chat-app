import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "./context/ToastContext.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<HelmetProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</HelmetProvider>
		</PersistGate>
	</Provider>
);
