const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const {ObjectId} = require("mongoose").Schema.Types;
// const mongodb= require("mongodb");

const ActionSubSchema =  mongoose.Schema({
	action: {
		type : String,
		require : true,
	},
},
{ createdAt: true, updatedAt: false }
);

const LivestreamUserSchema = mongoose.Schema({
	streamId: {
		type : ObjectId,
		require : true,
	},
	userId:{
		type : ObjectId,
		require : true,
	},
	actions: {
		type : [ActionSubSchema],
		default : []
	}
});

// add plugin that converts mongoose to json
LivestreamUserSchema.plugin(toJSON);
LivestreamUserSchema.plugin(paginate);

/**
 * @typedef Livestream
 */
const LivestreamUser = mongoose.model("LivestreamUserSchema", LivestreamUserSchema);

module.exports = LivestreamUser;
