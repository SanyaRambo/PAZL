export const getColorById = (id) => {
	if (!id) return 'hsl(200, 70%, 45%)'; // цвет по умолчанию

	const str = String(id);
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	// Оттенок (hue) от 0 до 360
	const hue = Math.abs(hash % 360);
	// Насыщенность 70-80%, яркость 35-50% – обеспечивает контраст с белым
	const saturation = 70 + Math.abs(hash % 10); // 70-80%
	const lightness = 35 + Math.abs((hash >> 4) % 15); // 35-50%
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
