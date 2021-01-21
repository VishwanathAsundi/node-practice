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
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findProductById(prodId, prod => {
        res.render('shop/detail', {
            product: prod,
            pageTitle: prod.title,
            path: '/products'
        })
    })
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
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId, "prod id");
}
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: "/orders",
        pageTitle: "Your Orders"
    })
}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: "Your checkout"
    })
}