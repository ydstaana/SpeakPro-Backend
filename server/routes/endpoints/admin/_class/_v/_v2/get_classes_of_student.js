const mongoose = require('mongoose');
const Schedule = require('../../../../../../models/SchedSchema.js');
const User = require('../../../../../../models/UserSchema.js');

module.exports = (req, res, next) => {
  const studentId = req.params.id;

  Schedule.find({ student: studentId })
    .populate('teacher', 'firstName lastName username')
    .sort({ code: 1 })
    .exec((err, schedules) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }
      res.status(200).json(schedules);
    });
}
