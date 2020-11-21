var express = require('express');
var router = express.Router();

//require controller modules
var login_controller = require("../controllers/loginController");

//login page route
router.get('/', function (req, res) {
   req.session.destroy(function(err){
     console.log(err);
   });
   res.render('login');
  
});

router.post('/', login_controller.login_authenticate_post);

module.exports = router;