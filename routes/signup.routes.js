const express = require("express");
var router = express.Router();
const authService = require('../auth/authService');
const { check, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    res.render('signup');
});


router.post('/', [
check('email')
    .isEmail().withMessage('Invalid email'),
check('password')
    .isLength({ min:8 }).withMessage('Password must be at least 8 charactes long!')
    .matches(/[0-9]/).withMessage('Password must contain at least one number!')
    .matches(/[a-z]/).withMessage('Password must contain at least a lower case letter!')
    .matches(/[A-Z]/).withMessage('Password must contain at least an upper case letter!')
    .matches(/[$*.(){}?"!@#%&/,><':;|_~^+-]/).withMessage('Password must contain at least one special character!')
], (req, res) => {
    const errors = validationResult(req)['errors'];
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    var signup_error_messages = []
    errors.forEach(error => {
        signup_error_messages.push(error.msg);
    })
    if (password != confirmPassword) {
        signup_error_messages.push('Passwords do not match!')
    }
    if (signup_error_messages.length > 0) {
        res.render('signup', {'signup-errors': signup_error_messages})
    } else {
        authService.Signup(email, password, function(err, user){
            if(err) {
                // AWS cognito provides error messages only one at a time.
                // 'err' will provide the error message is the email is already registered.
                res.render('signup', {"signup-errors": [err.message]});
            } else {
                // Actual email is in place of username.
                var registered_email = user.username;
                res.redirect('/confirmation?email='+registered_email);
            }
        });
    }
});

module.exports = router;