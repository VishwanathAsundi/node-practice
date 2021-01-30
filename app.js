const path = require('path');

const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errors');

const app = express();

const User = require('./models/user');

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');

const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



const MongoDB_CONNECT = 'mongodb+srv://xyz:xyz@cluster0.6lk21.mongodb.net/shop';
const store = new MongoDBStore({
    uri: MongoDB_CONNECT,
    collection: 'sessions'
})


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'My secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(flash());

const csrfProtection = csrf();


app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user;
        next();
    }).then(e => {
        console.log(e);
    })
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getNotFound);

mongoose.connect(MongoDB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(result => {
    console.log("Connected!");
    app.listen(3000);
}).catch(e => {
    console.log(e);
});