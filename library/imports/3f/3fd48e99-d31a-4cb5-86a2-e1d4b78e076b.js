var ControlDefine = require("control_define");
var ControlKey = ControlDefine.ControlKey;

cc.Class({
    "extends": cc.Component,

    properties: {
        background: {
            "default": null,
            type: cc.Node
        },

        stick: {
            "default": null,
            type: cc.Node
        },

        stickMoveRadius: 100,

        stickKickbackTime: 0.3,

        backgroundLowAlpha: 50,

        backgroundHighAlpha: 255,

        backgroundFadeTime: 0.2
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._movePos = new cc.Vec2();
        this._dirction = new cc.Vec2();
        this.background.opacity = this.backgroundLowAlpha;

        this.background.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    setPlayer: function setPlayer(player) {
        this._playerCtrl = player;
    },

    onTouchStart: function onTouchStart(event) {
        this.doStartStaff();
        var location = this.node.convertTouchToNodeSpace(event);
        this.updateStickPosition(location);
    },

    onTouchMove: function onTouchMove(event) {
        var location = this.node.convertTouchToNodeSpace(event);
        this.updateStickPosition(location);
    },

    onTouchEnd: function onTouchEnd(event) {
        this.doEndStaff();
    },

    onTouchCancel: function onTouchCancel(event) {
        this.doEndStaff();
    },

    updateStickPosition: function updateStickPosition(location) {
        var radius = Math.sqrt(Math.pow(location.x, 2) + Math.pow(location.y, 2));
        if (radius > this.stickMoveRadius) {
            var scale = this.stickMoveRadius / radius;
            location.x *= scale;
            location.y *= scale;
        }

        if (location.x === 0 && location.y === 0) {
            this._dirction.x = 0;
            this._dirction.y = 0;
        } else {
            var r = Math.atan2(location.x, location.y);
            var d = Math.floor(180 - r * 180 / Math.PI) - 67.5;
            if (d < 0) d = 360 + d;
            d = Math.floor(d / 45);

            switch (d) {
                case 0:
                    this._dirction.x = 1;
                    this._dirction.y = 0;
                    break;
                case 1:
                    this._dirction.x = 1;
                    this._dirction.y = 1;
                    break;
                case 2:
                    this._dirction.x = 0;
                    this._dirction.y = 1;
                    break;
                case 3:
                    this._dirction.x = -1;
                    this._dirction.y = 1;
                    break;
                case 4:
                    this._dirction.x = -1;
                    this._dirction.y = 0;
                    break;
                case 5:
                    this._dirction.x = -1;
                    this._dirction.y = -1;
                    break;
                case 6:
                    this._dirction.x = 0;
                    this._dirction.y = -1;
                    break;
                case 7:
                    this._dirction.x = 1;
                    this._dirction.y = -1;
                    break;
            }
        }

        this.stick.x = location.x;
        this.stick.y = location.y;

        if (this._playerCtrl) {
            this._dirction.x == 1 ? this._playerCtrl.keyDown(ControlKey.RIGHT) : this._playerCtrl.keyUp(ControlKey.RIGHT);
            this._dirction.x == -1 ? this._playerCtrl.keyDown(ControlKey.LEFT) : this._playerCtrl.keyUp(ControlKey.LEFT);
            this._dirction.y == 1 ? this._playerCtrl.keyDown(ControlKey.UP) : this._playerCtrl.keyUp(ControlKey.UP);
            this._dirction.y == -1 ? this._playerCtrl.keyDown(ControlKey.DOWN) : this._playerCtrl.keyUp(ControlKey.DOWN);
        }
    },

    doStartStaff: function doStartStaff() {
        this.stick.stopAllActions();
        this.background.stopAllActions();
        var time = (this.backgroundHighAlpha - this.background.opacity) / (this.backgroundHighAlpha - this.backgroundLowAlpha) * this.backgroundFadeTime;
        var action = new cc.FadeTo(time, this.backgroundHighAlpha);
        this.background.runAction(action);
    },

    doEndStaff: function doEndStaff() {
        this.background.stopAllActions();
        var time = (this.background.opacity - this.backgroundLowAlpha) / (this.backgroundHighAlpha - this.backgroundLowAlpha) * this.backgroundFadeTime;
        var action = new cc.FadeTo(time, this.backgroundLowAlpha);
        this.background.runAction(action);

        action = new cc.MoveTo(this.stickKickbackTime, 0, 0);
        action.easing(new cc.easeBackOut());
        this.stick.runAction(action);

        this._dirction.x = 0;
        this._dirction.y = 0;

        if (this._playerCtrl) {
            this._playerCtrl.keyUp(ControlKey.RIGHT);
            this._playerCtrl.keyUp(ControlKey.LEFT);
            this._playerCtrl.keyUp(ControlKey.UP);
            this._playerCtrl.keyUp(ControlKey.DOWN);
        }
    },

    getDirection: function getDirection() {
        return this._dirction;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },