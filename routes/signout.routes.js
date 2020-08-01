const express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
    delete req.session['Authorization'];
    delete req.session['registered_password'];
    res.render('signin');
});

module.exports = router;