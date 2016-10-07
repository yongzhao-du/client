module.exports.class = cc.Class({
    ctor: function () {
        this._tick = 0;
        this._orginTick = 0;
    },

    reset: function () {
        this._tick = 0;
        this._orginTick = 0;
    },

    update: function (dt) {
        this._tick += dt;
        this._orginTick += dt;
    },
    
    getTimer: function () {
        return this._tick;
    },
});

