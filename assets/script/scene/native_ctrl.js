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
        exitDialog: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var listener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                cc.log('keyDown: ' + keyCode);
            },
            
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back || keyCode == cc.KEY.escape) {
                    self.showExitDialog();
                }
            }
        }
        // 绑定键盘事件
        cc.eventManager.addListener(listener, this.node);
    },

    showExitDialog: function () {
        this.removeExitDialog();
        var dialog = cc.instantiate(this.exitDialog);
        this.node.addChild(dialog);
        this._exitDialog = dialog;
    },
    
    removeExitDialog: function () {
        if (this._exitDialog) {
            this._exitDialog.removeFromParent();
            this._exitDialog.destroy();
            this._exitDialog = null;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
