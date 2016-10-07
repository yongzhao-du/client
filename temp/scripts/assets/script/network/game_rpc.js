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
    },

    retExchangeGold: function retExchangeGold(json) {
        cc.log("retExchangeGold:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.scoreNum = json.data.scoreNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_EXCHANGE_GOLD);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retStartGame: function retStartGame(json) {
        cc.log("retStartGame:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.maxScore = json.data.maxScore;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.gameEventDispatcher.emit(GameEvent.ON_START_GAME);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retBuyFullPhysical: function retBuyFullPhysical(json) {
        cc.log("retBuyFullPhysical:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.gameEventDispatcher.emit(GameEvent.ON_BUY_PHYSICAL);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retBuyTimeToPlayGame: function retBuyTimeToPlayGame(json) {
        cc.log("retBuyTimeToPlayGame:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_BUY_TIME_TO_PLAY);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retGameResult: function retGameResult(json) {
        cc.log("retGameResult:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.maxScore = json.data.maxScore;
            Global.gameEventDispatcher.emit(GameEvent.ON_GAME_RESULT);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
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
    },

    exchangeGold: function exchangeGold(gold) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.EXCHANGE_GOLD,
            token: Global.loginModule.token,
            needGold: gold
        }, Srv2Clt.retExchangeGold);
    },

    startGame: function startGame() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.START_GAME,
            token: Global.loginModule.token
        }, Srv2Clt.retStartGame);
    },

    buyFullPhysical: function buyFullPhysical() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.FULL_POWER,
            token: Global.loginModule.token
        }, Srv2Clt.retBuyFullPhysical);
    },

    buyTimeToPlayGame: function buyTimeToPlayGame(times) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.CONTINUE_GAME,
            token: Global.loginModule.token,
            level: times
        }, Srv2Clt.retBuyTimeToPlayGame);
    },

    gameResult: function gameResult(score) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.CONTINUE_GAME,
            token: Global.loginModule.token,
            score: score
        }, Srv2Clt.retGameResult);
    }
};
module.exports.Clt2Srv = Clt2Srv;

cc._RFpop();