const ChatList = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				// rowGap: "1rem",
				paddingTop: "0",
				overflowY: "auto",
			}}
		>
			{[...Array(8)].map((_, index) => (
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
							This person&apos;s text is wdhdw wdowhdw dwkndw kwndkwnd{" "}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatList;
