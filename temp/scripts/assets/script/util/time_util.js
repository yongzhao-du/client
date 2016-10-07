"use strict";
cc._RFpush(module, '112abazdXJHF5AmYtCto2gs', 'time_util');
// script\util\time_util.js

function fillZero(value) {
    return value > 9 ? value.toString() : '0' + value.toString();
}

module.exports = {

    secToMS: function secToMS(sec) {
        var s = sec % 60;
        var m = (sec - s) / 60;
        var ret = cc.js.formatStr("%s:%s", fillZero(m), fillZero(s));
        return ret;
    },

    secToHMS: function secToHMS(sec) {
        var t = sec % 3600;
        var h = (sec - t) / 3600;
        var s = t % 60;
        var m = (t - s) / 60;
        var ret = cc.js.formatStr("%s:%s:%s", fillZero(h), fillZero(m), fillZero(s));
        return ret;
    }

};

cc._RFpop();