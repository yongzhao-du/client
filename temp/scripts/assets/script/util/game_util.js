"use strict";
cc._RFpush(module, '50316CDRwtLV7cYFQQ0CXLQ', 'game_util');
// script\util\game_util.js

module.exports = {

    loadScene: function loadScene(name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    }

};

cc._RFpop();