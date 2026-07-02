function buildQuery({ search, isPublished, author, userId, includeDeleted }) {
	const query = {};

	if (search) {
		query.title = { $regex: search, $options: "i" };
	}


	if (isPublished !== undefined) {
		query.isPublished = isPublished;
	}


	if (author) {
		query.author = author;
	}


	if (userId) {
		query.likes = { $elemMatch: { userId } };
		query.$or = [{ isPublished: true }, { author: userId }];
	}

	if (!includeDeleted) {
		query.isDeleted = {
			$ne: true,
		};
	}

	return query;
}

module.exports = {
	buildQuery,
};
