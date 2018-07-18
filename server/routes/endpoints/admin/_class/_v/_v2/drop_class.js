const mongoose = require('mongoose');
const Schedule = require('../../../../../../models/SchedSchema.js');
const User = require('../../../../../../models/UserSchema.js');

module.exports = async (req, res, next) => {
  const user = await findUser(req.params.id);
  const selectedClasses = req.body;

  console.log(user);


  for (let i = 0; i < selectedClasses.length; i++) {
    let sched = await findSchedule(selectedClasses[i]);
    user.schedule.pop(selectedClasses[i]);
    user.classCodes.pop(sched.code);
  }

  console.log(user);

  user.save();
  res.status(200).json({
    code: 200,
    message: "Successfully dropped classes"
  });
}

function findSchedule(id) {
  return new Promise((resolve) => {
    Schedule.findByIdAndUpdate(id, { student: null, available: true })
      .exec((err, sched) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: err
          });
        }
        else {
          resolve(sched);
        }
      });
  });
}

function findUser(id) {
  return new Promise((resolve) => {
    User.findById(id).exec((err, user) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }
      else {
        resolve(user);
      }
    });
  });
}
