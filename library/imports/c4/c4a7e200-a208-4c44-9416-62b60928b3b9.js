/*
说明
    cmdType（指令类型）
        1：controlenabled
        2：锁定区域
        3：刷怪 id（怪物id） pos（刷怪坐标）dir（方向 -1左 1右）
        4：开始
        5: gogogo

    condType（完成条件）
        1：杀怪数 num（杀怪数量）

    event
        1:时间
        2：地图区域
*/

module.exports.data = [{
    id: 1,
    mapId: 1,
    bornPos: { x: 450, y: 235 },
    mission: [{
        triggers: [{
            event: 1,
            param: 0,
            commands: [{
                cmdType: 1,
                args: { enabled: false }
            }]
        }, {
            event: 1,
            param: 0.5,
            commands: [{
                cmdType: 5,
                args: { show: true }
            }, {
                cmdType: 1,
                args: { enabled: true }
            }]
        }, {
            event: 2,
            param: { x: 800, y: 0, width: 1200, height: 640 },
            commands: [{
                cmdType: 5,
                args: { show: false }
            }, {
                cmdType: 2,
                args: { x: 0, y: 0, width: 2000, height: 640 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 1500, y: 270 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 1600, y: 185 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 1500, y: 100 }, dir: -1 }
            }]
        }],
        cond: [{ condType: 1, num: 3 }]
    }, {
        triggers: [{
            event: 1,
            param: 0,
            commands: [{
                cmdType: 2,
                args: { x: 0, y: 0, width: 4000, height: 640 }
            }, {
                cmdType: 5,
                args: { show: true }
            }]
        }, {
            event: 2,
            param: { x: 2600, y: 0, width: 300, height: 640 },
            commands: [{
                cmdType: 5,
                args: { show: false }
            }, {
                cmdType: 2,
                args: { x: 2000, y: 0, width: 2000, height: 640 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 3400, y: 270 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 3400, y: 100 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 3400, y: 185 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 3600, y: 185 }, dir: -1 }
            }]
        }],
        cond: [{ condType: 1, num: 4 }]
    }, {
        triggers: [{
            event: 1,
            param: 0,
            commands: [{
                cmdType: 2,
                args: { x: 2000, y: 0, width: 4000, height: 640 }
            }, {
                cmdType: 5,
                args: { show: true }
            }]
        }, {
            event: 2,
            param: { x: 4600, y: 0, width: 300, height: 640 },
            commands: [{
                cmdType: 5,
                args: { show: false }
            }, {
                cmdType: 2,
                args: { x: 4000, y: 0, width: 2000, height: 640 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 5200, y: 270 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 5200, y: 100 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 5200, y: 185 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 5400, y: 160 }, dir: -1 }
            }, {
                cmdType: 3,
                args: { id: 1, pos: { x: 5400, y: 220 }, dir: -1 }
            }]
        }],
        cond: [{ condType: 1, num: 5 }]
    }, {
        triggers: [{
            event: 1,
            param: 0,
            commands: [{
                cmdType: 4,
                args: { x: 5535, y: 170 }
            }, {
                cmdType: 2,
                args: { x: 0, y: 0, width: 0, height: 0 }
            }]
        }, {
            event: 2,
            param: { x: 5480, y: 120, width: 100, height: 100 },
            commands: [{
                cmdType: 6,
                args: { id: 0 }
            }]
        }],
        cond: [{ condType: 2 }]
    }]
}];

/*{
    cmd: [
        { cmdType: 4, value: false },
        { cmdType: 2, time: 1 },
        { cmdType: 1, range: { x: 0, y: 0, width: 0, height: 0 }, time: 2, camera: false, },
        { cmdType: 5, pos: { x: 2500, y: 185}, time: 2, dir: 1 },
        { cmdType: 2, time: 2 },
        { cmdType: 1, range: { x: 3000, y: 0, width: 1000, height: 640 }, time: 1.5, camera: true, },
        { cmdType: 2, time: 2 },
        { cmdType: 3, id: 1, pos: { x: 3400, y: 270 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 3400, y: 100 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 3400, y: 185 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 3600, y: 185 }, dir: -1  },
        { cmdType: 2, time: 2 },
        { cmdType: 1, range: { x: 2000, y: 0, width: 2000, height: 640 }, time: 1.5, camera: true, },
        { cmdType: 2, time: 2 },
        { cmdType: 4, value: true },
    ],
    cond: [
        { condType: 1, num: 4 },
    ],
},
{
    cmd: [
        { cmdType: 4, value: false },
        { cmdType: 2, time: 1 },
        { cmdType: 1, range: { x: 0, y: 0, width: 0, height: 0 }, time: 2, camera: false, },
        { cmdType: 5, pos: { x: 4500, y: 185}, time: 2, dir: 1 },
        { cmdType: 2, time: 2 },
        { cmdType: 1, range: { x: 5000, y: 0, width: 1000, height: 640 }, time: 1.5, camera: true, },
        { cmdType: 2, time: 2 },
        { cmdType: 3, id: 1, pos: { x: 5200, y: 270 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 5200, y: 100 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 5200, y: 185 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 5400, y: 160 }, dir: -1  },
        { cmdType: 3, id: 1, pos: { x: 5400, y: 220 }, dir: -1  },
        { cmdType: 2, time: 2 }, 
        { cmdType: 1, range: { x: 4000, y: 0, width: 2000, height: 640 }, time: 1.5, camera: true, },
        { cmdType: 2, time: 2 },
        { cmdType: 4, value: true },
    ],
    cond: [
        { condType: 1, num: 5 },
    ],
},*/