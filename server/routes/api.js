const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt');

var User = require('../models/UserSchema.js');
var Schedule = require('../models/SchedSchema.js');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

//TO DO
/*CREATE API FOR
-getting list of available classes
-adding a class to a teacher
-adding a class to a student
-upload
-view uploads
-
*/

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })



router.post('/upload', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json(req.file);
  console.log(req.file);
});

router.post('/login', function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err);
    console.log(user);
    res.json(user);
  })
});
/*router.get('/login/:username/:password', function(req, res, next) {
  User.findOne({username: req.params.username}, function (err, user) {
    if (err) return next(err);

    if(!user){
      res.json({success: false, message: 'Auth failed. User not found'});
    }
    else{

      if(user.password != req.params.password) {
        res.json({success: false, message: 'Incorrect password'});
      }
      else{
        const payload = {
          id : user._id,
          userType : user.userType,
          username : user.username,
          organization: user.organization
        }

        var token = jwt.sign(payload, secret, {
          expiresIn : 3600 // expires in 1 hour
        });


         res.json({
            id : user._id,
            success: true,
            message : "Token generated",
            token : token
         });
      }
    }
  });
});
*/

/*JWT Routes Middleware*/
/*router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.headers['authorization'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});*/


/*-------------------------USERS-------------------------*/
router.get('/user', function(req, res, next) {
  User.find({}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE User */
router.post('/user', function(req, res, next) {
  req.body.newUser = true;
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// GET ALL USERS
router.get('/user', function (req, res, next) {
  User.find({}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// GET USER BY ID
router.get('/user/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// UPDATE USER BY USERNAME
router.put('/user/:username', function (req, res, next) {
  User.findOneAndUpdate({ username: req.params.username }, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// GET ALL STUDENTS
router.get('/students', (req, res, next) => {
  User.find({ userType: "STUDENT" }, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

// GET ALL TEACHERS
router.get('/teachers', (req, res, next) => {
<<<<<<< HEAD
  User.find({userType: "TEACHER"}, function(err, users){
=======
  User.find({ userType: "TEACHER" }, function (err, users) {
>>>>>>> ad72611db5d549a85a82e897a3417530b5f2c6fe
    if (err) return next(err);
    res.json(users);
  });
});


//GET ALL CLASSES
router.get('/class', (req, res, next) => {
  Schedule.find({}, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

//GET ALL AVAILABLE CLASSES
router.get('/class/available', (req, res, next) => {
  Schedule.find({available : true})
  .populate('teacher', 'firstName lastName')
  .exec(function(err,   schedule){
    if(err) return next(err);
    console.log(schedule);
    res.json(schedule);
  });
});

//GET ALL CLASSES OF A SINGLE TEACHER
router.get('/class/teacher/:id', (req, res, next) => {
  Schedule.find({teacher : req.params.id})
  .populate('student')
  .exec(function(err, users){
    if (err) return next(err);
    res.json(users);
  });
});

//GET AVAILABLE CLASSES OF A SINGLE TEACHER
router.get('/class/teacher/:id/available', (req, res, next) => {
  Schedule.find({ available: true, teacher: req.params.id })
    .populate('teacher', 'firstName')
    .exec(function (err, schedule) {
      if (err) return next(err);
      res.json(schedule);
    });
});


//GET ENROLLED CLASSES OF A SINGLE STUDENT (VIEW SCHEDULE OF STUDENT)
router.get('/class/student/:id', (req, res, next) => {
<<<<<<< HEAD
User.findById(req.params.id)
.populate('schedule')
.exec(function(err, user){
  if(err) return next(err);
  res.json(user.schedule);
  });
});

// NOT YET TESTED !!!!!!!!!!!!!!!!


//ADD CLASSES TO A SINGLE STUDENT
/*
  The format of the input should be an array of Strings (ObjectID's)
  ex:
    req.body = {
      ["5ac74931b97ffd3f681e67f6"]
    }
*/
router.post("/class/student/:id", function (req, res){
=======
  User.findById(req.params.id)
    .populate('schedule')
    .exec(function (err, user) {
      if (err) return next(err);
      res.json(user.schedule);
    });
});

//ENROLL CLASSES TO A STUDENT
// req.body = { ["5ac74931b97ffd3f681e67f6"]}
router.post("/class/student/:id", function (req, res) {
>>>>>>> ad72611db5d549a85a82e897a3417530b5f2c6fe
  User.findById(req.params.id)
  .exec(function(err, user){
    console.log(req.body);
    for(var i in req.body){
      user.schedule.push(req.body[i]);
      Schedule.findByIdAndUpdate(req.body[i], {student : req.params.id, available: false})
      .exec(function(err, sched){
        console.log(sched);
      })
    }
    user.save();
    })
});

//DROP CLASSES OF A STUDENT
router.post("/class/student/:id/drop", function (req, res) {
  User.findById(req.params.id)
<<<<<<< HEAD
  .exec(function(err, user){
    console.log(req.body);
    for(var i in req.body){
      user.schedule.pop(req.body[i]);
      Schedule.findByIdAndUpdate(req.body[i], {student : null, available: true})
      .exec(function(err, sched){
        console.log(sched);
      })
    }
    user.save();
  })
});
/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

//GET STUDENT ENROLLED IN A CLASS
router.get('/class/:id/student', (req, res, next) => {
  Schedule.findById(req.params.id)
  .populate('student')
  .exec(function(err, sched){
    if(err) return next(err);
    res.json(sched.student);
  });
=======
    .exec(function (err, user) {
      console.log(req.body);
      for (var i in req.body) {
        user.schedule.pop(req.body[i]);
      }
      user.save();
    })
>>>>>>> ad72611db5d549a85a82e897a3417530b5f2c6fe
});

// OPEN A CLASS
router.post('/class', function (req, res, next) {
  Schedule.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

<<<<<<< HEAD
//DELETE A CLASS (CLOSE CLASS)
router.delete('/class/:id', function(req, res, next) {
  Schedule.findById(req.params.id)
  .remove()
  .exec(function(err, sched){
    if(err) return next(err);
    res.json(sched); //removed
=======

// CLOSE A CLASS
router.delete('/class/:id', function (req, res, next) {
  Schedule.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
>>>>>>> ad72611db5d549a85a82e897a3417530b5f2c6fe
  });
});

//GET STUDENT ENROLLED IN A CLASS
router.get('/class/:id/student', (req, res, next) => {
  Schedule.findById(req.params.id)
    .populate('student')
    .exec(function (err, sched) {
      if (err) return next(err);
      res.json(sched.student);
    });
});

// BAN A USER
router.post('/admin/:id', function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, { active: false })
    .exec(function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
});

module.exports = router;
