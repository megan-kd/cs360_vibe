var express = require('express');
var router = express.Router();

/* GET home page. */
let current = new Date();
let month = current.getMonth();
let day = current.getDate();
let year = current.getFullYear();
let date = month + "/" + day + "/" + year;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vibe of the Day', date: date });
});

module.exports = router;
