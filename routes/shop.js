const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getShopProducts);
router.get('/details/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCartProducts);

router.post('/cart', isAuth, shopController.postCart);


router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);
module.exports = router;