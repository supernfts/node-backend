const otpGenerator = require("otp-generator");
const phoneUtil = require("./phoneUtil.js");
const ApiError = require("./ApiError.js");
const httpStatus = require("http-status");
const generateOtp = (otp_length) => {
	return otpGenerator.generate(otp_length,{lowerCaseAlphabets: false,specialChars: false});
};
const indianPhoneNumber = (phoneNumber) => {
	try {
		// Parse the phone number
		let phone = phoneUtil.parse(phoneNumber, "IN");

		// Check if the phone number is valid
		if (phoneUtil.isValidNumber(phone)) {
			// Format the phone number in the E164 format
			return phone.getNationalNumber();
		} else {
			throw new ApiError(httpStatus.BAD_REQUEST,"Invalid phone number");
		}
	} catch (err) {
		throw new ApiError(httpStatus.BAD_REQUEST,"Invalid phone number");
	}
};
module.exports = {
	generateOtp,
	indianPhoneNumber
};

