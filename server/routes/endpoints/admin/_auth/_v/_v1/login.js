var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var User = require('../../../../../../models/UserSchema.js');
var secret = "speakpro";

module.exports = function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err);

    else {
      console.log(user);
      const payload = {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        lastName: user.lastName,
        username: user.username,
        userType: user.userType,
        classCodes: user.classCodes
      }

      var token = jwt.sign(payload, secret, {
        expiresIn: 3600 // expires in 1 hour
      });

      res.json({
        id: user.id,
        success: true,
        message: "Token generated",
        token: token
      });

    }
  })
}
