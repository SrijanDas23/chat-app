import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { TiArrowBack } from "react-icons/ti";
import { RxInfoCircled } from "react-icons/rx";
import Tooltip from "../../components/Tooltip";
import { PiCopy } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Loading from "../../components/Loading";
import MobileBlock from "./MobileBlock";
import { setOtherUserInChat } from "../../redux/otherUser/otherUserSlice";
import { Helmet } from "react-helmet-async";

const OtherProfile = () => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [isOtherUserBlocked, setOtherUserBlocked] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const [showTooltip, setShowTooltip] = useState(null);
	const { showToast } = useToast();
	const { userUid } = useParams();
	// eslint-disable-next-line no-unused-vars
	const auth = getAuth();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [user, setUser] = useState(null);
	console.log("user:", user);
	const [loading, setLoading] = useState(true);

	const defaultAvatar = "../../../avatar.jpg";
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userDoc = await getDoc(doc(db, "users", userUid));
				if (userDoc.exists()) {
					setUser(userDoc.data());
				} else {
					showToast("User not found!");
					navigate("/");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				showToast(`Error fetching user: ${error}`);
			} finally {
				setLoading(false);
			}
		};

		const checkBlockingStatus = async () => {
			if (!user) {
				setIsBlocked(false);
				setOtherUserBlocked(false);
				return;
			}
			try {
				const currentUserBlockDoc = await getDoc(
					doc(db, "blocked", currentUser.userUid)
				);
				const otherUserBlockDoc = await getDoc(
					doc(db, "blocked", user.userUid)
				);

				const currentUserBlocked =
					currentUserBlockDoc.exists() &&
					currentUserBlockDoc.data().blockedUsers.includes(userUid);

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
		const intervalId = setInterval(() => {
			fetchUser();
			checkBlockingStatus();
		}, 1500);

		return () => clearInterval(intervalId);
	}, [userUid, currentUser, user]);

	console.log("otherUserBlocked: " + isOtherUserBlocked);
	console.log("isBlocked: " + isBlocked);

	const photoURL = user
		? isBlocked
			? defaultAvatar
			: user.photoURL
			? user.photoURL.slice(0, -6)
			: defaultAvatar
		: defaultAvatar;

	const userName = user
		? isBlocked
			? isOtherUserBlocked
				? "Another User"
				: user.userName
			: user.userName
		: "Loading...";

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

	function handleGoBack() {
		navigate("/");
		dispatch(setOtherUserInChat(user));
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				height: "100dvh",
				alignItems: "center",
				justifyContent: "space-around",
				width: "100vw",
			}}
		>
			<Helmet>
				<title>{userName}</title>
				<meta
					name="description"
					content="Sign In page. You need to sign in to gain access to our website"
				/>
				<link
					rel="canonical"
					href={`https://chatt-app23.netlify.app/otherprofile/${userUid}`}
				/>
			</Helmet>
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
					onClick={handleGoBack}
				/>
			)}
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
				<MobileBlock user={user} />
			</div>
		</div>
	);
};

export default OtherProfile;
