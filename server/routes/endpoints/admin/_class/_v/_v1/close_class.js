var mongoose = require('mongoose');
var Schedule = require('../../../../../../models/SchedSchema.js');
var User = require('../../../../../../models/UserSchema.js');

module.exports = function (req, res, next) {

  //Messy code but it works
  Schedule.findOneAndRemove({ _id: req.params.id })
    .exec((err, sched) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }
      else {
        User.findById(req.body.teacher)
          .exec((err, teacher) => {
            if (teacher.classCodes) {
              teacher.classCodes.pop(req.body.code);
              teacher.save();
            }


            User.findById(req.body.student)
              .exec((err, student) => {
                if (student && student.classCodes && student.schedule) {
                  student.classCodes.pop(req.body.code);
                  student.schedule.pop(sched._id);
                  student.save();
                }

                if (err) {
                  res.status(500).json({
                    code: 500,
                    message: err
                  });
                }
                else {
                  res.status(200).json({
                    code: 200,
                    message: "Successfully closed class"
                  });
                }
              });
          });
      }
    });
}

