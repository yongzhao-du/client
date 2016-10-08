const timesMapCoin = [10, 30, 50];

cc.Class({
    extends: cc.Component,

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
        retryButton: cc.Node,
        returnButton: cc.Node,
        retryCoinLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = 3 - this._uiCtrl.args.retryCount;
        if (this._retryCount >= 3) {
            this.retryButton.active = false;
            this.returnButton.x = 0;
        } else {
            var needCoin = timesMapCoin[this._retryCount];
            this.retryCoinLabel.string = needCoin;
        }
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
        this._continueHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_TIME_TO_PLAY, this.onContinueGame.bind(this));
    },

    onDestroy: function () {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        Global.gameEventDispatcher.removeEventHandler(this._continueHandler);
        this._exchangeHandler = null;
        this._continueHandler = null;
    },

    onExchangeSuccess: function () {
        var needCoin = timesMapCoin[this._retryCount];
        if (Global.accountModule.goldNum >= needCoin) {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },

    onContinueGame: function () {
        this._uiCtrl.close();
    },

    onRetryButtonClick: function () {
        var needCoin = timesMapCoin[this._retryCount];
        var ownCoin = Global.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },
    
    onReturnButtonClick: function () {
        this._uiCtrl.close();
        Global.gameEventDispatcher.emit(GameEvent.ON_RETURN_GAME);
    }
});
