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
    Save() {
        if (!this.id) {
            return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)', [this.title, this.price, this.imageUrl, this.description]);
        } else {
            return db.execute('UPDATE products SET title=?,price=?,imageUrl=?,description=? WHERE id=?', [this.title, this.price, this.imageUrl, this.description, this.id]);
        }

    }

    static remove(prodId) {
        return db.execute('DELETE FROM products WHERE id=?', [prodId]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    };

    static findProductById(id) {
        return db.execute('SELECT * FROM products WHERE products.id=?', [id]);
    }
}