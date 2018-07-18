var mongoose = require('mongoose');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function(req, res, next){
	User.find({}, function (err, post) {
	    if (err) res.status(500).json({
	    	code : 500,
	    	message : err
	    });
	    res.status(200).json(post);
	});
}