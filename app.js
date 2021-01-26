const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errors');
const mongoConnect = require('./util/database');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
    // User.findByPk(1).then(user => {
    //     req.user = user;
    //     next();
    // }).then(e => {
    //     console.log(e);
    // })
})

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.getNotFound);

mongoConnect(client => {
    console.log(client, 'client');
    app.listen(3000);
})