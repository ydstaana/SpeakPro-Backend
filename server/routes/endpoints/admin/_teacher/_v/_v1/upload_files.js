var mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment')
const pify = require('pify')
var Schedule = require('../../../../../../models/SchedSchema.js');
var File = require('../../../../../../models/FileSchema.js');
var User = require('../../../../../../models/UserSchema.js');




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
})

var upload = multer({ storage: storage })

const fileUpload = pify(upload.array('selectedFiles')); //Promisify upload

var uploadFile = async function (req, res) {
  try {
    await fileUpload(req, res)
    console.log(Date.now());
    // Everything went fine
   	for(item of req.files){
   		var newFile = {
   			fileName : item.filename,
   			author: req.body.user, //change this to the appropriate field in req.body from frontend
   			uploadDate : moment().format('l'),
   			fileSize: item.size
   		}
   		File.create(newFile, function(err, file){
        console.log(file)
   		})
     }
     res.status(200).json({
      code: 200,
      message: 'Successfully uploaded the file'
    });
  } catch(err) {
    // An error occurred when uploading
    return
  }
}

module.exports = uploadFile;

