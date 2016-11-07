"use strict";
cc._RFpush(module, 'ccb50oTVjlMTr4a+e8gmV+b', 'mission_fail');
// script\ui\result\mission_fail.js

var timesMapCoin = [10, 30, 50];

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
        returnButton: cc.Node,
        killLabel: cc.Label,
        roundLabel: cc.Label,
        maxKillLabel: cc.Label,
        maxRoundLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._killNum = this._uiCtrl.args.killNum;
        this._roundNum = this._uiCtrl.args.roundNum;

        this.killLabel.string = this._killNum.toString();
        this.roundLabel.string = this._roundNum.toString();

        var maxScore = Global.accountModule.maxScore.toString();
        cc.log('maxScore', maxScore);
        var i = maxScore.length;
        for (; i >= 0; i--) {
            if (maxScore.charAt(i) === '0') break;
        }
        var maxKill = parseInt(maxScore.substring(0, i)) - 1;
        var maxRound = maxScore.substring(i + 1, maxScore.length);

        this.maxKillLabel.string = maxKill.toString();
        this.maxRoundLabel.string = maxRound;
    },

    start: function start() {
        cc.loader.loadRes("sound/4", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playMusic(audioClip, false);
        });
    },

    onDestroy: function onDestroy() {},

    onReturnButtonClick: function onReturnButtonClick() {
        GameUtil.playButtonSound();
        this._uiCtrl.close();
        Global.gameEventDispatcher.emit(GameEvent.ON_RETURN_GAME);
    }
});

cc._RFpop();