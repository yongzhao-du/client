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
        retryCountLabel: cc.Label,
        needCoinLabel: cc.Label,
        goldCountLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = 3 - this._uiCtrl.args.retryCount;
        this._killNum = this._uiCtrl.args.killNum;
        this._roundNum = this._uiCtrl.args.roundNum;
        /*if (this._retryCount >= 3) {
            this.retryButton.active = false;
            this.returnButton.x = 0;*/
        var needCoin = timesMapCoin[this._retryCount];
        this.retryCountLabel.string = this._uiCtrl.args.retryCount.toString();
        this.goldCountLabel.string = cc.js.formatStr(GameLang.t('own_gold_num_format'), Global.accountModule.goldNum);
        this.needCoinLabel.string = needCoin.toString();
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
        this._continueHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_TIME_TO_PLAY, this.onContinueGame.bind(this));
        this._resultHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GAME_RESULT, this.onResultGame.bind(this));
    },

    onDestroy: function () {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        Global.gameEventDispatcher.removeEventHandler(this._continueHandler);
        Global.gameEventDispatcher.removeEventHandler(this._resultHandler);
        this._resultHandler = null;
        this._exchangeHandler = null;
        this._continueHandler = null;
    },

    onExchangeSuccess: function () {
        var needCoin = timesMapCoin[this._retryCount];
        if (Global.accountModule.goldNum >= needCoin) {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },

    onResultGame: function () {
        this._uiCtrl.close();
        this._uiCtrl.manager.openUI('mission_fail', { killNum: this._killNum, roundNum: this._roundNum });
    },

    onContinueGame: function () {
        this._uiCtrl.close();
    },

    onRetryButtonClick: function () {
        GameUtil.playButtonSound();
        var needCoin = timesMapCoin[this._retryCount];
        var ownCoin = Global.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },
    
    onReturnButtonClick: function () {
        GameUtil.playButtonSound();
        var maxScore = parseInt((this._killNum + 1) + "0" + this._roundNum);
        GameRpc.Clt2Srv.gameResult(maxScore);
    }
});
