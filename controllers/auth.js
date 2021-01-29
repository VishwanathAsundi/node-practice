const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

const nodemailer = require('nodemailer');

const sendGridTransport = require('nodemailer-sendgrid-transport');

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
                    return transporter.sendMail({
                        to: email,
                        from: 'vishwanathasundi1997@gmail.com',
                        subject: "SignUp Completed",
                        html: '<h1>Hey, Sign up is succeded!</h1>'
                    })

                }).catch(e => {
                    console.log(e);
                })

        })
        .catch(err => {
            console.log(err);
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
            console.log(e);
        })

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
        console.log(e);
    })
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
        console.log(e);
    })
}