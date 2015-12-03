var Http = require('http'),
    Url = require('url'),
    Path = require('path'),
    QueryString = require('querystring'),
    FileSystem = require('fs');
var DataSource = function () {
    var dataSource, prepared = false;
    function _DataSource() {
        this.prepare = function () {
            if (!prepared) {
                // TODO : read from file or DB
                dataSource = {};
                dataSource.students = [];
                prepared = true;
            }
        };
        this.addStudent = function (student) {
            // Will NOT check if user already exists!!!
            dataSource.students.push(student);
        };
        this.findStudentBy = function (key, value) {
            if (!value) {
                return null;
            }
            for (var i = 0; i < dataSource.students.length; ++i) {
                if ((dataSource.students[i])[key] == value) {
                    return dataSource.students[i];
                }
            }
            return null;
        };
    }
    return new _DataSource();
}();
var EXTs = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
};

function Student(error, username, id, tel, email) {
    this.error = error;
    this.username = username;
    this.id = id;
    this.tel = tel;
    this.email = email;
}

function StudentError(code, usernameErr, idErr, telErr, emailErr) {
    this.code = code;
    this.usernameErr = usernameErr;
    this.idErr = idErr;
    this.telErr = telErr;
    this.emailErr = emailErr;
}

function restrictPathName(p) {
    var rp = p;
    if (p == '/index.html') {
        rp = '/';
    }
    return rp;
}

function getFile(filePath, response) {
    var mime = EXTs[Path.extname(Path.basename(filePath))];
    if(mime && FileSystem.existsSync('.' + filePath)) {
        FileSystem.readFile('.' + filePath, function(err, contents) {
            if(!err) {
                response.writeHead(200,{ 'Content-type' : mime });
                response.end(contents);
            } else {
                console.log(err);
            }
        });
    } else {
        redirectToSignUp(response);
    }
}

function retrievePlainText(pathName, encoding) {
    try {
        if (encoding) {
            return FileSystem.readFileSync('.' + pathName, encoding);
        } else {
            return FileSystem.readFileSync('.' + pathName);
        }
    } catch (err) {
        console.log(err);
        return '<html><body><p>Occur Error</p></body></html>';
    }
}

function parseStudentInfo(param) {
    var err = {};
    err.code = 0;
    // TODO : check err
    return new Student(err, param.username, param.id, param.tel, param.email);
}

// When x in '?username=x' exists, call goStudentInfo, otherwise goSignUp will be call.
function goSignUp(request, response, error) {
    var html = retrievePlainText('/signin.html', 'utf-8');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
}

function goStudentInfo(request, response, student) {
    var html = retrievePlainText('/studentinfo.html', 'utf-8');
    for (var key in student) {
        if (key != 'error' && student.hasOwnProperty(key)) {
            html = html.replace('{' + key + '}', student[key]);
        }
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
}

function redirectToSignUp(response) {
    response.writeHead(302, { 'Location': '/' });
    response.end();
}

function requestListener(request, response) {
    var url = Url.parse(request.url, true), pathname = restrictPathName(url.pathname), student;
    if (pathname == '/') {
        if (request.method == 'GET') {
            if (student = DataSource.findStudentBy('username', url.query.username)) {
                goStudentInfo(request, response, student);
            } else if (url.query.username == undefined) {
                goSignUp(request, response);
            } else {
                response.writeHead(302, { 'Location': '/' });
                response.end();
            }
        } else if (request.method == 'POST') {
            var data = '';
            request.setEncoding('utf-8');
            request.addListener('data', function (chunk) {
                data += chunk;
            });
            request.addListener('end', function () {
                console.log(data);
                student = parseStudentInfo(QueryString.parse(data));
                console.log(student);
                if (!student.error.code) {
                    DataSource.addStudent(student);
                    response.writeHead(302, { 'Location': '/?username=' + encodeURIComponent(student.username) });
                    response.end();
                } else {
                    goSignUp(request, response, student.error);
                }
            });
        } else {
            redirectToSignUp(response);
        }
    } else {
        getFile(pathname, response);
    }
}

function ServerMain() {
    DataSource.prepare();
    Http.createServer(requestListener).listen(8080);
}

ServerMain();
