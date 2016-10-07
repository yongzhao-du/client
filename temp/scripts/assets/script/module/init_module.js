"use strict";
cc._RFpush(module, '7e948j43sJDA4eOTfastjLi', 'init_module');
// script\module\init_module.js

var LoginModule = require('login_module')['class'];
var AccountModule = require('account_module')['class'];

module.exports.exec = function () {
    Global.loginModule = new LoginModule();
    Global.accountModule = new AccountModule();
};

cc._RFpop();