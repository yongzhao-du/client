cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        this._touchStart = this.node.on(cc.Node.EventType.TOUCH_START, function () {}, this.node);
        this._touchMove = this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {}, this.node);
        this._touchEnd = this.node.on(cc.Node.EventType.TOUCH_END, function () {}, this.node);
        this._touchCancel = this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {}, this.node);
        this._mouseEnter = this.node.on(cc.Node.EventType.MOUSE_ENTER, function () {}, this.node);
        this._mouseLeave = this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {}, this.node);
        this._mouseDown = this.node.on(cc.Node.EventType.MOUSE_DOWN, function () {}, this.node);
        this._mouseMove = this.node.on(cc.Node.EventType.MOUSE_MOVE, function () {}, this.node);
        this._mouseUp = this.node.on(cc.Node.EventType.MOUSE_UP, function () {}, this.node);
        this._mouseWhell = this.node.on(cc.Node.EventType.MOUSE_WHEEL, function () {}, this.node);
    },
    
    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this.node);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this.node);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this.node);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchCancel, this.node);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._mouseEnter, this.node);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._mouseLeave, this.node);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this.node);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this._mouseMove, this.node);
        this.node.off(cc.Node.EventType.MOUSE_UP, this._mouseUp, this.node);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._mouseWhell, this.node);
    }
});
