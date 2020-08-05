const express = require('express');
const path = require("path");
const hbs = require('hbs')
const bodyParser = require('body-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser');

const homeRouter = require('./routes/home.routes');
const profileRouter = require('./routes/profile.routes');
const signinRouter = require('./routes/signin.routes');
const signupRouter = require('./routes/signup.routes');
const confirmationRouter = require('./routes/confirmation.routes');
const signoutRouter = require('./routes/signout.routes');
const forgotPasswordRouter = require('./routes/forgot_password.routes');
const resendCodeRouter = require('./routes/resendCode.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cookieParser());
// app.use(express.static(__dirname + '/public'));

hbs.registerHelper('ifEquals', function (v1, v2, options) {
	return (v1 == v2) ? options.fn(this) : options.inverse(this);
});
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

app.use(session({
	secret: 'secret key',
	resave: false,
    saveUninitialized: true,
}));

const port = 5000;

app.use("/", homeRouter);
app.use("/profile", authMiddleware.Validate, profileRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/confirmation", confirmationRouter);
app.use("/signout", signoutRouter);
app.use("/forgotPassword", forgotPasswordRouter);
app.use("/resendCode", resendCodeRouter);

/**
 * All other routes except for the above will render the 404_not_found page directly.
 */
app.use("*", (req, res) => {
    res.status(404).render('404_not_found');
})

app.listen(port, () => {
	console.log(`Server running on http://127.0.0.1:${port}`);
});