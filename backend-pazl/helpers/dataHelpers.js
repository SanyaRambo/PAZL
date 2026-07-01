const { format } = require("date-fns");
const { zonedTimeToUtc } = require("date-fns-tz");

const DEFAULT_TIMEZONE = "UTC";


const generateDate = () => {
	return new Date(); // UTC дата (по умолчанию)
};


const formatDate = (date, pattern = "dd/MM/yyyy HH:mm:ss") => {
	if (!date) return null;
	return format(date, pattern);
};

module.exports = {
	generateDate,
	formatDate,
};
