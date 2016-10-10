"use strict";
cc._RFpush(module, 'ed291N3i1tDU7X0f0BDpcE6', 'skill_cfg');
// script\config\data\skill_cfg.js

/*
actType 类型说明：
    1: 做成伤害 必填字段(actValue ranage)
    2: 自身施加硬直 必填字段(actValue)
    3: 震屏
    4: 播放特效
*/

module.exports.data = [{
    id: 0,
    postures: [{
        id: 1,
        actionIndex: 1,
        time: 0.3,
        timePoints: [{
            actType: 1,
            takeTime: 0.25,
            actValue: [20],
            range: new cc.Rect(30, 88, 38, 29),
            attackType: 1,
            sound: 1
        }, {
            actType: 2, //2代表对自身施加硬直
            takeTime: 0,
            actValue: [0.3]
        }]
    }, {
        id: 2,
        actionIndex: 2,
        time: 0.4,
        timePoints: [{
            actType: 1,
            takeTime: 0.2,
            actValue: [22],
            range: new cc.Rect(33, 98, 30, 45),
            attackType: 2,
            attackParam: { topTime: 0.4, topHeight: 100, distance: 30, combo: 35 },
            sound: 1
        }, {
            actType: 2, //2代表对自身施加硬直
            takeTime: 0,
            actValue: [0.4]
        }]
    }, {
        id: 3,
        actionIndex: 3,
        time: 0.5,
        effectTimePoint: 0,
        timePoints: [{
            actType: 1,
            takeTime: 0.25,
            actValue: [26],
            range: new cc.Rect(41, 78, 90, 33),
            attackType: 2,
            attackParam: { topTime: 0.4, topHeight: 20, distance: 300, combo: 70 },
            sound: 1
        }, {
            actType: 2,
            takeTime: 0,
            actValue: [0.5]
        }, {
            actType: 3,
            takeTime: 0.25
        }, {
            actType: 4,
            takeTime: 0,
            layer: 1,
            id: 1,
            position: { x: 0, y: 0 }
        }, {
            actType: 4,
            takeTime: 0,
            layer: 0,
            id: 3,
            position: { x: 0, y: 0 }
        }, {
            actType: 4,
            takeTime: 0,
            layer: 1,
            id: 2,
            position: { x: 0, y: 0 }
        }]
    }]
}, {
    id: 1,
    postures: [{
        id: 1,
        actionIndex: 1,
        time: 0.3,
        timePoints: [{
            actType: 1,
            takeTime: 0.25,
            actValue: [20],
            range: new cc.Rect(30, 88, 38, 29),
            attackType: 1,
            sound: 1
        }, {
            actType: 2, //2代表对自身施加硬直
            takeTime: 0,
            actValue: [0.3]
        }]
    }]
}];

cc._RFpop();