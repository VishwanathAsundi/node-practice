const Product = require('../models/product');
const Cart = require('../models/cart');
const fs = require('fs');
const path = require('path');
let p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

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

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProductById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.render('shop/cart', {
        path: "/cart",
        pageTitle: "Your cart"
    })

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

exports.getCartProducts = (req, res, next) => {
    fs.readFile(p, (err, fileContent) => {
        let cart = JSON.parse(fileContent);
        let cartProducts = [];
        if (!err) {
            Product.fetchAll(products => {
                for (product of products) {
                    let cartProduct = cart.cart_products.find(p => p.id == product.id);
                    if (cartProduct) {
                        cartProducts.push({
                            product: product,
                            qty: cartProduct.qty
                        });
                    }
                }
                res.render('/shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your cart',
                    products: cartProducts
                })
            });


        }
    })
}