"use strict";
cc._RFpush(module, '9ec11EIKMRAI5D5voB+6BNC', 'physical_point');
// script\ui\component\physical_point.js

cc.Class({
    "extends": cc.Component,

    properties: {
        star: {
            "default": null,
            type: cc.Node
        },

        state: {
            get: function get() {
                this._state;
            },

            set: function set(state) {
                if (this._state == state) return;
                this.star.active = state === 0;
                this._state = state;
            }
        }
    },

    onLoad: function onLoad() {
        this.state = 1;
        //this._animation = this.node.getComponent(cc.Animation);
        //this._animation.on('finish', this.onAnimateFinish, this);
    }
});

cc._RFpop();