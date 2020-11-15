var express = require('express');
var router = express.Router();

//require controller modules
var user_controller = require('../controllers/userController');

//login page route
router.get('/', function (req, res) {
  res.send('Login page');
})

//spotify redirect potentially


module.exports = router;