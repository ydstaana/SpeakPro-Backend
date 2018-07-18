const express = require('express');
const router = express.Router();
const core = require('../../services/core');
const ban_single_user = require('./_v/_v1/ban_single_user');

router.post('/admin/:id', core.verifyToken, ban_single_user);

module.exports = router;
