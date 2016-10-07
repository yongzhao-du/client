require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"LabelLocalized":[function(require,module,exports){
"use strict";
cc._RFpush(module, '86331p0XDZFjbhNNl/1cQhj', 'LabelLocalized');
// script\i18n\LabelLocalized.js

var i18n = require('i18n');
cc.Class({
    'extends': cc.Label,

    properties: {
        textKey: {
            'default': 'TEXT_KEY',
            multiline: true,
            tooltip: 'Enter i18n key here',
            notify: function notify() {
                if (this._sgNode) {
                    this._sgNode.setString(this.string);
                    this._updateNodeSize();
                }
            }
        },
        string: {
            override: true,
            tooltip: 'Here shows the localized string of Text Key',
            get: function get() {
                return i18n.t(this.textKey);
            },
            set: function set(value) {
                cc.warn('Please set label text key in Text Key property.');
            }
        }
    }
});

cc._RFpop();
},{"i18n":"i18n"}],"account_module":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0dd47c8iP1ITaiRCnOC563A', 'account_module');
// script\module\account_module.js

module.exports['class'] = cc.Class({

    properties: {
        isVip: {
            get: function get() {
                return this._isVip;
            },

            set: function set(value) {
                if (value && (typeof value === 'boolean' || value === 'true' || Boolean(value))) this._isVip = true;else this._isVip = false;
            }
        },

        goldNum: {
            get: function get() {
                return this._goldNum;
            },

            set: function set(value) {
                this._goldNum = parseInt(value) || 0;
            }
        },

        scoreNum: {
            get: function get() {
                return this._scoreNum;
            },

            set: function set(value) {
                this._scoreNum = parseInt(value) || 0;
            }
        },

        nickName: {
            get: function get() {
                return this._nickName;
            },

            set: function set(value) {
                this._nickName = value ? value.toString() : '';
            }
        },

        isFirstLogin: {
            get: function get() {
                return this._isFirstLogin;
            },

            set: function set(value) {
                if (value && (typeof value === 'boolean' || value === 'true' || Boolean(value))) this._isFirstLogin = true;else this._isFirstLogin = false;
            }
        },

        maxScore: {
            get: function get() {
                return this._maxScore;
            },

            set: function set(value) {
                this._maxScore = parseInt(value) || 0;
            }
        },

        power: {
            get: function get() {
                return this._power;
            },

            set: function set(value) {
                this._power = parseInt(value) || 0;
            }
        },

        nextPowerTime: {
            get: function get() {
                return this._nextPowerTime;
            },

            set: function set(value) {
                value = parseFloat(value);
                this._nextPowerTime = typeof value === 'number' ? value : this.defaultNextPowerTime;
            }
        },

        exchangeRate: {
            get: function get() {
                return this._exchangeRate;
            },

            set: function set(value) {
                this._exchangeRate = parseFloat(value) || this.defaultExchangeRate;
            }
        },

        defaultNextPowerTime: 300,
        defaultExchangeRate: 10
    },

    ctor: function ctor() {
        this.reset();
    },

    reset: function reset() {
        this._nickName = '';
        this.isFirstLogin = true;
        this._isVip = false;
        this._goldNum = 0;
        this._scoreNum = 0;
        this._maxScore = 0;
        this._power = 0;
        this._nextPowerTime = this.defaultNextPowerTime;
        this._exchangeRate = this.defaultExchangeRate;
    }

});

cc._RFpop();
},{}],"actor_ctrl":[function(require,module,exports){
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

        this._lastHitResult = false;
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

        this._lastHitResult = false;
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

    setHp: function setHp(value, max) {
        if (value < 0) value = 0;
        if (value < 1) value = 1;
        this._hpMax = value;
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
        var attackValue = timePoint.actValue[0];
        if (this === player) hittingActors = this._logicManager.getActorByRegion(this, region);else {
            hittingActors = [player];
            attackValue += (this._logicManager.getRound() - 1) * 20;
        }
        var result = false;
        for (var i = 0; i < hittingActors.length; i++) {
            var actor = hittingActors[i];
            if (actor.stuck(this, region.clone(), timePoint.attackType, attackValue, timePoint.attackParam)) result = true;
        }
        if (result && timePoint.sound && timePoint.sound !== 0) {
            cc.loader.loadRes("sound/" + timePoint.sound, cc.AudioClip, function (err, audioClip) {
                cc.audioEngine.playEffect(audioClip, false);
            });
        }
        this._lastHitResult = result;
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
},{"actor_define":"actor_define","skill_define":"skill_define"}],"actor_define":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ff52bHw3ypKM4JLxi2WhWL/', 'actor_define');
// script\actor\actor_define.js

module.exports = {
    ActorDirection: {
        LEFT: -1,
        RIGHT: 1
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
        RELIVE: 11
    },

    ActionName: ["idle", "prerun", "run", "attack_", "hurt", "hurt_fly", "hurt_fall", "collapse", "standup", "born", "disappear", "relive"],

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
        RELIVE: 12
    },

    ActionCompleteType: {
        COMPLETABLE: 0,
        UNCOMPLETABLE: 1,
        BREAKABLE: 2
    }
};

cc._RFpop();
},{}],"attack_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7f6bfIC/oVHIbKik8qM2HAC', 'attack_ctrl');
// script\scene\battle\attack_ctrl.js

var ControlDefine = require("control_define");
var ControlKey = ControlDefine.ControlKey;

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        attackA: {
            "default": null,
            type: cc.Node
        },

        attackB: {
            "default": null,
            type: cc.Node
        },

        actionTime: 0.1
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    setPlayer: function setPlayer(player) {
        this._playerCtrl = player;
    },

    onTouchStart: function onTouchStart(event) {
        this.doStartStaff();
        if (this._playerCtrl) this._playerCtrl.keyDown(ControlKey.HIT);
    },

    onTouchEnd: function onTouchEnd(event) {
        this.doEndStaff();
        //this._playerCtrl.keyDown(ControlKey.HIT);
        if (this._playerCtrl) this._playerCtrl.keyUp(ControlKey.HIT);
    },

    onTouchCancel: function onTouchCancel(event) {
        this.doEndStaff();
        if (this._playerCtrl) this._playerCtrl.keyUp(ControlKey.HIT);
    },

    doStartStaff: function doStartStaff() {
        this.attackA.stopAllActions();
        this.attackA.opacity = 255;
        var action = new cc.FadeOut(this.actionTime);
        this.attackA.runAction(action);
    },

    doEndStaff: function doEndStaff() {
        this.attackA.stopAllActions();
        this.attackA.opacity = 0;
        var time = (255 - this.attackA.opacity) / 255 * this.actionTime;
        var action = new cc.FadeIn(this.actionTime);
        this.attackA.runAction(action);
    }
});

cc._RFpop();
},{"control_define":"control_define"}],"battle_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ce518FHRl9AUpyhTwJXKm5u', 'battle_ctrl');
// script\scene\battle\battle_ctrl.js

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

cc._RFpop();
},{"control_define":"control_define","hurdle_define":"hurdle_define"}],"boot_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f0735HPSrZGa6+MPMhkvwbu', 'boot_ctrl');
// script\scene\boot_ctrl.js

cc.Class({
    "extends": cc.Component,

    onLoad: function onLoad() {
        this._loadedScene = false;
    },

    update: function update(dt) {
        if (Global.initted && !this._loadedScene) {
            this._loadedScene = true;
            GameUtil.loadScene("loading");
        }
    }
});

cc._RFpop();
},{}],"buffer_table":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2bcc03eY+1N3Zm1AaXpZiZU', 'buffer_table');
// script\util\buffer_table.js

module.exports['class'] = cc.Class({

    ctor: function ctor() {
        this._idx = -1;
        this._freeIdx = [];
        this._table = [];
    },

    allocIndex: function allocIndex() {
        var ret = 0;
        if (this._freeIdx.length > 0) {
            ret = this._freeIdx.pop();
        } else {
            ret = this._idx++;
        }
        return ret;
    },

    insert: function insert(obj) {
        var idx = this.allocIndex();
        if (idx >= this._table.length) {
            idx = this._table.length;
            this._table.push(obj);
        } else {
            this._table[idx] = obj;
        }
        return idx;
    },

    removeByIndex: function removeByIndex(idx) {
        if (idx >= this._table.length) return null;
        var obj = this._table[idx];
        this._table[idx] = null;
        this._freeIdx.push(idx);
        return obj;
    },

    removeByObject: function removeByObject(obj) {
        if (obj === null) return null;
        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] == obj) {
                return this.removeByIndex(i);
            }
        }
        return null;
    },

    getObject: function getObject(idx) {
        if (idx >= this._table.length) return null;
        return this._table[idx];
    },

    each: function each(func) {
        if (typeof func !== 'function') return;

        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] !== null) {
                func(i, this._table[i]);
            }
        }
    }

});

cc._RFpop();
},{}],"coin_not_enough":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fd4526pK39Ed7tQQUzceeQH', 'coin_not_enough');
// script\ui\coin_not_enough.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
    },

    onExchangeButtonClick: function onExchangeButtonClick() {
        this._uiCtrl.close();
        this._uiCtrl.manager.openUI('exchange_coin');
    },

    onCancelButtonClick: function onCancelButtonClick() {
        this._uiCtrl.close();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"control_define":[function(require,module,exports){
"use strict";
cc._RFpush(module, '31e42hl5RxEmJgA2FRrfno1', 'control_define');
// script\scene\battle\control_define.js

module.exports = {
    ControlKey: {
        NONE: 0,
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
        JUMP: 5,
        HIT: 6,
        SKILL1: 7,
        SKILL2: 8,
        SKILL3: 9,
        SKILL4: 10,
        SKILL5: 11,
        SKILL6: 12
    }
};

cc._RFpop();
},{}],"en":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd3733UqAWBArIuOn2GZGfTc', 'en');
// script\i18n\data\en.js

module.exports = {
    "GW_GAME": "GW Game"
};

cc._RFpop();
},{}],"exchange_coin":[function(require,module,exports){
"use strict";
cc._RFpush(module, '377a5Yd3yJGOpXKlNjS0oW3', 'exchange_coin');
// script\ui\exchange_coin.js

var exchangePoints = [1, 6, 38, 98, 588, 1688];

cc.Class({
    'extends': cc.Component,

    properties: {
        ownLabel: cc.Label,
        rateLabel: cc.Label,
        itemContent: cc.Node,
        itemPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._exchangeRate = Global.accountModule.exchangeRate;
        this._ownPoint = Global.accountModule.scoreNum;

        this.rateLabel.string = cc.js.formatStr(GameLang.t('exchange_format'), 1, this._exchangeRate);
        this.ownLabel.string = cc.js.formatStr(GameLang.t('own_point_format'), this._ownPoint);
    },

    start: function start() {
        for (var i = 0; i < exchangePoints.length; i++) {
            var node = cc.instantiate(this.itemPrefab);

            var label = node.getComponentInChildren(cc.Label);
            var point = exchangePoints[i];
            label.string = cc.js.formatStr(GameLang.t('exchange_format'), point, point * this._exchangeRate);

            var button = node.getComponentInChildren(cc.Button);
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this;
            eventHandler.component = "exchange_coin";
            eventHandler.handler = "onItemExchangeButtonClick";
            button.node.tag = i;
            button.clickEvents.push(eventHandler);

            node.parent = this.itemContent;
        }
    },

    onItemExchangeButtonClick: function onItemExchangeButtonClick(event) {
        var self = this;
        var target = event.target;
        var point = exchangePoints[target.tag];
        var coin = point * this._exchangeRate;
        var data = {
            message: cc.js.formatStr(GameLang.t('confirm_exchange_coin'), point, coin),
            callback: function callback(buttonId) {
                if (buttonId === 0) {
                    self._uiCtrl.close();
                    cc.log('exchange coin', coin);
                }
            }
        };
        this._uiCtrl.manager.openUI('message_box', data);
    },

    onCloseButtonClick: function onCloseButtonClick() {
        this._uiCtrl.close();
    }

});

cc._RFpop();
},{}],"game_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1d68dWIyGZFpIsIIJ1XAG0t', 'game_ctrl');
// script\scene\game_ctrl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        physicalNodes: {
            'default': [],
            type: [cc.Node]
        },

        countDownLabel: {
            'default': null,
            type: cc.Label
        },

        coinLabel: {
            'default': null,
            type: cc.Label
        },

        maxPhysical: 5,
        chargePhysicalTime: 600
    },

    onLoad: function onLoad() {
        this._uiManager = this.node.getComponent('ui_manager');
        this._physicalPoints = [];
        for (var i = 0; i < this.physicalNodes.length; i++) {
            var node = this.physicalNodes[i];
            this._physicalPoints.push(node.getComponent('physical_point'));
        }

        this._countDownTime = 0;
        this.updateCountDown();

        this._physical = 0;
        this.updatePhysical();

        this._countting = false;

        this._onCountDown = function () {
            this.onCountDown();
        };

        this._getGameDataHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GET_GAME_DATA, this.onGetGameData.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._getGameDataHandler);
        this._getGameDataHandler = null;
    },

    start: function start() {
        GameRpc.Clt2Srv.getGameData();
    },

    resetCountDown: function resetCountDown() {
        this.stopCountDown();
        this.startCountDown(Global.accountModule.nextPowerTime);
    },

    startCountDown: function startCountDown(time) {
        if (this._countting) return;
        this._countting = true;
        this._countDownTime = time;
        this.updateCountDown();
        this.schedule(this._onCountDown, 1);
    },

    stopCountDown: function stopCountDown() {
        if (!this._countting) return;
        this._countting = false;
        this.unschedule(this._onCountDown);
    },

    updateCountDown: function updateCountDown() {
        this.countDownLabel.string = TimeUtil.secToMS(this._countDownTime);
    },

    updatePhysical: function updatePhysical() {
        var i = 0;
        for (; i < this._physical; i++) this._physicalPoints[i].state = 0;
        for (; i < this.maxPhysical; i++) this._physicalPoints[i].state = 1;
    },

    chargePhysical: function chargePhysical() {
        if (this._physical >= this.maxPhysical) return;
        this._physical++;
        this.updatePhysical();
    },

    costPhysical: function costPhysical() {
        if (this._physical <= 0) return false;
        this._physical--;
        this.updatePhysical();
        return true;
    },

    onAddCoinButtonClick: function onAddCoinButtonClick() {
        //this._uiManager.openUI('exchange_coin');
        this._uiManager.openUI('physical_not_enough');
    },

    onCountDown: function onCountDown() {
        this._countDownTime--;
        if (this._countDownTime < 0) this._countDownTime = 0;
        if (this._countDownTime === 0) {
            this.chargePhysical();
            if (this._physical < this.maxPhysical) {
                this._countDownTime = this.chargePhysicalTime;
            } else {
                this.stopCountDown();
            }
        }
        this.updateCountDown();
    },

    onGetGameData: function onGetGameData() {
        this.coinLabel.string = Global.accountModule.goldNum;
        this._physical = Global.accountModule.power;
        this.updatePhysical();
        this.resetCountDown();
    },

    onPlayButtonClick: function onPlayButtonClick() {
        if (this.costPhysical()) {
            this.stopCountDown();
            GameUtil.loadScene('battle');
        } else {
            // 体力不足
        }
    }
});

cc._RFpop();
},{}],"game_event_dispatcher":[function(require,module,exports){
"use strict";
cc._RFpush(module, '70860atbBVFS6xH7IFaNTJ3', 'game_event_dispatcher');
// script\event\game_event_dispatcher.js

module.exports['class'] = cc.Class({

    // use this for initialization
    ctor: function ctor() {
        this._listeners = {};
    },

    emit: function emit(eventType, data) {
        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                handlers[k](eventType, data);
            }
        }
    },

    addEventHandler: function addEventHandler(eventType, handler) {
        if (typeof handler !== 'function') return;

        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                if (handlers[k] == handler) return;
            }
        }

        if (!handlers) {
            handlers = [];
            this._listeners[eventType] = handlers;
        }

        handlers.push(handler);

        return { type: eventType, id: handlers.length - 1 };
    },

    removeEventHandler: function removeEventHandler(enity) {
        var handlers = this._listeners[enity.type];
        if (handlers && enity.id >= 0 && enity.id < handlers.length) handlers.splice(enity.id, 1);
    },

    removeAllEventHandler: function removeAllEventHandler(eventType) {
        this._listeners[eventType] = null;
    },

    clear: function clear() {
        this._listeners = {};
    }
});

cc._RFpop();
},{}],"game_event":[function(require,module,exports){
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

    ON_RETRY_GAME: 0x00020001,
    ON_RETURN_GAME: 0x00020002,

    ON_FLOAT_MESSAGE: 0x00030001
};

cc._RFpop();
},{}],"game_net":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16ffcJzIqtEVoIaNDyvmlPj', 'game_net');
// script\network\game_net.js

var HttpConnection = require('http_connection')['class'];
var HttpUtil = require('http_util');
var GameProtocol = require('game_protocol');

module.exports['class'] = cc.Class({

    ctor: function ctor() {
        this._httpReauestInfo = null;
        this._httpHandlers = {};
        this._httpConnection = new HttpConnection();
        this._httpConnection.setCipherCode('fwe^*&3ijcdhf45543');
        this._httpConnection.setRespondCallback(this.httpRespond.bind(this));
    },

    retryHttpRequest: function retryHttpRequest() {
        if (!this._httpReauestInfo) return;
        this.httpRequest(this._httpReauestInfo.data, this._httpReauestInfo.callback);
    },

    httpRequest: function httpRequest(data, callback) {
        Global.gameEventDispatcher.emit(GameEvent.ON_HTTP_REQUEST);
        var self = this;
        var protocolId = data.gameMsgId;
        var url = GameProtocol.URLs[protocolId];
        this.addHttpRespondListener(protocolId, function (json) {
            self.removeHttpRespondListener(protocolId);
            self._httpReauestInfo = null;
            if (typeof callback === "function") callback(json);
        });
        this._httpReauestInfo = { data: data, callback: callback };
        this._httpConnection.request(url, data);
    },

    httpRespond: function httpRespond(stats, json) {
        Global.gameEventDispatcher.emit(GameEvent.ON_HTTP_RESPOND);
        if (stats == HttpUtil.Stats.OK) {
            var handler = this._httpHandlers[json.data.gameMsgId];
            handler && handler(json);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_NETWORK_ERROR);
            this.removeHttpRespondListener(this._httpReauestInfo.data.gameMsgId);
        }
    },

    addHttpRespondListener: function addHttpRespondListener(protocolId, handler) {
        this._httpHandlers[protocolId] = handler;
    },

    removeHttpRespondListener: function removeHttpRespondListener(protocolId, handler) {
        this._httpHandlers[protocolId] = null;
    }

});

cc._RFpop();
},{"game_protocol":"game_protocol","http_connection":"http_connection","http_util":"http_util"}],"game_protocol":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fcf7c3YDPJJtrl5jZjSc3rP', 'game_protocol');
// script\network\game_protocol.js

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

cc._RFpop();
},{}],"game_rpc":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b077ehJPOBD3KdVxs3tlb1I', 'game_rpc');
// script\network\game_rpc.js

var GameProtocol = require("game_protocol");

var Srv2Clt = {
    retLogin: function retLogin(json) {
        cc.log("retLogin:" + json.data.errorMsg);
        if (json.code === 1) Global.loginModule.token = json.data.token;
        Global.gameEventDispatcher.emit(GameEvent.ON_LOGIN_RESULT, json);
    },

    retGetGameData: function retGetGameData(json) {
        cc.log("retGetGameData:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.isVip = json.data.isVIP;
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.scoreNum = json.data.scoreNum;
            Global.accountModule.nickName = json.data.nikename;
            Global.accountModule.isFirstLogin = json.data.isFirst;
            Global.accountModule.maxScore = json.data.maxScore;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.accountModule.exchangeRate = json.data.oneIntegralGoldNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_GET_GAME_DATA);
        }
    },

    retExchangeGold: function retExchangeGold(json) {
        cc.log("retExchangeGold:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.scoreNum = json.data.scoreNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_EXCHANGE_GOLD);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retStartGame: function retStartGame(json) {
        cc.log("retStartGame:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.maxScore = json.data.maxScore;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.gameEventDispatcher.emit(GameEvent.ON_START_GAME);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retBuyFullPhysical: function retBuyFullPhysical(json) {
        cc.log("retBuyFullPhysical:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.accountModule.power = json.data.power;
            Global.accountModule.nextPowerTime = json.data.nextPowerTime;
            Global.gameEventDispatcher.emit(GameEvent.ON_BUY_PHYSICAL);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retBuyTimeToPlayGame: function retBuyTimeToPlayGame(json) {
        cc.log("retBuyTimeToPlayGame:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.goldNum = json.data.goldNum;
            Global.gameEventDispatcher.emit(GameEvent.ON_BUY_TIME_TO_PLAY);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    },

    retGameResult: function retGameResult(json) {
        cc.log("retGameResult:" + json.data.errorMsg);
        if (json.code === 1) {
            Global.accountModule.maxScore = json.data.maxScore;
            Global.gameEventDispatcher.emit(GameEvent.ON_GAME_RESULT);
        } else {
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, json.data.errorMsg);
        }
    }
};
module.exports.Srv2Clt = Srv2Clt;

var Clt2Srv = {
    login: function login(account, passwd) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.LOGIN,
            account: account,
            password: passwd
        }, Srv2Clt.retLogin);
    },

    getGameData: function getGameData() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.GET_DATA,
            token: Global.loginModule.token
        }, Srv2Clt.retGetGameData);
    },

    exchangeGold: function exchangeGold(gold) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.EXCHANGE_GOLD,
            token: Global.loginModule.token,
            needGold: gold
        }, Srv2Clt.retExchangeGold);
    },

    startGame: function startGame() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.START_GAME,
            token: Global.loginModule.token
        }, Srv2Clt.retStartGame);
    },

    buyFullPhysical: function buyFullPhysical() {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.FULL_POWER,
            token: Global.loginModule.token
        }, Srv2Clt.retBuyFullPhysical);
    },

    buyTimeToPlayGame: function buyTimeToPlayGame(times) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.CONTINUE_GAME,
            token: Global.loginModule.token,
            level: times
        }, Srv2Clt.retBuyTimeToPlayGame);
    },

    gameResult: function gameResult(score) {
        Global.gameNet.httpRequest({
            type: Global.gameType,
            gameMsgId: GameProtocol.Protocol.CONTINUE_GAME,
            token: Global.loginModule.token,
            score: score
        }, Srv2Clt.retGameResult);
    }
};
module.exports.Clt2Srv = Clt2Srv;

cc._RFpop();
},{"game_protocol":"game_protocol"}],"game_util":[function(require,module,exports){
"use strict";
cc._RFpush(module, '50316CDRwtLV7cYFQQ0CXLQ', 'game_util');
// script\util\game_util.js

module.exports = {

    loadScene: function loadScene(name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    }

};

cc._RFpop();
},{}],"http_connection":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a840dIfdghC85ZbDPCWi1M3', 'http_connection');
// script\network\connection\http_connection.js

var HttpUtil = require("http_util");
var XXTEA = require("xxtea");

module.exports["class"] = cc.Class({
    ctor: function ctor() {
        this._cipherCode = 'q1w2e3r4t5y6u7i8o9p0';
        this._respondCallback = null;
    },

    setCipherCode: function setCipherCode(code) {
        this._cipherCode = code;
    },

    setRespondCallback: function setRespondCallback(callback) {
        if (typeof callback === 'function') this._respondCallback = callback;
    },

    request: function request(url, data) {
        var json = XXTEA.utf16to8(JSON.stringify(data).trim());
        var encrypt = XXTEA.encrypt(json, this._cipherCode);
        var encode = XXTEA.base64encode(encrypt);
        encode = encode.replace(/\+/g, '%2B');
        HttpUtil.request(url, HttpUtil.Method.POST, { msgData: encode }, this.respond.bind(this));
    },

    respond: function respond(stats, response) {
        if (this._respondCallback) {
            if (stats == HttpUtil.Stats.OK) {
                var json = JSON.parse(response);
                var decode = XXTEA.base64decode(json.msgData);
                var decrypt = XXTEA.decrypt(decode, this._cipherCode);
                var content = JSON.parse(decrypt);
                this._respondCallback(stats, { code: json.ResultCode, data: content });
            } else if (stats == HttpUtil.Stats.FAIL) {
                this._respondCallback(stats);
            }
        }
    }
});

cc._RFpop();
},{"http_util":"http_util","xxtea":"xxtea"}],"http_util":[function(require,module,exports){
"use strict";
cc._RFpush(module, '742cc9iuF9PorN3clInHX4L', 'http_util');
// script\lib\util\http_util.js

var Method = {
    GET: 'GET',
    POST: 'POST'
};

var Stats = {
    OK: 0,
    FAIL: 1
};

module.exports.Method = Method;

module.exports.Stats = Stats;

module.exports.request = function (url, method, args, callback) {
    var success = true;

    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        cc.log('onreadystatechange');
        var response = xhr.responseText;
        if (typeof callback === 'function') {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                callback(Stats.OK, response);
            } else {
                callback(Stats.FAIL);
            }
        }
    };

    var isFirst = true;
    var argString = '';
    for (var key in args) {
        if (isFirst) {
            argString += key + "=" + args[key];
            isFirst = false;
        } else {
            argString += '&' + key + '=' + args[key];
        }
    }

    if (method === Method.GET) {
        if (argString.length === 0) xhr.open(method, url, true);else xhr.open(method, url + argString, true);
    } else if (method === Method.POST) {
        xhr.open(method, url, true);
    }
    if (cc.sys.isNative) xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");

    ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
        xhr["on" + eventname] = function () {
            cc.log("\nEvent : " + eventname);
            if (eventname === 'error') {
                success = false;
            } else if (eventname === 'loadend' && !success) {
                callback(Stats.FAIL);
            }
        };
    });

    if (method === Method.GET) {
        xhr.send();
    } else if (method === Method.POST) {
        xhr.send(argString);
    }
};

cc._RFpop();
},{}],"hurdle_cfg":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c4a7eIAoghMRJQWYrYJKLO5', 'hurdle_cfg');
// script\config\data\hurdle_cfg.js

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

cc._RFpop();
},{}],"hurdle_define":[function(require,module,exports){
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
    MOVE_CAMERA: 7
};

module.exports.CondType = {
    NONE: 0,
    TOTAL_MON_KILL: 1,
    CONFIG_CUSTOM: 2
};

cc._RFpop();
},{}],"hurdle_provider":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'af6d3P51p9KEIJo2GCx3WKa', 'hurdle_provider');
// script\config\provider\hurdle_provider.js

var cfg = require('hurdle_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};

cc._RFpop();
},{"hurdle_cfg":"hurdle_cfg"}],"i18n":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a4820g69mBLp7tlCZfD3MDE', 'i18n');
// script\i18n\i18n.js

var Polyglot = require('polyglot');
var language = require('zh'); // update this to set your default displaying language in editor

// let polyglot = null;
var polyglot = new Polyglot({ phrases: language });

module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name 
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init 
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init: function init(language) {
        var data = require(language);
        polyglot.replace(data);
    },
    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     * 
     * var myText = i18n.t('MY_TEXT_KEY');
     * 
     * // if your data source is defined as 
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text 
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t: function t(key, opt) {
        return polyglot.t(key, opt);
    }
};

cc._RFpop();
},{"polyglot":"polyglot","zh":"zh"}],"init_config":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5f1a0/5i91KxrsJn71PGfY2', 'init_config');
// script\config\init_config.js

module.exports.exec = function () {
    Global.hurdleProvider = require('hurdle_provider');
    Global.skillProvider = require('skill_provider');
};

cc._RFpop();
},{"hurdle_provider":"hurdle_provider","skill_provider":"skill_provider"}],"init_module":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7e948j43sJDA4eOTfastjLi', 'init_module');
// script\module\init_module.js

var LoginModule = require('login_module')['class'];
var AccountModule = require('account_module')['class'];

module.exports.exec = function () {
    Global.loginModule = new LoginModule();
    Global.accountModule = new AccountModule();
};

cc._RFpop();
},{"account_module":"account_module","login_module":"login_module"}],"joy_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3fd486Z0xpMtYai4dS3jgdr', 'joy_ctrl');
// script\scene\battle\joy_ctrl.js

var ControlDefine = require("control_define");
var ControlKey = ControlDefine.ControlKey;

cc.Class({
    "extends": cc.Component,

    properties: {
        background: {
            "default": null,
            type: cc.Node
        },

        stick: {
            "default": null,
            type: cc.Node
        },

        stickMoveRadius: 100,

        stickKickbackTime: 0.3,

        backgroundLowAlpha: 50,

        backgroundHighAlpha: 255,

        backgroundFadeTime: 0.2
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._movePos = new cc.Vec2();
        this._dirction = new cc.Vec2();
        this.background.opacity = this.backgroundLowAlpha;

        this.background.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    setPlayer: function setPlayer(player) {
        this._playerCtrl = player;
    },

    onTouchStart: function onTouchStart(event) {
        this.doStartStaff();
        var location = this.node.convertTouchToNodeSpace(event);
        this.updateStickPosition(location);
    },

    onTouchMove: function onTouchMove(event) {
        var location = this.node.convertTouchToNodeSpace(event);
        this.updateStickPosition(location);
    },

    onTouchEnd: function onTouchEnd(event) {
        this.doEndStaff();
    },

    onTouchCancel: function onTouchCancel(event) {
        this.doEndStaff();
    },

    updateStickPosition: function updateStickPosition(location) {
        var radius = Math.sqrt(Math.pow(location.x, 2) + Math.pow(location.y, 2));
        if (radius > this.stickMoveRadius) {
            var scale = this.stickMoveRadius / radius;
            location.x *= scale;
            location.y *= scale;
        }

        if (location.x === 0 && location.y === 0) {
            this._dirction.x = 0;
            this._dirction.y = 0;
        } else {
            var r = Math.atan2(location.x, location.y);
            var d = Math.floor(180 - r * 180 / Math.PI) - 67.5;
            if (d < 0) d = 360 + d;
            d = Math.floor(d / 45);

            switch (d) {
                case 0:
                    this._dirction.x = 1;
                    this._dirction.y = 0;
                    break;
                case 1:
                    this._dirction.x = 1;
                    this._dirction.y = 1;
                    break;
                case 2:
                    this._dirction.x = 0;
                    this._dirction.y = 1;
                    break;
                case 3:
                    this._dirction.x = -1;
                    this._dirction.y = 1;
                    break;
                case 4:
                    this._dirction.x = -1;
                    this._dirction.y = 0;
                    break;
                case 5:
                    this._dirction.x = -1;
                    this._dirction.y = -1;
                    break;
                case 6:
                    this._dirction.x = 0;
                    this._dirction.y = -1;
                    break;
                case 7:
                    this._dirction.x = 1;
                    this._dirction.y = -1;
                    break;
            }
        }

        this.stick.x = location.x;
        this.stick.y = location.y;

        if (this._playerCtrl) {
            this._dirction.x == 1 ? this._playerCtrl.keyDown(ControlKey.RIGHT) : this._playerCtrl.keyUp(ControlKey.RIGHT);
            this._dirction.x == -1 ? this._playerCtrl.keyDown(ControlKey.LEFT) : this._playerCtrl.keyUp(ControlKey.LEFT);
            this._dirction.y == 1 ? this._playerCtrl.keyDown(ControlKey.UP) : this._playerCtrl.keyUp(ControlKey.UP);
            this._dirction.y == -1 ? this._playerCtrl.keyDown(ControlKey.DOWN) : this._playerCtrl.keyUp(ControlKey.DOWN);
        }
    },

    doStartStaff: function doStartStaff() {
        this.stick.stopAllActions();
        this.background.stopAllActions();
        var time = (this.backgroundHighAlpha - this.background.opacity) / (this.backgroundHighAlpha - this.backgroundLowAlpha) * this.backgroundFadeTime;
        var action = new cc.FadeTo(time, this.backgroundHighAlpha);
        this.background.runAction(action);
    },

    doEndStaff: function doEndStaff() {
        this.background.stopAllActions();
        var time = (this.background.opacity - this.backgroundLowAlpha) / (this.backgroundHighAlpha - this.backgroundLowAlpha) * this.backgroundFadeTime;
        var action = new cc.FadeTo(time, this.backgroundLowAlpha);
        this.background.runAction(action);

        action = new cc.MoveTo(this.stickKickbackTime, 0, 0);
        action.easing(new cc.easeBackOut());
        this.stick.runAction(action);

        this._dirction.x = 0;
        this._dirction.y = 0;

        if (this._playerCtrl) {
            this._playerCtrl.keyUp(ControlKey.RIGHT);
            this._playerCtrl.keyUp(ControlKey.LEFT);
            this._playerCtrl.keyUp(ControlKey.UP);
            this._playerCtrl.keyUp(ControlKey.DOWN);
        }
    },

    getDirection: function getDirection() {
        return this._dirction;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"control_define":"control_define"}],"loading_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '75397RCSR9FnLCqGV1/Z6aD', 'loading_ctrl');
// script\scene\loading_ctrl.js

var STATE_DEFAULT = -1;
var STATE_CHECK_UPDATE = 0;
var STATE_UPDATING = 1;
var STATE_LOAD_ASSETS = 2;
var STATE_INIT_GAME = 3;
var STATE_ENTER_GAME = 4;
var STATE_DONE = 5;

var LoadingStateInfo = [{
    start: 0,
    end: 0.02,
    lang: 'checking_update'
}, {
    start: 0.02,
    end: 0.05,
    lang: 'updating_assets'
}, {
    start: 0.05,
    end: 0.9,
    lang: 'loading_assets'
}, {
    start: 0.9,
    end: 1,
    lang: 'initting_game'
}, {
    start: 1,
    end: 1,
    lang: 'entering_game'
}];

var PanelType = {
    NONE: 0,
    CONFIRM: 1,
    START_UPDATE: 2,
    RETRY_UPDATE: 3
};

cc.Class({
    'extends': cc.Component,

    properties: {

        remoteAssetPath: 'remote_assset',

        localManifest: {
            'default': null,
            url: cc.RawAsset
        },

        updatePanel: {
            'default': null,
            type: cc.Node
        },

        updateMessage: {
            'default': null,
            type: cc.Label
        },

        updateProgress: {
            'default': null,
            type: cc.ProgressBar
        },

        updateConfirmButton: {
            'default': null,
            type: cc.Button
        },

        updateConfirmLabel: {
            'default': null,
            type: cc.Label
        },

        updateCancelButton: {
            'default': null,
            type: cc.Button
        },

        updateCancelLabel: {
            'default': null,
            type: cc.Label
        },

        loadingMessage: {
            'default': null,
            type: cc.Label
        },

        loadingPercent: {
            'default': null,
            type: cc.Label
        },

        loadingProgress: {
            'default': null,
            type: cc.ProgressBar
        },

        loadingParticle: {
            'default': null,
            type: cc.ParticleSystem
        },

        loadAssetTime: 2,
        enterGameTime: 1
    },

    onLoad: function onLoad() {
        this._state = STATE_DEFAULT;
        this._needUpdate = false;
        this._needRetry = false;
        this._loadAssetStartTime = 0;
        this.loadingPercent.string = '';
        this.loadingMessage.string = '';
        this.loadingParticle.node.x = -249.5;
        this.showUpdatePanel(PanelType.NONE);
    },

    onDestroy: function onDestroy() {
        this.removeCheckListener();
        this.removeUpdateListener();
        if (this._am) {
            this._am.release();
            this._am = null;
        }
    },

    removeCheckListener: function removeCheckListener() {
        if (this._checkListener) {
            cc.eventManager.removeListener(this._checkListener);
            this._checkListener = null;
        }
    },

    removeUpdateListener: function removeUpdateListener() {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },

    start: function start() {
        // 只有原生代码需要用热更新功能
        //this.setState(cc.sys.isNative ? STATE_CHECK_UPDATE : STATE_LOAD_ASSETS);
        this.setState(STATE_LOAD_ASSETS);
    },

    setState: function setState(state) {
        if (this._state == state) return;
        this._state = state;
        if (state != STATE_DEFAULT && state != STATE_DONE) {
            this.setLoadingPercent(LoadingStateInfo[state].start);
            this.loadingMessage.string = GameLang.t(LoadingStateInfo[state].lang);
        }
        switch (state) {
            case STATE_CHECK_UPDATE:
                this.checkUpdate();
                break;
            case STATE_UPDATING:
                break;
            case STATE_LOAD_ASSETS:
                this.startLoadAssets();
                break;
            case STATE_INIT_GAME:
                this.initGame();
                break;
            case STATE_ENTER_GAME:
                this.startEnterGame();
                break;
            default:
                break;
        }
    },

    setUpdatePercent: function setUpdatePercent(percent) {
        if (percent < 0) percent = 0;else if (percent > 1) percent = 1;
        this.updateMessage.string = GameLang.t('update_percent') + Math.ceil(percent * 100).toString() + "%";
        this.updateProgress.progress = percent;
    },

    setLoadingPercent: function setLoadingPercent(percent) {
        if (percent < 0) percent = 0;else if (percent > 1) percent = 1;
        this.loadingPercent.string = Math.ceil(percent * 100).toString() + "%";
        this.loadingProgress.progress = percent;
        this.loadingParticle.node.x = percent * 499 - 249.5;
    },

    checkCb: function checkCb(event) {
        cc.log('Code: ' + event.getEventCode());

        var needRemove = true;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.showUpdatePanel(PanelType.CONFIRM);
                break;
            default:
                needRemove = false;
                break;
        }

        if (needRemove) this.removeCheckListener();
    },

    updateCb: function updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();
                var msg = event.getMessage();
                if (msg) cc.log(msg);
                cc.log(percent.toFixed(2) + '%');
                this.setUpdatePercent(percent);
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;

            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                failed = true;
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this.removeUpdateListener();
            this._needRetry = true;
            this.showUpdatePanel(PanelType.RETRY_UPDATE);
        }

        if (needRestart) {
            this.removeUpdateListener();
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            //cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.game.restart();
        }
    },

    checkUpdate: function checkUpdate() {
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this.remoteAssetPath;
        cc.log('Storage path for remote asset : ' + storagePath);

        if (!this._am) {
            this._am = new jsb.AssetsManager(this.localManifest, storagePath);
            this._am.retain();
        }

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded()) {
            if (!this._checkListener) {
                this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
                cc.eventManager.addListener(this._checkListener, 1);
            }
            this._am.checkUpdate();
        }
    },

    startLoadAssets: function startLoadAssets() {
        this._loadAssetStartTime = Global.syncTimer.getTimer();
    },

    startEnterGame: function startEnterGame() {
        this._enterGameEndTime = Global.syncTimer.getTimer() + this.enterGameTime;
    },

    initGame: function initGame() {
        require('init_config').exec();
        require('init_module').exec();
    },

    enterGame: function enterGame() {
        GameUtil.loadScene("login");
    },

    showUpdatePanel: function showUpdatePanel(type) {
        if (type == PanelType.NONE) {
            this.updatePanel.active = false;
            return;
        }
        switch (type) {
            case PanelType.CONFIRM:
                this.updateConfirmButton.active = true;
                this.updateCancelButton.active = true;
                this.updateProgress.active = false;
                this.updateConfirmLabel.string = GameLang.t('start_update');
                this.updateCancelLabel.string = GameLang.t('exit_game');
                this.updateMessage.string = GameLang.t('confirm_update');
                break;
            case PanelType.START_UPDATE:
                this.updateConfirmButton.active = false;
                this.updateCancelButton.active = false;
                this.updateProgress.active = true;
                this.setUpdatePercent(0);
                break;
            case PanelType.RETRY_UPDATE:
                this.updateConfirmButton.active = true;
                this.updateCancelButton.active = true;
                this.updateProgress.active = false;
                this.updateConfirmLabel.string = GameLang.t('retry_update');
                this.updateCancelLabel.string = GameLang.t('exit_game');
                this.updateMessage.string = GameLang.t('fail_update');
                break;
            default:
                break;
        }
        this.updatePanel.active = true;
    },

    doUpdate: function doUpdate() {
        if (!this._am) return;
        if (!this._updateListener) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);
        }
        this.setState(STATE_UPDATING);
        this._am.update();
    },

    onConfirmClick: function onConfirmClick() {
        if (this._needRetry || this._needUpdate) {
            this.showUpdatePanel(PanelType.START_UPDATE);
            this.doUpdate();
        }
    },

    onCancelClick: function onCancelClick() {
        cc.director.end();
    },

    update: function update(dt) {
        switch (this._state) {
            case STATE_LOAD_ASSETS:
                var timeElapased = Global.syncTimer.getTimer() - this._loadAssetStartTime;
                if (timeElapased > this.loadAssetTime) {
                    this._loadAssetStartTime = 0;
                    this.setState(STATE_INIT_GAME);
                    return;
                }
                var loadInfo = LoadingStateInfo[STATE_LOAD_ASSETS];
                var assetLoadPercent = timeElapased / this.loadAssetTime;
                var totalLoadPercent = (loadInfo.end - loadInfo.start) * assetLoadPercent + loadInfo.start;
                this.setLoadingPercent(totalLoadPercent);
                break;
            case STATE_INIT_GAME:
                this.setState(STATE_ENTER_GAME);
                break;
            case STATE_ENTER_GAME:
                if (Global.syncTimer.getTimer() >= this._enterGameEndTime) {
                    this._enterGameEndTime = 0;
                    this.enterGame();
                    this.setState(STATE_DONE);
                }
                break;
            default:
                break;
        }
    }
});

cc._RFpop();
},{"init_config":"init_config","init_module":"init_module"}],"login_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '680bcLQsn5JH7GYTZWH1DPQ', 'login_ctrl');
// script\scene\login_ctrl.js

cc.Class({
    'extends': cc.Component,

    properties: {

        accountEdit: {
            'default': null,
            type: cc.EditBox
        },

        passwdEdit: {
            'default': null,
            type: cc.EditBox
        },

        msgLabel: {
            'default': null,
            type: cc.Label
        },

        accountSelectPanel: {
            'default': null,
            type: cc.Node
        },

        accountScrollView: {
            'default': null,
            type: cc.ScrollView
        }
    },

    onLoad: function onLoad() {
        this.msgLabel.node.active = false;
        this.accountSelectPanel.active = false;

        this.readLoginInfo();
        this.addEvent();
    },

    onDestroy: function onDestroy() {
        this.removeEvent();
    },

    addEvent: function addEvent() {
        this._loginHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_LOGIN_RESULT, this.onLoginResult.bind(this));
    },

    removeEvent: function removeEvent() {
        Global.gameEventDispatcher.removeEventHandler(this._loginHandler);
        this._loginHandler = null;
    },

    saveLoginInfo: function saveLoginInfo() {
        cc.sys.localStorage.setItem('account', this._loginAccount);
        cc.sys.localStorage.setItem('password', this._loginPasswd);
    },

    readLoginInfo: function readLoginInfo() {
        this._loginAccount = cc.sys.localStorage.getItem('account') || '';
        this._loginPasswd = cc.sys.localStorage.getItem('password') || '';
        this.accountEdit.string = this._loginAccount;
        this.passwdEdit.string = this._loginPasswd;
    },

    setAccountList: function setAccountList(list) {
        this.accountScrollView.content.removeAllChildren();
        var self = this;
        var keys = [];
        for (var k in list) {
            keys.push(k);
            cc.loader.loadRes('prefab/ui/components/account_item', cc.Prefab, function (err, prefab) {
                var node = cc.instantiate(prefab);
                var button = node.getChildByName('button');
                var label = node.getChildByName('name_label').getComponent(cc.Label);
                var key = keys.shift();
                label.string = list[key];
                button.on('touchend', function () {
                    self.accountSelectPanel.active = false;
                    self._loginAccount = list[key];
                    GameRpc.Clt2Srv.login(self._loginAccount, self._loginPasswd);
                });
                self.accountScrollView.content.addChild(node);
            });
        }
    },

    onLoginResult: function onLoginResult(eventType, data) {
        if (data.code == 1) {
            cc.log("Login Success", data.data.token);
            this.saveLoginInfo();
            GameUtil.loadScene('game');
        } else if (data.data.gaiNumber) {
            cc.log("Multi Account");
            this.setAccountList(data.data.gaiNumber);
            this.accountSelectPanel.active = true;
            this.msgLabel.node.active = false;
        } else {
            cc.log("Account or Password incorrect");
            this.msgLabel.string = data.data.errorMsg;
            this.msgLabel.node.active = true;
        }
    },

    onLoginButtonClick: function onLoginButtonClick() {
        var account = this.accountEdit.string;
        var passwd = this.passwdEdit.string;
        if (account.length <= 0) {
            this.msgLabel.string = GameLang.t('account_not_empty');
            this.msgLabel.node.active = true;
            return;
        }
        if (passwd.length <= 0) {
            this.msgLabel.string = GameLang.t('passwd_not_empty');
            this.msgLabel.node.active = true;
            return;
        }

        this._loginAccount = this.accountEdit.string;
        this._loginPasswd = this.passwdEdit.string;
        GameRpc.Clt2Srv.login(this._loginAccount, this._loginPasswd);
    },

    onRegisteButtonClick: function onRegisteButtonClick() {
        cc.log("registe");
    },

    onForgetButtonClick: function onForgetButtonClick() {
        cc.log("forget");
    }

});

cc._RFpop();
},{}],"login_module":[function(require,module,exports){
"use strict";
cc._RFpush(module, '51036RGk3xAj6laeCPUTt6w', 'login_module');
// script\module\login_module.js

module.exports['class'] = cc.Class({

    properties: {
        token: {
            get: function get() {
                return this._token;
            },

            set: function set(value) {
                this._token = value.toString();
            }
        }
    },

    ctor: function ctor() {
        this.reset();
    },

    reset: function reset() {
        this._token = '';
    }

});

cc._RFpop();
},{}],"main":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ddfc1f/33JLop678gN4TdnV', 'main');
// script\main.js

var SyncTimer = require('sync_timer')['class'];
var GameNet = require('game_net')['class'];
var GameEventDispatcher = require("game_event_dispatcher")['class'];

window.GameUtil = require('game_util');
window.TimeUtil = require('time_util');

window.GameLang = require('i18n');
window.GameRpc = require('game_rpc');
window.GameEvent = require('game_event');

window.Global = {};
Global.initted = false;

cc.Class({
    'extends': cc.Component,

    onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    update: function update(dt) {
        if (!Global.initted) this.init();else this.gameUpdate(dt);
    },

    init: function init() {
        Global.gameType = 36;
        Global.syncTimer = new SyncTimer();
        Global.gameNet = new GameNet();
        Global.gameEventDispatcher = new GameEventDispatcher();
        Global.initted = true;
    },

    gameUpdate: function gameUpdate(dt) {
        Global.syncTimer.update(dt);
    }
});

cc._RFpop();
},{"game_event":"game_event","game_event_dispatcher":"game_event_dispatcher","game_net":"game_net","game_rpc":"game_rpc","game_util":"game_util","i18n":"i18n","sync_timer":"sync_timer","time_util":"time_util"}],"map_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1b4beHedehEH6eLnyWhRNlC', 'map_ctrl');
// script\map\map_ctrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        lockRegion: {
            set: function set(region) {
                if (this._lockRegion.equals(region)) return;
                if (region.x < 0) region.x = 0;
                if (region.y < 0) region.y = 0;
                if (region.width === 0 || region.xMax >= this._mapPixesSize.width) region.width = this._mapPixesSize.width - region.x;
                if (region.height === 0 || region.yMax >= this._mapPixesSize.height) region.height = this._mapPixesSize.height - region.y;
                this._oldLockRegion = this._currLockRegion;
                this._lockRegion = region.clone();
            },

            get: function get() {
                return this._lockRegion;
            }
        },

        layerSize: {
            "default": [],
            type: [cc.Size]
        },

        viewSize: new cc.Size()
    },

    getCurrPosition: function getCurrPosition() {
        return this._currPos;
    },

    getCameraPosition: function getCameraPosition() {
        return this._cameraCurrPoint;
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._enities = [];

        this._tmxLayer = this.node.getChildByName("tmx");
        this._tmxCtrl = this._tmxLayer.getComponent(cc.TiledMap);
        this._groundCtrl = this._tmxCtrl.getLayer("ground");

        this._tileSize = this._tmxCtrl.getTileSize();
        this._mapSize = this._tmxCtrl.getMapSize();
        this._mapPixesSize = new cc.Size(this._mapSize.width * this._tileSize.width, this._mapSize.height * this._tileSize.height);

        this._lockX = false;
        this._lockY = false;
        this._lockRegion = new cc.Rect(0, 0, this._mapPixesSize.width, this._mapPixesSize.height);

        this._pivotCurr = new cc.Vec2();
        this._pivotStart = new cc.Vec2();
        this._pivotTarget = new cc.Vec2();
        this._pivotChangeSpeed = new cc.Vec2();
        this._pivotChangeStartTime = 0;
        this._pivotChangeEndTime = 0;

        this._currPos = new cc.Vec2();
        this._isPositionDirty = true;

        this._cameraMoveStartTime = 0;
        this._cameraMoveEndTime = 0;
        this._cameraCurrPoint = new cc.Vec2();
        this._cameraTargetPoint = new cc.Vec2();
        this._cameraStartPoint = new cc.Vec2();
        this._cameraMoveSpeed = new cc.Vec2();
        this._cameraMovedLock = false;

        this._otherLayer = this.node.getChildByName("other_layer");
        this._objectLayer = this.node.getChildByName("object_layer");
        this._effectLayers = [];

        var i, layer;
        for (i = 0;; i++) {
            layer = this.node.getChildByName("effect_layer_" + i);
            if (!layer) break;
            this._effectLayers.push(layer);
        }
        this._layers = [];
        for (i = 0;; i++) {
            layer = this.node.getChildByName("layer_" + i);
            if (!layer) break;
            this._layers.push(layer);
        }
    },

    reset: function reset() {
        while (this._enities.length > 0) {
            var node = this._enities.pop();
            node.parent = null;
        }

        this._lockX = false;
        this._lockY = false;
        this._lockRegion.x = 0, this._lockRegion.y = 0, this._lockRegion.wdith = this._mapPixesSize.width, this._lockRegion.height = this._mapPixesSize.height, this._pivotCurr.x = this._pivotCurr.y = 0;
        this._pivotStart.x = this._pivotStart.y = 0;
        this._pivotTarget.x = this._pivotTarget.y = 0;
        this._pivotChangeSpeed.x = this._pivotChangeSpeed.y = 0;
        this._pivotChangeStartTime = 0;
        this._pivotChangeEndTime = 0;

        this._currPos.x = 0;
        this._currPos.y = 0;
        this._isPositionDirty = false;

        this._cameraMoveStartTime = 0;
        this._cameraMoveEndTime = 0;
        this._cameraCurrPoint.x = this._cameraCurrPoint.y = 0;
        this._cameraTargetPoint.x = this._cameraTargetPoint.y = 0;
        this._cameraStartPoint.x = this._cameraStartPoint.y = 0;
        this._cameraMoveSpeed.x = this._cameraMoveSpeed.y = 0;
        this._cameraMovedLock = false;

        this.updateViewRange();
    },

    addEnity: function addEnity(enity) {
        this._objectLayer.addChild(enity);
        this._enities.push(enity);
    },

    removeEnity: function removeEnity(enity) {
        for (var i = 0; i < this._enities.length; i++) {
            if (enity == this._enities[i]) {
                this._enities.splice(i, 1);
                break;
            }
        }
    },

    addEffect: function addEffect(effect, index) {
        this._effectLayers[index].addChild(effect);
    },

    checkMovePoint: function checkMovePoint(col, row) {
        row = this._mapSize.height - row - 1;
        var gid = this._groundCtrl.getTileGIDAt(col, row);
        if (gid === 0) return false;
        var prop = this._tmxCtrl.getPropertiesForGID(gid);
        return prop && prop.obstacle === "true";
    },

    getMapSize: function getMapSize() {
        return this._tmxCtrl.getMapSize();
    },

    getMapPixesSize: function getMapPixesSize() {
        return this._mapPixesSize;
    },

    getTileSize: function getTileSize() {
        return this._tmxCtrl.getTileSize();
    },

    cameraTo: function cameraTo(x, y, time, completeLock) {
        if (this._cameraCurrPoint.x == x && this._cameraCurrPoint.y == y) return;

        var targetX = x;
        var targetY = y;
        if (x < 0) {
            targetX = 0;
        } else if (x >= this._mapPixesSize.width - this.viewSize.width) {
            targetX = this._mapPixesSize.width - this.viewSize.width;
        }
        if (y < 0) {
            targetY = 0;
        } else if (y >= this._mapPixesSize.height - this.viewSize.height) {
            targetY = this._mapPixesSize.height - this.viewSize.height;
        }

        if (this._cameraCurrPoint.x == targetX && this._cameraCurrPoint.y == targetY) return;

        var scaleTimeX = Math.abs((this._cameraCurrPoint.x - targetX) / (this._cameraCurrPoint.x - x)) || 1;
        var scaleTimeY = Math.abs((this._cameraCurrPoint.y - targetY) / (this._cameraCurrPoint.y - y)) || 1;
        time *= Math.max(scaleTimeX, scaleTimeY);

        this._cameraMoveStartTime = Global.syncTimer.getTimer();
        this._cameraMoveEndTime = this._cameraMoveStartTime + time;
        this._cameraStartPoint.x = this._cameraCurrPoint.x;
        this._cameraStartPoint.y = this._cameraCurrPoint.y;
        this._cameraTargetPoint.x = targetX;
        this._cameraTargetPoint.y = targetY;
        this._cameraMoveSpeed.x = (targetX - this._cameraCurrPoint.x) / time;
        this._cameraMoveSpeed.y = (targetY - this._cameraCurrPoint.y) / time;
        this._cameraMovedLock = completeLock;
    },

    endCameraTo: function endCameraTo() {
        this._cameraMoveStartTime = 0;
        this._cameraMoveEndTime = 0;
        this._cameraTargetPoint.x = this._cameraTargetPoint.y = -1;
        this._cameraStartPoint.x = this._cameraStartPoint.y = -1;
        this._cameraMoveSpeed.x = this._cameraMoveSpeed.y = 0;
        this._cameraMovedLock = false;
    },

    setMapPosition: function setMapPosition(x, y) {
        if (this._currPos.x == x && this._currPos.y == y) return;

        if (!this._lockX) {
            this._currPos.x = x;
            this._isPositionDirty = true;
        }
        if (!this._lockY) {
            this._currPos.y = y;
            this._isPositionDirty = true;
        }
    },

    setMapPovit: function setMapPovit(x, y, time) {
        if (this._pivotTarget.x !== x || this._pivotTarget.y !== y) {
            this._pivotTarget.x = x;
            this._pivotTarget.y = y;
            this._pivotChangeSpeed.x = (x - this._pivotCurr.x) / time;
            this._pivotChangeSpeed.y = (y - this._pivotCurr.y) / time;
            this._pivotStart.x = this._pivotCurr.x;
            this._pivotStart.y = this._pivotCurr.y;
            this._pivotChangeStartTime = Global.syncTimer.getTimer();
            this._pivotChangeEndTime = this._pivotChangeStartTime + time;
        }
    },

    endChangePivot: function endChangePivot() {
        this._pivotStart.x = this._pivotStart.y = 0;
        this._pivotTarget.x = this._pivotTarget.y = 0;
        this._pivotChangeSpeed.x = this._pivotChangeSpeed.y = 0;
        this._pivotChangeStartTime = 0;
        this._pivotChangeEndTime = 0;
    },

    shock: function shock() {
        var viewSize = this.viewSize;
        var node = this.node;
        node.stopAllActions();
        var action = new cc.sequence(new cc.moveBy(0.03, 0, 10), new cc.moveBy(0.03, 0, -20), new cc.moveBy(0.03, 0, 10), new cc.callFunc(function () {
            node.x = 0;
            node.y = 0;
        }));
        node.runAction(action);
    },

    update: function update(dt) {
        var currTime = Global.syncTimer.getTimer();
        var needUpdate = false;
        if (this._isPositionDirty) {
            needUpdate = true;
            this._isPositionDirty = false;
        }
        if (this._pivotChangeStartTime > 0) {
            this.processPivot(currTime);
            needUpdate = true;
        }
        if (this._cameraMoveStartTime > 0) {
            needUpdate = true;
        }
        if (needUpdate) {
            this.updateViewRange(currTime);
        }

        this.updateEnityZOrder();
    },

    processPivot: function processPivot(currTime) {
        if (currTime >= this._pivotChangeEndTime) {
            this._pivotCurr.x = this._pivotTarget.x;
            this._pivotCurr.y = this._pivotTarget.y;
            this.endChangePivot();
        } else {
            var timeElapased = currTime - this._pivotChangeStartTime;
            this._pivotCurr.x = this._pivotStart.x + this._pivotChangeSpeed.x * timeElapased;
            this._pivotCurr.y = this._pivotStart.y + this._pivotChangeSpeed.y * timeElapased;
        }
    },

    updateEnityZOrder: function updateEnityZOrder() {
        this._enities.sort(function (a, b) {
            return a.y < b.y ? 1 : -1;
        });
        for (var i = 0; i < this._enities.length; i++) {
            this._enities[i].setLocalZOrder(i + 1);
        }
    },

    updateViewRange: function updateViewRange(currTime) {
        var mapWidth = this._mapPixesSize.width;
        var mapHeight = this._mapPixesSize.height;
        var viewSize = this.viewSize;
        var mapPos = new cc.Vec2();

        if (this._cameraMoveEndTime > 0) {
            if (currTime >= this._cameraMoveEndTime) {
                mapPos.x = this._cameraTargetPoint.x;
                mapPos.y = this._cameraTargetPoint.y;
                if (this._cameraMovedLock) {
                    this._lockX = true;
                    this._lockY = true;
                }
                this.endCameraTo();
            } else {
                var timeElapased = currTime - this._cameraMoveStartTime;
                mapPos.x = this._cameraStartPoint.x + this._cameraMoveSpeed.x * timeElapased;
                mapPos.y = this._cameraStartPoint.y + this._cameraMoveSpeed.y * timeElapased;
            }
        } else {
            var limitRegion = new cc.Rect();
            limitRegion.x = this._lockRegion.x;
            limitRegion.y = this._lockRegion.y;
            limitRegion.width = this._lockRegion.width - viewSize.width;
            limitRegion.height = this._lockRegion.height - viewSize.height;

            if (!this._lockX) {
                mapPos.x = this._currPos.x + this._pivotCurr.x - viewSize.width / 2;
                if (mapPos.x < limitRegion.xMin) mapPos.x = limitRegion.xMin;
                if (mapPos.x > limitRegion.xMax) mapPos.x = limitRegion.xMax;
            }
            if (!this._lockY) {
                mapPos.y = this._currPos.y + this._pivotCurr.y - viewSize.height / 2;
                if (mapPos.y < limitRegion.yMin) mapPos.y = limitRegion.yMin;
                if (mapPos.y > limitRegion.yMax) mapPos.y = limitRegion.yMax;
            }
        }

        this._cameraCurrPoint.x = mapPos.x;
        this._cameraCurrPoint.y = mapPos.y;

        this._pivotOffset = this._currPos.x - mapPos.x;

        this._tmxLayer.setPosition(-mapPos.x, -mapPos.y);
        this._objectLayer.setPosition(-mapPos.x, -mapPos.y);
        this._otherLayer.setPosition(-mapPos.x, -mapPos.y);
        for (var i = 0; i < this._effectLayers.length; i++) this._effectLayers[i].setPosition(-mapPos.x, -mapPos.y);

        for (var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            var size = this.layerSize[i];
            layer.x = -mapPos.x / (this._mapPixesSize.width - viewSize.width) * (size.width - viewSize.width);
        }
    }
});

cc._RFpop();
},{}],"message_box":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b752dwsPilOcrebVHtHrG3G', 'message_box');
// script\ui\message_box.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ..
        messageLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        var args = this._uiCtrl.args;
        this._callback = args.callback;
        this.messageLabel.string = args.message;
    },

    onButtonClick: function onButtonClick(event) {
        this._uiCtrl.close();
        if (typeof this._callback === 'function') {
            var name = event.target.name;
            if (name === 'ok_button') {
                this._callback(0);
            } else if (name === 'cancel_button') {
                this._callback(1);
            }
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"mission_fail":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ccb50oTVjlMTr4a+e8gmV+b', 'mission_fail');
// script\ui\result\mission_fail.js

var timesMapCoin = [10, 30, 50];

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        retryButton: cc.Node,
        returnButton: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = this._uiCtrl.args.retryCount;
        if (this._retryCount <= 0) {
            retryButton.active = false;
            returnButton.x = 150;
        }
    },

    onRetryButtonClick: function onRetryButtonClick() {
        this._uiCtrl.close();
        var needCoin = timesMapCoin[this._retryCount - 1];
        var ownCoin = GLobal.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            cc.log('do retry');
            Global.gameEventDispatcher.emit(GameEvent.ON_RETRY_GAME);
        }
    },

    onReturnButtonClick: function onReturnButtonClick() {
        this._uiCtrl.close();
        Global.gameEventDispatcher.emit(GameEvent.ON_RETURN_GAME);
    }
});

cc._RFpop();
},{}],"model_panel":[function(require,module,exports){
"use strict";
cc._RFpush(module, '950f4RgduRIpZu/jlWUT3ZK', 'model_panel');
// script\ui\component\model_panel.js

cc.Class({
    "extends": cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        this._touchStart = this.node.on(cc.Node.EventType.TOUCH_START, function () {}, this.node);
        this._touchMove = this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {}, this.node);
        this._touchEnd = this.node.on(cc.Node.EventType.TOUCH_END, function () {}, this.node);
        this._touchCancel = this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {}, this.node);
        this._mouseEnter = this.node.on(cc.Node.EventType.MOUSE_ENTER, function () {}, this.node);
        this._mouseLeave = this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {}, this.node);
        this._mouseDown = this.node.on(cc.Node.EventType.MOUSE_DOWN, function () {}, this.node);
        this._mouseMove = this.node.on(cc.Node.EventType.MOUSE_MOVE, function () {}, this.node);
        this._mouseUp = this.node.on(cc.Node.EventType.MOUSE_UP, function () {}, this.node);
        this._mouseWhell = this.node.on(cc.Node.EventType.MOUSE_WHEEL, function () {}, this.node);
    },

    onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this.node);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this.node);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this.node);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchCancel, this.node);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._mouseEnter, this.node);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._mouseLeave, this.node);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this.node);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this._mouseMove, this.node);
        this.node.off(cc.Node.EventType.MOUSE_UP, this._mouseUp, this.node);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._mouseWhell, this.node);
    }
});

cc._RFpop();
},{}],"monster_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'defb9912CtDP4Seapg3qHTK', 'monster_ctrl');
// script\actor\monster_ctrl.js

var ActorDefine = require("actor_define");
var Actor = require("actor_ctrl");

var ActorAction = ActorDefine.ActorAction;
var ActorDirection = ActorDefine.ActorDirection;
var ActionCompleteType = ActorDefine.ActionCompleteType;

cc.Class({
    "extends": Actor,

    onLoad: function onLoad() {
        this._AIMoveEndTime = 0;
        this._AIHoldEndTime = 0;
        this._AIAttackDelayEndTime = 0;
        this._AIRunned = false;
        this._super();
    },

    reset: function reset() {
        this._AIMoveEndTime = 0;
        this._AIHoldEndTime = 0;
        this._AIAttackDelayEndTime = 0;
        this._AIRunned = false;
        this._super();
    },

    run: function run() {
        this._AIRunned = true;
    },

    stop: function stop() {
        this._AIRunned = false;
    },

    update: function update(dt) {

        this._super(dt);
    },

    nextAction: function nextAction() {
        if (this._isDead) return;

        if (this._currAction == ActorAction.BORN) {
            this.run();
        }

        if (!this._AIRunned && this._bornEndTime <= 0) {
            this._super();
            return;
        }

        if (this._AIRunned && this._bornEndTime <= 0) {
            var player = this._logicManager.getPlayer();
            if (player.isDead()) {
                this.stopMove();
                this._super();
                return;
            }

            var disX = player.node.x - this.node.x;
            var disY = player.node.y - this.node.y;
            var dirX = ActorDirection.LEFT;
            var dirY = 0;
            if (disX > 0) dirX = ActorDirection.RIGHT;
            if (Math.abs(disY) > 10) {
                if (disY > 0) dirY = 1;else dirY = -1;
            } else {
                dirY = 0;
            }

            this.setDirection(dirX);

            var currTime = Global.syncTimer.getTimer();
            if (Math.abs(disY) < 20 && Math.abs(disX) < 60) {
                if (currTime >= this._AIAttackDelayEndTime) {
                    var skill = Global.skillProvider.getConfig(1);
                    if (!skill) {
                        //this._super();
                        return;
                    }
                    this.stopMove();
                    this._AIAttackDelayEndTime = currTime + 5;
                    var postureList = [skill.postures[0]];
                    this.startAttack(postureList, 1, this._direction);
                } else {
                    this._super();
                }
            } else if (this._AIMoveEndTime > 0) {
                if (currTime <= this._AIMoveEndTime) {
                    var speed = new cc.Vec2(100 * dirX, 100 * dirY);
                    if (this._moveStartTime <= 0 || speed.x !== this._currMoveSpeed.x || speed.y !== this._currMoveSpeed.y) {
                        this.startMove(speed.x, speed.y, false);
                    } else {
                        this._super();
                    }
                } else {
                    this._AIMoveEndTime = 0;
                    this.stopMove();
                    this._super();
                    this._AIHoldEndTime = currTime + Math.random() * 2 + 1;
                }
            } else if (this._AIHoldEndTime > 0) {
                if (currTime >= this._AIHoldEndTime) {
                    this._AIHoldEndTime = 0;
                }
            } else {
                this._AIMoveEndTime = currTime + Math.random() * 2 + 2;
            }
        }
    }
});

cc._RFpop();
},{"actor_ctrl":"actor_ctrl","actor_define":"actor_define"}],"network_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9203ewwcaJATq/zdgOgksjb', 'network_ctrl');
// script\scene\network_ctrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        loadingPrefab: {
            "default": null,
            type: cc.Prefab
        },

        errorPrefab: {
            "default": null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._requestHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_REQUEST, this.onEvent.bind(this));
        this._respondHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_RESPOND, this.onEvent.bind(this));
        this._networkErrorHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_NETWORK_ERROR, this.onEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._requestHandler);
        Global.gameEventDispatcher.removeEventHandler(this._respondHandler);
        Global.gameEventDispatcher.removeEventHandler(this._networkErrorHandler);
        this._requestHandler = null;
        this._respondHandler = null;
        this._networkErrorHandler = null;
    },

    onEvent: function onEvent(eventType, data) {
        switch (eventType) {
            case GameEvent.ON_HTTP_REQUEST:
                this.showLoading(true);
                cc.log("on http request");
                break;

            case GameEvent.ON_HTTP_RESPOND:
                this.showLoading(false);
                cc.log("on http respond");
                break;

            case GameEvent.ON_NETWORK_ERROR:
                this.showError();
                cc.log("on network error");
                break;

            default:
                break;
        }
    },

    showError: function showError() {
        var panel = cc.instantiate(this.errorPrefab);
        this.node.addChild(panel);
    },

    showLoading: function showLoading(value) {
        this.removeLoading();
        if (value) {
            var panel = cc.instantiate(this.loadingPrefab);
            this.node.addChild(panel);
            this._loadingPanel = panel;
        }
    },

    removeLoading: function removeLoading() {
        if (this._loadingPanel) {
            this._loadingPanel.removeFromParent();
            this._loadingPanel = null;
        }
    }
});

cc._RFpop();
},{}],"network_error":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f23fb9t411KwqvU8HOaXOVD', 'network_error');
// script\common\network_error.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onRetryButtonClick: function onRetryButtonClick() {
        Global.gameNet.retryHttpRequest();
        this.node.destroy();
    },

    onExitButtonClick: function onExitButtonClick() {
        cc.director.end();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"physical_not_enough":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'db18fVEcatGl6tf5AyYtOQh', 'physical_not_enough');
// script\ui\physical_not_enough.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
    },

    onBuyButtonClick: function onBuyButtonClick() {
        this._uiCtrl.close();
        var coin = Global.accountModule.goldNum;
        if (Global.accountModule.goldNum < 50) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            cc.log('buy physical');
        }
    },

    onCancelButtonClick: function onCancelButtonClick() {
        this._uiCtrl.close();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"physical_point":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9ec11EIKMRAI5D5voB+6BNC', 'physical_point');
// script\ui\component\physical_point.js

cc.Class({
    "extends": cc.Component,

    properties: {
        star: {
            "default": null,
            type: cc.Node
        },

        state: {
            get: function get() {
                this._state;
            },

            set: function set(state) {
                if (this._state == state) return;
                this.star.active = state === 0;
                this._state = state;
            }
        }
    },

    onLoad: function onLoad() {
        this.state = 1;
        //this._animation = this.node.getComponent(cc.Animation);
        //this._animation.on('finish', this.onAnimateFinish, this);
    }
});

cc._RFpop();
},{}],"player_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0c8e8zqfBBIhb5avV6UIm2O', 'player_ctrl');
// script\actor\player_ctrl.js

var ControlDefine = require("control_define");
var ActorDefine = require("actor_define");
var Actor = require("actor_ctrl");

var ControlKey = ControlDefine.ControlKey;
var ActorAction = ActorDefine.ActorAction;
var ActorDirection = ActorDefine.ActorDirection;
var ActionCompleteType = ActorDefine.ActionCompleteType;

cc.Class({
    "extends": Actor,

    properties: {
        stateBar: {
            set: function set(bar) {
                this._stateBar = bar;
            },

            get: function get() {
                return this._stateBar;
            }
        },

        controlEnabled: {
            set: function set(enabled) {
                if (enabled) {
                    this._controlEnabledCount += 1;
                } else {
                    this._controlEnabledCount -= 1;
                }
            },

            get: function get() {
                return this._controlEnabledCount >= 0;
            }

        },

        reliveEffectUnder: cc.Animation,
        reliveEffectUpper: cc.Animation
    },

    onLoad: function onLoad() {
        var self = this;
        this.reliveEffectUnder.on('finished', function (event) {
            self.reliveEffectUnder.node.active = false;
        });
        this.reliveEffectUpper.on('finished', function (event) {
            self.reliveEffectUpper.node.active = false;
        });

        this._keyDownCount = 0;
        this._keyDownTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this._controlEnabledCount = -1;

        this._lastAttackSkillId = 0;
        this._lastAttackPostureIndex = 0;
        this._postureBreakEndTime = 0;
        this._super();
    },

    reset: function reset() {
        this._keyDownCount = 0;
        for (var i = 0; i < this._keyDownTime.length; i++) {
            this._keyDownTime[i] = 0;
        }
        this._controlEnabledCount = -1;
        this._lastAttackSkillId = 0;
        this._lastAttackPostureIndex = 0;
        this._postureBreakEndTime = 0;
        this._super();
        if (this._stateBar) this._stateBar.setHp(this._hp, this._hpMax, false);
    },

    setHp: function setHp(value, max) {
        this._super(value, max);
        if (this._stateBar) this._stateBar.setHp(this._hp, this._hpMax, false);
    },

    setActorPosition: function setActorPosition(x, y) {
        this._super(x, y);
        this._map.setMapPosition(x, y);
    },

    setAction: function setAction(action, dir, param, time) {
        this._super(action, dir, param, time);
        //this.updateMapPivot();
    },

    setDirection: function setDirection(dir) {
        this._super(dir);
        //this.updateMapPivot();
    },

    damage: function damage(value) {
        var ani = value > 0;
        this._super(value);
        this._stateBar.setHp(this._hp, this._hpMax, ani);
    },

    breakable: function breakable() {
        var currTime = Global.syncTimer.getTimer();
        return this.getLastInputAttackKey() == ControlKey.HIT && currTime >= this._attackEndTime;
    },

    needDisappear: function needDisappear() {
        return false;
    },

    nextAction: function nextAction() {
        if (this._bornEndTime > 0) return;

        var currTime = Global.syncTimer.getTimer();
        if (!this.controlEnabled) {
            if (this._currAction == ActorAction.RELIVE) {
                this.controlEnabled = true;
                this._super();
            }
            if (this.getCurrentActionCompleteType() == ActionCompleteType.COMPLETABLE) {
                this._super();
            }
            return;
        }

        var nextDir = this.getLastInputMoveDirection();
        var dir = nextDir.x === 0 ? this._direction : nextDir.x;

        var attackKey = this.getLastInputAttackKey();
        if (attackKey !== ControlKey.NONE && currTime >= this._attackEndTime) {
            this.stopMove();
            switch (attackKey) {
                case ControlKey.HIT:
                    if (!this.startHit(dir)) this._super();
                    break;
                default:
                    this._super();
                    break;
            }
        } else if (this.enterMove()) {} else {
            if (this._initiativeMove) this.stopMove();
            this._super();
        }
    },

    checkAttackPosture: function checkAttackPosture(skillId) {
        if (skillId == 0) {
            var currTime = Global.syncTimer.getTimer();
            if (this._lastAttackSkillId !== 0) {
                this._lastAttackPostureIndex = 0;
                this._lastAttackSkillId = 0;
            } else if (currTime >= this._postureBreakEndTime) {
                this._postureBreakEndTime = 0;
                this._lastAttackPostureIndex = 0;
            } else {
                if (!this._lastHitResult) {
                    this._lastAttackPostureIndex = 0;
                } else {
                    this._lastAttackPostureIndex++;
                }
                if (!this.getNormalAttackPosture(this._lastAttackPostureIndex)) {
                    this._lastAttackPostureIndex = 0;
                }
            }
            //cc.log("last index" + this._lastAttackPostureIndex);
            var posture = this.getNormalAttackPosture(this._lastAttackPostureIndex);
            if (!posture) {
                this._lastHitResult = false;
                return null;
            }
            this._postureBreakEndTime = currTime + posture.time + 0.2;
            return posture;
        } else {}
        return null;
    },

    getNormalAttackPosture: function getNormalAttackPosture(index) {
        var skill = Global.skillProvider.getConfig(0);
        if (!skill) return null;
        return skill.postures[index];
    },

    startHit: function startHit(dir) {
        var posture = this.checkAttackPosture(0);
        if (!posture) {
            return false;
        }
        this.startAttack([posture], 1, dir);
        return true;
    },

    enterMove: function enterMove() {
        var result = true;
        var dirVec = this.getLastInputMoveDirection();
        if (dirVec.equals(cc.Vec2.ZERO)) return false;

        var speed = this.calcMoveSpeed(dirVec);
        if (this._moveStartTime <= 0 || speed.x !== this._currMoveSpeed.x || speed.y !== this._currMoveSpeed.y) {
            this.setDirection(dirVec.x);
            this.startMove(speed.x, speed.y, true);
        }

        return true;
    },

    playReliveEffect: function playReliveEffect() {
        var self = this;
        this.reliveEffectUnder.node.active = true;
        this.reliveEffectUpper.node.active = true;
        this.reliveEffectUnder.play('default');
        this.reliveEffectUpper.play('default');
    },

    calcMoveSpeed: function calcMoveSpeed(dirVec) {
        var moveSpeed = new cc.Vec2(dirVec.x * this.moveSpeed.x, dirVec.y * this.moveSpeed.y);
        return moveSpeed;
    },

    keyDown: function keyDown(key) {
        if (this.controlEnabled) {
            this._keyDownCount++;
            this._keyDownTime[key] = this._keyDownCount;
        }
    },

    keyUp: function keyUp(key) {
        this._keyDownTime[key] = 0;
    },

    getLastInputMoveDirection: function getLastInputMoveDirection() {
        var u = 0,
            v = 0;
        var ut = 0,
            vt = 0;

        if (ut < this._keyDownTime[ControlKey.LEFT]) {
            ut = this._keyDownTime[ControlKey.LEFT];
            u = -1;
        }
        if (ut < this._keyDownTime[ControlKey.RIGHT]) {
            ut = this._keyDownTime[ControlKey.RIGHT];
            u = 1;
        }
        if (vt < this._keyDownTime[ControlKey.UP]) {
            vt = this._keyDownTime[ControlKey.UP];
            v = 1;
        }
        if (vt < this._keyDownTime[ControlKey.DOWN]) {
            vt = this._keyDownTime[ControlKey.DOWN];
            v = -1;
        }

        return new cc.Vec2(u, v);
    },

    getLastInputAttackKey: function getLastInputAttackKey() {
        var ck = ControlKey.NONE;
        if (this.controlEnabled) {
            var lastTime = 0;
            for (var i = ControlKey.JUMP; i <= ControlKey.SKILL6; i++) {
                if (lastTime < this._keyDownTime[i]) {
                    lastTime = this._keyDownTime[i];
                    ck = i;
                }
            }
        }
        return ck;
    },

    updateMapPivot: function updateMapPivot() {
        if (this._currAction == ActorAction.RUN) this._map.setMapPovit(this._direction * -100, 0, 2);else this._map.setMapPovit(this._direction * 100, 0, 1);
    }
});

cc._RFpop();
},{"actor_ctrl":"actor_ctrl","actor_define":"actor_define","control_define":"control_define"}],"polyglot":[function(require,module,exports){
(function (global){
"use strict";
cc._RFpush(module, 'cc366/J1/hE04TCHBSFIt8t', 'polyglot');
// script\i18n\polyglot.js

//     (c) 2012-2016 Airbnb, Inc.
//
//     polyglot.js may be freely distributed under the terms of the BSD
//     license. For all licensing information, details, and documention:
//     http://airbnb.github.com/polyglot.js
//
//
// Polyglot.js is an I18n helper library written in JavaScript, made to
// work both in the browser and in Node. It provides a simple solution for
// interpolation and pluralization, based off of Airbnb's
// experience adding I18n functionality to its Backbone.js and Node apps.
//
// Polylglot is agnostic to your translation backend. It doesn't perform any
// translation; it simply gives you a way to manage translated phrases from
// your client- or server-side JavaScript application.

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.Polyglot = factory(root);
  }
})(typeof global !== 'undefined' ? global : this, function (root) {
  'use strict';

  var replace = String.prototype.replace;

  // ### Polyglot class constructor
  function Polyglot(options) {
    options = options || {};
    this.phrases = {};
    this.extend(options.phrases || {});
    this.currentLocale = options.locale || 'en';
    this.allowMissing = !!options.allowMissing;
    this.warn = options.warn || warn;
  }

  // ### Version
  Polyglot.VERSION = '1.0.0';

  // ### polyglot.locale([locale])
  //
  // Get or set locale. Internally, Polyglot only uses locale for pluralization.
  Polyglot.prototype.locale = function (newLocale) {
    if (newLocale) this.currentLocale = newLocale;
    return this.currentLocale;
  };

  // ### polyglot.extend(phrases)
  //
  // Use `extend` to tell Polyglot how to translate a given key.
  //
  //     polyglot.extend({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     });
  //
  // The key can be any string.  Feel free to call `extend` multiple times;
  // it will override any phrases with the same key, but leave existing phrases
  // untouched.
  //
  // It is also possible to pass nested phrase objects, which get flattened
  // into an object with the nested keys concatenated using dot notation.
  //
  //     polyglot.extend({
  //       "nav": {
  //         "hello": "Hello",
  //         "hello_name": "Hello, %{name}",
  //         "sidebar": {
  //           "welcome": "Welcome"
  //         }
  //       }
  //     });
  //
  //     console.log(polyglot.phrases);
  //     // {
  //     //   'nav.hello': 'Hello',
  //     //   'nav.hello_name': 'Hello, %{name}',
  //     //   'nav.sidebar.welcome': 'Welcome'
  //     // }
  //
  // `extend` accepts an optional second argument, `prefix`, which can be used
  // to prefix every key in the phrases object with some string, using dot
  // notation.
  //
  //     polyglot.extend({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     }, "nav");
  //
  //     console.log(polyglot.phrases);
  //     // {
  //     //   'nav.hello': 'Hello',
  //     //   'nav.hello_name': 'Hello, %{name}'
  //     // }
  //
  // This feature is used internally to support nested phrase objects.
  Polyglot.prototype.extend = function (morePhrases, prefix) {
    var phrase;

    for (var key in morePhrases) {
      if (morePhrases.hasOwnProperty(key)) {
        phrase = morePhrases[key];
        if (prefix) key = prefix + '.' + key;
        if (typeof phrase === 'object') {
          this.extend(phrase, key);
        } else {
          this.phrases[key] = phrase;
        }
      }
    }
  };

  // ### polyglot.unset(phrases)
  // Use `unset` to selectively remove keys from a polyglot instance.
  //
  //     polyglot.unset("some_key");
  //     polyglot.unset({
  //       "hello": "Hello",
  //       "hello_name": "Hello, %{name}"
  //     });
  //
  // The unset method can take either a string (for the key), or an object hash with
  // the keys that you would like to unset.
  Polyglot.prototype.unset = function (morePhrases, prefix) {
    var phrase;

    if (typeof morePhrases === 'string') {
      delete this.phrases[morePhrases];
    } else {
      for (var key in morePhrases) {
        if (morePhrases.hasOwnProperty(key)) {
          phrase = morePhrases[key];
          if (prefix) key = prefix + '.' + key;
          if (typeof phrase === 'object') {
            this.unset(phrase, key);
          } else {
            delete this.phrases[key];
          }
        }
      }
    }
  };

  // ### polyglot.clear()
  //
  // Clears all phrases. Useful for special cases, such as freeing
  // up memory if you have lots of phrases but no longer need to
  // perform any translation. Also used internally by `replace`.
  Polyglot.prototype.clear = function () {
    this.phrases = {};
  };

  // ### polyglot.replace(phrases)
  //
  // Completely replace the existing phrases with a new set of phrases.
  // Normally, just use `extend` to add more phrases, but under certain
  // circumstances, you may want to make sure no old phrases are lying around.
  Polyglot.prototype.replace = function (newPhrases) {
    this.clear();
    this.extend(newPhrases);
  };

  // ### polyglot.t(key, options)
  //
  // The most-used method. Provide a key, and `t` will return the
  // phrase.
  //
  //     polyglot.t("hello");
  //     => "Hello"
  //
  // The phrase value is provided first by a call to `polyglot.extend()` or
  // `polyglot.replace()`.
  //
  // Pass in an object as the second argument to perform interpolation.
  //
  //     polyglot.t("hello_name", {name: "Spike"});
  //     => "Hello, Spike"
  //
  // If you like, you can provide a default value in case the phrase is missing.
  // Use the special option key "_" to specify a default.
  //
  //     polyglot.t("i_like_to_write_in_language", {
  //       _: "I like to write in %{language}.",
  //       language: "JavaScript"
  //     });
  //     => "I like to write in JavaScript."
  //
  Polyglot.prototype.t = function (key, options) {
    var phrase, result;
    options = options == null ? {} : options;
    // allow number as a pluralization shortcut
    if (typeof options === 'number') {
      options = { smart_count: options };
    }
    if (typeof this.phrases[key] === 'string') {
      phrase = this.phrases[key];
    } else if (typeof options._ === 'string') {
      phrase = options._;
    } else if (this.allowMissing) {
      phrase = key;
    } else {
      this.warn('Missing translation for key: "' + key + '"');
      result = key;
    }
    if (typeof phrase === 'string') {
      options = clone(options);
      result = choosePluralForm(phrase, this.currentLocale, options.smart_count);
      result = interpolate(result, options);
    }
    return result;
  };

  // ### polyglot.has(key)
  //
  // Check if polyglot has a translation for given key
  Polyglot.prototype.has = function (key) {
    return key in this.phrases;
  };

  // #### Pluralization methods
  // The string that separates the different phrase possibilities.
  var delimeter = '||||';

  // Mapping from pluralization group plural logic.
  var pluralTypes = {
    chinese: function chinese(n) {
      return 0;
    },
    german: function german(n) {
      return n !== 1 ? 1 : 0;
    },
    french: function french(n) {
      return n > 1 ? 1 : 0;
    },
    russian: function russian(n) {
      return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    },
    czech: function czech(n) {
      return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;
    },
    polish: function polish(n) {
      return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    },
    icelandic: function icelandic(n) {
      return n % 10 !== 1 || n % 100 === 11 ? 1 : 0;
    }
  };

  // Mapping from pluralization group to individual locales.
  var pluralTypeToLanguages = {
    chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
    german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
    french: ['fr', 'tl', 'pt-br'],
    russian: ['hr', 'ru'],
    czech: ['cs', 'sk'],
    polish: ['pl'],
    icelandic: ['is']
  };

  function langToTypeMap(mapping) {
    var type,
        langs,
        l,
        ret = {};
    for (type in mapping) {
      if (mapping.hasOwnProperty(type)) {
        langs = mapping[type];
        for (l in langs) {
          ret[langs[l]] = type;
        }
      }
    }
    return ret;
  }

  // Trim a string.
  var trimRe = /^\s+|\s+$/g;
  function trim(str) {
    return replace.call(str, trimRe, '');
  }

  // Based on a phrase text that contains `n` plural forms separated
  // by `delimeter`, a `locale`, and a `count`, choose the correct
  // plural form, or none if `count` is `null`.
  function choosePluralForm(text, locale, count) {
    var ret, texts, chosenText;
    if (count != null && text) {
      texts = text.split(delimeter);
      chosenText = texts[pluralTypeIndex(locale, count)] || texts[0];
      ret = trim(chosenText);
    } else {
      ret = text;
    }
    return ret;
  }

  function pluralTypeName(locale) {
    var langToPluralType = langToTypeMap(pluralTypeToLanguages);
    return langToPluralType[locale] || langToPluralType.en;
  }

  function pluralTypeIndex(locale, count) {
    return pluralTypes[pluralTypeName(locale)](count);
  }

  // ### interpolate
  //
  // Does the dirty work. Creates a `RegExp` object for each
  // interpolation placeholder.
  var dollarRegex = /\$/g;
  var dollarBillsYall = '$$$$';
  function interpolate(phrase, options) {
    for (var arg in options) {
      if (arg !== '_' && options.hasOwnProperty(arg)) {
        // Ensure replacement value is escaped to prevent special $-prefixed
        // regex replace tokens. the "$$$$" is needed because each "$" needs to
        // be escaped with "$" itself, and we need two in the resulting output.
        var replacement = options[arg];
        if (typeof replacement === 'string') {
          replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
        }
        // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.
        phrase = replace.call(phrase, new RegExp('%\\{' + arg + '\\}', 'g'), replacement);
      }
    }
    return phrase;
  }

  // ### warn
  //
  // Provides a warning in the console if a phrase key is missing.
  function warn(message) {
    root.console && root.console.warn && root.console.warn('WARNING: ' + message);
  }

  // ### clone
  //
  // Clone an object.
  function clone(source) {
    var ret = {};
    for (var prop in source) {
      ret[prop] = source[prop];
    }
    return ret;
  }

  return Polyglot;
});
//

cc._RFpop();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"round_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4268aLywxFCA7qNQcRCKYc7', 'round_ctrl');
// script\scene\battle\round_ctrl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        numbers: {
            'default': [],
            type: [cc.Prefab]
        },

        round: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._nums = [];
        this._ani = this.getComponent(cc.Animation);
        this.round.active = false;
    },

    setRound: function setRound(value) {
        if (typeof value === 'string') ;else if (typeof value === 'number') value = value.toString();else return;

        while (this._nums.length > 0) {
            var node = this._nums.pop();
            node.parent = null;
            node.destroy();
        }
        this._ani.stop();
        this.round.active = false;
        var self = this;
        var actions = [];
        var totalWidth = 0;
        var index = 0;
        for (var j = 0; j < value.length; j++) {
            actions.push(new cc.delayTime(0.2));
            actions.push(new cc.callFunc(function () {
                var num = parseInt(value.charAt(index));
                var prefab = self.numbers[num];
                var node = cc.instantiate(prefab);
                node.x = totalWidth;
                node.parent = self.node;
                totalWidth += node.width;
                index++;
                self._nums.push(node);
            }));
        }
        actions.push(new cc.delayTime(0.2));
        actions.push(new cc.callFunc(function () {
            self.round.active = true;
            self.round.x = totalWidth - 35;
            self._ani.play('round_img');
        }));
        this.node.stopAllActions();
        this.node.runAction(new cc.Sequence(actions));
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"skill_cfg":[function(require,module,exports){
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
},{}],"skill_define":[function(require,module,exports){
"use strict";
cc._RFpush(module, '37f342p2bFFKqAJJB4xkZg0', 'skill_define');
// script\actor\skill_define.js

module.exports.TimePointActType = {
    DAMAGE: 1,
    SELF_DELAY: 2,
    SHOCK_SCREEN: 3,
    PLAY_EFFECT: 4
};

module.exports.AttackType = {
    NORMAL: 1,
    FLY: 2
};

cc._RFpop();
},{}],"skill_provider":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3ebe3v9gCRNbqoF6gfcG5Ms', 'skill_provider');
// script\config\provider\skill_provider.js

var cfg = require('skill_cfg').data;

module.exports = {
    getConfig: function getConfig(id) {
        return cfg[id];
    }
};

cc._RFpop();
},{"skill_cfg":"skill_cfg"}],"state_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a1be0bPuWxGUaSOXXHFmzpn', 'state_ctrl');
// script\scene\battle\state_ctrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        hpAlpha: {
            "default": null,
            type: cc.Node
        },

        hpLight: {
            "default": null,
            type: cc.Node
        },

        nameLabel: {
            "default": null,
            type: cc.Label
        },

        moveTime: 3
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._time = 0;
        this._delayTime = 0;
        this._startWidth = 0;
        this._targetWidth = 0;
        this._maxWidth = this.hpLight.width;
    },

    setName: function setName(name) {
        this.nameLabel.string = name;
    },

    setHp: function setHp(hp, max, ani) {
        if (hp < 0) hp = 0;
        if (max < 1) max = 1;
        var percent = hp / max;
        var width = percent * this._maxWidth;
        if (!ani) {
            this.hpAlpha.width = width;
            this.hpLight.width = width;
        } else {
            this.hpLight.width = width;
            this._startWidth = this.hpAlpha.width;
            this._targetWidth = width;
            this._time = this._delayTime = (this._startWidth - this._targetWidth) / this._maxWidth * this.moveTime;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this._delayTime > 0) {
            this._delayTime -= dt;
            if (this._delayTime <= 0) {
                this._delayTime = this._time = 0;
                this.hpLight.width = this._targetWidth;
            } else {
                var e = this._time - this._delayTime; // this.moveTime;
                var d = this._maxWidth * e / this.moveTime;
                this.hpAlpha.width = this._startWidth - d;
            }
        }
    }
});

cc._RFpop();
},{}],"sync_timer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b43b1tRBw5HmrqkPtMUT23u', 'sync_timer');
// script\timer\sync_timer.js

module.exports["class"] = cc.Class({
    ctor: function ctor() {
        this._tick = 0;
        this._orginTick = 0;
    },

    reset: function reset() {
        this._tick = 0;
        this._orginTick = 0;
    },

    update: function update(dt) {
        this._tick += dt;
        this._orginTick += dt;
    },

    getTimer: function getTimer() {
        return this._tick;
    }
});

cc._RFpop();
},{}],"test_map":[function(require,module,exports){
"use strict";
cc._RFpush(module, '14ca0fIqYRAM7df9ABz160Q', 'test_map');
// script\scene\test_map.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        round: {
            'default': null,
            type: cc.Node
        },

        edit: {
            'default': null,
            type: cc.EditBox
        },

        abc: {
            'default': null,
            type: cc.AudioSource
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this._roundNum = this.round.getComponent('round_ctrl');
    },

    start: function start() {
        //cc.audioEngine.playMusic('resources/sound/bg', true);
        //this._map.lockRegion = new cc.Rect(0, 0, 1500, 640);
        //this._map.setMapPovit(-100, 0, 1);
    },

    onClick: function onClick() {
        //cc.audioEngine.playMusic('resources/sound/bg', true);
        this.abc.play();
        //cc.loader.loadRes('sound/bg', cc.AudioClip, function (err, clip) {
        //    cc.audioEngine.playMusic('resources/sound/bg.mp3');
        //    cc.log('ppp: ', err, clip);
        //});
        this._roundNum.setRound(this.edit.string);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        cc.log(this.abc.isPlaying);
    }
});

cc._RFpop();
},{}],"time_util":[function(require,module,exports){
"use strict";
cc._RFpush(module, '112abazdXJHF5AmYtCto2gs', 'time_util');
// script\util\time_util.js

function fillZero(value) {
    return value > 9 ? value.toString() : '0' + value.toString();
}

module.exports = {

    secToMS: function secToMS(sec) {
        var s = sec % 60;
        var m = (sec - s) / 60;
        var ret = cc.js.formatStr("%s:%s", fillZero(m), fillZero(s));
        return ret;
    },

    secToHMS: function secToHMS(sec) {
        var t = sec % 3600;
        var h = (sec - t) / 3600;
        var s = t % 60;
        var m = (t - s) / 60;
        var ret = cc.js.formatStr("%s:%s:%s", fillZero(h), fillZero(m), fillZero(s));
        return ret;
    }

};

cc._RFpop();
},{}],"ui_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd2c99j+HrdNA6mfGJtjn5mP', 'ui_ctrl');
// script\ui\ui_ctrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        id: {
            set: function set(value) {
                this._id = value;
            },

            get: function get() {
                return this._id;
            }
        },

        args: {
            set: function set(value) {
                this._args = value;
            },

            get: function get() {
                return this._args;
            }
        },

        manager: {
            set: function set(manager) {
                this._manager = manager;
            },

            get: function get() {
                return this._manager;
            }
        }
    },

    onLoad: function onLoad() {
        this._id = -1;
    },

    close: function close() {
        this.manager.closeUI(this.node);
    }

});

cc._RFpop();
},{}],"ui_manager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4e542GXCRpEKolPEuLFgQMT', 'ui_manager');
// script\ui\ui_manager.js

var BufferTable = require('buffer_table')['class'];

cc.Class({
    'extends': cc.Component,

    properties: {
        uiContainer: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._table = [];
    },

    openUI: function openUI(name, args) {
        var self = this;
        cc.loader.loadRes('prefab/ui/' + name, cc.Prefab, function (err, prefab) {
            var node = cc.instantiate(prefab);
            var id = self._table.push(node);
            var ctrl = node.getComponent('ui_ctrl');
            ctrl.id = id;
            ctrl.args = args;
            ctrl.manager = self;
            self.uiContainer.addChild(node);
        });
    },

    closeUI: function closeUI(node) {
        for (var i = 0; i < this._table.length; i++) {
            if (node == this._table[i]) {
                this._table.splice(i, 1);
                if (node.isValid) {
                    node.destroy();
                }
                break;
            }
        }
    },

    closeAll: function closeAll() {
        while (this._table.length > 0) {
            var node = this._table.pop();
            if (node.isValid) {
                node.destroy();
            }
        }
    }

});

cc._RFpop();
},{"buffer_table":"buffer_table"}],"xxtea":[function(require,module,exports){
"use strict";
cc._RFpush(module, '55f31tH7htNX79SP+qNHA1F', 'xxtea');
// script\lib\third\xxtea\xxtea.js

function utf16to8(str) {
    var out, i, len, c;
    out = [];
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007F) {
            out[i] = str.charAt(i);
        } else if (c > 0x07FF) {
            out[i] = String.fromCharCode(0xE0 | c >> 12 & 0x0F, 0x80 | c >> 6 & 0x3F, 0x80 | c >> 0 & 0x3F);
        } else {
            out[i] = String.fromCharCode(0xC0 | c >> 6 & 0x1F, 0x80 | c >> 0 & 0x3F);
        }
    }
    return out.join('');
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = [];
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out[out.length] = str.charAt(i - 1);
                break;
            case 12:
            case 13:
                char2 = str.charCodeAt(i++);
                out[out.length] = String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
                break;
            case 14:
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out[out.length] = String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
                break;
        }
    }
    return out.join('');
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
        out += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode((c3 & 0x03) << 6 | c4);
    }
    return out;
}
function long2str(v, w) {
    var vl = v.length;
    var sl = v[vl - 1] & 0xffffffff;
    for (var i = 0; i < vl; i++) {
        v[i] = String.fromCharCode(v[i] & 0xff, v[i] >>> 8 & 0xff, v[i] >>> 16 & 0xff, v[i] >>> 24 & 0xff);
    }
    if (w) {
        return v.join('').substring(0, sl);
    } else {
        return v.join('');
    }
}
function str2long(s, w) {
    var len = s.length;
    var v = [];
    for (var i = 0; i < len; i += 4) {
        v[i >> 2] = s.charCodeAt(i) | s.charCodeAt(i + 1) << 8 | s.charCodeAt(i + 2) << 16 | s.charCodeAt(i + 3) << 24;
    }
    if (w) {
        v[v.length] = len;
    }
    return v;
}
function xxtea_encrypt(str, key) {
    if (str == "") {
        return "";
    }
    var v = str2long(str, true);
    var k = str2long(key, false);
    var n = v.length - 1;
    var z = v[n],
        y = v[0],
        delta = 0x9E3779B9;
    var mx,
        e,
        q = Math.floor(6 + 52 / (n + 1)),
        sum = 0;
    while (q-- > 0) {
        sum = sum + delta & 0xffffffff;
        e = sum >>> 2 & 3;
        for (var p = 0; p < n; p++) {
            y = v[p + 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            z = v[p] = v[p] + mx & 0xffffffff;
        }
        y = v[0];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        z = v[n] = v[n] + mx & 0xffffffff;
    }
    return long2str(v, false);
}
function xxtea_decrypt(str, key) {
    if (str == "") {
        return "";
    }
    var v = str2long(str, false);
    var k = str2long(key, false);
    var n = v.length - 1;
    var z = v[n - 1],
        y = v[0],
        delta = 0x9E3779B9;
    var mx,
        e,
        q = Math.floor(6 + 52 / (n + 1)),
        sum = q * delta & 0xffffffff;
    while (sum != 0) {
        e = sum >>> 2 & 3;
        for (var p = n; p > 0; p--) {
            z = v[p - 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            y = v[p] = v[p] - mx & 0xffffffff;
        }
        z = v[n];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        y = v[0] = v[0] - mx & 0xffffffff;
        sum = sum - delta & 0xffffffff;
    }
    return long2str(v, true);
}

module.exports = {
    utf16to8: utf16to8,
    utf8to16: utf8to16,
    base64encode: base64encode,
    base64decode: base64decode,
    encrypt: xxtea_encrypt,
    decrypt: xxtea_decrypt
};

cc._RFpop();
},{}],"zh":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f6ea3m+XDBCMb5Aa07ujPA6', 'zh');
// script\i18n\data\zh.js

module.exports = {
    "GW_GAME": "盖付通游戏",
    "checking_update": "正在检查更新",
    "updating_assets": "正在更新资源",
    "loading_assets": "正在加载资源，不用流量喔！",
    "initting_game": "正在初始化游戏",
    "entering_game": "正在进入游戏",
    "update_percent": "更新进度：",
    "confirm_update": "发现在新版本，你需要更新才能继续游戏",
    "start_update": "更新",
    "exit_game": "退出",
    "retry_update": "重试",
    "fail_update": "更新失败，请重试",
    "account_not_empty": "帐号不能为空",
    "passwd_not_empty": "密码不能为空",
    "exchange_format": "%d积分=%d金币",
    "own_point_format": "积分：%d",
    "confirm_exchange_coin": "确定使用%d积分兑换%d金币吗？"
};

cc._RFpop();
},{}]},{},["player_ctrl","account_module","time_util","test_map","game_net","map_ctrl","game_ctrl","hurdle_define","buffer_table","control_define","exchange_coin","skill_define","skill_provider","joy_ctrl","round_ctrl","ui_manager","game_util","login_module","xxtea","init_config","login_ctrl","game_event_dispatcher","http_util","loading_ctrl","init_module","attack_ctrl","LabelLocalized","actor_ctrl","network_ctrl","physical_point","state_ctrl","i18n","http_connection","game_event","hurdle_provider","game_rpc","sync_timer","message_box","polyglot","mission_fail","model_panel","battle_ctrl","hurdle_cfg","en","ui_ctrl","physical_not_enough","main","monster_ctrl","skill_cfg","boot_ctrl","network_error","zh","game_protocol","coin_not_enough","actor_define"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9MYWJlbExvY2FsaXplZC5qcyIsImFzc2V0cy9zY3JpcHQvbW9kdWxlL2FjY291bnRfbW9kdWxlLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9kZWZpbmUuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9hdHRhY2tfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2JhdHRsZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9ib290X2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3V0aWwvYnVmZmVyX3RhYmxlLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9jb2luX25vdF9lbm91Z2guanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9jb250cm9sX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9kYXRhL2VuLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9leGNoYW5nZV9jb2luLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9nYW1lX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2V2ZW50L2dhbWVfZXZlbnRfZGlzcGF0Y2hlci5qcyIsImFzc2V0cy9zY3JpcHQvZXZlbnQvZ2FtZV9ldmVudC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX25ldC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX3Byb3RvY29sLmpzIiwiYXNzZXRzL3NjcmlwdC9uZXR3b3JrL2dhbWVfcnBjLmpzIiwiYXNzZXRzL3NjcmlwdC91dGlsL2dhbWVfdXRpbC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9jb25uZWN0aW9uL2h0dHBfY29ubmVjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHQvbGliL3V0aWwvaHR0cF91dGlsLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvZGF0YS9odXJkbGVfY2ZnLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9iYXR0bGUvaHVyZGxlX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvY29uZmlnL3Byb3ZpZGVyL2h1cmRsZV9wcm92aWRlci5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9pMThuLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvaW5pdF9jb25maWcuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9pbml0X21vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2pveV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9sb2FkaW5nX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2xvZ2luX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9sb2dpbl9tb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0L21haW4uanMiLCJhc3NldHMvc2NyaXB0L21hcC9tYXBfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvbWVzc2FnZV9ib3guanMiLCJhc3NldHMvc2NyaXB0L3VpL3Jlc3VsdC9taXNzaW9uX2ZhaWwuanMiLCJhc3NldHMvc2NyaXB0L3VpL2NvbXBvbmVudC9tb2RlbF9wYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvYWN0b3IvbW9uc3Rlcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9uZXR3b3JrX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2NvbW1vbi9uZXR3b3JrX2Vycm9yLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9waHlzaWNhbF9ub3RfZW5vdWdoLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9jb21wb25lbnQvcGh5c2ljYWxfcG9pbnQuanMiLCJhc3NldHMvc2NyaXB0L2FjdG9yL3BsYXllcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9pMThuL3BvbHlnbG90LmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9iYXR0bGUvcm91bmRfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvY29uZmlnL2RhdGEvc2tpbGxfY2ZnLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9za2lsbF9kZWZpbmUuanMiLCJhc3NldHMvc2NyaXB0L2NvbmZpZy9wcm92aWRlci9za2lsbF9wcm92aWRlci5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL3N0YXRlX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3RpbWVyL3N5bmNfdGltZXIuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL3Rlc3RfbWFwLmpzIiwiYXNzZXRzL3NjcmlwdC91dGlsL3RpbWVfdXRpbC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvdWlfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvdWlfbWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHQvbGliL3RoaXJkL3h4dGVhL3h4dGVhLmpzIiwiYXNzZXRzL3NjcmlwdC9pMThuL2RhdGEvemguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2wwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25qQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDclJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4NjMzMXAwWERaRmpiaE5ObC8xY1FoaicsICdMYWJlbExvY2FsaXplZCcpO1xuLy8gc2NyaXB0XFxpMThuXFxMYWJlbExvY2FsaXplZC5qc1xuXG52YXIgaTE4biA9IHJlcXVpcmUoJ2kxOG4nKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkxhYmVsLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0ZXh0S2V5OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6ICdURVhUX0tFWScsXG4gICAgICAgICAgICBtdWx0aWxpbmU6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiAnRW50ZXIgaTE4biBrZXkgaGVyZScsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uIG5vdGlmeSgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2dOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NnTm9kZS5zZXRTdHJpbmcodGhpcy5zdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVOb2RlU2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5nOiB7XG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdIZXJlIHNob3dzIHRoZSBsb2NhbGl6ZWQgc3RyaW5nIG9mIFRleHQgS2V5JyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpMThuLnQodGhpcy50ZXh0S2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oJ1BsZWFzZSBzZXQgbGFiZWwgdGV4dCBrZXkgaW4gVGV4dCBLZXkgcHJvcGVydHkuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBkZDQ3YzhpUDFJVGFpUkNuT0M1NjNBJywgJ2FjY291bnRfbW9kdWxlJyk7XG4vLyBzY3JpcHRcXG1vZHVsZVxcYWNjb3VudF9tb2R1bGUuanNcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzVmlwOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNWaXA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicgfHwgdmFsdWUgPT09ICd0cnVlJyB8fCBCb29sZWFuKHZhbHVlKSkpIHRoaXMuX2lzVmlwID0gdHJ1ZTtlbHNlIHRoaXMuX2lzVmlwID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29sZE51bToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dvbGROdW07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dvbGROdW0gPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzY29yZU51bToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njb3JlTnVtO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY29yZU51bSA9IHBhcnNlSW50KHZhbHVlKSB8fCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG5pY2tOYW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmlja05hbWU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX25pY2tOYW1lID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNGaXJzdExvZ2luOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNGaXJzdExvZ2luO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAndHJ1ZScgfHwgQm9vbGVhbih2YWx1ZSkpKSB0aGlzLl9pc0ZpcnN0TG9naW4gPSB0cnVlO2Vsc2UgdGhpcy5faXNGaXJzdExvZ2luID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF4U2NvcmU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhTY29yZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4U2NvcmUgPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb3dlcjoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Bvd2VyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3dlciA9IHBhcnNlSW50KHZhbHVlKSB8fCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRQb3dlclRpbWU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZXh0UG93ZXJUaW1lO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX25leHRQb3dlclRpbWUgPSB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiB0aGlzLmRlZmF1bHROZXh0UG93ZXJUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGV4Y2hhbmdlUmF0ZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4Y2hhbmdlUmF0ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhjaGFuZ2VSYXRlID0gcGFyc2VGbG9hdCh2YWx1ZSkgfHwgdGhpcy5kZWZhdWx0RXhjaGFuZ2VSYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlZmF1bHROZXh0UG93ZXJUaW1lOiAzMDAsXG4gICAgICAgIGRlZmF1bHRFeGNoYW5nZVJhdGU6IDEwXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9uaWNrTmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmlzRmlyc3RMb2dpbiA9IHRydWU7XG4gICAgICAgIHRoaXMuX2lzVmlwID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2dvbGROdW0gPSAwO1xuICAgICAgICB0aGlzLl9zY29yZU51bSA9IDA7XG4gICAgICAgIHRoaXMuX21heFNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5fcG93ZXIgPSAwO1xuICAgICAgICB0aGlzLl9uZXh0UG93ZXJUaW1lID0gdGhpcy5kZWZhdWx0TmV4dFBvd2VyVGltZTtcbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VSYXRlID0gdGhpcy5kZWZhdWx0RXhjaGFuZ2VSYXRlO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MDM3YUN4dTc5RFU0cy84QldUWlV3dCcsICdhY3Rvcl9jdHJsJyk7XG4vLyBzY3JpcHRcXGFjdG9yXFxhY3Rvcl9jdHJsLmpzXG5cbnZhciBTa2lsbERlZmluZSA9IHJlcXVpcmUoXCJza2lsbF9kZWZpbmVcIik7XG52YXIgQWN0b3JEZWZpbmUgPSByZXF1aXJlKFwiYWN0b3JfZGVmaW5lXCIpO1xudmFyIEFjdG9yRGlyZWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JEaXJlY3Rpb247XG52YXIgQWN0b3JBY3Rpb24gPSBBY3RvckRlZmluZS5BY3RvckFjdGlvbjtcbnZhciBBY3Rpb25OYW1lID0gQWN0b3JEZWZpbmUuQWN0aW9uTmFtZTtcbnZhciBBY3Rpb25DbGlwSW5kZXggPSBBY3RvckRlZmluZS5BY3Rpb25DbGlwSW5kZXg7XG52YXIgQWN0aW9uQ29tcGxldGVUeXBlID0gQWN0b3JEZWZpbmUuQWN0aW9uQ29tcGxldGVUeXBlO1xudmFyIFRpbWVQb2ludEFjdFR5cGUgPSBTa2lsbERlZmluZS5UaW1lUG9pbnRBY3RUeXBlO1xudmFyIEF0dGFja1R5cGUgPSBTa2lsbERlZmluZS5BdHRhY2tUeXBlO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbW92ZVNwZWVkOiBuZXcgY2MuVmVjMigwLCAwKSxcblxuICAgICAgICBsb2dpY01hbmFnZXI6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KG1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dpY01hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2ljTWFuYWdlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KG1hcCkge1xuICAgICAgICAgICAgICAgIGlmICghbWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwID0gbWFwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAuYWRkRW5pdHkodGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9tb2RlbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm1vZGVsXCIpO1xuICAgICAgICB0aGlzLl9tb2RlbEFuaW1hdGlvbiA9IHRoaXMuX21vZGVsLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICB0aGlzLl9ib2R5ID0gdGhpcy5fbW9kZWwuZ2V0Q2hpbGRCeU5hbWUoXCJib2R5XCIpO1xuICAgICAgICB2YXIgYm94ID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5Cb3hDb2xsaWRlcik7XG4gICAgICAgIHRoaXMuX2JveCA9IG5ldyBjYy5SZWN0KGJveC5vZmZzZXQueCAtIGJveC5zaXplLndpZHRoIC8gMiwgYm94Lm9mZnNldC55IC0gYm94LnNpemUuaGVpZ2h0IC8gMiwgYm94LnNpemUud2lkdGgsIGJveC5zaXplLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9jdXJyQWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VyckFjdGlvbkVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VG9wVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fZmxvYXRTcGVlZCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBBY2NlbGVyYXRvciA9IDA7XG5cbiAgICAgICAgdGhpcy5faXNBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmVlZFN0b3BQb3N0dXJlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2F0dGFja0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9za2lsbFRpbWVTdGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlcyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcblxuICAgICAgICB0aGlzLl9tb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fbW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9pbml0aWF0aXZlTW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90YXJnZXRNb3ZlUG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0UG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fY3Vyck1vdmVTcGVlZCA9IG5ldyBjYy5WZWMyKCk7XG5cbiAgICAgICAgdGhpcy5fbmVlZFJlbGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWxpdmVFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlj5flh7vnu5Pkuovml7bpl7TvvIjljbPlj5flh7vnoaznm7TvvIlcbiAgICAgICAgdGhpcy5faHVydEVuZFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIOWAkuWcsOe7k+adn+aXtumXtFxuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIOi1t+i6q+e7k+adn+aXtumXtFxuICAgICAgICB0aGlzLl9yZWNvdmVyRW5kVGltZSA9IDA7XG5cbiAgICAgICAgdGhpcy5fYm9ybkVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2xhc3RIaXRSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRDb21ib1ZhbHVlID0gMTAwO1xuICAgICAgICB0aGlzLl9yZW1haW5Db21ib1ZhbHVlID0gdGhpcy5fZGVmYXVsdENvbWJvVmFsdWU7XG5cbiAgICAgICAgdGhpcy5faHBNYXggPSAxMDAwO1xuICAgICAgICB0aGlzLl9ocCA9IDEwMDA7XG5cbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSURMRSwgQWN0b3JEaXJlY3Rpb24uUklHSFQpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VG9wVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy54ID0gdGhpcy5fZmxvYXRVcFN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ID0gdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQueCA9IHRoaXMuX2Zsb2F0U3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBBY2NlbGVyYXRvciA9IDA7XG5cbiAgICAgICAgdGhpcy5faXNBdHRhY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmVlZFN0b3BQb3N0dXJlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2F0dGFja0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9za2lsbFRpbWVTdGF0ZXMuc3BsaWNlKDAsIHRoaXMuX3NraWxsVGltZVN0YXRlcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9jdXJyUG9zdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlc1tpXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fbW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9pbml0aWF0aXZlTW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90YXJnZXRNb3ZlUG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0UG9zLnggPSB0aGlzLl9tb3ZlU3RhcnRQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQueCA9IHRoaXMuX2N1cnJNb3ZlU3BlZWQueSA9IDA7XG5cbiAgICAgICAgdGhpcy5fbmVlZFJlbGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWxpdmVFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlj5flh7vnu5Pkuovml7bpl7TvvIjljbPlj5flh7vnoaznm7TvvIlcbiAgICAgICAgdGhpcy5faHVydEVuZFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIOWAkuWcsOe7k+adn+aXtumXtFxuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIOi1t+i6q+e7k+adn+aXtumXtFxuICAgICAgICB0aGlzLl9yZWNvdmVyRW5kVGltZSA9IDA7XG5cbiAgICAgICAgdGhpcy5fYm9ybkVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2xhc3RIaXRSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgPSB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZTtcblxuICAgICAgICB0aGlzLl9ocCA9IHRoaXMuX2hwTWF4O1xuXG4gICAgICAgIHRoaXMuX21vZGVsLnkgPSAwO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5JRExFLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBib3JuOiBmdW5jdGlvbiBib3JuKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpICsgdGhpcy5fbW9kZWxBbmltYXRpb24uZ2V0Q2xpcHMoKVtBY3Rpb25DbGlwSW5kZXguQk9STl0uZHVyYXRpb247XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkJPUk4sIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgfSxcblxuICAgIHNldEFjdG9yUG9zaXRpb246IGZ1bmN0aW9uIHNldEFjdG9yUG9zaXRpb24oeCwgeSkge1xuICAgICAgICB0aGlzLm5vZGUueCA9IHg7XG4gICAgICAgIHRoaXMubm9kZS55ID0geTtcbiAgICB9LFxuXG4gICAgc2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBzZXREaXJlY3Rpb24oZGlyKSB7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IGRpciB8fCBkaXIgIT0gQWN0b3JEaXJlY3Rpb24uTEVGVCAmJiBkaXIgIT0gQWN0b3JEaXJlY3Rpb24uUklHSFQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGlyO1xuICAgICAgICB0aGlzLm5vZGUuc2NhbGVYID0gZGlyO1xuICAgIH0sXG5cbiAgICBnZXREaXJlY3Rpb246IGZ1bmN0aW9uIGdldERpcmVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcbiAgICB9LFxuXG4gICAgc2V0QWN0aW9uOiBmdW5jdGlvbiBzZXRBY3Rpb24oYWN0aW9uLCBkaXIsIHBhcmFtLCB0aW1lKSB7XG4gICAgICAgIHZhciBhY3Rpb25OYW1lID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQWN0b3JBY3Rpb24uQVRUQUNLOlxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWUgPSBBY3Rpb25OYW1lW2FjdGlvbl0gKyBwYXJhbTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZSA9IEFjdGlvbk5hbWVbYWN0aW9uXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyQWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB0aGlzLl9tb2RlbEFuaW1hdGlvbi5wbGF5KGFjdGlvbk5hbWUpO1xuICAgICAgICBpZiAoIXRpbWUgfHwgdGltZSA9PT0gMCkgdGhpcy5fY3VyckFjdGlvbkVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5jdXJyZW50Q2xpcC5kdXJhdGlvbjtlbHNlIHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpICsgdGltZTtcbiAgICAgICAgdGhpcy5zZXREaXJlY3Rpb24oZGlyKTtcbiAgICB9LFxuXG4gICAgc2V0SHA6IGZ1bmN0aW9uIHNldEhwKHZhbHVlLCBtYXgpIHtcbiAgICAgICAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAwO1xuICAgICAgICBpZiAodmFsdWUgPCAxKSB2YWx1ZSA9IDE7XG4gICAgICAgIHRoaXMuX2hwTWF4ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2hwID0gdmFsdWU7XG4gICAgfSxcblxuICAgIGdldEhwOiBmdW5jdGlvbiBnZXRIcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hwO1xuICAgIH0sXG5cbiAgICBnZXRDb2xsaXNpb246IGZ1bmN0aW9uIGdldENvbGxpc2lvbigpIHtcbiAgICAgICAgdmFyIHhmZiA9IHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKG5ldyBjYy5WZWMyKDAsIDApKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKG5ldyBjYy5WZWMyKHRoaXMuX2JveC54LCB0aGlzLl9ib3gueSkpO1xuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09IEFjdG9yRGlyZWN0aW9uLkxFRlQpIG9mZnNldC54IC09IHRoaXMuX2JveC53aWR0aDtcbiAgICAgICAgcmV0dXJuIG5ldyBjYy5SZWN0KG9mZnNldC54LCBvZmZzZXQueSwgdGhpcy5fYm94LndpZHRoLCB0aGlzLl9ib3guaGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgaXNEZWFkOiBmdW5jdGlvbiBpc0RlYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RlYWQ7XG4gICAgfSxcblxuICAgIHJlbGl2ZTogZnVuY3Rpb24gcmVsaXZlKCkge1xuICAgICAgICBpZiAodGhpcy5fbmVlZFJlbGl2ZSB8fCAhdGhpcy5faXNEZWFkKSByZXR1cm47XG4gICAgICAgIHRoaXMuX25lZWRSZWxpdmUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBzdGFydFJlbGl2ZTogZnVuY3Rpb24gc3RhcnRSZWxpdmUoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuX21vZGVsQW5pbWF0aW9uLmdldENsaXBzKClbQWN0aW9uQ2xpcEluZGV4LlJFTElWRV0uZHVyYXRpb24gKyAxO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5SRUxJVkUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgIHRoaXMucGxheVJlbGl2ZUVmZmVjdCgpO1xuICAgIH0sXG5cbiAgICBlbmRSZWxpdmU6IGZ1bmN0aW9uIGVuZFJlbGl2ZSgpIHtcbiAgICAgICAgdGhpcy5faXNEZWFkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWxpdmVFbmRUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgc3RhcnRIdXJ0OiBmdW5jdGlvbiBzdGFydEh1cnQodGltZSwgZGlyKSB7XG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpICsgdGltZTtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSFVSVCwgZGlyKTtcbiAgICB9LFxuXG4gICAgZW5kSHVydDogZnVuY3Rpb24gZW5kSHVydCgpIHtcbiAgICAgICAgdGhpcy5faHVydEVuZFRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydEZsb2F0OiBmdW5jdGlvbiBzdGFydEZsb2F0KHRvcFRpbWUsIHRvcEhlaWdodCwgZGlzdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGF0ZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSB0aGlzLl9mbG9hdFN0YXJ0VGltZSArIHRvcFRpbWU7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy54ID0gdGhpcy5ub2RlLng7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ID0gdGhpcy5fbW9kZWwueTtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueCA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAyICogdG9wSGVpZ2h0IC8gKHRvcFRpbWUgKiB0b3BUaW1lKTtcbiAgICAgICAgdGhpcy5fZmxvYXRTcGVlZC54ID0gZGlzdGFuY2UgLyAodG9wVGltZSAqIDIpO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnkgPSB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgKiB0b3BUaW1lO1xuICAgIH0sXG5cbiAgICBlbmRGbG9hdDogZnVuY3Rpb24gZW5kRmxvYXQoKSB7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VG9wVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRVcFN0YXJ0UG9zLnggPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQueCA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBBY2NlbGVyYXRvciA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0Q29sbGFwc2U6IGZ1bmN0aW9uIHN0YXJ0Q29sbGFwc2UoKSB7XG4gICAgICAgIHRoaXMuX2NvbGxhcHNlRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuX21vZGVsQW5pbWF0aW9uLmdldENsaXBzKClbQWN0aW9uQ2xpcEluZGV4LkNPTExBUFNFXS5kdXJhdGlvbiArIDE7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkNPTExBUFNFLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBlbmRDb2xsYXBzZTogZnVuY3Rpb24gZW5kQ29sbGFwc2UoKSB7XG4gICAgICAgIHRoaXMuX2NvbGxhcHNlRW5kVGltZSA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0UmVjb3ZlcjogZnVuY3Rpb24gc3RhcnRSZWNvdmVyKCkge1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9yZWNvdmVyRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuX21vZGVsQW5pbWF0aW9uLmdldENsaXBzKClbQWN0aW9uQ2xpcEluZGV4LlJFQ09WRVJdLmR1cmF0aW9uO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5SRUNPVkVSLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBlbmRSZWNvdmVyOiBmdW5jdGlvbiBlbmRSZWNvdmVyKCkge1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9yZW1haW5Db21ib1ZhbHVlID0gdGhpcy5fZGVmYXVsdENvbWJvVmFsdWU7XG4gICAgfSxcblxuICAgIG1vdmVUbzogZnVuY3Rpb24gbW92ZVRvKHgsIHksIHRpbWUsIGRpcikge1xuICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgIHZhciBzcGVlZFggPSAoeCAtIHRoaXMubm9kZS54KSAvIHRpbWU7XG4gICAgICAgIHZhciBzcGVlZFkgPSAoeSAtIHRoaXMubm9kZS55KSAvIHRpbWU7XG4gICAgICAgIHRoaXMuc3RhcnRNb3ZlKHNwZWVkWCwgc3BlZWRZLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpcik7XG4gICAgICAgIHRoaXMuX3RhcmdldE1vdmVQb3MgPSBuZXcgY2MuVmVjMih4LCB5KTtcbiAgICAgICAgdGhpcy5fbW92ZUVuZFRpbWUgPSB0aGlzLl9tb3ZlU3RhcnRUaW1lICsgdGltZTtcbiAgICB9LFxuXG4gICAgc3RhcnRNb3ZlOiBmdW5jdGlvbiBzdGFydE1vdmUoc3BlZWRYLCBzcGVlZFksIGluaXRpYXRpdmUpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBpbml0aWF0aXZlO1xuICAgICAgICB0aGlzLl9tb3ZlU3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB0aGlzLl9jdXJyTW92ZVNwZWVkLnggPSBzcGVlZFg7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQueSA9IHNwZWVkWTtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0UG9zLnggPSB0aGlzLm5vZGUueDtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0UG9zLnkgPSB0aGlzLm5vZGUueTtcbiAgICB9LFxuXG4gICAgc3RvcE1vdmU6IGZ1bmN0aW9uIHN0b3BNb3ZlKCkge1xuICAgICAgICB0aGlzLl9tb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fbW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9pbml0aWF0aXZlTW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90YXJnZXRNb3ZlUG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3Vyck1vdmVTcGVlZC54ID0gdGhpcy5fY3Vyck1vdmVTcGVlZC55ID0gMDtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0UG9zLnggPSB0aGlzLl9tb3ZlU3RhcnRQb3MueSA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0QXR0YWNrOiBmdW5jdGlvbiBzdGFydEF0dGFjayhwb3N0dXJlTGlzdCwgcG9zdHVyZUNvdW50LCBkaXIpIHtcbiAgICAgICAgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBvc3R1cmVDb3VudCA+IHRoaXMuX2N1cnJQb3N0dXJlcy5sZW5ndGgpIHBvc3R1cmVDb3VudCA9IHRoaXMuX2N1cnJQb3N0dXJlcy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9zdHVyZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlc1tpXSA9IHBvc3R1cmVMaXN0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlQ291bnQgPSBwb3N0dXJlQ291bnQ7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmxhdW5jaFBvc3R1cmUocG9zdHVyZUxpc3RbMF0sIGRpcik7XG4gICAgfSxcblxuICAgIHN0b3BBdHRhY2s6IGZ1bmN0aW9uIHN0b3BBdHRhY2soKSB7XG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnJlYWtQb3N0dXJlKCk7XG4gICAgfSxcblxuICAgIGxhdW5jaFBvc3R1cmU6IGZ1bmN0aW9uIGxhdW5jaFBvc3R1cmUocG9zdHVyZSwgZGlyKSB7XG4gICAgICAgIHRoaXMubGF1bmNoU2tpbGxUaW1lTGlzdChwb3N0dXJlKTtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uQVRUQUNLLCBkaXIsIHBvc3R1cmUuYWN0aW9uSW5kZXgsIHBvc3R1cmUudGltZSk7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSA9IHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IHBvc3R1cmU7XG4gICAgfSxcblxuICAgIGxhdW5jaFNraWxsVGltZUxpc3Q6IGZ1bmN0aW9uIGxhdW5jaFNraWxsVGltZUxpc3QocG9zdHVyZSkge1xuICAgICAgICB0aGlzLl9za2lsbFRpbWVTdGF0ZXMuc3BsaWNlKDAsIHRoaXMuX3NraWxsVGltZVN0YXRlcy5sZW5ndGgpO1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgIHZhciBjb3VudCA9IHBvc3R1cmUudGltZVBvaW50cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRpbWVQb2ludCA9IHBvc3R1cmUudGltZVBvaW50c1tpXTtcbiAgICAgICAgICAgIHZhciB0aW1lU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgdGltZVBvaW50OiB0aW1lUG9pbnQsXG4gICAgICAgICAgICAgICAgdGFrZUVuZFRpbWU6IGN1cnJUaW1lICsgdGltZVBvaW50LnRha2VUaW1lLFxuICAgICAgICAgICAgICAgIHBvc3R1cmU6IHBvc3R1cmUsXG4gICAgICAgICAgICAgICAgdGFrZWQ6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnB1c2godGltZVN0YXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBicmVha1Bvc3R1cmU6IGZ1bmN0aW9uIGJyZWFrUG9zdHVyZSgpIHtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnNwbGljZSgwLCB0aGlzLl9za2lsbFRpbWVTdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVJbmRleCA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0RGlzYXBwZWFyOiBmdW5jdGlvbiBzdGFydERpc2FwcGVhcigpIHtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uRElTQVBQRUFSLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzSHVydDogZnVuY3Rpb24gcHJvY2Vzc0h1cnQoY3VyclRpbWUpIHtcbiAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2h1cnRFbmRUaW1lKSB0aGlzLmVuZEh1cnQoKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0Zsb2F0OiBmdW5jdGlvbiBwcm9jZXNzRmxvYXQoY3VyclRpbWUpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLl9mbG9hdFN0YXRlKSB7XG4gICAgICAgICAgICAvL+S4iuWNh+i/h+eoi1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5IVVJUX0ZMWSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5IVVJUX0ZMWSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IGN1cnJUaW1lIC0gdGhpcy5fZmxvYXRTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2Zsb2F0VG9wVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lRWxhcGFzZWQgPSB0aGlzLl9mbG9hdFRvcFRpbWUgLSB0aGlzLl9mbG9hdFN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxvYXRTdGF0ZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMuX2Zsb2F0VXBTdGFydFBvcy54ICsgdGltZUVsYXBhc2VkICogdGhpcy5fZmxvYXRTcGVlZC54O1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fZmxvYXRVcFN0YXJ0UG9zLnkgKyB0aGlzLl9mbG9hdFNwZWVkLnkgKiB0aW1lRWxhcGFzZWQgLSB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgKiB0aW1lRWxhcGFzZWQgKiB0aW1lRWxhcGFzZWQgLyAyO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmdldEZpeGVkTW92ZVBvaW50KHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSwgeCwgdGhpcy5ub2RlLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gcmVzdWx0LmR4O1xuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLnkgPSB5O1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnggPSByZXN1bHQuZHg7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueSA9IHk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8v5LiL6JC96L+H56iLXG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJBY3Rpb24gIT09IEFjdG9yQWN0aW9uLkhVUlRfRkFMTCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5IVVJUX0ZBTEwsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBjdXJyVGltZSAtIHRoaXMuX2Zsb2F0VG9wVGltZTtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnggKyB0aW1lRWxhcGFzZWQgKiB0aGlzLl9mbG9hdFNwZWVkLng7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSB0aGlzLl9mbG9hdERvd25TdGFydFBvcy55IC0gMzAwMCAqICh0aW1lRWxhcGFzZWQgKiB0aW1lRWxhcGFzZWQpIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5nZXRGaXhlZE1vdmVQb2ludCh0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnksIHgsIHRoaXMubm9kZS55KTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHJlc3VsdC5keDtcbiAgICAgICAgICAgICAgICBpZiAoeSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mbG9hdFN0YXRlKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLnkgPSB5O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL+e7k+adn1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRmxvYXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC55ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Q29sbGFwc2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEFjdG9yUG9zaXRpb24odGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0NvbGxhcHNlOiBmdW5jdGlvbiBwcm9jZXNzQ29sbGFwc2UoY3VyclRpbWUpIHtcbiAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2NvbGxhcHNlRW5kVGltZSkgdGhpcy5lbmRDb2xsYXBzZSgpO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzUmVjb3ZlcjogZnVuY3Rpb24gcHJvY2Vzc1JlY292ZXIoY3VyclRpbWUpIHtcbiAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX3JlY292ZXJFbmRUaW1lKSB0aGlzLmVuZFJlY292ZXIoKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0F0dGFjazogZnVuY3Rpb24gcHJvY2Vzc0F0dGFjayhjdXJyVGltZSkge1xuICAgICAgICB2YXIgcG9zdHVyZSA9IHRoaXMuX2N1cnJQb3N0dXJlO1xuICAgICAgICBpZiAocG9zdHVyZSkge1xuICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJUaW1lID49IHRoaXMuX2F0dGFja0VuZFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXgrKztcbiAgICAgICAgICAgIGlmICh0aGlzLl9uZWVkU3RvcFBvc3R1cmUgfHwgdGhpcy5fY3VyclBvc3R1cmVJbmRleCA+PSB0aGlzLl9jdXJyUG9zdHVyZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc3R1cmUgPSB0aGlzLl9jdXJyUG9zdHVyZVt0aGlzLl9jdXJyUG9zdHVyZUluZGV4XTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhdW5jaFBvc3R1cmUocG9zdHVyZSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwcm9jZXNzTW92ZTogZnVuY3Rpb24gcHJvY2Vzc01vdmUoY3VyclRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJBY3Rpb24gIT09IEFjdG9yQWN0aW9uLlJVTikge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uUlVOLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwb3MgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB2YXIgdGltZUVsYXBhc2VkID0gY3VyclRpbWUgLSB0aGlzLl9tb3ZlU3RhcnRUaW1lO1xuICAgICAgICBpZiAodGhpcy5fbW92ZUVuZFRpbWUgPiAwICYmIGN1cnJUaW1lID49IHRoaXMuX21vdmVFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aW1lRWxhcGFzZWQgPSB0aGlzLl9tb3ZlRW5kVGltZSAtIHRoaXMuX21vdmVTdGFydFRpbWU7XG4gICAgICAgICAgICBwb3MueCA9IHRoaXMuX3RhcmdldE1vdmVQb3MueDtcbiAgICAgICAgICAgIHBvcy55ID0gdGhpcy5fdGFyZ2V0TW92ZVBvcy55O1xuICAgICAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zLnggPSB0aGlzLl9tb3ZlU3RhcnRQb3MueCArIHRpbWVFbGFwYXNlZCAqIHRoaXMuX2N1cnJNb3ZlU3BlZWQueDtcbiAgICAgICAgICAgIHBvcy55ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnkgKyB0aW1lRWxhcGFzZWQgKiB0aGlzLl9jdXJyTW92ZVNwZWVkLnk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNb3ZlUG9pbnQodGhpcy5ub2RlLngsIHRoaXMubm9kZS55LCBwb3MueCwgcG9zLnkpO1xuICAgICAgICB0aGlzLnNldEFjdG9yUG9zaXRpb24ocmVzdWx0LmR4LCByZXN1bHQuZHkpO1xuICAgIH0sXG5cbiAgICAvLyDliKTmlq3lvZPliY3liqjkvZzlj6/lkKblrozmiJDmiJblj6/lkKbmiZPmlq1cbiAgICBnZXRDdXJyZW50QWN0aW9uQ29tcGxldGVUeXBlOiBmdW5jdGlvbiBnZXRDdXJyZW50QWN0aW9uQ29tcGxldGVUeXBlKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWxpdmVFbmRUaW1lID4gMCB8fCB0aGlzLl9ib3JuRW5kVGltZSA+IDAgfHwgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPiAwIHx8IHRoaXMuX2Zsb2F0U3RhcnRUaW1lID4gMCB8fCB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPiAwIHx8IHRoaXMuX3JlY292ZXJFbmRUaW1lID4gMCB8fCB0aGlzLl9odXJ0RW5kVGltZSA+IDApIHJldHVybiBBY3Rpb25Db21wbGV0ZVR5cGUuVU5DT01QTEVUQUJMRTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuX2N1cnJBY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQWN0b3JBY3Rpb24uSURMRTpcbiAgICAgICAgICAgIGNhc2UgQWN0b3JBY3Rpb24uUlVOOlxuICAgICAgICAgICAgICAgIHJldHVybiBBY3Rpb25Db21wbGV0ZVR5cGUuQ09NUExFVEFCTEU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lKSByZXR1cm4gQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFO2Vsc2UgcmV0dXJuIEFjdGlvbkNvbXBsZXRlVHlwZS5CUkVBS0FCTEU7XG4gICAgfSxcblxuICAgIG5leHRBY3Rpb246IGZ1bmN0aW9uIG5leHRBY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb3ZlU3RhcnRUaW1lID4gMCkge1xuICAgICAgICAgICAgLy/kv53mjIHnp7vliqhcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5JRExFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSURMRSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuXG4gICAgYnJlYWthYmxlOiBmdW5jdGlvbiBicmVha2FibGUoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbmVlZERpc2FwcGVhcjogZnVuY3Rpb24gbmVlZERpc2FwcGVhcigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcblxuICAgICAgICBpZiAodGhpcy5fYm9ybkVuZFRpbWUgPiAwICYmIGN1cnJUaW1lID49IHRoaXMuX2Jvcm5FbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZWxpdmVFbmRUaW1lID4gMCAmJiBjdXJyVGltZSA+PSB0aGlzLl9yZWxpdmVFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLmVuZFJlbGl2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2Zsb2F0U3RhcnRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzRmxvYXQoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2h1cnRFbmRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzSHVydChjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY29sbGFwc2VFbmRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ29sbGFwc2UoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JlY292ZXJFbmRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmVjb3ZlcihjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmm7TmlrDmioDog73kvZznlKjml7bpl7TngrlcbiAgICAgICAgdGhpcy51cGRhdGVTa2lsbFRpbWVQb2ludHMoY3VyclRpbWUpO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0F0dGFja2luZykge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQXR0YWNrKGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9tb3ZlU3RhcnRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTW92ZShjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcGxldGVUeXBlID0gdGhpcy5nZXRDdXJyZW50QWN0aW9uQ29tcGxldGVUeXBlKGN1cnJUaW1lKTtcbiAgICAgICAgc3dpdGNoIChjb21wbGV0ZVR5cGUpIHtcbiAgICAgICAgICAgIC8vIOW3suWujOaIkOaIluWPr+WujOaIkFxuICAgICAgICAgICAgY2FzZSBBY3Rpb25Db21wbGV0ZVR5cGUuQ09NUExFVEFCTEU6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IHRoaXMuX2xvZ2ljTWFuYWdlci5nZXRQbGF5ZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2FiYycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9naWNNYW5hZ2VyLnJlbW92ZUVuaXR5KHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5DT0xMQVBTRSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNEZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRSZWxpdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZWVkRGlzYXBwZWFyKCkgJiYgdGhpcy5fY3VyckFjdGlvbiAhPSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGlzYXBwZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UmVjb3ZlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJFTElWRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uUkVDT1ZFUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uQk9STikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIOWPr+aJk+aWrVxuICAgICAgICAgICAgY2FzZSBBY3Rpb25Db21wbGV0ZVR5cGUuQlJFQUtBQkxFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJyZWFrYWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8g5pyq5a6M5oiQ5oiW5LiN5Y+v5a6M5oiQXG4gICAgICAgICAgICBjYXNlIEFjdGlvbkNvbXBsZXRlVHlwZS5VTkNPTVBMRVRBQkxFOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNraWxsVGltZVBvaW50czogZnVuY3Rpb24gdXBkYXRlU2tpbGxUaW1lUG9pbnRzKGN1cnJUaW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGltZVN0YXRlID0gdGhpcy5fc2tpbGxUaW1lU3RhdGVzW2ldO1xuICAgICAgICAgICAgaWYgKCF0aW1lU3RhdGUudGFrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGltZVN0YXRlLnRha2VFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFrZVNraWxsVGltZVBvaW50KHRpbWVTdGF0ZS50aW1lUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lU3RhdGUudGFrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxUaW1lUG9pbnQ6IGZ1bmN0aW9uIHRha2VTa2lsbFRpbWVQb2ludCh0aW1lUG9pbnQpIHtcbiAgICAgICAgc3dpdGNoICh0aW1lUG9pbnQuYWN0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLkRBTUFHRTpcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VTa2lsbERhbWFnZSh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLlNFTEZfREVMQVk6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlU2tpbGxTZWxmRGVsYXkodGltZVBvaW50KTticmVhaztcbiAgICAgICAgICAgIGNhc2UgVGltZVBvaW50QWN0VHlwZS5TSE9DS19TQ1JFRU46XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwLnNob2NrKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRpbWVQb2ludEFjdFR5cGUuUExBWV9FRkZFQ1Q6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlUGxheUVmZmVjdCh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRha2VTa2lsbERhbWFnZTogZnVuY3Rpb24gdGFrZVNraWxsRGFtYWdlKHRpbWVQb2ludCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2UobmV3IGNjLlZlYzIodGltZVBvaW50LnJhbmdlLngsIHRpbWVQb2ludC5yYW5nZS55KSk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgb2Zmc2V0LnggLT0gdGltZVBvaW50LnJhbmdlLndpZHRoO1xuICAgICAgICB2YXIgcmVnaW9uID0gbmV3IGNjLlJlY3Qob2Zmc2V0LngsIG9mZnNldC55LCB0aW1lUG9pbnQucmFuZ2Uud2lkdGgsIHRpbWVQb2ludC5yYW5nZS5oZWlnaHQpO1xuICAgICAgICB2YXIgaGl0dGluZ0FjdG9ycyA9IG51bGw7XG4gICAgICAgIHZhciBwbGF5ZXIgPSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCk7XG4gICAgICAgIHZhciBhdHRhY2tWYWx1ZSA9IHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICAgICAgaWYgKHRoaXMgPT09IHBsYXllcikgaGl0dGluZ0FjdG9ycyA9IHRoaXMuX2xvZ2ljTWFuYWdlci5nZXRBY3RvckJ5UmVnaW9uKHRoaXMsIHJlZ2lvbik7ZWxzZSB7XG4gICAgICAgICAgICBoaXR0aW5nQWN0b3JzID0gW3BsYXllcl07XG4gICAgICAgICAgICBhdHRhY2tWYWx1ZSArPSAodGhpcy5fbG9naWNNYW5hZ2VyLmdldFJvdW5kKCkgLSAxKSAqIDIwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaXR0aW5nQWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSBoaXR0aW5nQWN0b3JzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLnN0dWNrKHRoaXMsIHJlZ2lvbi5jbG9uZSgpLCB0aW1lUG9pbnQuYXR0YWNrVHlwZSwgYXR0YWNrVmFsdWUsIHRpbWVQb2ludC5hdHRhY2tQYXJhbSkpIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAmJiB0aW1lUG9pbnQuc291bmQgJiYgdGltZVBvaW50LnNvdW5kICE9PSAwKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kL1wiICsgdGltZVBvaW50LnNvdW5kLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGF1ZGlvQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gcmVzdWx0O1xuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxTZWxmRGVsYXk6IGZ1bmN0aW9uIHRha2VTa2lsbFNlbGZEZWxheSh0aW1lUG9pbnQpIHtcbiAgICAgICAgdGhpcy5fYXR0YWNrRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICB9LFxuXG4gICAgdGFrZVBsYXlFZmZlY3Q6IGZ1bmN0aW9uIHRha2VQbGF5RWZmZWN0KHRpbWVQb2ludCkge1xuICAgICAgICBpZiAodGhpcy5fbG9naWNNYW5hZ2VyKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gbmV3IGNjLlZlYzIodGhpcy5ub2RlLnggKyB0aW1lUG9pbnQucG9zaXRpb24ueCwgdGhpcy5ub2RlLnkgKyB0aW1lUG9pbnQucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9sb2dpY01hbmFnZXIucGxheUVmZmVjdCh0aW1lUG9pbnQuaWQsIHRpbWVQb2ludC5sYXllciwgcG9zLCB0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3R1Y2s6IGZ1bmN0aW9uIHN0dWNrKGFjdG9yLCByZWdpb24sIGF0dGFja1R5cGUsIGF0dGFja1ZhbHVlLCBhdHRhY2tQYXJhbSkge1xuICAgICAgICBpZiAodGhpcy5faXNJbnZpbmNpYmxlIHx8IHRoaXMuX2lzRGVhZCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGFtYWdlKGF0dGFja1ZhbHVlKTtcbiAgICAgICAgdGhpcy5wbGF5SGl0RWZmZWN0KHJlZ2lvbik7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPiAwKSB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0F0dGFja2luZykgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0RmxvYXQoMC43LCAxNTAsIDE1MCAqIGFjdG9yLmdldERpcmVjdGlvbigpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAoYXR0YWNrVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5OT1JNQUw6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0SHVydCgwLjUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5GTFk6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgLT0gYXR0YWNrUGFyYW0uY29tYm87XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5Db21ib1ZhbHVlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgPSB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEZsb2F0KGF0dGFja1BhcmFtLnRvcFRpbWUsIGF0dGFja1BhcmFtLnRvcEhlaWdodCwgYXR0YWNrUGFyYW0uZGlzdGFuY2UgKiBhY3Rvci5nZXREaXJlY3Rpb24oKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGRhbWFnZTogZnVuY3Rpb24gZGFtYWdlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2hwIC09IHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5faHAgPCAwKSB0aGlzLl9ocCA9IDA7XG4gICAgICAgIGlmICh0aGlzLl9ocCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpcy5fbG9naWNNYW5hZ2VyLmdldFBsYXllcigpKSB0aGlzLl9sb2dpY01hbmFnZXIua2lsbE1vbnN0ZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXlSZWxpdmVFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlSZWxpdmVFZmZlY3QoKSB7fSxcblxuICAgIHBsYXlIaXRFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlIaXRFZmZlY3QocmVnaW9uKSB7XG4gICAgICAgIHZhciBwb2ludCA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2UobmV3IGNjLlZlYzIocmVnaW9uLngsIHJlZ2lvbi55KSk7XG4gICAgICAgIHJlZ2lvbi54ID0gcG9pbnQueDtcbiAgICAgICAgcmVnaW9uLnkgPSBwb2ludC55O1xuICAgICAgICB2YXIgYm94ID0gdGhpcy5fYm94LmNsb25lKCk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgcmVnaW9uLnggPSAtcmVnaW9uLng7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjYy5yZWN0SW50ZXJzZWN0aW9uKHJlZ2lvbiwgdGhpcy5fYm94KTtcbiAgICAgICAgdmFyIHBvcyA9IG5ldyBjYy5WZWMyKHRoaXMubm9kZS54ICsgaW50ZXJzZWN0aW9uLmNlbnRlci54LCB0aGlzLm5vZGUueSArIGludGVyc2VjdGlvbi5jZW50ZXIueSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvZWZmZWN0LzRcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBub2RlLnggPSBwb3MueDtcbiAgICAgICAgICAgIG5vZGUueSA9IHBvcy55O1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltYXRpb24ub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX21hcC5hZGRFZmZlY3Qobm9kZSwgMSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpO1xuICAgICAgICB2YXIgbG9ja1Jlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQobWFwUmVzdWx0LnN4LCBtYXBSZXN1bHQuc3ksIG1hcFJlc3VsdC5keCwgbWFwUmVzdWx0LmR5KTtcbiAgICAgICAgaWYgKCFsb2NrUmVzdWx0LnBhc3MpIHtcbiAgICAgICAgICAgIGxvY2tSZXN1bHQucGFzcyA9IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5zeCkgIT09IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5keCkgfHwgTWF0aC5mbG9vcihsb2NrUmVzdWx0LnN5KSAhPT0gTWF0aC5mbG9vcihsb2NrUmVzdWx0LmR5KTtcbiAgICAgICAgICAgIHJldHVybiBsb2NrUmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9ja1Jlc3VsdC5wYXNzID0gbWFwUmVzdWx0LnBhc3M7XG4gICAgICAgICAgICByZXR1cm4gbG9ja1Jlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwUmVzdWx0O1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1hcE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFBpeGVzU2l6ZSA9IHRoaXMuX21hcC5nZXRNYXBQaXhlc1NpemUoKTtcbiAgICAgICAgdmFyIG1hcFBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAoc3ggPCAwKSB7XG4gICAgICAgICAgICBzeCA9IDA7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5mbG9vcihzeCkgPj0gbWFwUGl4ZXNTaXplLndpZHRoKSB7XG4gICAgICAgICAgICBzeCA9IG1hcFBpeGVzU2l6ZS53aWR0aCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN5IDwgMCkge1xuICAgICAgICAgICAgc3kgPSAwO1xuICAgICAgICAgICAgbWFwUGFzcyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3Ioc3kpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHN5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdU91dCA9IGZhbHNlLFxuICAgICAgICAgICAgdk91dCA9IGZhbHNlO1xuICAgICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmZsb29yKGR4KSA+PSBtYXBQaXhlc1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIGR4ID0gbWFwUGl4ZXNTaXplLndpZHRoIC0gMTtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3IoZHkpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIGR5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1T3V0ICYmIHZPdXQpIG1hcFBhc3MgPSBmYWxzZTtcblxuICAgICAgICB2YXIgbGluZVBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobWFwUGFzcykge1xuICAgICAgICAgICAgdmFyIHRpbGVTaXplID0gdGhpcy5fbWFwLmdldFRpbGVTaXplKCk7XG4gICAgICAgICAgICB2YXIgdXggPSBzeCAvIHRpbGVTaXplLndpZHRoO1xuICAgICAgICAgICAgdmFyIHV5ID0gc3kgLyB0aWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgdWR4ID0gZHggLyB0aWxlU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciB1ZHkgPSBkeSAvIHRpbGVTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHZhciBweCA9IHVkeCAtIHV4O1xuICAgICAgICAgICAgdmFyIHB5ID0gdWR5IC0gdXk7XG4gICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgubWF4KDEsIE1hdGgubWF4KE1hdGguY2VpbChNYXRoLmFicyhweCkpLCBNYXRoLmNlaWwoTWF0aC5hYnMocHkpKSkpO1xuXG4gICAgICAgICAgICBweCA9IHB4IC8gZGlzdDtcbiAgICAgICAgICAgIHB5ID0gcHkgLyBkaXN0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRpc3QgLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdYID0gTWF0aC5mbG9vcih1eCArIHB4KTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3WSA9IE1hdGguZmxvb3IodXkgKyBweSk7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFggPSBNYXRoLmZsb29yKHV4KTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkWSA9IE1hdGguZmxvb3IodXkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXAuY2hlY2tNb3ZlUG9pbnQobmV3WCwgbmV3WSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXggKz0gcHg7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG5ld1gsIG9sZFkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV4ICs9IHB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG9sZFgsIG5ld1kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVQYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR4ID0gTWF0aC5mbG9vcih1eCAqIHRpbGVTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGR5ID0gTWF0aC5mbG9vcih1eSAqIHRpbGVTaXplLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwYXNzOiBtYXBQYXNzICYmIGxpbmVQYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICB9LFxuXG4gICAgZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQ6IGZ1bmN0aW9uIGdldEZpeGVkTG9ja1JlZ2lvblBvaW50KHN4LCBzeSwgZHgsIGR5KSB7XG4gICAgICAgIHZhciBsb2NrUmVnaW9uID0gdGhpcy5fbWFwLmxvY2tSZWdpb24uY2xvbmUoKTtcbiAgICAgICAgaWYgKGxvY2tSZWdpb24ueE1pbiA9PT0gMCAmJiBsb2NrUmVnaW9uLnlNaW4gPT09IDAgJiYgbG9ja1JlZ2lvbi54TWF4ID09PSAwICYmIGxvY2tSZWdpb24ueE1heCA9PT0gMCkge1xuICAgICAgICAgICAgbG9ja1JlZ2lvbi54TWluID0gMDtcbiAgICAgICAgICAgIGxvY2tSZWdpb24ueU1pbiA9IDA7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnhNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkud2lkdGg7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnlNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYWx0V2lkdGggPSB0aGlzLmdldENvbGxpc2lvbigpLndpZHRoIC8gMjtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWluICs9IGhhbHRXaWR0aDtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWF4IC09IGhhbHRXaWR0aDtcbiAgICAgICAgdmFyIHBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobG9ja1JlZ2lvbi5jb250YWlucyhuZXcgY2MuVmVjMihzeCwgc3kpKSkge1xuICAgICAgICAgICAgaWYgKGR4IDw9IGxvY2tSZWdpb24ueE1pbikge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWluICsgMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGR4ID49IGxvY2tSZWdpb24ueE1heCkge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWF4IC0gMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHkgPD0gbG9ja1JlZ2lvbi55TWluKSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNaW4gKyAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZHkgPj0gbG9ja1JlZ2lvbi55TWF4KSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNYXggLSAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0geyBwYXNzOiBwYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZmNTJiSHczeXBLTTRKTHhpMldoV0wvJywgJ2FjdG9yX2RlZmluZScpO1xuLy8gc2NyaXB0XFxhY3RvclxcYWN0b3JfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFjdG9yRGlyZWN0aW9uOiB7XG4gICAgICAgIExFRlQ6IC0xLFxuICAgICAgICBSSUdIVDogMVxuICAgIH0sXG5cbiAgICBBY3RvckFjdGlvbjoge1xuICAgICAgICBJRExFOiAwLFxuICAgICAgICBQUkVSVU46IDEsXG4gICAgICAgIFJVTjogMixcbiAgICAgICAgQVRUQUNLOiAzLFxuICAgICAgICBIVVJUOiA0LFxuICAgICAgICBIVVJUX0ZMWTogNSxcbiAgICAgICAgSFVSVF9GQUxMOiA2LFxuICAgICAgICBDT0xMQVBTRTogNyxcbiAgICAgICAgUkVDT1ZFUjogOCxcbiAgICAgICAgQk9STjogOSxcbiAgICAgICAgRElTQVBQRUFSOiAxMCxcbiAgICAgICAgUkVMSVZFOiAxMVxuICAgIH0sXG5cbiAgICBBY3Rpb25OYW1lOiBbXCJpZGxlXCIsIFwicHJlcnVuXCIsIFwicnVuXCIsIFwiYXR0YWNrX1wiLCBcImh1cnRcIiwgXCJodXJ0X2ZseVwiLCBcImh1cnRfZmFsbFwiLCBcImNvbGxhcHNlXCIsIFwic3RhbmR1cFwiLCBcImJvcm5cIiwgXCJkaXNhcHBlYXJcIiwgXCJyZWxpdmVcIl0sXG5cbiAgICBBY3Rpb25DbGlwSW5kZXg6IHtcbiAgICAgICAgSURMRTogMCxcbiAgICAgICAgUlVOOiAxLFxuICAgICAgICBBVFRBQ0tfMTogMixcbiAgICAgICAgQVRUQUNLXzI6IDMsXG4gICAgICAgIEFUVEFDS18zOiA0LFxuICAgICAgICBIVVJUOiA1LFxuICAgICAgICBIVVJUX0ZMWTogNixcbiAgICAgICAgSFVSVF9GQUxMOiA3LFxuICAgICAgICBDT0xMQVBTRTogOCxcbiAgICAgICAgUkVDT1ZFUjogOSxcbiAgICAgICAgQk9STjogMTAsXG4gICAgICAgIERJU0FQUEVBUjogMTEsXG4gICAgICAgIFJFTElWRTogMTJcbiAgICB9LFxuXG4gICAgQWN0aW9uQ29tcGxldGVUeXBlOiB7XG4gICAgICAgIENPTVBMRVRBQkxFOiAwLFxuICAgICAgICBVTkNPTVBMRVRBQkxFOiAxLFxuICAgICAgICBCUkVBS0FCTEU6IDJcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2Y2YmZJQy9vVkhJYktpazhxTTJIQUMnLCAnYXR0YWNrX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcYXR0YWNrX2N0cmwuanNcblxudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgYXR0YWNrQToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYXR0YWNrQjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWN0aW9uVGltZTogMC4xXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5vblRvdWNoQ2FuY2VsLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGxheWVyOiBmdW5jdGlvbiBzZXRQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgIHRoaXMuX3BsYXllckN0cmwgPSBwbGF5ZXI7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9TdGFydFN0YWZmKCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9FbmRTdGFmZigpO1xuICAgICAgICAvL3RoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LkhJVCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuSElUKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaENhbmNlbDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBkb1N0YXJ0U3RhZmY6IGZ1bmN0aW9uIGRvU3RhcnRTdGFmZigpIHtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVPdXQodGhpcy5hY3Rpb25UaW1lKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICBkb0VuZFN0YWZmOiBmdW5jdGlvbiBkb0VuZFN0YWZmKCkge1xuICAgICAgICB0aGlzLmF0dGFja0Euc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLm9wYWNpdHkgPSAwO1xuICAgICAgICB2YXIgdGltZSA9ICgyNTUgLSB0aGlzLmF0dGFja0Eub3BhY2l0eSkgLyAyNTUgKiB0aGlzLmFjdGlvblRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZUluKHRoaXMuYWN0aW9uVGltZSk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NlNTE4RkhSbDlBVXB5aFR3SlhLbTV1JywgJ2JhdHRsZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGJhdHRsZV9jdHJsLmpzXG5cbnZhciBIdXJsZGVEZWZpbmUgPSByZXF1aXJlKFwiaHVyZGxlX2RlZmluZVwiKTtcbnZhciBDb250cm9sRGVmaW5lID0gcmVxdWlyZShcImNvbnRyb2xfZGVmaW5lXCIpO1xudmFyIFRyaWdnZXJUeXBlID0gSHVybGRlRGVmaW5lLlRyaWdnZXJUeXBlO1xudmFyIENtZFR5cGUgPSBIdXJsZGVEZWZpbmUuQ21kVHlwZTtcbnZhciBDb25kVHlwZSA9IEh1cmxkZURlZmluZS5Db25kVHlwZTtcbnZhciBDb250cm9sS2V5ID0gQ29udHJvbERlZmluZS5Db250cm9sS2V5O1xuXG52YXIgSHVyZGxlTG9hZEJpdCA9IHtcbiAgICBNQVA6IDB4MDAwMVxufTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRyYW5zZm9ybU1hc2s6IGNjLk5vZGUsXG4gICAgICAgIGpveVN0aWNrOiBjYy5Ob2RlLFxuICAgICAgICBhdHRhY2tCdXR0b246IGNjLk5vZGUsXG4gICAgICAgIG1hcExheWVyOiBjYy5Ob2RlLFxuICAgICAgICBjb250cm9sTGF5ZXI6IGNjLk5vZGUsXG4gICAgICAgIHN0YXRlQmFyOiBjYy5Ob2RlLFxuICAgICAgICBtb3ZlVGlwczogY2MuTm9kZSxcbiAgICAgICAgcm91bmRCYXI6IGNjLk5vZGUsXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKTtcbiAgICAgICAgbWFuYWdlci5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIG1hbmFnZXIuZW5hYmxlZERlYnVnRHJhdyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3VpTWFuYWdlciA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoJ3VpX21hbmFnZXInKTtcblxuICAgICAgICAvLyDmjqfliLbnm7jlhbNcbiAgICAgICAgdGhpcy5fcm91bmRCYXIgPSB0aGlzLnJvdW5kQmFyLmdldENvbXBvbmVudCgncm91bmRfY3RybCcpO1xuICAgICAgICB0aGlzLl9qb3lTdGljayA9IHRoaXMuam95U3RpY2suZ2V0Q29tcG9uZW50KFwiam95X2N0cmxcIik7XG4gICAgICAgIHRoaXMuX2F0dGFja0J1dHRvbiA9IHRoaXMuYXR0YWNrQnV0dG9uLmdldENvbXBvbmVudChcImF0dGFja19jdHJsXCIpO1xuICAgICAgICB0aGlzLl9zdGF0ZUJhciA9IHRoaXMuc3RhdGVCYXIuZ2V0Q29tcG9uZW50KFwic3RhdGVfY3RybFwiKTtcbiAgICAgICAgdGhpcy5fcGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpLmdldENvbXBvbmVudCgncGxheWVyX2N0cmwnKTtcbiAgICAgICAgdGhpcy5fcGxheWVyLmxvZ2ljTWFuYWdlciA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3BsYXllci5zdGF0ZUJhciA9IHRoaXMuX3N0YXRlQmFyO1xuICAgICAgICB0aGlzLl9qb3lTdGljay5zZXRQbGF5ZXIodGhpcy5fcGxheWVyKTtcbiAgICAgICAgdGhpcy5fYXR0YWNrQnV0dG9uLnNldFBsYXllcih0aGlzLl9wbGF5ZXIpO1xuXG4gICAgICAgIC8vIOWFs+WNoeebuOWFs1xuICAgICAgICB0aGlzLl9jdXJySHVyZGxlSWQgPSAtMTtcbiAgICAgICAgdGhpcy5faHVyZGxlTG9hZE1hc2sgPSAwO1xuICAgICAgICB0aGlzLl9zdGFydHRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ZhaWwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNGaW5pc2ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hcCA9IG51bGw7XG5cbiAgICAgICAgLy8g5Lu75Yqh55u45YWzXG4gICAgICAgIHRoaXMuX21pc3Npb25zID0gW107XG4gICAgICAgIHRoaXMuX3RyaWdnZXJzID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJNaXNzaW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2h1cmRsZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2tpbGxOdW0gPSAwO1xuICAgICAgICB0aGlzLl9yb3VuZE51bSA9IDA7XG5cbiAgICAgICAgdGhpcy5fa2VlcEVmZmVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5fbW9uc3RlcnMgPSBbXTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0ge1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IHNlbGYub25LZXlQcmVzc2VkLmJpbmQoc2VsZiksXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiBzZWxmLm9uS2V5UmVsZWFzZWQuYmluZChzZWxmKVxuICAgICAgICB9O1xuICAgICAgICAvLyDnu5HlrprpvKDmoIfkuovku7ZcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHRoaXMuX2xpc3RlbmVyLCB0aGlzLm5vZGUpO1xuXG4gICAgICAgIC8vIOadpeiHquWksei0peeql+WPo++8jOWkjea0u+aMiemSrlxuICAgICAgICB0aGlzLl9yZWxpdmVIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9SRVRSWV9HQU1FLCB0aGlzLm9uUmV0cnlHYW1lLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9yZXR1cm5IYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9SRVRVUk5fR0FNRSwgdGhpcy5vblJldHVybkV2ZW50LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3JlbGl2ZUhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fcmV0dXJuSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX3JlbGl2ZUhhbmRsZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZXR1cm5IYW5kbGVyID0gbnVsbDtcbiAgICAgICAgLy8g5LiN6IO96L+Z5qC35YGa77yMZGVzdHJveeaXtuaJgOaciWxpc3RlbmVy5bey56e76ZmkXG4gICAgICAgIC8vY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX2xpc3RlbmVyKTtcbiAgICB9LFxuXG4gICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGNrID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5VUDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkxFRlQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5zOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ET1dOO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuUklHSFQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5qOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ISVQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNrICYmIHRoaXMuX3BsYXllcikgdGhpcy5fcGxheWVyLmtleURvd24oY2spO1xuICAgIH0sXG5cbiAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgIHZhciBjayA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkudzpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuVVA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5MRUZUO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuczpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuRE9XTjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LlJJR0hUO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuajpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuSElUO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjayAmJiB0aGlzLl9wbGF5ZXIpIHRoaXMuX3BsYXllci5rZXlVcChjayk7XG4gICAgfSxcblxuICAgIG9uUmV0cnlHYW1lOiBmdW5jdGlvbiBvblJldHJ5R2FtZSgpIHtcbiAgICAgICAgLy90aGlzLmNoYW5nZUh1cmRsZSh0aGlzLl9jdXJySHVyZGxlSWQpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIucmVsaXZlKCk7XG4gICAgfSxcblxuICAgIG9uUmV0dXJuRXZlbnQ6IGZ1bmN0aW9uIG9uUmV0dXJuRXZlbnQoKSB7XG4gICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIC8vdGhpcy5sb2FkTXVzaWMoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VIdXJkbGUoMCk7XG4gICAgfSxcblxuICAgIGNsZWFyRWZmZWN0czogZnVuY3Rpb24gY2xlYXJFZmZlY3RzKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fa2VlcEVmZmVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9rZWVwRWZmZWN0cy5wb3AoKTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyTW9uc3RlcjogZnVuY3Rpb24gY2xlYXJNb25zdGVyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fbW9uc3RlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG1vbiA9IHRoaXMuX21vbnN0ZXJzLnBvcCgpO1xuICAgICAgICAgICAgbW9uLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyTWlzc2lvbjogZnVuY3Rpb24gY2xlYXJNaXNzaW9uKCkge1xuICAgICAgICB0aGlzLl90cmlnZ2Vycy5zcGxpY2UoMCwgdGhpcy5fdHJpZ2dlcnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fbWlzc2lvbnMuc3BsaWNlKDAsIHRoaXMuX21pc3Npb25zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2N1cnJNaXNzaW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2tpbGxOdW0gPSAwO1xuICAgIH0sXG5cbiAgICBjbGVhckh1cmRsZTogZnVuY3Rpb24gY2xlYXJIdXJkbGUoKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlci5jbG9zZUFsbCgpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIubWFwID0gbnVsbDtcbiAgICAgICAgdGhpcy5jbGVhckVmZmVjdHMoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVNYXAoKTtcbiAgICAgICAgdGhpcy5jbGVhck1vbnN0ZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhck1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVJZCA9IC0xO1xuICAgICAgICB0aGlzLl9odXJkbGVMb2FkTWFzayA9IDA7XG4gICAgICAgIHRoaXMuX2h1cmRsZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2lzRmFpbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yb3VuZE51bSA9IDA7XG4gICAgICAgIHRoaXMucm91bmRCYXIuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGluaXRNaXNzaW9uOiBmdW5jdGlvbiBpbml0TWlzc2lvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJySHVyZGxlQ29uZmlnKSByZXR1cm47XG4gICAgICAgIHZhciBjZmcgPSB0aGlzLl9jdXJySHVyZGxlQ29uZmlnO1xuICAgICAgICBmb3IgKHZhciBpID0gY2ZnLm1pc3Npb24ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHRoaXMuX21pc3Npb25zLnB1c2goY2ZnLm1pc3Npb25baV0pO1xuICAgICAgICB0aGlzLl9taXNzaW9uU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IDA7XG4gICAgfSxcblxuICAgIGNoYW5nZUh1cmRsZTogZnVuY3Rpb24gY2hhbmdlSHVyZGxlKGlkKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9jdXJySHVyZGxlSWQgPj0gMCAmJiB0aGlzLl9jdXJySHVyZGxlSWQgPT09IGlkKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSgwKTtcbiAgICAgICAgfSBlbHNlIGlmIChpZCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybU1hc2suc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtTWFzay5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgdGhpcy5sb2FkSHVyZGxlKGlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJIdXJkbGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uIHRyYW5zZm9ybSh0eXBlLCBib3JuKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtTWFzay5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgc2VxdWVuY2UgPSBudWxsO1xuICAgICAgICB2YXIgYWN0aW9uID0gbnVsbDtcbiAgICAgICAgdmFyIHRpbWUgPSAwO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlID09PSAwKSB7XG4gICAgICAgICAgICAvL+WPmOm7kVxuICAgICAgICAgICAgdGltZSA9ICgyNTUgLSB0aGlzLnRyYW5zZm9ybU1hc2sub3BhY2l0eSkgLyAyNTUgKiAwLjU7XG4gICAgICAgICAgICBhY3Rpb24gPSBuZXcgY2MuU2VxdWVuY2UobmV3IGNjLkZhZGVJbih0aW1lKSwgbmV3IGNjLkNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc2V0SHVyZGxlKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgLy8g5Y+Y6YCP5piOXG4gICAgICAgICAgICBpZiAoYm9ybikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGltZSA9IHRoaXMudHJhbnNmb3JtTWFzay5vcGFjaXR5IC8gMjU1ICogMC41O1xuICAgICAgICAgICAgYWN0aW9uID0gbmV3IGNjLlNlcXVlbmNlKG5ldyBjYy5GYWRlT3V0KHRpbWUpLCBuZXcgY2MuQ2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChib3JuKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllci5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllci5zZXRIcCgyMDAsIDIwMCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3BsYXllci5ib3JuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRIdXJkbGUoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyYW5zZm9ybU1hc2sucnVuQWN0aW9uKGFjdGlvbik7XG4gICAgfSxcblxuICAgIHN0YXJ0SHVyZGxlOiBmdW5jdGlvbiBzdGFydEh1cmRsZSgpIHtcbiAgICAgICAgdGhpcy5sb2FkTXVzaWMoKTtcbiAgICAgICAgdGhpcy5fcm91bmROdW0rKztcbiAgICAgICAgdGhpcy5yb3VuZEJhci5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9yb3VuZEJhci5zZXRSb3VuZCh0aGlzLl9yb3VuZE51bSk7XG4gICAgICAgIHRoaXMuX3BsYXllci5jb250cm9sRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbG9hZEh1cmRsZTogZnVuY3Rpb24gbG9hZEh1cmRsZShpZCkge1xuICAgICAgICB2YXIgY2ZnID0gR2xvYmFsLmh1cmRsZVByb3ZpZGVyLmdldENvbmZpZyhpZCk7XG4gICAgICAgIGlmICghY2ZnKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2xlYXJIdXJkbGUoKTtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUlkID0gaWQ7XG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVDb25maWcgPSBjZmc7XG4gICAgICAgIHRoaXMuaW5pdE1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5sb2FkTWFwKGNmZy5tYXBJZCk7XG4gICAgfSxcblxuICAgIHJlc2V0SHVyZGxlOiBmdW5jdGlvbiByZXNldEh1cmRsZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJySHVyZGxlQ29uZmlnKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlci5jbG9zZUFsbCgpO1xuICAgICAgICB0aGlzLmNsZWFyRWZmZWN0cygpO1xuICAgICAgICB0aGlzLl9tYXAucmVzZXQoKTtcbiAgICAgICAgdGhpcy5jbGVhck1vbnN0ZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhck1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5pbml0TWlzc2lvbigpO1xuICAgICAgICB0aGlzLl9pc0ZhaWwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNGaW5pc2ggPSB0cnVlO1xuICAgICAgICB0aGlzLnJvdW5kQmFyLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fcGxheWVyLnNldEFjdG9yUG9zaXRpb24odGhpcy5fY3Vyckh1cmRsZUNvbmZpZy5ib3JuUG9zLngsIHRoaXMuX2N1cnJIdXJkbGVDb25maWcuYm9yblBvcy55KTtcbiAgICAgICAgdGhpcy5fcGxheWVyLm1hcCA9IHRoaXMuX21hcDtcbiAgICAgICAgdGhpcy5fcGxheWVyLnNldEhwKDIwMCwgMjAwKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oMSk7XG4gICAgfSxcblxuICAgIGxhdW5jaE1pc3Npb246IGZ1bmN0aW9uIGxhdW5jaE1pc3Npb24oKSB7XG4gICAgICAgIHZhciBtaXNzaW9uID0gdGhpcy5fbWlzc2lvbnMucG9wKCk7XG4gICAgICAgIGlmICghbWlzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fY3Vyck1pc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N1cnJNaXNzaW9uID0gbWlzc2lvbjtcbiAgICAgICAgdGhpcy5fdHJpZ2dlcnMuc3BsaWNlKDAsIHRoaXMuX3RyaWdnZXJzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWlzc2lvbi50cmlnZ2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcnMucHVzaChtaXNzaW9uLnRyaWdnZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9raWxsTnVtID0gMDtcbiAgICAgICAgdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGxvYWRNdXNpYzogZnVuY3Rpb24gbG9hZE11c2ljKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwic291bmQvYmdcIiwgY2MuQXVkaW9DbGlwLCBmdW5jdGlvbiAoZXJyLCBhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIGNjLmxvZygncGxheSBtdXNpYycpO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKGF1ZGlvQ2xpcCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBsb2FkTWFwOiBmdW5jdGlvbiBsb2FkTWFwKGlkKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvbWFwL1wiICsgaWQudG9TdHJpbmcoKSwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICBzZWxmLm9uSHVyZGxlU3RlcExvYWRlZChIdXJkbGVMb2FkQml0Lk1BUCwgZXJyLCBwcmVmYWIpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlTWFwOiBmdW5jdGlvbiByZW1vdmVNYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFwKSByZXR1cm47XG4gICAgICAgIHRoaXMuX21hcC5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hcC5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFwID0gbnVsbDtcbiAgICB9LFxuXG4gICAgb25IdXJkbGVTdGVwTG9hZGVkOiBmdW5jdGlvbiBvbkh1cmRsZVN0ZXBMb2FkZWQoYml0LCBlcnIsIHByZWZhYikge1xuICAgICAgICBzd2l0Y2ggKGJpdCkge1xuICAgICAgICAgICAgY2FzZSBIdXJkbGVMb2FkQml0Lk1BUDpcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLm1hcExheWVyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG5vZGUuZ2V0Q29tcG9uZW50KFwibWFwX2N0cmxcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5faHVyZGxlTG9hZE1hc2sgfD0gSHVyZGxlTG9hZEJpdC5NQVA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZEh1cmRsZSgpKSB7XG4gICAgICAgICAgICAvL3RoaXMuX3BsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLm1hcCA9IHRoaXMuX21hcDtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5zZXRBY3RvclBvc2l0aW9uKHRoaXMuX2N1cnJIdXJkbGVDb25maWcuYm9yblBvcy54LCB0aGlzLl9jdXJySHVyZGxlQ29uZmlnLmJvcm5Qb3MueSk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSgxLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0xvYWRlZEh1cmRsZTogZnVuY3Rpb24gaXNMb2FkZWRIdXJkbGUoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIG1hc2sgPSAwO1xuICAgICAgICBmb3IgKHZhciBrIGluIEh1cmRsZUxvYWRCaXQpIHtcbiAgICAgICAgICAgIG1hc2sgfD0gSHVyZGxlTG9hZEJpdFtrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5faHVyZGxlTG9hZE1hc2sgPT0gbWFzaztcbiAgICB9LFxuXG4gICAgZ2V0UGxheWVyOiBmdW5jdGlvbiBnZXRQbGF5ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5ZXI7XG4gICAgfSxcblxuICAgIGdldFJvdW5kOiBmdW5jdGlvbiBnZXRSb3VuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdW5kTnVtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVNb25zdGVyOiBmdW5jdGlvbiBjcmVhdGVNb25zdGVyKGlkLCBwb3MsIGRpcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL2FjdG9yL21vbnN0ZXJcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICB2YXIgbW9uID0gbm9kZS5nZXRDb21wb25lbnQoXCJtb25zdGVyX2N0cmxcIik7XG4gICAgICAgICAgICBtb24ubG9naWNNYW5hZ2VyID0gc2VsZjtcbiAgICAgICAgICAgIHNlbGYuX21vbnN0ZXJzLnB1c2gobW9uKTtcbiAgICAgICAgICAgIG1vbi5zZXRBY3RvclBvc2l0aW9uKHBvcy54LCBwb3MueSk7XG4gICAgICAgICAgICBtb24ubWFwID0gc2VsZi5fbWFwO1xuICAgICAgICAgICAgbW9uLnNldERpcmVjdGlvbihkaXIpO1xuXG4gICAgICAgICAgICB2YXIgaHAgPSAoc2VsZi5fcm91bmROdW0gLSAxKSAqIDIwICsgMTMwO1xuICAgICAgICAgICAgbW9uLnNldEhwKGhwLCBocCk7XG4gICAgICAgICAgICBtb24uYm9ybigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGVzdHJveU1vbnN0ZXI6IGZ1bmN0aW9uIGRlc3Ryb3lNb25zdGVyKG1vbnN0ZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9tb25zdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG1vbnN0ZXIgPT0gdGhpcy5fbW9uc3RlcnNbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb25zdGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWFwLnJlbW92ZUVuaXR5KG1vbnN0ZXIubm9kZSk7XG4gICAgICAgIG1vbnN0ZXIubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHJlbW92ZUVuaXR5OiBmdW5jdGlvbiByZW1vdmVFbml0eShlbml0eSkge1xuICAgICAgICBpZiAoZW5pdHkgPT0gdGhpcy5fcGxheWVyKSB7fSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU1vbnN0ZXIoZW5pdHkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGtpbGxNb25zdGVyOiBmdW5jdGlvbiBraWxsTW9uc3RlcigpIHtcbiAgICAgICAgdGhpcy5fa2lsbE51bSsrO1xuICAgIH0sXG5cbiAgICBnZXRBY3RvckJ5UmVnaW9uOiBmdW5jdGlvbiBnZXRBY3RvckJ5UmVnaW9uKGFjdG9yLCByZWdpb24pIHtcbiAgICAgICAgdmFyIG1vbnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9tb25zdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1vbiA9IHRoaXMuX21vbnN0ZXJzW2ldO1xuICAgICAgICAgICAgdmFyIGNvbGwgPSBtb24uZ2V0Q29sbGlzaW9uKCk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoYWN0b3Iubm9kZS55IC0gbW9uLm5vZGUueSkgPCAzMCAmJiBjYy5JbnRlcnNlY3Rpb24ucmVjdFJlY3QobW9uLmdldENvbGxpc2lvbigpLCByZWdpb24pKSBtb25zLnB1c2gobW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9ucztcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydHRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghdGhpcy5fY3Vyck1pc3Npb24gJiYgIXRoaXMubGF1bmNoTWlzc2lvbigpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLl9wbGF5ZXIuaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0ZhaWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZhaWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5faXNGYWlsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNGYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91aU1hbmFnZXIub3BlblVJKCdtaXNzaW9uX2ZhaWwnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJyVGltZSA+IHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxhdW5jaE1pc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRGYWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXIuY29udHJvbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tNaXNzaW9uQ2xlYW4oKSkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLmNvbnRyb2xFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXAuY2FtZXJhVG8odGhpcy5fbWFwLmdldEN1cnJQb3NpdGlvbigpLnggLSB0aGlzLl9tYXAudmlld1NpemUud2lkdGggLyAyLCAwLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9sYXVuY2hOZXh0TWlzc2lvbkVuZFRpbWUgPSBjdXJyVGltZSArIDE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5fdHJpZ2dlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBuZWVkRXhlYyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSB0aGlzLl90cmlnZ2Vyc1tpXTtcbiAgICAgICAgICAgIHN3aXRjaCAodHJpZ2dlci5ldmVudCkge1xuICAgICAgICAgICAgICAgIGNhc2UgVHJpZ2dlclR5cGUuVElNRTpcbiAgICAgICAgICAgICAgICAgICAgbmVlZEV4ZWMgPSBjdXJyVGltZSAtIHRoaXMuX21pc3Npb25TdGFydFRpbWUgPj0gdHJpZ2dlci5wYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFRyaWdnZXJUeXBlLkFSRUE6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBuZXcgY2MuVmVjMih0aGlzLl9wbGF5ZXIubm9kZS54LCB0aGlzLl9wbGF5ZXIubm9kZS55KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG5ldyBjYy5SZWN0KHRyaWdnZXIucGFyYW0ueCwgdHJpZ2dlci5wYXJhbS55LCB0cmlnZ2VyLnBhcmFtLndpZHRoLCB0cmlnZ2VyLnBhcmFtLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIG5lZWRFeGVjID0gcmVnaW9uLmNvbnRhaW5zKHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRFeGVjKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY0NtZCh0cmlnZ2VyLmNvbW1hbmRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBleGVjQ21kOiBmdW5jdGlvbiBleGVjQ21kKGNvbW1hbmRzKSB7XG4gICAgICAgIHZhciBuZWVkQnJlYWsgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tYW5kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNtZCA9IGNvbW1hbmRzW2ldO1xuICAgICAgICAgICAgaWYgKCFjbWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgc3dpdGNoIChjbWQuY21kVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5DT05UUk9MX0VOQUJMRUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5jb250cm9sRW5hYmxlZCA9IGNtZC5hcmdzLmVuYWJsZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbExheWVyLmFjdGl2ZSA9IGNtZC5hcmdzLmVuYWJsZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkxPQ0tfQVJFQTpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG5ldyBjYy5SZWN0KGNtZC5hcmdzLngsIGNtZC5hcmdzLnksIGNtZC5hcmdzLndpZHRoLCBjbWQuYXJncy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAubG9ja1JlZ2lvbiA9IHJlZ2lvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuQ1JFQVRFX01PTjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVNb25zdGVyKGNtZC5hcmdzLmlkLCBjbWQuYXJncy5wb3MsIGNtZC5hcmdzLmRpcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLlNIT1dfTU9WRV9USVBTOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUaXBzLmFjdGl2ZSA9IGNtZC5hcmdzLnNob3c7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLlNIT1dfVFJBTlNfRE9PUjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0KDgsIDAsIG5ldyBjYy5WZWMyKGNtZC5hcmdzLngsIGNtZC5hcmdzLnkpLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkNIQU5HRV9IVVJETEU6XG4gICAgICAgICAgICAgICAgICAgIG5lZWRCcmVhayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlSHVyZGxlKGNtZC5hcmdzLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuTU9WRV9DQU1FUkE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcC5jYW1lcmFUbyhjbWQuYXJncy54LCBjbWQuYXJncy55LCBjbWQuYXJncy50aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZWVkQnJlYWspIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNoZWNrTWlzc2lvbkNsZWFuOiBmdW5jdGlvbiBjaGVja01pc3Npb25DbGVhbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJyTWlzc2lvbikgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgICAgICB2YXIgY29uZHMgPSB0aGlzLl9jdXJyTWlzc2lvbi5jb25kO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29uZCA9IGNvbmRzW2ldO1xuICAgICAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICBzd2l0Y2ggKGNvbmQuY29uZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIENvbmRUeXBlLlRPVEFMX01PTl9LSUxMOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2lsbE51bSA8IGNvbmQubnVtKSBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDb25kVHlwZS5DT05GSUdfQ1VTVE9NOlxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBzaG93UmVzdWx0RmFjZTogZnVuY3Rpb24gc2hvd1Jlc3VsdEZhY2Uoc3VjY2Vzcykge30sXG5cbiAgICBwbGF5RWZmZWN0OiBmdW5jdGlvbiBwbGF5RWZmZWN0KGlkLCBsYXllciwgcG9zLCBmbGlwLCBrZWVwKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvZWZmZWN0L1wiICsgaWQsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbm9kZS54ID0gcG9zLng7XG4gICAgICAgICAgICBub2RlLnkgPSBwb3MueTtcbiAgICAgICAgICAgIGlmIChmbGlwKSBub2RlLnNjYWxlWCA9IC0xO1xuICAgICAgICAgICAgaWYgKGtlZXApIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9rZWVwRWZmZWN0cy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gbm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24ub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX21hcC5hZGRFZmZlY3Qobm9kZSwgbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YwNzM1SFBTclpHYTYrTVBNaGt2d2J1JywgJ2Jvb3RfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYm9vdF9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2xvYWRlZFNjZW5lID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmIChHbG9iYWwuaW5pdHRlZCAmJiAhdGhpcy5fbG9hZGVkU2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRlZFNjZW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZShcImxvYWRpbmdcIik7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJiY2MwM2VZKzFOM1ptMUFhWHBaaVpVJywgJ2J1ZmZlcl90YWJsZScpO1xuLy8gc2NyaXB0XFx1dGlsXFxidWZmZXJfdGFibGUuanNcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9pZHggPSAtMTtcbiAgICAgICAgdGhpcy5fZnJlZUlkeCA9IFtdO1xuICAgICAgICB0aGlzLl90YWJsZSA9IFtdO1xuICAgIH0sXG5cbiAgICBhbGxvY0luZGV4OiBmdW5jdGlvbiBhbGxvY0luZGV4KCkge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX2ZyZWVJZHgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5fZnJlZUlkeC5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkeCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGluc2VydDogZnVuY3Rpb24gaW5zZXJ0KG9iaikge1xuICAgICAgICB2YXIgaWR4ID0gdGhpcy5hbGxvY0luZGV4KCk7XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fdGFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZHggPSB0aGlzLl90YWJsZS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLl90YWJsZS5wdXNoKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVtpZHhdID0gb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgfSxcblxuICAgIHJlbW92ZUJ5SW5kZXg6IGZ1bmN0aW9uIHJlbW92ZUJ5SW5kZXgoaWR4KSB7XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fdGFibGUubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuX3RhYmxlW2lkeF07XG4gICAgICAgIHRoaXMuX3RhYmxlW2lkeF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9mcmVlSWR4LnB1c2goaWR4KTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQnlPYmplY3Q6IGZ1bmN0aW9uIHJlbW92ZUJ5T2JqZWN0KG9iaikge1xuICAgICAgICBpZiAob2JqID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlW2ldID09IG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUJ5SW5kZXgoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIGdldE9iamVjdDogZnVuY3Rpb24gZ2V0T2JqZWN0KGlkeCkge1xuICAgICAgICBpZiAoaWR4ID49IHRoaXMuX3RhYmxlLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZVtpZHhdO1xuICAgIH0sXG5cbiAgICBlYWNoOiBmdW5jdGlvbiBlYWNoKGZ1bmMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlW2ldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhpLCB0aGlzLl90YWJsZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmQ0NTI2cEszOUVkN3RRUVV6Y2VlUUgnLCAnY29pbl9ub3RfZW5vdWdoJyk7XG4vLyBzY3JpcHRcXHVpXFxjb2luX25vdF9lbm91Z2guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwgPSB0aGlzLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgIH0sXG5cbiAgICBvbkV4Y2hhbmdlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRXhjaGFuZ2VCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5tYW5hZ2VyLm9wZW5VSSgnZXhjaGFuZ2VfY29pbicpO1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNhbmNlbEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczMWU0MmhsNVJ4RW1KZ0EyRlJyZm5vMScsICdjb250cm9sX2RlZmluZScpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxjb250cm9sX2RlZmluZS5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDb250cm9sS2V5OiB7XG4gICAgICAgIE5PTkU6IDAsXG4gICAgICAgIFVQOiAxLFxuICAgICAgICBET1dOOiAyLFxuICAgICAgICBMRUZUOiAzLFxuICAgICAgICBSSUdIVDogNCxcbiAgICAgICAgSlVNUDogNSxcbiAgICAgICAgSElUOiA2LFxuICAgICAgICBTS0lMTDE6IDcsXG4gICAgICAgIFNLSUxMMjogOCxcbiAgICAgICAgU0tJTEwzOiA5LFxuICAgICAgICBTS0lMTDQ6IDEwLFxuICAgICAgICBTS0lMTDU6IDExLFxuICAgICAgICBTS0lMTDY6IDEyXG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2QzNzMzVXFBV0JBckl1T24yR1pHZlRjJywgJ2VuJyk7XG4vLyBzY3JpcHRcXGkxOG5cXGRhdGFcXGVuLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwiR1dfR0FNRVwiOiBcIkdXIEdhbWVcIlxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzM3N2E1WWQzeUpHT3BYS2xOalMwb1czJywgJ2V4Y2hhbmdlX2NvaW4nKTtcbi8vIHNjcmlwdFxcdWlcXGV4Y2hhbmdlX2NvaW4uanNcblxudmFyIGV4Y2hhbmdlUG9pbnRzID0gWzEsIDYsIDM4LCA5OCwgNTg4LCAxNjg4XTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBvd25MYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIHJhdGVMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIGl0ZW1Db250ZW50OiBjYy5Ob2RlLFxuICAgICAgICBpdGVtUHJlZmFiOiBjYy5QcmVmYWJcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybCA9IHRoaXMuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlUmF0ZSA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmV4Y2hhbmdlUmF0ZTtcbiAgICAgICAgdGhpcy5fb3duUG9pbnQgPSBHbG9iYWwuYWNjb3VudE1vZHVsZS5zY29yZU51bTtcblxuICAgICAgICB0aGlzLnJhdGVMYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnZXhjaGFuZ2VfZm9ybWF0JyksIDEsIHRoaXMuX2V4Y2hhbmdlUmF0ZSk7XG4gICAgICAgIHRoaXMub3duTGFiZWwuc3RyaW5nID0gY2MuanMuZm9ybWF0U3RyKEdhbWVMYW5nLnQoJ293bl9wb2ludF9mb3JtYXQnKSwgdGhpcy5fb3duUG9pbnQpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhjaGFuZ2VQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5pdGVtUHJlZmFiKTtcblxuICAgICAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkxhYmVsKTtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IGV4Y2hhbmdlUG9pbnRzW2ldO1xuICAgICAgICAgICAgbGFiZWwuc3RyaW5nID0gY2MuanMuZm9ybWF0U3RyKEdhbWVMYW5nLnQoJ2V4Y2hhbmdlX2Zvcm1hdCcpLCBwb2ludCwgcG9pbnQgKiB0aGlzLl9leGNoYW5nZVJhdGUpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkJ1dHRvbik7XG4gICAgICAgICAgICB2YXIgZXZlbnRIYW5kbGVyID0gbmV3IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlci50YXJnZXQgPSB0aGlzO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiZXhjaGFuZ2VfY29pblwiO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLmhhbmRsZXIgPSBcIm9uSXRlbUV4Y2hhbmdlQnV0dG9uQ2xpY2tcIjtcbiAgICAgICAgICAgIGJ1dHRvbi5ub2RlLnRhZyA9IGk7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMucHVzaChldmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMuaXRlbUNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25JdGVtRXhjaGFuZ2VCdXR0b25DbGljazogZnVuY3Rpb24gb25JdGVtRXhjaGFuZ2VCdXR0b25DbGljayhldmVudCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciBwb2ludCA9IGV4Y2hhbmdlUG9pbnRzW3RhcmdldC50YWddO1xuICAgICAgICB2YXIgY29pbiA9IHBvaW50ICogdGhpcy5fZXhjaGFuZ2VSYXRlO1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGNjLmpzLmZvcm1hdFN0cihHYW1lTGFuZy50KCdjb25maXJtX2V4Y2hhbmdlX2NvaW4nKSwgcG9pbnQsIGNvaW4pLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKGJ1dHRvbklkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJ1dHRvbklkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VpQ3RybC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2V4Y2hhbmdlIGNvaW4nLCBjb2luKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3VpQ3RybC5tYW5hZ2VyLm9wZW5VSSgnbWVzc2FnZV9ib3gnLCBkYXRhKTtcbiAgICB9LFxuXG4gICAgb25DbG9zZUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNsb3NlQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxZDY4ZFdJeUdaRnBJc0lJSjFYQUcwdCcsICdnYW1lX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGdhbWVfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHBoeXNpY2FsTm9kZXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB0eXBlOiBbY2MuTm9kZV1cbiAgICAgICAgfSxcblxuICAgICAgICBjb3VudERvd25MYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBjb2luTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF4UGh5c2ljYWw6IDUsXG4gICAgICAgIGNoYXJnZVBoeXNpY2FsVGltZTogNjAwXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aU1hbmFnZXIgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KCd1aV9tYW5hZ2VyJyk7XG4gICAgICAgIHRoaXMuX3BoeXNpY2FsUG9pbnRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5waHlzaWNhbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGh5c2ljYWxOb2Rlc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX3BoeXNpY2FsUG9pbnRzLnB1c2gobm9kZS5nZXRDb21wb25lbnQoJ3BoeXNpY2FsX3BvaW50JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY291bnREb3duVGltZSA9IDA7XG4gICAgICAgIHRoaXMudXBkYXRlQ291bnREb3duKCk7XG5cbiAgICAgICAgdGhpcy5fcGh5c2ljYWwgPSAwO1xuICAgICAgICB0aGlzLnVwZGF0ZVBoeXNpY2FsKCk7XG5cbiAgICAgICAgdGhpcy5fY291bnR0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fb25Db3VudERvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ291bnREb3duKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9HRVRfR0FNRV9EQVRBLCB0aGlzLm9uR2V0R2FtZURhdGEuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBHYW1lUnBjLkNsdDJTcnYuZ2V0R2FtZURhdGEoKTtcbiAgICB9LFxuXG4gICAgcmVzZXRDb3VudERvd246IGZ1bmN0aW9uIHJlc2V0Q291bnREb3duKCkge1xuICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lKTtcbiAgICB9LFxuXG4gICAgc3RhcnRDb3VudERvd246IGZ1bmN0aW9uIHN0YXJ0Q291bnREb3duKHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50dGluZykgcmV0dXJuO1xuICAgICAgICB0aGlzLl9jb3VudHRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lID0gdGltZTtcbiAgICAgICAgdGhpcy51cGRhdGVDb3VudERvd24oKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl9vbkNvdW50RG93biwgMSk7XG4gICAgfSxcblxuICAgIHN0b3BDb3VudERvd246IGZ1bmN0aW9uIHN0b3BDb3VudERvd24oKSB7XG4gICAgICAgIGlmICghdGhpcy5fY291bnR0aW5nKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2NvdW50dGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fb25Db3VudERvd24pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVDb3VudERvd246IGZ1bmN0aW9uIHVwZGF0ZUNvdW50RG93bigpIHtcbiAgICAgICAgdGhpcy5jb3VudERvd25MYWJlbC5zdHJpbmcgPSBUaW1lVXRpbC5zZWNUb01TKHRoaXMuX2NvdW50RG93blRpbWUpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVQaHlzaWNhbDogZnVuY3Rpb24gdXBkYXRlUGh5c2ljYWwoKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLl9waHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDA7XG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy5tYXhQaHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDE7XG4gICAgfSxcblxuICAgIGNoYXJnZVBoeXNpY2FsOiBmdW5jdGlvbiBjaGFyZ2VQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsID49IHRoaXMubWF4UGh5c2ljYWwpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwrKztcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgIH0sXG5cbiAgICBjb3N0UGh5c2ljYWw6IGZ1bmN0aW9uIGNvc3RQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwtLTtcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25BZGRDb2luQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQWRkQ29pbkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAvL3RoaXMuX3VpTWFuYWdlci5vcGVuVUkoJ2V4Y2hhbmdlX2NvaW4nKTtcbiAgICAgICAgdGhpcy5fdWlNYW5hZ2VyLm9wZW5VSSgncGh5c2ljYWxfbm90X2Vub3VnaCcpO1xuICAgIH0sXG5cbiAgICBvbkNvdW50RG93bjogZnVuY3Rpb24gb25Db3VudERvd24oKSB7XG4gICAgICAgIHRoaXMuX2NvdW50RG93blRpbWUtLTtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50RG93blRpbWUgPCAwKSB0aGlzLl9jb3VudERvd25UaW1lID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50RG93blRpbWUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmdlUGh5c2ljYWwoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9waHlzaWNhbCA8IHRoaXMubWF4UGh5c2ljYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lID0gdGhpcy5jaGFyZ2VQaHlzaWNhbFRpbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcENvdW50RG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQ291bnREb3duKCk7XG4gICAgfSxcblxuICAgIG9uR2V0R2FtZURhdGE6IGZ1bmN0aW9uIG9uR2V0R2FtZURhdGEoKSB7XG4gICAgICAgIHRoaXMuY29pbkxhYmVsLnN0cmluZyA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgICAgIHRoaXMuX3BoeXNpY2FsID0gR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXI7XG4gICAgICAgIHRoaXMudXBkYXRlUGh5c2ljYWwoKTtcbiAgICAgICAgdGhpcy5yZXNldENvdW50RG93bigpO1xuICAgIH0sXG5cbiAgICBvblBsYXlCdXR0b25DbGljazogZnVuY3Rpb24gb25QbGF5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmNvc3RQaHlzaWNhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnYmF0dGxlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDkvZPlipvkuI3otrNcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzA4NjBhdGJCVkZTNnhIN0lGYU5USjMnLCAnZ2FtZV9ldmVudF9kaXNwYXRjaGVyJyk7XG4vLyBzY3JpcHRcXGV2ZW50XFxnYW1lX2V2ZW50X2Rpc3BhdGNoZXIuanNcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24gZW1pdChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV07XG4gICAgICAgIGlmIChoYW5kbGVycykge1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzW2tdKGV2ZW50VHlwZSwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiBhZGRFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdO1xuICAgICAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcnNba10gPT0gaGFuZGxlcikgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICAgICAgaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdID0gaGFuZGxlcnM7XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB7IHR5cGU6IGV2ZW50VHlwZSwgaWQ6IGhhbmRsZXJzLmxlbmd0aCAtIDEgfTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiByZW1vdmVFdmVudEhhbmRsZXIoZW5pdHkpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fbGlzdGVuZXJzW2VuaXR5LnR5cGVdO1xuICAgICAgICBpZiAoaGFuZGxlcnMgJiYgZW5pdHkuaWQgPj0gMCAmJiBlbml0eS5pZCA8IGhhbmRsZXJzLmxlbmd0aCkgaGFuZGxlcnMuc3BsaWNlKGVuaXR5LmlkLCAxKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiByZW1vdmVBbGxFdmVudEhhbmRsZXIoZXZlbnRUeXBlKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdID0gbnVsbDtcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FjZGQ3ek1zcEJQSTdjTFczOTNaN1dhJywgJ2dhbWVfZXZlbnQnKTtcbi8vIHNjcmlwdFxcZXZlbnRcXGdhbWVfZXZlbnQuanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgT05fSFRUUF9SRVFVRVNUOiAweDAwMDAwMDAxLFxuICAgIE9OX0hUVFBfUkVTUE9ORDogMHgwMDAwMDAwMixcbiAgICBPTl9ORVRXT1JLX0VSUk9SOiAweDAwMDAwMDAzLFxuXG4gICAgT05fTE9HSU5fUkVTVUxUOiAweDAwMDEwMDAxLFxuICAgIE9OX0dFVF9HQU1FX0RBVEE6IDB4MDAwMTAwMDIsXG4gICAgT05fRVhDSEFOR0VfR09MRDogMHgwMDAxMDAwMyxcbiAgICBPTl9TVEFSVF9HQU1FOiAweDAwMDEwMDA0LFxuICAgIE9OX0JVWV9QSFlTSUNBTDogMHgwMDAxMDAwNSxcbiAgICBPTl9CVVlfVElNRV9UT19QTEFZOiAweDAwMDEwMDA2LFxuXG4gICAgT05fUkVUUllfR0FNRTogMHgwMDAyMDAwMSxcbiAgICBPTl9SRVRVUk5fR0FNRTogMHgwMDAyMDAwMixcblxuICAgIE9OX0ZMT0FUX01FU1NBR0U6IDB4MDAwMzAwMDFcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxNmZmY0p6SXF0RVZvSWFORHl2bWxQaicsICdnYW1lX25ldCcpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxnYW1lX25ldC5qc1xuXG52YXIgSHR0cENvbm5lY3Rpb24gPSByZXF1aXJlKCdodHRwX2Nvbm5lY3Rpb24nKVsnY2xhc3MnXTtcbnZhciBIdHRwVXRpbCA9IHJlcXVpcmUoJ2h0dHBfdXRpbCcpO1xudmFyIEdhbWVQcm90b2NvbCA9IHJlcXVpcmUoJ2dhbWVfcHJvdG9jb2wnKTtcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9odHRwUmVhdWVzdEluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9odHRwSGFuZGxlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5faHR0cENvbm5lY3Rpb24gPSBuZXcgSHR0cENvbm5lY3Rpb24oKTtcbiAgICAgICAgdGhpcy5faHR0cENvbm5lY3Rpb24uc2V0Q2lwaGVyQ29kZSgnZndlXiomM2lqY2RoZjQ1NTQzJyk7XG4gICAgICAgIHRoaXMuX2h0dHBDb25uZWN0aW9uLnNldFJlc3BvbmRDYWxsYmFjayh0aGlzLmh0dHBSZXNwb25kLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZXRyeUh0dHBSZXF1ZXN0OiBmdW5jdGlvbiByZXRyeUh0dHBSZXF1ZXN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2h0dHBSZWF1ZXN0SW5mbykgcmV0dXJuO1xuICAgICAgICB0aGlzLmh0dHBSZXF1ZXN0KHRoaXMuX2h0dHBSZWF1ZXN0SW5mby5kYXRhLCB0aGlzLl9odHRwUmVhdWVzdEluZm8uY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBodHRwUmVxdWVzdDogZnVuY3Rpb24gaHR0cFJlcXVlc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fSFRUUF9SRVFVRVNUKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJvdG9jb2xJZCA9IGRhdGEuZ2FtZU1zZ0lkO1xuICAgICAgICB2YXIgdXJsID0gR2FtZVByb3RvY29sLlVSTHNbcHJvdG9jb2xJZF07XG4gICAgICAgIHRoaXMuYWRkSHR0cFJlc3BvbmRMaXN0ZW5lcihwcm90b2NvbElkLCBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVIdHRwUmVzcG9uZExpc3RlbmVyKHByb3RvY29sSWQpO1xuICAgICAgICAgICAgc2VsZi5faHR0cFJlYXVlc3RJbmZvID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2soanNvbik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9odHRwUmVhdWVzdEluZm8gPSB7IGRhdGE6IGRhdGEsIGNhbGxiYWNrOiBjYWxsYmFjayB9O1xuICAgICAgICB0aGlzLl9odHRwQ29ubmVjdGlvbi5yZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfSxcblxuICAgIGh0dHBSZXNwb25kOiBmdW5jdGlvbiBodHRwUmVzcG9uZChzdGF0cywganNvbikge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9IVFRQX1JFU1BPTkQpO1xuICAgICAgICBpZiAoc3RhdHMgPT0gSHR0cFV0aWwuU3RhdHMuT0spIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gdGhpcy5faHR0cEhhbmRsZXJzW2pzb24uZGF0YS5nYW1lTXNnSWRdO1xuICAgICAgICAgICAgaGFuZGxlciAmJiBoYW5kbGVyKGpzb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUh0dHBSZXNwb25kTGlzdGVuZXIodGhpcy5faHR0cFJlYXVlc3RJbmZvLmRhdGEuZ2FtZU1zZ0lkKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRIdHRwUmVzcG9uZExpc3RlbmVyOiBmdW5jdGlvbiBhZGRIdHRwUmVzcG9uZExpc3RlbmVyKHByb3RvY29sSWQsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5faHR0cEhhbmRsZXJzW3Byb3RvY29sSWRdID0gaGFuZGxlcjtcbiAgICB9LFxuXG4gICAgcmVtb3ZlSHR0cFJlc3BvbmRMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlSHR0cFJlc3BvbmRMaXN0ZW5lcihwcm90b2NvbElkLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuX2h0dHBIYW5kbGVyc1twcm90b2NvbElkXSA9IG51bGw7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZjZjdjM1lEUEpKdHJsNWpaalNjM3JQJywgJ2dhbWVfcHJvdG9jb2wnKTtcbi8vIHNjcmlwdFxcbmV0d29ya1xcZ2FtZV9wcm90b2NvbC5qc1xuXG52YXIgX1VSTHM7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBQcm90b2NvbCA9IHtcbiAgICBMT0dJTjogMSxcbiAgICBHRVRfREFUQTogMixcbiAgICBFWENIQU5HRV9HT0xEOiAzLFxuICAgIFNUQVJUX0dBTUU6IDQsXG4gICAgRlVMTF9QT1dFUjogNSxcbiAgICBDT05USU5VRV9HQU1FOiA2LFxuICAgIFJFU1VMVF9HQU1FOiA3XG59O1xubW9kdWxlLmV4cG9ydHMuUHJvdG9jb2wgPSBQcm90b2NvbDtcblxudmFyIFVSTHMgPSAoX1VSTHMgPSB7fSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5MT0dJTiwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL2luZGV4L2xvZ2luXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLkdFVF9EQVRBLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vU2hvdXJlbmxhaWxlL2luZGV4P3R5cGU9Z2V0R2FtZURhdGFcIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuRVhDSEFOR0VfR09MRCwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL2luZGV4L2V4Y2hhbmdlXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLlNUQVJUX0dBTUUsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9TaG91cmVubGFpbGUvaW5kZXg/dHlwZT1zdGFydEdhbWVcIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuRlVMTF9QT1dFUiwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL1Nob3VyZW5sYWlsZS9pbmRleD90eXBlPWJ1eUZ1bGxQb3dlclwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5DT05USU5VRV9HQU1FLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vU2hvdXJlbmxhaWxlL2luZGV4P3R5cGU9YnV5VGltZVRvUGxheUdhbWVcIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuUkVTVUxUX0dBTUUsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9TaG91cmVubGFpbGUvaW5kZXg/dHlwZT1nYW1lUmVzdWx0XCIpLCBfVVJMcyk7XG5tb2R1bGUuZXhwb3J0cy5VUkxzID0gVVJMcztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2IwNzdlaEpQT0JEM0tkVnhzM3RsYjFJJywgJ2dhbWVfcnBjJyk7XG4vLyBzY3JpcHRcXG5ldHdvcmtcXGdhbWVfcnBjLmpzXG5cbnZhciBHYW1lUHJvdG9jb2wgPSByZXF1aXJlKFwiZ2FtZV9wcm90b2NvbFwiKTtcblxudmFyIFNydjJDbHQgPSB7XG4gICAgcmV0TG9naW46IGZ1bmN0aW9uIHJldExvZ2luKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0TG9naW46XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW4gPSBqc29uLmRhdGEudG9rZW47XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0xPR0lOX1JFU1VMVCwganNvbik7XG4gICAgfSxcblxuICAgIHJldEdldEdhbWVEYXRhOiBmdW5jdGlvbiByZXRHZXRHYW1lRGF0YShqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldEdldEdhbWVEYXRhOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuaXNWaXAgPSBqc29uLmRhdGEuaXNWSVA7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtID0ganNvbi5kYXRhLmdvbGROdW07XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5zY29yZU51bSA9IGpzb24uZGF0YS5zY29yZU51bTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm5pY2tOYW1lID0ganNvbi5kYXRhLm5pa2VuYW1lO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuaXNGaXJzdExvZ2luID0ganNvbi5kYXRhLmlzRmlyc3Q7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5tYXhTY29yZSA9IGpzb24uZGF0YS5tYXhTY29yZTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLnBvd2VyID0ganNvbi5kYXRhLnBvd2VyO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubmV4dFBvd2VyVGltZSA9IGpzb24uZGF0YS5uZXh0UG93ZXJUaW1lO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZXhjaGFuZ2VSYXRlID0ganNvbi5kYXRhLm9uZUludGVncmFsR29sZE51bTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0dFVF9HQU1FX0RBVEEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldEV4Y2hhbmdlR29sZDogZnVuY3Rpb24gcmV0RXhjaGFuZ2VHb2xkKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0RXhjaGFuZ2VHb2xkOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA9IGpzb24uZGF0YS5nb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuc2NvcmVOdW0gPSBqc29uLmRhdGEuc2NvcmVOdW07XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9FWENIQU5HRV9HT0xEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0U3RhcnRHYW1lOiBmdW5jdGlvbiByZXRTdGFydEdhbWUoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRTdGFydEdhbWU6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5tYXhTY29yZSA9IGpzb24uZGF0YS5tYXhTY29yZTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLnBvd2VyID0ganNvbi5kYXRhLnBvd2VyO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubmV4dFBvd2VyVGltZSA9IGpzb24uZGF0YS5uZXh0UG93ZXJUaW1lO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fU1RBUlRfR0FNRSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldEJ1eUZ1bGxQaHlzaWNhbDogZnVuY3Rpb24gcmV0QnV5RnVsbFBoeXNpY2FsKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0QnV5RnVsbFBoeXNpY2FsOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA9IGpzb24uZGF0YS5nb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXIgPSBqc29uLmRhdGEucG93ZXI7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lID0ganNvbi5kYXRhLm5leHRQb3dlclRpbWU7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9CVVlfUEhZU0lDQUwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXRCdXlUaW1lVG9QbGF5R2FtZTogZnVuY3Rpb24gcmV0QnV5VGltZVRvUGxheUdhbWUoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRCdXlUaW1lVG9QbGF5R2FtZTpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW0gPSBqc29uLmRhdGEuZ29sZE51bTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0JVWV9USU1FX1RPX1BMQVkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXRHYW1lUmVzdWx0OiBmdW5jdGlvbiByZXRHYW1lUmVzdWx0KGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0R2FtZVJlc3VsdDpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm1heFNjb3JlID0ganNvbi5kYXRhLm1heFNjb3JlO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fR0FNRV9SRVNVTFQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5tb2R1bGUuZXhwb3J0cy5TcnYyQ2x0ID0gU3J2MkNsdDtcblxudmFyIENsdDJTcnYgPSB7XG4gICAgbG9naW46IGZ1bmN0aW9uIGxvZ2luKGFjY291bnQsIHBhc3N3ZCkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5MT0dJTixcbiAgICAgICAgICAgIGFjY291bnQ6IGFjY291bnQsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dkXG4gICAgICAgIH0sIFNydjJDbHQucmV0TG9naW4pO1xuICAgIH0sXG5cbiAgICBnZXRHYW1lRGF0YTogZnVuY3Rpb24gZ2V0R2FtZURhdGEoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkdFVF9EQVRBLFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlblxuICAgICAgICB9LCBTcnYyQ2x0LnJldEdldEdhbWVEYXRhKTtcbiAgICB9LFxuXG4gICAgZXhjaGFuZ2VHb2xkOiBmdW5jdGlvbiBleGNoYW5nZUdvbGQoZ29sZCkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5FWENIQU5HRV9HT0xELFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlbixcbiAgICAgICAgICAgIG5lZWRHb2xkOiBnb2xkXG4gICAgICAgIH0sIFNydjJDbHQucmV0RXhjaGFuZ2VHb2xkKTtcbiAgICB9LFxuXG4gICAgc3RhcnRHYW1lOiBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLlNUQVJUX0dBTUUsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuXG4gICAgICAgIH0sIFNydjJDbHQucmV0U3RhcnRHYW1lKTtcbiAgICB9LFxuXG4gICAgYnV5RnVsbFBoeXNpY2FsOiBmdW5jdGlvbiBidXlGdWxsUGh5c2ljYWwoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkZVTExfUE9XRVIsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuXG4gICAgICAgIH0sIFNydjJDbHQucmV0QnV5RnVsbFBoeXNpY2FsKTtcbiAgICB9LFxuXG4gICAgYnV5VGltZVRvUGxheUdhbWU6IGZ1bmN0aW9uIGJ1eVRpbWVUb1BsYXlHYW1lKHRpbWVzKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkNPTlRJTlVFX0dBTUUsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuLFxuICAgICAgICAgICAgbGV2ZWw6IHRpbWVzXG4gICAgICAgIH0sIFNydjJDbHQucmV0QnV5VGltZVRvUGxheUdhbWUpO1xuICAgIH0sXG5cbiAgICBnYW1lUmVzdWx0OiBmdW5jdGlvbiBnYW1lUmVzdWx0KHNjb3JlKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkNPTlRJTlVFX0dBTUUsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuLFxuICAgICAgICAgICAgc2NvcmU6IHNjb3JlXG4gICAgICAgIH0sIFNydjJDbHQucmV0R2FtZVJlc3VsdCk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzLkNsdDJTcnYgPSBDbHQyU3J2O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTAzMTZDRFJ3dExWN2NZRlFRMENYTFEnLCAnZ2FtZV91dGlsJyk7XG4vLyBzY3JpcHRcXHV0aWxcXGdhbWVfdXRpbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGxvYWRTY2VuZTogZnVuY3Rpb24gbG9hZFNjZW5lKG5hbWUpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKG5hbWUpO1xuICAgICAgICAvKmNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShuYW1lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShuYW1lKTtcclxuICAgICAgICB9KTsqL1xuICAgIH1cblxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E4NDBkSWZkZ2hDODVaYkRQQ1dpMU0zJywgJ2h0dHBfY29ubmVjdGlvbicpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxjb25uZWN0aW9uXFxodHRwX2Nvbm5lY3Rpb24uanNcblxudmFyIEh0dHBVdGlsID0gcmVxdWlyZShcImh0dHBfdXRpbFwiKTtcbnZhciBYWFRFQSA9IHJlcXVpcmUoXCJ4eHRlYVwiKTtcblxubW9kdWxlLmV4cG9ydHNbXCJjbGFzc1wiXSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9jaXBoZXJDb2RlID0gJ3ExdzJlM3I0dDV5NnU3aThvOXAwJztcbiAgICAgICAgdGhpcy5fcmVzcG9uZENhbGxiYWNrID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc2V0Q2lwaGVyQ29kZTogZnVuY3Rpb24gc2V0Q2lwaGVyQ29kZShjb2RlKSB7XG4gICAgICAgIHRoaXMuX2NpcGhlckNvZGUgPSBjb2RlO1xuICAgIH0sXG5cbiAgICBzZXRSZXNwb25kQ2FsbGJhY2s6IGZ1bmN0aW9uIHNldFJlc3BvbmRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLl9yZXNwb25kQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG4gICAgcmVxdWVzdDogZnVuY3Rpb24gcmVxdWVzdCh1cmwsIGRhdGEpIHtcbiAgICAgICAgdmFyIGpzb24gPSBYWFRFQS51dGYxNnRvOChKU09OLnN0cmluZ2lmeShkYXRhKS50cmltKCkpO1xuICAgICAgICB2YXIgZW5jcnlwdCA9IFhYVEVBLmVuY3J5cHQoanNvbiwgdGhpcy5fY2lwaGVyQ29kZSk7XG4gICAgICAgIHZhciBlbmNvZGUgPSBYWFRFQS5iYXNlNjRlbmNvZGUoZW5jcnlwdCk7XG4gICAgICAgIGVuY29kZSA9IGVuY29kZS5yZXBsYWNlKC9cXCsvZywgJyUyQicpO1xuICAgICAgICBIdHRwVXRpbC5yZXF1ZXN0KHVybCwgSHR0cFV0aWwuTWV0aG9kLlBPU1QsIHsgbXNnRGF0YTogZW5jb2RlIH0sIHRoaXMucmVzcG9uZC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmVzcG9uZDogZnVuY3Rpb24gcmVzcG9uZChzdGF0cywgcmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc3BvbmRDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHN0YXRzID09IEh0dHBVdGlsLlN0YXRzLk9LKSB7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb2RlID0gWFhURUEuYmFzZTY0ZGVjb2RlKGpzb24ubXNnRGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlY3J5cHQgPSBYWFRFQS5kZWNyeXB0KGRlY29kZSwgdGhpcy5fY2lwaGVyQ29kZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBKU09OLnBhcnNlKGRlY3J5cHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3BvbmRDYWxsYmFjayhzdGF0cywgeyBjb2RlOiBqc29uLlJlc3VsdENvZGUsIGRhdGE6IGNvbnRlbnQgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRzID09IEh0dHBVdGlsLlN0YXRzLkZBSUwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25kQ2FsbGJhY2soc3RhdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NDJjYzlpdUY5UG9yTjNjbEluSFg0TCcsICdodHRwX3V0aWwnKTtcbi8vIHNjcmlwdFxcbGliXFx1dGlsXFxodHRwX3V0aWwuanNcblxudmFyIE1ldGhvZCA9IHtcbiAgICBHRVQ6ICdHRVQnLFxuICAgIFBPU1Q6ICdQT1NUJ1xufTtcblxudmFyIFN0YXRzID0ge1xuICAgIE9LOiAwLFxuICAgIEZBSUw6IDFcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1ldGhvZCA9IE1ldGhvZDtcblxubW9kdWxlLmV4cG9ydHMuU3RhdHMgPSBTdGF0cztcblxubW9kdWxlLmV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgYXJncywgY2FsbGJhY2spIHtcbiAgICB2YXIgc3VjY2VzcyA9IHRydWU7XG5cbiAgICB2YXIgeGhyID0gY2MubG9hZGVyLmdldFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MubG9nKCdvbnJlYWR5c3RhdGVjaGFuZ2UnKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFN0YXRzLk9LLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFN0YXRzLkZBSUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICB2YXIgYXJnU3RyaW5nID0gJyc7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZ3MpIHtcbiAgICAgICAgaWYgKGlzRmlyc3QpIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyArPSBrZXkgKyBcIj1cIiArIGFyZ3Nba2V5XTtcbiAgICAgICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyArPSAnJicgKyBrZXkgKyAnPScgKyBhcmdzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09PSBNZXRob2QuR0VUKSB7XG4gICAgICAgIGlmIChhcmdTdHJpbmcubGVuZ3RoID09PSAwKSB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7ZWxzZSB4aHIub3BlbihtZXRob2QsIHVybCArIGFyZ1N0cmluZywgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09IE1ldGhvZC5QT1NUKSB7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHQtRW5jb2RpbmdcIiwgXCJnemlwLCBkZWZsYXRlXCIpO1xuXG4gICAgWydsb2Fkc3RhcnQnLCAnYWJvcnQnLCAnZXJyb3InLCAnbG9hZCcsICdsb2FkZW5kJywgJ3RpbWVvdXQnXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudG5hbWUpIHtcbiAgICAgICAgeGhyW1wib25cIiArIGV2ZW50bmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJcXG5FdmVudCA6IFwiICsgZXZlbnRuYW1lKTtcbiAgICAgICAgICAgIGlmIChldmVudG5hbWUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50bmFtZSA9PT0gJ2xvYWRlbmQnICYmICFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soU3RhdHMuRkFJTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpZiAobWV0aG9kID09PSBNZXRob2QuR0VUKSB7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09IE1ldGhvZC5QT1NUKSB7XG4gICAgICAgIHhoci5zZW5kKGFyZ1N0cmluZyk7XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M0YTdlSUFvZ2hNUkpRV1lyWUpLTE81JywgJ2h1cmRsZV9jZmcnKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxkYXRhXFxodXJkbGVfY2ZnLmpzXG5cbi8qXHJcbuivtOaYjlxyXG4gICAgY21kVHlwZe+8iOaMh+S7pOexu+Wei++8iVxyXG4gICAgICAgIDHvvJpjb250cm9sZW5hYmxlZFxyXG4gICAgICAgIDLvvJrplIHlrprljLrln59cclxuICAgICAgICAz77ya5Yi35oCqIGlk77yI5oCq54mpaWTvvIkgcG9z77yI5Yi35oCq5Z2Q5qCH77yJZGly77yI5pa55ZCRIC0x5bemIDHlj7PvvIlcclxuICAgICAgICA077ya5byA5aeLXHJcbiAgICAgICAgNTogZ29nb2dvXHJcblxyXG4gICAgY29uZFR5cGXvvIjlrozmiJDmnaHku7bvvIlcclxuICAgICAgICAx77ya5p2A5oCq5pWwIG51be+8iOadgOaAquaVsOmHj++8iVxyXG5cclxuICAgIGV2ZW50XHJcbiAgICAgICAgMTrml7bpl7RcclxuICAgICAgICAy77ya5Zyw5Zu+5Yy65Z+fXHJcbiovXG5cbm1vZHVsZS5leHBvcnRzLmRhdGEgPSBbe1xuICAgIGlkOiAxLFxuICAgIG1hcElkOiAxLFxuICAgIGJvcm5Qb3M6IHsgeDogNDUwLCB5OiAyMzUgfSxcbiAgICBtaXNzaW9uOiBbe1xuICAgICAgICB0cmlnZ2VyczogW3tcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAsXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAxLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgZW5hYmxlZDogZmFsc2UgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZXZlbnQ6IDEsXG4gICAgICAgICAgICBwYXJhbTogMC41LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IHRydWUgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDEsXG4gICAgICAgICAgICAgICAgYXJnczogeyBlbmFibGVkOiB0cnVlIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAyLFxuICAgICAgICAgICAgcGFyYW06IHsgeDogODAwLCB5OiAwLCB3aWR0aDogMTIwMCwgaGVpZ2h0OiA2NDAgfSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiBmYWxzZSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAyMDAwLCBoZWlnaHQ6IDY0MCB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMTUwMCwgeTogMjcwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDE2MDAsIHk6IDE4NSB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAxNTAwLCB5OiAxMDAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XSxcbiAgICAgICAgY29uZDogW3sgY29uZFR5cGU6IDEsIG51bTogMyB9XVxuICAgIH0sIHtcbiAgICAgICAgdHJpZ2dlcnM6IFt7XG4gICAgICAgICAgICBldmVudDogMSxcbiAgICAgICAgICAgIHBhcmFtOiAwLFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHg6IDAsIHk6IDAsIHdpZHRoOiA0MDAwLCBoZWlnaHQ6IDY0MCB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IHRydWUgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZXZlbnQ6IDIsXG4gICAgICAgICAgICBwYXJhbTogeyB4OiAyNjAwLCB5OiAwLCB3aWR0aDogMzAwLCBoZWlnaHQ6IDY0MCB9LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IGZhbHNlIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAyLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogMjAwMCwgeTogMCwgd2lkdGg6IDIwMDAsIGhlaWdodDogNjQwIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAyNzAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMTAwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDE4NSB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAzNjAwLCB5OiAxODUgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XSxcbiAgICAgICAgY29uZDogW3sgY29uZFR5cGU6IDEsIG51bTogNCB9XVxuICAgIH0sIHtcbiAgICAgICAgdHJpZ2dlcnM6IFt7XG4gICAgICAgICAgICBldmVudDogMSxcbiAgICAgICAgICAgIHBhcmFtOiAwLFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHg6IDIwMDAsIHk6IDAsIHdpZHRoOiA0MDAwLCBoZWlnaHQ6IDY0MCB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IHRydWUgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZXZlbnQ6IDIsXG4gICAgICAgICAgICBwYXJhbTogeyB4OiA0NjAwLCB5OiAwLCB3aWR0aDogMzAwLCBoZWlnaHQ6IDY0MCB9LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IGZhbHNlIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAyLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogNDAwMCwgeTogMCwgd2lkdGg6IDIwMDAsIGhlaWdodDogNjQwIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAyNzAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMTAwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDE4NSB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiA1NDAwLCB5OiAxNjAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogNTQwMCwgeTogMjIwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sXG4gICAgICAgIGNvbmQ6IFt7IGNvbmRUeXBlOiAxLCBudW06IDUgfV1cbiAgICB9LCB7XG4gICAgICAgIHRyaWdnZXJzOiBbe1xuICAgICAgICAgICAgZXZlbnQ6IDEsXG4gICAgICAgICAgICBwYXJhbTogMCxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDQsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiA1NTM1LCB5OiAxNzAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAyLFxuICAgICAgICAgICAgcGFyYW06IHsgeDogNTQ4MCwgeTogMTIwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMCB9LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAwIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgICAgICBjb25kOiBbeyBjb25kVHlwZTogMiB9XVxuICAgIH1dXG59XTtcblxuLyp7XHJcbiAgICBjbWQ6IFtcclxuICAgICAgICB7IGNtZFR5cGU6IDQsIHZhbHVlOiBmYWxzZSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9LCB0aW1lOiAyLCBjYW1lcmE6IGZhbHNlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogNSwgcG9zOiB7IHg6IDI1MDAsIHk6IDE4NX0sIHRpbWU6IDIsIGRpcjogMSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogMzAwMCwgeTogMCwgd2lkdGg6IDEwMDAsIGhlaWdodDogNjQwIH0sIHRpbWU6IDEuNSwgY2FtZXJhOiB0cnVlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAyNzAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMTAwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDE4NSB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiAzNjAwLCB5OiAxODUgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDIwMDAsIHk6IDAsIHdpZHRoOiAyMDAwLCBoZWlnaHQ6IDY0MCB9LCB0aW1lOiAxLjUsIGNhbWVyYTogdHJ1ZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDQsIHZhbHVlOiB0cnVlIH0sXHJcbiAgICBdLFxyXG4gICAgY29uZDogW1xyXG4gICAgICAgIHsgY29uZFR5cGU6IDEsIG51bTogNCB9LFxyXG4gICAgXSxcclxufSxcclxue1xyXG4gICAgY21kOiBbXHJcbiAgICAgICAgeyBjbWRUeXBlOiA0LCB2YWx1ZTogZmFsc2UgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDEgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfSwgdGltZTogMiwgY2FtZXJhOiBmYWxzZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDUsIHBvczogeyB4OiA0NTAwLCB5OiAxODV9LCB0aW1lOiAyLCBkaXI6IDEgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDUwMDAsIHk6IDAsIHdpZHRoOiAxMDAwLCBoZWlnaHQ6IDY0MCB9LCB0aW1lOiAxLjUsIGNhbWVyYTogdHJ1ZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMjcwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDEwMCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAxODUgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogNTQwMCwgeTogMTYwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDU0MDAsIHk6IDIyMCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LCBcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDQwMDAsIHk6IDAsIHdpZHRoOiAyMDAwLCBoZWlnaHQ6IDY0MCB9LCB0aW1lOiAxLjUsIGNhbWVyYTogdHJ1ZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDQsIHZhbHVlOiB0cnVlIH0sXHJcbiAgICBdLFxyXG4gICAgY29uZDogW1xyXG4gICAgICAgIHsgY29uZFR5cGU6IDEsIG51bTogNSB9LFxyXG4gICAgXSxcclxufSwqL1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjUwZWFjVFFwQkxZSTUvM1hyVUxJMlgnLCAnaHVyZGxlX2RlZmluZScpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxodXJkbGVfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzLlRyaWdnZXJUeXBlID0ge1xuICAgIE5PTkU6IDAsXG4gICAgVElNRTogMSxcbiAgICBBUkVBOiAyXG59O1xuXG5tb2R1bGUuZXhwb3J0cy5DbWRUeXBlID0ge1xuICAgIE5PTkU6IDAsXG4gICAgQ09OVFJPTF9FTkFCTEVEOiAxLFxuICAgIExPQ0tfQVJFQTogMixcbiAgICBDUkVBVEVfTU9OOiAzLFxuICAgIFNIT1dfVFJBTlNfRE9PUjogNCxcbiAgICBTSE9XX01PVkVfVElQUzogNSxcbiAgICBDSEFOR0VfSFVSRExFOiA2LFxuICAgIE1PVkVfQ0FNRVJBOiA3XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5Db25kVHlwZSA9IHtcbiAgICBOT05FOiAwLFxuICAgIFRPVEFMX01PTl9LSUxMOiAxLFxuICAgIENPTkZJR19DVVNUT006IDJcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhZjZkM1A1MXA5S0VJSm8yR0N4M1dLYScsICdodXJkbGVfcHJvdmlkZXInKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxwcm92aWRlclxcaHVyZGxlX3Byb3ZpZGVyLmpzXG5cbnZhciBjZmcgPSByZXF1aXJlKCdodXJkbGVfY2ZnJykuZGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0Q29uZmlnOiBmdW5jdGlvbiBnZXRDb25maWcoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNmZ1tpZF07XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E0ODIwZzY5bUJMcDd0bENaZkQzTURFJywgJ2kxOG4nKTtcbi8vIHNjcmlwdFxcaTE4blxcaTE4bi5qc1xuXG52YXIgUG9seWdsb3QgPSByZXF1aXJlKCdwb2x5Z2xvdCcpO1xudmFyIGxhbmd1YWdlID0gcmVxdWlyZSgnemgnKTsgLy8gdXBkYXRlIHRoaXMgdG8gc2V0IHlvdXIgZGVmYXVsdCBkaXNwbGF5aW5nIGxhbmd1YWdlIGluIGVkaXRvclxuXG4vLyBsZXQgcG9seWdsb3QgPSBudWxsO1xudmFyIHBvbHlnbG90ID0gbmV3IFBvbHlnbG90KHsgcGhyYXNlczogbGFuZ3VhZ2UgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGFsbG93IHlvdSB0byBzd2l0Y2ggbGFuZ3VhZ2UgZHVyaW5nIHJ1bnRpbWUsIGxhbmd1YWdlIGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgc2FtZSBhcyB5b3VyIGRhdGEgZmlsZSBuYW1lIFxuICAgICAqIHN1Y2ggYXMgd2hlbiBsYW5ndWFnZSBpcyAnemgnLCBpdCB3aWxsIGxvYWQgeW91ciAnemguanMnIGRhdGEgc291cmNlLlxuICAgICAqIEBtZXRob2QgaW5pdCBcbiAgICAgKiBAcGFyYW0gbGFuZ3VhZ2UgLSB0aGUgbGFuZ3VhZ2Ugc3BlY2lmaWMgZGF0YSBmaWxlIG5hbWUsIHN1Y2ggYXMgJ3poJyB0byBsb2FkICd6aC5qcydcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGxhbmd1YWdlKSB7XG4gICAgICAgIHZhciBkYXRhID0gcmVxdWlyZShsYW5ndWFnZSk7XG4gICAgICAgIHBvbHlnbG90LnJlcGxhY2UoZGF0YSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiB0aGlzIG1ldGhvZCB0YWtlcyBhIHRleHQga2V5IGFzIGlucHV0LCBhbmQgcmV0dXJuIHRoZSBsb2NhbGl6ZWQgc3RyaW5nXG4gICAgICogUGxlYXNlIHJlYWQgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyBmb3IgZGV0YWlsc1xuICAgICAqIEBtZXRob2QgdFxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gbG9jYWxpemVkIHN0cmluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogXG4gICAgICogdmFyIG15VGV4dCA9IGkxOG4udCgnTVlfVEVYVF9LRVknKTtcbiAgICAgKiBcbiAgICAgKiAvLyBpZiB5b3VyIGRhdGEgc291cmNlIGlzIGRlZmluZWQgYXMgXG4gICAgICogLy8ge1wiaGVsbG9fbmFtZVwiOiBcIkhlbGxvLCAle25hbWV9XCJ9XG4gICAgICogLy8geW91IGNhbiB1c2UgdGhlIGZvbGxvd2luZyB0byBpbnRlcnBvbGF0ZSB0aGUgdGV4dCBcbiAgICAgKiB2YXIgZ3JlZXRpbmdUZXh0ID0gaTE4bi50KCdoZWxsb19uYW1lJywge25hbWU6ICduYW50YXMnfSk7IC8vIEhlbGxvLCBuYW50YXNcbiAgICAgKi9cbiAgICB0OiBmdW5jdGlvbiB0KGtleSwgb3B0KSB7XG4gICAgICAgIHJldHVybiBwb2x5Z2xvdC50KGtleSwgb3B0KTtcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWYxYTAvNWk5MUt4cnNKbjcxUEdmWTInLCAnaW5pdF9jb25maWcnKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxpbml0X2NvbmZpZy5qc1xuXG5tb2R1bGUuZXhwb3J0cy5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIEdsb2JhbC5odXJkbGVQcm92aWRlciA9IHJlcXVpcmUoJ2h1cmRsZV9wcm92aWRlcicpO1xuICAgIEdsb2JhbC5za2lsbFByb3ZpZGVyID0gcmVxdWlyZSgnc2tpbGxfcHJvdmlkZXInKTtcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3ZTk0OGo0M3NKREE0ZU9UZmFzdGpMaScsICdpbml0X21vZHVsZScpO1xuLy8gc2NyaXB0XFxtb2R1bGVcXGluaXRfbW9kdWxlLmpzXG5cbnZhciBMb2dpbk1vZHVsZSA9IHJlcXVpcmUoJ2xvZ2luX21vZHVsZScpWydjbGFzcyddO1xudmFyIEFjY291bnRNb2R1bGUgPSByZXF1aXJlKCdhY2NvdW50X21vZHVsZScpWydjbGFzcyddO1xuXG5tb2R1bGUuZXhwb3J0cy5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIEdsb2JhbC5sb2dpbk1vZHVsZSA9IG5ldyBMb2dpbk1vZHVsZSgpO1xuICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlID0gbmV3IEFjY291bnRNb2R1bGUoKTtcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczZmQ0ODZaMHhwTXRZYWk0ZFMzamdkcicsICdqb3lfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxqb3lfY3RybC5qc1xuXG52YXIgQ29udHJvbERlZmluZSA9IHJlcXVpcmUoXCJjb250cm9sX2RlZmluZVwiKTtcbnZhciBDb250cm9sS2V5ID0gQ29udHJvbERlZmluZS5Db250cm9sS2V5O1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmFja2dyb3VuZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RpY2s6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0aWNrTW92ZVJhZGl1czogMTAwLFxuXG4gICAgICAgIHN0aWNrS2lja2JhY2tUaW1lOiAwLjMsXG5cbiAgICAgICAgYmFja2dyb3VuZExvd0FscGhhOiA1MCxcblxuICAgICAgICBiYWNrZ3JvdW5kSGlnaEFscGhhOiAyNTUsXG5cbiAgICAgICAgYmFja2dyb3VuZEZhZGVUaW1lOiAwLjJcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX21vdmVQb3MgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9kaXJjdGlvbiA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vcGFjaXR5ID0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGE7XG5cbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydCwgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5vblRvdWNoQ2FuY2VsLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGxheWVyOiBmdW5jdGlvbiBzZXRQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgIHRoaXMuX3BsYXllckN0cmwgPSBwbGF5ZXI7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9TdGFydFN0YWZmKCk7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHRoaXMubm9kZS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZShldmVudCk7XG4gICAgICAgIHRoaXMudXBkYXRlU3RpY2tQb3NpdGlvbihsb2NhdGlvbik7XG4gICAgfSxcblxuICAgIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiBvblRvdWNoTW92ZShldmVudCkge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB0aGlzLm5vZGUuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0aWNrUG9zaXRpb24obG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICBvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9FbmRTdGFmZigpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoQ2FuY2VsOiBmdW5jdGlvbiBvblRvdWNoQ2FuY2VsKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9FbmRTdGFmZigpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVTdGlja1Bvc2l0aW9uOiBmdW5jdGlvbiB1cGRhdGVTdGlja1Bvc2l0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIHZhciByYWRpdXMgPSBNYXRoLnNxcnQoTWF0aC5wb3cobG9jYXRpb24ueCwgMikgKyBNYXRoLnBvdyhsb2NhdGlvbi55LCAyKSk7XG4gICAgICAgIGlmIChyYWRpdXMgPiB0aGlzLnN0aWNrTW92ZVJhZGl1cykge1xuICAgICAgICAgICAgdmFyIHNjYWxlID0gdGhpcy5zdGlja01vdmVSYWRpdXMgLyByYWRpdXM7XG4gICAgICAgICAgICBsb2NhdGlvbi54ICo9IHNjYWxlO1xuICAgICAgICAgICAgbG9jYXRpb24ueSAqPSBzY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2NhdGlvbi54ID09PSAwICYmIGxvY2F0aW9uLnkgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAwO1xuICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgciA9IE1hdGguYXRhbjIobG9jYXRpb24ueCwgbG9jYXRpb24ueSk7XG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguZmxvb3IoMTgwIC0gciAqIDE4MCAvIE1hdGguUEkpIC0gNjcuNTtcbiAgICAgICAgICAgIGlmIChkIDwgMCkgZCA9IDM2MCArIGQ7XG4gICAgICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gNDUpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGljay54ID0gbG9jYXRpb24ueDtcbiAgICAgICAgdGhpcy5zdGljay55ID0gbG9jYXRpb24ueTtcblxuICAgICAgICBpZiAodGhpcy5fcGxheWVyQ3RybCkge1xuICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9PSAxID8gdGhpcy5fcGxheWVyQ3RybC5rZXlEb3duKENvbnRyb2xLZXkuUklHSFQpIDogdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LlJJR0hUKTtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPT0gLTEgPyB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5MRUZUKSA6IHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5MRUZUKTtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPT0gMSA/IHRoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LlVQKSA6IHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5VUCk7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID09IC0xID8gdGhpcy5fcGxheWVyQ3RybC5rZXlEb3duKENvbnRyb2xLZXkuRE9XTikgOiB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuRE9XTik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9TdGFydFN0YWZmOiBmdW5jdGlvbiBkb1N0YXJ0U3RhZmYoKSB7XG4gICAgICAgIHRoaXMuc3RpY2suc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciB0aW1lID0gKHRoaXMuYmFja2dyb3VuZEhpZ2hBbHBoYSAtIHRoaXMuYmFja2dyb3VuZC5vcGFjaXR5KSAvICh0aGlzLmJhY2tncm91bmRIaWdoQWxwaGEgLSB0aGlzLmJhY2tncm91bmRMb3dBbHBoYSkgKiB0aGlzLmJhY2tncm91bmRGYWRlVGltZTtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5GYWRlVG8odGltZSwgdGhpcy5iYWNrZ3JvdW5kSGlnaEFscGhhKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICBkb0VuZFN0YWZmOiBmdW5jdGlvbiBkb0VuZFN0YWZmKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIHRpbWUgPSAodGhpcy5iYWNrZ3JvdW5kLm9wYWNpdHkgLSB0aGlzLmJhY2tncm91bmRMb3dBbHBoYSkgLyAodGhpcy5iYWNrZ3JvdW5kSGlnaEFscGhhIC0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGEpICogdGhpcy5iYWNrZ3JvdW5kRmFkZVRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZVRvKHRpbWUsIHRoaXMuYmFja2dyb3VuZExvd0FscGhhKTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnJ1bkFjdGlvbihhY3Rpb24pO1xuXG4gICAgICAgIGFjdGlvbiA9IG5ldyBjYy5Nb3ZlVG8odGhpcy5zdGlja0tpY2tiYWNrVGltZSwgMCwgMCk7XG4gICAgICAgIGFjdGlvbi5lYXNpbmcobmV3IGNjLmVhc2VCYWNrT3V0KCkpO1xuICAgICAgICB0aGlzLnN0aWNrLnJ1bkFjdGlvbihhY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAwO1xuICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5fcGxheWVyQ3RybCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LlJJR0hUKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5MRUZUKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5VUCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuRE9XTik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBnZXREaXJlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJjdGlvbjtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NTM5N1JDU1I5Rm5MQ3FHVjEvWjZhRCcsICdsb2FkaW5nX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGxvYWRpbmdfY3RybC5qc1xuXG52YXIgU1RBVEVfREVGQVVMVCA9IC0xO1xudmFyIFNUQVRFX0NIRUNLX1VQREFURSA9IDA7XG52YXIgU1RBVEVfVVBEQVRJTkcgPSAxO1xudmFyIFNUQVRFX0xPQURfQVNTRVRTID0gMjtcbnZhciBTVEFURV9JTklUX0dBTUUgPSAzO1xudmFyIFNUQVRFX0VOVEVSX0dBTUUgPSA0O1xudmFyIFNUQVRFX0RPTkUgPSA1O1xuXG52YXIgTG9hZGluZ1N0YXRlSW5mbyA9IFt7XG4gICAgc3RhcnQ6IDAsXG4gICAgZW5kOiAwLjAyLFxuICAgIGxhbmc6ICdjaGVja2luZ191cGRhdGUnXG59LCB7XG4gICAgc3RhcnQ6IDAuMDIsXG4gICAgZW5kOiAwLjA1LFxuICAgIGxhbmc6ICd1cGRhdGluZ19hc3NldHMnXG59LCB7XG4gICAgc3RhcnQ6IDAuMDUsXG4gICAgZW5kOiAwLjksXG4gICAgbGFuZzogJ2xvYWRpbmdfYXNzZXRzJ1xufSwge1xuICAgIHN0YXJ0OiAwLjksXG4gICAgZW5kOiAxLFxuICAgIGxhbmc6ICdpbml0dGluZ19nYW1lJ1xufSwge1xuICAgIHN0YXJ0OiAxLFxuICAgIGVuZDogMSxcbiAgICBsYW5nOiAnZW50ZXJpbmdfZ2FtZSdcbn1dO1xuXG52YXIgUGFuZWxUeXBlID0ge1xuICAgIE5PTkU6IDAsXG4gICAgQ09ORklSTTogMSxcbiAgICBTVEFSVF9VUERBVEU6IDIsXG4gICAgUkVUUllfVVBEQVRFOiAzXG59O1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcmVtb3RlQXNzZXRQYXRoOiAncmVtb3RlX2Fzc3NldCcsXG5cbiAgICAgICAgbG9jYWxNYW5pZmVzdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5SYXdBc3NldFxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZVBhbmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlTWVzc2FnZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVQcm9ncmVzczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJvZ3Jlc3NCYXJcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVDb25maXJtQnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVDb25maXJtTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ2FuY2VsQnV0dG9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVDYW5jZWxMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkaW5nTWVzc2FnZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkaW5nUGVyY2VudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkaW5nUHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByb2dyZXNzQmFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ1BhcnRpY2xlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QYXJ0aWNsZVN5c3RlbVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvYWRBc3NldFRpbWU6IDIsXG4gICAgICAgIGVudGVyR2FtZVRpbWU6IDFcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gU1RBVEVfREVGQVVMVDtcbiAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9uZWVkUmV0cnkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9hZEFzc2V0U3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5sb2FkaW5nUGVyY2VudC5zdHJpbmcgPSAnJztcbiAgICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZS5zdHJpbmcgPSAnJztcbiAgICAgICAgdGhpcy5sb2FkaW5nUGFydGljbGUubm9kZS54ID0gLTI0OS41O1xuICAgICAgICB0aGlzLnNob3dVcGRhdGVQYW5lbChQYW5lbFR5cGUuTk9ORSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNoZWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVVcGRhdGVMaXN0ZW5lcigpO1xuICAgICAgICBpZiAodGhpcy5fYW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FtLnJlbGVhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX2FtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVDaGVja0xpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVDaGVja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5fY2hlY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX2NoZWNrTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZVVwZGF0ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5fdXBkYXRlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl91cGRhdGVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICAvLyDlj6rmnInljp/nlJ/ku6PnoIHpnIDopoHnlKjng63mm7TmlrDlip/og71cbiAgICAgICAgLy90aGlzLnNldFN0YXRlKGNjLnN5cy5pc05hdGl2ZSA/IFNUQVRFX0NIRUNLX1VQREFURSA6IFNUQVRFX0xPQURfQVNTRVRTKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgfSxcblxuICAgIHNldFN0YXRlOiBmdW5jdGlvbiBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT0gc3RhdGUpIHJldHVybjtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgaWYgKHN0YXRlICE9IFNUQVRFX0RFRkFVTFQgJiYgc3RhdGUgIT0gU1RBVEVfRE9ORSkge1xuICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nUGVyY2VudChMb2FkaW5nU3RhdGVJbmZvW3N0YXRlXS5zdGFydCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlLnN0cmluZyA9IEdhbWVMYW5nLnQoTG9hZGluZ1N0YXRlSW5mb1tzdGF0ZV0ubGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBTVEFURV9DSEVDS19VUERBVEU6XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1VwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTVEFURV9VUERBVElORzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfTE9BRF9BU1NFVFM6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydExvYWRBc3NldHMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfSU5JVF9HQU1FOlxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEdhbWUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfRU5URVJfR0FNRTpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RW50ZXJHYW1lKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFVwZGF0ZVBlcmNlbnQ6IGZ1bmN0aW9uIHNldFVwZGF0ZVBlcmNlbnQocGVyY2VudCkge1xuICAgICAgICBpZiAocGVyY2VudCA8IDApIHBlcmNlbnQgPSAwO2Vsc2UgaWYgKHBlcmNlbnQgPiAxKSBwZXJjZW50ID0gMTtcbiAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlLnN0cmluZyA9IEdhbWVMYW5nLnQoJ3VwZGF0ZV9wZXJjZW50JykgKyBNYXRoLmNlaWwocGVyY2VudCAqIDEwMCkudG9TdHJpbmcoKSArIFwiJVwiO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzLnByb2dyZXNzID0gcGVyY2VudDtcbiAgICB9LFxuXG4gICAgc2V0TG9hZGluZ1BlcmNlbnQ6IGZ1bmN0aW9uIHNldExvYWRpbmdQZXJjZW50KHBlcmNlbnQpIHtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwKSBwZXJjZW50ID0gMDtlbHNlIGlmIChwZXJjZW50ID4gMSkgcGVyY2VudCA9IDE7XG4gICAgICAgIHRoaXMubG9hZGluZ1BlcmNlbnQuc3RyaW5nID0gTWF0aC5jZWlsKHBlcmNlbnQgKiAxMDApLnRvU3RyaW5nKCkgKyBcIiVcIjtcbiAgICAgICAgdGhpcy5sb2FkaW5nUHJvZ3Jlc3MucHJvZ3Jlc3MgPSBwZXJjZW50O1xuICAgICAgICB0aGlzLmxvYWRpbmdQYXJ0aWNsZS5ub2RlLnggPSBwZXJjZW50ICogNDk5IC0gMjQ5LjU7XG4gICAgfSxcblxuICAgIGNoZWNrQ2I6IGZ1bmN0aW9uIGNoZWNrQ2IoZXZlbnQpIHtcbiAgICAgICAgY2MubG9nKCdDb2RlOiAnICsgZXZlbnQuZ2V0RXZlbnRDb2RlKCkpO1xuXG4gICAgICAgIHZhciBuZWVkUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoIChldmVudC5nZXRFdmVudENvZGUoKSkge1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX05PX0xPQ0FMX01BTklGRVNUOlxuICAgICAgICAgICAgICAgIGNjLmxvZyhcIk5vIGxvY2FsIG1hbmlmZXN0IGZpbGUgZm91bmQsIGhvdCB1cGRhdGUgc2tpcHBlZC5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfRE9XTkxPQURfTUFOSUZFU1Q6XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfUEFSU0VfTUFOSUZFU1Q6XG4gICAgICAgICAgICAgICAgY2MubG9nKFwiRmFpbCB0byBkb3dubG9hZCBtYW5pZmVzdCBmaWxlLCBob3QgdXBkYXRlIHNraXBwZWQuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfTE9BRF9BU1NFVFMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkFMUkVBRFlfVVBfVE9fREFURTpcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJBbHJlYWR5IHVwIHRvIGRhdGUgd2l0aCB0aGUgbGF0ZXN0IHJlbW90ZSB2ZXJzaW9uLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0xPQURfQVNTRVRTKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5ORVdfVkVSU0lPTl9GT1VORDpcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dVcGRhdGVQYW5lbChQYW5lbFR5cGUuQ09ORklSTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG5lZWRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWVkUmVtb3ZlKSB0aGlzLnJlbW92ZUNoZWNrTGlzdGVuZXIoKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQ2I6IGZ1bmN0aW9uIHVwZGF0ZUNiKGV2ZW50KSB7XG4gICAgICAgIHZhciBuZWVkUmVzdGFydCA9IGZhbHNlO1xuICAgICAgICB2YXIgZmFpbGVkID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZ2V0RXZlbnRDb2RlKCkpIHtcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5VUERBVEVfUFJPR1JFU1NJT046XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBldmVudC5nZXRQZXJjZW50KCk7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRCeUZpbGUgPSBldmVudC5nZXRQZXJjZW50QnlGaWxlKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IGV2ZW50LmdldE1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICBpZiAobXNnKSBjYy5sb2cobXNnKTtcbiAgICAgICAgICAgICAgICBjYy5sb2cocGVyY2VudC50b0ZpeGVkKDIpICsgJyUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVwZGF0ZVBlcmNlbnQocGVyY2VudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5VUERBVEVfRklOSVNIRUQ6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdVcGRhdGUgZmluaXNoZWQuICcgKyBldmVudC5nZXRNZXNzYWdlKCkpO1xuICAgICAgICAgICAgICAgIG5lZWRSZXN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX05PX0xPQ0FMX01BTklGRVNUOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnTm8gbG9jYWwgbWFuaWZlc3QgZmlsZSBmb3VuZCwgaG90IHVwZGF0ZSBza2lwcGVkLicpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9ET1dOTE9BRF9NQU5JRkVTVDpcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9QQVJTRV9NQU5JRkVTVDpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ0ZhaWwgdG8gZG93bmxvYWQgbWFuaWZlc3QgZmlsZSwgaG90IHVwZGF0ZSBza2lwcGVkLicpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5BTFJFQURZX1VQX1RPX0RBVEU6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdBbHJlYWR5IHVwIHRvIGRhdGUgd2l0aCB0aGUgbGF0ZXN0IHJlbW90ZSB2ZXJzaW9uLicpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5VUERBVEVfRkFJTEVEOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnVXBkYXRlIGZhaWxlZC4gJyArIGV2ZW50LmdldE1lc3NhZ2UoKSk7XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9VUERBVElORzpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ0Fzc2V0IHVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LmdldEFzc2V0SWQoKSArICcsICcgKyBldmVudC5nZXRNZXNzYWdlKCkpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfREVDT01QUkVTUzpcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhldmVudC5nZXRNZXNzYWdlKCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmYWlsZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVXBkYXRlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZXRyeSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNob3dVcGRhdGVQYW5lbChQYW5lbFR5cGUuUkVUUllfVVBEQVRFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWVkUmVzdGFydCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVVcGRhdGVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFBhdGhzID0ganNiLmZpbGVVdGlscy5nZXRTZWFyY2hQYXRocygpO1xuICAgICAgICAgICAgdmFyIG5ld1BhdGhzID0gdGhpcy5fYW0uZ2V0TG9jYWxNYW5pZmVzdCgpLmdldFNlYXJjaFBhdGhzKCk7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdChzZWFyY2hQYXRocywgbmV3UGF0aHMpO1xuICAgICAgICAgICAgLy9jYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0hvdFVwZGF0ZVNlYXJjaFBhdGhzJywgSlNPTi5zdHJpbmdpZnkoc2VhcmNoUGF0aHMpKTtcbiAgICAgICAgICAgIGpzYi5maWxlVXRpbHMuc2V0U2VhcmNoUGF0aHMoc2VhcmNoUGF0aHMpO1xuICAgICAgICAgICAgY2MuZ2FtZS5yZXN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hlY2tVcGRhdGU6IGZ1bmN0aW9uIGNoZWNrVXBkYXRlKCkge1xuICAgICAgICB2YXIgc3RvcmFnZVBhdGggPSAoanNiLmZpbGVVdGlscyA/IGpzYi5maWxlVXRpbHMuZ2V0V3JpdGFibGVQYXRoKCkgOiAnLycpICsgdGhpcy5yZW1vdGVBc3NldFBhdGg7XG4gICAgICAgIGNjLmxvZygnU3RvcmFnZSBwYXRoIGZvciByZW1vdGUgYXNzZXQgOiAnICsgc3RvcmFnZVBhdGgpO1xuXG4gICAgICAgIGlmICghdGhpcy5fYW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FtID0gbmV3IGpzYi5Bc3NldHNNYW5hZ2VyKHRoaXMubG9jYWxNYW5pZmVzdCwgc3RvcmFnZVBhdGgpO1xuICAgICAgICAgICAgdGhpcy5fYW0ucmV0YWluKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9uZWVkVXBkYXRlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9hbS5nZXRMb2NhbE1hbmlmZXN0KCkuaXNMb2FkZWQoKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9jaGVja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tMaXN0ZW5lciA9IG5ldyBqc2IuRXZlbnRMaXN0ZW5lckFzc2V0c01hbmFnZXIodGhpcy5fYW0sIHRoaXMuY2hlY2tDYi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fY2hlY2tMaXN0ZW5lciwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hbS5jaGVja1VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0TG9hZEFzc2V0czogZnVuY3Rpb24gc3RhcnRMb2FkQXNzZXRzKCkge1xuICAgICAgICB0aGlzLl9sb2FkQXNzZXRTdGFydFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgfSxcblxuICAgIHN0YXJ0RW50ZXJHYW1lOiBmdW5jdGlvbiBzdGFydEVudGVyR2FtZSgpIHtcbiAgICAgICAgdGhpcy5fZW50ZXJHYW1lRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuZW50ZXJHYW1lVGltZTtcbiAgICB9LFxuXG4gICAgaW5pdEdhbWU6IGZ1bmN0aW9uIGluaXRHYW1lKCkge1xuICAgICAgICByZXF1aXJlKCdpbml0X2NvbmZpZycpLmV4ZWMoKTtcbiAgICAgICAgcmVxdWlyZSgnaW5pdF9tb2R1bGUnKS5leGVjKCk7XG4gICAgfSxcblxuICAgIGVudGVyR2FtZTogZnVuY3Rpb24gZW50ZXJHYW1lKCkge1xuICAgICAgICBHYW1lVXRpbC5sb2FkU2NlbmUoXCJsb2dpblwiKTtcbiAgICB9LFxuXG4gICAgc2hvd1VwZGF0ZVBhbmVsOiBmdW5jdGlvbiBzaG93VXBkYXRlUGFuZWwodHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PSBQYW5lbFR5cGUuTk9ORSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYW5lbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFuZWxUeXBlLkNPTkZJUk06XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb25maXJtQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDYW5jZWxCdXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUxhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ3N0YXJ0X3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsTGFiZWwuc3RyaW5nID0gR2FtZUxhbmcudCgnZXhpdF9nYW1lJyk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2NvbmZpcm1fdXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBhbmVsVHlwZS5TVEFSVF9VUERBVEU6XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb25maXJtQnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsQnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVwZGF0ZVBlcmNlbnQoMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBhbmVsVHlwZS5SRVRSWV9VUERBVEU6XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb25maXJtQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDYW5jZWxCdXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUxhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ3JldHJ5X3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsTGFiZWwuc3RyaW5nID0gR2FtZUxhbmcudCgnZXhpdF9nYW1lJyk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2ZhaWxfdXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUGFuZWwuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uIGRvVXBkYXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FtKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5fdXBkYXRlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RlbmVyID0gbmV3IGpzYi5FdmVudExpc3RlbmVyQXNzZXRzTWFuYWdlcih0aGlzLl9hbSwgdGhpcy51cGRhdGVDYi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0aGlzLl91cGRhdGVMaXN0ZW5lciwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9VUERBVElORyk7XG4gICAgICAgIHRoaXMuX2FtLnVwZGF0ZSgpO1xuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljazogZnVuY3Rpb24gb25Db25maXJtQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLl9uZWVkUmV0cnkgfHwgdGhpcy5fbmVlZFVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLlNUQVJUX1VQREFURSk7XG4gICAgICAgICAgICB0aGlzLmRvVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljazogZnVuY3Rpb24gb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfTE9BRF9BU1NFVFM6XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSAtIHRoaXMuX2xvYWRBc3NldFN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBpZiAodGltZUVsYXBhc2VkID4gdGhpcy5sb2FkQXNzZXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRBc3NldFN0YXJ0VGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfSU5JVF9HQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbG9hZEluZm8gPSBMb2FkaW5nU3RhdGVJbmZvW1NUQVRFX0xPQURfQVNTRVRTXTtcbiAgICAgICAgICAgICAgICB2YXIgYXNzZXRMb2FkUGVyY2VudCA9IHRpbWVFbGFwYXNlZCAvIHRoaXMubG9hZEFzc2V0VGltZTtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxMb2FkUGVyY2VudCA9IChsb2FkSW5mby5lbmQgLSBsb2FkSW5mby5zdGFydCkgKiBhc3NldExvYWRQZXJjZW50ICsgbG9hZEluZm8uc3RhcnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nUGVyY2VudCh0b3RhbExvYWRQZXJjZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfSU5JVF9HQU1FOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfRU5URVJfR0FNRSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0VOVEVSX0dBTUU6XG4gICAgICAgICAgICAgICAgaWYgKEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSA+PSB0aGlzLl9lbnRlckdhbWVFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VudGVyR2FtZUVuZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVudGVyR2FtZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0RPTkUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY4MGJjTFFzbjVKSDdHWVRaV0gxRFBRJywgJ2xvZ2luX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGxvZ2luX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIGFjY291bnRFZGl0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFzc3dkRWRpdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuXG4gICAgICAgIG1zZ0xhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIGFjY291bnRTZWxlY3RQYW5lbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFjY291bnRTY3JvbGxWaWV3OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubXNnTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2NvdW50U2VsZWN0UGFuZWwuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZWFkTG9naW5JbmZvKCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnQoKTtcbiAgICB9LFxuXG4gICAgYWRkRXZlbnQ6IGZ1bmN0aW9uIGFkZEV2ZW50KCkge1xuICAgICAgICB0aGlzLl9sb2dpbkhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0xPR0lOX1JFU1VMVCwgdGhpcy5vbkxvZ2luUmVzdWx0LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZW1vdmVFdmVudDogZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9sb2dpbkhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9sb2dpbkhhbmRsZXIgPSBudWxsO1xuICAgIH0sXG5cbiAgICBzYXZlTG9naW5JbmZvOiBmdW5jdGlvbiBzYXZlTG9naW5JbmZvKCkge1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY291bnQnLCB0aGlzLl9sb2dpbkFjY291bnQpO1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bhc3N3b3JkJywgdGhpcy5fbG9naW5QYXNzd2QpO1xuICAgIH0sXG5cbiAgICByZWFkTG9naW5JbmZvOiBmdW5jdGlvbiByZWFkTG9naW5JbmZvKCkge1xuICAgICAgICB0aGlzLl9sb2dpbkFjY291bnQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnQnKSB8fCAnJztcbiAgICAgICAgdGhpcy5fbG9naW5QYXNzd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Bhc3N3b3JkJykgfHwgJyc7XG4gICAgICAgIHRoaXMuYWNjb3VudEVkaXQuc3RyaW5nID0gdGhpcy5fbG9naW5BY2NvdW50O1xuICAgICAgICB0aGlzLnBhc3N3ZEVkaXQuc3RyaW5nID0gdGhpcy5fbG9naW5QYXNzd2Q7XG4gICAgfSxcblxuICAgIHNldEFjY291bnRMaXN0OiBmdW5jdGlvbiBzZXRBY2NvdW50TGlzdChsaXN0KSB7XG4gICAgICAgIHRoaXMuYWNjb3VudFNjcm9sbFZpZXcuY29udGVudC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gbGlzdCkge1xuICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoJ3ByZWZhYi91aS9jb21wb25lbnRzL2FjY291bnRfaXRlbScsIGNjLlByZWZhYiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgICAgIHZhciBidXR0b24gPSBub2RlLmdldENoaWxkQnlOYW1lKCdidXR0b24nKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENoaWxkQnlOYW1lKCduYW1lX2xhYmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5cy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGxhYmVsLnN0cmluZyA9IGxpc3Rba2V5XTtcbiAgICAgICAgICAgICAgICBidXR0b24ub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY291bnRTZWxlY3RQYW5lbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbG9naW5BY2NvdW50ID0gbGlzdFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBHYW1lUnBjLkNsdDJTcnYubG9naW4oc2VsZi5fbG9naW5BY2NvdW50LCBzZWxmLl9sb2dpblBhc3N3ZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5hY2NvdW50U2Nyb2xsVmlldy5jb250ZW50LmFkZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2dpblJlc3VsdDogZnVuY3Rpb24gb25Mb2dpblJlc3VsdChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAxKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJMb2dpbiBTdWNjZXNzXCIsIGRhdGEuZGF0YS50b2tlbik7XG4gICAgICAgICAgICB0aGlzLnNhdmVMb2dpbkluZm8oKTtcbiAgICAgICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5nYWlOdW1iZXIpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIk11bHRpIEFjY291bnRcIik7XG4gICAgICAgICAgICB0aGlzLnNldEFjY291bnRMaXN0KGRhdGEuZGF0YS5nYWlOdW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5hY2NvdW50U2VsZWN0UGFuZWwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubXNnTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIkFjY291bnQgb3IgUGFzc3dvcmQgaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBkYXRhLmRhdGEuZXJyb3JNc2c7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvZ2luQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uTG9naW5CdXR0b25DbGljaygpIHtcbiAgICAgICAgdmFyIGFjY291bnQgPSB0aGlzLmFjY291bnRFZGl0LnN0cmluZztcbiAgICAgICAgdmFyIHBhc3N3ZCA9IHRoaXMucGFzc3dkRWRpdC5zdHJpbmc7XG4gICAgICAgIGlmIChhY2NvdW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2FjY291bnRfbm90X2VtcHR5Jyk7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFzc3dkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ3Bhc3N3ZF9ub3RfZW1wdHknKTtcbiAgICAgICAgICAgIHRoaXMubXNnTGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9naW5BY2NvdW50ID0gdGhpcy5hY2NvdW50RWRpdC5zdHJpbmc7XG4gICAgICAgIHRoaXMuX2xvZ2luUGFzc3dkID0gdGhpcy5wYXNzd2RFZGl0LnN0cmluZztcbiAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmxvZ2luKHRoaXMuX2xvZ2luQWNjb3VudCwgdGhpcy5fbG9naW5QYXNzd2QpO1xuICAgIH0sXG5cbiAgICBvblJlZ2lzdGVCdXR0b25DbGljazogZnVuY3Rpb24gb25SZWdpc3RlQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGNjLmxvZyhcInJlZ2lzdGVcIik7XG4gICAgfSxcblxuICAgIG9uRm9yZ2V0QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRm9yZ2V0QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGNjLmxvZyhcImZvcmdldFwiKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTEwMzZSR2szeEFqNmxhZUNQVVR0NncnLCAnbG9naW5fbW9kdWxlJyk7XG4vLyBzY3JpcHRcXG1vZHVsZVxcbG9naW5fbW9kdWxlLmpzXG5cbm1vZHVsZS5leHBvcnRzWydjbGFzcyddID0gY2MuQ2xhc3Moe1xuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Rva2VuO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2tlbiA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3RvcjogZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3Rva2VuID0gJyc7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RkZmMxZi8zM0pMb3A2NzhnTjRUZG5WJywgJ21haW4nKTtcbi8vIHNjcmlwdFxcbWFpbi5qc1xuXG52YXIgU3luY1RpbWVyID0gcmVxdWlyZSgnc3luY190aW1lcicpWydjbGFzcyddO1xudmFyIEdhbWVOZXQgPSByZXF1aXJlKCdnYW1lX25ldCcpWydjbGFzcyddO1xudmFyIEdhbWVFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiZ2FtZV9ldmVudF9kaXNwYXRjaGVyXCIpWydjbGFzcyddO1xuXG53aW5kb3cuR2FtZVV0aWwgPSByZXF1aXJlKCdnYW1lX3V0aWwnKTtcbndpbmRvdy5UaW1lVXRpbCA9IHJlcXVpcmUoJ3RpbWVfdXRpbCcpO1xuXG53aW5kb3cuR2FtZUxhbmcgPSByZXF1aXJlKCdpMThuJyk7XG53aW5kb3cuR2FtZVJwYyA9IHJlcXVpcmUoJ2dhbWVfcnBjJyk7XG53aW5kb3cuR2FtZUV2ZW50ID0gcmVxdWlyZSgnZ2FtZV9ldmVudCcpO1xuXG53aW5kb3cuR2xvYmFsID0ge307XG5HbG9iYWwuaW5pdHRlZCA9IGZhbHNlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUodGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKCFHbG9iYWwuaW5pdHRlZCkgdGhpcy5pbml0KCk7ZWxzZSB0aGlzLmdhbWVVcGRhdGUoZHQpO1xuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZVR5cGUgPSAzNjtcbiAgICAgICAgR2xvYmFsLnN5bmNUaW1lciA9IG5ldyBTeW5jVGltZXIoKTtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQgPSBuZXcgR2FtZU5ldCgpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlciA9IG5ldyBHYW1lRXZlbnREaXNwYXRjaGVyKCk7XG4gICAgICAgIEdsb2JhbC5pbml0dGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZ2FtZVVwZGF0ZTogZnVuY3Rpb24gZ2FtZVVwZGF0ZShkdCkge1xuICAgICAgICBHbG9iYWwuc3luY1RpbWVyLnVwZGF0ZShkdCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxYjRiZUhlZGVoRUg2ZUxueVdoUk5sQycsICdtYXBfY3RybCcpO1xuLy8gc2NyaXB0XFxtYXBcXG1hcF9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsb2NrUmVnaW9uOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChyZWdpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbG9ja1JlZ2lvbi5lcXVhbHMocmVnaW9uKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpb24ueCA8IDApIHJlZ2lvbi54ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocmVnaW9uLnkgPCAwKSByZWdpb24ueSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lvbi53aWR0aCA9PT0gMCB8fCByZWdpb24ueE1heCA+PSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGgpIHJlZ2lvbi53aWR0aCA9IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCAtIHJlZ2lvbi54O1xuICAgICAgICAgICAgICAgIGlmIChyZWdpb24uaGVpZ2h0ID09PSAwIHx8IHJlZ2lvbi55TWF4ID49IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQpIHJlZ2lvbi5oZWlnaHQgPSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0IC0gcmVnaW9uLnk7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2xkTG9ja1JlZ2lvbiA9IHRoaXMuX2N1cnJMb2NrUmVnaW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2tSZWdpb24gPSByZWdpb24uY2xvbmUoKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NrUmVnaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxheWVyU2l6ZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogW2NjLlNpemVdXG4gICAgICAgIH0sXG5cbiAgICAgICAgdmlld1NpemU6IG5ldyBjYy5TaXplKClcbiAgICB9LFxuXG4gICAgZ2V0Q3VyclBvc2l0aW9uOiBmdW5jdGlvbiBnZXRDdXJyUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyUG9zO1xuICAgIH0sXG5cbiAgICBnZXRDYW1lcmFQb3NpdGlvbjogZnVuY3Rpb24gZ2V0Q2FtZXJhUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYW1lcmFDdXJyUG9pbnQ7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9lbml0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5fdG14TGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJ0bXhcIik7XG4gICAgICAgIHRoaXMuX3RteEN0cmwgPSB0aGlzLl90bXhMYXllci5nZXRDb21wb25lbnQoY2MuVGlsZWRNYXApO1xuICAgICAgICB0aGlzLl9ncm91bmRDdHJsID0gdGhpcy5fdG14Q3RybC5nZXRMYXllcihcImdyb3VuZFwiKTtcblxuICAgICAgICB0aGlzLl90aWxlU2l6ZSA9IHRoaXMuX3RteEN0cmwuZ2V0VGlsZVNpemUoKTtcbiAgICAgICAgdGhpcy5fbWFwU2l6ZSA9IHRoaXMuX3RteEN0cmwuZ2V0TWFwU2l6ZSgpO1xuICAgICAgICB0aGlzLl9tYXBQaXhlc1NpemUgPSBuZXcgY2MuU2l6ZSh0aGlzLl9tYXBTaXplLndpZHRoICogdGhpcy5fdGlsZVNpemUud2lkdGgsIHRoaXMuX21hcFNpemUuaGVpZ2h0ICogdGhpcy5fdGlsZVNpemUuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLl9sb2NrWCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NrWSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NrUmVnaW9uID0gbmV3IGNjLlJlY3QoMCwgMCwgdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoLCB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLl9waXZvdEN1cnIgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9waXZvdFN0YXJ0ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fcGl2b3RUYXJnZXQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVNwZWVkID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZUVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2N1cnJQb3MgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9pc1Bvc2l0aW9uRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYUN1cnJQb2ludCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2NhbWVyYVRhcmdldFBvaW50ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhU3RhcnRQb2ludCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTcGVlZCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVkTG9jayA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX290aGVyTGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJvdGhlcl9sYXllclwiKTtcbiAgICAgICAgdGhpcy5fb2JqZWN0TGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJvYmplY3RfbGF5ZXJcIik7XG4gICAgICAgIHRoaXMuX2VmZmVjdExheWVycyA9IFtdO1xuXG4gICAgICAgIHZhciBpLCBsYXllcjtcbiAgICAgICAgZm9yIChpID0gMDs7IGkrKykge1xuICAgICAgICAgICAgbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJlZmZlY3RfbGF5ZXJfXCIgKyBpKTtcbiAgICAgICAgICAgIGlmICghbGF5ZXIpIGJyZWFrO1xuICAgICAgICAgICAgdGhpcy5fZWZmZWN0TGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xheWVycyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOzsgaSsrKSB7XG4gICAgICAgICAgICBsYXllciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImxheWVyX1wiICsgaSk7XG4gICAgICAgICAgICBpZiAoIWxheWVyKSBicmVhaztcbiAgICAgICAgICAgIHRoaXMuX2xheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9lbml0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fZW5pdGllcy5wb3AoKTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvY2tYID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvY2tZID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvY2tSZWdpb24ueCA9IDAsIHRoaXMuX2xvY2tSZWdpb24ueSA9IDAsIHRoaXMuX2xvY2tSZWdpb24ud2RpdGggPSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGgsIHRoaXMuX2xvY2tSZWdpb24uaGVpZ2h0ID0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCwgdGhpcy5fcGl2b3RDdXJyLnggPSB0aGlzLl9waXZvdEN1cnIueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90U3RhcnQueCA9IHRoaXMuX3Bpdm90U3RhcnQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90VGFyZ2V0LnggPSB0aGlzLl9waXZvdFRhcmdldC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC54ID0gdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZUVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2lzUG9zaXRpb25EaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYUN1cnJQb2ludC54ID0gdGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC54ID0gdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueCA9IHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC54ID0gdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlZExvY2sgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdSYW5nZSgpO1xuICAgIH0sXG5cbiAgICBhZGRFbml0eTogZnVuY3Rpb24gYWRkRW5pdHkoZW5pdHkpIHtcbiAgICAgICAgdGhpcy5fb2JqZWN0TGF5ZXIuYWRkQ2hpbGQoZW5pdHkpO1xuICAgICAgICB0aGlzLl9lbml0aWVzLnB1c2goZW5pdHkpO1xuICAgIH0sXG5cbiAgICByZW1vdmVFbml0eTogZnVuY3Rpb24gcmVtb3ZlRW5pdHkoZW5pdHkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9lbml0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZW5pdHkgPT0gdGhpcy5fZW5pdGllc1tpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuaXRpZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkZEVmZmVjdDogZnVuY3Rpb24gYWRkRWZmZWN0KGVmZmVjdCwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0TGF5ZXJzW2luZGV4XS5hZGRDaGlsZChlZmZlY3QpO1xuICAgIH0sXG5cbiAgICBjaGVja01vdmVQb2ludDogZnVuY3Rpb24gY2hlY2tNb3ZlUG9pbnQoY29sLCByb3cpIHtcbiAgICAgICAgcm93ID0gdGhpcy5fbWFwU2l6ZS5oZWlnaHQgLSByb3cgLSAxO1xuICAgICAgICB2YXIgZ2lkID0gdGhpcy5fZ3JvdW5kQ3RybC5nZXRUaWxlR0lEQXQoY29sLCByb3cpO1xuICAgICAgICBpZiAoZ2lkID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5fdG14Q3RybC5nZXRQcm9wZXJ0aWVzRm9yR0lEKGdpZCk7XG4gICAgICAgIHJldHVybiBwcm9wICYmIHByb3Aub2JzdGFjbGUgPT09IFwidHJ1ZVwiO1xuICAgIH0sXG5cbiAgICBnZXRNYXBTaXplOiBmdW5jdGlvbiBnZXRNYXBTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG14Q3RybC5nZXRNYXBTaXplKCk7XG4gICAgfSxcblxuICAgIGdldE1hcFBpeGVzU2l6ZTogZnVuY3Rpb24gZ2V0TWFwUGl4ZXNTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwUGl4ZXNTaXplO1xuICAgIH0sXG5cbiAgICBnZXRUaWxlU2l6ZTogZnVuY3Rpb24gZ2V0VGlsZVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90bXhDdHJsLmdldFRpbGVTaXplKCk7XG4gICAgfSxcblxuICAgIGNhbWVyYVRvOiBmdW5jdGlvbiBjYW1lcmFUbyh4LCB5LCB0aW1lLCBjb21wbGV0ZUxvY2spIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYUN1cnJQb2ludC54ID09IHggJiYgdGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgPT0geSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciB0YXJnZXRYID0geDtcbiAgICAgICAgdmFyIHRhcmdldFkgPSB5O1xuICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgIHRhcmdldFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHggPj0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoIC0gdGhpcy52aWV3U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgdGFyZ2V0WCA9IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCAtIHRoaXMudmlld1NpemUud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkgPCAwKSB7XG4gICAgICAgICAgICB0YXJnZXRZID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh5ID49IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQgLSB0aGlzLnZpZXdTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgdGFyZ2V0WSA9IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQgLSB0aGlzLnZpZXdTaXplLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCA9PSB0YXJnZXRYICYmIHRoaXMuX2NhbWVyYUN1cnJQb2ludC55ID09IHRhcmdldFkpIHJldHVybjtcblxuICAgICAgICB2YXIgc2NhbGVUaW1lWCA9IE1hdGguYWJzKCh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCAtIHRhcmdldFgpIC8gKHRoaXMuX2NhbWVyYUN1cnJQb2ludC54IC0geCkpIHx8IDE7XG4gICAgICAgIHZhciBzY2FsZVRpbWVZID0gTWF0aC5hYnMoKHRoaXMuX2NhbWVyYUN1cnJQb2ludC55IC0gdGFyZ2V0WSkgLyAodGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgLSB5KSkgfHwgMTtcbiAgICAgICAgdGltZSAqPSBNYXRoLm1heChzY2FsZVRpbWVYLCBzY2FsZVRpbWVZKTtcblxuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSA9IHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgKyB0aW1lO1xuICAgICAgICB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnggPSB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueDtcbiAgICAgICAgdGhpcy5fY2FtZXJhU3RhcnRQb2ludC55ID0gdGhpcy5fY2FtZXJhQ3VyclBvaW50Lnk7XG4gICAgICAgIHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnggPSB0YXJnZXRYO1xuICAgICAgICB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC55ID0gdGFyZ2V0WTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnggPSAodGFyZ2V0WCAtIHRoaXMuX2NhbWVyYUN1cnJQb2ludC54KSAvIHRpbWU7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC55ID0gKHRhcmdldFkgLSB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSkgLyB0aW1lO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlZExvY2sgPSBjb21wbGV0ZUxvY2s7XG4gICAgfSxcblxuICAgIGVuZENhbWVyYVRvOiBmdW5jdGlvbiBlbmRDYW1lcmFUbygpIHtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueCA9IHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnkgPSAtMTtcbiAgICAgICAgdGhpcy5fY2FtZXJhU3RhcnRQb2ludC54ID0gdGhpcy5fY2FtZXJhU3RhcnRQb2ludC55ID0gLTE7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC54ID0gdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlZExvY2sgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2V0TWFwUG9zaXRpb246IGZ1bmN0aW9uIHNldE1hcFBvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJQb3MueCA9PSB4ICYmIHRoaXMuX2N1cnJQb3MueSA9PSB5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLl9sb2NrWCkge1xuICAgICAgICAgICAgdGhpcy5fY3VyclBvcy54ID0geDtcbiAgICAgICAgICAgIHRoaXMuX2lzUG9zaXRpb25EaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9sb2NrWSkge1xuICAgICAgICAgICAgdGhpcy5fY3VyclBvcy55ID0geTtcbiAgICAgICAgICAgIHRoaXMuX2lzUG9zaXRpb25EaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0TWFwUG92aXQ6IGZ1bmN0aW9uIHNldE1hcFBvdml0KHgsIHksIHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Bpdm90VGFyZ2V0LnggIT09IHggfHwgdGhpcy5fcGl2b3RUYXJnZXQueSAhPT0geSkge1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RUYXJnZXQueCA9IHg7XG4gICAgICAgICAgICB0aGlzLl9waXZvdFRhcmdldC55ID0geTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueCA9ICh4IC0gdGhpcy5fcGl2b3RDdXJyLngpIC8gdGltZTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueSA9ICh5IC0gdGhpcy5fcGl2b3RDdXJyLnkpIC8gdGltZTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90U3RhcnQueCA9IHRoaXMuX3Bpdm90Q3Vyci54O1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RTdGFydC55ID0gdGhpcy5fcGl2b3RDdXJyLnk7XG4gICAgICAgICAgICB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlRW5kVGltZSA9IHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lICsgdGltZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlbmRDaGFuZ2VQaXZvdDogZnVuY3Rpb24gZW5kQ2hhbmdlUGl2b3QoKSB7XG4gICAgICAgIHRoaXMuX3Bpdm90U3RhcnQueCA9IHRoaXMuX3Bpdm90U3RhcnQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90VGFyZ2V0LnggPSB0aGlzLl9waXZvdFRhcmdldC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC54ID0gdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZUVuZFRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBzaG9jazogZnVuY3Rpb24gc2hvY2soKSB7XG4gICAgICAgIHZhciB2aWV3U2l6ZSA9IHRoaXMudmlld1NpemU7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2Muc2VxdWVuY2UobmV3IGNjLm1vdmVCeSgwLjAzLCAwLCAxMCksIG5ldyBjYy5tb3ZlQnkoMC4wMywgMCwgLTIwKSwgbmV3IGNjLm1vdmVCeSgwLjAzLCAwLCAxMCksIG5ldyBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBub2RlLnggPSAwO1xuICAgICAgICAgICAgbm9kZS55ID0gMDtcbiAgICAgICAgfSkpO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgIHZhciBuZWVkVXBkYXRlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9pc1Bvc2l0aW9uRGlydHkpIHtcbiAgICAgICAgICAgIG5lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5faXNQb3NpdGlvbkRpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGl2b3QoY3VyclRpbWUpO1xuICAgICAgICAgICAgbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgPiAwKSB7XG4gICAgICAgICAgICBuZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmVlZFVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3UmFuZ2UoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVFbml0eVpPcmRlcigpO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzUGl2b3Q6IGZ1bmN0aW9uIHByb2Nlc3NQaXZvdChjdXJyVGltZSkge1xuICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGhpcy5fcGl2b3RDaGFuZ2VFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9waXZvdEN1cnIueCA9IHRoaXMuX3Bpdm90VGFyZ2V0Lng7XG4gICAgICAgICAgICB0aGlzLl9waXZvdEN1cnIueSA9IHRoaXMuX3Bpdm90VGFyZ2V0Lnk7XG4gICAgICAgICAgICB0aGlzLmVuZENoYW5nZVBpdm90KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGltZUVsYXBhc2VkID0gY3VyclRpbWUgLSB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q3Vyci54ID0gdGhpcy5fcGl2b3RTdGFydC54ICsgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC54ICogdGltZUVsYXBhc2VkO1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDdXJyLnkgPSB0aGlzLl9waXZvdFN0YXJ0LnkgKyB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnkgKiB0aW1lRWxhcGFzZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlRW5pdHlaT3JkZXI6IGZ1bmN0aW9uIHVwZGF0ZUVuaXR5Wk9yZGVyKCkge1xuICAgICAgICB0aGlzLl9lbml0aWVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnkgPCBiLnkgPyAxIDogLTE7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2VuaXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2VuaXRpZXNbaV0uc2V0TG9jYWxaT3JkZXIoaSArIDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVZpZXdSYW5nZTogZnVuY3Rpb24gdXBkYXRlVmlld1JhbmdlKGN1cnJUaW1lKSB7XG4gICAgICAgIHZhciBtYXBXaWR0aCA9IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aDtcbiAgICAgICAgdmFyIG1hcEhlaWdodCA9IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQ7XG4gICAgICAgIHZhciB2aWV3U2l6ZSA9IHRoaXMudmlld1NpemU7XG4gICAgICAgIHZhciBtYXBQb3MgPSBuZXcgY2MuVmVjMigpO1xuXG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIG1hcFBvcy54ID0gdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueDtcbiAgICAgICAgICAgICAgICBtYXBQb3MueSA9IHRoaXMuX2NhbWVyYVRhcmdldFBvaW50Lnk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYU1vdmVkTG9jaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2NrWCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2tZID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbmRDYW1lcmFUbygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGltZUVsYXBhc2VkID0gY3VyclRpbWUgLSB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIG1hcFBvcy54ID0gdGhpcy5fY2FtZXJhU3RhcnRQb2ludC54ICsgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnggKiB0aW1lRWxhcGFzZWQ7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnkgPSB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnkgKyB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueSAqIHRpbWVFbGFwYXNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW1pdFJlZ2lvbiA9IG5ldyBjYy5SZWN0KCk7XG4gICAgICAgICAgICBsaW1pdFJlZ2lvbi54ID0gdGhpcy5fbG9ja1JlZ2lvbi54O1xuICAgICAgICAgICAgbGltaXRSZWdpb24ueSA9IHRoaXMuX2xvY2tSZWdpb24ueTtcbiAgICAgICAgICAgIGxpbWl0UmVnaW9uLndpZHRoID0gdGhpcy5fbG9ja1JlZ2lvbi53aWR0aCAtIHZpZXdTaXplLndpZHRoO1xuICAgICAgICAgICAgbGltaXRSZWdpb24uaGVpZ2h0ID0gdGhpcy5fbG9ja1JlZ2lvbi5oZWlnaHQgLSB2aWV3U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fbG9ja1gpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3MueCA9IHRoaXMuX2N1cnJQb3MueCArIHRoaXMuX3Bpdm90Q3Vyci54IC0gdmlld1NpemUud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIGlmIChtYXBQb3MueCA8IGxpbWl0UmVnaW9uLnhNaW4pIG1hcFBvcy54ID0gbGltaXRSZWdpb24ueE1pbjtcbiAgICAgICAgICAgICAgICBpZiAobWFwUG9zLnggPiBsaW1pdFJlZ2lvbi54TWF4KSBtYXBQb3MueCA9IGxpbWl0UmVnaW9uLnhNYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvY2tZKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnkgPSB0aGlzLl9jdXJyUG9zLnkgKyB0aGlzLl9waXZvdEN1cnIueSAtIHZpZXdTaXplLmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFBvcy55IDwgbGltaXRSZWdpb24ueU1pbikgbWFwUG9zLnkgPSBsaW1pdFJlZ2lvbi55TWluO1xuICAgICAgICAgICAgICAgIGlmIChtYXBQb3MueSA+IGxpbWl0UmVnaW9uLnlNYXgpIG1hcFBvcy55ID0gbGltaXRSZWdpb24ueU1heDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NhbWVyYUN1cnJQb2ludC54ID0gbWFwUG9zLng7XG4gICAgICAgIHRoaXMuX2NhbWVyYUN1cnJQb2ludC55ID0gbWFwUG9zLnk7XG5cbiAgICAgICAgdGhpcy5fcGl2b3RPZmZzZXQgPSB0aGlzLl9jdXJyUG9zLnggLSBtYXBQb3MueDtcblxuICAgICAgICB0aGlzLl90bXhMYXllci5zZXRQb3NpdGlvbigtbWFwUG9zLngsIC1tYXBQb3MueSk7XG4gICAgICAgIHRoaXMuX29iamVjdExheWVyLnNldFBvc2l0aW9uKC1tYXBQb3MueCwgLW1hcFBvcy55KTtcbiAgICAgICAgdGhpcy5fb3RoZXJMYXllci5zZXRQb3NpdGlvbigtbWFwUG9zLngsIC1tYXBQb3MueSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZWZmZWN0TGF5ZXJzLmxlbmd0aDsgaSsrKSB0aGlzLl9lZmZlY3RMYXllcnNbaV0uc2V0UG9zaXRpb24oLW1hcFBvcy54LCAtbWFwUG9zLnkpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcnNbaV07XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMubGF5ZXJTaXplW2ldO1xuICAgICAgICAgICAgbGF5ZXIueCA9IC1tYXBQb3MueCAvICh0aGlzLl9tYXBQaXhlc1NpemUud2lkdGggLSB2aWV3U2l6ZS53aWR0aCkgKiAoc2l6ZS53aWR0aCAtIHZpZXdTaXplLndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjc1MmR3c1BpbE9jcmViVkh0SHJHM0cnLCAnbWVzc2FnZV9ib3gnKTtcbi8vIHNjcmlwdFxcdWlcXG1lc3NhZ2VfYm94LmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLlxuICAgICAgICBtZXNzYWdlTGFiZWw6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwgPSB0aGlzLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgICAgICB2YXIgYXJncyA9IHRoaXMuX3VpQ3RybC5hcmdzO1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGFyZ3MuY2FsbGJhY2s7XG4gICAgICAgIHRoaXMubWVzc2FnZUxhYmVsLnN0cmluZyA9IGFyZ3MubWVzc2FnZTtcbiAgICB9LFxuXG4gICAgb25CdXR0b25DbGljazogZnVuY3Rpb24gb25CdXR0b25DbGljayhldmVudCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBldmVudC50YXJnZXQubmFtZTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnb2tfYnV0dG9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnY2FuY2VsX2J1dHRvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NjYjUwb1RWamxNVHI0YStlOGdtVitiJywgJ21pc3Npb25fZmFpbCcpO1xuLy8gc2NyaXB0XFx1aVxccmVzdWx0XFxtaXNzaW9uX2ZhaWwuanNcblxudmFyIHRpbWVzTWFwQ29pbiA9IFsxMCwgMzAsIDUwXTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByZXRyeUJ1dHRvbjogY2MuTm9kZSxcbiAgICAgICAgcmV0dXJuQnV0dG9uOiBjYy5Ob2RlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwgPSB0aGlzLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgICAgICB0aGlzLl9yZXRyeUNvdW50ID0gdGhpcy5fdWlDdHJsLmFyZ3MucmV0cnlDb3VudDtcbiAgICAgICAgaWYgKHRoaXMuX3JldHJ5Q291bnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0cnlCdXR0b24uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm5CdXR0b24ueCA9IDE1MDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJldHJ5QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uUmV0cnlCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgICAgIHZhciBuZWVkQ29pbiA9IHRpbWVzTWFwQ29pblt0aGlzLl9yZXRyeUNvdW50IC0gMV07XG4gICAgICAgIHZhciBvd25Db2luID0gR0xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bTtcbiAgICAgICAgaWYgKG93bkNvaW4gPCBuZWVkQ29pbikge1xuICAgICAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdjb2luX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZygnZG8gcmV0cnknKTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX1JFVFJZX0dBTUUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUmV0dXJuQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uUmV0dXJuQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9SRVRVUk5fR0FNRSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NTBmNFJnZHVSSXBadS9qbFdVVDNaSycsICdtb2RlbF9wYW5lbCcpO1xuLy8gc2NyaXB0XFx1aVxcY29tcG9uZW50XFxtb2RlbF9wYW5lbC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl90b3VjaFN0YXJ0ID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl90b3VjaEVuZCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl90b3VjaENhbmNlbCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZUVudGVyID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VMZWF2ZSA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlRG93biA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VNb3ZlID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZVVwID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1VQLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VXaGVsbCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl90b3VjaFN0YXJ0LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX3RvdWNoTW92ZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX3RvdWNoRW5kLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fdG91Y2hDYW5jZWwsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRU5URVIsIHRoaXMuX21vdXNlRW50ZXIsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIHRoaXMuX21vdXNlTGVhdmUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRE9XTiwgdGhpcy5fbW91c2VEb3duLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIHRoaXMuX21vdXNlTW92ZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUCwgdGhpcy5fbW91c2VVcCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCwgdGhpcy5fbW91c2VXaGVsbCwgdGhpcy5ub2RlKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RlZmI5OTEyQ3REUDRTZWFwZzNxSFRLJywgJ21vbnN0ZXJfY3RybCcpO1xuLy8gc2NyaXB0XFxhY3RvclxcbW9uc3Rlcl9jdHJsLmpzXG5cbnZhciBBY3RvckRlZmluZSA9IHJlcXVpcmUoXCJhY3Rvcl9kZWZpbmVcIik7XG52YXIgQWN0b3IgPSByZXF1aXJlKFwiYWN0b3JfY3RybFwiKTtcblxudmFyIEFjdG9yQWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JBY3Rpb247XG52YXIgQWN0b3JEaXJlY3Rpb24gPSBBY3RvckRlZmluZS5BY3RvckRpcmVjdGlvbjtcbnZhciBBY3Rpb25Db21wbGV0ZVR5cGUgPSBBY3RvckRlZmluZS5BY3Rpb25Db21wbGV0ZVR5cGU7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogQWN0b3IsXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fQUlNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJSG9sZEVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSUF0dGFja0RlbGF5RW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJUnVubmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgdGhpcy5fQUlNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJSG9sZEVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSUF0dGFja0RlbGF5RW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJUnVubmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIHJ1bjogZnVuY3Rpb24gcnVuKCkge1xuICAgICAgICB0aGlzLl9BSVJ1bm5lZCA9IHRydWU7XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX0FJUnVubmVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgdGhpcy5fc3VwZXIoZHQpO1xuICAgIH0sXG5cbiAgICBuZXh0QWN0aW9uOiBmdW5jdGlvbiBuZXh0QWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5faXNEZWFkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uQk9STikge1xuICAgICAgICAgICAgdGhpcy5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fQUlSdW5uZWQgJiYgdGhpcy5fYm9ybkVuZFRpbWUgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9BSVJ1bm5lZCAmJiB0aGlzLl9ib3JuRW5kVGltZSA8PSAwKSB7XG4gICAgICAgICAgICB2YXIgcGxheWVyID0gdGhpcy5fbG9naWNNYW5hZ2VyLmdldFBsYXllcigpO1xuICAgICAgICAgICAgaWYgKHBsYXllci5pc0RlYWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpc1ggPSBwbGF5ZXIubm9kZS54IC0gdGhpcy5ub2RlLng7XG4gICAgICAgICAgICB2YXIgZGlzWSA9IHBsYXllci5ub2RlLnkgLSB0aGlzLm5vZGUueTtcbiAgICAgICAgICAgIHZhciBkaXJYID0gQWN0b3JEaXJlY3Rpb24uTEVGVDtcbiAgICAgICAgICAgIHZhciBkaXJZID0gMDtcbiAgICAgICAgICAgIGlmIChkaXNYID4gMCkgZGlyWCA9IEFjdG9yRGlyZWN0aW9uLlJJR0hUO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpc1kpID4gMTApIHtcbiAgICAgICAgICAgICAgICBpZiAoZGlzWSA+IDApIGRpclkgPSAxO2Vsc2UgZGlyWSA9IC0xO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXJZID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXREaXJlY3Rpb24oZGlyWCk7XG5cbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXNZKSA8IDIwICYmIE1hdGguYWJzKGRpc1gpIDwgNjApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGhpcy5fQUlBdHRhY2tEZWxheUVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNraWxsID0gR2xvYmFsLnNraWxsUHJvdmlkZXIuZ2V0Q29uZmlnKDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNraWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9BSUF0dGFja0RlbGF5RW5kVGltZSA9IGN1cnJUaW1lICsgNTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc3R1cmVMaXN0ID0gW3NraWxsLnBvc3R1cmVzWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF0dGFjayhwb3N0dXJlTGlzdCwgMSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fQUlNb3ZlRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPD0gdGhpcy5fQUlNb3ZlRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BlZWQgPSBuZXcgY2MuVmVjMigxMDAgKiBkaXJYLCAxMDAgKiBkaXJZKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPD0gMCB8fCBzcGVlZC54ICE9PSB0aGlzLl9jdXJyTW92ZVNwZWVkLnggfHwgc3BlZWQueSAhPT0gdGhpcy5fY3Vyck1vdmVTcGVlZC55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0TW92ZShzcGVlZC54LCBzcGVlZC55LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IGN1cnJUaW1lICsgTWF0aC5yYW5kb20oKSAqIDIgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fQUlIb2xkRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGhpcy5fQUlIb2xkRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9BSUhvbGRFbmRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX0FJTW92ZUVuZFRpbWUgPSBjdXJyVGltZSArIE1hdGgucmFuZG9tKCkgKiAyICsgMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTIwM2V3d2NhSkFUcS96ZGdPZ2tzamInLCAnbmV0d29ya19jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxuZXR3b3JrX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxvYWRpbmdQcmVmYWI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXJyb3JQcmVmYWI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3JlcXVlc3RIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9IVFRQX1JFUVVFU1QsIHRoaXMub25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fcmVzcG9uZEhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0hUVFBfUkVTUE9ORCwgdGhpcy5vbkV2ZW50LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9uZXR3b3JrRXJyb3JIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9ORVRXT1JLX0VSUk9SLCB0aGlzLm9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fcmVxdWVzdEhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fcmVzcG9uZEhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fbmV0d29ya0Vycm9ySGFuZGxlcik7XG4gICAgICAgIHRoaXMuX3JlcXVlc3RIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzcG9uZEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9uZXR3b3JrRXJyb3JIYW5kbGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgb25FdmVudDogZnVuY3Rpb24gb25FdmVudChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgc3dpdGNoIChldmVudFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgR2FtZUV2ZW50Lk9OX0hUVFBfUkVRVUVTVDpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkaW5nKHRydWUpO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhcIm9uIGh0dHAgcmVxdWVzdFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBHYW1lRXZlbnQuT05fSFRUUF9SRVNQT05EOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhcIm9uIGh0dHAgcmVzcG9uZFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBHYW1lRXZlbnQuT05fTkVUV09SS19FUlJPUjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dFcnJvcigpO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhcIm9uIG5ldHdvcmsgZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd0Vycm9yOiBmdW5jdGlvbiBzaG93RXJyb3IoKSB7XG4gICAgICAgIHZhciBwYW5lbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZXJyb3JQcmVmYWIpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQocGFuZWwpO1xuICAgIH0sXG5cbiAgICBzaG93TG9hZGluZzogZnVuY3Rpb24gc2hvd0xvYWRpbmcodmFsdWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMb2FkaW5nKCk7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHBhbmVsID0gY2MuaW5zdGFudGlhdGUodGhpcy5sb2FkaW5nUHJlZmFiKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChwYW5lbCk7XG4gICAgICAgICAgICB0aGlzLl9sb2FkaW5nUGFuZWwgPSBwYW5lbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVMb2FkaW5nOiBmdW5jdGlvbiByZW1vdmVMb2FkaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5fbG9hZGluZ1BhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkaW5nUGFuZWwucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1BhbmVsID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjIzZmI5dDQxMUt3cXZVOEhPYVhPVkQnLCAnbmV0d29ya19lcnJvcicpO1xuLy8gc2NyaXB0XFxjb21tb25cXG5ldHdvcmtfZXJyb3IuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBvblJldHJ5QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uUmV0cnlCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQucmV0cnlIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG5cbiAgICBvbkV4aXRCdXR0b25DbGljazogZnVuY3Rpb24gb25FeGl0QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RiMThmVkVjYXRHbDZ0ZjVBeVl0T1FoJywgJ3BoeXNpY2FsX25vdF9lbm91Z2gnKTtcbi8vIHNjcmlwdFxcdWlcXHBoeXNpY2FsX25vdF9lbm91Z2guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICB9LFxuXG4gICAgb25CdXlCdXR0b25DbGljazogZnVuY3Rpb24gb25CdXlCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgICAgIHZhciBjb2luID0gR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bTtcbiAgICAgICAgaWYgKEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW0gPCA1MCkge1xuICAgICAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdjb2luX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZygnYnV5IHBoeXNpY2FsJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25DYW5jZWxCdXR0b25DbGljazogZnVuY3Rpb24gb25DYW5jZWxCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWVjMTFFSUtNUkFJNUQ1dm9CKzZCTkMnLCAncGh5c2ljYWxfcG9pbnQnKTtcbi8vIHNjcmlwdFxcdWlcXGNvbXBvbmVudFxccGh5c2ljYWxfcG9pbnQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHN0YXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IHN0YXRlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFyLmFjdGl2ZSA9IHN0YXRlID09PSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAxO1xuICAgICAgICAvL3RoaXMuX2FuaW1hdGlvbiA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgLy90aGlzLl9hbmltYXRpb24ub24oJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlRmluaXNoLCB0aGlzKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBjOGU4enFmQkJJaGI1YXZWNlVJbTJPJywgJ3BsYXllcl9jdHJsJyk7XG4vLyBzY3JpcHRcXGFjdG9yXFxwbGF5ZXJfY3RybC5qc1xuXG52YXIgQ29udHJvbERlZmluZSA9IHJlcXVpcmUoXCJjb250cm9sX2RlZmluZVwiKTtcbnZhciBBY3RvckRlZmluZSA9IHJlcXVpcmUoXCJhY3Rvcl9kZWZpbmVcIik7XG52YXIgQWN0b3IgPSByZXF1aXJlKFwiYWN0b3JfY3RybFwiKTtcblxudmFyIENvbnRyb2xLZXkgPSBDb250cm9sRGVmaW5lLkNvbnRyb2xLZXk7XG52YXIgQWN0b3JBY3Rpb24gPSBBY3RvckRlZmluZS5BY3RvckFjdGlvbjtcbnZhciBBY3RvckRpcmVjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yRGlyZWN0aW9uO1xudmFyIEFjdGlvbkNvbXBsZXRlVHlwZSA9IEFjdG9yRGVmaW5lLkFjdGlvbkNvbXBsZXRlVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBBY3RvcixcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3RhdGVCYXI6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KGJhcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlQmFyID0gYmFyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlQmFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbnRyb2xFbmFibGVkOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChlbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xFbmFibGVkQ291bnQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCA+PSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVsaXZlRWZmZWN0VW5kZXI6IGNjLkFuaW1hdGlvbixcbiAgICAgICAgcmVsaXZlRWZmZWN0VXBwZXI6IGNjLkFuaW1hdGlvblxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVuZGVyLm9uKCdmaW5pc2hlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5yZWxpdmVFZmZlY3RVbmRlci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVcHBlci5vbignZmluaXNoZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHNlbGYucmVsaXZlRWZmZWN0VXBwZXIubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fa2V5RG93bkNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fa2V5RG93blRpbWUgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgICAgIHRoaXMuX2NvbnRyb2xFbmFibGVkQ291bnQgPSAtMTtcblxuICAgICAgICB0aGlzLl9sYXN0QXR0YWNrU2tpbGxJZCA9IDA7XG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9wb3N0dXJlQnJlYWtFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9rZXlEb3duQ291bnQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2tleURvd25UaW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlEb3duVGltZVtpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCA9IC0xO1xuICAgICAgICB0aGlzLl9sYXN0QXR0YWNrU2tpbGxJZCA9IDA7XG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9wb3N0dXJlQnJlYWtFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlQmFyKSB0aGlzLl9zdGF0ZUJhci5zZXRIcCh0aGlzLl9ocCwgdGhpcy5faHBNYXgsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc2V0SHA6IGZ1bmN0aW9uIHNldEhwKHZhbHVlLCBtYXgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIodmFsdWUsIG1heCk7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZUJhcikgdGhpcy5fc3RhdGVCYXIuc2V0SHAodGhpcy5faHAsIHRoaXMuX2hwTWF4LCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHNldEFjdG9yUG9zaXRpb246IGZ1bmN0aW9uIHNldEFjdG9yUG9zaXRpb24oeCwgeSkge1xuICAgICAgICB0aGlzLl9zdXBlcih4LCB5KTtcbiAgICAgICAgdGhpcy5fbWFwLnNldE1hcFBvc2l0aW9uKHgsIHkpO1xuICAgIH0sXG5cbiAgICBzZXRBY3Rpb246IGZ1bmN0aW9uIHNldEFjdGlvbihhY3Rpb24sIGRpciwgcGFyYW0sIHRpbWUpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoYWN0aW9uLCBkaXIsIHBhcmFtLCB0aW1lKTtcbiAgICAgICAgLy90aGlzLnVwZGF0ZU1hcFBpdm90KCk7XG4gICAgfSxcblxuICAgIHNldERpcmVjdGlvbjogZnVuY3Rpb24gc2V0RGlyZWN0aW9uKGRpcikge1xuICAgICAgICB0aGlzLl9zdXBlcihkaXIpO1xuICAgICAgICAvL3RoaXMudXBkYXRlTWFwUGl2b3QoKTtcbiAgICB9LFxuXG4gICAgZGFtYWdlOiBmdW5jdGlvbiBkYW1hZ2UodmFsdWUpIHtcbiAgICAgICAgdmFyIGFuaSA9IHZhbHVlID4gMDtcbiAgICAgICAgdGhpcy5fc3VwZXIodmFsdWUpO1xuICAgICAgICB0aGlzLl9zdGF0ZUJhci5zZXRIcCh0aGlzLl9ocCwgdGhpcy5faHBNYXgsIGFuaSk7XG4gICAgfSxcblxuICAgIGJyZWFrYWJsZTogZnVuY3Rpb24gYnJlYWthYmxlKCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldExhc3RJbnB1dEF0dGFja0tleSgpID09IENvbnRyb2xLZXkuSElUICYmIGN1cnJUaW1lID49IHRoaXMuX2F0dGFja0VuZFRpbWU7XG4gICAgfSxcblxuICAgIG5lZWREaXNhcHBlYXI6IGZ1bmN0aW9uIG5lZWREaXNhcHBlYXIoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbmV4dEFjdGlvbjogZnVuY3Rpb24gbmV4dEFjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Jvcm5FbmRUaW1lID4gMCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xFbmFibGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5SRUxJVkUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZSgpID09IEFjdGlvbkNvbXBsZXRlVHlwZS5DT01QTEVUQUJMRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dERpciA9IHRoaXMuZ2V0TGFzdElucHV0TW92ZURpcmVjdGlvbigpO1xuICAgICAgICB2YXIgZGlyID0gbmV4dERpci54ID09PSAwID8gdGhpcy5fZGlyZWN0aW9uIDogbmV4dERpci54O1xuXG4gICAgICAgIHZhciBhdHRhY2tLZXkgPSB0aGlzLmdldExhc3RJbnB1dEF0dGFja0tleSgpO1xuICAgICAgICBpZiAoYXR0YWNrS2V5ICE9PSBDb250cm9sS2V5Lk5PTkUgJiYgY3VyclRpbWUgPj0gdGhpcy5fYXR0YWNrRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICAgICAgc3dpdGNoIChhdHRhY2tLZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIENvbnRyb2xLZXkuSElUOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRIaXQoZGlyKSkgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbnRlck1vdmUoKSkge30gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faW5pdGlhdGl2ZU1vdmUpIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hlY2tBdHRhY2tQb3N0dXJlOiBmdW5jdGlvbiBjaGVja0F0dGFja1Bvc3R1cmUoc2tpbGxJZCkge1xuICAgICAgICBpZiAoc2tpbGxJZCA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdEF0dGFja1NraWxsSWQgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QXR0YWNrU2tpbGxJZCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJUaW1lID49IHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3N0dXJlQnJlYWtFbmRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9sYXN0SGl0UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdldE5vcm1hbEF0dGFja1Bvc3R1cmUodGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jYy5sb2coXCJsYXN0IGluZGV4XCIgKyB0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4KTtcbiAgICAgICAgICAgIHZhciBwb3N0dXJlID0gdGhpcy5nZXROb3JtYWxBdHRhY2tQb3N0dXJlKHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFwb3N0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdEhpdFJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcG9zdHVyZUJyZWFrRW5kVGltZSA9IGN1cnJUaW1lICsgcG9zdHVyZS50aW1lICsgMC4yO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3R1cmU7XG4gICAgICAgIH0gZWxzZSB7fVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgZ2V0Tm9ybWFsQXR0YWNrUG9zdHVyZTogZnVuY3Rpb24gZ2V0Tm9ybWFsQXR0YWNrUG9zdHVyZShpbmRleCkge1xuICAgICAgICB2YXIgc2tpbGwgPSBHbG9iYWwuc2tpbGxQcm92aWRlci5nZXRDb25maWcoMCk7XG4gICAgICAgIGlmICghc2tpbGwpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gc2tpbGwucG9zdHVyZXNbaW5kZXhdO1xuICAgIH0sXG5cbiAgICBzdGFydEhpdDogZnVuY3Rpb24gc3RhcnRIaXQoZGlyKSB7XG4gICAgICAgIHZhciBwb3N0dXJlID0gdGhpcy5jaGVja0F0dGFja1Bvc3R1cmUoMCk7XG4gICAgICAgIGlmICghcG9zdHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRBdHRhY2soW3Bvc3R1cmVdLCAxLCBkaXIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZW50ZXJNb3ZlOiBmdW5jdGlvbiBlbnRlck1vdmUoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgICAgICB2YXIgZGlyVmVjID0gdGhpcy5nZXRMYXN0SW5wdXRNb3ZlRGlyZWN0aW9uKCk7XG4gICAgICAgIGlmIChkaXJWZWMuZXF1YWxzKGNjLlZlYzIuWkVSTykpIHJldHVybiBmYWxzZTtcblxuICAgICAgICB2YXIgc3BlZWQgPSB0aGlzLmNhbGNNb3ZlU3BlZWQoZGlyVmVjKTtcbiAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPD0gMCB8fCBzcGVlZC54ICE9PSB0aGlzLl9jdXJyTW92ZVNwZWVkLnggfHwgc3BlZWQueSAhPT0gdGhpcy5fY3Vyck1vdmVTcGVlZC55KSB7XG4gICAgICAgICAgICB0aGlzLnNldERpcmVjdGlvbihkaXJWZWMueCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0TW92ZShzcGVlZC54LCBzcGVlZC55LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBwbGF5UmVsaXZlRWZmZWN0OiBmdW5jdGlvbiBwbGF5UmVsaXZlRWZmZWN0KCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VW5kZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVwcGVyLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVbmRlci5wbGF5KCdkZWZhdWx0Jyk7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VXBwZXIucGxheSgnZGVmYXVsdCcpO1xuICAgIH0sXG5cbiAgICBjYWxjTW92ZVNwZWVkOiBmdW5jdGlvbiBjYWxjTW92ZVNwZWVkKGRpclZlYykge1xuICAgICAgICB2YXIgbW92ZVNwZWVkID0gbmV3IGNjLlZlYzIoZGlyVmVjLnggKiB0aGlzLm1vdmVTcGVlZC54LCBkaXJWZWMueSAqIHRoaXMubW92ZVNwZWVkLnkpO1xuICAgICAgICByZXR1cm4gbW92ZVNwZWVkO1xuICAgIH0sXG5cbiAgICBrZXlEb3duOiBmdW5jdGlvbiBrZXlEb3duKGtleSkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fa2V5RG93bkNvdW50Kys7XG4gICAgICAgICAgICB0aGlzLl9rZXlEb3duVGltZVtrZXldID0gdGhpcy5fa2V5RG93bkNvdW50O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGtleVVwOiBmdW5jdGlvbiBrZXlVcChrZXkpIHtcbiAgICAgICAgdGhpcy5fa2V5RG93blRpbWVba2V5XSA9IDA7XG4gICAgfSxcblxuICAgIGdldExhc3RJbnB1dE1vdmVEaXJlY3Rpb246IGZ1bmN0aW9uIGdldExhc3RJbnB1dE1vdmVEaXJlY3Rpb24oKSB7XG4gICAgICAgIHZhciB1ID0gMCxcbiAgICAgICAgICAgIHYgPSAwO1xuICAgICAgICB2YXIgdXQgPSAwLFxuICAgICAgICAgICAgdnQgPSAwO1xuXG4gICAgICAgIGlmICh1dCA8IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuTEVGVF0pIHtcbiAgICAgICAgICAgIHV0ID0gdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5MRUZUXTtcbiAgICAgICAgICAgIHUgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXQgPCB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LlJJR0hUXSkge1xuICAgICAgICAgICAgdXQgPSB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LlJJR0hUXTtcbiAgICAgICAgICAgIHUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2dCA8IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuVVBdKSB7XG4gICAgICAgICAgICB2dCA9IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuVVBdO1xuICAgICAgICAgICAgdiA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZ0IDwgdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5ET1dOXSkge1xuICAgICAgICAgICAgdnQgPSB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LkRPV05dO1xuICAgICAgICAgICAgdiA9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBjYy5WZWMyKHUsIHYpO1xuICAgIH0sXG5cbiAgICBnZXRMYXN0SW5wdXRBdHRhY2tLZXk6IGZ1bmN0aW9uIGdldExhc3RJbnB1dEF0dGFja0tleSgpIHtcbiAgICAgICAgdmFyIGNrID0gQ29udHJvbEtleS5OT05FO1xuICAgICAgICBpZiAodGhpcy5jb250cm9sRW5hYmxlZCkge1xuICAgICAgICAgICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBDb250cm9sS2V5LkpVTVA7IGkgPD0gQ29udHJvbEtleS5TS0lMTDY7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0VGltZSA8IHRoaXMuX2tleURvd25UaW1lW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lID0gdGhpcy5fa2V5RG93blRpbWVbaV07XG4gICAgICAgICAgICAgICAgICAgIGNrID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNrO1xuICAgIH0sXG5cbiAgICB1cGRhdGVNYXBQaXZvdDogZnVuY3Rpb24gdXBkYXRlTWFwUGl2b3QoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJVTikgdGhpcy5fbWFwLnNldE1hcFBvdml0KHRoaXMuX2RpcmVjdGlvbiAqIC0xMDAsIDAsIDIpO2Vsc2UgdGhpcy5fbWFwLnNldE1hcFBvdml0KHRoaXMuX2RpcmVjdGlvbiAqIDEwMCwgMCwgMSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjYzM2Ni9KMS9oRTA0VENIQlNGSXQ4dCcsICdwb2x5Z2xvdCcpO1xuLy8gc2NyaXB0XFxpMThuXFxwb2x5Z2xvdC5qc1xuXG4vLyAgICAgKGMpIDIwMTItMjAxNiBBaXJibmIsIEluYy5cbi8vXG4vLyAgICAgcG9seWdsb3QuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRFxuLy8gICAgIGxpY2Vuc2UuIEZvciBhbGwgbGljZW5zaW5nIGluZm9ybWF0aW9uLCBkZXRhaWxzLCBhbmQgZG9jdW1lbnRpb246XG4vLyAgICAgaHR0cDovL2FpcmJuYi5naXRodWIuY29tL3BvbHlnbG90LmpzXG4vL1xuLy9cbi8vIFBvbHlnbG90LmpzIGlzIGFuIEkxOG4gaGVscGVyIGxpYnJhcnkgd3JpdHRlbiBpbiBKYXZhU2NyaXB0LCBtYWRlIHRvXG4vLyB3b3JrIGJvdGggaW4gdGhlIGJyb3dzZXIgYW5kIGluIE5vZGUuIEl0IHByb3ZpZGVzIGEgc2ltcGxlIHNvbHV0aW9uIGZvclxuLy8gaW50ZXJwb2xhdGlvbiBhbmQgcGx1cmFsaXphdGlvbiwgYmFzZWQgb2ZmIG9mIEFpcmJuYidzXG4vLyBleHBlcmllbmNlIGFkZGluZyBJMThuIGZ1bmN0aW9uYWxpdHkgdG8gaXRzIEJhY2tib25lLmpzIGFuZCBOb2RlIGFwcHMuXG4vL1xuLy8gUG9seWxnbG90IGlzIGFnbm9zdGljIHRvIHlvdXIgdHJhbnNsYXRpb24gYmFja2VuZC4gSXQgZG9lc24ndCBwZXJmb3JtIGFueVxuLy8gdHJhbnNsYXRpb247IGl0IHNpbXBseSBnaXZlcyB5b3UgYSB3YXkgdG8gbWFuYWdlIHRyYW5zbGF0ZWQgcGhyYXNlcyBmcm9tXG4vLyB5b3VyIGNsaWVudC0gb3Igc2VydmVyLXNpZGUgSmF2YVNjcmlwdCBhcHBsaWNhdGlvbi5cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KHJvb3QpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290KTtcbiAgfSBlbHNlIHtcbiAgICByb290LlBvbHlnbG90ID0gZmFjdG9yeShyb290KTtcbiAgfVxufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLCBmdW5jdGlvbiAocm9vdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG5cbiAgLy8gIyMjIFBvbHlnbG90IGNsYXNzIGNvbnN0cnVjdG9yXG4gIGZ1bmN0aW9uIFBvbHlnbG90KG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBocmFzZXMgPSB7fTtcbiAgICB0aGlzLmV4dGVuZChvcHRpb25zLnBocmFzZXMgfHwge30pO1xuICAgIHRoaXMuY3VycmVudExvY2FsZSA9IG9wdGlvbnMubG9jYWxlIHx8ICdlbic7XG4gICAgdGhpcy5hbGxvd01pc3NpbmcgPSAhIW9wdGlvbnMuYWxsb3dNaXNzaW5nO1xuICAgIHRoaXMud2FybiA9IG9wdGlvbnMud2FybiB8fCB3YXJuO1xuICB9XG5cbiAgLy8gIyMjIFZlcnNpb25cbiAgUG9seWdsb3QuVkVSU0lPTiA9ICcxLjAuMCc7XG5cbiAgLy8gIyMjIHBvbHlnbG90LmxvY2FsZShbbG9jYWxlXSlcbiAgLy9cbiAgLy8gR2V0IG9yIHNldCBsb2NhbGUuIEludGVybmFsbHksIFBvbHlnbG90IG9ubHkgdXNlcyBsb2NhbGUgZm9yIHBsdXJhbGl6YXRpb24uXG4gIFBvbHlnbG90LnByb3RvdHlwZS5sb2NhbGUgPSBmdW5jdGlvbiAobmV3TG9jYWxlKSB7XG4gICAgaWYgKG5ld0xvY2FsZSkgdGhpcy5jdXJyZW50TG9jYWxlID0gbmV3TG9jYWxlO1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRMb2NhbGU7XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LmV4dGVuZChwaHJhc2VzKVxuICAvL1xuICAvLyBVc2UgYGV4dGVuZGAgdG8gdGVsbCBQb2x5Z2xvdCBob3cgdG8gdHJhbnNsYXRlIGEgZ2l2ZW4ga2V5LlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QuZXh0ZW5kKHtcbiAgLy8gICAgICAgXCJoZWxsb1wiOiBcIkhlbGxvXCIsXG4gIC8vICAgICAgIFwiaGVsbG9fbmFtZVwiOiBcIkhlbGxvLCAle25hbWV9XCJcbiAgLy8gICAgIH0pO1xuICAvL1xuICAvLyBUaGUga2V5IGNhbiBiZSBhbnkgc3RyaW5nLiAgRmVlbCBmcmVlIHRvIGNhbGwgYGV4dGVuZGAgbXVsdGlwbGUgdGltZXM7XG4gIC8vIGl0IHdpbGwgb3ZlcnJpZGUgYW55IHBocmFzZXMgd2l0aCB0aGUgc2FtZSBrZXksIGJ1dCBsZWF2ZSBleGlzdGluZyBwaHJhc2VzXG4gIC8vIHVudG91Y2hlZC5cbiAgLy9cbiAgLy8gSXQgaXMgYWxzbyBwb3NzaWJsZSB0byBwYXNzIG5lc3RlZCBwaHJhc2Ugb2JqZWN0cywgd2hpY2ggZ2V0IGZsYXR0ZW5lZFxuICAvLyBpbnRvIGFuIG9iamVjdCB3aXRoIHRoZSBuZXN0ZWQga2V5cyBjb25jYXRlbmF0ZWQgdXNpbmcgZG90IG5vdGF0aW9uLlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QuZXh0ZW5kKHtcbiAgLy8gICAgICAgXCJuYXZcIjoge1xuICAvLyAgICAgICAgIFwiaGVsbG9cIjogXCJIZWxsb1wiLFxuICAvLyAgICAgICAgIFwiaGVsbG9fbmFtZVwiOiBcIkhlbGxvLCAle25hbWV9XCIsXG4gIC8vICAgICAgICAgXCJzaWRlYmFyXCI6IHtcbiAgLy8gICAgICAgICAgIFwid2VsY29tZVwiOiBcIldlbGNvbWVcIlxuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfVxuICAvLyAgICAgfSk7XG4gIC8vXG4gIC8vICAgICBjb25zb2xlLmxvZyhwb2x5Z2xvdC5waHJhc2VzKTtcbiAgLy8gICAgIC8vIHtcbiAgLy8gICAgIC8vICAgJ25hdi5oZWxsbyc6ICdIZWxsbycsXG4gIC8vICAgICAvLyAgICduYXYuaGVsbG9fbmFtZSc6ICdIZWxsbywgJXtuYW1lfScsXG4gIC8vICAgICAvLyAgICduYXYuc2lkZWJhci53ZWxjb21lJzogJ1dlbGNvbWUnXG4gIC8vICAgICAvLyB9XG4gIC8vXG4gIC8vIGBleHRlbmRgIGFjY2VwdHMgYW4gb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50LCBgcHJlZml4YCwgd2hpY2ggY2FuIGJlIHVzZWRcbiAgLy8gdG8gcHJlZml4IGV2ZXJ5IGtleSBpbiB0aGUgcGhyYXNlcyBvYmplY3Qgd2l0aCBzb21lIHN0cmluZywgdXNpbmcgZG90XG4gIC8vIG5vdGF0aW9uLlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QuZXh0ZW5kKHtcbiAgLy8gICAgICAgXCJoZWxsb1wiOiBcIkhlbGxvXCIsXG4gIC8vICAgICAgIFwiaGVsbG9fbmFtZVwiOiBcIkhlbGxvLCAle25hbWV9XCJcbiAgLy8gICAgIH0sIFwibmF2XCIpO1xuICAvL1xuICAvLyAgICAgY29uc29sZS5sb2cocG9seWdsb3QucGhyYXNlcyk7XG4gIC8vICAgICAvLyB7XG4gIC8vICAgICAvLyAgICduYXYuaGVsbG8nOiAnSGVsbG8nLFxuICAvLyAgICAgLy8gICAnbmF2LmhlbGxvX25hbWUnOiAnSGVsbG8sICV7bmFtZX0nXG4gIC8vICAgICAvLyB9XG4gIC8vXG4gIC8vIFRoaXMgZmVhdHVyZSBpcyB1c2VkIGludGVybmFsbHkgdG8gc3VwcG9ydCBuZXN0ZWQgcGhyYXNlIG9iamVjdHMuXG4gIFBvbHlnbG90LnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbiAobW9yZVBocmFzZXMsIHByZWZpeCkge1xuICAgIHZhciBwaHJhc2U7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gbW9yZVBocmFzZXMpIHtcbiAgICAgIGlmIChtb3JlUGhyYXNlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHBocmFzZSA9IG1vcmVQaHJhc2VzW2tleV07XG4gICAgICAgIGlmIChwcmVmaXgpIGtleSA9IHByZWZpeCArICcuJyArIGtleTtcbiAgICAgICAgaWYgKHR5cGVvZiBwaHJhc2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGhpcy5leHRlbmQocGhyYXNlLCBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGhyYXNlc1trZXldID0gcGhyYXNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC51bnNldChwaHJhc2VzKVxuICAvLyBVc2UgYHVuc2V0YCB0byBzZWxlY3RpdmVseSByZW1vdmUga2V5cyBmcm9tIGEgcG9seWdsb3QgaW5zdGFuY2UuXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC51bnNldChcInNvbWVfa2V5XCIpO1xuICAvLyAgICAgcG9seWdsb3QudW5zZXQoe1xuICAvLyAgICAgICBcImhlbGxvXCI6IFwiSGVsbG9cIixcbiAgLy8gICAgICAgXCJoZWxsb19uYW1lXCI6IFwiSGVsbG8sICV7bmFtZX1cIlxuICAvLyAgICAgfSk7XG4gIC8vXG4gIC8vIFRoZSB1bnNldCBtZXRob2QgY2FuIHRha2UgZWl0aGVyIGEgc3RyaW5nIChmb3IgdGhlIGtleSksIG9yIGFuIG9iamVjdCBoYXNoIHdpdGhcbiAgLy8gdGhlIGtleXMgdGhhdCB5b3Ugd291bGQgbGlrZSB0byB1bnNldC5cbiAgUG9seWdsb3QucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24gKG1vcmVQaHJhc2VzLCBwcmVmaXgpIHtcbiAgICB2YXIgcGhyYXNlO1xuXG4gICAgaWYgKHR5cGVvZiBtb3JlUGhyYXNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnBocmFzZXNbbW9yZVBocmFzZXNdO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbW9yZVBocmFzZXMpIHtcbiAgICAgICAgaWYgKG1vcmVQaHJhc2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBwaHJhc2UgPSBtb3JlUGhyYXNlc1trZXldO1xuICAgICAgICAgIGlmIChwcmVmaXgpIGtleSA9IHByZWZpeCArICcuJyArIGtleTtcbiAgICAgICAgICBpZiAodHlwZW9mIHBocmFzZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMudW5zZXQocGhyYXNlLCBrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5waHJhc2VzW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC5jbGVhcigpXG4gIC8vXG4gIC8vIENsZWFycyBhbGwgcGhyYXNlcy4gVXNlZnVsIGZvciBzcGVjaWFsIGNhc2VzLCBzdWNoIGFzIGZyZWVpbmdcbiAgLy8gdXAgbWVtb3J5IGlmIHlvdSBoYXZlIGxvdHMgb2YgcGhyYXNlcyBidXQgbm8gbG9uZ2VyIG5lZWQgdG9cbiAgLy8gcGVyZm9ybSBhbnkgdHJhbnNsYXRpb24uIEFsc28gdXNlZCBpbnRlcm5hbGx5IGJ5IGByZXBsYWNlYC5cbiAgUG9seWdsb3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGhyYXNlcyA9IHt9O1xuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC5yZXBsYWNlKHBocmFzZXMpXG4gIC8vXG4gIC8vIENvbXBsZXRlbHkgcmVwbGFjZSB0aGUgZXhpc3RpbmcgcGhyYXNlcyB3aXRoIGEgbmV3IHNldCBvZiBwaHJhc2VzLlxuICAvLyBOb3JtYWxseSwganVzdCB1c2UgYGV4dGVuZGAgdG8gYWRkIG1vcmUgcGhyYXNlcywgYnV0IHVuZGVyIGNlcnRhaW5cbiAgLy8gY2lyY3Vtc3RhbmNlcywgeW91IG1heSB3YW50IHRvIG1ha2Ugc3VyZSBubyBvbGQgcGhyYXNlcyBhcmUgbHlpbmcgYXJvdW5kLlxuICBQb2x5Z2xvdC5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChuZXdQaHJhc2VzKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuZXh0ZW5kKG5ld1BocmFzZXMpO1xuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC50KGtleSwgb3B0aW9ucylcbiAgLy9cbiAgLy8gVGhlIG1vc3QtdXNlZCBtZXRob2QuIFByb3ZpZGUgYSBrZXksIGFuZCBgdGAgd2lsbCByZXR1cm4gdGhlXG4gIC8vIHBocmFzZS5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LnQoXCJoZWxsb1wiKTtcbiAgLy8gICAgID0+IFwiSGVsbG9cIlxuICAvL1xuICAvLyBUaGUgcGhyYXNlIHZhbHVlIGlzIHByb3ZpZGVkIGZpcnN0IGJ5IGEgY2FsbCB0byBgcG9seWdsb3QuZXh0ZW5kKClgIG9yXG4gIC8vIGBwb2x5Z2xvdC5yZXBsYWNlKClgLlxuICAvL1xuICAvLyBQYXNzIGluIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHBlcmZvcm0gaW50ZXJwb2xhdGlvbi5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LnQoXCJoZWxsb19uYW1lXCIsIHtuYW1lOiBcIlNwaWtlXCJ9KTtcbiAgLy8gICAgID0+IFwiSGVsbG8sIFNwaWtlXCJcbiAgLy9cbiAgLy8gSWYgeW91IGxpa2UsIHlvdSBjYW4gcHJvdmlkZSBhIGRlZmF1bHQgdmFsdWUgaW4gY2FzZSB0aGUgcGhyYXNlIGlzIG1pc3NpbmcuXG4gIC8vIFVzZSB0aGUgc3BlY2lhbCBvcHRpb24ga2V5IFwiX1wiIHRvIHNwZWNpZnkgYSBkZWZhdWx0LlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QudChcImlfbGlrZV90b193cml0ZV9pbl9sYW5ndWFnZVwiLCB7XG4gIC8vICAgICAgIF86IFwiSSBsaWtlIHRvIHdyaXRlIGluICV7bGFuZ3VhZ2V9LlwiLFxuICAvLyAgICAgICBsYW5ndWFnZTogXCJKYXZhU2NyaXB0XCJcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgPT4gXCJJIGxpa2UgdG8gd3JpdGUgaW4gSmF2YVNjcmlwdC5cIlxuICAvL1xuICBQb2x5Z2xvdC5wcm90b3R5cGUudCA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcbiAgICB2YXIgcGhyYXNlLCByZXN1bHQ7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgPT0gbnVsbCA/IHt9IDogb3B0aW9ucztcbiAgICAvLyBhbGxvdyBudW1iZXIgYXMgYSBwbHVyYWxpemF0aW9uIHNob3J0Y3V0XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucyA9IHsgc21hcnRfY291bnQ6IG9wdGlvbnMgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBocmFzZXNba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBocmFzZSA9IHRoaXMucGhyYXNlc1trZXldO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuXyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBocmFzZSA9IG9wdGlvbnMuXztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWxsb3dNaXNzaW5nKSB7XG4gICAgICBwaHJhc2UgPSBrZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud2FybignTWlzc2luZyB0cmFuc2xhdGlvbiBmb3Iga2V5OiBcIicgKyBrZXkgKyAnXCInKTtcbiAgICAgIHJlc3VsdCA9IGtleTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwaHJhc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zID0gY2xvbmUob3B0aW9ucyk7XG4gICAgICByZXN1bHQgPSBjaG9vc2VQbHVyYWxGb3JtKHBocmFzZSwgdGhpcy5jdXJyZW50TG9jYWxlLCBvcHRpb25zLnNtYXJ0X2NvdW50KTtcbiAgICAgIHJlc3VsdCA9IGludGVycG9sYXRlKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LmhhcyhrZXkpXG4gIC8vXG4gIC8vIENoZWNrIGlmIHBvbHlnbG90IGhhcyBhIHRyYW5zbGF0aW9uIGZvciBnaXZlbiBrZXlcbiAgUG9seWdsb3QucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5IGluIHRoaXMucGhyYXNlcztcbiAgfTtcblxuICAvLyAjIyMjIFBsdXJhbGl6YXRpb24gbWV0aG9kc1xuICAvLyBUaGUgc3RyaW5nIHRoYXQgc2VwYXJhdGVzIHRoZSBkaWZmZXJlbnQgcGhyYXNlIHBvc3NpYmlsaXRpZXMuXG4gIHZhciBkZWxpbWV0ZXIgPSAnfHx8fCc7XG5cbiAgLy8gTWFwcGluZyBmcm9tIHBsdXJhbGl6YXRpb24gZ3JvdXAgcGx1cmFsIGxvZ2ljLlxuICB2YXIgcGx1cmFsVHlwZXMgPSB7XG4gICAgY2hpbmVzZTogZnVuY3Rpb24gY2hpbmVzZShuKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIGdlcm1hbjogZnVuY3Rpb24gZ2VybWFuKG4pIHtcbiAgICAgIHJldHVybiBuICE9PSAxID8gMSA6IDA7XG4gICAgfSxcbiAgICBmcmVuY2g6IGZ1bmN0aW9uIGZyZW5jaChuKSB7XG4gICAgICByZXR1cm4gbiA+IDEgPyAxIDogMDtcbiAgICB9LFxuICAgIHJ1c3NpYW46IGZ1bmN0aW9uIHJ1c3NpYW4obikge1xuICAgICAgcmV0dXJuIG4gJSAxMCA9PT0gMSAmJiBuICUgMTAwICE9PSAxMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDI7XG4gICAgfSxcbiAgICBjemVjaDogZnVuY3Rpb24gY3plY2gobikge1xuICAgICAgcmV0dXJuIG4gPT09IDEgPyAwIDogbiA+PSAyICYmIG4gPD0gNCA/IDEgOiAyO1xuICAgIH0sXG4gICAgcG9saXNoOiBmdW5jdGlvbiBwb2xpc2gobikge1xuICAgICAgcmV0dXJuIG4gPT09IDEgPyAwIDogbiAlIDEwID49IDIgJiYgbiAlIDEwIDw9IDQgJiYgKG4gJSAxMDAgPCAxMCB8fCBuICUgMTAwID49IDIwKSA/IDEgOiAyO1xuICAgIH0sXG4gICAgaWNlbGFuZGljOiBmdW5jdGlvbiBpY2VsYW5kaWMobikge1xuICAgICAgcmV0dXJuIG4gJSAxMCAhPT0gMSB8fCBuICUgMTAwID09PSAxMSA/IDEgOiAwO1xuICAgIH1cbiAgfTtcblxuICAvLyBNYXBwaW5nIGZyb20gcGx1cmFsaXphdGlvbiBncm91cCB0byBpbmRpdmlkdWFsIGxvY2FsZXMuXG4gIHZhciBwbHVyYWxUeXBlVG9MYW5ndWFnZXMgPSB7XG4gICAgY2hpbmVzZTogWydmYScsICdpZCcsICdqYScsICdrbycsICdsbycsICdtcycsICd0aCcsICd0cicsICd6aCddLFxuICAgIGdlcm1hbjogWydkYScsICdkZScsICdlbicsICdlcycsICdmaScsICdlbCcsICdoZScsICdodScsICdpdCcsICdubCcsICdubycsICdwdCcsICdzdiddLFxuICAgIGZyZW5jaDogWydmcicsICd0bCcsICdwdC1iciddLFxuICAgIHJ1c3NpYW46IFsnaHInLCAncnUnXSxcbiAgICBjemVjaDogWydjcycsICdzayddLFxuICAgIHBvbGlzaDogWydwbCddLFxuICAgIGljZWxhbmRpYzogWydpcyddXG4gIH07XG5cbiAgZnVuY3Rpb24gbGFuZ1RvVHlwZU1hcChtYXBwaW5nKSB7XG4gICAgdmFyIHR5cGUsXG4gICAgICAgIGxhbmdzLFxuICAgICAgICBsLFxuICAgICAgICByZXQgPSB7fTtcbiAgICBmb3IgKHR5cGUgaW4gbWFwcGluZykge1xuICAgICAgaWYgKG1hcHBpbmcuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgbGFuZ3MgPSBtYXBwaW5nW3R5cGVdO1xuICAgICAgICBmb3IgKGwgaW4gbGFuZ3MpIHtcbiAgICAgICAgICByZXRbbGFuZ3NbbF1dID0gdHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gVHJpbSBhIHN0cmluZy5cbiAgdmFyIHRyaW1SZSA9IC9eXFxzK3xcXHMrJC9nO1xuICBmdW5jdGlvbiB0cmltKHN0cikge1xuICAgIHJldHVybiByZXBsYWNlLmNhbGwoc3RyLCB0cmltUmUsICcnKTtcbiAgfVxuXG4gIC8vIEJhc2VkIG9uIGEgcGhyYXNlIHRleHQgdGhhdCBjb250YWlucyBgbmAgcGx1cmFsIGZvcm1zIHNlcGFyYXRlZFxuICAvLyBieSBgZGVsaW1ldGVyYCwgYSBgbG9jYWxlYCwgYW5kIGEgYGNvdW50YCwgY2hvb3NlIHRoZSBjb3JyZWN0XG4gIC8vIHBsdXJhbCBmb3JtLCBvciBub25lIGlmIGBjb3VudGAgaXMgYG51bGxgLlxuICBmdW5jdGlvbiBjaG9vc2VQbHVyYWxGb3JtKHRleHQsIGxvY2FsZSwgY291bnQpIHtcbiAgICB2YXIgcmV0LCB0ZXh0cywgY2hvc2VuVGV4dDtcbiAgICBpZiAoY291bnQgIT0gbnVsbCAmJiB0ZXh0KSB7XG4gICAgICB0ZXh0cyA9IHRleHQuc3BsaXQoZGVsaW1ldGVyKTtcbiAgICAgIGNob3NlblRleHQgPSB0ZXh0c1twbHVyYWxUeXBlSW5kZXgobG9jYWxlLCBjb3VudCldIHx8IHRleHRzWzBdO1xuICAgICAgcmV0ID0gdHJpbShjaG9zZW5UZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsdXJhbFR5cGVOYW1lKGxvY2FsZSkge1xuICAgIHZhciBsYW5nVG9QbHVyYWxUeXBlID0gbGFuZ1RvVHlwZU1hcChwbHVyYWxUeXBlVG9MYW5ndWFnZXMpO1xuICAgIHJldHVybiBsYW5nVG9QbHVyYWxUeXBlW2xvY2FsZV0gfHwgbGFuZ1RvUGx1cmFsVHlwZS5lbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsdXJhbFR5cGVJbmRleChsb2NhbGUsIGNvdW50KSB7XG4gICAgcmV0dXJuIHBsdXJhbFR5cGVzW3BsdXJhbFR5cGVOYW1lKGxvY2FsZSldKGNvdW50KTtcbiAgfVxuXG4gIC8vICMjIyBpbnRlcnBvbGF0ZVxuICAvL1xuICAvLyBEb2VzIHRoZSBkaXJ0eSB3b3JrLiBDcmVhdGVzIGEgYFJlZ0V4cGAgb2JqZWN0IGZvciBlYWNoXG4gIC8vIGludGVycG9sYXRpb24gcGxhY2Vob2xkZXIuXG4gIHZhciBkb2xsYXJSZWdleCA9IC9cXCQvZztcbiAgdmFyIGRvbGxhckJpbGxzWWFsbCA9ICckJCQkJztcbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUocGhyYXNlLCBvcHRpb25zKSB7XG4gICAgZm9yICh2YXIgYXJnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChhcmcgIT09ICdfJyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KGFyZykpIHtcbiAgICAgICAgLy8gRW5zdXJlIHJlcGxhY2VtZW50IHZhbHVlIGlzIGVzY2FwZWQgdG8gcHJldmVudCBzcGVjaWFsICQtcHJlZml4ZWRcbiAgICAgICAgLy8gcmVnZXggcmVwbGFjZSB0b2tlbnMuIHRoZSBcIiQkJCRcIiBpcyBuZWVkZWQgYmVjYXVzZSBlYWNoIFwiJFwiIG5lZWRzIHRvXG4gICAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gb3B0aW9uc1thcmddO1xuICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gcmVwbGFjZS5jYWxsKG9wdGlvbnNbYXJnXSwgZG9sbGFyUmVnZXgsIGRvbGxhckJpbGxzWWFsbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UgY3JlYXRlIGEgbmV3IGBSZWdFeHBgIGVhY2ggdGltZSBpbnN0ZWFkIG9mIHVzaW5nIGEgbW9yZS1lZmZpY2llbnRcbiAgICAgICAgLy8gc3RyaW5nIHJlcGxhY2Ugc28gdGhhdCB0aGUgc2FtZSBhcmd1bWVudCBjYW4gYmUgcmVwbGFjZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgLy8gaW4gdGhlIHNhbWUgcGhyYXNlLlxuICAgICAgICBwaHJhc2UgPSByZXBsYWNlLmNhbGwocGhyYXNlLCBuZXcgUmVnRXhwKCclXFxcXHsnICsgYXJnICsgJ1xcXFx9JywgJ2cnKSwgcmVwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGhyYXNlO1xuICB9XG5cbiAgLy8gIyMjIHdhcm5cbiAgLy9cbiAgLy8gUHJvdmlkZXMgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlIGlmIGEgcGhyYXNlIGtleSBpcyBtaXNzaW5nLlxuICBmdW5jdGlvbiB3YXJuKG1lc3NhZ2UpIHtcbiAgICByb290LmNvbnNvbGUgJiYgcm9vdC5jb25zb2xlLndhcm4gJiYgcm9vdC5jb25zb2xlLndhcm4oJ1dBUk5JTkc6ICcgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIC8vICMjIyBjbG9uZVxuICAvL1xuICAvLyBDbG9uZSBhbiBvYmplY3QuXG4gIGZ1bmN0aW9uIGNsb25lKHNvdXJjZSkge1xuICAgIHZhciByZXQgPSB7fTtcbiAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgcmV0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcmV0dXJuIFBvbHlnbG90O1xufSk7XG4vL1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDI2OGFMeXd4RkNBN3FOUWNSQ0tZYzcnLCAncm91bmRfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxyb3VuZF9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbnVtYmVyczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5QcmVmYWJdXG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbnVtcyA9IFtdO1xuICAgICAgICB0aGlzLl9hbmkgPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICB0aGlzLnJvdW5kLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRSb3VuZDogZnVuY3Rpb24gc2V0Um91bmQodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIDtlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7ZWxzZSByZXR1cm47XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuX251bXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9udW1zLnBvcCgpO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYW5pLnN0b3AoKTtcbiAgICAgICAgdGhpcy5yb3VuZC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgdG90YWxXaWR0aCA9IDA7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChuZXcgY2MuZGVsYXlUaW1lKDAuMikpO1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKG5ldyBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlSW50KHZhbHVlLmNoYXJBdChpbmRleCkpO1xuICAgICAgICAgICAgICAgIHZhciBwcmVmYWIgPSBzZWxmLm51bWJlcnNbbnVtXTtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICAgICAgbm9kZS54ID0gdG90YWxXaWR0aDtcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHNlbGYubm9kZTtcbiAgICAgICAgICAgICAgICB0b3RhbFdpZHRoICs9IG5vZGUud2lkdGg7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICBzZWxmLl9udW1zLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aW9ucy5wdXNoKG5ldyBjYy5kZWxheVRpbWUoMC4yKSk7XG4gICAgICAgIGFjdGlvbnMucHVzaChuZXcgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5yb3VuZC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5yb3VuZC54ID0gdG90YWxXaWR0aCAtIDM1O1xuICAgICAgICAgICAgc2VsZi5fYW5pLnBsYXkoJ3JvdW5kX2ltZycpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKG5ldyBjYy5TZXF1ZW5jZShhY3Rpb25zKSk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZWQyOTFOM2kxdERVN1gwZjBCRHBjRTYnLCAnc2tpbGxfY2ZnJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xcZGF0YVxcc2tpbGxfY2ZnLmpzXG5cbi8qXHJcbmFjdFR5cGUg57G75Z6L6K+05piO77yaXHJcbiAgICAxOiDlgZrmiJDkvKTlrrMg5b+F5aGr5a2X5q61KGFjdFZhbHVlIHJhbmFnZSlcclxuICAgIDI6IOiHqui6q+aWveWKoOehrOebtCDlv4XloavlrZfmrrUoYWN0VmFsdWUpXHJcbiAgICAzOiDpnIflsY9cclxuICAgIDQ6IOaSreaUvueJueaViFxyXG4qL1xuXG5tb2R1bGUuZXhwb3J0cy5kYXRhID0gW3tcbiAgICBpZDogMCxcbiAgICBwb3N0dXJlczogW3tcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGFjdGlvbkluZGV4OiAxLFxuICAgICAgICB0aW1lOiAwLjMsXG4gICAgICAgIHRpbWVQb2ludHM6IFt7XG4gICAgICAgICAgICBhY3RUeXBlOiAxLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAuMjUsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzIwXSxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgY2MuUmVjdCgzMCwgODgsIDM4LCAyOSksXG4gICAgICAgICAgICBhdHRhY2tUeXBlOiAxLFxuICAgICAgICAgICAgc291bmQ6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogMiwgLy8y5Luj6KGo5a+56Ieq6Lqr5pa95Yqg56Gs55u0XG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMC4zXVxuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IDIsXG4gICAgICAgIGFjdGlvbkluZGV4OiAyLFxuICAgICAgICB0aW1lOiAwLjQsXG4gICAgICAgIHRpbWVQb2ludHM6IFt7XG4gICAgICAgICAgICBhY3RUeXBlOiAxLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAuMixcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMjJdLFxuICAgICAgICAgICAgcmFuZ2U6IG5ldyBjYy5SZWN0KDMzLCA5OCwgMzAsIDQ1KSxcbiAgICAgICAgICAgIGF0dGFja1R5cGU6IDIsXG4gICAgICAgICAgICBhdHRhY2tQYXJhbTogeyB0b3BUaW1lOiAwLjQsIHRvcEhlaWdodDogMTAwLCBkaXN0YW5jZTogMzAsIGNvbWJvOiAzNSB9LFxuICAgICAgICAgICAgc291bmQ6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogMiwgLy8y5Luj6KGo5a+56Ieq6Lqr5pa95Yqg56Gs55u0XG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMC40XVxuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIGFjdGlvbkluZGV4OiAzLFxuICAgICAgICB0aW1lOiAwLjUsXG4gICAgICAgIGVmZmVjdFRpbWVQb2ludDogMCxcbiAgICAgICAgdGltZVBvaW50czogW3tcbiAgICAgICAgICAgIGFjdFR5cGU6IDEsXG4gICAgICAgICAgICB0YWtlVGltZTogMC4yNSxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMjZdLFxuICAgICAgICAgICAgcmFuZ2U6IG5ldyBjYy5SZWN0KDQxLCA3OCwgOTAsIDMzKSxcbiAgICAgICAgICAgIGF0dGFja1R5cGU6IDIsXG4gICAgICAgICAgICBhdHRhY2tQYXJhbTogeyB0b3BUaW1lOiAwLjQsIHRvcEhlaWdodDogMjAsIGRpc3RhbmNlOiAzMDAsIGNvbWJvOiA3MCB9LFxuICAgICAgICAgICAgc291bmQ6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogMixcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgYWN0VmFsdWU6IFswLjVdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDMsXG4gICAgICAgICAgICB0YWtlVGltZTogMC4yNVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiA0LFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBsYXllcjogMSxcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDQsXG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGxheWVyOiAwLFxuICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogNCxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgbGF5ZXI6IDEsXG4gICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfVxuICAgICAgICB9XVxuICAgIH1dXG59LCB7XG4gICAgaWQ6IDEsXG4gICAgcG9zdHVyZXM6IFt7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBhY3Rpb25JbmRleDogMSxcbiAgICAgICAgdGltZTogMC4zLFxuICAgICAgICB0aW1lUG9pbnRzOiBbe1xuICAgICAgICAgICAgYWN0VHlwZTogMSxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLjI1LFxuICAgICAgICAgICAgYWN0VmFsdWU6IFsyMF0sXG4gICAgICAgICAgICByYW5nZTogbmV3IGNjLlJlY3QoMzAsIDg4LCAzOCwgMjkpLFxuICAgICAgICAgICAgYXR0YWNrVHlwZTogMSxcbiAgICAgICAgICAgIHNvdW5kOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDIsIC8vMuS7o+ihqOWvueiHqui6q+aWveWKoOehrOebtFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzAuM11cbiAgICAgICAgfV1cbiAgICB9XVxufV07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczN2YzNDJwMmJGRktxQUpKQjR4a1pnMCcsICdza2lsbF9kZWZpbmUnKTtcbi8vIHNjcmlwdFxcYWN0b3JcXHNraWxsX2RlZmluZS5qc1xuXG5tb2R1bGUuZXhwb3J0cy5UaW1lUG9pbnRBY3RUeXBlID0ge1xuICAgIERBTUFHRTogMSxcbiAgICBTRUxGX0RFTEFZOiAyLFxuICAgIFNIT0NLX1NDUkVFTjogMyxcbiAgICBQTEFZX0VGRkVDVDogNFxufTtcblxubW9kdWxlLmV4cG9ydHMuQXR0YWNrVHlwZSA9IHtcbiAgICBOT1JNQUw6IDEsXG4gICAgRkxZOiAyXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2ViZTN2OWdDUk5icW9GNmdmY0c1TXMnLCAnc2tpbGxfcHJvdmlkZXInKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxwcm92aWRlclxcc2tpbGxfcHJvdmlkZXIuanNcblxudmFyIGNmZyA9IHJlcXVpcmUoJ3NraWxsX2NmZycpLmRhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldENvbmZpZzogZnVuY3Rpb24gZ2V0Q29uZmlnKGlkKSB7XG4gICAgICAgIHJldHVybiBjZmdbaWRdO1xuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhMWJlMGJQdVd4R1VhU09YWEhGbXpwbicsICdzdGF0ZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXHN0YXRlX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGhwQWxwaGE6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGhwTGlnaHQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIG5hbWVMYWJlbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdmVUaW1lOiAzXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl90aW1lID0gMDtcbiAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc3RhcnRXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX3RhcmdldFdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5fbWF4V2lkdGggPSB0aGlzLmhwTGlnaHQud2lkdGg7XG4gICAgfSxcblxuICAgIHNldE5hbWU6IGZ1bmN0aW9uIHNldE5hbWUobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWVMYWJlbC5zdHJpbmcgPSBuYW1lO1xuICAgIH0sXG5cbiAgICBzZXRIcDogZnVuY3Rpb24gc2V0SHAoaHAsIG1heCwgYW5pKSB7XG4gICAgICAgIGlmIChocCA8IDApIGhwID0gMDtcbiAgICAgICAgaWYgKG1heCA8IDEpIG1heCA9IDE7XG4gICAgICAgIHZhciBwZXJjZW50ID0gaHAgLyBtYXg7XG4gICAgICAgIHZhciB3aWR0aCA9IHBlcmNlbnQgKiB0aGlzLl9tYXhXaWR0aDtcbiAgICAgICAgaWYgKCFhbmkpIHtcbiAgICAgICAgICAgIHRoaXMuaHBBbHBoYS53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgdGhpcy5ocExpZ2h0LndpZHRoID0gd2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhwTGlnaHQud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0V2lkdGggPSB0aGlzLmhwQWxwaGEud2lkdGg7XG4gICAgICAgICAgICB0aGlzLl90YXJnZXRXaWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX2RlbGF5VGltZSA9ICh0aGlzLl9zdGFydFdpZHRoIC0gdGhpcy5fdGFyZ2V0V2lkdGgpIC8gdGhpcy5fbWF4V2lkdGggKiB0aGlzLm1vdmVUaW1lO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlbGF5VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2RlbGF5VGltZSAtPSBkdDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZWxheVRpbWUgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGF5VGltZSA9IHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaHBMaWdodC53aWR0aCA9IHRoaXMuX3RhcmdldFdpZHRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMuX3RpbWUgLSB0aGlzLl9kZWxheVRpbWU7IC8vIHRoaXMubW92ZVRpbWU7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSB0aGlzLl9tYXhXaWR0aCAqIGUgLyB0aGlzLm1vdmVUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuaHBBbHBoYS53aWR0aCA9IHRoaXMuX3N0YXJ0V2lkdGggLSBkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiNDNiMXRSQnc1SG1ycWtQdE1VVDIzdScsICdzeW5jX3RpbWVyJyk7XG4vLyBzY3JpcHRcXHRpbWVyXFxzeW5jX3RpbWVyLmpzXG5cbm1vZHVsZS5leHBvcnRzW1wiY2xhc3NcIl0gPSBjYy5DbGFzcyh7XG4gICAgY3RvcjogZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5fdGljayA9IDA7XG4gICAgICAgIHRoaXMuX29yZ2luVGljayA9IDA7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgdGhpcy5fdGljayA9IDA7XG4gICAgICAgIHRoaXMuX29yZ2luVGljayA9IDA7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuX3RpY2sgKz0gZHQ7XG4gICAgICAgIHRoaXMuX29yZ2luVGljayArPSBkdDtcbiAgICB9LFxuXG4gICAgZ2V0VGltZXI6IGZ1bmN0aW9uIGdldFRpbWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGljaztcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzE0Y2EwZklxWVJBTTdkZjlBQnoxNjBRJywgJ3Rlc3RfbWFwJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFx0ZXN0X21hcC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgZWRpdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuXG4gICAgICAgIGFiYzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9Tb3VyY2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICB0aGlzLl9yb3VuZE51bSA9IHRoaXMucm91bmQuZ2V0Q29tcG9uZW50KCdyb3VuZF9jdHJsJyk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy9jYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoJ3Jlc291cmNlcy9zb3VuZC9iZycsIHRydWUpO1xuICAgICAgICAvL3RoaXMuX21hcC5sb2NrUmVnaW9uID0gbmV3IGNjLlJlY3QoMCwgMCwgMTUwMCwgNjQwKTtcbiAgICAgICAgLy90aGlzLl9tYXAuc2V0TWFwUG92aXQoLTEwMCwgMCwgMSk7XG4gICAgfSxcblxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG4gICAgICAgIC8vY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKCdyZXNvdXJjZXMvc291bmQvYmcnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hYmMucGxheSgpO1xuICAgICAgICAvL2NjLmxvYWRlci5sb2FkUmVzKCdzb3VuZC9iZycsIGNjLkF1ZGlvQ2xpcCwgZnVuY3Rpb24gKGVyciwgY2xpcCkge1xuICAgICAgICAvLyAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoJ3Jlc291cmNlcy9zb3VuZC9iZy5tcDMnKTtcbiAgICAgICAgLy8gICAgY2MubG9nKCdwcHA6ICcsIGVyciwgY2xpcCk7XG4gICAgICAgIC8vfSk7XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtLnNldFJvdW5kKHRoaXMuZWRpdC5zdHJpbmcpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGNjLmxvZyh0aGlzLmFiYy5pc1BsYXlpbmcpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTEyYWJhemRYSkhGNUFtWXRDdG8yZ3MnLCAndGltZV91dGlsJyk7XG4vLyBzY3JpcHRcXHV0aWxcXHRpbWVfdXRpbC5qc1xuXG5mdW5jdGlvbiBmaWxsWmVybyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA+IDkgPyB2YWx1ZS50b1N0cmluZygpIDogJzAnICsgdmFsdWUudG9TdHJpbmcoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBzZWNUb01TOiBmdW5jdGlvbiBzZWNUb01TKHNlYykge1xuICAgICAgICB2YXIgcyA9IHNlYyAlIDYwO1xuICAgICAgICB2YXIgbSA9IChzZWMgLSBzKSAvIDYwO1xuICAgICAgICB2YXIgcmV0ID0gY2MuanMuZm9ybWF0U3RyKFwiJXM6JXNcIiwgZmlsbFplcm8obSksIGZpbGxaZXJvKHMpKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgc2VjVG9ITVM6IGZ1bmN0aW9uIHNlY1RvSE1TKHNlYykge1xuICAgICAgICB2YXIgdCA9IHNlYyAlIDM2MDA7XG4gICAgICAgIHZhciBoID0gKHNlYyAtIHQpIC8gMzYwMDtcbiAgICAgICAgdmFyIHMgPSB0ICUgNjA7XG4gICAgICAgIHZhciBtID0gKHQgLSBzKSAvIDYwO1xuICAgICAgICB2YXIgcmV0ID0gY2MuanMuZm9ybWF0U3RyKFwiJXM6JXM6JXNcIiwgZmlsbFplcm8oaCksIGZpbGxaZXJvKG0pLCBmaWxsWmVybyhzKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDJjOTlqK0hyZE5BNm1mR0p0am41bVAnLCAndWlfY3RybCcpO1xuLy8gc2NyaXB0XFx1aVxcdWlfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FyZ3MgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1hbmFnZXI6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KG1hbmFnZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYW5hZ2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9pZCA9IC0xO1xuICAgIH0sXG5cbiAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5jbG9zZVVJKHRoaXMubm9kZSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzRlNTQyR1hDUnBFS29sUEV1TEZnUU1UJywgJ3VpX21hbmFnZXInKTtcbi8vIHNjcmlwdFxcdWlcXHVpX21hbmFnZXIuanNcblxudmFyIEJ1ZmZlclRhYmxlID0gcmVxdWlyZSgnYnVmZmVyX3RhYmxlJylbJ2NsYXNzJ107XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdWlDb250YWluZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdGFibGUgPSBbXTtcbiAgICB9LFxuXG4gICAgb3BlblVJOiBmdW5jdGlvbiBvcGVuVUkobmFtZSwgYXJncykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKCdwcmVmYWIvdWkvJyArIG5hbWUsIGNjLlByZWZhYiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICB2YXIgaWQgPSBzZWxmLl90YWJsZS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgdmFyIGN0cmwgPSBub2RlLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgICAgICAgICAgY3RybC5pZCA9IGlkO1xuICAgICAgICAgICAgY3RybC5hcmdzID0gYXJncztcbiAgICAgICAgICAgIGN0cmwubWFuYWdlciA9IHNlbGY7XG4gICAgICAgICAgICBzZWxmLnVpQ29udGFpbmVyLmFkZENoaWxkKG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2xvc2VVSTogZnVuY3Rpb24gY2xvc2VVSShub2RlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChub2RlID09IHRoaXMuX3RhYmxlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFibGUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb3NlQWxsOiBmdW5jdGlvbiBjbG9zZUFsbCgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX3RhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fdGFibGUucG9wKCk7XG4gICAgICAgICAgICBpZiAobm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTVmMzF0SDdodE5YNzlTUCtxTkhBMUYnLCAneHh0ZWEnKTtcbi8vIHNjcmlwdFxcbGliXFx0aGlyZFxceHh0ZWFcXHh4dGVhLmpzXG5cbmZ1bmN0aW9uIHV0ZjE2dG84KHN0cikge1xuICAgIHZhciBvdXQsIGksIGxlbiwgYztcbiAgICBvdXQgPSBbXTtcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjID49IDB4MDAwMSAmJiBjIDw9IDB4MDA3Rikge1xuICAgICAgICAgICAgb3V0W2ldID0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjID4gMHgwN0ZGKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RTAgfCBjID4+IDEyICYgMHgwRiwgMHg4MCB8IGMgPj4gNiAmIDB4M0YsIDB4ODAgfCBjID4+IDAgJiAweDNGKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFtpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhDMCB8IGMgPj4gNiAmIDB4MUYsIDB4ODAgfCBjID4+IDAgJiAweDNGKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuZnVuY3Rpb24gdXRmOHRvMTYoc3RyKSB7XG4gICAgdmFyIG91dCwgaSwgbGVuLCBjO1xuICAgIHZhciBjaGFyMiwgY2hhcjM7XG4gICAgb3V0ID0gW107XG4gICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgc3dpdGNoIChjID4+IDQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSBzdHIuY2hhckF0KGkgLSAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIGNoYXIyID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChjICYgMHgxRikgPDwgNiB8IGNoYXIyICYgMHgzRik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgIGNoYXIyID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgICAgICAgICBjaGFyMyA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYyAmIDB4MEYpIDw8IDEyIHwgKGNoYXIyICYgMHgzRikgPDwgNiB8IChjaGFyMyAmIDB4M0YpIDw8IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG59XG52YXIgYmFzZTY0RW5jb2RlQ2hhcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIjtcbnZhciBiYXNlNjREZWNvZGVDaGFycyA9IG5ldyBBcnJheSgtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgNjIsIC0xLCAtMSwgLTEsIDYzLCA1MiwgNTMsIDU0LCA1NSwgNTYsIDU3LCA1OCwgNTksIDYwLCA2MSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5LCAyMCwgMjEsIDIyLCAyMywgMjQsIDI1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAyNiwgMjcsIDI4LCAyOSwgMzAsIDMxLCAzMiwgMzMsIDM0LCAzNSwgMzYsIDM3LCAzOCwgMzksIDQwLCA0MSwgNDIsIDQzLCA0NCwgNDUsIDQ2LCA0NywgNDgsIDQ5LCA1MCwgNTEsIC0xLCAtMSwgLTEsIC0xLCAtMSk7XG5mdW5jdGlvbiBiYXNlNjRlbmNvZGUoc3RyKSB7XG4gICAgdmFyIG91dCwgaSwgbGVuO1xuICAgIHZhciBjMSwgYzIsIGMzO1xuICAgIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaSA9IDA7XG4gICAgb3V0ID0gXCJcIjtcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICBjMSA9IHN0ci5jaGFyQ29kZUF0KGkrKykgJiAweGZmO1xuICAgICAgICBpZiAoaSA9PSBsZW4pIHtcbiAgICAgICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoYzEgPj4gMik7XG4gICAgICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KChjMSAmIDB4MykgPDwgNCk7XG4gICAgICAgICAgICBvdXQgKz0gXCI9PVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYzIgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBpZiAoaSA9PSBsZW4pIHtcbiAgICAgICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoYzEgPj4gMik7XG4gICAgICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KChjMSAmIDB4MykgPDwgNCB8IChjMiAmIDB4RjApID4+IDQpO1xuICAgICAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdCgoYzIgJiAweEYpIDw8IDIpO1xuICAgICAgICAgICAgb3V0ICs9IFwiPVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYzMgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KGMxID4+IDIpO1xuICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KChjMSAmIDB4MykgPDwgNCB8IChjMiAmIDB4RjApID4+IDQpO1xuICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KChjMiAmIDB4RikgPDwgMiB8IChjMyAmIDB4QzApID4+IDYpO1xuICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KGMzICYgMHgzRik7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5mdW5jdGlvbiBiYXNlNjRkZWNvZGUoc3RyKSB7XG4gICAgdmFyIGMxLCBjMiwgYzMsIGM0O1xuICAgIHZhciBpLCBsZW4sIG91dDtcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGkgPSAwO1xuICAgIG91dCA9IFwiXCI7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYzEgPSBiYXNlNjREZWNvZGVDaGFyc1tzdHIuY2hhckNvZGVBdChpKyspICYgMHhmZl07XG4gICAgICAgIH0gd2hpbGUgKGkgPCBsZW4gJiYgYzEgPT0gLTEpO1xuICAgICAgICBpZiAoYzEgPT0gLTEpIGJyZWFrO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjMiA9IGJhc2U2NERlY29kZUNoYXJzW3N0ci5jaGFyQ29kZUF0KGkrKykgJiAweGZmXTtcbiAgICAgICAgfSB3aGlsZSAoaSA8IGxlbiAmJiBjMiA9PSAtMSk7XG4gICAgICAgIGlmIChjMiA9PSAtMSkgYnJlYWs7XG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxIDw8IDIgfCAoYzIgJiAweDMwKSA+PiA0KTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYzMgPSBzdHIuY2hhckNvZGVBdChpKyspICYgMHhmZjtcbiAgICAgICAgICAgIGlmIChjMyA9PSA2MSkgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIGMzID0gYmFzZTY0RGVjb2RlQ2hhcnNbYzNdO1xuICAgICAgICB9IHdoaWxlIChpIDwgbGVuICYmIGMzID09IC0xKTtcbiAgICAgICAgaWYgKGMzID09IC0xKSBicmVhaztcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMyICYgMFhGKSA8PCA0IHwgKGMzICYgMHgzQykgPj4gMik7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGM0ID0gc3RyLmNoYXJDb2RlQXQoaSsrKSAmIDB4ZmY7XG4gICAgICAgICAgICBpZiAoYzQgPT0gNjEpIHJldHVybiBvdXQ7XG4gICAgICAgICAgICBjNCA9IGJhc2U2NERlY29kZUNoYXJzW2M0XTtcbiAgICAgICAgfSB3aGlsZSAoaSA8IGxlbiAmJiBjNCA9PSAtMSk7XG4gICAgICAgIGlmIChjNCA9PSAtMSkgYnJlYWs7XG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChjMyAmIDB4MDMpIDw8IDYgfCBjNCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5mdW5jdGlvbiBsb25nMnN0cih2LCB3KSB7XG4gICAgdmFyIHZsID0gdi5sZW5ndGg7XG4gICAgdmFyIHNsID0gdlt2bCAtIDFdICYgMHhmZmZmZmZmZjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZsOyBpKyspIHtcbiAgICAgICAgdltpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodltpXSAmIDB4ZmYsIHZbaV0gPj4+IDggJiAweGZmLCB2W2ldID4+PiAxNiAmIDB4ZmYsIHZbaV0gPj4+IDI0ICYgMHhmZik7XG4gICAgfVxuICAgIGlmICh3KSB7XG4gICAgICAgIHJldHVybiB2LmpvaW4oJycpLnN1YnN0cmluZygwLCBzbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHYuam9pbignJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3RyMmxvbmcocywgdykge1xuICAgIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgICB2YXIgdiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICAgICAgdltpID4+IDJdID0gcy5jaGFyQ29kZUF0KGkpIHwgcy5jaGFyQ29kZUF0KGkgKyAxKSA8PCA4IHwgcy5jaGFyQ29kZUF0KGkgKyAyKSA8PCAxNiB8IHMuY2hhckNvZGVBdChpICsgMykgPDwgMjQ7XG4gICAgfVxuICAgIGlmICh3KSB7XG4gICAgICAgIHZbdi5sZW5ndGhdID0gbGVuO1xuICAgIH1cbiAgICByZXR1cm4gdjtcbn1cbmZ1bmN0aW9uIHh4dGVhX2VuY3J5cHQoc3RyLCBrZXkpIHtcbiAgICBpZiAoc3RyID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHZhciB2ID0gc3RyMmxvbmcoc3RyLCB0cnVlKTtcbiAgICB2YXIgayA9IHN0cjJsb25nKGtleSwgZmFsc2UpO1xuICAgIHZhciBuID0gdi5sZW5ndGggLSAxO1xuICAgIHZhciB6ID0gdltuXSxcbiAgICAgICAgeSA9IHZbMF0sXG4gICAgICAgIGRlbHRhID0gMHg5RTM3NzlCOTtcbiAgICB2YXIgbXgsXG4gICAgICAgIGUsXG4gICAgICAgIHEgPSBNYXRoLmZsb29yKDYgKyA1MiAvIChuICsgMSkpLFxuICAgICAgICBzdW0gPSAwO1xuICAgIHdoaWxlIChxLS0gPiAwKSB7XG4gICAgICAgIHN1bSA9IHN1bSArIGRlbHRhICYgMHhmZmZmZmZmZjtcbiAgICAgICAgZSA9IHN1bSA+Pj4gMiAmIDM7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbjsgcCsrKSB7XG4gICAgICAgICAgICB5ID0gdltwICsgMV07XG4gICAgICAgICAgICBteCA9ICh6ID4+PiA1IF4geSA8PCAyKSArICh5ID4+PiAzIF4geiA8PCA0KSBeIChzdW0gXiB5KSArIChrW3AgJiAzIF4gZV0gXiB6KTtcbiAgICAgICAgICAgIHogPSB2W3BdID0gdltwXSArIG14ICYgMHhmZmZmZmZmZjtcbiAgICAgICAgfVxuICAgICAgICB5ID0gdlswXTtcbiAgICAgICAgbXggPSAoeiA+Pj4gNSBeIHkgPDwgMikgKyAoeSA+Pj4gMyBeIHogPDwgNCkgXiAoc3VtIF4geSkgKyAoa1twICYgMyBeIGVdIF4geik7XG4gICAgICAgIHogPSB2W25dID0gdltuXSArIG14ICYgMHhmZmZmZmZmZjtcbiAgICB9XG4gICAgcmV0dXJuIGxvbmcyc3RyKHYsIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIHh4dGVhX2RlY3J5cHQoc3RyLCBrZXkpIHtcbiAgICBpZiAoc3RyID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHZhciB2ID0gc3RyMmxvbmcoc3RyLCBmYWxzZSk7XG4gICAgdmFyIGsgPSBzdHIybG9uZyhrZXksIGZhbHNlKTtcbiAgICB2YXIgbiA9IHYubGVuZ3RoIC0gMTtcbiAgICB2YXIgeiA9IHZbbiAtIDFdLFxuICAgICAgICB5ID0gdlswXSxcbiAgICAgICAgZGVsdGEgPSAweDlFMzc3OUI5O1xuICAgIHZhciBteCxcbiAgICAgICAgZSxcbiAgICAgICAgcSA9IE1hdGguZmxvb3IoNiArIDUyIC8gKG4gKyAxKSksXG4gICAgICAgIHN1bSA9IHEgKiBkZWx0YSAmIDB4ZmZmZmZmZmY7XG4gICAgd2hpbGUgKHN1bSAhPSAwKSB7XG4gICAgICAgIGUgPSBzdW0gPj4+IDIgJiAzO1xuICAgICAgICBmb3IgKHZhciBwID0gbjsgcCA+IDA7IHAtLSkge1xuICAgICAgICAgICAgeiA9IHZbcCAtIDFdO1xuICAgICAgICAgICAgbXggPSAoeiA+Pj4gNSBeIHkgPDwgMikgKyAoeSA+Pj4gMyBeIHogPDwgNCkgXiAoc3VtIF4geSkgKyAoa1twICYgMyBeIGVdIF4geik7XG4gICAgICAgICAgICB5ID0gdltwXSA9IHZbcF0gLSBteCAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIH1cbiAgICAgICAgeiA9IHZbbl07XG4gICAgICAgIG14ID0gKHogPj4+IDUgXiB5IDw8IDIpICsgKHkgPj4+IDMgXiB6IDw8IDQpIF4gKHN1bSBeIHkpICsgKGtbcCAmIDMgXiBlXSBeIHopO1xuICAgICAgICB5ID0gdlswXSA9IHZbMF0gLSBteCAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIHN1bSA9IHN1bSAtIGRlbHRhICYgMHhmZmZmZmZmZjtcbiAgICB9XG4gICAgcmV0dXJuIGxvbmcyc3RyKHYsIHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB1dGYxNnRvODogdXRmMTZ0bzgsXG4gICAgdXRmOHRvMTY6IHV0Zjh0bzE2LFxuICAgIGJhc2U2NGVuY29kZTogYmFzZTY0ZW5jb2RlLFxuICAgIGJhc2U2NGRlY29kZTogYmFzZTY0ZGVjb2RlLFxuICAgIGVuY3J5cHQ6IHh4dGVhX2VuY3J5cHQsXG4gICAgZGVjcnlwdDogeHh0ZWFfZGVjcnlwdFxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y2ZWEzbStYREJDTWI1QWEwN3VqUEE2JywgJ3poJyk7XG4vLyBzY3JpcHRcXGkxOG5cXGRhdGFcXHpoLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwiR1dfR0FNRVwiOiBcIuebluS7mOmAmua4uOaIj1wiLFxuICAgIFwiY2hlY2tpbmdfdXBkYXRlXCI6IFwi5q2j5Zyo5qOA5p+l5pu05pawXCIsXG4gICAgXCJ1cGRhdGluZ19hc3NldHNcIjogXCLmraPlnKjmm7TmlrDotYTmupBcIixcbiAgICBcImxvYWRpbmdfYXNzZXRzXCI6IFwi5q2j5Zyo5Yqg6L296LWE5rqQ77yM5LiN55So5rWB6YeP5ZaU77yBXCIsXG4gICAgXCJpbml0dGluZ19nYW1lXCI6IFwi5q2j5Zyo5Yid5aeL5YyW5ri45oiPXCIsXG4gICAgXCJlbnRlcmluZ19nYW1lXCI6IFwi5q2j5Zyo6L+b5YWl5ri45oiPXCIsXG4gICAgXCJ1cGRhdGVfcGVyY2VudFwiOiBcIuabtOaWsOi/m+W6pu+8mlwiLFxuICAgIFwiY29uZmlybV91cGRhdGVcIjogXCLlj5HnjrDlnKjmlrDniYjmnKzvvIzkvaDpnIDopoHmm7TmlrDmiY3og73nu6fnu63muLjmiI9cIixcbiAgICBcInN0YXJ0X3VwZGF0ZVwiOiBcIuabtOaWsFwiLFxuICAgIFwiZXhpdF9nYW1lXCI6IFwi6YCA5Ye6XCIsXG4gICAgXCJyZXRyeV91cGRhdGVcIjogXCLph43or5VcIixcbiAgICBcImZhaWxfdXBkYXRlXCI6IFwi5pu05paw5aSx6LSl77yM6K+36YeN6K+VXCIsXG4gICAgXCJhY2NvdW50X25vdF9lbXB0eVwiOiBcIuW4kOWPt+S4jeiDveS4uuepulwiLFxuICAgIFwicGFzc3dkX25vdF9lbXB0eVwiOiBcIuWvhueggeS4jeiDveS4uuepulwiLFxuICAgIFwiZXhjaGFuZ2VfZm9ybWF0XCI6IFwiJWTnp6/liIY9JWTph5HluIFcIixcbiAgICBcIm93bl9wb2ludF9mb3JtYXRcIjogXCLnp6/liIbvvJolZFwiLFxuICAgIFwiY29uZmlybV9leGNoYW5nZV9jb2luXCI6IFwi56Gu5a6a5L2/55SoJWTnp6/liIblhZHmjaIlZOmHkeW4geWQl++8n1wiXG59O1xuXG5jYy5fUkZwb3AoKTsiXX0=
