"use strict";
cc._RFpush(module, '5f1a0/5i91KxrsJn71PGfY2', 'init_config');
// script\config\init_config.js

module.exports.exec = function () {
    Global.hurdleProvider = require('hurdle_provider');
    Global.skillProvider = require('skill_provider');
};

cc._RFpop();