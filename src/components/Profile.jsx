import { useSelector } from "react-redux";
import OAuth from "./OAuth";
import { RxInfoCircled } from "react-icons/rx";
import { PiCopy } from "react-icons/pi";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import Tooltip from "./Tooltip";

const Profile = () => {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);
	console.log(currentUser.photoURL);
	const [showTooltip, setShowTooltip] = useState(null);
	const { showToast } = useToast();

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(currentUser.uid)
			.then(() => {
				showToast("Copied Successfully to Clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
			});
	};
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				maxHeight: "80vh",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "1rem",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: "1rem",
					alignItems: "center",
				}}
			>
				<img
					src={currentUser.photoURL}
					alt={`Photo of ${currentUser.userName}`}
					style={{
						width: "90px",
						height: "90px",
						borderRadius: "50%",
					}}
				/>
				<h2 style={{ fontSize: "1.2rem" }}>{currentUser.userName}</h2>
				<p style={{ fontSize: "0.9rem" }}>{currentUser.email}</p>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: "1rem",
					alignItems: "center",
					fontSize: "0.9rem",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						columnGap: "0.5rem",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							position: "relative",
							cursor: "pointer",
							display: "flex",
						}}
						onMouseEnter={() => setShowTooltip("info")}
						onMouseLeave={() => setShowTooltip(null)}
					>
						<RxInfoCircled />
						{showTooltip === "info" && (
							<Tooltip message="Send this unique ID to your friend to add you!" />
						)}
					</div>
					<p>User ID: </p>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						columnGap: "0.5rem",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "0.8rem",
					}}
				>
					<p>{currentUser.userUid}</p>

					<div
						style={{ position: "relative", cursor: "pointer" }}
						onMouseEnter={() => setShowTooltip("copy")}
						onMouseLeave={() => setShowTooltip(null)}
						onClick={copyToClipboard}
					>
						<PiCopy />
						{showTooltip === "copy" && (
							<Tooltip message="Click to copy User ID!" />
						)}
					</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: "1rem",
					alignItems: "center",
				}}
			>
				<OAuth />
			</div>
		</div>
	);
};

export default Profile;
