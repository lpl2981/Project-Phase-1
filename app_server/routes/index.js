var express = require('express');
var router = express.Router();
var ctrlWatchlist = require('../controllers/watchlist');

/* watchlist list page */
router.get('/watchlist', ctrlWatchlist.watchList);

module.exports = router;