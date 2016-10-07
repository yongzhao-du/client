module.exports = {
    ActorDirection: {
        LEFT: -1,
        RIGHT: 1,
    },
    
    ActorAction: {
        IDLE: 0,
        PRERUN: 1,
        RUN: 2,
        ATTACK: 3,
        HURT: 4,
        HURT_FLY: 5,
        HURT_FALL: 6,
        COLLAPSE: 7,
        RECOVER: 8,
        BORN: 9,
        DISAPPEAR: 10,
        RELIVE: 11,
    },
    
    ActionName: [
        "idle",
        "prerun",
        "run",
        "attack_",
        "hurt",
        "hurt_fly",
        "hurt_fall",
        "collapse",
        "standup",
        "born",
        "disappear",
        "relive",
    ],
    
    ActionClipIndex: {
        IDLE: 0,
        RUN: 1,
        ATTACK_1: 2,
        ATTACK_2: 3,
        ATTACK_3: 4,
        HURT: 5,
        HURT_FLY: 6,
        HURT_FALL: 7,
        COLLAPSE: 8,
        RECOVER: 9,
        BORN: 10,
        DISAPPEAR: 11,
        RELIVE: 12,
    },
    
    ActionCompleteType: {
        COMPLETABLE: 0,
        UNCOMPLETABLE: 1,
        BREAKABLE: 2,
    }
}