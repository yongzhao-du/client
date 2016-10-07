"use strict";
cc._RFpush(module, 'ccb50oTVjlMTr4a+e8gmV+b', 'mission_fail');
// script\ui\result\mission_fail.js

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

    onRetryButtonClick: function onRetryButtonClick() {
        Global.gameEventDispatcher.emit(GameEvent.ON_RETRY_GAME);
        this._uiCtrl.close();
    },

    onReturnButtonClick: function onReturnButtonClick() {
        Global.gameEventDispatcher.emit(GameEvent.ON_RETURN_GAME);
        this._uiCtrl.close();
    }
});

cc._RFpop();