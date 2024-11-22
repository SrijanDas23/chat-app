const Searchbar = () => {
	return (
		<div
			style={{
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
			}}
		>
			<input
				type="text"
				placeholder="Search..."
				style={{
					border: "1.5px solid #7e56c6",
					backgroundColor: "transparent",
					width: "13rem",
					borderRadius: "20px",
					padding: "0.5rem",
					outline: "none",
				}}
			/>
		</div>
	);
};

export default Searchbar;
