var mongoose = require('mongoose');
var User = require('../../../../../../models/UserSchema.js');
const bcrypt = require('bcrypt');

module.exports = function(req, res, next){
	User.findOne({
		_id: req.body.id
	}).exec(function (err, user) {
	if (err) {
	  res.status(501).json({
	  	message: err
	  })
	}
	if(user){
		bcrypt.compare(user.username,req.body.token, function (err, result) {
	        if (result === true) {
	          user.active = true;
	          user.save();
	          res.status(200).json({
			  	message: 'Confirmed user email'
			  })
	        } else {
	           res.status(501).json({
			  	message: 'Invalid token'
			   })
	        }
	      })
	}
	});
}
