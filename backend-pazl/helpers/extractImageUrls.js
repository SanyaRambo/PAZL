function extractImageUrls(content) {
	const urls = [];
	if (!content || typeof content !== "object") return urls;

	const traverse = (node) => {
		if (node.type === "image" && node.attrs?.src) {
			urls.push(node.attrs.src);
		}
		if (node.content && Array.isArray(node.content)) {
			node.content.forEach(traverse);
		}
	};
	traverse(content);
	return urls;
}

module.exports = extractImageUrls;
