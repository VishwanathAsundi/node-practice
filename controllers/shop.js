const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

let p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',

            });
        })
        .catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(prod => {
            res.render('shop/detail', {
                product: prod,
                pageTitle: prod.title,
                path: '/products',
            })
        }).catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteProductFromCart(prodId).then(() => {
        console.log("An item deleted from the cart");
        res.redirect('/cart');
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getShopProducts = (req, res, next) => {

    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
            });
        })
        .catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {
                        ...i.productId._doc
                    }
                }
            })
            let order = new Order({
                products: products,
                user: {
                    email: req.user.email,
                    userId: req.user
                }
            })
            return order.save();

        }).then(result => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        })
        .catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId).then(product => {
            return req.user.addToCart(product);
        }).then(result => {
            console.log("Product is added to cart");
            res.redirect('/cart');
        })
        .catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}
exports.getOrders = (req, res, next) => {

    Order.find({
        'user.userId': req.user._id
    }).then(orders => {
        console.log(orders, 'os');
        res.render('shop/orders', {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: orders,
        })
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });


}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: "Your checkout",
    })
}

exports.getCartProducts = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let products = user.cart.items;
            console.log(products);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: products,
            })
        }).catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });

}
exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId).then(order => {
        if (!order) {
            return next(new Error('Order does not exist!'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'));
        }

        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline;filename="' + invoiceName + '"');

        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);


        pdfDoc.fontSize(25).fill('#FF3300').text("INVOICE");
        pdfDoc.text('       ');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.fontSize(14).fill('#000000').text(prod.product.title + '           ' + prod.quantity + ' X ' + '$ ' + prod.product.price);
        });
        pdfDoc.text(' ');
        pdfDoc.fontSize(20).text('Total Price' + '       ' + '$ ' +
            totalPrice);


        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline;filename="' + invoiceName + '"');
        //     res.send(data);
        // });

        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline;filename="' + invoiceName + '"');
        //now the data is sent in chunks
        // Very useful when dispatching large files
        // file.pipe(res);

    }).catch(e => next(e));
};