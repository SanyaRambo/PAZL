export const getPlainTextFromJSON = (json) => {
	if (!json || !json.content) return '';
	let text = '';
	const traverse = (node) => {
		if (node.text) text += node.text + ' ';
		if (node.content) node.content.forEach(traverse);
	};
	traverse(json);
	return text.trim();
};
