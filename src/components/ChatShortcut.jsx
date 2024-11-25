import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const ChatShortcut = ({ otherUser, chatId }) => {
	const [latestMessage, setLatestMessage] = useState(null);
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const chatRef = doc(db, "chats", chatId);
	const textRef = collection(chatRef, "messages");

	useEffect(() => {
		const q = query(textRef, orderBy("timestamp", "asc"));
		const unsubscribed = onSnapshot(q, (snapshot) => {
			if (!snapshot.empty) {
				const messagesData = snapshot.docs.map((doc) => doc.data());
				const lastMessage = messagesData[messagesData.length - 1];
				setLatestMessage(lastMessage);
				console.log(lastMessage);
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
				}, 600);
			}
		});

		return () => unsubscribed();
	}, [textRef]);

	const handleUserSelect = (user) => {
		dispatch(setOtherUserInChat(user));
		console.log("Selected User:", user);
	};
	return (
		<div
			style={{
				display: "flex",
				columnGap: "1rem",
				cursor: "pointer",
				padding: "1rem 2rem",
				borderRadius: "40px",
				transition: "background-color 0.3s",
			}}
			onClick={() => handleUserSelect(otherUser)}
			className="selectedChat"
		>
			<img
				height="auto"
				width="auto"
				src={
					otherUser?.photoURL
						? otherUser.photoURL.slice(0, -6)
						: "../../public/avatar.jpg"
				}
				alt={otherUser?.userName || "Avatar"}
				title={otherUser?.userName || "Avatar"}
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
					{otherUser?.userName || "Unknown User"}
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
					{latestMessage?.senderId === currentUser.userUid
						? "You: "
						: ""}
					{latestMessage?.content || "No messages yet"}
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
