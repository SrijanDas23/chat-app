import Chat from "../../components/Chat";
import Sidebar from "../../components/Sidebar";

const Home = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 3fr",
				height: "80vh",
				width: "80vw",
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				rowGap: "2rem",
				padding: "2rem",
				boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
			}}
		>
			<Sidebar />
			<Chat />
		</div>
	);
};

export default Home;
