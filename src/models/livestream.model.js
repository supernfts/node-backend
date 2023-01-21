const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const {ObjectId} = require("mongoose").Schema.Types;
// const mongodb= require("mongodb");

const LivestreamSchema = mongoose.Schema({
	roomId: {
		type : ObjectId,
		require : true,
	},
	users: {
		type : Number,
		require : true,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	}
});

// add plugin that converts mongoose to json
LivestreamSchema.plugin(toJSON);
LivestreamSchema.plugin(paginate);

/**
 * @typedef Livestream
 */
const Livestream = mongoose.model("LivestreamSchema", LivestreamSchema);

module.exports = Livestream;
