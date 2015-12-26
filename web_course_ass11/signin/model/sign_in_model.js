function getModel() {
    var m = {};
    // UI literals
    m.jqueryLink = 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js';
    m.validatorJsLink = '/javascripts/validator.js';
    m.jsLink = 'javascripts/sign_in.js';
    m.cssLink = 'stylesheets/sign.css';
    m.pageTitle = '登录';
    m.formTitle = '登录';
    m.usernameTitle = '用户名';
    // TODO
    m.usernameErrorMsg = 'Error';
    m.passwordTitle = '密码';
    // TODO
    m.passwordErrorMsg = 'Error';
    m.submitTitle = '登录';
    m.registerTitle = '没有账号？立即注册';
    m.registerLink = '/regist';
    return m;
}

exports.getModel = getModel;