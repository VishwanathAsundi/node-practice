const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);


// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDb;

// class Product {
//     constructor(title, price, imageUrl, description, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this._id = id ? new mongodb.ObjectID(id) : null;
//         this.userId = userId;
//     }
//     save() {
//         const db = getDB();
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('products').updateOne({
//                 _id: this._id
//             }, {
//                 $set: this
//             });
//         } else {
//             dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp.then(result => {
//             console.log(result);
//         }).catch(e => {
//             console.log(e);
//         })
//     }
//     static fetchAll() {
//         const db = getDB();
//         return db.collection('products').find().toArray().then(products => {
//             return products;
//         }).catch(e => {
//             console.log(e);
//         })
//     }
//     static findById(prodId) {
//         const db = getDB();
//         return db.collection('products').find({
//             _id: new mongodb.ObjectID(prodId)
//         }).next().then(product => {
//             console.log(product);
//             return product;
//         }).catch(e => {
//             console.log(e);
//         })
//     }
//     static deleteById(prodId) {
//         const db = getDB();
//         return db.collection('products').deleteOne({
//             _id: new mongodb.ObjectID(prodId)
//         }).then(result => {
//             console.log("Product Deleted");
//         }).catch(e => {
//             console.log(e);
//         })
//     }
// }
// module.exports = Product;