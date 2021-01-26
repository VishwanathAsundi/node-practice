const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errors');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');



const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).then(e => {
        console.log(e);
    })
})

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});


sequelize
    // .sync({
    //     force: true
    // })
    .sync()
    .then(result => {
        return User.findByPk(1);
    }).then(user => {
        if (!user) {
            return User.create({
                name: 'Vishwanath',
                email: 'test@gmail.com'
            })
        }
        return user;
    }).then(user => {
        return user.createCart();
    }).then(result => {
        console.log(result);
        app.listen(3000);
    })
    .catch(e => {
        console.log(e);
    })