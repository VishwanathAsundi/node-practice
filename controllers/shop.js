const Product = require('../models/product');
const Cart = require('../models/cart');
const fs = require('fs');
const path = require('path');
let p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(e => {
            console.log(e);
        })
}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(prod => {
            res.render('shop/detail', {
                product: prod,
                pageTitle: prod.title,
                path: '/products'
            })
        }).catch(e => {
            console.log(e);
        });
}

exports.getShopProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                hasProducts: products.length > 0,
            });
        })
        .catch(e => {
            console.log(e);
        })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodId
                }
            });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
            return Product.findByPk(prodId)

        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        }).then(() => {
            res.redirect('/cart');
        })
        .catch(e => {
            console.log(e);
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
    req.user.getCart().then(cart => {
        cart.getProducts().then(products => {
            console.log(products, "products");
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: products
            })
        }).catch(e => {
            console.log(e)
        });

    }).catch(e => {
        console.log(e);
    })
}