import { useSelector } from "react-redux";
import Chat from "../../components/Chat";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";

const Home = () => {
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 3fr 1fr",
				width: "85vw",
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				rowGap: "2rem",
				boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
			}}
		>
			<Sidebar />
			{otherUser ? (
				<Chat />
			) : (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						marginTop: "2rem",
					}}
				>
					<p>Select a user to start chatting</p>
					<img
						height="auto"
						width="auto"
						src="../../../people_talking.png"
						style={{
							height: "15rem",
							width: "15rem",
						}}
						alt="Image of people talking"
						title="Image of people talking"
						loading="eager"
					/>
				</div>
			)}
			<Profile />
		</div>
	);
};

export default Home;
