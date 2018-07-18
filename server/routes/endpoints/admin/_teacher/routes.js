const express = require('express');
const multer = require('multer');
const router = express.Router();


const core = require('../../services/core');
const get_all_teachers = require('./_v/_v1/get_all_teachers');
const download = require('./_v/_v1/download');
const upload_files = require('./_v/_v2a/upload_files');
const view_files = require('./_v/_v1/view_uploaded_files');

/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
})

var upload = multer({ storage: storage });*/

router.get('/teachers', core.verifyToken, get_all_teachers);
router.get('/download/:filename', core.verifyToken, download);
router.get('/uploads', core.verifyToken, view_files);
router.post('/uploads', core.verifyToken, upload_files);


module.exports = router;
