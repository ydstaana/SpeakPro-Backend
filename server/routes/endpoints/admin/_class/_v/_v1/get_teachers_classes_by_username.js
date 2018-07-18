const mongoose = require('mongoose');
const Schedule = require('../../../../../../models/SchedSchema');
const User = require('../../../../../../models/UserSchema');

module.exports = async (req, res, next) => {
  const teacher = await findUser(req.params.username);
  const schedules = await findSchedules(teacher._id);
  res.status(200).json(schedules);
}

function findSchedules(teacherId) {
  return new Promise((resolve) => {
    Schedule.find({ teacher: teacherId })
      .populate('student')
      .sort({ code: 1 })
      .exec((err, schedules) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: err
          });
        }
        resolve(schedules);
      });
  });
}


function findUser(username) {
  return new Promise((resolve) => {
    User.findOne({ username: username })
      .exec((err, user) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: err,
          });
        }
        resolve(user);
      });
  });
}
