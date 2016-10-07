var HttpUtil = require("http_util");
var XXTEA = require("xxtea");

module.exports["class"] = cc.Class({
    ctor: function ctor() {
        this._cipherCode = 'q1w2e3r4t5y6u7i8o9p0';
        this._respondCallback = null;
    },

    setCipherCode: function setCipherCode(code) {
        this._cipherCode = code;
    },

    setRespondCallback: function setRespondCallback(callback) {
        if (typeof callback === 'function') this._respondCallback = callback;
    },

    request: function request(url, data) {
        var json = XXTEA.utf16to8(JSON.stringify(data).trim());
        var encrypt = XXTEA.encrypt(json, this._cipherCode);
        var encode = XXTEA.base64encode(encrypt);
        encode = encode.replace(/\+/g, '%2B');
        HttpUtil.request(url, HttpUtil.Method.POST, { msgData: encode }, this.respond.bind(this));
    },

    respond: function respond(stats, response) {
        if (this._respondCallback) {
            if (stats == HttpUtil.Stats.OK) {
                var json = JSON.parse(response);
                var decode = XXTEA.base64decode(json.msgData);
                var decrypt = XXTEA.decrypt(decode, this._cipherCode);
                var content = JSON.parse(decrypt);
                this._respondCallback(stats, { code: json.ResultCode, data: content });
            } else if (stats == HttpUtil.Stats.FAIL) {
                this._respondCallback(stats);
            }
        }
    }
});