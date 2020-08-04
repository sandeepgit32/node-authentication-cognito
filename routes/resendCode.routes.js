const express = require("express");
var router = express.Router();
const authService = require('../auth/authService');


router.get('/', (req, res) => {
    authService.Forgotpassword(req.session['forget_password_email'], (err, result) => {
        if (err) {
            console.log(err);
            res.render('forgot_password', {
                'email_sent': req.session['email_sent'],
                'forgot_password_message': req.session['forgot_password_message'],
                'forgotPassword-error': [err.message]
            });
        } else {
            res.render('forgot_password', {
                'email_sent': req.session['email_sent'],
                'forgot_password_message': req.session['forgot_password_message'],
                'resend_code_message': 'A verification code has been resend.'
            });
        }
    });
})

module.exports = router;