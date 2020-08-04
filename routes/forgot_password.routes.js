const express = require("express");
var router = express.Router();
const authService = require('../auth/authService');
const { check, validationResult } = require('express-validator');


router.get('/', (req, res) => {
    res.render('forgot_password');
});


router.post('/', [
check('email')
    .isEmail().withMessage('Invalid email'),
check('new_password')
    .isLength({ min:8 }).withMessage('Password must be at least 8 charactes long!')
    .matches(/[0-9]/).withMessage('Password must contain at least one number!')
    .matches(/[a-z]/).withMessage('Password must contain at least a lower case letter!')
    .matches(/[A-Z]/).withMessage('Password must contain at least an upper case letter!')
    .matches(/[$*.(){}?"!@#%&/,><':;|_~^+-]/).withMessage('Password must contain at least one special character!')
], (req, res) => {
    const errors = validationResult(req)['errors'];
    var forgotPassword_error_messages = []
    errors.forEach(error => {
        if (error.param == 'email') {
            forgotPassword_error_messages.push(error.msg);
        }
    });
    if (req.body.email) {
        if (forgotPassword_error_messages.length > 0) {
            res.render('forgot_password', {'forgotPassword-error': forgotPassword_error_messages});
        } else {
            authService.Forgotpassword(req.body.email, (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('forgot_password', {'forgotPassword-error': [err.message]});
                } else {
                    console.log(result);
                    req.session['email_sent'] = true;
                    // Saving the email in session variable is necessary as it will be required for 
                    // Confirmpassword later.
                    req.session['forget_password_email'] = req.body.email;
                    // 'result.CodeDeliveryDetails.Destination' contain cryptic email addr e.g. 's***@a***.com'
                    req.session['forgot_password_message'] = `Check your mail at ${result.CodeDeliveryDetails.Destination}`;
                    res.render('forgot_password', {
                        'email_sent': req.session['email_sent'],
                        'forgot_password_message': req.session['forgot_password_message']
                    });
                }
            });
        }
    } else {
        const errors = validationResult(req)['errors'];
        var forgotPassword_error_messages = []
        errors.forEach(error => {
            if (error.param == 'new_password') {
                forgotPassword_error_messages.push(error.msg);
            }
        });
        if (req.body.new_password != req.body.confirm_new_password) {
            forgotPassword_error_messages.push('Passwords do not match!')
        }
        if (forgotPassword_error_messages.length > 0) {
            res.render('forgot_password', {
                'email_sent': req.session['email_sent'],
                'forgot_password_message': req.session['forgot_password_message'],
                'forgotPassword-error': forgotPassword_error_messages
            });
        } else {
            authService.Confirmpassword(req.body.code, req.session['forget_password_email'], 
            req.body.new_password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('forgot_password', {
                        'email_sent': req.session['email_sent'],
                        'forgot_password_message': req.session['forgot_password_message'],
                        'forgotPassword-error': [err.message]
                    });
                } else {
                    delete req.session['email_sent'];
                    delete req.session['forgot_password_message']
                    res.redirect('/signin');
                }
            });
        }
    }
});

module.exports = router;