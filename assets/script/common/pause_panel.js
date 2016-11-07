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
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this._touchEnd = this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (self._nativeCtrl) {
                self._nativeCtrl.removePauseFace();
                cc.director.resume();
            }
        }, this.node);
        
        this._mouseUp = this.node.on(cc.Node.EventType.MOUSE_UP, function () {
            if (self._nativeCtrl) {
                self._nativeCtrl.removePauseFace();
                cc.director.resume();
            }
        }, this.node);
    },
    
    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this.node);
        this.node.off(cc.Node.EventType.MOUSE_UP, this._mouseUp, this.node);  
    },
    
    start: function () {
        cc.director.pause();
    },
    
    setNativeCtrl: function (nativeCtrl) {
        this._nativeCtrl = nativeCtrl;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
