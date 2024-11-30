/* eslint-disable no-unused-vars */
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
import { TiArrowBack } from "react-icons/ti";
import PropTypes from "prop-types";
import Loading from "./Loading";
import ChangeTheme from "./ChangeTheme";

const Profile = ({ onBack }) => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [isOtherUserBlocked, setOtherUserBlocked] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);
	// console.log("current user:", currentUser);
	// console.log("other user:", otherUser);
	const [showTooltip, setShowTooltip] = useState(null);
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);

	const user = otherUser || currentUser;
	const email = otherUser ? "" : currentUser.email;

	const defaultAvatar = "../../avatar.jpg";

	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const checkBlockingStatus = async () => {
			if (!otherUser) {
				setIsBlocked(false);
				setOtherUserBlocked(false);
				return;
			}
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
				// console.error("Error checking block status:", error);
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
				// console.error("Failed to copy text: ", err);
				showToast("Failed to copy text");
			});
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				borderRadius: isMobileView ? "0" : "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				maxHeight: isMobileView ? "100dvh" : "80vh",
				height: isMobileView ? "100dvh" : "auto",
				alignItems: "center",
				justifyContent: "space-around",
				padding: isMobileView ? "0" : "0 1rem",
			}}
		>
			{isMobileView && (
				<TiArrowBack
					size={30}
					style={{
						cursor: "pointer",
						marginLeft: "-0.6rem",
						position: "absolute",
						top: "1rem",
						left: "1.5rem",
						zIndex: "100",
					}}
					onClick={onBack}
				/>
			)}
			<ChangeTheme />
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
						width: isMobileView ? "110px" : "90px",
						height: isMobileView ? "110px" : "90px",
						borderRadius: "50%",
					}}
					title={`Photo of ${userName}`}
					loading="eager"
					referrerPolicy="no-referrer"
				/>
				<h1 style={{ fontSize: isMobileView ? "1.5rem" : "1.2rem" }}>
					{userName}
				</h1>
				<p style={{ fontSize: isMobileView ? "1rem" : "0.9rem" }}>
					{email}
				</p>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: "1rem",
					alignItems: "center",
					fontSize: isMobileView ? "1.1rem" : "0.9rem",
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
						fontSize: isMobileView ? "1rem" : "0.8rem",
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
				{!otherUser ? <OAuth setLoading={setLoading} /> : <Block />}
			</div>
		</div>
	);
};

Profile.propTypes = {
	onBack: PropTypes.func,
};

export default Profile;
