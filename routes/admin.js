const express = require('express');;

const router = express.Router();
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const {
    check,
    body
} = require('express-validator');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',
    [
        check('title').isLength({
            min: 3
        }).isString().trim(),
        check('price').isNumeric(),
        check('imageUrl').isURL(),
        check('description').isLength({
            min: 5,
            max: 200
        })
    ], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.get('/delete-product/:productId', isAuth, adminController.deleteProduct);

router.get('/products', isAuth, adminController.getAdminProducts);

router.post('/update-product',
    [
        check('title').isLength({
            min: 3
        }).isString().trim(),
        check('price').isNumeric(),
        check('imageUrl').isURL(),
        check('description').isLength({
            min: 5,
            max: 200
        })
    ],

    isAuth, adminController.postUpdateProduct);

module.exports = router;