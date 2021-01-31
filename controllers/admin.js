const mongoose = require('mongoose');
const Product = require('../models/product');
const fileHelper = require('../util/file');
const {
    validationResult
} = require('express-validator');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        price,
        description
    } = req.body;

    const image = req.file;

    if (!image) {
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                title: title,
                price: price,
                description: description
            },
            editing: false,
            hasErrors: true,
            errorMsg: 'Attached file is not an image',
            validationErros: []
        });
    }
    console.log(image, "image");
    const imageUrl = image.path;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                title: title,
                price: price,
                description: description
            },
            editing: false,
            hasErrors: true,
            errorMsg: errors.array()[0].msg,
            validationErros: errors.array()
        });
    }
    let product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    });
    product.save().then(result => {
        console.log("Created a product");
        res.redirect('/admin/products');
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postUpdateProduct = (req, res, next) => {
    const {
        productId,
        title,
        price,
        description
    } = req.body;

    const image = req.file;
    if (!image) {
        return res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: {
                title: title,
                price: price,
                description: description
            },
            editing: false,
            hasErrors: true,
            errorMsg: 'Attached file is not an image',
            validationErros: []
        });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: {
                title: title,
                price: price,
                description: description,
                _id: productId
            },
            editing: true,
            hasErrors: true,
            errorMsg: errors.array()[0].msg,
            validationErros: errors.array()
        });
    }
    Product.findById(productId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = title;
        product.price = price;
        product.description = description;
        if (image) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        return product.save().then(result => {
            console.log("Product gets updated!");
            res.redirect('/admin/products');
        })
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId).then(product => {
        if (!product) {
            return next(new Error('The product not found!'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({
            _id: prodId,
            userId: req.user._id
        });
    }).then(result => {
        console.log("product deleted!");
        res.redirect('/admin/products');
    }).catch(e => res.redirect('/500'));
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        product: {},
        editing: false,
        hasErrors: false,
        validationErros: [{
            param: ''
        }, {
            param: ''
        }, {
            param: ''
        }, {
            param: ''
        }],
        errorMsg: null
    });
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editing: true,
                hasErrors: false,
                validationErros: [],
                errorMsg: null
            });
        }).catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getAdminProducts = (req, res, next) => {

    Product.find({
            userId: req.user._id
        })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                path: '/admin/products',
                pageTitle: 'Admin Products',
            })
        })
        .catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}