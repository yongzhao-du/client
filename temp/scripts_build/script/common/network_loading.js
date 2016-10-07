"use strict";
cc._RFpush(module, '9203ewwcaJATq/zdgOgksjb', 'network_loading');
// script\common\network_loading.js

cc.Class({
    "extends": cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        this._requestHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_REQUEST, this.onEvent.bind(this));
        this._respondHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_RESPOND, this.onEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._requestHandler);
        Global.gameEventDispatcher.removeEventHandler(this._respondHandler);
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

            default:
                break;
        }
    },

    showLoading: function showLoading(value) {
        this.removeLoading();
        if (value) {
            var self = this;
            cc.loader.loadRes("prefab/other/loading_panel", cc.Prefab, function (err, prefab) {
                var panel = cc.instantiate(prefab);
                self.node.addChild(panel);
                self._loadingPanel = panel;
            });
        }
    },

    removeLoading: function removeLoading() {
        if (this._loadingPanel) {
            this._loadingPanel.removeFromParent();
            this._loadingPanel = null;
        }
    }
});

cc._RFpop();