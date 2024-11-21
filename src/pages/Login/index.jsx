import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { setStaySignedIn } from "../../redux/user/userSlice";

const Login = () => {
	const dispatch = useDispatch();
	const { staySignedIn } = useSelector((state) => state.user);
	const { currentUser } = useSelector((state) => state.user);

	const handleCheckboxChange = (event) => {
		dispatch(setStaySignedIn(event.target.checked));
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
				height: "80vh",
				width: "80vw",
				borderRadius: "20px",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				rowGap: "2rem",
				padding: "2rem",
				boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
			}}
		>
			<h1>Welcome to Chat App!</h1>
			<p>Sign in to gain access to the site.</p>
			<OAuth />
			{!currentUser && (
				<div>
					<label
						style={{
							display: "flex",
							columnGap: "0.5rem",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
						}}
					>
						<input
							type="checkbox"
							checked={staySignedIn}
							onChange={handleCheckboxChange}
						/>
						Stay Signed In
					</label>
				</div>
			)}
			<p>
				You will be automatically directed to the chatrooms once you
				successfully sign in/log in
			</p>
		</div>
	);
};

export default Login;
