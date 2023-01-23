const phoneUtil = require("../utils/phoneUtil");

const phoneNumber = (value) => {
	try {
		let phone = phoneUtil.parse(value);
		if (!phoneUtil.isValidNumber(phone)) {
			return false;
		}
	}catch(err) {
		console.log(err);
		return false;
	}
	return true;
};

module.exports = {
	phoneNumber
};
