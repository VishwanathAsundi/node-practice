const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errors');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const User = require('./models/user');


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
    User.findById("60113c8d5f1e1ea7affc8d88").then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
    app.listen(3000);
})