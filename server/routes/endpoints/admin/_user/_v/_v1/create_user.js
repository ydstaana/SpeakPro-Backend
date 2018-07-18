var mongoose = require('mongoose');
var User = require('../../../../../../models/UserSchema.js');
const jwt = require('jsonwebtoken');
var hbs = require('nodemailer-express-handlebars')
var path = require('path')
var nodemailer = require('nodemailer');
var email = "speakpro.help@gmail.com"
var pass = "help@speakpro"
const async = require('async');
const bcrypt = require('bcrypt');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: 'server/templates',
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

/*module.exports = function(req, res, next){
	req.body.newUser = true;
	User.create(req.body, function (err, post) {
		if (err) res.status(500).json({
	    	code : 500,
	    	message : err
	    });
	    res.status(200).json({
	    	code : 200,
	    	message : "Successfully created user"
	    });
	});
}
*/
module.exports = function (req, res, next) {

  // do functions one after another through async waterfall
  async.waterfall([
    function (done) {
	    req.body.newUser = true;
	    req.body.active = false;
		User.create(req.body, function (err, user) {
			if (err) {
				done(err)
			}
		    else{
		    	done(err,user)
		    }
		});
    },
    function (user, done) {
      console.log(user);
      //generate random token
      bcrypt.hash(user.username, 10, function (err, hash) {
        if (err) {
          return done(err);
        }
        var token = hash;
        done(err, token, user);
      })
    },
    function (token, user, done) {
      console.log(token);
      console.log(user);
      var data = {
        to: user.email,
        from: email,
        template: 'registration-confirmation-email',
        subject: 'Please confirm your email',
        context: {
          url: 'http://localhost:4200/#/confirm' + '?id=' + user._id + '&token=' + token,
          name: user.firstName,
          token: token
        }
      };

      smtpTransport.sendMail(data, function (err) {
        if (!err) {
          return res.json({
            message: 'Kindly check your email for further instructions'
          })
        }
        else {
          return done(err);
        }
      })
    }
  ], function (err) {
    return res.status(422).json({
      message: err
    });
  });
}
