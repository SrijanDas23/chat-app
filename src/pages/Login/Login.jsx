import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { setStaySignedIn } from "../../redux/user/userSlice";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const dispatch = useDispatch();
	const { staySignedIn } = useSelector((state) => state.user);
	const { currentUser } = useSelector((state) => state.user);

	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
	const [loading, setLoading] = useState(false);

	const { showToast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		const navigateToHome = () => {
			try {
				setLoading(true);
				navigate("/");
				showToast("You have been redirected back to home page");
				setLoading(false);
				// eslint-disable-next-line no-unused-vars
			} catch (error) {
				// console.error("Error redirecting to home page:", error);
				setLoading(false);
			}
		};
		if (currentUser) {
			navigateToHome();
		}
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 400);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleCheckboxChange = (event) => {
		dispatch(setStaySignedIn(event.target.checked));
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
				height: isMobileView ? "94dvh" : "80vh",
				width: isMobileView ? "94vw" : "80vw",
				borderRadius: isMobileView ? "0px" : "20px",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				rowGap: isMobileView ? "2rem" : "2rem",
				padding: isMobileView ? "3dvh 3vw" : "2rem",
				boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
				textAlign: "center",
			}}
		>
			<Helmet>
				<title>Sign In</title>
				<meta
					name="description"
					content="Sign In page. You need to sign in to gain access to our website"
				/>
				<link
					rel="canonical"
					href="https://chatt-app23.netlify.app/login"
				/>
			</Helmet>
			<h1>Welcome to Chat App!</h1>
			<p>Sign in to gain access to the site.</p>
			<OAuth setLoading={setLoading} />
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
