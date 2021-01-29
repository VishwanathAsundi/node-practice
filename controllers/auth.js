const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let msg = req.flash('user');
    let error;
    if (msg.length > 0) {
        error = msg[0];
    } else {
        error = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        loginError: error
    })
};
exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('user', 'Invalid Email or Password');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                console.log(doMatch, 'doMatch');
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save().then(e => {
                        console.log(e);
                        res.redirect('/');
                    })
                }
                req.flash('user', 'Invalid Email or Password');
                res.redirect('/login');
            }).catch(e => {
                console.log(e);
                return res.redirect('/');
            });
        }).catch(e => {
            console.log(e);
            req.flash('user', 'Invalid Email or Password');
            return res.redirect('/login');
        });
}
exports.postLogout = (req, res, next) => {
    console.log("session clearing");
    req.session.destroy(err => {
        console.log("session cleared");
        console.log(err);
        res.redirect('/');
    });
}
exports.getSignup = (req, res, next) => {
    let msg = req.flash('user');
    let error;
    if (msg.length > 0) {
        error = msg[0];
    } else {
        error = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        signUpError: error
    });
};
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash('user', "Existing user, please pick another");
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                }).then(result => {
                    res.redirect('/login');
                })

        })
        .catch(err => {
            console.log(err);
        });
};