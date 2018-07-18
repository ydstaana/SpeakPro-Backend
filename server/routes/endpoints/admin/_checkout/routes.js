const express = require('express');
const router = express.Router();
const core = require('../../services/core');

const add_to_cart = require('./_v/_v1/add_to_cart');
const checkout = require('./_v/_v1/checkout');
const get_cart_items = require('./_v/_v1/get_cart_items');
const remove_from_cart = require('./_v/_v1/remove_from_cart');

router.get('/cart/all-items/:id', core.verifyToken, get_cart_items);
router.post('/cart/add-items', core.verifyToken, add_to_cart);
router.post('/checkout', core.verifyToken, checkout);
router.post('/cart/remove-item/:id', core.verifyToken, remove_from_cart);

module.exports = router;
