const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
}

exports.getShopProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
            hasProducts: products.length > 0,
        });
    });
}
exports.getCartItems = (req, res, next) => {
    res.render('shop/cart', {
        path: "/cart",
        pageTitle: "Your cart"
    })
}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: "Your checkout"
    })
}