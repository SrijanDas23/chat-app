export const formatDate = (timestamp) => {
	if (!timestamp) return "";

	const date = new Date(timestamp.seconds * 1000);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	if (date >= today) {
		return "Today";
	} else if (date >= yesterday) {
		return "Yesterday";
	} else {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear().toString().slice(-2);
		return `${day}/${month}/${year}`;
	}
};

export const formatTime = (timestamp) => {
	if (!timestamp) return "";
	const date = new Date(timestamp.seconds * 1000);
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
};