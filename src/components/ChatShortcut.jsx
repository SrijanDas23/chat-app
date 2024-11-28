import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useToast } from "../context/ToastContext";

const ChatShortcut = ({ otherUser, chatId }) => {
	const [latestMessage, setLatestMessage] = useState(null);
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const drafts = useSelector((state) => state.drafts);
	const draftMessage = drafts[chatId];
	const chatRef = doc(db, "chats", chatId);
	const textRef = collection(chatRef, "messages");

	const [isBlocked, setIsBlocked] = useState(false);
	const [isOtherUserBlocked, setOtherUserBlocked] = useState(false);

	const { showToast } = useToast();

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
				// console.log("checking blocked users");
			} catch (error) {
				// console.error("Error checking block status:", error);
				showToast(`Error checking block status: ${error}!`);
			}
		};

		const intervalId = setInterval(() => {
			checkBlockingStatus();
		}, 300);

		return () => clearInterval(intervalId);
	}, [otherUser]);

	useEffect(() => {
		const q = query(textRef, orderBy("timestamp", "asc"));
		const unsubscribed = onSnapshot(q, (snapshot) => {
			if (!snapshot.empty) {
				const messagesData = snapshot.docs.map((doc) => doc.data());
				const lastMessage = messagesData[messagesData.length - 1];
				setLatestMessage(lastMessage);
				// console.log(lastMessage);
			}
		});

		return () => unsubscribed();
	}, []);

	useEffect(() => {
		const q = query(textRef, orderBy("timestamp", "asc"));
		const unsubscribed = onSnapshot(q, (snapshot) => {
			if (!snapshot.empty) {
				const messagesData = snapshot.docs.map((doc) => doc.data());
				const lastMessage = messagesData[messagesData.length - 1];
				setTimeout(() => {
					setLatestMessage(lastMessage);
					// console.log(lastMessage);
				}, 300);
			}
		});

		return () => unsubscribed();
	}, [textRef]);

	const handleUserSelect = (user) => {
		dispatch(setOtherUserInChat(user));
		console.log("Selected User:", user);
	};

	const defaultAvatar = "../../avatar.jpg";
	const photoURL = isBlocked
		? defaultAvatar
		: otherUser.photoURL
		? otherUser.photoURL.slice(0, -6)
		: defaultAvatar;

	const userName = isBlocked
		? isOtherUserBlocked
			? "Another User"
			: otherUser.userName
		: otherUser.userName;

	return (
		<div
			style={{
				display: "flex",
				columnGap: "1rem",
				cursor: "pointer",
				padding: "1rem 2rem",
				borderRadius: "40px",
				transition: "background-color 0.4s",
			}}
			onClick={() => handleUserSelect(otherUser)}
			className="selectedChat"
		>
			<img
				height="auto"
				width="auto"
				src={photoURL}
				alt={userName || "Avatar"}
				title={userName || "Avatar"}
				style={{
					width: "40px",
					height: "40px",
					borderRadius: "50%",
				}}
				referrerPolicy="no-referrer"
				loading="eager"
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<h2
					style={{
						fontSize: "0.9rem",
					}}
				>
					{userName || "Unknown User"}
				</h2>
				<p
					style={{
						fontSize: "0.8rem",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						wordWrap: "break-word",
						maxWidth: "150px",
					}}
				>
					{draftMessage
						? `Draft: ${draftMessage}`
						: latestMessage
						? `${
								latestMessage?.senderId === currentUser.userUid
									? "You: "
									: ""
						  }${latestMessage?.content}`
						: "No messages yet"}
				</p>
			</div>
		</div>
	);
};

ChatShortcut.propTypes = {
	otherUser: PropTypes.shape({
		photoURL: PropTypes.string,
		userName: PropTypes.string,
		userUid: PropTypes.string,
	}),
	chatId: PropTypes.string.isRequired,
};

export default ChatShortcut;
