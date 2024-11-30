import { useEffect, useState } from "react";
import { IoIosColorPalette } from "react-icons/io";
import Tooltip from "./Tooltip";
import Modal from "./Modal";

const ChangeTheme = () => {
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
		["Argon", "#fdeff9", "#ec38bc", "#7303c0", "#03001e"],
		["PurplePine", "#cbb4d4", "#20002c"],
		["Flickr", "#ff0084", "#33001b"],
		["Expresso", "#ad5389", "#3c1053"],
	];

	const [selectedTheme, setSelectedTheme] = useState(colorSchemes[0]);

	const hexToRgba = (hex, opacity) => {
		let r = 0,
			g = 0,
			b = 0;

		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		}
		else if (hex.length === 7) {
			r = parseInt(hex[1] + hex[2], 16);
			g = parseInt(hex[3] + hex[4], 16);
			b = parseInt(hex[5] + hex[6], 16);
		}
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	};

	const changeRootBackground = (theme) => {
		const root = document.documentElement;

		const gradient = `linear-gradient(to bottom, ${theme.join(", ")})`;
		root.style.setProperty("background-image", gradient);

		root.style.setProperty("--gradient-start", theme[0]);
		root.style.setProperty("--gradient-end", theme[theme.length - 1]);

		root.style.setProperty("--button-bg", theme[theme.length - 1]);
		root.style.setProperty("--button-border-hover", theme[0]);

		const trackColor = hexToRgba(theme[0], 0.3);
		root.style.setProperty("--scrollbar-track", trackColor);

		const thumbColor = hexToRgba(theme[1] || theme[0], 0.7);
		root.style.setProperty("--scrollbar-thumb", thumbColor);

		root.style.setProperty(
			"--scrollbar-thumb-hover",
			theme[theme.length - 1]
		);
	};

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
									setSelectedTheme(colors);
									changeRootBackground(colors);
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
