var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function(req, res, next){
	User.findById(req.params.id)
		.exec(function(err, user){
			console.log(req.body);
			for(var i in req.body){
				user.schedule.pop(req.body[i]);
				Schedule.findByIdAndUpdate(req.body[i], {student : null, available: true})
				.exec(function(err, sched){
					console.log(sched);
				})
			}
			user.save();
			if (err) res.status(500).json({
				code : 500,
				message : err
			});
			res.status(200).json({
				code: 200,
				message : "Successfully dropped class"
			});
	})
}