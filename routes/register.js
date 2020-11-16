var express = require('express');
var router = express.Router();

//require controller modules
var user_controller = require('../controllers/userController');

//login page route
router.get('/', function (req, res) {
  res.render('register');
});

// GET request for creating a new user account
// router.get('/createAccount', user_controller.user_create_get);
// POST request for creating a new user account
router.post('/createAccount', user_controller.user_create_post);

//spotify redirect potentially
module.exports = router;