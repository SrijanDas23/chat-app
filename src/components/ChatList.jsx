import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";

const ChatList = () => {
	const [chats, setChats] = useState([]);
	const [users, setUsers] = useState({});
	const { currentUser } = useSelector((state) => state.user);
	const currentUserUid = currentUser?.userUid;
	const dispatch = useDispatch();

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
			}
		};

		if (currentUserUid) {
			fetchChats();
		}
	}, [currentUserUid]);

	const handleUserSelect = (user) => {
		dispatch(setOtherUserInChat(user));
		console.log("Selected User:", user);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				paddingTop: "0",
				overflowY: "auto",
				marginBottom: "1rem",
				height: "85vh",
			}}
		>
			{chats.map((chatId, index) => {
				const [user1, user2] = chatId.split("_");
				const otherUserId = user1 === currentUserUid ? user2 : user1;
				const otherUser = users[otherUserId];

				return (
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
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "50%",
							}}
							referrerPolicy="no-referrer"
							loading="lazy"
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
								UID: {otherUser?.userUid || "N/A"}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ChatList;
