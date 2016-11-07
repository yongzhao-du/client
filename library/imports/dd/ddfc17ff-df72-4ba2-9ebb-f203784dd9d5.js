var SyncTimer = require('sync_timer')['class'];
var GameNet = require('game_net')['class'];
var GameEventDispatcher = require("game_event_dispatcher")['class'];

window.GameUtil = require('game_util');
window.TimeUtil = require('time_util');

window.GameLang = require('i18n');
window.GameRpc = require('game_rpc');
window.GameEvent = require('game_event');

window.Global = {};
Global.initted = false;

cc.Class({
    'extends': cc.Component,

    onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    onDestroy: function onDestroy() {},

    update: function update(dt) {
        if (!Global.initted) this.init();else this.gameUpdate(dt);
    },

    init: function init() {
        Global.gameType = 41;
        Global.syncTimer = new SyncTimer();
        Global.gameNet = new GameNet();
        Global.gameEventDispatcher = new GameEventDispatcher();

        var guideStep = cc.sys.localStorage.getItem("guide_mask");
        if (!guideStep) guideStep = 0;
        Global.guideStep = guideStep;

        Global.initted = true;
    },

    gameUpdate: function gameUpdate(dt) {
        Global.syncTimer.update(dt);
    }
});