var express = require('express');
var router = express.Router();
var ctrlWatchlist = require('../controllers/watchlist');

/* Items list page */
router.get('/', ctrlWatchlist.List);

module.exports = router;
