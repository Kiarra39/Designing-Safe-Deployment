const express = require('express');
const router = express.Router();
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');

router.get('/orders', orderController.getOrders);
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);

router.get('/users/:id', userController.getUser);
router.post('/users', userController.createUser);

module.exports = router;
