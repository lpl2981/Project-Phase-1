var mongoose = require('mongoose');
var watchlist = mongoose.model('watchlist');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/* POST a new movie, providing a watchlistId */
/* /api/watchlist/:watchlistId/movie */
module.exports.movieCreate = function(req, res) {
    if (req.params.watchlistId) {
        watchlist
            .findById(req.params.watchlistId)
            .select('movies')
            .exec(
                function(err, movies) {
                    if (err) {
                        sendJSONresponse(res, 400, err);
                    } else {
                        doAddMovie(req, res, movies);
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, watchlistId required"
        });
    }
};

var doAddMovie = function(req, res, watchlist) {
    if (!watchlist) {
        sendJSONresponse(res, 404, "watchlistId not found");
    } else {
        watchlist.movies.push({
            name: req.body.name,
            description: req.body.description
        });
        watchlist.save(function(err, thisMovie) {
            var thisMovie;
            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                sendJSONresponse(res, 201, thisMovie);
            }
        });
    }
};

module.exports.moviesUpdateOne = function(req, res) {
    if (!req.params.watchlistId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, watchlistId is required"
        });
        return;
    }
    watchlist
        .findById(req.params.watchlistId)
        .select('movies')
        .exec(
            function(err, watchlist) {
                var thisWatchlist;
                if (!watchlist) {
                    sendJSONresponse(res, 404, {
                        "message": "watchlist not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                if (watchlist.movies && watchlist.movies.length > 0) {
                    thisMovie = watchlist.movies.id(req.params.moviesId);
                    if (!thisMovie) {
                        sendJSONresponse(res, 404, {
                            "message": "movieId not found"
                        });
                    } else {
                        thisMovie.name = req.body.name;
                        thisMovie.description = req.body.description;
                        watchlist.save(function(err, watchlist) {
                            if (err) {
                                sendJSONresponse(res, 404, err);
                            } else {
                                sendJSONresponse(res, 200, watchlist, thisMovie);
                            }
                        });
                    }
                } else {
                    sendJSONresponse(res, 404, {
                        "message": "No movie to update"
                    });
                }
            }
        );
};

module.exports.moviesReadOne = function(req, res) {
    console.log("Getting single movie");
    if (req.params && req.params.watchlistId && req.params.moviesId) {
        watchlist
            .findById(req.params.watchlistId)
            .select('name description')
            .exec(
                function(err, watchlist) {
                    console.log(watchlist);
                    var response, movie;
                    if (!watchlist) {
                        sendJSONresponse(res, 404, {
                            "message": "watchlistId not found"
                        });
                        return;
                    } else if (err) {
                        sendJSONresponse(res, 400, err);
                        return;
                    }
                    if (watchlist.movies && watchlist.movies.length > 0) {
                        movie = watchlist.movies.id(req.params.moviesid);
                        if (!movie) {
                            sendJSONresponse(res, 404, {
                                "message": "movieId not found"
                            });
                        } else {
                            response = {
                                watchlist: {
                                    name: watchlist.name,
                                    id: req.params.watchlistid
                                },
                                movie: movie
                            };
                            sendJSONresponse(res, 200, response);
                        }
                    } else {
                        sendJSONresponse(res, 404, {
                            "message": "No movies found"
                        });
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, watchlistId and movieId are both required"
        });
    }
};

// app.delete('/api/watchlist/:watchlistid/movies/:movieId'
module.exports.moviesDeleteOne = function(req, res) {
    if (!req.params.watchlistId || !req.params.moviesId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, watchlistId and movieId are both required"
        });
        return;
    }
    watchlist
        .findById(req.params.watchlistId)
        .select('movies')
        .exec(
            function(err, watchlist) {
                if (!watchlist) {
                    sendJSONresponse(res, 404, {
                        "message": "watchlistid not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                if (watchlist.movies && watchlist.movies.length > 0) {
                    if (!watchlist.movies.id(req.params.moviesId)) {
                        sendJSONresponse(res, 404, {
                            "message": "movieId not found"
                        });
                    } else {
                        watchlist.movies.id(req.params.moviesId).remove();
                        watchlist.save(function(err) {
                            if (err) {
                                sendJSONresponse(res, 404, err);
                            } else {
                                sendJSONresponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJSONresponse(res, 404, {
                        "message": "No movie to delete"
                    });
                }
            }
        );
};
