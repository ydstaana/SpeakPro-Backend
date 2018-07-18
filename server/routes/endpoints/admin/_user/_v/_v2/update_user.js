const mongoose = require('mongoose');
const User = require('../../../../../../models/UserSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "speakpro";

module.exports = function (req, res, next) {
  //Remove blank fields
  for (item in req.body) {
    if (req.body[item] == null || req.body[item] == "") {
      delete req.body[item];
    }
  }


  //rehash password if password was changed
  if (req.body["password"] != undefined) {
    bcrypt.hash(req.body["password"], 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      console.log(hash);
      req.body["password"] = hash;


      User.findOneAndUpdate({ username: req.params.username }, req.body, function (err, user) {
        if (err) res.status(500).json({
          code: 500,
          message: err
        });

        console.log(req.body);

        console.log('tangina1');
        const payload = {
          id: user._id,
          firstName: req.body.firstName,
          email: req.body.email,
          lastName: req.body.lastName,
          username: req.body.username,
          userType: req.body.userType,
          classCodes: user.classCodes
        }
        console.log(payload)
        const token = jwt.sign(payload, secret, {
          expiresIn: 3600 // expires in 1 hour
        });

        res.status(200).json({
          code: 200,
          message: "Successfully updated user",
          token: token
        });
      });
    })
  }
  else {
    User.findOneAndUpdate({ username: req.params.username }, req.body, function (err, user) {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }

      console.log(req.body);

      console.log('tangina2');
      const payload = {
        id: user._id,
        firstName: req.body.firstName,
        email: req.body.email,
        lastName: req.body.lastName,
        username: req.body.username,
        userType: req.body.userType,
        classCodes: user.classCodes
      }
      console.log(payload)
      const token = jwt.sign(payload, secret, {
        expiresIn: 3600 // expires in 1 hour
      });

      res.status(200).json({
        code: 200,
        message: "Successfully updated user",
        token: token
      });
    });
  }

}
