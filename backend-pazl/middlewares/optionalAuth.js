const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
	try {
		const token = req.cookies.token;
		if (token) {
			const tokenData = verify(token);
			const user = await User.findOne({ _id: tokenData.id });
			if (user && !user.isDeleted) {
				req.user = user;
			}
		}
	} catch (err) {}
	next();
};
