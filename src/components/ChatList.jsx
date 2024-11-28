import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import ChatShortcut from "./ChatShortcut";
import { useToast } from "../context/ToastContext";

const ChatList = () => {
	const [chats, setChats] = useState([]);
	const [users, setUsers] = useState({});
	const { currentUser } = useSelector((state) => state.user);
	const currentUserUid = currentUser?.userUid;

	const { showToast } = useToast();

	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const chatsRef = collection(db, "chats");
				const chatSnapshot = await getDocs(chatsRef);
				const chatList = chatSnapshot.docs.map((doc) => doc.id);

				const userChats = chatList.filter((chatId) => {
					const [user1, user2] = chatId.split("_");
					return user1 === currentUserUid || user2 === currentUserUid;
				});

				const usersRef = collection(db, "users");
				const userDetails = {};

				for (let chatId of userChats) {
					const [user1, user2] = chatId.split("_");
					const otherUserId =
						user1 === currentUserUid ? user2 : user1;
					if (!userDetails[otherUserId]) {
						const userSnapshot = await getDocs(
							query(usersRef, where("userUid", "==", otherUserId))
						);
						userSnapshot.forEach((doc) => {
							userDetails[otherUserId] = doc.data();
						});
					}
				}

				setUsers(userDetails);
				setChats(userChats);
			} catch (error) {
				console.error("Error fetching chats: ", error);
				showToast(`Error checking block status: ${error}!`);
			}
		};

		const intervalId = setInterval(() => {
			if (currentUserUid) {
				fetchChats();
			}
		}, 300);

		return () => clearInterval(intervalId);
	}, [currentUserUid]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				paddingTop: "0",
				overflowY: "auto",
				marginBottom: "1rem",
				height: isMobileView ? "95vh" : "85vh",
			}}
		>
			{[...Array(12)].map((_, index) => (
				<div
					key={index}
					style={{
						display: "flex",
						columnGap: "1rem",
						cursor: "pointer",
						padding: "1rem 2rem",
						borderRadius: "40px",
						transition: "background-color 0.3s",
					}}
					className="selectedChat"
				>
					<img
						src="../../public/avatar.jpg"
						alt=""
						style={{ width: "40px", borderRadius: "50%" }}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<h2 style={{ fontSize: "0.9rem" }}>Name</h2>
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
							This person&apos;s text is wdhdw wdowhdw dwkndw
							kwndkwnd{" "}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatList;
