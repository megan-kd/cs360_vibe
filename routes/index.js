var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

/* GET home page. */
let current = new Date();

let month = current.getMonth();
let day = current.getDate();
let year = current.getFullYear();

let date = month + "/" + day + "/" + year;

router.get('/', function(req, res, next) {
  console.log(req.session.username);
  if (req.session.username){
   
    res.render('index', { title: 'Playlist of the Day', date: date });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/updateAccount', function (req, res, next){
  if (req.session.username){
   
    res.render('updateAccount');
  }
  else {
    res.redirect('/login');
  }
});

router.post('/updateAccount', user_controller.user_update_account_post);
router.get('/updateAccount/deleteAccount', function(req, res){
  if (req.session.username){
    user_controller.user_delete_from_get(req, res);
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
