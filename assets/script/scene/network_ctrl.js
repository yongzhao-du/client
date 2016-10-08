cc.Class({
    extends: cc.Component,

    properties: {
        loadingPrefab: {
            default: null,
            type: cc.Prefab,
        },
        
        errorPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        this._requestHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_REQUEST, this.onEvent.bind(this));
        this._respondHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_RESPOND, this.onEvent.bind(this));
        this._networkErrorHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_NETWORK_ERROR, this.onEvent.bind(this));
    },
    
    onDestroy: function () {
        Global.gameEventDispatcher.removeEventHandler(this._requestHandler);
        Global.gameEventDispatcher.removeEventHandler(this._respondHandler);
        Global.gameEventDispatcher.removeEventHandler(this._networkErrorHandler);
        this._requestHandler = null;
        this._respondHandler = null;
        this._networkErrorHandler = null;
    },
    
    onEvent: function (eventType, data) {
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
                
            default:
                break;
        }
    },
    
    showError: function () {
        var panel = cc.instantiate(this.errorPrefab);
        this.node.addChild(panel);
    },
    
    showLoading: function (value) {
        this.removeLoading();
        if (value) {
            var panel = cc.instantiate(this.loadingPrefab);
            this.node.addChild(panel);
            this._loadingPanel = panel;
        }
    },
    
    removeLoading: function () {
        if (this._loadingPanel) {
            this._loadingPanel.removeFromParent();
            //this._loadingPanel.destroy();
            this._loadingPanel = null;
        }
    }
});
