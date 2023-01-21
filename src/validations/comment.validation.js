const Joi = require("joi");
const {objectId, sortOrder} = require("./custom.validation");

const getComments = {
	query: Joi.object().keys({
		parentType : Joi.string().required().valid("VIDEO","COMMENT","LIVESTREAM"),
		parentId : Joi.string().required().custom(objectId),
		sortOrder : Joi.string().optional().default(1).custom(sortOrder),
		limit: Joi.number().optional().default(100),
		page: Joi.number().optional().default(0),
	}),
};

const createComment = {
	body: Joi.object().keys({
		parentType : Joi.string().required().valid("VIDEO","COMMENT","LIVESTREAM"),
		parentId : Joi.string().required().custom(objectId),
		comment : Joi.string().required().default(""),
		// channelId : Joi.string().required().custom(objectId),
		tags : Joi.array().items(Joi.string().required()).min(1),
		channelTagged : Joi.string().optional().custom(objectId)
	}),
};

const updateComment = {
	body: Joi.object().keys({
		commentId : Joi.string().required().custom(objectId),
		comment : Joi.string().optional(),
		// channelId : Joi.string().required(),
		tags : Joi.array().items(Joi.string().required()).min(1),
		channelTagged : Joi.string().optional().custom(objectId)
	}),
};

const deleteComment = {
	body: Joi.object().keys({
		commentId : Joi.string().required().custom(objectId),
		// channelId : Joi.string().required()
	}),
};

module.exports = {
	getComments,
	createComment,
	updateComment,
	deleteComment
};
