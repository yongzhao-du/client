var ControlDefine = require("control_define");
var ControlKey = ControlDefine.ControlKey;

cc.Class({
    "extends": cc.Component,

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

        attackA: {
            "default": null,
            type: cc.Node
        },

        attackB: {
            "default": null,
            type: cc.Node
        },

        actionTime: 0.1
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    setPlayer: function setPlayer(player) {
        this._playerCtrl = player;
    },

    onTouchStart: function onTouchStart(event) {
        this.doStartStaff();
        if (this._playerCtrl) this._playerCtrl.keyDown(ControlKey.HIT);
    },

    onTouchEnd: function onTouchEnd(event) {
        this.doEndStaff();
        //this._playerCtrl.keyDown(ControlKey.HIT);
        if (this._playerCtrl) this._playerCtrl.keyUp(ControlKey.HIT);
    },

    onTouchCancel: function onTouchCancel(event) {
        this.doEndStaff();
        if (this._playerCtrl) this._playerCtrl.keyUp(ControlKey.HIT);
    },

    doStartStaff: function doStartStaff() {
        this.attackA.stopAllActions();
        this.attackA.opacity = 255;
        var action = new cc.FadeOut(this.actionTime);
        this.attackA.runAction(action);
    },

    doEndStaff: function doEndStaff() {
        this.attackA.stopAllActions();
        this.attackA.opacity = 0;
        var time = (255 - this.attackA.opacity) / 255 * this.actionTime;
        var action = new cc.FadeIn(this.actionTime);
        this.attackA.runAction(action);
    }
});