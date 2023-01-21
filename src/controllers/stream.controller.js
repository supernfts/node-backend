const httpStatus = require("http-status");
const { streamService } = require("../services");

// const ApiError = require("../utils/ApiError");
// const pick = require("../utils/pick");

const catchAsync = require("../utils/catchAsync");

const createRoom = catchAsync(async (req, res) => {
	// const comments = await commentService.getComments(req.query);
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success"});
});

const deleteRoom = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success" });
});

const editRoom = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success"});
});

const subscribeRoom = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success"});
});

const startStream = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success" });
});

const joinStream = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success" });
});

const endStream = catchAsync(async (req, res) => {
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success" });
});

module.exports = {
	createRoom,
	deleteRoom,
	editRoom,
	subscribeRoom,
	startStream,
	joinStream,
	endStream
};
