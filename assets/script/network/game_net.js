const HttpConnection = require('http_connection').class
const HttpUtil = require('http_util')
const GameProtocol = require('game_protocol')

module.exports.class = cc.Class({

    ctor: function () {
        this._httpReauestInfo = null;
        this._httpHandlers = {};
        this._httpConnection = new HttpConnection();
        this._httpConnection.setCipherCode('fwe^*&3ijcdhf45543');
        this._httpConnection.setRespondCallback(this.httpRespond.bind(this));
    },
    
    retryHttpRequest: function () {
        if (!this._httpReauestInfo)
            return;
        this.httpRequest(this._httpReauestInfo.data, this._httpReauestInfo.callback);
    },
    
    httpRequest: function (data, callback) {
        Global.gameEventDispatcher.emit(GameEvent.ON_HTTP_REQUEST);
        var self = this;
        var protocolId = data.gameMsgId;
        var url = GameProtocol.URLs[protocolId];
        this.addHttpRespondListener(protocolId, function (json) {
    		self.removeHttpRespondListener(protocolId)
    		self._httpReauestInfo = null;
    		if (typeof(callback) === "function")
    			callback(json)
    	});
    	this._httpReauestInfo = { data: data, callback: callback }
    	this._httpConnection.request(url, data);
    },
    
    httpRespond: function (stats, json) {
        Global.gameEventDispatcher.emit(GameEvent.ON_HTTP_RESPOND);
        if (stats == HttpUtil.Stats.OK) {
            cc.log('game net code', json.code);
            if (json.code === 6) {
                Global.gameEventDispatcher.emit(GameEvent.ON_LOGIN_TIME_OUT);
                this.removeHttpRespondListener(this._httpReauestInfo.data.gameMsgId)
            } else {
                var handler = this._httpHandlers[json.data.gameMsgId];
                handler && handler(json);
            }
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_NETWORK_ERROR);
            this.removeHttpRespondListener(this._httpReauestInfo.data.gameMsgId)
        }
    },
    
    addHttpRespondListener: function (protocolId, handler) {
        this._httpHandlers[protocolId] = handler;
    },
    
    removeHttpRespondListener: function (protocolId, handler) {
        this._httpHandlers[protocolId] = null;
    },
    
});
