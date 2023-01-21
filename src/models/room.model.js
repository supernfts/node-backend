const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const {ObjectId} = require("mongoose").Schema.Types;
const mongodb= require("mongodb");

const RoomSchema = mongoose.Schema({
	hostId: {
		type : ObjectId,
		require : true
	},
	strength: {
		type: Number,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	},
	title:{
		type: String,
		required: true,
		default: ""
	},
	description: {
		type: String,
		required: true,
		default: ""
	},
	liveDate: {
		type: Date,
		required : false,
	},
	deletedAt: {
		type: Date,
		required : false
	},
	subscribers : {
		type: Number,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	},
	streamId : {
		type: ObjectId,
		required: true,
		default : new mongodb.ObjectID("000000000000000000000000"),
	}
});

// add plugin that converts mongoose to json
RoomSchema.plugin(toJSON);
RoomSchema.plugin(paginate);

/**
 * @typedef Room
 */
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
