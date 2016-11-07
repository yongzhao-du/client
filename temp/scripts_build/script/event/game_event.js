"use strict";
cc._RFpush(module, 'acdd7zMspBPI7cLW393Z7Wa', 'game_event');
// script\event\game_event.js

module.exports = {
    ON_HTTP_REQUEST: 0x00000001,
    ON_HTTP_RESPOND: 0x00000002,
    ON_NETWORK_ERROR: 0x00000003,

    ON_LOGIN_RESULT: 0x00010001,
    ON_GET_GAME_DATA: 0x00010002,
    ON_EXCHANGE_GOLD: 0x00010003,
    ON_START_GAME: 0x00010004,
    ON_BUY_PHYSICAL: 0x00010005,
    ON_BUY_TIME_TO_PLAY: 0x00010006,
    ON_GAME_RESULT: 0x00010007,
    ON_LOGIN_TIME_OUT: 0x00010008,

    ON_RETURN_GAME: 0x00020002,

    ON_FLOAT_MESSAGE: 0x00030001
};

cc._RFpop();