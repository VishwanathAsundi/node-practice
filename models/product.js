const db = require('../util/database');

const Cart = require('./cart');
module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    Save() {}

    static remove(prodId, cb) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    };

    static findProductById(id, cb) {

    }
}