"use strict";
cc._RFpush(module, 'a1be0bPuWxGUaSOXXHFmzpn', 'state_ctrl');
// script\scene\battle\state_ctrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        hpAlpha: {
            "default": null,
            type: cc.Node
        },

        hpLight: {
            "default": null,
            type: cc.Node
        },

        nameLabel: {
            "default": null,
            type: cc.Label
        },

        moveTime: 3
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._time = 0;
        this._delayTime = 0;
        this._startWidth = 0;
        this._targetWidth = 0;
        this._maxWidth = this.hpLight.width;
    },

    setName: function setName(name) {
        this.nameLabel.string = name;
    },

    setHp: function setHp(hp, max, ani) {
        if (hp < 0) hp = 0;
        if (max < 1) max = 1;
        var percent = hp / max;
        var width = percent * this._maxWidth;
        if (!ani) {
            this.hpAlpha.width = width;
            this.hpLight.width = width;
        } else {
            this.hpLight.width = width;
            this._startWidth = this.hpAlpha.width;
            this._targetWidth = width;
            this._time = this._delayTime = (this._startWidth - this._targetWidth) / this._maxWidth * this.moveTime;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this._delayTime > 0) {
            this._delayTime -= dt;
            if (this._delayTime <= 0) {
                this._delayTime = this._time = 0;
                this.hpLight.width = this._targetWidth;
            } else {
                var e = this._time - this._delayTime; // this.moveTime;
                var d = this._maxWidth * e / this.moveTime;
                this.hpAlpha.width = this._startWidth - d;
            }
        }
    }
});

cc._RFpop();