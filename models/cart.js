const fs = require('fs');
const path = require('path');
const Product = require('./product');

let p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(prodId, productPrice) {

        fs.readFile(p, (err, fileContent) => {
            let cart = {
                cart_products: [],
                totalPrice: 0
            }
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            let existingProductIndex = cart.cart_products.findIndex(p => p.id == prodId);
            let existingProduct = cart.cart_products[existingProductIndex];
            console.log(existingProductIndex);
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct
                };
                updatedProduct.qty = existingProduct.qty + 1;
                cart.cart_products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    qty: 1,
                    id: prodId
                };
                cart.cart_products = [...cart.cart_products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })

        })
    }

    static deleteProductFromCart(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            let cart = JSON.parse(fileContent);
            let product = cart.cart_products.find(p => id == p.id);
            let productQty = product.qty;
            let updatedProducts = [...cart.cart_products];
            updatedProducts = updatedProducts.filter(p => p.id !== id);
            totlaPrice = cart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify({
                cart_products: updatedProducts,
                totalPrice: totalPrice
            }), err => {
                console.log(err);
            })

        });
    }

}