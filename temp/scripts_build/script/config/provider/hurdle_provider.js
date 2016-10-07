"use strict";
cc._RFpush(module, 'af6d3P51p9KEIJo2GCx3WKa', 'hurdle_provider');
// script\config\provider\hurdle_provider.js

var cfg = require('hurdle_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};

cc._RFpop();