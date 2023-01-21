const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const {ObjectId} = require("mongoose").Schema.Types;
// const mongodb= require("mongodb");

const RoomSubscriberSchema = mongoose.Schema({
	roomId: {
		type : ObjectId,
		require : true,
	},
	userId: {
		type : ObjectId,
		require : true,
	}
});

// add plugin that converts mongoose to json
RoomSubscriberSchema.plugin(toJSON);
RoomSubscriberSchema.plugin(paginate);

/**
 * @typedef RoomSubscriber
 */
const RoomSubscriber = mongoose.model("RoomSubscriber", RoomSubscriberSchema);

module.exports = RoomSubscriber;
