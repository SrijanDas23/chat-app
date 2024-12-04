import { useEffect, useState } from "react";
import { IoIosColorPalette } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "./Tooltip";
import Modal from "./Modal";
import { useToast } from "../context/ToastContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { setTheme } from "../redux/themes/themeSlice";

const ChangeTheme = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	const { showToast } = useToast();

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
		if (currentUser) {
			const getUserTheme = async () => {
				const userRef = doc(db, "users", currentUser.userUid);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					const userData = userSnap.data();
					const savedTheme = userData.selectedTheme || [
						"#7e56c6",
						"#24063d",
					];
					dispatch(setTheme(savedTheme));
				}
			};

			getUserTheme();
		}
	}, [currentUser, dispatch]);

	const handleThemeChange = async (colors) => {
		if (currentUser) {
			const userRef = doc(db, "users", currentUser.userUid);
			await setDoc(userRef, { selectedTheme: colors }, { merge: true });

			dispatch(setTheme(colors));

			showToast("Theme changed successfully!");
			setIsModalOpen(false);
		}
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
								onClick={() => handleThemeChange(colors)}
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
