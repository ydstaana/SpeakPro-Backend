var mongoose = require('mongoose');
var User = require('../../../../../../models/UserSchema.js');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var email = "speakpro.help@gmail.com"
var pass = "help@speakpro"
var hbs = require('nodemailer-express-handlebars')

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
module.exports = function (req, res, next) {
  User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec(function (err, user) {
    if (!err && user) {
      bcrypt.hash(req.body["password"], 10, function (err, hash) {
        if (err) {
          return next(err);
        }
        console.log(hash);
        req.body["password"] = hash;
        User.findOneAndUpdate({ username: user.username }, { reset_password_token: undefined, reset_password_expires: undefined, password: req.body.password }, function (err, post) {
          if (err) res.status(500).json({
            code: 500,
            message: err
          });
          res.status(200).json({
            code: 200,
            message: "Successfully updated user"
          });

          var data = {
            to: user.email,
            from: email,
            template: 'reset-password-email',
            subject: 'Password Reset Confirmation',
            context: {
              name: user.firstName
            }
          };

          smtpTransport.sendMail(data, function (err) {
            if (!err) {
              return res.json({
                message: 'Password Reset'
              })
            }
            else {
              return next(err);
            }
          })
        });
      })

    }
    else {
      res.status(500).json({
        code: 500,
        message: 'The reset password token has already expired.'
      });
    }
  })
}
