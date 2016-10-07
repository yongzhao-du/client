var LoginModule = require('login_module')['class'];
var AccountModule = require('account_module')['class'];

module.exports.exec = function () {
    Global.loginModule = new LoginModule();
    Global.accountModule = new AccountModule();
};