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
			{chats.map((chatId, index) => {
				const [user1, user2] = chatId.split("_");
				const otherUserId = user1 === currentUserUid ? user2 : user1;
				const otherUser = users[otherUserId];

				return (
					<ChatShortcut
						key={index}
						otherUser={otherUser}
						chatId={chatId}
					/>
				);
			})}
		</div>
	);
};

export default ChatList;
