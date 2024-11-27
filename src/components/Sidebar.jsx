import Searchbar from "./Searchbar";
import ChatList from "./ChatList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Sidebar = ({onProfileClick}) => {
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const photoURL = currentUser.photoURL.slice(0, -6);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				borderRadius: isMobileView ? "0" : "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				maxHeight: isMobileView ? "100vh" : "80vh",
				rowGap: "1rem",
			}}
		>
			<div
				style={{
					padding: "1rem 2rem",
					borderRadius: isMobileView ? "0" : "20px",
					backgroundColor: "rgba(0, 0, 0, 0.07)",
					display: "flex",
				}}
			>
				{isMobileView && (
					<img
						src={photoURL}
						alt=""
						style={{
							width: "2.2rem",
							height: "2.2rem",
							marginRight: "0.6rem",
							borderRadius: "50%",
							objectFit: "contain",
						}}
						referrerPolicy="no-referrer"
						onClick={onProfileClick}
					/>
				)}
				<Searchbar />
			</div>
			<ChatList />
		</div>
	);
};

Sidebar.propTypes = {
	onProfileClick: PropTypes.func,
};

export default Sidebar;
