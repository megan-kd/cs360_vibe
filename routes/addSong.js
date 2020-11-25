var express = require('express');
var router = express.Router();
var song_controller = require('../controllers/songController');

router.post('/', song_controller.store_song_get);

module.exports = router;