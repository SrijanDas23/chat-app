import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";

const ChatShortcut = ({ otherUser }) => {
	const dispatch = useDispatch();

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
					UID: {otherUser?.userUid || "N/A"}
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
};

export default ChatShortcut;
