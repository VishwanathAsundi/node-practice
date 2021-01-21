const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

let p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    Save() {
        getProductsFromFile(products => {
            if (this.id) {
                let existingProductIndex = products.findIndex(prod => prod.id === this.id);
                let updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (e) => {
                    console.log(e, 'file writing error');
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (e) => {
                    console.log(e, 'file writing error');
                });
            }
        })
    }

    static remove(prodId, cb) {
        getProductsFromFile(products => {
            Products.findProductById(prodId, product => {
                let updatedProducts = products.filter(prod => prod.id !== prodId);
                fs.writeFile(p, JSON.stringify(updatedProducts), (e) => {
                    console.log(e, 'file writing error');
                    if (!e) {
                        Cart.deleteProductFromCart(prodId, product.price)
                        cb(updatedProducts);
                    }
                });

            })

        });
    }

    static fetchAll(callBack) {
        getProductsFromFile(callBack);
    };

    static findProductById(id, cb) {
        getProductsFromFile(products => {
            cb(products.find(p => p.id === id));
        })
    }
}