import { useToast } from "../context/ToastContext";

const Toast = () => {
	const { toast } = useToast();

	if (!toast.message) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: "20px",
				right: "20px",
				backgroundColor: "rgba(0,0,0,0.2)",
				color: "#fff",
				padding: "10px 20px",
				borderRadius: "8px",
				boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
				zIndex: "1000",
				fontSize: "14px",
				opacity: "1",
			}}
		>
			{toast.message}
		</div>
	);
};

export default Toast;
