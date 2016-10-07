var cfg = require('skill_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};