"use strict";
cc._RFpush(module, '250eacTQpBLYI5/3XrULI2X', 'hurdle_define');
// script\scene\battle\hurdle_define.js

module.exports.TriggerType = {
    NONE: 0,
    TIME: 1,
    AREA: 2
};

module.exports.CmdType = {
    NONE: 0,
    CONTROL_ENABLED: 1,
    LOCK_AREA: 2,
    CREATE_MON: 3,
    SHOW_TRANS_DOOR: 4,
    SHOW_MOVE_TIPS: 5,
    CHANGE_HURDLE: 6,
    MOVE_CAMERA: 7,
    DO_MOVE_GUIDE: 8,
    DO_TOUCH_GUIDE: 9
};

module.exports.CondType = {
    NONE: 0,
    TOTAL_MON_KILL: 1,
    CONFIG_CUSTOM: 2
};

cc._RFpop();