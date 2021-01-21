const express = require('express');;

const router = express.Router();
const addProductsController = require('../controllers/products');

// /admin/add-product => GET
router.get('/add-product', addProductsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', addProductsController.postAddProduct);

module.exports = router;