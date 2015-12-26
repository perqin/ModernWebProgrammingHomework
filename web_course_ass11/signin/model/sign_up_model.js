function getModel() {
    var m = {};
    // UI literals
    m.jqueryLink = 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js';
    m.validatorJsLink = '/javascripts/validator.js';
    m.jsLink = 'javascripts/sign_up.js';
    m.cssLink = 'stylesheets/sign.css';
    m.pageTitle = '注册';
    m.formTitle = '注册';
    m.usernameTitle = '用户名';
    // TODO
    m.usernameErrorMsg = 'Error';
    m.passwordTitle = '密码';
    // TODO
    m.passwordErrorMsg = 'Error';
    m.confirmPasswordTitle = '确认密码';
    // TODO
    m.confirmPasswordErrorMsg = '';
    m.sidTitle = '学号';
    // TODO
    m.sidErrorMsg = '';
    m.phoneTitle = '电话';
    // TODO
    m.phoneErrorMsg = '';
    m.emailTitle = '邮箱';
    // TODO
    m.emailErrorMsg = '';
    m.submitTitle = '注册';
    m.signInTitle = '已有账号？立即登录';
    m.signInLink = '/';
    return m;
}

exports.getModel = getModel;