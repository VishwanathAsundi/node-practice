const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;
    let product = new Product(title, imageUrl, price, description);
    product.Save();
    res.redirect('/');
};


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
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