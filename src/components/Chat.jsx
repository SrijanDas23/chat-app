import { useEffect, useRef, useState } from "react";
import { db } from "../utils/firebase";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const dummy = useRef(null);
	const [changeInMessage, setChangeInMessage] = useState(0);

	// eslint-disable-next-line no-unused-vars
	const auth = getAuth();
	const { currentUser } = useSelector((state) => state.user);
	const currentUserUid = currentUser?.userUid;
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);

	const chatRoomId =
		currentUserUid > otherUser.userUid
			? `${currentUserUid}_${otherUser.userUid}`
			: `${otherUser.userUid}_${currentUserUid}`;
	const chatRoomRef = doc(db, "chats", chatRoomId);
	const messagesRef = collection(chatRoomRef, "messages");

	useEffect(() => {
		const checkAndCreateChatRoom = async () => {
			try {
				const chatRoomSnap = await getDoc(chatRoomRef);
				if (!chatRoomSnap.exists()) {
					await setDoc(chatRoomRef, {
						createdAt: new Date().toISOString(),
						participants: [currentUserUid, otherUser.userUid],
					});
				}
			} catch (error) {
				console.error("Error creating chat room:", error);
			}
		};

		checkAndCreateChatRoom();
	}, [chatRoomRef, currentUserUid, otherUser]);

	useEffect(() => {
		if (dummy.current) {
			dummy.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [changeInMessage]);

	useEffect(() => {
		const q = query(messagesRef, orderBy("timestamp"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const messagesData = snapshot.docs.map((doc) => doc.data());

			setTimeout(() => {
				setMessages(messagesData);
				setLoading(false);
			}, 300);
		});

		return () => unsubscribe();
	}, [chatRoomRef, messagesRef]);

	const handleSendMessage = async () => {
		if (newMessage.trim() === "") return;

		const message = {
			senderId: currentUserUid,
			content: newMessage,
			timestamp: new Date(),
		};

		try {
			await addDoc(messagesRef, message);
			setNewMessage("");
			setChangeInMessage((prev) => prev + 1);
		} catch (error) {
			console.error("Error sending message: ", error);
		}
	};

	return (
		<div
			style={{
				maxHeight: "80vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "1rem",
					margin: "1rem",
				}}
			>
				<img
					src={otherUser.photoURL}
					alt={otherUser.userName}
					style={{
						width: "40px",
						height: "40px",
						borderRadius: "50%",
					}}
				/>
				<h2 style={{ fontSize: "0.9rem" }}>{otherUser.userName}</h2>
			</div>

			<div
				style={{
					overflowY: "auto",
					margin: "1rem",
				}}
			>
				{loading ? (
					<p>Loading messages...</p>
				) : (
					messages.map((msg, index) => (
						<div key={index}>
							<div
								key={index}
								style={{
									margin: "1rem",
									display: "flex",
									justifySelf:
										msg.senderId === currentUserUid
											? "flex-end"
											: "flex-start",
								}}
							>
								<div
									style={{
										background: "#7d56c669",
										width: "fit-content",
										borderRadius: "20px",
									}}
								>
									<p style={{ margin: "0.4rem 0.8rem" }}>
										{msg.content}
									</p>
								</div>
							</div>
							<div ref={dummy}></div>
						</div>
					))
				)}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					margin: "1rem",
				}}
			>
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					style={{
						border: "1.5px solid #7e56c6",
						backgroundColor: "transparent",
						borderRadius: "20px",
						padding: "0.5rem",
						outline: "none",
						flex: "1",
						marginRight: "0.8rem",
					}}
				/>
				<button
					onClick={handleSendMessage}
					style={{
						backgroundColor: "#7e56c6",
						color: "#fff",
						border: "none",
						borderRadius: "20px",
						cursor: "pointer",
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
