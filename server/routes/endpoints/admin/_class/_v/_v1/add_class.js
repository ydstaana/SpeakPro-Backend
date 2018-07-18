var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function (req, res, next) {

  User.findById(req.params.id)
    .exec(function (err, user) {
      console.log(req.body);
      for (var i in req.body) {
        user.schedule.push(req.body[i]._id);
        user.classCodes.push(req.body[i].code);
        Schedule.findByIdAndUpdate(req.body[i], { student: req.params.id, available: false })
          .exec();
      }
      user.save(function (err) {
        if (err) res.status(500).json({
          code: 500,
          message: err
        });
        res.status(200).json({
          code: 200,
          message: "Successfully enrolled student"
        });
      });
    })
}
