"use strict";
cc._RFpush(module, '50316CDRwtLV7cYFQQ0CXLQ', 'game_util');
// script\util\game_util.js

module.exports = {

    loadScene: function loadScene(name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    },

    playButtonSound: function playButtonSound() {
        cc.loader.loadRes("sound/button_click", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        });
    }

};

cc._RFpop();