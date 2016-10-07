"use strict";
cc._RFpush(module, 'b077ehJPOBD3KdVxs3tlb1I', 'game_rpc');
// script\network\game_rpc.js

var GameProtocol = require("game_protocol");

var Srv2Clt = {
    retLogin: function retLogin(json) {
        cc.log("retLogin:" + json.data.errorMsg);
        if (json.code === 1) Global.loginModule.token = json.data.token;
        Global.gameEventDispatcher.emit(GameEvent.ON_LOGIN_RESULT, json);
    },

    retGetGameData: function retGetGameData(json) {
        cc.log("retGetGameData:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.isVip = json.data.isVIP;
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.scoreNum = json.data.scoreNum;
            Global.accountModule.nickName = json.data.nikename;
            Global.accountModule.isFirstLogin = json.data.isFirst;
            Global.accountModule.maxScore = json.data.maxScore;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.accountModule.exchangeRate = json.data.oneIntegralGoldNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_GET_GAME_DATA);
        }
    }
};
module.exports.Srv2Clt = Srv2Clt;

var Clt2Srv = {
    login: function login(account, passwd) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.LOGIN,
            account: account,
            password: passwd
        }, Srv2Clt.retLogin);
    },

    getGameData: function getGameData() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.GET_DATA,
            token: Global.loginModule.token
        }, Srv2Clt.retGetGameData);
    }
};
module.exports.Clt2Srv = Clt2Srv;

cc._RFpop();