const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../../../../../models/UserSchema.js');
const secret = "speakpro";

module.exports = function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err);

    else {
      res.json({
        success: true,
        message: "User authenticated",
      });

    }
  })
}
