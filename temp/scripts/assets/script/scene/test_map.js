"use strict";
cc._RFpush(module, '14ca0fIqYRAM7df9ABz160Q', 'test_map');
// script\scene\test_map.js

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
        round: {
            'default': null,
            type: cc.Node
        },

        edit: {
            'default': null,
            type: cc.EditBox
        },

        abc: {
            'default': null,
            type: cc.AudioSource
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this._roundNum = this.round.getComponent('round_ctrl');
    },

    start: function start() {
        //cc.audioEngine.playMusic('resources/sound/bg', true);
        //this._map.lockRegion = new cc.Rect(0, 0, 1500, 640);
        //this._map.setMapPovit(-100, 0, 1);
    },

    onClick: function onClick() {
        //cc.audioEngine.playMusic('resources/sound/bg', true);
        this.abc.play();
        //cc.loader.loadRes('sound/bg', cc.AudioClip, function (err, clip) {
        //    cc.audioEngine.playMusic('resources/sound/bg.mp3');
        //    cc.log('ppp: ', err, clip);
        //});
        this._roundNum.setRound(this.edit.string);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        cc.log(this.abc.isPlaying);
    }
});

cc._RFpop();