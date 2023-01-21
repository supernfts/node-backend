const httpStatus = require("http-status");
const { commentService } = require("../services");
const ApiError = require("../utils/ApiError");
// const pick = require("../utils/pick");
// const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const getComments = catchAsync(async (req, res) => {
	const comments = await commentService.getComments(req.query);
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: comments });
});

const createComment = catchAsync(async (req, res) => {
	const comment = await commentService.createComment(req.body, req.user);
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: comment });
});

const updateComment = catchAsync(async (req, res) => {
	// await commentService.validateCommentOwner(req.body.commentId,req.user);
	const updatedComment = await commentService.updateComment(req.body, req.user);
	if (updatedComment == null) {
		throw new ApiError(httpStatus.NOT_FOUND, "Comment Not Found");
	}
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success", data: updatedComment });
});

const deleteComment = catchAsync(async (req, res) => {
	// await commentService.validateCommentOwner(req.body.commentId,req.user);
	await commentService.deleteComment(req.body, req.user);
	res.status(httpStatus.OK).send({ code: httpStatus.OK, message: "success" });
});

module.exports = {
	getComments,
	createComment,
	updateComment,
	deleteComment,
};
