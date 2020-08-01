const express = require("express");
var router = express.Router();
const authService = require('../auth/authService');

router.get('/', (req, res) => {
    res.render('signin');
});


router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    authService.Signin(email, password, (err, result) => {
        if(err) {
            console.log(err);
            res.render('signin', {'signin-error': err.message});
        } else {
            // Authorization key is stored in session variable.
            req.session['Authorization'] = result.getAccessToken().getJwtToken();
            req.session['registered_email'] = result.getIdToken().payload.email;
            res.redirect('/profile');
        }
    });
});

module.exports = router;