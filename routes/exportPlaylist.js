var express = require('express');
var router = express.Router();
var playlist_controller = require ('../controllers/playlistController');

router.get('/', playlist_controller.export_playlist);

module.exports = router;