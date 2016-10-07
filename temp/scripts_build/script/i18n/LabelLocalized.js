"use strict";
cc._RFpush(module, '86331p0XDZFjbhNNl/1cQhj', 'LabelLocalized');
// script\i18n\LabelLocalized.js

var i18n = require('i18n');
cc.Class({
    'extends': cc.Label,

    properties: {
        textKey: {
            'default': 'TEXT_KEY',
            multiline: true,
            tooltip: 'Enter i18n key here',
            notify: function notify() {
                if (this._sgNode) {
                    this._sgNode.setString(this.string);
                    this._updateNodeSize();
                }
            }
        },
        string: {
            override: true,
            tooltip: 'Here shows the localized string of Text Key',
            get: function get() {
                return i18n.t(this.textKey);
            },
            set: function set(value) {
                cc.warn('Please set label text key in Text Key property.');
            }
        }
    }
});

cc._RFpop();