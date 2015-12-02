var Http = require('http'),
    Url = require('url'),
    QueryString = require('querystring'),
    FileSystem = require('fs');

function StudentInfo(username, id, tel, email) {
    this.usernmae = username;
    this.id = id;
    this.tel = tel;
    this.email = email;
}

function retrieveTextFile(filePath, response) {
    FileSystem.readFile('.' + filePath, function (err, text) {
        if (err) {
            throw err;
        }
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write(text);
        response.end();
    });
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

function loadDataSource() {
    // TODO
}

function requestListener(request, response) {
    var url = Url.parse(request.url, true),
        pathname = restrictPathName(url.pathname),
        query = url.query;
    if (pathname == '/') {
        loadDataSource();
    } else {
        writeError(response);
    }
}

Http.createServer(requestListener).listen(8080);
