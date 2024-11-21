import { createContext, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
	const [toast, setToast] = useState({ message: null, duration: 3000 });

	const showToast = useCallback((message, duration = 3000) => {
		setToast({ message, duration });

		setTimeout(() => {
			setToast({ message: null, duration: 3000 });
		}, duration);
	}, []);

	return (
		<ToastContext.Provider value={{ toast, showToast }}>
			{children}
		</ToastContext.Provider>
	);
};

ToastProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useToast = () => useContext(ToastContext);
