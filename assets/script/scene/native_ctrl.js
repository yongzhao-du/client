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
        pausePanel: cc.Prefab,
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
        
        this._hideCall = function () {
            cc.log("hide");
            if (self.pausePanel && !cc.director.isPaused()) {
                self.showPauseFace();
            }
        }
        
        cc.game.on(cc.game.EVENT_HIDE, this._hideCall);
    },
    
    onDestroy: function () {
        cc.game.off(cc.game.EVENT_HIDE, this._hideCall);
    },

    showPauseFace: function () {
        if (this._pauseFace)
            return;
            
        var panel = cc.instantiate(this.pausePanel);
        var component = panel.getComponent("pause_panel");
        component.setNativeCtrl(this);
        
        this.node.addChild(panel);
        this._pauseFace = panel;
    },
    
    removePauseFace: function () {
        if (this._pauseFace && this._pauseFace.isValid) {
            this._pauseFace.removeFromParent();
            this._pauseFace.destroy();
            this._pauseFace = null;
        }
    },

    showExitDialog: function () {
        if (this._exitDialog)
            return;
            
        var dialog = cc.instantiate(this.exitDialog);
        var component = dialog.getComponent("exit_confirm_dialog")
        component.setNativeCtrl(this);
        component.setIsBattle(this.node.getComponent('battle_ctrl') !== null)
        
        this.node.addChild(dialog);
        this._exitDialog = dialog;
    },
    
    removeExitDialog: function () {
        if (this._exitDialog && this._exitDialog.isValid) {
            this._exitDialog.removeFromParent();
            this._exitDialog.destroy();
            this._exitDialog = null;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
