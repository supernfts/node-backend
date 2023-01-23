const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const userService = require("./user.service");
const emailService = require("./email.service");
const { Token } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const otpUtil = require("../utils/otp.util");
const OTP = require("../models/otp.model");
const bcrypt = require("bcryptjs");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
	const payload = jwt.verify(token, config.jwt.secret);
	const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false , expires : {$lt : new Date()}});
	if (!tokenDoc) {
		throw new Error("Token not found");
	}
	return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
	const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
	}
	const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
	const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
	await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
	return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
	const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, "minutes");
	const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
	await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
	return verifyEmailToken;
};

const generateOtp = async (phone) => {
	const expires =moment().add(config.jwt.otpExpirationMintues, "minutes");
	const otp = otpUtil.generateOtp(config.jwt.otpLength);
	const hashedOtp = await bcrypt.hash(otp,8);

	// If the otp hasn't been sent a minute ago then the query returns new document,
	// otherwise it return the previous otp document
	const otpDoc = await OTP.findOneAndUpdate(
		{
			phone,
			createdAt : {$gt : moment().subtract(1,"minutes").toDate() }
		},
		{ $setOnInsert : {
			phone,
			otp: hashedOtp,
			expiresAt:expires.toDate()
		}	},{upsert : true,new : true});

	if(otpDoc.otp != hashedOtp) {
		throw new ApiError(httpStatus.TOO_MANY_REQUESTS,"OTP has been sent less than a minute ago");
	}
	const request_id =await emailService.sendOtpSms(phone,otp);
	console.log("OtpDocument",otpDoc);
	return OTP.findByIdAndUpdate({_id : otpDoc.id},{$set : {request_id}});

};
module.exports = {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	generateResetPasswordToken,
	generateVerifyEmailToken,
	generateOtp
};
