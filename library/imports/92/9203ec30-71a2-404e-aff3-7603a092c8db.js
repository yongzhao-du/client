cc.Class({
    "extends": cc.Component,

    properties: {
        loadingPrefab: {
            "default": null,
            type: cc.Prefab
        },

        errorPrefab: {
            "default": null,
            type: cc.Prefab
        },

        loginTimeOutPrefab: {
            "default": null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._requestHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_REQUEST, this.onEvent.bind(this));
        this._respondHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_RESPOND, this.onEvent.bind(this));
        this._networkErrorHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_NETWORK_ERROR, this.onEvent.bind(this));
        this._loginTimeOutHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_LOGIN_TIME_OUT, this.onEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._requestHandler);
        Global.gameEventDispatcher.removeEventHandler(this._respondHandler);
        Global.gameEventDispatcher.removeEventHandler(this._networkErrorHandler);
        Global.gameEventDispatcher.removeEventHandler(this._loginTimeOutHandler);
        this._requestHandler = null;
        this._respondHandler = null;
        this._networkErrorHandler = null;
        this._loginTimeOutHandler = null;
    },

    onEvent: function onEvent(eventType, data) {
        switch (eventType) {
            case GameEvent.ON_HTTP_REQUEST:
                this.showLoading(true);
                cc.log("on http request");
                break;

            case GameEvent.ON_HTTP_RESPOND:
                this.showLoading(false);
                cc.log("on http respond");
                break;

            case GameEvent.ON_NETWORK_ERROR:
                this.showError();
                cc.log("on network error");
                break;

            case GameEvent.ON_LOGIN_TIME_OUT:
                this.showLoginTimeOut();
                cc.log("on login time out");
                break;

            default:
                break;
        }
    },

    showLoginTimeOut: function showLoginTimeOut() {
        var panel = cc.instantiate(this.loginTimeOutPrefab);
        this.node.addChild(panel);
    },

    showError: function showError() {
        var panel = cc.instantiate(this.errorPrefab);
        this.node.addChild(panel);
    },

    showLoading: function showLoading(value) {
        this.removeLoading();
        if (value) {
            var panel = cc.instantiate(this.loadingPrefab);
            this.node.addChild(panel);
            this._loadingPanel = panel;
        }
    },

    removeLoading: function removeLoading() {
        if (this._loadingPanel) {
            this._loadingPanel.removeFromParent();
            //this._loadingPanel.destroy();
            this._loadingPanel = null;
        }
    }
});