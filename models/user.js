const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    let existingCartItemIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() == product._id.toString();
    });

    let updatedCartItems = [...this.cart.items];
    let newQuantity = 1;

    if (existingCartItemIndex >= 0) {
        newQuantity = updatedCartItems[existingCartItemIndex].quantity + 1;
        updatedCartItems[existingCartItemIndex].quantity = newQuantity;

    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: 1
        })
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
}

userSchema.methods.deleteProductFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}
userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}


module.exports = mongoose.model('User', userSchema);



// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDb;

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart; //{items:[]}
//         this.id = id;
//     }

//     save() {
//         const db = getDB();
//         return db.collection('users').insertOne(this).then(result => {
//             console.log("User is added successfully");
//         }).catch(e => {
//             console.log(e);
//         });
//     }

//     getCart() {
//         const db = getDB();
//         const productIds = this.cart.items.map(item => item.productId);
//         return db.collection('products').find({
//                 _id: {
//                     $in: productIds
//                 }
//             }).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     deleteProductFromCart(productId) {
//         const db = getDB();
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         return db.collection('users').updateOne({
//             _id: new mongodb.ObjectID(this.id)
//         }, {
//             $set: {
//                 cart: {
//                     items: updatedCartItems
//                 }
//             }
//         });

//     }

//     addproductToCart(product) {
//         let existingCartItemIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() == product._id.toString();
//         });

//         let updatedCartItems = [...this.cart.items];
//         let newQuantity = 1;

//         if (existingCartItemIndex >= 0) {
//             newQuantity = updatedCartItems[existingCartItemIndex].quantity + 1;
//             updatedCartItems[existingCartItemIndex].quantity = newQuantity;

//         } else {

//             updatedCartItems.push({
//                 productId: new mongodb.ObjectID(product._id),
//                 quantity: 1
//             })
//         }

//         const db = getDB();
//         let updatedCart = {
//             items: updatedCartItems
//         }
//         return db.collection('users').updateOne({
//             _id: new mongodb.ObjectID(this.id)
//         }, {
//             $set: {
//                 cart: updatedCart
//             }
//         });
//     }

//     static findById(userId) {
//         const db = getDB();
//         return db.collection('users').find({
//             _id: new mongodb.ObjectID(userId)
//         }).next().then(user => {
//             return user;
//         }).catch(e => {
//             console.log(e);
//         })
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders').find({
//             'user._id': new mongodb.ObjectID(this._id)
//         }).toArray();
//     }
//     addOrder() {
//         const db = getDB();

//         return this.getCart().then(products => {
//             let order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectID(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(result => {
//             this.cart = {
//                 items: []
//             };
//             return db.collection('users').updateOne({
//                 _id: new mongodb.ObjectID(this.id)
//             }, {
//                 $set: {
//                     cart: {
//                         items: []
//                     }
//                 }
//             });
//         })


//     }
// }
// module.exports = User;