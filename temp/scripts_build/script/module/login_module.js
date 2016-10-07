"use strict";
cc._RFpush(module, '51036RGk3xAj6laeCPUTt6w', 'login_module');
// script\module\login_module.js

module.exports['class'] = cc.Class({

    properties: {
        token: {
            get: function get() {
                return this._token;
            },

            set: function set(value) {
                this._token = value.toString();
            }
        }
    },

    ctor: function ctor() {
        this.reset();
    },

    reset: function reset() {
        this._token = '';
    }

});

cc._RFpop();