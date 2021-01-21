const express = require('express');;

const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.get('/delete-product/:productId', adminController.deleteProduct);

router.get('/products', adminController.getAdminProducts);

router.post('/update-product', adminController.postUpdateProduct);

module.exports = router;