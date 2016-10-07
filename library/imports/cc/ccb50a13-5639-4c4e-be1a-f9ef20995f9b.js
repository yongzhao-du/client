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
        retryButton: cc.Node,
        returnButton: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = this._uiCtrl.args.retryCount;
        if (this._retryCount <= 0) {
            retryButton.active = false;
            returnButton.x = 150;
        }
    },

    onRetryButtonClick: function onRetryButtonClick() {
        this._uiCtrl.close();
        var needCoin = timesMapCoin[this._retryCount - 1];
        var ownCoin = GLobal.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            cc.log('do retry');
            Global.gameEventDispatcher.emit(GameEvent.ON_RETRY_GAME);
        }
    },

    onReturnButtonClick: function onReturnButtonClick() {
        this._uiCtrl.close();
        Global.gameEventDispatcher.emit(GameEvent.ON_RETURN_GAME);
    }
});