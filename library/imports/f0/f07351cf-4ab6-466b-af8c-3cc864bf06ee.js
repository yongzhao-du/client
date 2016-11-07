cc.Class({
    "extends": cc.Component,

    onLoad: function onLoad() {
        if (cc.sys.platform == cc.sys.WIN32) {
            cc.view.setFrameSize(1136, 640);
        }
        this._loadedScene = false;
    },

    update: function update(dt) {
        if (Global.initted && !this._loadedScene) {
            this._loadedScene = true;
            GameUtil.loadScene("loading");
        }
    }
});