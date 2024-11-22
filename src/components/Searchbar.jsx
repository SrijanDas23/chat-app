/* eslint-disable no-unused-vars */
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { getAuth } from "firebase/auth";

const Searchbar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const auth = getAuth();

const handleSearch = async (term) => {
	if (!term.trim()) {
		setResults([]);
		return;
	}

	setLoading(true);
	try {
		const usersRef = collection(db, "users");

		const uidQuery = query(
			usersRef,
			where("userUid", ">=", term),
			where("userUid", "<=", term + "\uf8ff")
		);

		const nameQuery = query(
			usersRef,
			where("userName", ">=", term),
			where("userName", "<=", term + "\uf8ff")
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
				index === self.findIndex((u) => u.id === user.id)
		);

		setResults(uniqueResults);
	} catch (error) {
		console.error("Error searching users:", error);
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

	return (
		<div
			style={{
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.14)",
			}}
		>
			<input
				type="text"
				placeholder="Search by User Uid..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{
					border: "1.5px solid #7e56c6",
					backgroundColor: "transparent",
					width: "13rem",
					borderRadius: "20px",
					padding: "0.5rem",
					outline: "none",
				}}
			/>
			{loading && (
				<p style={{ fontSize: "0.8rem", textAlign: "center" }}>
					Loading...
				</p>
			)}
			<div style={{}}>
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
						onClick={() => console.log("Selected User:", user)}
					>
						<img
							src={user.photoURL}
							alt={user.displayName}
							style={{ width: "40px", borderRadius: "50%" }}
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
