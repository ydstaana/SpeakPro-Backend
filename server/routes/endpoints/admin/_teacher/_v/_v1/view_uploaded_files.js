var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');
var fs = require('fs');  

module.exports = function(req, res, next){
	var dir = __dirname + "/../../../../../../../uploads/"
	fs.readdir(dir, function(err, list){
		if (err) return next(err);
		else{
			res.json(list);
		}
	})
}

