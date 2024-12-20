/* eslint-disable no-unused-vars */
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setOtherUserInChat } from "../redux/otherUser/otherUserSlice";
import { useToast } from "../context/ToastContext";

const Searchbar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const auth = getAuth();

	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1000);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleSearch = async (term) => {
		if (!term.trim()) {
			setResults([]);
			return;
		}
		const trimmedTerm = term.trim();

		setLoading(true);
		try {
			const usersRef = collection(db, "users");

			const uidQuery = query(
				usersRef,
				where("userUid", ">=", trimmedTerm),
				where("userUid", "<=", trimmedTerm + "\uf8ff")
			);

			const nameQuery = query(
				usersRef,
				where("userName", ">=", trimmedTerm),
				where("userName", "<=", trimmedTerm + "\uf8ff")
			);

			const [uidSnapshot, nameSnapshot] = await Promise.all([
				getDocs(uidQuery),
				getDocs(nameQuery),
			]);
			const uidResults = uidSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const nameResults = nameSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const allResults = [...uidResults, ...nameResults];
			const uniqueResults = allResults.filter(
				(user, index, self) =>
					index === self.findIndex((u) => u.id === user.id) &&
					user.userUid !== auth.currentUser.uid
			);
			setResults(uniqueResults);
			// console.log(uniqueResults);
		} catch (error) {
			// console.error("Error searching users:", error);
			showToast("Error searching users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			handleSearch(searchTerm);
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	const handleUserSelect = (user) => {
		dispatch(setOtherUserInChat(user));
		setSearchTerm("");
		// console.log("Selected User:", user);
	};

	return (
		<div
			style={{
				borderRadius: "20px 20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
				flex: "1",
			}}
		>
			<input
				type="text"
				placeholder="Search by User Uid/Name..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{
					border: "1.5px solid rgba(255, 255, 255, 0.2)",
					backgroundColor: "transparent",
					width: isMobileView ? "100%" : "13rem",
					borderRadius: "20px",
					padding: isMobileView ? "0.5rem 0" : "0.5rem",
					outline: "none",
					textIndent: isMobileView ? "1rem" : "0",
				}}
			/>
			{loading && (
				<p style={{ fontSize: "0.8rem", textAlign: "center" }}>
					Loading...
				</p>
			)}
			<div
				style={{
					maxHeight: isMobileView ? "25dvh" : "25vh",
					overflowY: "auto",
				}}
			>
				{results.map((user) => (
					<div
						key={user.id}
						style={{
							padding: "0.5rem",
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
							columnGap: "0.5rem",
							borderRadius: "0 0 20px 20px",
						}}
						className="selectedChat"
						onClick={() => handleUserSelect(user)}
					>
						<img
							width="auto"
							height="auto"
							src={
								user.photoURL ? user.photoURL.slice(0, -6) : ""
							}
							alt={user.userName || "User image"}
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "50%",
							}}
							title={user.userName || "User Image"}
							loading="lazy"
							referrerPolicy="no-referrer"
						/>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
							}}
						>
							<h2
								style={{
									fontSize: "0.9rem",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									wordWrap: "break-word",
									maxWidth: "150px",
								}}
							>
								{user.userName}
							</h2>
							<p
								style={{
									fontSize: "0.7rem",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									wordWrap: "break-word",
									maxWidth: "150px",
								}}
							>
								{user.userUid}
							</p>
						</div>
					</div>
				))}
				{!loading && searchTerm && results.length === 0 && (
					<p
						style={{
							padding: "0.5rem",
							textAlign: "center",
							fontSize: "0.8rem",
						}}
					>
						No users found
					</p>
				)}
			</div>
		</div>
	);
};

export default Searchbar;
