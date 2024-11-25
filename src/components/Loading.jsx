const Loading = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				marginTop: "2rem",
			}}
		>
			<p>Loading...</p>
			<video
				src="../../loading_animation.webm"
				style={{ width: "12rem" }}
				autoPlay
				loop
				muted
				playsInline
			></video>
		</div>
	);
};

export default Loading;
