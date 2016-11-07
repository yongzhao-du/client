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
        // ..
        messageLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._uiCtrl = this.getComponent('ui_ctrl');
        var args = this._uiCtrl.args;
        this._callback = args.callback;
        this.messageLabel.string = args.message;
    },
    
    onButtonClick: function (event) {
        GameUtil.playButtonSound();
        this._uiCtrl.close();
        if (typeof(this._callback) === 'function') {
            var name = event.target.name;
            if (name === 'ok_button') {
                this._callback(0);
            } else if (name === 'cancel_button') {
                this._callback(1);
            }
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
