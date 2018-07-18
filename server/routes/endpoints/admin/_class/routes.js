const express = require('express');
const router = express.Router();
const core = require('../../services/core');

const get_all_classes = require('./_v/_v1/get_all_classes');
const get_all_available_classes = require('./_v/_v1/get_all_available_classes');
const get_teachers_classes = require('./_v/_v1/get_teachers_classes');
const get_teachers_classes_by_username = require('./_v/_v1/get_teachers_classes_by_username');
const get_teachers_available_classes = require('./_v/_v1/get_teachers_available_classes');
const get_classes_of_student = require('./_v/_v2/get_classes_of_student');
const add_class = require('./_v/_v2/add_class');
const drop_class = require('./_v/_v2/drop_class');
const get_student_in_class = require('./_v/_v1/get_student_in_class');
const open_class = require('./_v/_v1/open_class');
const close_class = require('./_v/_v1/close_class');

router.get('/classes', core.verifyToken, get_all_classes);
router.get('/classes/available', core.verifyToken, get_all_available_classes);
router.get('/classes/teacher/:id', core.verifyToken, get_teachers_classes);
router.get('/classes/teacher/:id/available', core.verifyToken, get_teachers_available_classes);
router.get('/classes/teachers/:username', core.verifyToken, get_teachers_classes_by_username);
router.get('/classes/student/:id', core.verifyToken, get_classes_of_student);
router.get('/classes/:id/student', core.verifyToken, get_student_in_class);
router.post('/classes/student/:id', core.verifyToken, add_class);
router.post('/classes/student/:id/drop', core.verifyToken, drop_class);
router.post('/classes', core.verifyToken, open_class);
router.delete('/classes/:id', core.verifyToken, close_class);


module.exports = router;
