import Searchbar from "./Searchbar";
import ChatList from "./ChatList";

const Sidebar = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				maxHeight: "80vh",
				rowGap: "1rem"
			}}
		>
			<div
				style={{
					padding: "1rem 2rem",
					borderRadius: "20px",
					backgroundColor: "rgba(0, 0, 0, 0.07)",
				}}
			>
				<Searchbar />
			</div>
			<ChatList />
		</div>
	);
};

export default Sidebar;
