//eslint-disable
const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {streamValidation} = require("../../validations");
const {streamController} = require("../../controllers");

const router = express.Router();

// router
// 	.route("/room")
// 	.get()
// 	.post();

// router
// 	.route("/room/:roomId")
// 	.post(streamController.subscribeRoom)
// 	.patch(streamController.editRoom)
// 	.delete(streamController.deleteRoom);

// router
// 	.route("/livestream")
// 	.get()
// 	.post(streamController.startStream);

// router
// 	.route("/livestream/:streamId")
// 	.post()
// 	.delete();

module.exports = router;
