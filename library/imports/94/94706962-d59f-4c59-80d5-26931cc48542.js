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
        floatMessageContainer: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._messageHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_FLOAT_MESSAGE, this.onMessage.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._messageHandler);
        this._messageHandler = null;
    },

    onMessage: function onMessage(eventType, message) {
        cc.log(message);
        var node = new cc.Node();

        var label = node.addComponent(cc.Label);
        label.string = message;

        var action = new cc.Sequence(new cc.Spawn(new cc.MoveBy(1, new cc.Vec2(0, 100)), new cc.FadeOut(1)), new cc.CallFunc(function () {
            node.destroy();
        }));

        node.parent = this.floatMessageContainer;
        node.runAction(action);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },