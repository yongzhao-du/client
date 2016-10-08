var exchangePoints = [1, 6, 38, 98, 588, 1688];

cc.Class({
    'extends': cc.Component,

    properties: {
        ownLabel: cc.Label,
        rateLabel: cc.Label,
        itemContent: cc.Node,
        itemPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._exchangeRate = Global.accountModule.exchangeRate;
        this._ownPoint = Global.accountModule.scoreNum;

        this.rateLabel.string = cc.js.formatStr(GameLang.t('exchange_format'), 1, this._exchangeRate);
        this.ownLabel.string = cc.js.formatStr(GameLang.t('own_point_format'), this._ownPoint);

        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        this._exchangeHandler = null;
    },

    start: function start() {
        for (var i = 0; i < exchangePoints.length; i++) {
            var node = cc.instantiate(this.itemPrefab);

            var label = node.getComponentInChildren(cc.Label);
            var point = exchangePoints[i];
            label.string = cc.js.formatStr(GameLang.t('exchange_format'), point, point * this._exchangeRate);

            var button = node.getComponentInChildren(cc.Button);
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this;
            eventHandler.component = "exchange_coin";
            eventHandler.handler = "onItemExchangeButtonClick";
            button.node.tag = i;
            button.clickEvents.push(eventHandler);

            node.parent = this.itemContent;
        }
    },

    onExchangeSuccess: function onExchangeSuccess(event) {
        this._uiCtrl.close();
    },

    onItemExchangeButtonClick: function onItemExchangeButtonClick(event) {
        var self = this;
        var target = event.target;
        var point = exchangePoints[target.tag];
        var coin = point * this._exchangeRate;
        var data = {
            message: cc.js.formatStr(GameLang.t('confirm_exchange_coin'), point, coin),
            callback: function callback(buttonId) {
                if (buttonId === 0) {
                    GameRpc.Clt2Srv.exchangeGold(coin);
                }
            }
        };
        this._uiCtrl.manager.openUI('message_box', data);
    },

    onCloseButtonClick: function onCloseButtonClick() {
        this._uiCtrl.close();
    }

});