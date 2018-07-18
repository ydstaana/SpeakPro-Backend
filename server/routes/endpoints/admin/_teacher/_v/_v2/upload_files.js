const multer = require('multer');
const moment = require('moment')
const mongoose = require('mongoose');
const pify = require('pify')

const File = require('../../../../../../models/FileSchema.js');
const Schedule = require('../../../../../../models/SchedSchema.js');
const User = require('../../../../../../models/UserSchema.js');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const currentDate = moment().format("DD-MM-YYYY");
    cb(null, `${currentDate}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
const fileUpload = pify(upload.array('selectedFiles')); //Promisify upload

const uploadFile = async function (req, res) {
  try {
    await fileUpload(req, res);
    // Everything went fine
    for (item of req.files) {
      const newFile = {
        fileName: item.filename,
        displayName: item.originalname,
        author: req.body.user, //change this to the appropriate field in req.body from frontend
        uploadDate: moment().format(),
        fileSize: item.size
      }
      File.create(newFile, function (err, file) {
        if (!err) {
          res.status(200).json({
            code: 200,
            message: 'Successfully uploaded the file'
          });
        }
        else throw err;
      })
    }
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err
    });
  }
}

module.exports = uploadFile;

