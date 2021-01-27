const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;

    let product = new Product(title, price, imageUrl, description, null, req.user._id);
    product.save().then(result => {
        console.log("Created a product");
        res.redirect('/admin/products');
    }).catch(e => {
        console.log(e);
    });
};

exports.postUpdateProduct = (req, res, next) => {
    const {
        productId,
        title,
        imageUrl,
        price,
        description
    } = req.body;

    let product = new Product(title, price, imageUrl, description, productId, req.user._id);
    product.save().then(result => {
        console.log("Product gets updated!");
        res.redirect('/admin/products');
    }).catch(e => {
        console.log(e);
    });
}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteById(prodId).then(result => {
        console.log("product deleted!");
        res.redirect('/admin/products');
    }).catch(e => console.log(e));
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
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editing: true
            });
        }).catch(e => {
            console.log(e);
        });
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                path: '/admin/products',
                pageTitle: 'Admin Products',
            })
        })
        .catch(e => {
            console.log(e);
        })
}