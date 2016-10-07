"use strict";
cc._RFpush(module, 'b43b1tRBw5HmrqkPtMUT23u', 'sync_timer');
// script\timer\sync_timer.js

module.exports["class"] = cc.Class({
    ctor: function ctor() {
        this._tick = 0;
        this._orginTick = 0;
    },

    reset: function reset() {
        this._tick = 0;
        this._orginTick = 0;
    },

    update: function update(dt) {
        this._tick += dt;
        this._orginTick += dt;
    },

    getTimer: function getTimer() {
        return this._tick;
    }
});

cc._RFpop();