const express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
    if (req.query.email) {
        // Render with query string parameter 'email'.
        res.render('confirmation', {'registered_email': req.query.email});
    } else {
        res.render('signup');
    }
});

module.exports = router;