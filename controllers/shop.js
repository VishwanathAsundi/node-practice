const Product = require('../models/product');
const path = require('path');
let p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
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
    Product.findById(prodId)
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

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteProductFromCart(prodId).then(() => {
        console.log("An item deleted from the cart");
        res.redirect('/cart');
    }).catch(e => {
        console.log(e);
    })
}

exports.getShopProducts = (req, res, next) => {
    Product.fetchAll()
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

exports.postOrder = (req, res, next) => {
    req.user.addOrder().then(() => {
        res.redirect('/orders');
    }).catch(e => {
        console.log(e);
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId).then(product => {
            return req.user.addproductToCart(product);
        }).then(result => {
            console.log("Product is added to cart");
            res.redirect('/cart');
        })
        .catch(e => {
            console.log(e);
        })
}
exports.getOrders = (req, res, next) => {
    req.user.getOrders().then(orders => {
        console.log(orders, "orders");
        res.render('shop/orders', {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: orders
        })
    });

}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: "Your checkout"
    })
}

exports.getCartProducts = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: products
            })
        }).catch(e => {
            console.log(e)
        });

}