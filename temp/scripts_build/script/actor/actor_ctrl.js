"use strict";
cc._RFpush(module, '9037aCxu79DU4s/8BWTZUwt', 'actor_ctrl');
// script\actor\actor_ctrl.js

var SkillDefine = require("skill_define");
var ActorDefine = require("actor_define");
var ActorDirection = ActorDefine.ActorDirection;
var ActorAction = ActorDefine.ActorAction;
var ActionName = ActorDefine.ActionName;
var ActionClipIndex = ActorDefine.ActionClipIndex;
var ActionCompleteType = ActorDefine.ActionCompleteType;
var TimePointActType = SkillDefine.TimePointActType;
var AttackType = SkillDefine.AttackType;

cc.Class({
    "extends": cc.Component,

    properties: {
        moveSpeed: new cc.Vec2(0, 0),

        logicManager: {
            set: function set(manager) {
                this._logicManager = manager;
            },

            get: function get() {
                return this._logicManager;
            }
        },

        map: {
            set: function set(map) {
                if (!map) {
                    this._map = null;
                } else {
                    this._map = map;
                    this._map.addEnity(this.node);
                }
            },

            get: function get() {
                return this._map;
            }
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._model = this.node.getChildByName("model");
        this._modelAnimation = this._model.getComponent(cc.Animation);
        this._body = this._model.getChildByName("body");
        var box = this.node.getComponent(cc.BoxCollider);
        this._box = new cc.Rect(box.offset.x - box.size.width / 2, box.offset.y - box.size.height / 2, box.size.width, box.size.height);

        this._direction = null;

        this._currAction = null;
        this._currActionEndTime = 0;

        this._floatState = 0;
        this._floatStartTime = 0;
        this._floatTopTime = 0;
        this._floatUpStartPos = new cc.Vec2();
        this._floatDownStartPos = new cc.Vec2();
        this._floatSpeed = new cc.Vec2();
        this._floatUpAccelerator = 0;

        this._isAttacking = false;
        this._needStopPosture = false;
        this._attackEndTime = 0;
        this._skillTimeStates = [];
        this._currPostureEndTime = 0;
        this._currPostureCount = 0;
        this._currPostureIndex = 0;
        this._currPosture = null;
        this._currPostures = [null, null, null, null];

        this._moveStartTime = 0;
        this._moveEndTime = 0;
        this._initiativeMove = false;
        this._targetMovePos = null;
        this._moveStartPos = new cc.Vec2();
        this._currMoveSpeed = new cc.Vec2();

        this._needRelive = false;
        this._reliveEndTime = 0;

        // 受击结事时间（即受击硬直）
        this._hurtEndTime = 0;

        // 倒地结束时间
        this._collapseEndTime = 0;

        // 起身结束时间
        this._recoverEndTime = 0;

        this._bornEndTime = 0;

        this._isInvincible = false;
        this._defaultComboValue = 100;
        this._remainComboValue = this._defaultComboValue;

        this._hpMax = 1000;
        this._hp = 1000;

        this.setAction(ActorAction.IDLE, ActorDirection.RIGHT);
    },

    reset: function reset() {
        this._floatState = 0;
        this._floatStartTime = 0;
        this._floatTopTime = 0;
        this._floatUpStartPos.x = this._floatUpStartPos.y = 0;
        this._floatDownStartPos.x = this._floatDownStartPos.y = 0;
        this._floatSpeed.x = this._floatSpeed.y = 0;
        this._floatUpAccelerator = 0;

        this._isAttacking = false;
        this._needStopPosture = false;
        this._attackEndTime = 0;
        this._skillTimeStates.splice(0, this._skillTimeStates.length);
        this._currPostureEndTime = 0;
        this._currPostureCount = 0;
        this._currPostureIndex = 0;
        this._currPosture = null;
        for (var i = 0; i < this._currPostures.length; i++) {
            this._currPostures[i] = null;
        }

        this._moveStartTime = 0;
        this._moveEndTime = 0;
        this._initiativeMove = false;
        this._targetMovePos = null;
        this._moveStartPos.x = this._moveStartPos.y = 0;
        this._currMoveSpeed.x = this._currMoveSpeed.y = 0;

        this._needRelive = false;
        this._reliveEndTime = 0;

        // 受击结事时间（即受击硬直）
        this._hurtEndTime = 0;

        // 倒地结束时间
        this._collapseEndTime = 0;

        // 起身结束时间
        this._recoverEndTime = 0;

        this._bornEndTime = 0;

        this._isInvincible = false;
        this._remainComboValue = this._defaultComboValue;

        this._hp = this._hpMax;

        this._model.y = 0;
        this.setAction(ActorAction.IDLE, this._direction);
    },

    born: function born() {
        this.reset();
        this._isInvincible = true;
        this._bornEndTime = Global.syncTimer.getTimer() + this._modelAnimation.getClips()[ActionClipIndex.BORN].duration;
        this.setAction(ActorAction.BORN, this._direction);
    },

    setActorPosition: function setActorPosition(x, y) {
        this.node.x = x;
        this.node.y = y;
    },

    setDirection: function setDirection(dir) {
        if (this._direction === dir || dir != ActorDirection.LEFT && dir != ActorDirection.RIGHT) return;
        this._direction = dir;
        this.node.scaleX = dir;
    },

    getDirection: function getDirection() {
        return this._direction;
    },

    setAction: function setAction(action, dir, param, time) {
        var actionName = null;
        switch (action) {
            case ActorAction.ATTACK:
                actionName = ActionName[action] + param;
                break;
            default:
                actionName = ActionName[action];
                break;
        }
        this._currAction = action;
        this._modelAnimation.play(actionName);
        if (!time || time === 0) this._currActionEndTime = Global.syncTimer.getTimer() + this._modelAnimation.currentClip.duration;else this._currActionEndTime = Global.syncTimer.getTimer() + time;
        this.setDirection(dir);
    },

    setHp: function setHp(value) {
        if (value < 0) value = 0;
        this._hp = value;
    },

    getHp: function getHp() {
        return this._hp;
    },

    getCollision: function getCollision() {
        var xff = this.node.convertToWorldSpace(new cc.Vec2(0, 0));
        var offset = this.node.convertToWorldSpace(new cc.Vec2(this._box.x, this._box.y));
        if (this._direction == ActorDirection.LEFT) offset.x -= this._box.width;
        return new cc.Rect(offset.x, offset.y, this._box.width, this._box.height);
    },

    isDead: function isDead() {
        return this._isDead;
    },

    relive: function relive() {
        if (this._needRelive || !this._isDead) return;
        this._needRelive = true;
    },

    startRelive: function startRelive() {
        this.reset();
        this._isInvincible = true;
        this._reliveEndTime = Global.syncTimer.getTimer() + this._modelAnimation.getClips()[ActionClipIndex.RELIVE].duration + 1;
        this.setAction(ActorAction.RELIVE, this._direction);
        this.playReliveEffect();
    },

    endRelive: function endRelive() {
        this._isDead = false;
        this._isInvincible = false;
        this._reliveEndTime = 0;
    },

    startHurt: function startHurt(time, dir) {
        this._hurtEndTime = Global.syncTimer.getTimer() + time;
        this.setAction(ActorAction.HURT, dir);
    },

    endHurt: function endHurt() {
        this._hurtEndTime = 0;
    },

    startFloat: function startFloat(topTime, topHeight, distance) {
        this._floatState = 0;
        this._floatStartTime = Global.syncTimer.getTimer();
        this._floatTopTime = this._floatStartTime + topTime;
        this._floatUpStartPos.x = this.node.x;
        this._floatUpStartPos.y = this._model.y;
        this._floatDownStartPos.x = 0;
        this._floatDownStartPos.y = 0;
        this._floatUpAccelerator = 2 * topHeight / (topTime * topTime);
        this._floatSpeed.x = distance / (topTime * 2);
        this._floatSpeed.y = this._floatUpAccelerator * topTime;
    },

    endFloat: function endFloat() {
        this._floatState = 0;
        this._floatStartTime = 0;
        this._floatTopTime = 0;
        this._floatUpStartPos.y = 0;
        this._floatUpStartPos.x = 0;
        this._floatDownStartPos.x = 0;
        this._floatDownStartPos.y = 0;
        this._floatSpeed.x = 0;
        this._floatSpeed.y = 0;
        this._floatUpAccelerator = 0;
    },

    startCollapse: function startCollapse() {
        this._collapseEndTime = Global.syncTimer.getTimer() + this._modelAnimation.getClips()[ActionClipIndex.COLLAPSE].duration + 1;
        this.setAction(ActorAction.COLLAPSE, this._direction);
    },

    endCollapse: function endCollapse() {
        this._collapseEndTime = 0;
    },

    startRecover: function startRecover() {
        this._isInvincible = true;
        this._recoverEndTime = Global.syncTimer.getTimer() + this._modelAnimation.getClips()[ActionClipIndex.RECOVER].duration;
        this.setAction(ActorAction.RECOVER, this._direction);
    },

    endRecover: function endRecover() {
        this._isInvincible = false;
        this._recoverEndTime = 0;
        this._remainComboValue = this._defaultComboValue;
    },

    moveTo: function moveTo(x, y, time, dir) {
        this.stopMove();
        var speedX = (x - this.node.x) / time;
        var speedY = (y - this.node.y) / time;
        this.startMove(speedX, speedY, false);
        this.setDirection(dir);
        this._targetMovePos = new cc.Vec2(x, y);
        this._moveEndTime = this._moveStartTime + time;
    },

    startMove: function startMove(speedX, speedY, initiative) {
        this._initiativeMove = initiative;
        this._moveStartTime = Global.syncTimer.getTimer();
        this._currMoveSpeed.x = speedX;
        this._currMoveSpeed.y = speedY;
        this._moveStartPos.x = this.node.x;
        this._moveStartPos.y = this.node.y;
    },

    stopMove: function stopMove() {
        this._moveStartTime = 0;
        this._moveEndTime = 0;
        this._initiativeMove = false;
        this._targetMovePos = null;
        this._currMoveSpeed.x = this._currMoveSpeed.y = 0;
        this._moveStartPos.x = this._moveStartPos.y = 0;
    },

    startAttack: function startAttack(postureList, postureCount, dir) {
        this.stopAttack();
        this._isAttacking = true;
        if (postureCount > this._currPostures.length) postureCount = this._currPostures.length;
        for (var i = 0; i < postureCount; i++) {
            this._currPostures[i] = postureList[i];
        }
        this._currPostureCount = postureCount;
        this._currPostureIndex = 0;
        this.launchPosture(postureList[0], dir);
    },

    stopAttack: function stopAttack() {
        this._isAttacking = false;
        this.breakPosture();
    },

    launchPosture: function launchPosture(posture, dir) {
        this.launchSkillTimeList(posture);
        this.setAction(ActorAction.ATTACK, dir, posture.actionIndex, posture.time);
        this._currPostureEndTime = this._currActionEndTime;
        this._currPosture = posture;
    },

    launchSkillTimeList: function launchSkillTimeList(posture) {
        this._skillTimeStates.splice(0, this._skillTimeStates.length);
        var currTime = Global.syncTimer.getTimer();
        var count = posture.timePoints.length;
        for (var i = 0; i < count; i++) {
            var timePoint = posture.timePoints[i];
            var timeState = {
                timePoint: timePoint,
                takeEndTime: currTime + timePoint.takeTime,
                posture: posture,
                taked: false
            };
            this._skillTimeStates.push(timeState);
        }
    },

    breakPosture: function breakPosture() {
        this._skillTimeStates.splice(0, this._skillTimeStates.length);
        this._currPostureEndTime = 0;
        this._currPosture = null;
        this._currPostureCount = 0;
        this._currPostureIndex = 0;
    },

    startDisappear: function startDisappear() {
        this.setAction(ActorAction.DISAPPEAR, this._direction);
    },

    processHurt: function processHurt(currTime) {
        if (currTime >= this._hurtEndTime) this.endHurt();
    },

    processFloat: function processFloat(currTime) {
        switch (this._floatState) {
            //上升过程
            case 0:
                if (this._currAction !== ActorAction.HURT_FLY) {
                    this.setAction(ActorAction.HURT_FLY, this._direction);
                }
                var timeElapased = currTime - this._floatStartTime;
                if (currTime >= this._floatTopTime) {
                    timeElapased = this._floatTopTime - this._floatStartTime;
                    this._floatState++;
                }
                var x = this._floatUpStartPos.x + timeElapased * this._floatSpeed.x;
                var y = this._floatUpStartPos.y + this._floatSpeed.y * timeElapased - this._floatUpAccelerator * timeElapased * timeElapased / 2;
                var result = this.getFixedMovePoint(this.node.x, this.node.y, x, this.node.y);
                this.node.x = result.dx;
                this._model.y = y;
                this._floatDownStartPos.x = result.dx;
                this._floatDownStartPos.y = y;
                break;

            //下落过程
            case 1:
                if (this._currAction !== ActorAction.HURT_FALL) {
                    this.setAction(ActorAction.HURT_FALL, this._direction);
                }
                var timeElapased = currTime - this._floatTopTime;
                var x = this._floatDownStartPos.x + timeElapased * this._floatSpeed.x;
                var y = this._floatDownStartPos.y - 3000 * (timeElapased * timeElapased) / 2;
                var result = this.getFixedMovePoint(this.node.x, this.node.y, x, this.node.y);
                this.node.x = result.dx;
                if (y <= 0) {
                    y = 0;
                    this._floatState++;
                }
                this._model.y = y;
                break;

            //结束
            case 2:
                this.endFloat();
                this._model.y = 0;
                this.startCollapse();
                break;
        }
        this.setActorPosition(this.node.x, this.node.y);
    },

    processCollapse: function processCollapse(currTime) {
        if (currTime >= this._collapseEndTime) this.endCollapse();
    },

    processRecover: function processRecover(currTime) {
        if (currTime >= this._recoverEndTime) this.endRecover();
    },

    processAttack: function processAttack(currTime) {
        var posture = this._currPosture;
        if (posture) {
            if (currTime >= this._currPostureEndTime) {
                this._currPosture = null;
                this._currPostureEndTime = 0;
            }
        } else if (currTime >= this._attackEndTime) {
            this._currPostureIndex++;
            if (this._needStopPosture || this._currPostureIndex >= this._currPostureCount) {
                this.stopAttack();
            } else {
                posture = this._currPosture[this._currPostureIndex];
                this.launchPosture(posture, this._direction);
            }
        }
    },

    processMove: function processMove(currTime) {
        if (this._currAction !== ActorAction.RUN) {
            this.setAction(ActorAction.RUN, this._direction);
        }
        var pos = new cc.Vec2();
        var timeElapased = currTime - this._moveStartTime;
        if (this._moveEndTime > 0 && currTime >= this._moveEndTime) {
            timeElapased = this._moveEndTime - this._moveStartTime;
            pos.x = this._targetMovePos.x;
            pos.y = this._targetMovePos.y;
            this.stopMove();
        } else {
            pos.x = this._moveStartPos.x + timeElapased * this._currMoveSpeed.x;
            pos.y = this._moveStartPos.y + timeElapased * this._currMoveSpeed.y;
        }
        var result = this.getFixedMovePoint(this.node.x, this.node.y, pos.x, pos.y);
        this.setActorPosition(result.dx, result.dy);
    },

    // 判断当前动作可否完成或可否打断
    getCurrentActionCompleteType: function getCurrentActionCompleteType(currTime) {
        if (this._reliveEndTime > 0 || this._bornEndTime > 0 || this._recoverEndTime > 0 || this._floatStartTime > 0 || this._collapseEndTime > 0 || this._recoverEndTime > 0 || this._hurtEndTime > 0) return ActionCompleteType.UNCOMPLETABLE;

        switch (this._currAction) {
            case ActorAction.IDLE:
            case ActorAction.RUN:
                return ActionCompleteType.COMPLETABLE;
            default:
                break;
        }

        if (currTime >= this._currActionEndTime) return ActionCompleteType.COMPLETABLE;else return ActionCompleteType.BREAKABLE;
    },

    nextAction: function nextAction() {
        if (this._moveStartTime > 0) {
            //保持移动
        } else if (this._currAction !== ActorAction.IDLE) {
                this.setAction(ActorAction.IDLE, this._direction);
            }
    },

    breakable: function breakable() {
        return false;
    },

    needDisappear: function needDisappear() {
        return true;
    },

    update: function update(dt) {
        var currTime = Global.syncTimer.getTimer();

        if (this._bornEndTime > 0 && currTime >= this._bornEndTime) {
            this._isInvincible = false;
            this._bornEndTime = 0;
        }

        if (this._reliveEndTime > 0 && currTime >= this._reliveEndTime) {
            this.endRelive();
        }

        if (this._floatStartTime > 0) {
            this.processFloat(currTime);
        }

        if (this._hurtEndTime > 0) {
            this.processHurt(currTime);
        }

        if (this._collapseEndTime > 0) {
            this.processCollapse(currTime);
        }

        if (this._recoverEndTime > 0) {
            this.processRecover(currTime);
        }

        // 更新技能作用时间点
        this.updateSkillTimePoints(currTime);

        if (this._isAttacking) {
            this.processAttack(currTime);
        }

        if (this._moveStartTime > 0) {
            this.processMove(currTime);
        }

        var completeType = this.getCurrentActionCompleteType(currTime);
        switch (completeType) {
            // 已完成或可完成
            case ActionCompleteType.COMPLETABLE:
                if (this === this._logicManager.getPlayer()) {
                    cc.log('abc');
                }
                if (this._currAction == ActorAction.DISAPPEAR) {
                    this._logicManager.removeEnity(this);
                } else if (this._currAction == ActorAction.COLLAPSE) {
                    if (this._isDead) {
                        if (this._needRelive) {
                            this.startRelive();
                        } else if (this.needDisappear() && this._currAction != ActorAction.DISAPPEAR) {
                            this.startDisappear();
                        }
                    } else {
                        this.startRecover();
                    }
                } else if (this._currAction == ActorAction.RELIVE) {
                    this.nextAction();
                } else if (this._currAction == ActorAction.RECOVER) {
                    this.nextAction();
                } else if (this._currAction == ActorAction.BORN) {
                    this.nextAction();
                } else {
                    this.nextAction();
                }
                break;

            // 可打断
            case ActionCompleteType.BREAKABLE:
                if (this.breakable()) {
                    this.stopMove();
                    this.stopAttack();
                    this.nextAction();
                }
                break;

            // 未完成或不可完成
            case ActionCompleteType.UNCOMPLETABLE:
                break;

            default:
                break;
        }
    },

    updateSkillTimePoints: function updateSkillTimePoints(currTime) {
        for (var i = 0; i < this._skillTimeStates.length; i++) {
            var timeState = this._skillTimeStates[i];
            if (!timeState.taked) {
                if (currTime >= timeState.takeEndTime) {
                    this.takeSkillTimePoint(timeState.timePoint);
                    timeState.taked = true;
                }
            }
        }
    },

    takeSkillTimePoint: function takeSkillTimePoint(timePoint) {
        switch (timePoint.actType) {
            case TimePointActType.DAMAGE:
                this.takeSkillDamage(timePoint);break;
            case TimePointActType.SELF_DELAY:
                this.takeSkillSelfDelay(timePoint);break;
            case TimePointActType.SHOCK_SCREEN:
                this._map.shock();break;
            case TimePointActType.PLAY_EFFECT:
                this.takePlayEffect(timePoint);break;
        }
    },

    takeSkillDamage: function takeSkillDamage(timePoint) {
        var offset = this.node.convertToWorldSpace(new cc.Vec2(timePoint.range.x, timePoint.range.y));
        if (this._direction == ActorDirection.LEFT) offset.x -= timePoint.range.width;
        var region = new cc.Rect(offset.x, offset.y, timePoint.range.width, timePoint.range.height);
        var hittingActors = null;
        var player = this._logicManager.getPlayer();
        if (this === player) hittingActors = this._logicManager.getActorByRegion(this, region);else hittingActors = [player];
        var result = false;
        for (var i = 0; i < hittingActors.length; i++) {
            var actor = hittingActors[i];
            if (actor.stuck(this, region.clone(), timePoint.attackType, timePoint.actValue[0], timePoint.attackParam)) result = true;
        }
        if (result && timePoint.sound && timePoint.sound !== 0) {
            cc.loader.loadRes("sound/" + timePoint.sound, cc.AudioClip, function (err, audioClip) {
                cc.audioEngine.playEffect(audioClip, false);
            });
        }
    },

    takeSkillSelfDelay: function takeSkillSelfDelay(timePoint) {
        this._attackEndTime = Global.syncTimer.getTimer() + timePoint.actValue[0];
    },

    takePlayEffect: function takePlayEffect(timePoint) {
        if (this._logicManager) {
            var pos = new cc.Vec2(this.node.x + timePoint.position.x, this.node.y + timePoint.position.y);
            this._logicManager.playEffect(timePoint.id, timePoint.layer, pos, this._direction == ActorDirection.LEFT);
        }
    },

    stuck: function stuck(actor, region, attackType, attackValue, attackParam) {
        if (this._isInvincible || this._isDead) return false;

        this.damage(attackValue);
        this.playHitEffect(region);

        if (this._moveStartTime > 0) this.stopMove();
        if (this._isAttacking) this.stopAttack();
        if (this._isDead) {
            if (this._floatStartTime <= 0) this.startFloat(0.7, 150, 150 * actor.getDirection());
        } else {
            switch (attackType) {
                case AttackType.NORMAL:
                    if (this._floatStartTime <= 0) this.startHurt(0.5, this._direction);
                    break;
                case AttackType.FLY:
                    this._remainComboValue -= attackParam.combo;
                    if (this._remainComboValue <= 0) {
                        this._remainComboValue = this._defaultComboValue;
                        this._isInvincible = true;
                    }
                    this.startFloat(attackParam.topTime, attackParam.topHeight, attackParam.distance * actor.getDirection());
                    break;
            }
        }

        return true;
    },

    damage: function damage(value) {
        this._hp -= value;
        if (this._hp < 0) this._hp = 0;
        if (this._hp === 0) {
            if (!this._isDead) {
                if (this !== this._logicManager.getPlayer()) this._logicManager.killMonster();
                this._isDead = true;
            }
        }
    },

    playReliveEffect: function playReliveEffect() {},

    playHitEffect: function playHitEffect(region) {
        var point = this.node.convertToNodeSpace(new cc.Vec2(region.x, region.y));
        region.x = point.x;
        region.y = point.y;
        var box = this._box.clone();
        if (this._direction == ActorDirection.LEFT) region.x = -region.x;
        var intersection = cc.rectIntersection(region, this._box);
        var pos = new cc.Vec2(this.node.x + intersection.center.x, this.node.y + intersection.center.y);
        var self = this;
        cc.loader.loadRes("prefab/effect/4", function (err, prefab) {
            var node = cc.instantiate(prefab);
            node.x = pos.x;
            node.y = pos.y;
            var animation = node.getComponent(cc.Animation);
            animation.on('finished', function (event) {
                node.removeFromParent();
            });
            self._map.addEffect(node, 1);
        });
    },

    getFixedMovePoint: function getFixedMovePoint(sx, sy, dx, dy) {
        var mapResult = this.getFixedMapMovePoint(sx, sy, dx, dy);
        var lockResult = this.getFixedLockRegionPoint(mapResult.sx, mapResult.sy, mapResult.dx, mapResult.dy);
        if (!lockResult.pass) {
            lockResult.pass = Math.floor(lockResult.sx) !== Math.floor(lockResult.dx) || Math.floor(lockResult.sy) !== Math.floor(lockResult.dy);
            return lockResult;
        } else {
            lockResult.pass = mapResult.pass;
            return lockResult;
        }
        return mapResult;
    },

    getFixedMapMovePoint: function getFixedMapMovePoint(sx, sy, dx, dy) {
        var mapPixesSize = this._map.getMapPixesSize();
        var mapPass = true;
        if (sx < 0) {
            sx = 0;
            mapPass = false;
        } else if (Math.floor(sx) >= mapPixesSize.width) {
            sx = mapPixesSize.width - 1;
            mapPass = false;
        }
        if (sy < 0) {
            sy = 0;
            mapPass = false;
        } else if (Math.floor(sy) >= mapPixesSize.height) {
            sy = mapPixesSize.height - 1;
            mapPass = false;
        }

        var uOut = false,
            vOut = false;
        if (dx < 0) {
            dx = 0;
            uOut = true;
        } else if (Math.floor(dx) >= mapPixesSize.width) {
            dx = mapPixesSize.width - 1;
            uOut = true;
        }
        if (dy < 0) {
            dy = 0;
            uOut = true;
        } else if (Math.floor(dy) >= mapPixesSize.height) {
            dy = mapPixesSize.height - 1;
            uOut = true;
        }

        if (uOut && vOut) mapPass = false;

        var linePass = true;
        if (mapPass) {
            var tileSize = this._map.getTileSize();
            var ux = sx / tileSize.width;
            var uy = sy / tileSize.height;
            var udx = dx / tileSize.width;
            var udy = dy / tileSize.height;
            var px = udx - ux;
            var py = udy - uy;
            var dist = Math.max(1, Math.max(Math.ceil(Math.abs(px)), Math.ceil(Math.abs(py))));

            px = px / dist;
            py = py / dist;
            for (var i = dist - 1; i > -1; i--) {
                var newX = Math.floor(ux + px);
                var newY = Math.floor(uy + py);
                var oldX = Math.floor(ux);
                var oldY = Math.floor(uy);
                if (this._map.checkMovePoint(newX, newY)) {
                    ux += px;
                    uy += py;
                } else if (this._map.checkMovePoint(newX, oldY)) {
                    ux += px;
                } else if (this._map.checkMovePoint(oldX, newY)) {
                    uy += py;
                } else {
                    linePass = false;
                    break;
                }
            }
            dx = Math.floor(ux * tileSize.width);
            dy = Math.floor(uy * tileSize.height);
        }

        return { pass: mapPass && linePass, sx: sx, sy: sy, dy: dy, dx: dx };
    },

    getFixedLockRegionPoint: function getFixedLockRegionPoint(sx, sy, dx, dy) {
        var lockRegion = this._map.lockRegion.clone();
        if (lockRegion.xMin === 0 && lockRegion.yMin === 0 && lockRegion.xMax === 0 && lockRegion.xMax === 0) {
            lockRegion.xMin = 0;
            lockRegion.yMin = 0;
            lockRegion.xMax = this._map.getMapPixesSize().width;
            lockRegion.yMax = this._map.getMapPixesSize().height;
        }
        var haltWidth = this.getCollision().width / 2;
        lockRegion.xMin += haltWidth;
        lockRegion.xMax -= haltWidth;
        var pass = true;
        if (lockRegion.contains(new cc.Vec2(sx, sy))) {
            if (dx <= lockRegion.xMin) {
                dx = lockRegion.xMin + 1;
                pass = false;
            } else if (dx >= lockRegion.xMax) {
                dx = lockRegion.xMax - 1;
                pass = false;
            }
            if (dy <= lockRegion.yMin) {
                dy = lockRegion.yMin + 1;
                pass = false;
            } else if (dy >= lockRegion.yMax) {
                dy = lockRegion.yMax - 1;
                pass = false;
            }
        }
        var result = { pass: pass, sx: sx, sy: sy, dy: dy, dx: dx };
        return result;
    }
});

cc._RFpop();