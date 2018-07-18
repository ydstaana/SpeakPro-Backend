var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const async = require('async');
const bcrypt = require('bcrypt');
var User = require('../../../../../../models/UserSchema.js');
var hbs = require('nodemailer-express-handlebars')
var path = require('path')
var nodemailer = require('nodemailer');
var email = "speakpro.help@gmail.com"
var pass = "help@speakpro"

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

  // do functions one after another through async waterfall
  async.waterfall([
    function (done) {
      console.log(req.body)
      User.findOne({
        username: req.body.username
      }).exec(function (err, user) {
        if (user) {
          done(err, user);
        }
        else {
          done('The provided username does not exist. Please try again.');
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
        done(err, user, token);
      })
    },
    function (user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function (err, new_user) {
        done(err, token, new_user);
      });
    },
    function (token, user, done) {
      console.log(token);
      console.log(user);
      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Lost password',
        context: {
          url: 'http://localhost:4200/#/reset?token=' + token,
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
