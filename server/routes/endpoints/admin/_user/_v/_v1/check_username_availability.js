const mongoose = require('mongoose');
const User = require('../../../../../../models/UserSchema.js');

module.exports = function (req, res, next) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) {
      res.status(500).json({
        code: 500,
        message: err
      })
    }


    if (user) {
      res.status(200).json({
        available: false,
        message: 'Username is already taken'
      })
    } else {
      res.status(200).json({
        available: true,
        message: 'Username is available'
      })
    }
  });
}
