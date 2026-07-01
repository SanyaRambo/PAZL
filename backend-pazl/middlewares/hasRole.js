module.exports = function (roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.idRole)) {
			res.send({ error: "Access denied" });
			return;
		}
		next();
	};
};
