const express = require("express");
const {auth,validate} = require("../../middlewares");
const {streamValidation} = require("../../validations");
const {streamController} = require("../../controllers");

const router = express.Router();

// router
// 	.route("/stream")
// 	.post(auth(), validate(userValidation.createUser), userController.createUser)
// 	.get(auth("getUsers"), validate(userValidation.getUsers), userController.getUsers);

// router
// 	.route("/:userId")
// 	.get(auth("getUsers"), validate(userValidation.getUser), userController.getUser)
// 	.patch(auth("manageUsers"), validate(userValidation.updateUser), userController.updateUser)
// 	.delete(auth("manageUsers"), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
