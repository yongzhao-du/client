"use strict";
cc._RFpush(module, '4e542GXCRpEKolPEuLFgQMT', 'ui_manager');
// script\ui\ui_manager.js

var BufferTable = require('buffer_table')['class'];

cc.Class({
    'extends': cc.Component,

    properties: {
        uiContainer: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._table = [];
    },

    openUI: function openUI(name, args) {
        var self = this;
        cc.loader.loadRes('prefab/ui/' + name, cc.Prefab, function (err, prefab) {
            var node = cc.instantiate(prefab);
            var id = self._table.push(node);
            var ctrl = node.getComponent('ui_ctrl');
            ctrl.id = id;
            ctrl.args = args;
            ctrl.manager = self;
            self.uiContainer.addChild(node);
        });
    },

    closeUI: function closeUI(node) {
        for (var i = 0; i < this._table.length; i++) {
            if (node == this._table[i]) {
                this._table.splice(i, 1);
                if (node.isValid) {
                    node.destroy();
                }
                break;
            }
        }
    },

    closeAll: function closeAll() {
        while (this._table.length > 0) {
            var node = this._table.pop();
            if (node.isValid) {
                node.destroy();
            }
        }
    }

});

cc._RFpop();