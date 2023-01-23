const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");
const axios = require("axios");
const {indianPhoneNumber}  = require("../utils/otp.util");
const ApiError = require("../utils/ApiError");
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
	transport
		.verify()
		.then(() => logger.info("Connected to email server"))
		.catch(() => logger.warn("Unable to connect to email server. Make sure you have configured the SMTP options in .env"));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
	const msg = { from: config.email.from, to, subject, text };
	await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
	const subject = "Reset password";
	// replace this url with the link to the reset password page of your front-end app
	const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
	const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
	await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
	const subject = "Email Verification";
	// replace this url with the link to the email verification page of your front-end app
	const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
	const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
	await sendEmail(to, subject, text);
};



/**
 * Send email with html template
 *
 * @param {subject} subject
 * @param {email} recipientEmail
 * @param {Html template} templateData
 */
const sendSmsGupshup = async (to, text) => {
	return axios
		.post(`${process.env.GUPSHUP_API_URL}`,
			{
				method: "SendMessage",
				send_to: to,
				msg: text,
				msg_type: "TEXT",
				userid: process.env.GUPSHUP_API_USER,
				password: process.env.GUPSHUP_API_PASSWORD,
				format: "text",
				v: "1.1"
			}
		)
		.then(async function (response) {
			const res = response.data.split("|")[0].trim();
			if(res === "success") {
				logger.info(`Sms Service -> sendSms -> Success :: ${response.data}`);
			} else {
				logger.error(`Sms Service -> sendSms -> Error :: ${response.data}`);
			}
		});
};

const sendOtpSms= async (to, otp) => {
	try {
		const phone = indianPhoneNumber(to);
		console.log("phone number formatted",phone);
		const response = await axios.post(
			config.apis.fast2sms.url,
			`variables_values=${otp}&route=otp&numbers=${phone}`,
			{
				headers: {
					"authorization":config.apis.fast2sms.key,
					"content-type": "application/x-www-form-urlencoded",
					"cache-Control": "no-cache"
				}
			}
		);
		return response.data.request_id;
	} catch (error) {
		throw new ApiError(error.response.data.status_code, error.response.data.message);
	}
};

module.exports = {
	transport,
	sendEmail,
	sendResetPasswordEmail,
	sendVerificationEmail,
	sendSmsGupshup,
	sendOtpSms
};
