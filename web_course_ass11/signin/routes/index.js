var express = require('express');
var router = express.Router();
var homeModel = require('../model/home_model');
var signInModel = require('../model/sign_in_model');
var signUpModel = require('../model/sign_up_model');
var userModel = require('../model/user_model');

// Sign in page
router.get('/', function(req, res, next) {
    var username = req.query.username;
    if (username === undefined) {
        res.render('sign_in', signInModel.getModel());
        return;
    }
    userModel.readUser(username, function (items) {
        if (items.length === 0) {
            res.redirect('/');
        } else {
            res.render('home', homeModel.getModel(items[0]));
        }
    });
});

// Sign up page
router.get('/regist', function (req, res, next) {
    res.render('sign_up', signUpModel.getModel());
});

module.exports = router;
