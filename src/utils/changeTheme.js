export const hexToRgba = (hex, opacity) => {
	let r = 0,
		g = 0,
		b = 0;

	if (hex.length === 4) {
		r = parseInt(hex[1] + hex[1], 16);
		g = parseInt(hex[2] + hex[2], 16);
		b = parseInt(hex[3] + hex[3], 16);
	} else if (hex.length === 7) {
		r = parseInt(hex[1] + hex[2], 16);
		g = parseInt(hex[3] + hex[4], 16);
		b = parseInt(hex[5] + hex[6], 16);
	}

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const changeRootBackground = (theme) => {
	const root = document.documentElement;

	const gradient = `linear-gradient(to bottom, ${theme.join(", ")})`;
	root.style.setProperty("background-image", gradient);

	root.style.setProperty("--gradient-start", theme[0]);
	root.style.setProperty("--gradient-end", theme[theme.length - 1]);

	root.style.setProperty("--button-bg", theme[theme.length - 1]);
	root.style.setProperty("--button-border-hover", theme[0]);

	const trackColor = hexToRgba(theme[0], 0.3);
	root.style.setProperty("--scrollbar-track", trackColor);

	const thumbColor = hexToRgba(theme[1] || theme[0], 0.8);
	root.style.setProperty("--scrollbar-thumb", thumbColor);

	root.style.setProperty("--scrollbar-thumb-hover", theme[theme.length - 1]);
};
