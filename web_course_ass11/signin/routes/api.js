var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var userModel = require('../model/user_model');

router.post('/sign_in', function (req, res, next) {
    var userInfo = {
        username: req.body.username,
        password: req.body.password
    };
    var result = {
        status: true,
        username: {
            status: true,
            error: ''
        },
        password: {
            status: true,
            error: ''
        }
    };
    userModel.readUser(userInfo.username, function (items) {
        if (items.length > 0) {
            if (items[0].password === userInfo.password) {
                result.username.status = true;
                result.username.error = '';
                result.password.status = true;
                result.password.error = '';
                res.cookie('username', userInfo.username, {maxAge: 900000, httpOnly: true});
            } else {
                result.username.status = true;
                result.username.error = '';
                result.password.status = false;
                result.password.error = '密码错误';
                result.status = false;
            }
        } else {
            result.username.status = false;
            result.username.error = '账户不存在';
            result.password.status = true;
            result.password.error = '';
            result.status = false;
        }
        console.log('SIGN_IN' + JSON.stringify(result));
        res.send(JSON.stringify(result));
    });
});

router.post('/sign_up', function (req, res, next) {
    var userInfo = {
        username: req.body.username,
        password: req.body.password,
        sid: req.body.sid,
        phone: req.body.phone,
        email: req.body.email
    };
    var result = validator.validateAll(userInfo);
    if (result.status) {
        userModel.infoExist(userInfo, function (re) {
            for (var k in re) {
                result[k].error = result[k].status ? re[k].error : result[k].error;
                result[k].status = result[k].status && re[k].status;
            }
            result.status = result.status && re.status;
            console.log('SIGN_UP' + JSON.stringify(result));
            if (result.status) {
                userModel.createUser(userInfo, function () {
                    res.cookie('username', userInfo.username, {maxAge: 900000, httpOnly: true});
                    res.send(JSON.stringify(result));
                });
            } else {
                res.send(JSON.stringify(result));
            }
        })
    }
});

router.post('/sign_out', function (req, res, next) {
    res.clearCookie('username', { path: '/' });
    res.send(JSON.stringify( { status: true } ));
});

module.exports = router;
