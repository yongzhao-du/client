var cfg = require('hurdle_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};