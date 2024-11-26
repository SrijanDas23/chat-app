import { useSelector } from "react-redux";
import OAuth from "./OAuth";
import { RxInfoCircled } from "react-icons/rx";
import { PiCopy } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import Tooltip from "./Tooltip";
import Block from "./Block";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Profile = () => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [isOtherUserBlocked, setOtherUserBlocked] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);
	console.log(currentUser);
	console.log(otherUser);
	const [showTooltip, setShowTooltip] = useState(null);
	const { showToast } = useToast();

	const user = otherUser || currentUser;
	const email = otherUser ? "" : currentUser.email;

	const defaultAvatar = "../../avatar.jpg";

	useEffect(() => {
		const checkBlockingStatus = async () => {
			try {
				const currentUserBlockDoc = await getDoc(
					doc(db, "blocked", currentUser.userUid)
				);
				const otherUserBlockDoc = await getDoc(
					doc(db, "blocked", otherUser.userUid)
				);

				const currentUserBlocked =
					currentUserBlockDoc.exists() &&
					currentUserBlockDoc
						.data()
						.blockedUsers.includes(otherUser.userUid);

				const otherUserBlocked =
					otherUserBlockDoc.exists() &&
					otherUserBlockDoc
						.data()
						.blockedUsers.includes(currentUser.userUid);

				setIsBlocked(currentUserBlocked || otherUserBlocked);
				setOtherUserBlocked(otherUserBlocked);
			} catch (error) {
				console.error("Error checking block status:", error);
				showToast(`Error checking block status: ${error}!`);
			}
		};

		checkBlockingStatus();
	}, [otherUser]);

	// console.log("currentUserBlocked: " + isCurrentUserBlocked);
	// console.log("otherUserBlocked: " + isOtherUserBlocked);
	// console.log("isBlocked: " + isBlocked);

	const photoURL = isBlocked
		? defaultAvatar
		: user.photoURL
		? user.photoURL.slice(0, -6)
		: defaultAvatar;

	const userName = isBlocked
		? isOtherUserBlocked
			? "Another User"
			: user.userName
		: user.userName;

	const userUid = isBlocked
		? isOtherUserBlocked
			? "XXXXXXXX"
			: user.userUid
		: user.userUid;

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(userUid)
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
					key={isBlocked ? "blocked" : "unblocked"}
					height="auto"
					width="auto"
					src={photoURL}
					alt={`Photo of ${userName}`}
					style={{
						width: "90px",
						height: "90px",
						borderRadius: "50%",
					}}
					title={`Photo of ${userName}`}
					loading="eager"
					referrerPolicy="no-referrer"
				/>
				<h1 style={{ fontSize: "1.2rem" }}>{userName}</h1>
				<p style={{ fontSize: "0.9rem" }}>{email}</p>
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
					<p>{userUid}</p>

					<div
						style={{ position: "relative", cursor: "pointer" }}
						onMouseEnter={() => setShowTooltip("copy")}
						onMouseLeave={() => setShowTooltip(null)}
						onClick={copyToClipboard}
					>
						<PiCopy />
						{showTooltip === "copy" && (
							<Tooltip
								message="Click to copy User ID!"
								top="25px"
							/>
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
				{!otherUser ? <OAuth /> : <Block />}
			</div>
		</div>
	);
};

export default Profile;
