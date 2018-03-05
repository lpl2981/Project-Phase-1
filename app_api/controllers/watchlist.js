var mongoose = require('mongoose');
var watchlist = mongoose.model('watchlist');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of items */
module.exports.moviesForWatchlist = function(req, res) {
    watchlist
        .find()
        .exec(
            function(err, results) {
                if (err) {
                    console.log('results error:', err);
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, results);
                }
            });
};

/* GET a watchlist by the id */
module.exports.watchlistReadOne = function(req, res) {
  console.log('Finding watchlist details', req.params);
  if (req.params && req.params.watchlistId) {
    Loc
      .findById(req.params.watchlistId)
      .exec(function(err, watchlist) {
        if (!watchlist) {
          sendJSONresponse(res, 404, {
            "message": "watchlistId not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(watchlist);
        sendJSONresponse(res, 200, watchlist);
      });
  } else {
    console.log('No watchlistId specified');
    sendJSONresponse(res, 404, {
      "message": "No watchlistId in request"
    });
  }
};

/* POST a new watchlist */
/* /api/watchlist */
module.exports.watchlistCreate = function(req, res) {
    console.log(req.body);
    watchlist.create({
        name: req.body.name,
        description: req.body.description
    }, function(err, watchlist) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            console.log(watchlist);
            sendJSONresponse(res, 201, watchlist);
        }
    });
};


/* PUT /api/watchlist/:watchlistId */
module.exports.watchlistUpdateOne = function(req, res) {
    if (!req.params.watchlistId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, watchlistId is required"
        });
        return;
    }
    watchlist
        .findById(req.params.watchlistId)
        .select('-reviews -rating')
        .exec(
            function(err, item) {
                if (!item) {
                    sendJSONresponse(res, 404, {
                        "message": "itemId not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                watchlist.name = req.body.name;
                watchlist.description = req.body.description;
                watchlist.save(function(err, watchlist) {
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    } else {
                        sendJSONresponse(res, 200, watchlist);
                    }
                });
            }
        );
};

/* DELETE /api/items/:itemId */
module.exports.watchlistDeleteOne = function(req, res) {
    var watchlistId = req.params.watchlistId;
    if (watchlistId) {
        watchlist
            .findByIdAndRemove(watchlistId)
            .exec(
                function(err, watchlist) {
                    if (err) {
                        console.log(err);
                        sendJSONresponse(res, 404, err);
                        return;
                    }
                    console.log("watchlist id " + watchlistId + " deleted");
                    sendJSONresponse(res, 204, null);
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "No watchlistId"
        });
    }
};