"use strict";
cc._RFpush(module, '4268aLywxFCA7qNQcRCKYc7', 'round_ctrl');
// script\scene\battle\round_ctrl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        numbers: {
            'default': [],
            type: [cc.Prefab]
        },

        round: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._nums = [];
        this._ani = this.getComponent(cc.Animation);
        this.round.active = false;
    },

    setRound: function setRound(value) {
        if (typeof value === 'string') ;else if (typeof value === 'number') value = value.toString();else return;

        while (this._nums.length > 0) {
            var node = this._nums.pop();
            node.parent = null;
            node.destroy();
        }
        this._ani.stop();
        this.round.active = false;
        var self = this;
        var actions = [];
        var totalWidth = 0;
        var index = 0;
        for (var j = 0; j < value.length; j++) {
            actions.push(new cc.delayTime(0.2));
            actions.push(new cc.callFunc(function () {
                var num = parseInt(value.charAt(index));
                var prefab = self.numbers[num];
                var node = cc.instantiate(prefab);
                node.x = totalWidth;
                node.parent = self.node;
                totalWidth += node.width;
                index++;
                self._nums.push(node);
            }));
        }
        actions.push(new cc.delayTime(0.2));
        actions.push(new cc.callFunc(function () {
            self.round.active = true;
            self.round.x = totalWidth - 35;
            self._ani.play('round_img');
        }));
        this.node.stopAllActions();
        this.node.runAction(new cc.Sequence(actions));
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();