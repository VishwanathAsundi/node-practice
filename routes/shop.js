const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getShopProducts);
router.get('/cart', shopController.getCartItems);
router.get('/checkout', shopController.getCheckout);

module.exports = router;