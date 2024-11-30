import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chat from "../../components/Chat";
import Profile from "../../components/Profile";
import Sidebar from "../../components/Sidebar";
import { Helmet } from "react-helmet-async";

const Home = () => {
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
	const [showProfile, setShowProfile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			style={{
				display: "grid",
				borderRadius: isMobileView ? "0" : "20px",
				gridTemplateColumns: isMobileView
					? otherUser
						? "1fr"
						: "1fr"
					: "1fr 3fr 1fr",
				width: isMobileView ? "100vw" : "85vw",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				rowGap: "2rem",
				boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
			}}
		>
			<Helmet>
				<title>Home</title>
				<meta
					name="description"
					content="This is a realtime chat application. Use it to connect with your friends through their names and uids! This was created using React and Firebase."
				/>
				<link rel="canonical" href="https://chatt-app23.netlify.app/" />
			</Helmet>
			{isMobileView ? (
				<>
					{showProfile && (
						<Profile onBack={() => setShowProfile(false)} />
					)}

					{!showProfile && !otherUser && (
						<Sidebar onProfileClick={() => setShowProfile(true)} />
					)}

					{!showProfile && otherUser && <Chat />}
				</>
			) : (
				<>
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
								referrerPolicy="no-referrer"
							/>
						</div>
					)}
					<Profile />
				</>
			)}
		</div>
	);
};

export default Home;
