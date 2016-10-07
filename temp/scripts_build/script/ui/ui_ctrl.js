"use strict";
cc._RFpush(module, 'd2c99j+HrdNA6mfGJtjn5mP', 'ui_ctrl');
// script\ui\ui_ctrl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        id: {
            set: function set(value) {
                this._id = value;
            },

            get: function get() {
                return this._id;
            }
        },

        args: {
            set: function set(value) {
                this._args = value;
            },

            get: function get() {
                return this._args;
            }
        },

        manager: {
            set: function set(manager) {
                this._manager = manager;
            },

            get: function get() {
                return this._manager;
            }
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._id = -1;
        this._animation = this.getComponent(cc.Animation);
        if (this._animation) {
            this._animation.on('finished', this.onFinishAnimate, this);
        }
    },

    close: function close() {
        if (this._animation) {
            this.playAnimate(1);
        } else {
            this.manager.closeUI(this.node);
        }
    },

    playAnimate: function playAnimate(type, callback) {
        if (!this._animation) return;

        switch (type) {
            case 0:
                this._animation.play('ui_open');
                break;
            case 1:
                this._animation.play('ui_close');
                break;
        }
    },

    onFinishAnimate: function onFinishAnimate(event) {
        var state = event.detail;
        var type = event.type;
        if (type === 'finished') {
            this.manager.closeUI(this.node);
        }
    }

});

cc._RFpop();