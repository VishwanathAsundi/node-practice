const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

const nodemailer = require('nodemailer');

const sendGridTransport = require('nodemailer-sendgrid-transport');

const {
    validationResult
} = require('express-validator');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}))

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
        loginError: error,
        oldInput: {
            email: '',
            password: ''
        },
        validationErros: []
    })
};
exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            loginError: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErros: errors.array()
        });
    }

    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    loginError: 'Invalid Email or Password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErros: [{
                        param: 'email',
                        param: 'password'
                    }]
                });
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
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    loginError: 'Invalid Email or Password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErros: [{
                        param: 'email',
                        param: 'password'
                    }]
                });
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
        signUpError: error,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErros: []
    });
};
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            signUpError: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErros: errors.array()
        });
    }
    bcrypt.hash(password, 12)
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
            return transporter.sendMail({
                to: email,
                from: 'vishwanathasundi1997@gmail.com',
                subject: "SignUp Completed",
                html: '<h1>Hey, Sign up is succeded!</h1>'
            })

        }).catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });


};
exports.getReset = (req, res, next) => {
    let msg = req.flash('error');
    let error;
    if (msg.length > 0) {
        error = msg[0];
    } else {
        error = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        loginError: error
    });
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                req.flash('error', 'No matching user is found with that e-mail.')
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpire = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            return transporter.sendMail({
                to: email,
                from: 'vishwanathasundi1997@gmail.com',
                subject: "Password Reset",
                html: `<p>You requested for password reset</p>
                        <p>Click the <a href=http://localhost:3000/reset/${token}>link</a> to reset your password!</p>
                `
            })
        }).catch(e => {
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });

    })

}
exports.getNewPassword = (req, res, next) => {
    let token = req.params.token;
    console.log(token, "token");
    User.findOne({
        resetToken: token,
        resetTokenExpire: {
            $gt: Date.now()
        }
    }).then(user => {
        let msg = req.flash('error');
        let error;
        if (msg.length > 0) {
            error = msg[0];
        } else {
            error = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'Update password',
            loginError: error,
            userId: user._id,
            resetToken: token
        });
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.updatePassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    let currentUser;

    User.findOne({
        resetToken: resetToken,
        resetTokenExpire: {
            $gt: Date.now()
        },
        _id: userId
    }).then(user => {
        currentUser = user;
        return bcrypt.hash(newPassword, 12);
    }).then(hashedPassword => {
        currentUser.password = hashedPassword;
        currentUser.resetToken = undefined;
        currentUser.resetTokenExpire = undefined;
        return currentUser.save();
    }).then(result => {
        console.log("Password update is success");
        res.redirect('/login');
    }).catch(e => {
        const error = new Error(e);
        error.httpStatusCode = 500;
        return next(error);
    });
}