var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function(req, res, next){
	console.log(req.params.filename);
	res.download(__dirname + "/../../../../../../../uploads/" + req.params.filename, req.params.filename);
}

