const express = require('express');;

const router = express.Router();
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.get('/delete-product/:productId', isAuth, adminController.deleteProduct);

router.get('/products', isAuth, adminController.getAdminProducts);

router.post('/update-product', isAuth, adminController.postUpdateProduct);

module.exports = router;