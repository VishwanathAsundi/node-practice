const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;

    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }).then(result => {
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
    Product.findByPk(productId).then(prod => {
        prod.title = title;
        prod.imageUrl = imageUrl;
        prod.price = price;
        prod.description = description;
        return prod.save();
    }).then(result => {
        console.log("Product gets updated!");
        res.redirect('/admin/products');
    }).catch(e => {
        console.log(e);
    });

}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then(prod => {
        return prod.destroy();
    }).then(result => {
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
    req.user.getProducts({
            where: {
                id: prodId
            }
        })
        .then(products => {
            let product = products[0];
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editing: true
            });
        })
        .catch(e => {
            console.log(e);
        })
};

exports.getAdminProducts = (req, res, next) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products',
        })
    }).catch(e => {
        console.log(e);
    });
}