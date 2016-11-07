const exchangePoints = [1, 6, 38, 98, 588, 1688];

cc.Class({
    extends: cc.Component,

    properties: {
        goldLabel: cc.Label,
        ownLabel: cc.Label,
        rateLabel: cc.Label,
        itemContent: cc.Node,
        itemPrefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._exchangeRate = Global.accountModule.exchangeRate;
        this._ownPoint = Global.accountModule.scoreNum;
        
        this.rateLabel.string = cc.js.formatStr(GameLang.t('exchange_format'), 1, this._exchangeRate);
        this.ownLabel.string = cc.js.formatStr(GameLang.t('own_point_format'), this._ownPoint);
        this.goldLabel.string = cc.js.formatStr(GameLang.t('own_gold_num_format_2'), Global.accountModule.goldNum);
    
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
    },

    onDestroy: function () {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        this._exchangeHandler = null;
    },
    
    start: function () {
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
    
    onExchangeSuccess: function (event) {
        this._uiCtrl.close();
    },

    onItemExchangeButtonClick: function (event) {
        GameUtil.playButtonSound();
        var self = this;
        var target = event.target;
        var point = exchangePoints[target.tag];
        var coin = point * this._exchangeRate;
        var data = {
            message: cc.js.formatStr(GameLang.t('confirm_exchange_coin'), point, coin),
            callback: function (buttonId) {
                if (buttonId === 0) {
                    GameRpc.Clt2Srv.exchangeGold(coin);
                }
            }
        };
        this._uiCtrl.manager.openUI('message_box', data);
    },
    
    onCloseButtonClick: function () {
        GameUtil.playButtonSound();
        this._uiCtrl.close();
    }

});
