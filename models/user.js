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