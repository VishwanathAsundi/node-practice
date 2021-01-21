const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getShopProducts);
router.get('/details/:productId', shopController.getProduct);

router.get('/cart', shopController.getCartProducts);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;