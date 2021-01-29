const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const {
        title,
        imageUrl,
        price,
        description
    } = req.body;

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

    Product.findById(productId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save().then(result => {
            console.log("Product gets updated!");
            res.redirect('/admin/products');
        })
    }).catch(e => {
        console.log(e);
    });
}
exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteOne({
        _id: prodId,
        userId: req.user._id
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
            });
        }).catch(e => {
            console.log(e);
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
            console.log(e);
        })
}