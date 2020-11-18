var express = require('express');
var router = express.Router();

//require controller modules
var login_controller = require("../controllers/loginController");

//login page route
router.get('/', function (req, res) {
  res.render('login');
});
/*// initialize express-session to track logged-in user
router.use(session({
  key: 'user_sid',
  secret: 'doug',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

// middleware to check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
router.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }    
};

// route for home page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});*/

router.post('/', login_controller.login_authenticate_post);

module.exports = router;