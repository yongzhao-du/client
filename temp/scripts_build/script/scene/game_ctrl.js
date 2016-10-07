"use strict";
cc._RFpush(module, '1d68dWIyGZFpIsIIJ1XAG0t', 'game_ctrl');
// script\scene\game_ctrl.js

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
        physicalNodes: {
            'default': [],
            type: [cc.Node]
        },

        countDownLabel: {
            'default': null,
            type: cc.Label
        },

        coinLabel: {
            'default': null,
            type: cc.Label
        },

        maxPhysical: 5,
        chargePhysicalTime: 600
    },

    onLoad: function onLoad() {
        this._uiManager = this.node.getComponent('ui_manager');
        this._physicalPoints = [];
        for (var i = 0; i < this.physicalNodes.length; i++) {
            var node = this.physicalNodes[i];
            this._physicalPoints.push(node.getComponent('physical_point'));
        }

        this._countDownTime = 0;
        this.updateCountDown();

        this._physical = 0;
        this.updatePhysical();

        this._countting = false;

        this._onCountDown = function () {
            this.onCountDown();
        };

        this._getGameDataHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GET_GAME_DATA, this.onGetGameData.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._getGameDataHandler);
        this._getGameDataHandler = null;
    },

    start: function start() {
        GameRpc.Clt2Srv.getGameData();
    },

    resetCountDown: function resetCountDown() {
        this.stopCountDown();
        this.startCountDown(Global.accountModule.nextPowerTime);
    },

    startCountDown: function startCountDown(time) {
        if (this._countting) return;
        this._countting = true;
        this._countDownTime = time;
        this.updateCountDown();
        this.schedule(this._onCountDown, 1);
    },

    stopCountDown: function stopCountDown() {
        if (!this._countting) return;
        this._countting = false;
        this.unschedule(this._onCountDown);
    },

    updateCountDown: function updateCountDown() {
        this.countDownLabel.string = TimeUtil.secToMS(this._countDownTime);
    },

    updatePhysical: function updatePhysical() {
        var i = 0;
        for (; i < this._physical; i++) this._physicalPoints[i].state = 0;
        for (; i < this.maxPhysical; i++) this._physicalPoints[i].state = 1;
    },

    chargePhysical: function chargePhysical() {
        if (this._physical >= this.maxPhysical) return;
        this._physical++;
        this.updatePhysical();
    },

    costPhysical: function costPhysical() {
        if (this._physical <= 0) return false;
        this._physical--;
        this.updatePhysical();
        return true;
    },

    onCountDown: function onCountDown() {
        this._countDownTime--;
        if (this._countDownTime < 0) this._countDownTime = 0;
        if (this._countDownTime === 0) {
            this.chargePhysical();
            if (this._physical < this.maxPhysical) {
                this._countDownTime = this.chargePhysicalTime;
            } else {
                this.stopCountDown();
            }
        }
        this.updateCountDown();
    },

    onGetGameData: function onGetGameData() {
        this.coinLabel.string = Global.accountModule.goldNum;
        this._physical = Global.accountModule.power;
        this.updatePhysical();
        this.resetCountDown();
    },

    onPlayButtonClick: function onPlayButtonClick() {
        if (this.costPhysical()) {
            this.stopCountDown();
            GameUtil.loadScene('battle');
        } else {
            // 体力不足
        }
    }
});

cc._RFpop();