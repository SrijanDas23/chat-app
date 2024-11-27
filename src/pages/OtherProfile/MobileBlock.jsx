import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { useEffect, useState } from "react";
import {
	arrayRemove,
	arrayUnion,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { setOtherUserInChat } from "../../redux/otherUser/otherUserSlice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const MobileBlock = ({ user }) => {
	const { currentUser } = useSelector((state) => state.user);
	const { showToast } = useToast();
	const [isBlocked, setIsBlocked] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const checkBlockedStatus = async () => {
			if (!currentUser || !user) return;

			try {
				const blockerDocRef = doc(db, "blocked", currentUser.userUid);
				const blockerDocSnap = await getDoc(blockerDocRef);

				if (blockerDocSnap.exists()) {
					const { blockedUsers } = blockerDocSnap.data();
					setIsBlocked(blockedUsers.includes(user.userUid));
				}
			} catch (error) {
				console.error("Error checking block status:", error);
			}
		};

		checkBlockedStatus();
	}, [currentUser, user]);

	const handleBlock = async () => {
		if (!currentUser || !user) return;

		try {
			const blockerDocRef = doc(db, "blocked", currentUser.userUid);

			const blockerDocSnap = await getDoc(blockerDocRef);

			if (blockerDocSnap.exists()) {
				await updateDoc(blockerDocRef, {
					blockedUsers: arrayUnion(user.userUid),
				});
			} else {
				await setDoc(blockerDocRef, {
					blockedUsers: [user.userUid],
				});
			}

			setIsBlocked(true);
			navigate("/");
			dispatch(setOtherUserInChat(user));
			showToast(`Blocked ${user.userName} successfully.`);
		} catch (error) {
			console.error("Error blocking user:", error);
			showToast("Failed to block the user. Please try again.");
		}
	};

	const handleUnblock = async () => {
		if (!currentUser || !user) return;

		try {
			const blockerDocRef = doc(db, "blocked", currentUser.userUid);

			await updateDoc(blockerDocRef, {
				blockedUsers: arrayRemove(user.userUid),
			});

			setIsBlocked(false);
            navigate("/");
			dispatch(setOtherUserInChat(user));
			showToast(`Unblocked ${user.userName} successfully.`);
		} catch (error) {
			console.error("Error unblocking user:", error);
			showToast("Failed to unblock the user. Please try again.");
		}
	};

	return (
		<div>
			{isBlocked ? (
				<button onClick={handleUnblock}>Unblock</button>
			) : (
				<button onClick={handleBlock}>Block</button>
			)}
		</div>
	);
};

MobileBlock.propTypes = {
	user: PropTypes.object.isRequired,
};

export default MobileBlock;
