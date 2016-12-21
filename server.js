var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var session = require('express-session');
var GithubStrategy = require('passport-github2').Strategy;
var app = express();
var request = require('request');
var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());

passport.use(new GithubStrategy({
        clientID: '', // PUT YOUR CLIENT ID HERE
        clientSecret: '', // PUT YOUR CLIENT SECRET HERE
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {

        var user = {
            profile: profile,
            token: accessToken
        };

        done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }
    return next();
};

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/#!/', successRedirect:'/#!/home'}));

app.get('/api/github/following', requireAuth, function(req, res) {

    var url = req.user.profile._json.followers_url;

    var options = {
        auth: {bearer: req.user.token},
        headers: {'User-Agent': 'request'}
    };

    var callback = function(err, response, body) {
        var parsed = JSON.parse(response.body);
        res.json(parsed);
    };

    request.get(url, options, callback);
});


app.get('/api/github/:username/activity', requireAuth, function(req, res) {

    var url = 'https://api.github.com/users/'+ req.params.username +'/events';

    var options = {
        auth: {bearer: req.user.token},
        headers: {'User-Agent': 'request'}
    };

    var callback = function(err, response, body) {
        var parsed = JSON.parse(response.body);
        res.json(parsed);
    };

    request.get(url, options, callback);

});


app.listen(port, function() {
    console.log('Listening on port', port);
});