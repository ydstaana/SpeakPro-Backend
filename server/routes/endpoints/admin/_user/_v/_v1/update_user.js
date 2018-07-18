var mongoose = require('mongoose');
var User = require('../../../../../../models/UserSchema.js');
var bcrypt = require('bcrypt');

module.exports = function (req, res, next) {
  //Remove blank fields
  for (item in req.body) {
    if (req.body[item] == null || req.body[item] == "") {
      delete req.body[item];
    }
  }

  console.log('test');

  //rehash password if password was changed
  if (req.body["password"] != undefined) {
    bcrypt.hash(req.body["password"], 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      console.log(hash);
      req.body["password"] = hash;
      User.findOneAndUpdate({ username: req.params.username }, req.body, function (err, post) {
        if (err) res.status(500).json({
          code: 500,
          message: err
        });
        res.status(200).json({
          code: 200,
          message: "Successfully updated user"
        });
      });
    })
  }
  else {
    User.findOneAndUpdate({ username: req.params.username }, req.body, function (err, post) {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }
      res.status(200).json({
        code: 200,
        message: "Successfully updated user"
      });
    });
  }

}
