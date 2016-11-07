var Protocol = {
    LOGIN:          1,
    GET_DATA:       2,
    EXCHANGE_GOLD:  3,
    START_GAME:     4,
    FULL_POWER:     5,
    CONTINUE_GAME:  6,
    RESULT_GAME:    7,
};
module.exports.Protocol = Protocol;
    
var URLs = {
    [Protocol.LOGIN]: "http://youxi.egatewang.cn/index/login",
    [Protocol.GET_DATA]: "http://youxi.egatewang.cn/Daluandou/index?type=getGameData",
    [Protocol.EXCHANGE_GOLD]: "http://youxi.egatewang.cn/index/exchange",
    [Protocol.START_GAME]: "http://youxi.egatewang.cn/Daluandou/index?type=startGame",
    [Protocol.FULL_POWER]: "http://youxi.egatewang.cn/Daluandou/index?type=buyFullPower",
    [Protocol.CONTINUE_GAME]: "http://youxi.egatewang.cn/Daluandou/index?type=buyTimeToPlayGame",
    [Protocol.RESULT_GAME]: "http://youxi.egatewang.cn/Daluandou/index?type=gameResult"
};
module.exports.URLs = URLs;