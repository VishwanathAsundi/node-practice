const fs = require('fs');
const path = require('path');

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
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    Save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (e) => {
                console.log(e, 'file writing error');
            });
        })
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