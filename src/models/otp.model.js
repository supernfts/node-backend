const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const bcrypt = require("bcryptjs");
const {phoneNumber} = require("./custom.validation");
const otpSchema = mongoose.Schema({
	request_id : {
		type : String,
		required : false
	},
	otp : {
		type : String,
		required : true
	},
	phone : {
		type : String,
		required : true,
		validator : phoneNumber
	},
	expiresAt : {
		type : Date,
		required : true
	}}
,{
	timestamps: true,
}
);


/**
 * Check if otp matches the user's otp
 * @param {string} otp
 * @returns {Promise<boolean>}
 */
otpSchema.methods.isOtpMatch = async function (otp) {
	const userOtp = this;
	return bcrypt.compare(otp, userOtp.otp);
};

otpSchema.pre("save", async function (next) {
	const userOtp = this;
	if (userOtp.isModified("otp")) {
		userOtp.otp = await bcrypt.hash(userOtp.otp, 8);
	}
	next();
});


// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);
otpSchema.plugin(paginate);

/**
 * @typedef Comment
 */
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
