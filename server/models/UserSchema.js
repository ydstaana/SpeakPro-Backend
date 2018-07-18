var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,

	username: String,
	password: String,
	email: String,
	skypeID: String,

	userType: String,
  schedule: [{type: mongoose.Schema.ObjectId, ref: 'Sched', default: []}],
	classCodes: [{type: Number, default: []}],

	newUser: Boolean,
  active: Boolean,

  //For reset
  reset_password_token: {
    type: String,
    default: ''
  },
  reset_password_expires: {
    type: Date,
    default: ''
  }
});



//UNCOMMENT IF LOGIN/ENCRYPT

UserSchema.statics.authenticate = function (username, password, callback) {
  this.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      else if(user.active == false){ //User is banned/deactivated
        var err = new Error("User's account is not active");
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          var err = new Error('Incorrect username/password');
          err.status = 401;
          return callback(err);
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();
  
  if(user.password != "" || user.password != undefined){
    console.log(user.password);
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  }
  else{
    next();
  }
  
});



var User = mongoose.model('User', UserSchema);

module.exports = User;
