"use strict";
cc._RFpush(module, 'acdd7zMspBPI7cLW393Z7Wa', 'game_event');
// script\event\game_event.js

module.exports = {
    ON_HTTP_REQUEST: 0x00000001,
    ON_HTTP_RESPOND: 0x00000002,

    ON_LOGIN_RESULT: 0x00010001,
    ON_GET_GAME_DATA: 0x00010002,

    ON_RETRY_GAME: 0x00020001,
    ON_RETURN_GAME: 0x00020002
};

cc._RFpop();