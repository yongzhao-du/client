function fillZero (value) {
    return value > 9 ? value.toString() : '0' + value.toString();
}

module.exports = {
    
    secToMS: function (sec) {
        var s = sec % 60;
        var m = (sec - s) / 60;
		var ret = cc.js.formatStr("%s:%s", fillZero(m), fillZero(s));
		return ret;
    },
    
    secToHMS: function (sec) {
        var t = sec % 3600;
		var h = (sec - t) / 3600;
		var s = t % 60;
		var m = (t - s) / 60;
		var ret = cc.js.formatStr("%s:%s:%s", fillZero(h), fillZero(m), fillZero(s))
		return ret
    },
    
}
