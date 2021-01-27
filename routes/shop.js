const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getShopProducts);
router.get('/details/:productId', shopController.getProduct);

router.get('/cart', shopController.getCartProducts);

router.post('/cart', shopController.postCart);


router.get('/checkout', shopController.getCheckout);

router.post('/cart-delete-item', shopController.deleteCartItem);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);
module.exports = router;