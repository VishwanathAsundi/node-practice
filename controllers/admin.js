const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;
    let product = new Product(null, title, imageUrl, price, description);
    product.Save().then(() => {
        res.redirect('/');
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
    let product = new Product(productId, title, imageUrl, price, description);
    product.Save().then(() => {
        res.redirect('/');
    }).catch(e => {
        console.log(e);
    });

}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.remove(prodId).then(() => {
        Product.fetchAll().then(([products, content]) => {
            res.render('admin/products', {
                prods: products,
                path: '/admin/products',
                pageTitle: 'Admin Products',
            })
        }).catch(e => {
            console.log(e);
        })

    }).catch(e => {
        console.log(e);
    });
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
    Product.findProductById(prodId).then(([product]) => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product[0],
            editing: true
        });
    }).catch(e => {
        console.log(e);
    });
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll().then(([products, content]) => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products',
        })
    }).catch(e => {
        console.log(e);
    });
}