import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const SmallerScreens = () => {
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return isMobileView ? <Outlet /> : <Navigate to={"/"} />;
};

export default SmallerScreens;
