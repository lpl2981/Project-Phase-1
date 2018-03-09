/* GET 'list' page */
const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
};

const _renderList = function(req, res, responseBody){
    res.render('watchlist', { title: 'Watchlist', watchlist: responseBody });
};

const movieslist = function(req, res){
    const path = '/api/movies';
    const requestOptions = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {}
    };
    request(
        requestOptions,
        (function (err, response, body) {
            _renderList(req, res, body);
        })
    );
};

module.exports.movieslist = movieslist;