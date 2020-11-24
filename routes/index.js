var express = require('express');
var router = express.Router();

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

module.exports = router;
