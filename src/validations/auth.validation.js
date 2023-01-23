const Joi = require("joi");
const { password, phoneNumber} = require("./custom.validation");
const config = require("../config/config");

// Email regist Flow  :
const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		name: Joi.string().required(),
		phoneNumber: Joi.string().required().custom(phoneNumber),
	}),
};

const loginEmail = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const loginPhone = {
	body: Joi.object().keys({
		phone: Joi.string().required().custom(phoneNumber),
	}),
};

const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

const resetPassword = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
	body: Joi.object().keys({
		password: Joi.string().required().custom(password),
	}),
};

const verifyEmail = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

const registerPhone = {
	body: Joi.object().keys({
		phone: Joi.string().required().custom(phoneNumber),
	}),
};

const verifyPhone = {
	body: Joi.object().keys({
		phone: Joi.string().required().custom(phoneNumber),
		otp: Joi.string().required().min(config.jwt.otpLength).max(config.jwt.otpLength),
	}),
};


const setCredentials = {
	body: Joi.object().keys({
		password: Joi.string().required().custom(password),
		name: Joi.string().required()
	}),
};

module.exports = {
	register,
	loginEmail,
	loginPhone,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
	registerPhone,
	verifyPhone,
	setCredentials
};
