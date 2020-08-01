const express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {"registered_email": req.session.registered_email});
});

module.exports = router;