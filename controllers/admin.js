const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;
    let product = new Product(null, title, imageUrl, price, description);
    product.Save();
    res.redirect('/');
};

exports.postUpdateProduct = (req, res, next) => {
    const {
        productId,
        title,
        imageUrl,
        price,
        description
    } = req.body;
    let product = new Product(productId, title, imageUrl, price, description);
    product.Save();
    res.redirect('/');
}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId, 'prodId');
    Product.remove(prodId, products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products',
        })
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        product: {},
        editing: false,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findProductById(prodId, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editing: true
        });
    });
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products',
        })
    });
}