import { useDispatch, useSelector } from "react-redux";
import {
	doc,
	setDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	getDoc,
} from "firebase/firestore";
import { useToast } from "../context/ToastContext";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";

const Block = () => {
	const { currentUser } = useSelector((state) => state.user);
	const otherUser = useSelector((state) => state.otherUser.otherUserInChat);
	const { showToast } = useToast();
	const [isBlocked, setIsBlocked] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const checkBlockedStatus = async () => {
			if (!currentUser || !otherUser) return;

			try {
				const blockerDocRef = doc(db, "blocked", currentUser.userUid);
				const blockerDocSnap = await getDoc(blockerDocRef);

				if (blockerDocSnap.exists()) {
					const { blockedUsers } = blockerDocSnap.data();
					setIsBlocked(blockedUsers.includes(otherUser.userUid));
				}
			} catch (error) {
				console.error("Error checking block status:", error);
			}
		};

		checkBlockedStatus();
	}, [currentUser, otherUser]);

	const handleBlock = async () => {
		if (!currentUser || !otherUser) return;

		try {
			const blockerDocRef = doc(db, "blocked", currentUser.userUid);

			const blockerDocSnap = await getDoc(blockerDocRef);

			if (blockerDocSnap.exists()) {
				await updateDoc(blockerDocRef, {
					blockedUsers: arrayUnion(otherUser.userUid),
				});
			} else {
				await setDoc(blockerDocRef, {
					blockedUsers: [otherUser.userUid],
				});
			}

			setIsBlocked(true);
			dispatch(setOtherUserInChat(null));
			showToast(`Blocked ${otherUser.userName} successfully.`);
		} catch (error) {
			console.error("Error blocking user:", error);
			showToast("Failed to block the user. Please try again.");
		}
	};

	const handleUnblock = async () => {
		if (!currentUser || !otherUser) return;

		try {
			const blockerDocRef = doc(db, "blocked", currentUser.userUid);

			await updateDoc(blockerDocRef, {
				blockedUsers: arrayRemove(otherUser.userUid),
			});

			setIsBlocked(false);
			dispatch(setOtherUserInChat(null));
			showToast(`Unblocked ${otherUser.userName} successfully.`);
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

export default Block;
