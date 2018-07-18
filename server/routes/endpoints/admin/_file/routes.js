const express = require('express');
const router = express.Router();

const get_uploaded_files = require('./_v/_v1/get_uploaded_files');
const get_uploaded_files_by_id = require('./_v/_v1/get_uploaded_files_by_id');
const core = require('../../services/core');

router.get('/files', core.verifyToken, get_uploaded_files);
router.get('/files/:id', core.verifyToken, get_uploaded_files_by_id);


module.exports = router;


