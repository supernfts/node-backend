const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService, emailService } = require("../services");
const ApiError = require("../utils/ApiError");

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerPhone = catchAsync(async (req, res) => {
	console.log(req.body);
	const user = await userService.createUser(req.body);
	await tokenService.generateOtp(req.body.phone);
	res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send({ user, tokens });
});

const loginPhone = catchAsync(async (req,res)=>{
	await userService.checkPhoneNumber(req.body.phone);
	await tokenService.generateOtp(req.body.phone);
	res.status(httpStatus.OK).send();
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
	await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
	await authService.resetPassword(req.query.token, req.body.password);
	res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
	const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
	await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
	await authService.verifyEmail(req.query.token);
	res.status(httpStatus.NO_CONTENT).send();
});

const verifyPhone = catchAsync(async(req,res)=>{
	await authService.verifyPhone(req.body.phone,req.body.otp);
	const user = await userService.verifyUserPhone(req.body.phone);
	if(!user){
		throw new ApiError(httpStatus.NOT_FOUND,"User not found");
	}
	const tokens = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.OK).send({ user, tokens });
});

module.exports = {
	register,
	registerPhone,
	login,
	loginPhone,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	verifyEmail,
	verifyPhone
};
