import PropTypes from "prop-types";
const Tooltip = ({ message, top }) => {
	return (
		<div>
			<div
				style={{
					position: "absolute",
					top: top,
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: "#24063dc3",
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

Tooltip.propTypes = {
	message: PropTypes.string.isRequired,
	top: PropTypes.string,
};

Tooltip.defaultProps = {
	top: "-40px",
};

export default Tooltip;
