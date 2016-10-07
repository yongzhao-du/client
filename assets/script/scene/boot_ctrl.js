cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this._loadedScene = false;
    },
    
    update: function (dt) {
        if (Global.initted && !this._loadedScene) {
            this._loadedScene = true;
            GameUtil.loadScene("loading");
        }
    },
});
