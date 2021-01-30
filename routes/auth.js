const express = require('express');;

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

const {
    check,
    body
} = require('express-validator');


router.get('/login', authController.getLogin);
router.post('/login', [
    check('email')
    .isEmail()
    .withMessage("The email is incorrect!").normalizeEmail(),
    body('password', 'Enter a password of min length 5 and no special characters are allowed').isLength({
        min: 5
    }).isAlphanumeric().trim(),

], authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);


router.post('/signup',
    [
        check('email')
        .isEmail()
        .withMessage("The email is incorrect!")
        .custom((value, {
            req
        }) => {
            return User.findOne({
                    email: value
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Existing user, please pick another');
                    }
                });
        }).normalizeEmail(),
        body('password', 'Enter a password of min length 5 and no special characters are allowed').isLength({
            min: 5
        }).isAlphanumeric().trim(),
        body('confirmPassword').trim().custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Password have to be equal!');
            }
            return true;
        })
    ],
    authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.updatePassword);



module.exports = router;