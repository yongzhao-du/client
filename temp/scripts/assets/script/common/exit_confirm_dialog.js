"use strict";
cc._RFpush(module, 'd1e26DmA05JhLV/WuDVuNiE', 'exit_confirm_dialog');
// script\common\exit_confirm_dialog.js

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

    onOkButtonClick: function onOkButtonClick() {
        cc.director.end();
    },

    onCancelButtonClick: function onCancelButtonClick() {
        this.node.destroy();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();