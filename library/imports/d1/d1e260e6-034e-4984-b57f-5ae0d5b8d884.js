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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    start: function start() {
        if (this._isBattle) {
            cc.director.pause();
        }
    },

    setNativeCtrl: function setNativeCtrl(nativeCtrl) {
        this._nativeCtrl = nativeCtrl;
    },

    setIsBattle: function setIsBattle(value) {
        this._isBattle = value;
    },

    onOkButtonClick: function onOkButtonClick() {
        GameUtil.playButtonSound();
        cc.director.end();
    },

    onCancelButtonClick: function onCancelButtonClick() {
        GameUtil.playButtonSound();
        if (this._isBattle) {
            cc.director.resume();
        }
        if (this._nativeCtrl) {
            this._nativeCtrl.removeExitDialog();
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },