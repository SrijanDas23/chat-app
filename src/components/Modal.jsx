import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const Modal = ({ onClose, children }) => {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.3)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}
		>
			<div
				style={{
					backgroundColor: "#24063deb",
					padding: "20px",
					borderRadius: "8px",
					position: "relative",
					width: "80%",
					maxWidth: "500px",
					maxHeight: "50dvh",
					overflowY: "auto",
				}}
			>
				{children}
				<button
					style={{
						position: "absolute",
						top: "10px",
						right: "10px",
						border: "none",
						cursor: "pointer",
						outline: "none",
						background:"none"
					}}
					onClick={onClose}
				>
					<IoClose size={25} />
				</button>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node,
};

export default Modal;
