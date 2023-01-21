const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");

// const { v4 } = require("uuid");

const {Comment,Video, User} = require("../models/");
const ObjectId = require("mongodb").ObjectID;

// The ownership of channel is checked over here (this function would be useful to see if the channel by which the comment is posted is owned by the user)
const validateCommentOwner = async(commentId,userId)=>{
	console.log("Comment Owner validation",commentId);
	var aggregatePipeline =[
		{"$match" : {"_id" : new ObjectId(commentId),"deletedAt" : null}},
		{
			"$lookup" : {
				"from" : "ftv_channels",
				"localField" : "channelId",
				"foreignField" : "_id",
				"as" : "channel"
			}
		},
		{
			"$project" : {"owner" : {"$arrayElemAt" : ["$channel.ownerId",0]}}
		}
	];
	var result = await Comment.aggregate(aggregatePipeline);
	console.log(result,result[0]?.owner?.toString() == userId);
	if(!result || ! result?.length ) {
		throw new ApiError(httpStatus.NOT_FOUND,"Comment Not Found");
	}
	else if(result[0]?.owner?.toString() != userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED,"Sender not Comment Owner");
	}
};

// Check if the comment's Parent is valid element
const validateCommentParent = async(parentId,parentType) =>{
	let result;
	if(parentType == "VIDEO") {
		result = await Video.findOneAndUpdate({_id : new ObjectId(parentId)},{"$inc":{"stats.comments" : 1}});
	}
	else if(parentType == "COMMENT"){
		result = await Comment.findOneAndUpdate({_id : new ObjectId(parentId),parentType : "VIDEO",deletedAt : null},{"$inc":{"stats.comments" : 1}});
	}
	if(!result) throw new ApiError(httpStatus.BAD_REQUEST,parentType + " not found");
	else return true;
};

const createComment = async(filter,userId)=>{
	console.log("inside create comment",filter);
	await validateCommentParent(filter.parentId,filter.parentType);
	filter.userId = userId;
	await Comment.create(filter);
	return Comment.findOne(filter).populate("userId",["role","name","profilePic","profileBgColor","_id"]);
};

const getComments = async(filter) => {
	return Comment.aggregate([
		{
			"$match" : {
				"parentType" : filter.parentType,
				"parentId" : new ObjectId(filter.parentId),
				"deletedAt" : null
			}
		},
		{
			"$sort" : {"createdAt" : filter.sortOrder}
		},
		{"$skip" : filter.limit * filter.page},
		{"$limit" : filter.limit},
		{"$lookup" : {
			"from" : User.collection.name,
			"localField" : "userId",
			"foreignField" : "_id",
			"let" : {},
			"pipeline" : [{"$project" : {"name" : 1, "profilePic":1, "profileBgColor":1, "role":1,"id":"$_id","_id":0}}],
			"as" : "user"
		}},
		{"$addFields" : {"userId" : {"$arrayElemAt" : ["$user",0]}}},
		{"$project" : {"user":0}}
	]);
};

const updateComment = async(filter,userId) => {
	return Comment.findOneAndUpdate(
		{
			"_id" : filter.commentId,
			"userId" : userId,
			"deletedAt" : null
		},
		{
			$set : pick(filter,["comment","tags","channelTagged"])
		},
		{"new" : true}
	).populate("userId",["role","name","profilePic","profileBgColor","_id"]);
};

const deleteComment = async(filter,userId) => {
	var deletedComment = await Comment.findOneAndUpdate(
		{
			"_id" : filter.commentId,
			"userId" : userId,
			"deletedAt" : null
		},
		{
			$set : {"deletedAt":Date.now()}
		}
	);
	if(deletedComment == null)
	{
		throw new ApiError(httpStatus.NOT_FOUND,"Comment Not Found");
	}
	if(deletedComment.parentType == "VIDEO") {
		await Video.findOneAndUpdate({_id : new ObjectId(deletedComment.parentId)},{"$inc":{"stats.comments" : -1}});
	}
	else if(deletedComment.parentType == "COMMENT"){
		await Comment.findOneAndUpdate({_id : new ObjectId(deletedComment.parentId),parentType : "VIDEO",deletedAt : null},{"$inc":{"stats.comments" : -1}});
	}
};

module.exports = {
	validateCommentOwner,
	createComment,
	getComments,
	updateComment,
	deleteComment
};
