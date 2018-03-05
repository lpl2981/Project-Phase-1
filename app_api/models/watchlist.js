var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

var watchlistSchema = new mongoose.Schema({
    username: {type: String, required: true},
    createdOn: {
        type: Date,
        "default": Date.now
    },
    movies: [movieSchema]
});

mongoose.model('watchlist', watchlistSchema);