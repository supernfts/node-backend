const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { validate : uuidValidate,version : uuidVersion } =require( "uuid");
const {ObjectId} = require("mongoose").Schema.Types;

const Stats = mongoose.Schema({
	views : {
		type     : Number,
		required : true,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	},
	likes :  {
		type     : Number,
		required : true,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	},
	dislikes : {
		type     : Number,
		required : true,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	},
	comments : {
		type     : Number,
		required : true,
		default : 0,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		}
	}
}, { _id : false });

const Thumbnails = mongoose.Schema({
	parentUrl : {
		type : String,
		require: false,
		URL : true
	},
	path : {
		type : String,
		require: false
	},
	width : {
		type     : Number,
		required : true,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		},
		defaul : 0
	},
	height : {
		type     : Number,
		required : true,
		validate : {
			validator : Number.isInteger,
			message   : "{VALUE} is not an integer value"
		},
		default : 0
	}
}, { _id : false });

const CDNUrl = mongoose.Schema({

	parentUrl : {
		type : String,
		require: false,
		URL : true
	},
	video : {
		type : String,
		require: false
	},
	dash : {
		type : String,
		require : false
	},
	hls : {
		type : String,
		require: false
	}
}, { _id : false });

const VideoSchema = mongoose.Schema(
	{
		uuid : {
			type : String,
			require:true,
			validator : function uuidValidateV4(uuid) {
				return uuidValidate(uuid) && uuidVersion(uuid) === 4;
			},
			message : "Invalid uuidv4",
			unique: true
		},
		stats : {
			type : Stats,
			require: true,
			default : () => ({})
		},
		creator : {
			type :ObjectId,
			require: true
		},
		thumbnails : {
			type : [Thumbnails],
			require : false
		},
		tags : {
			type : [String],
			require : true,
			default : []
		},
		description : {
			type : String,
			require : true,
			default : ""
		},
		title : {
			type : String,
			require: true,
			default : ""
		},
		cdnLocation : {
			type : CDNUrl,
			require : false
		}
	},{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
VideoSchema.plugin(toJSON);
VideoSchema.plugin(paginate);

/**
 * @typedef Video
 */
const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;
