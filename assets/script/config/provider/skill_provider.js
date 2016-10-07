const cfg = require('skill_cfg').data;

module.exports = {
    getConfig: function (id) {
        return cfg[id];
    },
}
