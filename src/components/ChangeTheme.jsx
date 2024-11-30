import { useEffect, useState } from "react";
import { IoIosColorPalette } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "./Tooltip";
import Modal from "./Modal";
import { setTheme } from "../redux/themes/themeSlice";
import { changeRootBackground } from "../utils/changeTheme";

const ChangeTheme = () => {
	const dispatch = useDispatch();
	const selectedTheme = useSelector((state) => state.theme.selectedTheme);

	const [isModalOpen, setIsModalOpen] = useState(null);
	const [showTooltip, setShowTooltip] = useState(null);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const colorSchemes = [
		["Default", "#7e56c6", "#24063d"],
		["Yoda", "#FF0099", "#493240"],
		["Argon", "#bdc3c7", "#2c3e50"],
		["PurplePine", "#cbb4d4", "#20002c"],
		["Flickr", "#ff0084", "#33001b"],
		["Expresso", "#ad5389", "#3c1053"],
		["Frost", "#004e92", "#000428 "],
		["Endless River", "#43cea2", "#185a9d"],
	];

	useEffect(() => {
		changeRootBackground(selectedTheme);
	}, [selectedTheme]);

	return (
		<div
			style={{
				position: "absolute",
				top: isMobileView ? "1%" : "10%",
				right: isMobileView ? "1.5%" : "8%",
			}}
		>
			<div
				className="react-icon"
				style={{
					width: "40px",
					height: "40px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					borderRadius: "50%",
					transition: "background-color ease 0.3s",
					cursor: "pointer",
				}}
				onClick={() => setIsModalOpen("theme")}
				onMouseEnter={() => setShowTooltip("theme")}
				onMouseLeave={() => setShowTooltip(null)}
			>
				<IoIosColorPalette size={20} />
				{showTooltip === "theme" && (
					<Tooltip
						message="Change the theme"
						top="7px"
						left="-165%"
					/>
				)}
			</div>
			{isModalOpen === "theme" && (
				<Modal onClose={() => setIsModalOpen(false)}>
					<h3>Change Chat Theme</h3>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							marginTop: "2rem",
						}}
					>
						{colorSchemes.map(([name, ...colors], index) => (
							<div
								key={index}
								style={{
									display: "flex",
									alignItems: "center",
									overflow: "hidden",
									cursor: "pointer",
									position: "relative",
									borderRadius: "50px",
								}}
								onClick={() => {
									dispatch(setTheme(colors));
									setIsModalOpen(false);
								}}
							>
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: `linear-gradient(to bottom, ${colors.join(
											", "
										)})`,
										opacity: 0.5,
										borderRadius: "50px",
										zIndex: 1,
									}}
								></div>
								<p
									style={{
										flex: 1,
										padding: "0.5rem",
										textAlign: "center",
										zIndex: 2,
									}}
								>
									{name}
								</p>
							</div>
						))}
					</div>
				</Modal>
			)}
		</div>
	);
};

export default ChangeTheme;
