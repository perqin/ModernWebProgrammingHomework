var mongoClient = require('mongodb').MongoClient;
var usersUri = 'mongodb://localhost:27017/sign_in';

var errorMsg = {
    username:           '用户名已存在',
    sid:                '学号已存在',
    phone:              '电话已存在',
    email:              '邮箱已存在'
};

function createUser(userInfo, callback) {
    mongoClient.connect(usersUri, function (err, db) {
        if (err) {
            console.log('DB ERROR : ' + err);
            return;
        }
        db.collection('users').insertOne(userInfo, function () {
            db.close();
            callback();
        });
    });
}

function readUser(u, callback) {
    mongoClient.connect(usersUri, function (err, db) {
        if (err) {
            console.log('DB ERROR : ' + err);
            return;
        }
        db.collection('users').find({ username: u }).toArray(function (err, items) {
            if (err) {
                console.log('DB ERROR : ' + err);
                db.close();
                return;
            }
            db.close();
            callback(items);
            // TODO
            //if (u == 'perqin') {
            //    callback([{username: 'perqin'}]);
            //} else {
            //    callback([]);
            //}
            //callback(items);
        });
    });
}

function infoExist(user, callback) {
    var result = {
        status: true,
        username: {
            status: true,
            error: ''
        },
        sid: {
            status: true,
            error: ''
        },
        email: {
            status: true,
            error: ''
        },
        phone: {
            status: true,
            error: ''
        }
    };
    mongoClient.connect(usersUri, function (err, db) {
        db.collection('users').find({ username: user.username }).toArray(function (err, items) {
            result['username'].status = items.length === 0;
            result['username'].error = result['username'].status ? '' : errorMsg['username'];
            result.status = result.status && result['username'].status;
            db.collection('users').find({ sid: user.sid }).toArray(function (err, items) {
                result['sid'].status = items.length === 0;
                result['sid'].error = result['sid'].status ? '' : errorMsg['sid'];
                result.status = result.status && result['sid'].status;
                db.collection('users').find({ phone: user.phone }).toArray(function (err, items) {
                    result['phone'].status = items.length === 0;
                    result['phone'].error = result['phone'].status ? '' : errorMsg['phone'];
                    result.status = result.status && result['phone'].status;
                    db.collection('users').find({ email: user.email }).toArray(function (err, items) {
                        result.status = result.status && result['email'].status;
                        result['email'].error = result['email'].status ? '' : errorMsg['email'];
                        result['email'].status = items.length === 0;
                        db.close();
                        callback(result);
                    });
                });
            });
        });
    });
}

exports.createUser = createUser;
exports.readUser = readUser;
exports.infoExist = infoExist;