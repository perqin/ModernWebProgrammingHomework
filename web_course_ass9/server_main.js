var Http = require('http'),
    Url = require('url'),
    QueryString = require('querystring'),
    FileSystem = require('fs');
var DataSource = function () {
    var dataSource, prepared = false;
    function _DataSource() {
        this.prepare = function () {
            if (!prepared) {
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

function Student(username, id, tel, email) {
    this.usernmae = username;
    this.id = id;
    this.tel = tel;
    this.email = email;
}

function writeError(response) {
    response.writeHead(404);
    response.end();
}

function restrictPathName(p) {
    var rp = p;
    if (p == '/index.html' || p == 'index') {
        rp = '/';
    }
    return rp;
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

function writeSignIn(response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(retrievePlainText('/signin.html', 'utf-8'));
    response.end();
}

function writeStudentInfo(student) {
    var html = retrievePlainText('/studentinfo.html', 'utf-8');
    html.replace(/\{%1%}/, student.usernmae);
    html.replace(/\{%2%}/, student.id);
    html.replace(/\{%3%}/, student.tel);
    html.replace(/\{%4%}/, student.email);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
}

function requestListener(request, response) {
    var url = Url.parse(request.url, true),
        pathname = restrictPathName(url.pathname),
        query = url.query,
        student;
    if (pathname == '/') {
        DataSource.prepare();
        if (request.method == 'GET') {
            if (query.username && (student = DataSource.findStudentBy('username', query.usernmae))) {
                writeStudentInfo(response, student);
            } else {
                writeSignIn(response);
            }
        } else if (request.method == 'POST') {
            console.log(query);
        } else {
            writeError(response);
        }
    } else {
        writeError(response);
    }
}

Http.createServer(requestListener).listen(8080);
