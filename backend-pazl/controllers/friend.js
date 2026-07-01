const User = require("../models/User");

async function toggleFollow(currentUserId, targetUserId) {
	const currentUser = await User.findById(currentUserId);
	const targetUser = await User.findById(targetUserId);
	if (!currentUser || !targetUser) throw new Error("Пользователь не найден");

	const isFollowing = currentUser.following.some(
		(id) => id.toString() === targetUserId,
	);

	if (isFollowing) {
		currentUser.following = currentUser.following.filter(
			(id) => id.toString() !== targetUserId,
		);
		targetUser.followers = targetUser.followers.filter(
			(id) => id.toString() !== currentUserId,
		);
	} else {
		currentUser.following.push(targetUserId);
		targetUser.followers.push(currentUserId);
	}

	await currentUser.save();
	await targetUser.save();

	return { isFollowing: !isFollowing };
}

async function sendFriendRequest(currentUserId, targetUserId) {
	if (currentUserId === targetUserId) throw new Error("Нельзя добавить себя");

	const currentUser = await User.findById(currentUserId);
	const targetUser = await User.findById(targetUserId);
	if (!currentUser || !targetUser) throw new Error("Пользователь не найден");

	if (currentUser.friends.some((id) => id.toString() === targetUserId)) {
		throw new Error("Уже друзья");
	}
	if (
		targetUser.friendRequests.some((id) => id.toString() === currentUserId)
	) {
		throw new Error("Заявка уже отправлена");
	}
	if (currentUser.sentRequests.some((id) => id.toString() === targetUserId)) {
		throw new Error("Вы уже отправили заявку");
	}

	currentUser.sentRequests.push(targetUserId);
	targetUser.friendRequests.push(currentUserId);

	await currentUser.save();
	await targetUser.save();
}

async function acceptFriendRequest(currentUserId, requesterId) {
	const currentUser = await User.findById(currentUserId);
	const requester = await User.findById(requesterId);
	if (!currentUser || !requester) throw new Error("Пользователь не найден");

	if (
		!currentUser.friendRequests.some((id) => id.toString() === requesterId)
	) {
		throw new Error("Заявка не найдена");
	}

	// Удаляем заявки
	currentUser.friendRequests = currentUser.friendRequests.filter(
		(id) => id.toString() !== requesterId,
	);
	requester.sentRequests = requester.sentRequests.filter(
		(id) => id.toString() !== currentUserId,
	);

	// Добавляем в друзья
	currentUser.friends.push(requesterId);
	requester.friends.push(currentUserId);

	await currentUser.save();
	await requester.save();
}

// Отклонить заявку
async function rejectFriendRequest(currentUserId, requesterId) {
	const currentUser = await User.findById(currentUserId);
	const requester = await User.findById(requesterId);
	if (!currentUser || !requester) throw new Error("Пользователь не найден");

	if (
		!currentUser.friendRequests.some((id) => id.toString() === requesterId)
	) {
		throw new Error("Заявка не найдена");
	}

	currentUser.friendRequests = currentUser.friendRequests.filter(
		(id) => id.toString() !== requesterId,
	);
	requester.sentRequests = requester.sentRequests.filter(
		(id) => id.toString() !== currentUserId,
	);

	await currentUser.save();
	await requester.save();
}

// Отменить отправленную заявку
async function cancelFriendRequest(currentUserId, targetUserId) {
	const currentUser = await User.findById(currentUserId);
	const targetUser = await User.findById(targetUserId);
	if (!currentUser || !targetUser) throw new Error("Пользователь не найден");

	if (
		!currentUser.sentRequests.some((id) => id.toString() === targetUserId)
	) {
		throw new Error("Заявка не найдена");
	}

	currentUser.sentRequests = currentUser.sentRequests.filter(
		(id) => id.toString() !== targetUserId,
	);
	targetUser.friendRequests = targetUser.friendRequests.filter(
		(id) => id.toString() !== currentUserId,
	);

	await currentUser.save();
	await targetUser.save();
}

async function removeFriend(currentUserId, friendId) {
	const currentUser = await User.findById(currentUserId);
	const friend = await User.findById(friendId);
	if (!currentUser || !friend) throw new Error("Пользователь не найден");
	if (!currentUser.friends.some((id) => id.toString() === friendId)) {
		throw new Error("Не является другом");
	}
	currentUser.friends = currentUser.friends.filter(
		(id) => id.toString() !== friendId,
	);
	friend.friends = friend.friends.filter(
		(id) => id.toString() !== currentUserId,
	);
	await currentUser.save();
	await friend.save();
}

async function getFriends(userId, { limit = 20, offset = 0, search = "" }) {
	const user = await User.findById(userId);
	if (!user) return { items: [], totalCount: 0, hasMore: false };

	const query = search ? { login: { $regex: search, $options: "i" } } : {};
	const total = await User.countDocuments({
		_id: { $in: user.friends },
		...query,
	});

	const friends = await User.find({
		_id: { $in: user.friends },
		...query,
	})
		.select("login idRole createdAt avatar")
		.skip(Number(offset))
		.limit(Number(limit))
		.sort({ createdAt: -1 });

	return {
		items: friends,
		totalCount: total,
		hasMore: offset + friends.length < total,
	};
}

async function getFollowing(userId, { limit = 20, offset = 0, search = "" }) {
	const user = await User.findById(userId);
	if (!user) return { items: [], totalCount: 0, hasMore: false };

	const query = search ? { login: { $regex: search, $options: "i" } } : {};
	const total = await User.countDocuments({
		_id: { $in: user.following },
		...query,
	});

	const following = await User.find({
		_id: { $in: user.following },
		...query,
	})
		.select("login idRole createdAt avatar")
		.skip(Number(offset))
		.limit(Number(limit))
		.sort({ createdAt: -1 });

	return {
		items: following,
		totalCount: total,
		hasMore: offset + following.length < total,
	};
}

async function getFollowers(userId, { limit = 20, offset = 0, search = "" }) {
	const user = await User.findById(userId);
	if (!user) return { items: [], totalCount: 0, hasMore: false };

	const query = search ? { login: { $regex: search, $options: "i" } } : {};
	const total = await User.countDocuments({
		_id: { $in: user.followers },
		...query,
	});

	const followers = await User.find({
		_id: { $in: user.followers },
		...query,
	})
		.select("login idRole createdAt avatar")
		.skip(Number(offset))
		.limit(Number(limit))
		.sort({ createdAt: -1 });

	return {
		items: followers,
		totalCount: total,
		hasMore: offset + followers.length < total,
	};
}

async function getFriendRequests(
	userId,
	{ limit = 20, offset = 0, search = "" },
) {
	const user = await User.findById(userId);
	if (!user) return { items: [], totalCount: 0, hasMore: false };

	const query = search ? { login: { $regex: search, $options: "i" } } : {};
	const total = await User.countDocuments({
		_id: { $in: user.friendRequests },
		...query,
	});

	const requests = await User.find({
		_id: { $in: user.friendRequests },
		...query,
	})
		.select("login idRole createdAt avatar")
		.skip(Number(offset))
		.limit(Number(limit))
		.sort({ createdAt: -1 });

	return {
		items: requests,
		totalCount: total,
		hasMore: offset + requests.length < total,
	};
}

async function getSentRequests(
	userId,
	{ limit = 20, offset = 0, search = "" },
) {
	const user = await User.findById(userId);
	if (!user) return { items: [], totalCount: 0, hasMore: false };

	const query = search ? { login: { $regex: search, $options: "i" } } : {};
	const total = await User.countDocuments({
		_id: { $in: user.sentRequests },
		...query,
	});

	const sent = await User.find({
		_id: { $in: user.sentRequests },
		...query,
	})
		.select("login idRole createdAt")
		.skip(Number(offset))
		.limit(Number(limit))
		.sort({ createdAt: -1 });

	return {
		items: sent,
		totalCount: total,
		hasMore: offset + sent.length < total,
	};
}

module.exports = {
	toggleFollow,
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest,
	removeFriend,
	getFriends,
	getFollowing,
	getFollowers,
	getFriendRequests,
	getSentRequests,
};
