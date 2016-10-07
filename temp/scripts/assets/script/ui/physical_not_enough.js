"use strict";
cc._RFpush(module, 'db18fVEcatGl6tf5AyYtOQh', 'physical_not_enough');
// script\ui\physical_not_enough.js

cc.Class({
    'extends': cc.Component,

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
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
    },

    onBuyButtonClick: function onBuyButtonClick() {
        this._uiCtrl.close();
        var coin = Global.accountModule.goldNum;
        if (Global.accountModule.goldNum < 50) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            cc.log('buy physical');
        }
    },

    onCancelButtonClick: function onCancelButtonClick() {
        this._uiCtrl.close();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();