import { useEffect, useRef, useState } from "react";
import { db } from "../utils/firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	writeBatch,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { clearDraft, saveDraft } from "../redux/drafts/draftsSlice";
import { TiArrowBack } from "react-icons/ti";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";
import Tooltip from "./Tooltip";
import { MdDelete } from "react-icons/md";
import { useToast } from "../context/ToastContext";
import DeleteModal from "./DeleteModal";

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const dummy = useRef(null);
	const [changeInMessage, setChangeInMessage] = useState(0);
	const dispatch = useDispatch();
	const [showTooltip, setShowTooltip] = useState(null);
	const { showToast } = useToast();

	const [isBlocked, setIsBlocked] = useState(false);
	// const [isCurrentUserBlocked, setCurrentUserBlocked] = useState(false);
	const [isOtherUserBlocked, setOtherUserBlocked] = useState(false);

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

	const drafts = useSelector((state) => state.drafts);
	const currentDraft = drafts[chatRoomId] || "";

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		setNewMessage(currentDraft || "");
	}, [chatRoomId, currentDraft]);

	useEffect(() => {
		const checkBlockingStatus = async () => {
			try {
				const currentUserBlockDoc = await getDoc(
					doc(db, "blocked", currentUserUid)
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
						.blockedUsers.includes(currentUserUid);

				setIsBlocked(currentUserBlocked || otherUserBlocked);
				// setCurrentUserBlocked(currentUserBlocked);
				setOtherUserBlocked(otherUserBlocked);
			} catch (error) {
				console.error("Error checking block status:", error);
			}
		};

		const intervalId = setInterval(() => {
			checkBlockingStatus();
		}, 2000);

		return () => clearInterval(intervalId);
	}, [currentUserUid, otherUser.userUid]);

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

			const newMessages = messagesData.filter(
				(msg) =>
					!messages.some(
						(existingMsg) =>
							existingMsg.timestamp?.toMillis() ===
							msg.timestamp?.toMillis()
					)
			);

			if (newMessages.length > 0) {
				setChangeInMessage((prev) => prev + 1);
			}

			setTimeout(() => {
				setMessages(messagesData);
				// console.log(messages);
				setLoading(false);
			}, 300);
		});

		return () => unsubscribe();
	}, [chatRoomRef, messagesRef]);

	const handleInputChange = (e) => {
		setNewMessage(e.target.value);
		dispatch(saveDraft({ chatRoomId, draftMessage: e.target.value }));
	};

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
			dispatch(clearDraft({ chatRoomId }));
			setChangeInMessage((prev) => prev + 1);
		} catch (error) {
			console.error("Error sending message: ", error);
		}
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

	const handleDelete = async () => {
		try {
			const batch = writeBatch(db);
			const messagesQuerySnapshot = await getDocs(messagesRef);

			dispatch(clearDraft({ chatRoomId }));
			dispatch(setOtherUserInChat(null));
			messagesQuerySnapshot.forEach((messageDoc) => {
				batch.delete(messageDoc.ref);
			});

			await batch.commit();

			await deleteDoc(chatRoomRef);

			showToast("Chat room deleted successfully");
		} catch (error) {
			console.error("Error deleting chat room", error);
			showToast("Error deleting chat room");
		}
	};

	return (
		<div
			style={{
				height: isMobileView ? "100vh" : "80vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					margin: "1rem",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<div
						style={{ position: "relative", cursor: "pointer" }}
						onMouseEnter={() => setShowTooltip("back")}
						onMouseLeave={() => setShowTooltip(null)}
						onClick={() => dispatch(setOtherUserInChat(null))}
					>
						<TiArrowBack
							size={25}
							style={{ cursor: "pointer", marginLeft: "-0.6rem" }}
						/>
						{showTooltip === "back" && (
							<Tooltip message="Go back" top="-30px" />
						)}
					</div>
					<img
						src={photoURL}
						alt={userName}
						style={{
							width: "40px",
							height: "40px",
							borderRadius: "50%",
							cursor: isMobileView ? "pointer" : "default",
						}}
						referrerPolicy="no-referrer"
						onClick={() => {
							if (isMobileView) {
								window.location.href = `/otherprofile/${otherUser.userUid}`;
							}
						}}
					/>
					<h2
						style={{
							fontSize: "0.9rem",
							cursor: isMobileView ? "pointer" : "default",
						}}
						onClick={() => {
							if (isMobileView) {
								window.location.href = `/otherprofile/${otherUser.userUid}`;
							}
						}}
					>
						{userName}
					</h2>
				</div>
				<div
					className="delete"
					style={{
						width: "40px",
						height: "40px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "50%",
						transition: "background-color ease 0.3s",
						cursor: "pointer",
						position: "relative",
					}}
					onClick={() => setIsModalOpen(true)}
					onMouseEnter={() => setShowTooltip("delete")}
					onMouseLeave={() => setShowTooltip(null)}
				>
					<MdDelete size={20} />
					{showTooltip === "delete" && (
						<Tooltip
							message="Delete the entire chat"
							top="7px"
							left="-185%"
						/>
					)}
				</div>

				{isModalOpen && (
					<DeleteModal onClose={() => setIsModalOpen(false)}>
						<h3>Confirm Deletion</h3>
						<p>Are you sure you want to delete the entire chat?</p>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								marginTop: "1rem",
							}}
						>
							<button
								style={{
									marginRight: "1rem",
									backgroundColor: "#7e56c6",
									color: "#fff",
									border: "none",
									borderRadius: "20px",
									padding: "0.5rem 1rem",
									cursor: "pointer",
								}}
								onClick={() => {
									handleDelete();
									setIsModalOpen(false);
								}}
							>
								Delete
							</button>
							<button
								style={{
									backgroundColor: "#ccc",
									color: "#333",
									border: "none",
									borderRadius: "20px",
									padding: "0.5rem 1rem",
									cursor: "pointer",
								}}
								onClick={() => setIsModalOpen(false)}
							>
								Cancel
							</button>
						</div>
					</DeleteModal>
				)}
			</div>

			<div
				style={{
					overflowY: "auto",
					margin: "1rem",
					flex: "1",
				}}
			>
				{loading ? (
					<Loading />
				) : messages.length === 0 ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}
					>
						<p style={{ marginTop: "3rem" }}>
							This is the beginning of your message history with{" "}
							{userName}
						</p>
						<video
							src="../../hi_animation.webm"
							style={{ width: "12rem" }}
							autoPlay
							loop
							muted
							playsInline
						></video>
					</div>
				) : (
					messages.map((msg, index) => (
						<div key={index}>
							<div
								key={index}
								style={{
									marginTop:
										index === 0
											? "0"
											: msg.senderId ===
											  messages[index - 1]?.senderId
											? "0.4rem"
											: "1.5rem",
									marginRight: "1rem",
									marginLeft: "1rem",
									display: "flex",
									justifySelf:
										msg.senderId === currentUserUid
											? "flex-end"
											: "flex-start",
								}}
							>
								<div
									style={{
										background:
											msg.senderId === currentUserUid
												? "#7d56c623"
												: "#7d56c69c",
										width: "fit-content",
										borderRadius:
											msg.senderId === currentUserUid
												? "20px 20px 0 20px"
												: "20px 20px 20px 0",
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
					onChange={handleInputChange}
					placeholder="Type a message..."
					style={{
						border: "1.5px solid #7e56c6",
						borderRadius: "20px",
						padding: "0.5rem",
						outline: "none",
						flex: "1",
						marginRight: "0.8rem",
						pointerEvents: isBlocked ? "none" : "auto",
					}}
					disabled={isBlocked}
				/>
				<button
					onClick={handleSendMessage}
					style={{
						backgroundColor: "#7e56c6",
						color: "#fff",
						border: "none",
						borderRadius: "20px",
						cursor: isBlocked ? "not-allowed" : "pointer",
					}}
					disabled={isBlocked}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
