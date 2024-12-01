import { onSnapshot } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Typing = ({ chatRoomRef, otherUserUserUid }) => {
	const [isTyping, setIsTyping] = useState(false);
	useEffect(() => {
		const typing = onSnapshot(chatRoomRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.data();
				const otherUserTyping =
					data.typing?.[otherUserUserUid] || false;

				const timeout = setTimeout(() => {
					setIsTyping(otherUserTyping);
				}, 300);

				return () => clearTimeout(timeout);
			}
		});

		return () => typing();
	}, [chatRoomRef, otherUserUserUid]);

	return (
		<div>
			{isTyping && (
				<p
					style={{
						fontSize: "0.7rem",
						color: "rgba(255,255,255,0.8)",
					}}
				>
					Typing...
				</p>
			)}
		</div>
	);
};

Typing.propTypes = {
	chatRoomRef: PropTypes.shape({
		converter: PropTypes.any,
		_key: PropTypes.object.isRequired,
		type: PropTypes.string.isRequired,
		firestore: PropTypes.object.isRequired,
	}).isRequired,
	otherUserUserUid: PropTypes.string.isRequired,
};

export default Typing;
