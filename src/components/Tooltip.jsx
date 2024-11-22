import PropTypes from "prop-types";
const Tooltip = ({ message }) => {
	return (
		<div>
			<div
				style={{
					position: "absolute",
					top: "-40px",
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: "rgba(0, 0, 0, 0.3)",
					color: "white",
					padding: "5px 10px",
					borderRadius: "5px",
					fontSize: "0.8rem",
					textAlign: "center",
					whiteSpace: "nowrap",
				}}
			>
				{message}
			</div>
		</div>
	);
};

export default Tooltip;

Tooltip.propTypes = {
	message: PropTypes.string.isRequired,
};
