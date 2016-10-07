var HurldeDefine = require("hurdle_define");
var ControlDefine = require("control_define");
var TriggerType = HurldeDefine.TriggerType;
var CmdType = HurldeDefine.CmdType;
var CondType = HurldeDefine.CondType;
var ControlKey = ControlDefine.ControlKey;

var HurdleLoadBit = {
    MAP: 0x0001
};

cc.Class({
    "extends": cc.Component,

    properties: {
        transformMask: cc.Node,
        joyStick: cc.Node,
        attackButton: cc.Node,
        mapLayer: cc.Node,
        controlLayer: cc.Node,
        stateBar: cc.Node,
        moveTips: cc.Node,
        roundBar: cc.Node,
        playerPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;
        manager.enabledDebugDraw = false;

        this._uiManager = this.node.getComponent('ui_manager');

        // 控制相关
        this._roundBar = this.roundBar.getComponent('round_ctrl');
        this._joyStick = this.joyStick.getComponent("joy_ctrl");
        this._attackButton = this.attackButton.getComponent("attack_ctrl");
        this._stateBar = this.stateBar.getComponent("state_ctrl");
        this._player = cc.instantiate(this.playerPrefab).getComponent('player_ctrl');
        this._player.logicManager = this;
        this._player.stateBar = this._stateBar;
        this._joyStick.setPlayer(this._player);
        this._attackButton.setPlayer(this._player);

        // 关卡相关
        this._currHurdleId = -1;
        this._hurdleLoadMask = 0;
        this._startted = false;
        this._isFail = false;
        this._isFinish = false;
        this._currHurdleConfig = null;
        this._map = null;

        // 任务相关
        this._missions = [];
        this._triggers = [];
        this._currMission = null;
        this._missionStartTime = 0;
        this._hurdleStartTime = 0;
        this._killNum = 0;
        this._roundNum = 0;

        this._keepEffects = [];
        this._monsters = [];

        var self = this;
        this._listener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: self.onKeyPressed.bind(self),
            onKeyReleased: self.onKeyReleased.bind(self)
        };
        // 绑定鼠标事件
        cc.eventManager.addListener(this._listener, this.node);

        // 来自失败窗口，复活按钮
        this._reliveHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_RETRY_GAME, this.onRetryGame.bind(this));
        this._returnHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_RETURN_GAME, this.onReturnEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._reliveHandler);
        Global.gameEventDispatcher.removeEventHandler(this._returnHandler);
        this._reliveHandler = null;
        this._returnHandler = null;
        // 不能这样做，destroy时所有listener已移除
        //cc.eventManager.removeListener(this._listener);
    },

    onKeyPressed: function onKeyPressed(keyCode, event) {
        var ck = null;
        switch (keyCode) {
            case cc.KEY.w:
                ck = ControlKey.UP;
                break;
            case cc.KEY.a:
                ck = ControlKey.LEFT;
                break;
            case cc.KEY.s:
                ck = ControlKey.DOWN;
                break;
            case cc.KEY.d:
                ck = ControlKey.RIGHT;
                break;
            case cc.KEY.j:
                ck = ControlKey.HIT;
                break;
        }
        if (ck && this._player) this._player.keyDown(ck);
    },

    onKeyReleased: function onKeyReleased(keyCode, event) {
        var ck = null;
        switch (keyCode) {
            case cc.KEY.w:
                ck = ControlKey.UP;
                break;
            case cc.KEY.a:
                ck = ControlKey.LEFT;
                break;
            case cc.KEY.s:
                ck = ControlKey.DOWN;
                break;
            case cc.KEY.d:
                ck = ControlKey.RIGHT;
                break;
            case cc.KEY.j:
                ck = ControlKey.HIT;
                break;
        }
        if (ck && this._player) this._player.keyUp(ck);
    },

    onRetryGame: function onRetryGame() {
        //this.changeHurdle(this._currHurdleId);
        this._player.relive();
    },

    onReturnEvent: function onReturnEvent() {
        GameUtil.loadScene('game');
    },

    start: function start() {
        //this.loadMusic();
        this.changeHurdle(0);
    },

    clearEffects: function clearEffects() {
        while (this._keepEffects.length > 0) {
            var node = this._keepEffects.pop();
            node.parent = null;
            node.destroy();
        }
    },

    clearMonster: function clearMonster() {
        while (this._monsters.length > 0) {
            var mon = this._monsters.pop();
            mon.node.destroy();
        }
    },

    clearMission: function clearMission() {
        this._triggers.splice(0, this._triggers.length);
        this._missions.splice(0, this._missions.length);
        this._currMission = null;
        this._missionStartTime = 0;
        this._killNum = 0;
    },

    clearHurdle: function clearHurdle() {
        this._startted = false;
        this._uiManager.closeAll();
        this._player.map = null;
        this.clearEffects();
        this.removeMap();
        this.clearMonster();
        this.clearMission();
        this._currHurdleConfig = null;
        this._currHurdleId = -1;
        this._hurdleLoadMask = 0;
        this._hurdleStartTime = 0;
        this._isFail = false;
        this._isFinish = false;
        this._roundNum = 0;
        this.roundBar.active = false;
    },

    initMission: function initMission() {
        if (!this._currHurdleConfig) return;
        var cfg = this._currHurdleConfig;
        for (var i = cfg.mission.length - 1; i >= 0; i--) this._missions.push(cfg.mission[i]);
        this._missionStartTime = 0;
        this._killNum = 0;
    },

    changeHurdle: function changeHurdle(id) {
        this._startted = false;
        if (this._currHurdleId >= 0 && this._currHurdleId === id) {
            this.transform(0);
        } else if (id >= 0) {
            this.transformMask.stopAllActions();
            this.transformMask.opacity = 255;
            this.loadHurdle(id);
        } else {
            this.clearHurdle();
        }
    },

    transform: function transform(type, born) {
        this.transformMask.stopAllActions();
        var sequence = null;
        var action = null;
        var time = 0;
        var self = this;
        if (type === 0) {
            //变黑
            time = (255 - this.transformMask.opacity) / 255 * 0.5;
            action = new cc.Sequence(new cc.FadeIn(time), new cc.CallFunc(function () {
                self.resetHurdle();
            }));
        } else if (type === 1) {
            // 变透明
            if (born) {
                this._player.node.opacity = 0;
            }
            time = this.transformMask.opacity / 255 * 0.5;
            action = new cc.Sequence(new cc.FadeOut(time), new cc.CallFunc(function () {
                if (born) {
                    self._player.node.opacity = 255;
                    self._player.setHp(200, 200);
                    self._player.born();
                }
                self.startHurdle();
            }));
        }
        this.transformMask.runAction(action);
    },

    startHurdle: function startHurdle() {
        this.loadMusic();
        this._roundNum++;
        this.roundBar.active = true;
        this._roundBar.setRound(this._roundNum);
        this._player.controlEnabled = true;
        this._startted = true;
    },

    loadHurdle: function loadHurdle(id) {
        var cfg = Global.hurdleProvider.getConfig(id);
        if (!cfg) return;
        this.clearHurdle();
        this._currHurdleId = id;
        this._currHurdleConfig = cfg;
        this.initMission();
        this.loadMap(cfg.mapId);
    },

    resetHurdle: function resetHurdle() {
        if (!this._currHurdleConfig) return;
        this._startted = false;
        this._uiManager.closeAll();
        this.clearEffects();
        this._map.reset();
        this.clearMonster();
        this.clearMission();
        this.initMission();
        this._isFail = false;
        this._isFinish = true;
        this.roundBar.active = false;
        this._player.reset();
        this._player.setActorPosition(this._currHurdleConfig.bornPos.x, this._currHurdleConfig.bornPos.y);
        this._player.map = this._map;
        this._player.setHp(200, 200);
        this.transform(1);
    },

    launchMission: function launchMission() {
        var mission = this._missions.pop();
        if (!mission) {
            this._currMission = null;
            return false;
        }
        this._currMission = mission;
        this._triggers.splice(0, this._triggers.length);
        for (var i = 0; i < mission.triggers.length; i++) {
            this._triggers.push(mission.triggers[i]);
        }
        this._killNum = 0;
        this._missionStartTime = Global.syncTimer.getTimer();
        return true;
    },

    loadMusic: function loadMusic() {
        var self = this;
        cc.loader.loadRes("sound/bg", cc.AudioClip, function (err, audioClip) {
            cc.log('play music');
            cc.audioEngine.playMusic(audioClip, true);
        });
    },

    loadMap: function loadMap(id) {
        var self = this;
        cc.loader.loadRes("prefab/map/" + id.toString(), function (err, prefab) {
            self.onHurdleStepLoaded(HurdleLoadBit.MAP, err, prefab);
        });
    },

    removeMap: function removeMap() {
        if (!this._map) return;
        this._map.node.parent = null;
        this._map.node.destroy();
        this._map = null;
    },

    onHurdleStepLoaded: function onHurdleStepLoaded(bit, err, prefab) {
        switch (bit) {
            case HurdleLoadBit.MAP:
                var node = cc.instantiate(prefab);
                node.parent = this.mapLayer;
                this._map = node.getComponent("map_ctrl");
                this._hurdleLoadMask |= HurdleLoadBit.MAP;
                break;

            default:
                break;
        }

        if (this.isLoadedHurdle()) {
            //this._player.reset();
            this._player.map = this._map;
            this._player.setActorPosition(this._currHurdleConfig.bornPos.x, this._currHurdleConfig.bornPos.y);
            this.transform(1, true);
        }
    },

    isLoadedHurdle: function isLoadedHurdle() {
        var result = false;
        var mask = 0;
        for (var k in HurdleLoadBit) {
            mask |= HurdleLoadBit[k];
        }
        return this._hurdleLoadMask == mask;
    },

    getPlayer: function getPlayer() {
        return this._player;
    },

    getRound: function getRound() {
        return this._roundNum;
    },

    createMonster: function createMonster(id, pos, dir) {
        var self = this;
        cc.loader.loadRes("prefab/actor/monster", function (err, prefab) {
            var node = cc.instantiate(prefab);
            var mon = node.getComponent("monster_ctrl");
            mon.logicManager = self;
            self._monsters.push(mon);
            mon.setActorPosition(pos.x, pos.y);
            mon.map = self._map;
            mon.setDirection(dir);

            var hp = (self._roundNum - 1) * 20 + 130;
            mon.setHp(hp, hp);
            mon.born();
        });
    },

    destroyMonster: function destroyMonster(monster) {
        for (var i = 0; i < this._monsters.length; i++) {
            if (monster == this._monsters[i]) {
                this._monsters.splice(i, 1);
                break;
            }
        }
        this._map.removeEnity(monster.node);
        monster.node.destroy();
    },

    removeEnity: function removeEnity(enity) {
        if (enity == this._player) {} else {
            this.destroyMonster(enity);
        }
    },

    killMonster: function killMonster() {
        this._killNum++;
    },

    getActorByRegion: function getActorByRegion(actor, region) {
        var mons = [];
        for (var i = 0; i < this._monsters.length; i++) {
            var mon = this._monsters[i];
            var coll = mon.getCollision();
            if (Math.abs(actor.node.y - mon.node.y) < 30 && cc.Intersection.rectRect(mon.getCollision(), region)) mons.push(mon);
        }
        return mons;
    },

    update: function update(dt) {
        if (!this._startted) return;

        if (!this._currMission && !this.launchMission()) return;

        if (!this._player.isDead()) {
            if (this._isFail) {
                this._isFail = false;
            }
        } else {
            if (!this._isFail) {
                this._isFail = true;
                this._uiManager.openUI('mission_fail');
                return;
            }
        }

        var currTime = Global.syncTimer.getTimer();

        if (this._launchNextMissionEndTime > 0) {
            if (currTime > this._launchNextMissionEndTime) {
                this._launchNextMissionEndTime = 0;
                if (!this.launchMission()) {
                    this.showResultFace();
                    return;
                } else {
                    this._player.controlEnabled = true;
                }
            } else {
                return;
            }
        }

        if (this.checkMissionClean()) {
            this._player.controlEnabled = false;
            this._map.cameraTo(this._map.getCurrPosition().x - this._map.viewSize.width / 2, 0, 1, false);
            this._launchNextMissionEndTime = currTime + 1;
            return;
        }

        for (var i = this._triggers.length - 1; i >= 0; i--) {
            var needExec = false;
            var trigger = this._triggers[i];
            switch (trigger.event) {
                case TriggerType.TIME:
                    needExec = currTime - this._missionStartTime >= trigger.param;
                    break;

                case TriggerType.AREA:
                    var pos = new cc.Vec2(this._player.node.x, this._player.node.y);
                    var region = new cc.Rect(trigger.param.x, trigger.param.y, trigger.param.width, trigger.param.height);
                    needExec = region.contains(pos);
                    break;
            }
            if (needExec) {
                this._triggers.splice(i, 1);
                this.execCmd(trigger.commands);
            }
        }
    },

    execCmd: function execCmd(commands) {
        var needBreak = false;
        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];
            if (!cmd) continue;
            switch (cmd.cmdType) {
                case CmdType.CONTROL_ENABLED:
                    this._player.controlEnabled = cmd.args.enabled;
                    this.controlLayer.active = cmd.args.enabled;
                    break;

                case CmdType.LOCK_AREA:
                    var region = new cc.Rect(cmd.args.x, cmd.args.y, cmd.args.width, cmd.args.height);
                    this._map.lockRegion = region;
                    break;

                case CmdType.CREATE_MON:
                    this.createMonster(cmd.args.id, cmd.args.pos, cmd.args.dir);
                    break;

                case CmdType.SHOW_MOVE_TIPS:
                    this.moveTips.active = cmd.args.show;
                    break;

                case CmdType.SHOW_TRANS_DOOR:
                    this.playEffect(8, 0, new cc.Vec2(cmd.args.x, cmd.args.y), false, true);
                    break;

                case CmdType.CHANGE_HURDLE:
                    needBreak = true;
                    this.changeHurdle(cmd.args.id);
                    break;

                case CmdType.MOVE_CAMERA:
                    this._map.cameraTo(cmd.args.x, cmd.args.y, cmd.args.time);
                    break;

                default:
                    break;
            }
            if (needBreak) break;
        }
    },

    checkMissionClean: function checkMissionClean() {
        if (!this._currMission) return false;

        var result = true;
        var conds = this._currMission.cond;
        for (var i = 0; i < conds.length; i++) {
            var cond = conds[i];
            var completed = true;
            switch (cond.condType) {
                case CondType.TOTAL_MON_KILL:
                    if (this._killNum < cond.num) completed = false;
                    break;
                case CondType.CONFIG_CUSTOM:
                    completed = false;
                    break;
                default:
                    break;
            }

            if (!completed) {
                result = false;
                break;
            }
        }

        return result;
    },

    showResultFace: function showResultFace(success) {},

    playEffect: function playEffect(id, layer, pos, flip, keep) {
        var self = this;
        cc.loader.loadRes("prefab/effect/" + id, function (err, prefab) {
            var node = cc.instantiate(prefab);
            node.x = pos.x;
            node.y = pos.y;
            if (flip) node.scaleX = -1;
            if (keep) {
                self._keepEffects.push(node);
            } else {
                var animation = node.getComponent(cc.Animation);
                animation.on('finished', function (event) {
                    if (!keep) {
                        node.parent = null;
                        node.destroy();
                    }
                });
            }
            self._map.addEffect(node, layer);
        });
    }
});