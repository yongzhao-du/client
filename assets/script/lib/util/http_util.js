const Method = {
    GET: 'GET',
    POST: 'POST',
};

const Stats = {
    OK: 0,
    FAIL: 1,
};

module.exports.Method = Method;

module.exports.Stats = Stats;

module.exports.request = function (url, method, args, callback) {
    var success = true;
    
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        cc.log('onreadystatechange')
        var response = xhr.responseText;
        if (typeof(callback) === 'function') {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                callback(Stats.OK, response);
            } else {
                callback(Stats.FAIL);
            }
        }
    };
    
    var isFirst = true;
    var argString = '';
    for (var key in args) {
        if (isFirst) {
            argString += key + "=" + args[key];
            isFirst = false;
        } else {
            argString += '&' + key + '=' + args[key];
        }
    }
    
    if (method === Method.GET) {
        if (argString.length === 0)
            xhr.open(method, url, true);
        else
            xhr.open(method, url + argString, true);
    } else if (method === Method.POST) {
        xhr.open(method, url, true);
    }
    if (cc.sys.isNative)
        xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
    
    ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
        xhr["on" + eventname] = function () {
            cc.log("\nEvent : " + eventname);
            if (eventname === 'error') {
                success = false;
            } else if (eventname === 'loadend' && !success) {
                callback(Stats.FAIL);
            }
        };
    });
    
   if (method === Method.GET) {
        xhr.send();
    } else if (method === Method.POST) {
        xhr.send(argString);
    }
};

