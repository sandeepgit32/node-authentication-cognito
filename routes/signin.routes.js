const express = require("express");
var router = express.Router();
const authService = require('../auth/authService');

router.get('/', (req, res) => {
    // res.clearCookie('remember_email');
    // res.clearCookie('remember_password');
    console.log(req.cookies);
    res.render('signin', {
        'remember_email': req.cookies.remember_email,
        'remember_password': req.cookies.remember_password
    });
});


router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (req.body.checkbox) {
        res.cookie('remember_email', email);
        res.cookie('remember_password', password);
    }

    authService.Signin(email, password, (err, result) => {
        if(err) {
            console.log(err);
            res.render('signin', {
                'signin-error': err.message,
                'remember_email': req.cookies.remember_email,
                'remember_password': req.cookies.remember_password
            });
        } else {
            // Authorization key is stored in session variable.
            req.session['Authorization'] = result.getAccessToken().getJwtToken();
            req.session['registered_email'] = result.getIdToken().payload.email;
            res.redirect('/profile');
        }
    });
});

module.exports = router;