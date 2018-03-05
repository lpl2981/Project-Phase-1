var express = require('express');
var router = express.Router();
var ctrlWatchlist = require('../controllers/watchlist');
var ctrlMovies = require('../controllers/movies');

router.get('/watchlist', ctrlWatchlist.moviesForWatchlist);
router.post('/watchlist', ctrlWatchlist.watchlistCreate);
router.get('/watchlist/:watchlistId', ctrlWatchlist.watchlistReadOne);
router.put('/watchlist/:watchlistId', ctrlWatchlist.watchlistUpdateOne);
router.delete('/watchlist/:watchlistId', ctrlWatchlist.watchlistDeleteOne);

// reviews
router.post('/watchlist/:watchlistId/movies', ctrlMovies.movieCreate);
router.get('/watchlist/:watchlistId/movies/:movieId', ctrlMovies.moviesReadOne);
router.put('/watchlist/:watchlistId/movies/:movieId', ctrlMovies.moviesUpdateOne);
router.delete('/watchlist/:watchlistId/movies/:movieId', ctrlMovies.moviesDeleteOne);

module.exports = router;
