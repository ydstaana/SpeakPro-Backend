var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');

module.exports = function(req, res, next){
	Schedule.find({}, function(err, schedules){
		if (err) res.status(500).json({
			code : 500,
			message : err
		});
		res.status(200).json(schedules);
	});
}