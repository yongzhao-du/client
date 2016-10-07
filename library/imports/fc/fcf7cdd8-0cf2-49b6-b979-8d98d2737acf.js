var _URLs;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Protocol = {
    LOGIN: 1,
    GET_DATA: 2,
    EXCHANGE_GOLD: 3,
    START_GAME: 4,
    FULL_POWER: 5,
    CONTINUE_GAME: 6,
    RESULT_GAME: 7
};
module.exports.Protocol = Protocol;

var URLs = (_URLs = {}, _defineProperty(_URLs, Protocol.LOGIN, "http://youxi.egatewang.cn/index/login"), _defineProperty(_URLs, Protocol.GET_DATA, "http://youxi.egatewang.cn/Shourenlaile/index?type=getGameData"), _defineProperty(_URLs, Protocol.EXCHANGE_GOLD, "http://youxi.egatewang.cn/index/exchange"), _defineProperty(_URLs, Protocol.START_GAME, "http://youxi.egatewang.cn/Shourenlaile/index?type=startGame"), _defineProperty(_URLs, Protocol.FULL_POWER, "http://youxi.egatewang.cn/Shourenlaile/index?type=buyFullPower"), _defineProperty(_URLs, Protocol.CONTINUE_GAME, "http://youxi.egatewang.cn/Shourenlaile/index?type=buyTimeToPlayGame"), _defineProperty(_URLs, Protocol.RESULT_GAME, "http://youxi.egatewang.cn/Shourenlaile/index?type=gameResult"), _URLs);
module.exports.URLs = URLs;