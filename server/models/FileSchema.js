var mongoose = require('mongoose')

var FileSchema = new mongoose.Schema({
	fileName : String,
	displayName:String,
	author: {
		type : mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	uploadDate : Date,
	fileSize : Number,
});


var File = mongoose.model('File', FileSchema);

module.exports =File;