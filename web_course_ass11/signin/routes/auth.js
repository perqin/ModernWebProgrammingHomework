var userModel = require('../model/user_model');

module.exports = function (req, res, next) {
    var path = req.path;
    var qu = req.query.username;
    var cu = req.cookies.username;
    if (path === '/') {
        if (qu !== undefined && cu !== undefined) {
            if (qu === cu) {
                userModel.readUser(qu, function (items) {
                    if (items.length > 0) {
                        next();
                    } else {
                        res.clearCookie('username', { path: '/' });
                        res.redirect('/');
                    }
                });
            } else if (qu !== '') {
                // TODO : visit other's page
                res.redirect('/?username=' + cu);
            } else {
                res.redirect('/?username=' + cu);
            }
        } else if (qu === undefined && cu !== undefined) {
            res.redirect('/?username=' + cu);
        } else if (qu !== undefined && cu === undefined) {
            res.redirect('/');
        } else {
            next();
        }
    } else if (path === '/regist') {
        if (cu !== undefined) {
            res.redirect('/?username=' + cu);
        } else {
            next();
        }
    } else {
        next();
    }
};
