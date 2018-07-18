var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function(req, res, next){
	User.findById(req.params.id)
	.populate({
		path: 'schedule',
		populate :{
			path:'teacher'
		}
	})
	.exec(function(err, user){
		if (err) 
			res.status(500).json({
			code : 500,
			message : err
		});
		res.status(200).json(user.schedule);
	});
}