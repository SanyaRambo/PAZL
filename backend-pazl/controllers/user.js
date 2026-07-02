const bcrypt = require("bcrypt");
const User = require("../models/User");
const ROLES = require("../constants/roles");
const { generate } = require("../helpers/token");
const { generateDate } = require("../helpers/dataHelpers");
const { buildQuery } = require('../helpers/queryHelpers.js')
const { buildSortOptions } = require('../helpers/sortHelpers');
const { USER_SORT_FIELDS } = require('../constants/sortFields');

async function register({
	login,
	password,
	replayPassword,
	createdAt,
	updatedAt,
}) {
	if (!password || password.trim() === "") {
		throw new Error("Password is empty");
	}

	if (password !== replayPassword) {
		throw new Error("Passwords is not similar");
	}

	const passwordHash = await bcrypt.hash(password.trim(), 10);

	const user = await User.create({
		login: login.trim(),
		password: passwordHash,
		createdAt,
		updatedAt,
	});
	const token = generate({ id: user.id });

	return { user, token };
}

async function login(login, password) {
	const user = await User.findOne({ login: login.trim() });

	if (!user) {
		throw new Error("User not founded!");
	}

	if (user.isDeleted) {
		throw new Error("User not founded!");
	}

	const isPasswordMatch = await bcrypt.compare(
		password.trim(),
		user.password,
	);

	if (!isPasswordMatch) {
		throw new Error("Invalid password");
	}

	const token = generate({ id: user.id });

	return { token, user };
}

async function getUsers({ limit, offset, search, includeDeleted = false, order, sortBy }) {

	const query = buildQuery({ search, includeDeleted });


		const sortOptions = buildSortOptions(
			sortBy,
			order,
			USER_SORT_FIELDS,
			"createdAt",
		);

	const [users, total] = await Promise.all([
		User.find(query)
			.skip(Number(offset))
			.limit(Number(limit))
			.sort(sortOptions),
		User.countDocuments(query),
	]);

	return {
		items: users,
		totalCount: total,
		hasMore: Number(offset) + users.length < total,
	};
}

function getRoles() {
	return [
		{ id: ROLES.ADMIN, name: "Admin" },
		{ id: ROLES.MODERATOR, name: "Moderator" },
		{ id: ROLES.USER, name: "User" },
		{ id: ROLES.GUEST, name: "Guest" },
	];
}

async function deleteUser(userId, currentUserId, currentUserRole) {
	if (userId === currentUserId) {
		return User.findByIdAndUpdate(
			userId,
			{ isDeleted: true, deletedAt: generateDate() },
			{ returnDocument: 'after' },
		);
	}
	if (currentUserRole === ROLES.ADMIN) {
		return User.findByIdAndUpdate(
			userId,
			{ isDeleted: true, deletedAt: generateDate() },
			{ returnDocument: 'after' },
		);
	}
	throw new Error("Access denied");
}

async function updateUser(userId, userData, currentUserRole, currentUserId) {
	if (currentUserRole !== ROLES.ADMIN) {
		throw new Error("Access denied");
	}
	const targetUser = await User.findById(userId);
	if (!targetUser) throw new Error("User not found");
	if (targetUser.idRole === ROLES.ADMIN && userId !== currentUserId) {
		throw new Error("Cannot change role of another admin");
	}

	if (userId === currentUserId) {
		throw new Error("You cannot change your own role");
	}

	return User.findByIdAndUpdate(userId, userData, {
		returnDocument: "after",
	});
}

async function getUserProfile(userId) {
	const user = await User.findById(userId).select(
		"login idRole createdAt avatar friends followers following isDeleted deletedAt",
	);
	if (!user) throw new Error("Пользователь не найден");

	return {
		id: user.id,
		login: user.login,
		idRole: user.idRole,
		registeredAt: user.createdAt,
		avatar: user.avatar,
		isDeleted: user.isDeleted,
		deletedAt: user.deletedAt,
		friendsCount: user.friends.length,
		followersCount: user.followers.length,
		followingCount: user.following.length,
	};
}

async function updateUserProfile(userId, updateData) {
	const user = await User.findById(userId);
	if (!user) throw new Error("Пользователь не найден");

	if (updateData.login !== undefined) {
		const existing = await User.findOne({
			login: updateData.login,
			_id: { $ne: userId },
		});
		if (existing) throw new Error("Логин уже занят");
		user.login = updateData.login;
	}
	if (updateData.avatar !== undefined) {
		user.avatar = updateData.avatar;
	}
	if (updateData.theme !== undefined) {
		user.theme = updateData.theme;
	}

	await user.save();
	return user;
}

async function deleteUserProfile(userId) {
	const user = await User.findByIdAndUpdate(
		userId,
		{ isDeleted: true, deletedAt: new Date() },
		{ returnDocument: 'after' },
	);
	if (!user) throw new Error("Пользователь не найден");
	return user;
}

module.exports = {
	register,
	login,
	getUsers,
	getRoles,
	deleteUser,
	updateUser,
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
};
