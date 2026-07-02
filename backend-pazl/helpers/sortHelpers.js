function buildSortOptions(
	sortBy,
	order,
	allowedFields,
	defaultField = "createdAt",
) {
	const safeField = allowedFields.includes(sortBy) ? sortBy : defaultField;

	const sortOrder = order === "asc" ? 1 : -1;


	if (safeField === 'likedAt') {
		return { 'likes.likedAt': sortOrder, _id: 1 };
	}

	const sortObject = { [safeField]: sortOrder };


	if (safeField !== '_id') {
		sortObject._id = 1;
	}

	return sortObject;
}

module.exports = {
	buildSortOptions,
};
