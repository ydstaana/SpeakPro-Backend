const express = require('express');
const router = express.Router();
const core = require('../../services/core');
const get_all_students = require('./_v/_v1/get_all_students');

router.get('/students', core.verifyToken, get_all_students);


module.exports = router;
