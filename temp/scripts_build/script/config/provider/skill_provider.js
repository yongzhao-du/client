"use strict";
cc._RFpush(module, '3ebe3v9gCRNbqoF6gfcG5Ms', 'skill_provider');
// script\config\provider\skill_provider.js

var cfg = require('skill_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};

cc._RFpop();