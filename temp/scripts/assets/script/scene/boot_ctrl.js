"use strict";
cc._RFpush(module, 'f0735HPSrZGa6+MPMhkvwbu', 'boot_ctrl');
// script\scene\boot_ctrl.js

cc.Class({
    "extends": cc.Component,

    onLoad: function onLoad() {
        this._loadedScene = false;
    },

    update: function update(dt) {
        if (Global.initted && !this._loadedScene) {
            this._loadedScene = true;
            GameUtil.loadScene("loading");
        }
    }
});

cc._RFpop();