const SyncTimer = require('sync_timer').class;
const GameNet = require('game_net').class;
const GameEventDispatcher = require("game_event_dispatcher").class;

window.GameUtil = require('game_util');
window.TimeUtil = require('time_util');

window.GameLang = require('i18n');
window.GameRpc = require('game_rpc');
window.GameEvent = require('game_event');

window.Global = {};
Global.initted = false;

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
    },

    update: function (dt) {
        if (!Global.initted)
            this.init();
        else
            this.gameUpdate(dt);
    },
    
    init: function () {
        Global.gameType = 36;
        Global.syncTimer = new SyncTimer();
        Global.gameNet = new GameNet();
        Global.gameEventDispatcher = new GameEventDispatcher();
        Global.initted = true;
    },
    
    gameUpdate: function (dt) {
        Global.syncTimer.update(dt);
    },
});
