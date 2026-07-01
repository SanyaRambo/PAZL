const mongoose = require("mongoose");
const roles = require("../constants/roles");
const validator = require("validator");

const UserSchema = mongoose.Schema(
	{
		login: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		idRole: {
			type: Number,
			default: roles.USER,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		avatar: {
			type: String,
			default: null,
			validate: {
				validator: function (v) {
					return (
						v === null ||
						validator.isURL(v) ||
						(typeof v === "string" && v.startsWith("/uploads/"))
					);
				},
				message: "Image should be a valid url or upload path",
			},
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		friendRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		sentRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		theme: {
				type: String,
				default: 'dark',
				enum: ['dark', 'light']
			}
	},
	{ timestamps: true },
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
