var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function(req, res, next){
  Schedule.create(req.body, function (err, post) {
    if (err) res.status(500).json({
		code : 500,
		message : err
	});
    else{
    	User.update(
		    { _id: req.body.teacher }, 
		    { $push: { classCodes: req.body.code}},
		    function(err, user){
		    	console.log(user);
		    	 res.json(user);
		    }
			);
    }
  });

  
}