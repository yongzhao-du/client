const cfg = require('hurdle_cfg').data;

module.exports = {
    getConfig: function (id) {
        return cfg[id];
    },
}
