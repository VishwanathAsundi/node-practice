const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
};
exports.postLogin = (req, res, next) => {
    User.findById('60128a2b215c49199e79d65f').then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(e => {
            console.log(e);
            res.redirect('/');
        })
    }).catch(e => {
        console.log(e);
    })

}
exports.postLogout = (req, res, next) => {
    console.log("session clearing");
    req.session.destroy(err => {
        console.log("session cleared");
        console.log(err);
        res.redirect('/');
    });
}