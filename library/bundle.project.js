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
                    //cc.log('abc');
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

var defaultRetryCount = 3;

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
        this._retryCount = defaultRetryCount;

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
        this._reliveHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_TIME_TO_PLAY, this.onRetryGame.bind(this));
        this._returnHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_RETURN_GAME, this.onReturnEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._reliveHandler);
        Global.gameEventDispatcher.removeEventHandler(this._returnHandler);
        this._reliveHandler = null;
        this._returnHandler = null;

        cc.audioEngine.stopMusic(true);

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
        this._retryCount--;
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
        this._retryCount = defaultRetryCount;
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
                this._uiManager.openUI('mission_fail', { retryCount: this._retryCount });
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

        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        this._exchangeHandler = null;
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

    onExchangeSuccess: function onExchangeSuccess(event) {
        this._uiCtrl.close();
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
                    GameRpc.Clt2Srv.exchangeGold(coin);
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
},{}],"exit_confirm_dialog":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd1e26DmA05JhLV/WuDVuNiE', 'exit_confirm_dialog');
// script\common\exit_confirm_dialog.js

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

    onOkButtonClick: function onOkButtonClick() {
        cc.director.end();
    },

    onCancelButtonClick: function onCancelButtonClick() {
        this.node.destroy();
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"float_message_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '94706li1Z9MWYDVJpMcxIVC', 'float_message_ctrl');
// script\ui\float_message_ctrl.js

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
        floatMessageContainer: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._messageHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_FLOAT_MESSAGE, this.onMessage.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._messageHandler);
        this._messageHandler = null;
    },

    onMessage: function onMessage(eventType, message) {
        cc.log(message);
        var node = new cc.Node();

        var label = node.addComponent(cc.Label);
        label.string = message;

        var action = new cc.Sequence(new cc.Spawn(new cc.MoveBy(1, new cc.Vec2(0, 100)), new cc.FadeOut(1)), new cc.CallFunc(function () {
            node.destroy();
        }));

        node.parent = this.floatMessageContainer;
        node.runAction(action);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

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

        this._startHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_START_GAME, this.onStartGame.bind(this));
        this._getGameDataHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GET_GAME_DATA, this.onGetGameData.bind(this));
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeCoin.bind(this));
        this._buyPhysicalHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_PHYSICAL, this.onBuyFullPhysical.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._startHandler);
        Global.gameEventDispatcher.removeEventHandler(this._getGameDataHandler);
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        Global.gameEventDispatcher.removeEventHandler(this._buyPhysicalHandler);
        this._buyPhysicalHandler = null;
        this._getGameDataHandler = null;
        this._exchangeHandler = null;
        this._startHandler = null;
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
        this._uiManager.openUI('exchange_coin');
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

    onBuyFullPhysical: function onBuyFullPhysical() {
        this.coinLabel.string = Global.accountModule.goldNum;
        this._physical = Global.accountModule.power;
        this.updatePhysical();
        this.resetCountDown();
    },

    onExchangeCoin: function onExchangeCoin() {
        this.coinLabel.string = Global.accountModule.goldNum;
    },

    onGetGameData: function onGetGameData() {
        this.coinLabel.string = Global.accountModule.goldNum;
        this._physical = Global.accountModule.power;
        this.updatePhysical();
        this.resetCountDown();
    },

    onStartGame: function onStartGame() {
        GameUtil.loadScene('battle');
    },

    onPlayButtonClick: function onPlayButtonClick() {
        if (this.costPhysical()) {
            this.stopCountDown();
            GameRpc.Clt2Srv.startGame();
        } else {
            this._uiManager.openUI('physical_not_enough');
        }
    },

    onRegisteButtonClick: function onRegisteButtonClick() {
        if (cc.sys.isMobile) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                var className = "org/cocos2dx/javascript/AppActivity";
                var methodName = "quickRegister";
                var methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            }
        }
    },

    onForgetButtonClick: function onForgetButtonClick() {
        if (cc.sys.isMobile) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                var className = "org/cocos2dx/javascript/AppActivity";
                var methodName = "quickRegister";
                var methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            }
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
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, GameLang.t('exchange_success'));
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
            Global.gameEventDispatcher.emit(GameEvent.ON_FLOAT_MESSAGE, GameLang.t('buy_physical_success'));
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
        cc.log('buyTimeToPlayGame', times);
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
        returnButton: cc.Node,
        retryCoinLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = 3 - this._uiCtrl.args.retryCount;
        if (this._retryCount >= 3) {
            this.retryButton.active = false;
            this.returnButton.x = 0;
        } else {
            var needCoin = timesMapCoin[this._retryCount];
            this.retryCoinLabel.string = needCoin;
        }
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
        this._continueHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_TIME_TO_PLAY, this.onContinueGame.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        Global.gameEventDispatcher.removeEventHandler(this._continueHandler);
        this._exchangeHandler = null;
        this._continueHandler = null;
    },

    onExchangeSuccess: function onExchangeSuccess() {
        var needCoin = timesMapCoin[this._retryCount];
        if (Global.accountModule.goldNum >= needCoin) {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },

    onContinueGame: function onContinueGame() {
        this._uiCtrl.close();
    },

    onRetryButtonClick: function onRetryButtonClick() {
        var needCoin = timesMapCoin[this._retryCount];
        var ownCoin = Global.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
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
},{"actor_ctrl":"actor_ctrl","actor_define":"actor_define"}],"native_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2a922/tKEFFQJGO6q5WyWYO', 'native_ctrl');
// script\scene\native_ctrl.js

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
        exitDialog: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        var listener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                cc.log('keyDown: ' + keyCode);
            },

            onKeyReleased: function onKeyReleased(keyCode, event) {
                if (keyCode == cc.KEY.back || keyCode == cc.KEY.escape) {
                    self.showExitDialog();
                }
            }
        };
        // 绑定键盘事件
        cc.eventManager.addListener(listener, this.node);
    },

    showExitDialog: function showExitDialog() {
        this.removeExitDialog();
        var dialog = cc.instantiate(this.exitDialog);
        this.node.addChild(dialog);
        this._exitDialog = dialog;
    },

    removeExitDialog: function removeExitDialog() {
        if (this._exitDialog) {
            this._exitDialog.removeFromParent();
            this._exitDialog.destroy();
            this._exitDialog = null;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"network_ctrl":[function(require,module,exports){
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
            //this._loadingPanel.destroy();
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
            this._uiCtrl.close();
            GameRpc.Clt2Srv.buyFullPhysical();
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
    "confirm_exchange_coin": "确定使用%d积分兑换%d金币吗？",
    "exchange_success": "兑换成功",
    "buy_physical_success": "购买体力成功"
};

cc._RFpop();
},{}]},{},["player_ctrl","account_module","test_map","game_net","time_util","map_ctrl","game_ctrl","hurdle_define","native_ctrl","buffer_table","control_define","exchange_coin","skill_define","skill_provider","joy_ctrl","round_ctrl","ui_manager","game_util","login_module","xxtea","init_config","login_ctrl","game_event_dispatcher","http_util","loading_ctrl","init_module","attack_ctrl","LabelLocalized","actor_ctrl","network_ctrl","float_message_ctrl","model_panel","physical_point","state_ctrl","i18n","http_connection","game_event","hurdle_provider","game_rpc","sync_timer","message_box","hurdle_cfg","polyglot","mission_fail","exit_confirm_dialog","battle_ctrl","ui_ctrl","en","physical_not_enough","monster_ctrl","main","skill_cfg","boot_ctrl","network_error","zh","game_protocol","coin_not_enough","actor_define"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvcjEyMS9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9MYWJlbExvY2FsaXplZC5qcyIsImFzc2V0cy9zY3JpcHQvbW9kdWxlL2FjY291bnRfbW9kdWxlLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9kZWZpbmUuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9hdHRhY2tfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2JhdHRsZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9ib290X2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3V0aWwvYnVmZmVyX3RhYmxlLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9jb2luX25vdF9lbm91Z2guanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9jb250cm9sX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9kYXRhL2VuLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9leGNoYW5nZV9jb2luLmpzIiwiYXNzZXRzL3NjcmlwdC9jb21tb24vZXhpdF9jb25maXJtX2RpYWxvZy5qcyIsImFzc2V0cy9zY3JpcHQvdWkvZmxvYXRfbWVzc2FnZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9nYW1lX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2V2ZW50L2dhbWVfZXZlbnRfZGlzcGF0Y2hlci5qcyIsImFzc2V0cy9zY3JpcHQvZXZlbnQvZ2FtZV9ldmVudC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX25ldC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX3Byb3RvY29sLmpzIiwiYXNzZXRzL3NjcmlwdC9uZXR3b3JrL2dhbWVfcnBjLmpzIiwiYXNzZXRzL3NjcmlwdC91dGlsL2dhbWVfdXRpbC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9jb25uZWN0aW9uL2h0dHBfY29ubmVjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHQvbGliL3V0aWwvaHR0cF91dGlsLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvZGF0YS9odXJkbGVfY2ZnLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9iYXR0bGUvaHVyZGxlX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvY29uZmlnL3Byb3ZpZGVyL2h1cmRsZV9wcm92aWRlci5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9pMThuLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvaW5pdF9jb25maWcuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9pbml0X21vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2pveV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9sb2FkaW5nX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2xvZ2luX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9sb2dpbl9tb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0L21haW4uanMiLCJhc3NldHMvc2NyaXB0L21hcC9tYXBfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvbWVzc2FnZV9ib3guanMiLCJhc3NldHMvc2NyaXB0L3VpL3Jlc3VsdC9taXNzaW9uX2ZhaWwuanMiLCJhc3NldHMvc2NyaXB0L3VpL2NvbXBvbmVudC9tb2RlbF9wYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvYWN0b3IvbW9uc3Rlcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9uYXRpdmVfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvbmV0d29ya19jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9jb21tb24vbmV0d29ya19lcnJvci5qcyIsImFzc2V0cy9zY3JpcHQvdWkvcGh5c2ljYWxfbm90X2Vub3VnaC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvY29tcG9uZW50L3BoeXNpY2FsX3BvaW50LmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9wbGF5ZXJfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9wb2x5Z2xvdC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL3JvdW5kX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2NvbmZpZy9kYXRhL3NraWxsX2NmZy5qcyIsImFzc2V0cy9zY3JpcHQvYWN0b3Ivc2tpbGxfZGVmaW5lLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvcHJvdmlkZXIvc2tpbGxfcHJvdmlkZXIuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9zdGF0ZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC90aW1lci9zeW5jX3RpbWVyLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS90ZXN0X21hcC5qcyIsImFzc2V0cy9zY3JpcHQvdXRpbC90aW1lX3V0aWwuanMiLCJhc3NldHMvc2NyaXB0L3VpL3VpX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3VpL3VpX21hbmFnZXIuanMiLCJhc3NldHMvc2NyaXB0L2xpYi90aGlyZC94eHRlYS94eHRlYS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9kYXRhL3poLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDclJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODYzMzFwMFhEWkZqYmhOTmwvMWNRaGonLCAnTGFiZWxMb2NhbGl6ZWQnKTtcbi8vIHNjcmlwdFxcaTE4blxcTGFiZWxMb2NhbGl6ZWQuanNcblxudmFyIGkxOG4gPSByZXF1aXJlKCdpMThuJyk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5MYWJlbCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGV4dEtleToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAnVEVYVF9LRVknLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogJ0VudGVyIGkxOG4ga2V5IGhlcmUnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NnTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZ05vZGUuc2V0U3RyaW5nKHRoaXMuc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTm9kZVNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiAnSGVyZSBzaG93cyB0aGUgbG9jYWxpemVkIHN0cmluZyBvZiBUZXh0IEtleScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTE4bi50KHRoaXMudGV4dEtleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdQbGVhc2Ugc2V0IGxhYmVsIHRleHQga2V5IGluIFRleHQgS2V5IHByb3BlcnR5LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwZGQ0N2M4aVAxSVRhaVJDbk9DNTYzQScsICdhY2NvdW50X21vZHVsZScpO1xuLy8gc2NyaXB0XFxtb2R1bGVcXGFjY291bnRfbW9kdWxlLmpzXG5cbm1vZHVsZS5leHBvcnRzWydjbGFzcyddID0gY2MuQ2xhc3Moe1xuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc1ZpcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmlwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAndHJ1ZScgfHwgQm9vbGVhbih2YWx1ZSkpKSB0aGlzLl9pc1ZpcCA9IHRydWU7ZWxzZSB0aGlzLl9pc1ZpcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvbGROdW06IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nb2xkTnVtO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9nb2xkTnVtID0gcGFyc2VJbnQodmFsdWUpIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2NvcmVOdW06IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY29yZU51bTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NvcmVOdW0gPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBuaWNrTmFtZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25pY2tOYW1lO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uaWNrTmFtZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmlyc3RMb2dpbjoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRmlyc3RMb2dpbjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB2YWx1ZSA9PT0gJ3RydWUnIHx8IEJvb2xlYW4odmFsdWUpKSkgdGhpcy5faXNGaXJzdExvZ2luID0gdHJ1ZTtlbHNlIHRoaXMuX2lzRmlyc3RMb2dpbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1heFNjb3JlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4U2NvcmU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heFNjb3JlID0gcGFyc2VJbnQodmFsdWUpIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG93ZXI6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3dlcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG93ZXIgPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UG93ZXJUaW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0UG93ZXJUaW1lID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogdGhpcy5kZWZhdWx0TmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBleGNoYW5nZVJhdGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGNoYW5nZVJhdGU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4Y2hhbmdlUmF0ZSA9IHBhcnNlRmxvYXQodmFsdWUpIHx8IHRoaXMuZGVmYXVsdEV4Y2hhbmdlUmF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWZhdWx0TmV4dFBvd2VyVGltZTogMzAwLFxuICAgICAgICBkZWZhdWx0RXhjaGFuZ2VSYXRlOiAxMFxuICAgIH0sXG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgdGhpcy5fbmlja05hbWUgPSAnJztcbiAgICAgICAgdGhpcy5pc0ZpcnN0TG9naW4gPSB0cnVlO1xuICAgICAgICB0aGlzLl9pc1ZpcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9nb2xkTnVtID0gMDtcbiAgICAgICAgdGhpcy5fc2NvcmVOdW0gPSAwO1xuICAgICAgICB0aGlzLl9tYXhTY29yZSA9IDA7XG4gICAgICAgIHRoaXMuX3Bvd2VyID0gMDtcbiAgICAgICAgdGhpcy5fbmV4dFBvd2VyVGltZSA9IHRoaXMuZGVmYXVsdE5leHRQb3dlclRpbWU7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlUmF0ZSA9IHRoaXMuZGVmYXVsdEV4Y2hhbmdlUmF0ZTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTAzN2FDeHU3OURVNHMvOEJXVFpVd3QnLCAnYWN0b3JfY3RybCcpO1xuLy8gc2NyaXB0XFxhY3RvclxcYWN0b3JfY3RybC5qc1xuXG52YXIgU2tpbGxEZWZpbmUgPSByZXF1aXJlKFwic2tpbGxfZGVmaW5lXCIpO1xudmFyIEFjdG9yRGVmaW5lID0gcmVxdWlyZShcImFjdG9yX2RlZmluZVwiKTtcbnZhciBBY3RvckRpcmVjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yRGlyZWN0aW9uO1xudmFyIEFjdG9yQWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JBY3Rpb247XG52YXIgQWN0aW9uTmFtZSA9IEFjdG9yRGVmaW5lLkFjdGlvbk5hbWU7XG52YXIgQWN0aW9uQ2xpcEluZGV4ID0gQWN0b3JEZWZpbmUuQWN0aW9uQ2xpcEluZGV4O1xudmFyIEFjdGlvbkNvbXBsZXRlVHlwZSA9IEFjdG9yRGVmaW5lLkFjdGlvbkNvbXBsZXRlVHlwZTtcbnZhciBUaW1lUG9pbnRBY3RUeXBlID0gU2tpbGxEZWZpbmUuVGltZVBvaW50QWN0VHlwZTtcbnZhciBBdHRhY2tUeXBlID0gU2tpbGxEZWZpbmUuQXR0YWNrVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1vdmVTcGVlZDogbmV3IGNjLlZlYzIoMCwgMCksXG5cbiAgICAgICAgbG9naWNNYW5hZ2VyOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChtYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9naWNNYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2dpY01hbmFnZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLmFkZEVuaXR5KHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJtb2RlbFwiKTtcbiAgICAgICAgdGhpcy5fbW9kZWxBbmltYXRpb24gPSB0aGlzLl9tb2RlbC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5fYm9keSA9IHRoaXMuX21vZGVsLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKTtcbiAgICAgICAgdmFyIGJveCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQm94Q29sbGlkZXIpO1xuICAgICAgICB0aGlzLl9ib3ggPSBuZXcgY2MuUmVjdChib3gub2Zmc2V0LnggLSBib3guc2l6ZS53aWR0aCAvIDIsIGJveC5vZmZzZXQueSAtIGJveC5zaXplLmhlaWdodCAvIDIsIGJveC5zaXplLndpZHRoLCBib3guc2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fY3VyckFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuXG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25lZWRTdG9wUG9zdHVyZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdHRhY2tFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuXG4gICAgICAgIHRoaXMuX25lZWRSZWxpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgLy8g5Y+X5Ye757uT5LqL5pe26Ze077yI5Y2z5Y+X5Ye756Gs55u077yJXG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlgJLlnLDnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fY29sbGFwc2VFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDotbfouqvnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZSA9IDEwMDtcbiAgICAgICAgdGhpcy5fcmVtYWluQ29tYm9WYWx1ZSA9IHRoaXMuX2RlZmF1bHRDb21ib1ZhbHVlO1xuXG4gICAgICAgIHRoaXMuX2hwTWF4ID0gMTAwMDtcbiAgICAgICAgdGhpcy5faHAgPSAxMDAwO1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLklETEUsIEFjdG9yRGlyZWN0aW9uLlJJR0hUKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCA9IHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueCA9IHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnggPSB0aGlzLl9mbG9hdFNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuXG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25lZWRTdG9wUG9zdHVyZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdHRhY2tFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnNwbGljZSgwLCB0aGlzLl9za2lsbFRpbWVTdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fY3VyclBvc3R1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXNbaV0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9jdXJyTW92ZVNwZWVkLnggPSB0aGlzLl9jdXJyTW92ZVNwZWVkLnkgPSAwO1xuXG4gICAgICAgIHRoaXMuX25lZWRSZWxpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgLy8g5Y+X5Ye757uT5LqL5pe26Ze077yI5Y2z5Y+X5Ye756Gs55u077yJXG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlgJLlnLDnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fY29sbGFwc2VFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDotbfouqvnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZW1haW5Db21ib1ZhbHVlID0gdGhpcy5fZGVmYXVsdENvbWJvVmFsdWU7XG5cbiAgICAgICAgdGhpcy5faHAgPSB0aGlzLl9ocE1heDtcblxuICAgICAgICB0aGlzLl9tb2RlbC55ID0gMDtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSURMRSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgYm9ybjogZnVuY3Rpb24gYm9ybigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9ib3JuRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuX21vZGVsQW5pbWF0aW9uLmdldENsaXBzKClbQWN0aW9uQ2xpcEluZGV4LkJPUk5dLmR1cmF0aW9uO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5CT1JOLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBzZXRBY3RvclBvc2l0aW9uOiBmdW5jdGlvbiBzZXRBY3RvclBvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy5ub2RlLnggPSB4O1xuICAgICAgICB0aGlzLm5vZGUueSA9IHk7XG4gICAgfSxcblxuICAgIHNldERpcmVjdGlvbjogZnVuY3Rpb24gc2V0RGlyZWN0aW9uKGRpcikge1xuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09PSBkaXIgfHwgZGlyICE9IEFjdG9yRGlyZWN0aW9uLkxFRlQgJiYgZGlyICE9IEFjdG9yRGlyZWN0aW9uLlJJR0hUKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcjtcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlWCA9IGRpcjtcbiAgICB9LFxuXG4gICAgZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBnZXREaXJlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIHNldEFjdGlvbjogZnVuY3Rpb24gc2V0QWN0aW9uKGFjdGlvbiwgZGlyLCBwYXJhbSwgdGltZSkge1xuICAgICAgICB2YXIgYWN0aW9uTmFtZSA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLkFUVEFDSzpcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lID0gQWN0aW9uTmFtZVthY3Rpb25dICsgcGFyYW07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWUgPSBBY3Rpb25OYW1lW2FjdGlvbl07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VyckFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgdGhpcy5fbW9kZWxBbmltYXRpb24ucGxheShhY3Rpb25OYW1lKTtcbiAgICAgICAgaWYgKCF0aW1lIHx8IHRpbWUgPT09IDApIHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpICsgdGhpcy5fbW9kZWxBbmltYXRpb24uY3VycmVudENsaXAuZHVyYXRpb247ZWxzZSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWU7XG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpcik7XG4gICAgfSxcblxuICAgIHNldEhwOiBmdW5jdGlvbiBzZXRIcCh2YWx1ZSwgbWF4KSB7XG4gICAgICAgIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMDtcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkgdmFsdWUgPSAxO1xuICAgICAgICB0aGlzLl9ocE1heCA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9ocCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBnZXRIcDogZnVuY3Rpb24gZ2V0SHAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ocDtcbiAgICB9LFxuXG4gICAgZ2V0Q29sbGlzaW9uOiBmdW5jdGlvbiBnZXRDb2xsaXNpb24oKSB7XG4gICAgICAgIHZhciB4ZmYgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShuZXcgY2MuVmVjMigwLCAwKSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShuZXcgY2MuVmVjMih0aGlzLl9ib3gueCwgdGhpcy5fYm94LnkpKTtcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PSBBY3RvckRpcmVjdGlvbi5MRUZUKSBvZmZzZXQueCAtPSB0aGlzLl9ib3gud2lkdGg7XG4gICAgICAgIHJldHVybiBuZXcgY2MuUmVjdChvZmZzZXQueCwgb2Zmc2V0LnksIHRoaXMuX2JveC53aWR0aCwgdGhpcy5fYm94LmhlaWdodCk7XG4gICAgfSxcblxuICAgIGlzRGVhZDogZnVuY3Rpb24gaXNEZWFkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEZWFkO1xuICAgIH0sXG5cbiAgICByZWxpdmU6IGZ1bmN0aW9uIHJlbGl2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX25lZWRSZWxpdmUgfHwgIXRoaXMuX2lzRGVhZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9uZWVkUmVsaXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgc3RhcnRSZWxpdmU6IGZ1bmN0aW9uIHN0YXJ0UmVsaXZlKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JlbGl2ZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5SRUxJVkVdLmR1cmF0aW9uICsgMTtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uUkVMSVZFLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLnBsYXlSZWxpdmVFZmZlY3QoKTtcbiAgICB9LFxuXG4gICAgZW5kUmVsaXZlOiBmdW5jdGlvbiBlbmRSZWxpdmUoKSB7XG4gICAgICAgIHRoaXMuX2lzRGVhZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0SHVydDogZnVuY3Rpb24gc3RhcnRIdXJ0KHRpbWUsIGRpcikge1xuICAgICAgICB0aGlzLl9odXJ0RW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWU7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkhVUlQsIGRpcik7XG4gICAgfSxcblxuICAgIGVuZEh1cnQ6IGZ1bmN0aW9uIGVuZEh1cnQoKSB7XG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgc3RhcnRGbG9hdDogZnVuY3Rpb24gc3RhcnRGbG9hdCh0b3BUaW1lLCB0b3BIZWlnaHQsIGRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdGhpcy5fZmxvYXRUb3BUaW1lID0gdGhpcy5fZmxvYXRTdGFydFRpbWUgKyB0b3BUaW1lO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCA9IHRoaXMubm9kZS54O1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueSA9IHRoaXMuX21vZGVsLnk7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnggPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yID0gMiAqIHRvcEhlaWdodCAvICh0b3BUaW1lICogdG9wVGltZSk7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQueCA9IGRpc3RhbmNlIC8gKHRvcFRpbWUgKiAyKTtcbiAgICAgICAgdGhpcy5fZmxvYXRTcGVlZC55ID0gdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yICogdG9wVGltZTtcbiAgICB9LFxuXG4gICAgZW5kRmxvYXQ6IGZ1bmN0aW9uIGVuZEZsb2F0KCkge1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy54ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueCA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnggPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydENvbGxhcHNlOiBmdW5jdGlvbiBzdGFydENvbGxhcHNlKCkge1xuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5DT0xMQVBTRV0uZHVyYXRpb24gKyAxO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5DT0xMQVBTRSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZW5kQ29sbGFwc2U6IGZ1bmN0aW9uIGVuZENvbGxhcHNlKCkge1xuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydFJlY292ZXI6IGZ1bmN0aW9uIHN0YXJ0UmVjb3ZlcigpIHtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5SRUNPVkVSXS5kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uUkVDT1ZFUiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZW5kUmVjb3ZlcjogZnVuY3Rpb24gZW5kUmVjb3ZlcigpIHtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlY292ZXJFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcmVtYWluQ29tYm9WYWx1ZSA9IHRoaXMuX2RlZmF1bHRDb21ib1ZhbHVlO1xuICAgIH0sXG5cbiAgICBtb3ZlVG86IGZ1bmN0aW9uIG1vdmVUbyh4LCB5LCB0aW1lLCBkaXIpIHtcbiAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICB2YXIgc3BlZWRYID0gKHggLSB0aGlzLm5vZGUueCkgLyB0aW1lO1xuICAgICAgICB2YXIgc3BlZWRZID0gKHkgLSB0aGlzLm5vZGUueSkgLyB0aW1lO1xuICAgICAgICB0aGlzLnN0YXJ0TW92ZShzcGVlZFgsIHNwZWVkWSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnNldERpcmVjdGlvbihkaXIpO1xuICAgICAgICB0aGlzLl90YXJnZXRNb3ZlUG9zID0gbmV3IGNjLlZlYzIoeCwgeSk7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gdGhpcy5fbW92ZVN0YXJ0VGltZSArIHRpbWU7XG4gICAgfSxcblxuICAgIHN0YXJ0TW92ZTogZnVuY3Rpb24gc3RhcnRNb3ZlKHNwZWVkWCwgc3BlZWRZLCBpbml0aWF0aXZlKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYXRpdmVNb3ZlID0gaW5pdGlhdGl2ZTtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdGhpcy5fY3Vyck1vdmVTcGVlZC54ID0gc3BlZWRYO1xuICAgICAgICB0aGlzLl9jdXJyTW92ZVNwZWVkLnkgPSBzcGVlZFk7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5ub2RlLng7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy55ID0gdGhpcy5ub2RlLnk7XG4gICAgfSxcblxuICAgIHN0b3BNb3ZlOiBmdW5jdGlvbiBzdG9wTW92ZSgpIHtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQueCA9IHRoaXMuX2N1cnJNb3ZlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnkgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydEF0dGFjazogZnVuY3Rpb24gc3RhcnRBdHRhY2socG9zdHVyZUxpc3QsIHBvc3R1cmVDb3VudCwgZGlyKSB7XG4gICAgICAgIHRoaXMuc3RvcEF0dGFjaygpO1xuICAgICAgICB0aGlzLl9pc0F0dGFja2luZyA9IHRydWU7XG4gICAgICAgIGlmIChwb3N0dXJlQ291bnQgPiB0aGlzLl9jdXJyUG9zdHVyZXMubGVuZ3RoKSBwb3N0dXJlQ291bnQgPSB0aGlzLl9jdXJyUG9zdHVyZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvc3R1cmVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXNbaV0gPSBwb3N0dXJlTGlzdFtpXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUNvdW50ID0gcG9zdHVyZUNvdW50O1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5sYXVuY2hQb3N0dXJlKHBvc3R1cmVMaXN0WzBdLCBkaXIpO1xuICAgIH0sXG5cbiAgICBzdG9wQXR0YWNrOiBmdW5jdGlvbiBzdG9wQXR0YWNrKCkge1xuICAgICAgICB0aGlzLl9pc0F0dGFja2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJyZWFrUG9zdHVyZSgpO1xuICAgIH0sXG5cbiAgICBsYXVuY2hQb3N0dXJlOiBmdW5jdGlvbiBsYXVuY2hQb3N0dXJlKHBvc3R1cmUsIGRpcikge1xuICAgICAgICB0aGlzLmxhdW5jaFNraWxsVGltZUxpc3QocG9zdHVyZSk7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkFUVEFDSywgZGlyLCBwb3N0dXJlLmFjdGlvbkluZGV4LCBwb3N0dXJlLnRpbWUpO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUgPSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmUgPSBwb3N0dXJlO1xuICAgIH0sXG5cbiAgICBsYXVuY2hTa2lsbFRpbWVMaXN0OiBmdW5jdGlvbiBsYXVuY2hTa2lsbFRpbWVMaXN0KHBvc3R1cmUpIHtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnNwbGljZSgwLCB0aGlzLl9za2lsbFRpbWVTdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB2YXIgY291bnQgPSBwb3N0dXJlLnRpbWVQb2ludHMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0aW1lUG9pbnQgPSBwb3N0dXJlLnRpbWVQb2ludHNbaV07XG4gICAgICAgICAgICB2YXIgdGltZVN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHRpbWVQb2ludDogdGltZVBvaW50LFxuICAgICAgICAgICAgICAgIHRha2VFbmRUaW1lOiBjdXJyVGltZSArIHRpbWVQb2ludC50YWtlVGltZSxcbiAgICAgICAgICAgICAgICBwb3N0dXJlOiBwb3N0dXJlLFxuICAgICAgICAgICAgICAgIHRha2VkOiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX3NraWxsVGltZVN0YXRlcy5wdXNoKHRpbWVTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYnJlYWtQb3N0dXJlOiBmdW5jdGlvbiBicmVha1Bvc3R1cmUoKSB7XG4gICAgICAgIHRoaXMuX3NraWxsVGltZVN0YXRlcy5zcGxpY2UoMCwgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydERpc2FwcGVhcjogZnVuY3Rpb24gc3RhcnREaXNhcHBlYXIoKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkRJU0FQUEVBUiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0h1cnQ6IGZ1bmN0aW9uIHByb2Nlc3NIdXJ0KGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9odXJ0RW5kVGltZSkgdGhpcy5lbmRIdXJ0KCk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NGbG9hdDogZnVuY3Rpb24gcHJvY2Vzc0Zsb2F0KGN1cnJUaW1lKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fZmxvYXRTdGF0ZSkge1xuICAgICAgICAgICAgLy/kuIrljYfov4fnqItcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiAhPT0gQWN0b3JBY3Rpb24uSFVSVF9GTFkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSFVSVF9GTFksIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBjdXJyVGltZSAtIHRoaXMuX2Zsb2F0U3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9mbG9hdFRvcFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZUVsYXBhc2VkID0gdGhpcy5fZmxvYXRUb3BUaW1lIC0gdGhpcy5fZmxvYXRTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCArIHRpbWVFbGFwYXNlZCAqIHRoaXMuX2Zsb2F0U3BlZWQueDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ICsgdGhpcy5fZmxvYXRTcGVlZC55ICogdGltZUVsYXBhc2VkIC0gdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yICogdGltZUVsYXBhc2VkICogdGltZUVsYXBhc2VkIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5nZXRGaXhlZE1vdmVQb2ludCh0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnksIHgsIHRoaXMubm9kZS55KTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHJlc3VsdC5keDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC55ID0geTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ID0gcmVzdWx0LmR4O1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSB5O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL+S4i+iQvei/h+eoi1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5IVVJUX0ZBTEwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSFVSVF9GQUxMLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGltZUVsYXBhc2VkID0gY3VyclRpbWUgLSB0aGlzLl9mbG9hdFRvcFRpbWU7XG4gICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ICsgdGltZUVsYXBhc2VkICogdGhpcy5fZmxvYXRTcGVlZC54O1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueSAtIDMwMDAgKiAodGltZUVsYXBhc2VkICogdGltZUVsYXBhc2VkKSAvIDI7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNb3ZlUG9pbnQodGhpcy5ub2RlLngsIHRoaXMubm9kZS55LCB4LCB0aGlzLm5vZGUueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSByZXN1bHQuZHg7XG4gICAgICAgICAgICAgICAgaWYgKHkgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxvYXRTdGF0ZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC55ID0geTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy/nu5PmnZ9cbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEZsb2F0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwueSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvbGxhcHNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRBY3RvclBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NDb2xsYXBzZTogZnVuY3Rpb24gcHJvY2Vzc0NvbGxhcHNlKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jb2xsYXBzZUVuZFRpbWUpIHRoaXMuZW5kQ29sbGFwc2UoKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc1JlY292ZXI6IGZ1bmN0aW9uIHByb2Nlc3NSZWNvdmVyKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9yZWNvdmVyRW5kVGltZSkgdGhpcy5lbmRSZWNvdmVyKCk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NBdHRhY2s6IGZ1bmN0aW9uIHByb2Nlc3NBdHRhY2soY3VyclRpbWUpIHtcbiAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLl9jdXJyUG9zdHVyZTtcbiAgICAgICAgaWYgKHBvc3R1cmUpIHtcbiAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjdXJyVGltZSA+PSB0aGlzLl9hdHRhY2tFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4Kys7XG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFN0b3BQb3N0dXJlIHx8IHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPj0gdGhpcy5fY3VyclBvc3R1cmVDb3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEF0dGFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3N0dXJlID0gdGhpcy5fY3VyclBvc3R1cmVbdGhpcy5fY3VyclBvc3R1cmVJbmRleF07XG4gICAgICAgICAgICAgICAgdGhpcy5sYXVuY2hQb3N0dXJlKHBvc3R1cmUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcHJvY2Vzc01vdmU6IGZ1bmN0aW9uIHByb2Nlc3NNb3ZlKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5SVU4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLlJVTiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IGN1cnJUaW1lIC0gdGhpcy5fbW92ZVN0YXJ0VGltZTtcbiAgICAgICAgaWYgKHRoaXMuX21vdmVFbmRUaW1lID4gMCAmJiBjdXJyVGltZSA+PSB0aGlzLl9tb3ZlRW5kVGltZSkge1xuICAgICAgICAgICAgdGltZUVsYXBhc2VkID0gdGhpcy5fbW92ZUVuZFRpbWUgLSB0aGlzLl9tb3ZlU3RhcnRUaW1lO1xuICAgICAgICAgICAgcG9zLnggPSB0aGlzLl90YXJnZXRNb3ZlUG9zLng7XG4gICAgICAgICAgICBwb3MueSA9IHRoaXMuX3RhcmdldE1vdmVQb3MueTtcbiAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnggKyB0aW1lRWxhcGFzZWQgKiB0aGlzLl9jdXJyTW92ZVNwZWVkLng7XG4gICAgICAgICAgICBwb3MueSA9IHRoaXMuX21vdmVTdGFydFBvcy55ICsgdGltZUVsYXBhc2VkICogdGhpcy5fY3Vyck1vdmVTcGVlZC55O1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmdldEZpeGVkTW92ZVBvaW50KHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSwgcG9zLngsIHBvcy55KTtcbiAgICAgICAgdGhpcy5zZXRBY3RvclBvc2l0aW9uKHJlc3VsdC5keCwgcmVzdWx0LmR5KTtcbiAgICB9LFxuXG4gICAgLy8g5Yik5pat5b2T5YmN5Yqo5L2c5Y+v5ZCm5a6M5oiQ5oiW5Y+v5ZCm5omT5patXG4gICAgZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZTogZnVuY3Rpb24gZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZShjdXJyVGltZSkge1xuICAgICAgICBpZiAodGhpcy5fcmVsaXZlRW5kVGltZSA+IDAgfHwgdGhpcy5fYm9ybkVuZFRpbWUgPiAwIHx8IHRoaXMuX3JlY292ZXJFbmRUaW1lID4gMCB8fCB0aGlzLl9mbG9hdFN0YXJ0VGltZSA+IDAgfHwgdGhpcy5fY29sbGFwc2VFbmRUaW1lID4gMCB8fCB0aGlzLl9yZWNvdmVyRW5kVGltZSA+IDAgfHwgdGhpcy5faHVydEVuZFRpbWUgPiAwKSByZXR1cm4gQWN0aW9uQ29tcGxldGVUeXBlLlVOQ09NUExFVEFCTEU7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLl9jdXJyQWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLklETEU6XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLlJVTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZSkgcmV0dXJuIEFjdGlvbkNvbXBsZXRlVHlwZS5DT01QTEVUQUJMRTtlbHNlIHJldHVybiBBY3Rpb25Db21wbGV0ZVR5cGUuQlJFQUtBQkxFO1xuICAgIH0sXG5cbiAgICBuZXh0QWN0aW9uOiBmdW5jdGlvbiBuZXh0QWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIC8v5L+d5oyB56e75YqoXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VyckFjdGlvbiAhPT0gQWN0b3JBY3Rpb24uSURMRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLklETEUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgfSxcblxuICAgIGJyZWFrYWJsZTogZnVuY3Rpb24gYnJlYWthYmxlKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIG5lZWREaXNhcHBlYXI6IGZ1bmN0aW9uIG5lZWREaXNhcHBlYXIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2Jvcm5FbmRUaW1lID4gMCAmJiBjdXJyVGltZSA+PSB0aGlzLl9ib3JuRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9ib3JuRW5kVGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcmVsaXZlRW5kVGltZSA+IDAgJiYgY3VyclRpbWUgPj0gdGhpcy5fcmVsaXZlRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5lbmRSZWxpdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0Zsb2F0KGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9odXJ0RW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0h1cnQoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbGxhcHNlRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NvbGxhcHNlKGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZWNvdmVyRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JlY292ZXIoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5pu05paw5oqA6IO95L2c55So5pe26Ze054K5XG4gICAgICAgIHRoaXMudXBkYXRlU2tpbGxUaW1lUG9pbnRzKGN1cnJUaW1lKTtcblxuICAgICAgICBpZiAodGhpcy5faXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0F0dGFjayhjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01vdmUoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBsZXRlVHlwZSA9IHRoaXMuZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZShjdXJyVGltZSk7XG4gICAgICAgIHN3aXRjaCAoY29tcGxldGVUeXBlKSB7XG4gICAgICAgICAgICAvLyDlt7LlrozmiJDmiJblj6/lrozmiJBcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coJ2FiYycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9naWNNYW5hZ2VyLnJlbW92ZUVuaXR5KHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5DT0xMQVBTRSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNEZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRSZWxpdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZWVkRGlzYXBwZWFyKCkgJiYgdGhpcy5fY3VyckFjdGlvbiAhPSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGlzYXBwZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UmVjb3ZlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJFTElWRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uUkVDT1ZFUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uQk9STikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIOWPr+aJk+aWrVxuICAgICAgICAgICAgY2FzZSBBY3Rpb25Db21wbGV0ZVR5cGUuQlJFQUtBQkxFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJyZWFrYWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8g5pyq5a6M5oiQ5oiW5LiN5Y+v5a6M5oiQXG4gICAgICAgICAgICBjYXNlIEFjdGlvbkNvbXBsZXRlVHlwZS5VTkNPTVBMRVRBQkxFOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNraWxsVGltZVBvaW50czogZnVuY3Rpb24gdXBkYXRlU2tpbGxUaW1lUG9pbnRzKGN1cnJUaW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGltZVN0YXRlID0gdGhpcy5fc2tpbGxUaW1lU3RhdGVzW2ldO1xuICAgICAgICAgICAgaWYgKCF0aW1lU3RhdGUudGFrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGltZVN0YXRlLnRha2VFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFrZVNraWxsVGltZVBvaW50KHRpbWVTdGF0ZS50aW1lUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lU3RhdGUudGFrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxUaW1lUG9pbnQ6IGZ1bmN0aW9uIHRha2VTa2lsbFRpbWVQb2ludCh0aW1lUG9pbnQpIHtcbiAgICAgICAgc3dpdGNoICh0aW1lUG9pbnQuYWN0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLkRBTUFHRTpcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VTa2lsbERhbWFnZSh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLlNFTEZfREVMQVk6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlU2tpbGxTZWxmRGVsYXkodGltZVBvaW50KTticmVhaztcbiAgICAgICAgICAgIGNhc2UgVGltZVBvaW50QWN0VHlwZS5TSE9DS19TQ1JFRU46XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwLnNob2NrKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRpbWVQb2ludEFjdFR5cGUuUExBWV9FRkZFQ1Q6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlUGxheUVmZmVjdCh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRha2VTa2lsbERhbWFnZTogZnVuY3Rpb24gdGFrZVNraWxsRGFtYWdlKHRpbWVQb2ludCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2UobmV3IGNjLlZlYzIodGltZVBvaW50LnJhbmdlLngsIHRpbWVQb2ludC5yYW5nZS55KSk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgb2Zmc2V0LnggLT0gdGltZVBvaW50LnJhbmdlLndpZHRoO1xuICAgICAgICB2YXIgcmVnaW9uID0gbmV3IGNjLlJlY3Qob2Zmc2V0LngsIG9mZnNldC55LCB0aW1lUG9pbnQucmFuZ2Uud2lkdGgsIHRpbWVQb2ludC5yYW5nZS5oZWlnaHQpO1xuICAgICAgICB2YXIgaGl0dGluZ0FjdG9ycyA9IG51bGw7XG4gICAgICAgIHZhciBwbGF5ZXIgPSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCk7XG4gICAgICAgIHZhciBhdHRhY2tWYWx1ZSA9IHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICAgICAgaWYgKHRoaXMgPT09IHBsYXllcikgaGl0dGluZ0FjdG9ycyA9IHRoaXMuX2xvZ2ljTWFuYWdlci5nZXRBY3RvckJ5UmVnaW9uKHRoaXMsIHJlZ2lvbik7ZWxzZSB7XG4gICAgICAgICAgICBoaXR0aW5nQWN0b3JzID0gW3BsYXllcl07XG4gICAgICAgICAgICBhdHRhY2tWYWx1ZSArPSAodGhpcy5fbG9naWNNYW5hZ2VyLmdldFJvdW5kKCkgLSAxKSAqIDIwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaXR0aW5nQWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSBoaXR0aW5nQWN0b3JzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLnN0dWNrKHRoaXMsIHJlZ2lvbi5jbG9uZSgpLCB0aW1lUG9pbnQuYXR0YWNrVHlwZSwgYXR0YWNrVmFsdWUsIHRpbWVQb2ludC5hdHRhY2tQYXJhbSkpIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAmJiB0aW1lUG9pbnQuc291bmQgJiYgdGltZVBvaW50LnNvdW5kICE9PSAwKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kL1wiICsgdGltZVBvaW50LnNvdW5kLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGF1ZGlvQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gcmVzdWx0O1xuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxTZWxmRGVsYXk6IGZ1bmN0aW9uIHRha2VTa2lsbFNlbGZEZWxheSh0aW1lUG9pbnQpIHtcbiAgICAgICAgdGhpcy5fYXR0YWNrRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICB9LFxuXG4gICAgdGFrZVBsYXlFZmZlY3Q6IGZ1bmN0aW9uIHRha2VQbGF5RWZmZWN0KHRpbWVQb2ludCkge1xuICAgICAgICBpZiAodGhpcy5fbG9naWNNYW5hZ2VyKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gbmV3IGNjLlZlYzIodGhpcy5ub2RlLnggKyB0aW1lUG9pbnQucG9zaXRpb24ueCwgdGhpcy5ub2RlLnkgKyB0aW1lUG9pbnQucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9sb2dpY01hbmFnZXIucGxheUVmZmVjdCh0aW1lUG9pbnQuaWQsIHRpbWVQb2ludC5sYXllciwgcG9zLCB0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3R1Y2s6IGZ1bmN0aW9uIHN0dWNrKGFjdG9yLCByZWdpb24sIGF0dGFja1R5cGUsIGF0dGFja1ZhbHVlLCBhdHRhY2tQYXJhbSkge1xuICAgICAgICBpZiAodGhpcy5faXNJbnZpbmNpYmxlIHx8IHRoaXMuX2lzRGVhZCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGFtYWdlKGF0dGFja1ZhbHVlKTtcbiAgICAgICAgdGhpcy5wbGF5SGl0RWZmZWN0KHJlZ2lvbik7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPiAwKSB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0F0dGFja2luZykgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0RmxvYXQoMC43LCAxNTAsIDE1MCAqIGFjdG9yLmdldERpcmVjdGlvbigpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAoYXR0YWNrVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5OT1JNQUw6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0SHVydCgwLjUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5GTFk6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgLT0gYXR0YWNrUGFyYW0uY29tYm87XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5Db21ib1ZhbHVlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgPSB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEZsb2F0KGF0dGFja1BhcmFtLnRvcFRpbWUsIGF0dGFja1BhcmFtLnRvcEhlaWdodCwgYXR0YWNrUGFyYW0uZGlzdGFuY2UgKiBhY3Rvci5nZXREaXJlY3Rpb24oKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGRhbWFnZTogZnVuY3Rpb24gZGFtYWdlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2hwIC09IHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5faHAgPCAwKSB0aGlzLl9ocCA9IDA7XG4gICAgICAgIGlmICh0aGlzLl9ocCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpcy5fbG9naWNNYW5hZ2VyLmdldFBsYXllcigpKSB0aGlzLl9sb2dpY01hbmFnZXIua2lsbE1vbnN0ZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXlSZWxpdmVFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlSZWxpdmVFZmZlY3QoKSB7fSxcblxuICAgIHBsYXlIaXRFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlIaXRFZmZlY3QocmVnaW9uKSB7XG4gICAgICAgIHZhciBwb2ludCA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2UobmV3IGNjLlZlYzIocmVnaW9uLngsIHJlZ2lvbi55KSk7XG4gICAgICAgIHJlZ2lvbi54ID0gcG9pbnQueDtcbiAgICAgICAgcmVnaW9uLnkgPSBwb2ludC55O1xuICAgICAgICB2YXIgYm94ID0gdGhpcy5fYm94LmNsb25lKCk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgcmVnaW9uLnggPSAtcmVnaW9uLng7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjYy5yZWN0SW50ZXJzZWN0aW9uKHJlZ2lvbiwgdGhpcy5fYm94KTtcbiAgICAgICAgdmFyIHBvcyA9IG5ldyBjYy5WZWMyKHRoaXMubm9kZS54ICsgaW50ZXJzZWN0aW9uLmNlbnRlci54LCB0aGlzLm5vZGUueSArIGludGVyc2VjdGlvbi5jZW50ZXIueSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvZWZmZWN0LzRcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBub2RlLnggPSBwb3MueDtcbiAgICAgICAgICAgIG5vZGUueSA9IHBvcy55O1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltYXRpb24ub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX21hcC5hZGRFZmZlY3Qobm9kZSwgMSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpO1xuICAgICAgICB2YXIgbG9ja1Jlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQobWFwUmVzdWx0LnN4LCBtYXBSZXN1bHQuc3ksIG1hcFJlc3VsdC5keCwgbWFwUmVzdWx0LmR5KTtcbiAgICAgICAgaWYgKCFsb2NrUmVzdWx0LnBhc3MpIHtcbiAgICAgICAgICAgIGxvY2tSZXN1bHQucGFzcyA9IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5zeCkgIT09IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5keCkgfHwgTWF0aC5mbG9vcihsb2NrUmVzdWx0LnN5KSAhPT0gTWF0aC5mbG9vcihsb2NrUmVzdWx0LmR5KTtcbiAgICAgICAgICAgIHJldHVybiBsb2NrUmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9ja1Jlc3VsdC5wYXNzID0gbWFwUmVzdWx0LnBhc3M7XG4gICAgICAgICAgICByZXR1cm4gbG9ja1Jlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwUmVzdWx0O1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1hcE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFBpeGVzU2l6ZSA9IHRoaXMuX21hcC5nZXRNYXBQaXhlc1NpemUoKTtcbiAgICAgICAgdmFyIG1hcFBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAoc3ggPCAwKSB7XG4gICAgICAgICAgICBzeCA9IDA7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5mbG9vcihzeCkgPj0gbWFwUGl4ZXNTaXplLndpZHRoKSB7XG4gICAgICAgICAgICBzeCA9IG1hcFBpeGVzU2l6ZS53aWR0aCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN5IDwgMCkge1xuICAgICAgICAgICAgc3kgPSAwO1xuICAgICAgICAgICAgbWFwUGFzcyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3Ioc3kpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHN5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdU91dCA9IGZhbHNlLFxuICAgICAgICAgICAgdk91dCA9IGZhbHNlO1xuICAgICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmZsb29yKGR4KSA+PSBtYXBQaXhlc1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIGR4ID0gbWFwUGl4ZXNTaXplLndpZHRoIC0gMTtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3IoZHkpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIGR5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1T3V0ICYmIHZPdXQpIG1hcFBhc3MgPSBmYWxzZTtcblxuICAgICAgICB2YXIgbGluZVBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobWFwUGFzcykge1xuICAgICAgICAgICAgdmFyIHRpbGVTaXplID0gdGhpcy5fbWFwLmdldFRpbGVTaXplKCk7XG4gICAgICAgICAgICB2YXIgdXggPSBzeCAvIHRpbGVTaXplLndpZHRoO1xuICAgICAgICAgICAgdmFyIHV5ID0gc3kgLyB0aWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgdWR4ID0gZHggLyB0aWxlU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciB1ZHkgPSBkeSAvIHRpbGVTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHZhciBweCA9IHVkeCAtIHV4O1xuICAgICAgICAgICAgdmFyIHB5ID0gdWR5IC0gdXk7XG4gICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgubWF4KDEsIE1hdGgubWF4KE1hdGguY2VpbChNYXRoLmFicyhweCkpLCBNYXRoLmNlaWwoTWF0aC5hYnMocHkpKSkpO1xuXG4gICAgICAgICAgICBweCA9IHB4IC8gZGlzdDtcbiAgICAgICAgICAgIHB5ID0gcHkgLyBkaXN0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRpc3QgLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdYID0gTWF0aC5mbG9vcih1eCArIHB4KTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3WSA9IE1hdGguZmxvb3IodXkgKyBweSk7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFggPSBNYXRoLmZsb29yKHV4KTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkWSA9IE1hdGguZmxvb3IodXkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXAuY2hlY2tNb3ZlUG9pbnQobmV3WCwgbmV3WSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXggKz0gcHg7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG5ld1gsIG9sZFkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV4ICs9IHB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG9sZFgsIG5ld1kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVQYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR4ID0gTWF0aC5mbG9vcih1eCAqIHRpbGVTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGR5ID0gTWF0aC5mbG9vcih1eSAqIHRpbGVTaXplLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwYXNzOiBtYXBQYXNzICYmIGxpbmVQYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICB9LFxuXG4gICAgZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQ6IGZ1bmN0aW9uIGdldEZpeGVkTG9ja1JlZ2lvblBvaW50KHN4LCBzeSwgZHgsIGR5KSB7XG4gICAgICAgIHZhciBsb2NrUmVnaW9uID0gdGhpcy5fbWFwLmxvY2tSZWdpb24uY2xvbmUoKTtcbiAgICAgICAgaWYgKGxvY2tSZWdpb24ueE1pbiA9PT0gMCAmJiBsb2NrUmVnaW9uLnlNaW4gPT09IDAgJiYgbG9ja1JlZ2lvbi54TWF4ID09PSAwICYmIGxvY2tSZWdpb24ueE1heCA9PT0gMCkge1xuICAgICAgICAgICAgbG9ja1JlZ2lvbi54TWluID0gMDtcbiAgICAgICAgICAgIGxvY2tSZWdpb24ueU1pbiA9IDA7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnhNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkud2lkdGg7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnlNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYWx0V2lkdGggPSB0aGlzLmdldENvbGxpc2lvbigpLndpZHRoIC8gMjtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWluICs9IGhhbHRXaWR0aDtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWF4IC09IGhhbHRXaWR0aDtcbiAgICAgICAgdmFyIHBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobG9ja1JlZ2lvbi5jb250YWlucyhuZXcgY2MuVmVjMihzeCwgc3kpKSkge1xuICAgICAgICAgICAgaWYgKGR4IDw9IGxvY2tSZWdpb24ueE1pbikge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWluICsgMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGR4ID49IGxvY2tSZWdpb24ueE1heCkge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWF4IC0gMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHkgPD0gbG9ja1JlZ2lvbi55TWluKSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNaW4gKyAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZHkgPj0gbG9ja1JlZ2lvbi55TWF4KSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNYXggLSAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0geyBwYXNzOiBwYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZmNTJiSHczeXBLTTRKTHhpMldoV0wvJywgJ2FjdG9yX2RlZmluZScpO1xuLy8gc2NyaXB0XFxhY3RvclxcYWN0b3JfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFjdG9yRGlyZWN0aW9uOiB7XG4gICAgICAgIExFRlQ6IC0xLFxuICAgICAgICBSSUdIVDogMVxuICAgIH0sXG5cbiAgICBBY3RvckFjdGlvbjoge1xuICAgICAgICBJRExFOiAwLFxuICAgICAgICBQUkVSVU46IDEsXG4gICAgICAgIFJVTjogMixcbiAgICAgICAgQVRUQUNLOiAzLFxuICAgICAgICBIVVJUOiA0LFxuICAgICAgICBIVVJUX0ZMWTogNSxcbiAgICAgICAgSFVSVF9GQUxMOiA2LFxuICAgICAgICBDT0xMQVBTRTogNyxcbiAgICAgICAgUkVDT1ZFUjogOCxcbiAgICAgICAgQk9STjogOSxcbiAgICAgICAgRElTQVBQRUFSOiAxMCxcbiAgICAgICAgUkVMSVZFOiAxMVxuICAgIH0sXG5cbiAgICBBY3Rpb25OYW1lOiBbXCJpZGxlXCIsIFwicHJlcnVuXCIsIFwicnVuXCIsIFwiYXR0YWNrX1wiLCBcImh1cnRcIiwgXCJodXJ0X2ZseVwiLCBcImh1cnRfZmFsbFwiLCBcImNvbGxhcHNlXCIsIFwic3RhbmR1cFwiLCBcImJvcm5cIiwgXCJkaXNhcHBlYXJcIiwgXCJyZWxpdmVcIl0sXG5cbiAgICBBY3Rpb25DbGlwSW5kZXg6IHtcbiAgICAgICAgSURMRTogMCxcbiAgICAgICAgUlVOOiAxLFxuICAgICAgICBBVFRBQ0tfMTogMixcbiAgICAgICAgQVRUQUNLXzI6IDMsXG4gICAgICAgIEFUVEFDS18zOiA0LFxuICAgICAgICBIVVJUOiA1LFxuICAgICAgICBIVVJUX0ZMWTogNixcbiAgICAgICAgSFVSVF9GQUxMOiA3LFxuICAgICAgICBDT0xMQVBTRTogOCxcbiAgICAgICAgUkVDT1ZFUjogOSxcbiAgICAgICAgQk9STjogMTAsXG4gICAgICAgIERJU0FQUEVBUjogMTEsXG4gICAgICAgIFJFTElWRTogMTJcbiAgICB9LFxuXG4gICAgQWN0aW9uQ29tcGxldGVUeXBlOiB7XG4gICAgICAgIENPTVBMRVRBQkxFOiAwLFxuICAgICAgICBVTkNPTVBMRVRBQkxFOiAxLFxuICAgICAgICBCUkVBS0FCTEU6IDJcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2Y2YmZJQy9vVkhJYktpazhxTTJIQUMnLCAnYXR0YWNrX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcYXR0YWNrX2N0cmwuanNcblxudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgYXR0YWNrQToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYXR0YWNrQjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWN0aW9uVGltZTogMC4xXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5vblRvdWNoQ2FuY2VsLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGxheWVyOiBmdW5jdGlvbiBzZXRQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgIHRoaXMuX3BsYXllckN0cmwgPSBwbGF5ZXI7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9TdGFydFN0YWZmKCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9FbmRTdGFmZigpO1xuICAgICAgICAvL3RoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LkhJVCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuSElUKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaENhbmNlbDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBkb1N0YXJ0U3RhZmY6IGZ1bmN0aW9uIGRvU3RhcnRTdGFmZigpIHtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVPdXQodGhpcy5hY3Rpb25UaW1lKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICBkb0VuZFN0YWZmOiBmdW5jdGlvbiBkb0VuZFN0YWZmKCkge1xuICAgICAgICB0aGlzLmF0dGFja0Euc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLm9wYWNpdHkgPSAwO1xuICAgICAgICB2YXIgdGltZSA9ICgyNTUgLSB0aGlzLmF0dGFja0Eub3BhY2l0eSkgLyAyNTUgKiB0aGlzLmFjdGlvblRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZUluKHRoaXMuYWN0aW9uVGltZSk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NlNTE4RkhSbDlBVXB5aFR3SlhLbTV1JywgJ2JhdHRsZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGJhdHRsZV9jdHJsLmpzXG5cbnZhciBIdXJsZGVEZWZpbmUgPSByZXF1aXJlKFwiaHVyZGxlX2RlZmluZVwiKTtcbnZhciBDb250cm9sRGVmaW5lID0gcmVxdWlyZShcImNvbnRyb2xfZGVmaW5lXCIpO1xudmFyIFRyaWdnZXJUeXBlID0gSHVybGRlRGVmaW5lLlRyaWdnZXJUeXBlO1xudmFyIENtZFR5cGUgPSBIdXJsZGVEZWZpbmUuQ21kVHlwZTtcbnZhciBDb25kVHlwZSA9IEh1cmxkZURlZmluZS5Db25kVHlwZTtcbnZhciBDb250cm9sS2V5ID0gQ29udHJvbERlZmluZS5Db250cm9sS2V5O1xuXG52YXIgSHVyZGxlTG9hZEJpdCA9IHtcbiAgICBNQVA6IDB4MDAwMVxufTtcblxudmFyIGRlZmF1bHRSZXRyeUNvdW50ID0gMztcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRyYW5zZm9ybU1hc2s6IGNjLk5vZGUsXG4gICAgICAgIGpveVN0aWNrOiBjYy5Ob2RlLFxuICAgICAgICBhdHRhY2tCdXR0b246IGNjLk5vZGUsXG4gICAgICAgIG1hcExheWVyOiBjYy5Ob2RlLFxuICAgICAgICBjb250cm9sTGF5ZXI6IGNjLk5vZGUsXG4gICAgICAgIHN0YXRlQmFyOiBjYy5Ob2RlLFxuICAgICAgICBtb3ZlVGlwczogY2MuTm9kZSxcbiAgICAgICAgcm91bmRCYXI6IGNjLk5vZGUsXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKTtcbiAgICAgICAgbWFuYWdlci5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIG1hbmFnZXIuZW5hYmxlZERlYnVnRHJhdyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3VpTWFuYWdlciA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoJ3VpX21hbmFnZXInKTtcbiAgICAgICAgdGhpcy5fcmV0cnlDb3VudCA9IGRlZmF1bHRSZXRyeUNvdW50O1xuXG4gICAgICAgIC8vIOaOp+WItuebuOWFs1xuICAgICAgICB0aGlzLl9yb3VuZEJhciA9IHRoaXMucm91bmRCYXIuZ2V0Q29tcG9uZW50KCdyb3VuZF9jdHJsJyk7XG4gICAgICAgIHRoaXMuX2pveVN0aWNrID0gdGhpcy5qb3lTdGljay5nZXRDb21wb25lbnQoXCJqb3lfY3RybFwiKTtcbiAgICAgICAgdGhpcy5fYXR0YWNrQnV0dG9uID0gdGhpcy5hdHRhY2tCdXR0b24uZ2V0Q29tcG9uZW50KFwiYXR0YWNrX2N0cmxcIik7XG4gICAgICAgIHRoaXMuX3N0YXRlQmFyID0gdGhpcy5zdGF0ZUJhci5nZXRDb21wb25lbnQoXCJzdGF0ZV9jdHJsXCIpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllclByZWZhYikuZ2V0Q29tcG9uZW50KCdwbGF5ZXJfY3RybCcpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIubG9naWNNYW5hZ2VyID0gdGhpcztcbiAgICAgICAgdGhpcy5fcGxheWVyLnN0YXRlQmFyID0gdGhpcy5fc3RhdGVCYXI7XG4gICAgICAgIHRoaXMuX2pveVN0aWNrLnNldFBsYXllcih0aGlzLl9wbGF5ZXIpO1xuICAgICAgICB0aGlzLl9hdHRhY2tCdXR0b24uc2V0UGxheWVyKHRoaXMuX3BsYXllcik7XG5cbiAgICAgICAgLy8g5YWz5Y2h55u45YWzXG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVJZCA9IC0xO1xuICAgICAgICB0aGlzLl9odXJkbGVMb2FkTWFzayA9IDA7XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzRmFpbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9jdXJySHVyZGxlQ29uZmlnID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbWFwID0gbnVsbDtcblxuICAgICAgICAvLyDku7vliqHnm7jlhbNcbiAgICAgICAgdGhpcy5fbWlzc2lvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdHJpZ2dlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5fY3Vyck1pc3Npb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9taXNzaW9uU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faHVyZGxlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IDA7XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtID0gMDtcblxuICAgICAgICB0aGlzLl9rZWVwRWZmZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLl9tb25zdGVycyA9IFtdO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogc2VsZi5vbktleVByZXNzZWQuYmluZChzZWxmKSxcbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IHNlbGYub25LZXlSZWxlYXNlZC5iaW5kKHNlbGYpXG4gICAgICAgIH07XG4gICAgICAgIC8vIOe7keWumum8oOagh+S6i+S7tlxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIsIHRoaXMubm9kZSk7XG5cbiAgICAgICAgLy8g5p2l6Ieq5aSx6LSl56qX5Y+j77yM5aSN5rS75oyJ6ZKuXG4gICAgICAgIHRoaXMuX3JlbGl2ZUhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0JVWV9USU1FX1RPX1BMQVksIHRoaXMub25SZXRyeUdhbWUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3JldHVybkhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX1JFVFVSTl9HQU1FLCB0aGlzLm9uUmV0dXJuRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fcmVsaXZlSGFuZGxlcik7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9yZXR1cm5IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fcmVsaXZlSGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3JldHVybkhhbmRsZXIgPSBudWxsO1xuXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyh0cnVlKTtcblxuICAgICAgICAvLyDkuI3og73ov5nmoLflgZrvvIxkZXN0cm955pe25omA5pyJbGlzdGVuZXLlt7Lnp7vpmaRcbiAgICAgICAgLy9jYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICB2YXIgY2sgPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnc6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LlVQO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuTEVGVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnM6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkRPV047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5SSUdIVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmo6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkhJVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2sgJiYgdGhpcy5fcGxheWVyKSB0aGlzLl9wbGF5ZXIua2V5RG93bihjayk7XG4gICAgfSxcblxuICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGNrID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5VUDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkxFRlQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5zOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ET1dOO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuUklHSFQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5qOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ISVQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNrICYmIHRoaXMuX3BsYXllcikgdGhpcy5fcGxheWVyLmtleVVwKGNrKTtcbiAgICB9LFxuXG4gICAgb25SZXRyeUdhbWU6IGZ1bmN0aW9uIG9uUmV0cnlHYW1lKCkge1xuICAgICAgICB0aGlzLl9yZXRyeUNvdW50LS07XG4gICAgICAgIHRoaXMuX3BsYXllci5yZWxpdmUoKTtcbiAgICB9LFxuXG4gICAgb25SZXR1cm5FdmVudDogZnVuY3Rpb24gb25SZXR1cm5FdmVudCgpIHtcbiAgICAgICAgR2FtZVV0aWwubG9hZFNjZW5lKCdnYW1lJyk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy90aGlzLmxvYWRNdXNpYygpO1xuICAgICAgICB0aGlzLmNoYW5nZUh1cmRsZSgwKTtcbiAgICB9LFxuXG4gICAgY2xlYXJFZmZlY3RzOiBmdW5jdGlvbiBjbGVhckVmZmVjdHMoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9rZWVwRWZmZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2tlZXBFZmZlY3RzLnBvcCgpO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXJNb25zdGVyOiBmdW5jdGlvbiBjbGVhck1vbnN0ZXIoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9tb25zdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbW9uID0gdGhpcy5fbW9uc3RlcnMucG9wKCk7XG4gICAgICAgICAgICBtb24ubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXJNaXNzaW9uOiBmdW5jdGlvbiBjbGVhck1pc3Npb24oKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJzLnNwbGljZSgwLCB0aGlzLl90cmlnZ2Vycy5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9taXNzaW9ucy5zcGxpY2UoMCwgdGhpcy5fbWlzc2lvbnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY3Vyck1pc3Npb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9taXNzaW9uU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IDA7XG4gICAgfSxcblxuICAgIGNsZWFySHVyZGxlOiBmdW5jdGlvbiBjbGVhckh1cmRsZSgpIHtcbiAgICAgICAgdGhpcy5fc3RhcnR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdWlNYW5hZ2VyLmNsb3NlQWxsKCk7XG4gICAgICAgIHRoaXMuX3BsYXllci5tYXAgPSBudWxsO1xuICAgICAgICB0aGlzLmNsZWFyRWZmZWN0cygpO1xuICAgICAgICB0aGlzLnJlbW92ZU1hcCgpO1xuICAgICAgICB0aGlzLmNsZWFyTW9uc3RlcigpO1xuICAgICAgICB0aGlzLmNsZWFyTWlzc2lvbigpO1xuICAgICAgICB0aGlzLl9jdXJySHVyZGxlQ29uZmlnID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUlkID0gLTE7XG4gICAgICAgIHRoaXMuX2h1cmRsZUxvYWRNYXNrID0gMDtcbiAgICAgICAgdGhpcy5faHVyZGxlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faXNGYWlsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtID0gMDtcbiAgICAgICAgdGhpcy5yb3VuZEJhci5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmV0cnlDb3VudCA9IGRlZmF1bHRSZXRyeUNvdW50O1xuICAgIH0sXG5cbiAgICBpbml0TWlzc2lvbjogZnVuY3Rpb24gaW5pdE1pc3Npb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5fY3Vyckh1cmRsZUNvbmZpZykgcmV0dXJuO1xuICAgICAgICB2YXIgY2ZnID0gdGhpcy5fY3Vyckh1cmRsZUNvbmZpZztcbiAgICAgICAgZm9yICh2YXIgaSA9IGNmZy5taXNzaW9uLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0aGlzLl9taXNzaW9ucy5wdXNoKGNmZy5taXNzaW9uW2ldKTtcbiAgICAgICAgdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2tpbGxOdW0gPSAwO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VIdXJkbGU6IGZ1bmN0aW9uIGNoYW5nZUh1cmRsZShpZCkge1xuICAgICAgICB0aGlzLl9zdGFydHRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fY3Vyckh1cmRsZUlkID49IDAgJiYgdGhpcy5fY3Vyckh1cmRsZUlkID09PSBpZCkge1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0oMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaWQgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1NYXNrLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybU1hc2sub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHRoaXMubG9hZEh1cmRsZShpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySHVyZGxlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdHJhbnNmb3JtOiBmdW5jdGlvbiB0cmFuc2Zvcm0odHlwZSwgYm9ybikge1xuICAgICAgICB0aGlzLnRyYW5zZm9ybU1hc2suc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIHNlcXVlbmNlID0gbnVsbDtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG51bGw7XG4gICAgICAgIHZhciB0aW1lID0gMDtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZSA9PT0gMCkge1xuICAgICAgICAgICAgLy/lj5jpu5FcbiAgICAgICAgICAgIHRpbWUgPSAoMjU1IC0gdGhpcy50cmFuc2Zvcm1NYXNrLm9wYWNpdHkpIC8gMjU1ICogMC41O1xuICAgICAgICAgICAgYWN0aW9uID0gbmV3IGNjLlNlcXVlbmNlKG5ldyBjYy5GYWRlSW4odGltZSksIG5ldyBjYy5DYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNldEh1cmRsZSgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIOWPmOmAj+aYjlxuICAgICAgICAgICAgaWYgKGJvcm4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXIubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpbWUgPSB0aGlzLnRyYW5zZm9ybU1hc2sub3BhY2l0eSAvIDI1NSAqIDAuNTtcbiAgICAgICAgICAgIGFjdGlvbiA9IG5ldyBjYy5TZXF1ZW5jZShuZXcgY2MuRmFkZU91dCh0aW1lKSwgbmV3IGNjLkNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9ybikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXIubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXIuc2V0SHAoMjAwLCAyMDApO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9wbGF5ZXIuYm9ybigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0SHVyZGxlKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmFuc2Zvcm1NYXNrLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICBzdGFydEh1cmRsZTogZnVuY3Rpb24gc3RhcnRIdXJkbGUoKSB7XG4gICAgICAgIHRoaXMubG9hZE11c2ljKCk7XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtKys7XG4gICAgICAgIHRoaXMucm91bmRCYXIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcm91bmRCYXIuc2V0Um91bmQodGhpcy5fcm91bmROdW0pO1xuICAgICAgICB0aGlzLl9wbGF5ZXIuY29udHJvbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zdGFydHRlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIGxvYWRIdXJkbGU6IGZ1bmN0aW9uIGxvYWRIdXJkbGUoaWQpIHtcbiAgICAgICAgdmFyIGNmZyA9IEdsb2JhbC5odXJkbGVQcm92aWRlci5nZXRDb25maWcoaWQpO1xuICAgICAgICBpZiAoIWNmZykgcmV0dXJuO1xuICAgICAgICB0aGlzLmNsZWFySHVyZGxlKCk7XG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVJZCA9IGlkO1xuICAgICAgICB0aGlzLl9jdXJySHVyZGxlQ29uZmlnID0gY2ZnO1xuICAgICAgICB0aGlzLmluaXRNaXNzaW9uKCk7XG4gICAgICAgIHRoaXMubG9hZE1hcChjZmcubWFwSWQpO1xuICAgIH0sXG5cbiAgICByZXNldEh1cmRsZTogZnVuY3Rpb24gcmVzZXRIdXJkbGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5fY3Vyckh1cmRsZUNvbmZpZykgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zdGFydHRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl91aU1hbmFnZXIuY2xvc2VBbGwoKTtcbiAgICAgICAgdGhpcy5jbGVhckVmZmVjdHMoKTtcbiAgICAgICAgdGhpcy5fbWFwLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY2xlYXJNb25zdGVyKCk7XG4gICAgICAgIHRoaXMuY2xlYXJNaXNzaW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdE1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5faXNGYWlsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yb3VuZEJhci5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGxheWVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3BsYXllci5zZXRBY3RvclBvc2l0aW9uKHRoaXMuX2N1cnJIdXJkbGVDb25maWcuYm9yblBvcy54LCB0aGlzLl9jdXJySHVyZGxlQ29uZmlnLmJvcm5Qb3MueSk7XG4gICAgICAgIHRoaXMuX3BsYXllci5tYXAgPSB0aGlzLl9tYXA7XG4gICAgICAgIHRoaXMuX3BsYXllci5zZXRIcCgyMDAsIDIwMCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKDEpO1xuICAgIH0sXG5cbiAgICBsYXVuY2hNaXNzaW9uOiBmdW5jdGlvbiBsYXVuY2hNaXNzaW9uKCkge1xuICAgICAgICB2YXIgbWlzc2lvbiA9IHRoaXMuX21pc3Npb25zLnBvcCgpO1xuICAgICAgICBpZiAoIW1pc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJNaXNzaW9uID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyTWlzc2lvbiA9IG1pc3Npb247XG4gICAgICAgIHRoaXMuX3RyaWdnZXJzLnNwbGljZSgwLCB0aGlzLl90cmlnZ2Vycy5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1pc3Npb24udHJpZ2dlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJzLnB1c2gobWlzc2lvbi50cmlnZ2Vyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IDA7XG4gICAgICAgIHRoaXMuX21pc3Npb25TdGFydFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBsb2FkTXVzaWM6IGZ1bmN0aW9uIGxvYWRNdXNpYygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kL2JnXCIsIGNjLkF1ZGlvQ2xpcCwgZnVuY3Rpb24gKGVyciwgYXVkaW9DbGlwKSB7XG4gICAgICAgICAgICBjYy5sb2coJ3BsYXkgbXVzaWMnKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyhhdWRpb0NsaXAsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgbG9hZE1hcDogZnVuY3Rpb24gbG9hZE1hcChpZCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL21hcC9cIiArIGlkLnRvU3RyaW5nKCksIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgc2VsZi5vbkh1cmRsZVN0ZXBMb2FkZWQoSHVyZGxlTG9hZEJpdC5NQVAsIGVyciwgcHJlZmFiKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbW92ZU1hcDogZnVuY3Rpb24gcmVtb3ZlTWFwKCkge1xuICAgICAgICBpZiAoIXRoaXMuX21hcCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9tYXAubm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9tYXAubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX21hcCA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uSHVyZGxlU3RlcExvYWRlZDogZnVuY3Rpb24gb25IdXJkbGVTdGVwTG9hZGVkKGJpdCwgZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgc3dpdGNoIChiaXQpIHtcbiAgICAgICAgICAgIGNhc2UgSHVyZGxlTG9hZEJpdC5NQVA6XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5tYXBMYXllcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXAgPSBub2RlLmdldENvbXBvbmVudChcIm1hcF9jdHJsXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h1cmRsZUxvYWRNYXNrIHw9IEh1cmRsZUxvYWRCaXQuTUFQO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWRIdXJkbGUoKSkge1xuICAgICAgICAgICAgLy90aGlzLl9wbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5tYXAgPSB0aGlzLl9tYXA7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuc2V0QWN0b3JQb3NpdGlvbih0aGlzLl9jdXJySHVyZGxlQ29uZmlnLmJvcm5Qb3MueCwgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZy5ib3JuUG9zLnkpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0oMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNMb2FkZWRIdXJkbGU6IGZ1bmN0aW9uIGlzTG9hZGVkSHVyZGxlKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHZhciBtYXNrID0gMDtcbiAgICAgICAgZm9yICh2YXIgayBpbiBIdXJkbGVMb2FkQml0KSB7XG4gICAgICAgICAgICBtYXNrIHw9IEh1cmRsZUxvYWRCaXRba107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2h1cmRsZUxvYWRNYXNrID09IG1hc2s7XG4gICAgfSxcblxuICAgIGdldFBsYXllcjogZnVuY3Rpb24gZ2V0UGxheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGxheWVyO1xuICAgIH0sXG5cbiAgICBnZXRSb3VuZDogZnVuY3Rpb24gZ2V0Um91bmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3VuZE51bTtcbiAgICB9LFxuXG4gICAgY3JlYXRlTW9uc3RlcjogZnVuY3Rpb24gY3JlYXRlTW9uc3RlcihpZCwgcG9zLCBkaXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9hY3Rvci9tb25zdGVyXCIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgdmFyIG1vbiA9IG5vZGUuZ2V0Q29tcG9uZW50KFwibW9uc3Rlcl9jdHJsXCIpO1xuICAgICAgICAgICAgbW9uLmxvZ2ljTWFuYWdlciA9IHNlbGY7XG4gICAgICAgICAgICBzZWxmLl9tb25zdGVycy5wdXNoKG1vbik7XG4gICAgICAgICAgICBtb24uc2V0QWN0b3JQb3NpdGlvbihwb3MueCwgcG9zLnkpO1xuICAgICAgICAgICAgbW9uLm1hcCA9IHNlbGYuX21hcDtcbiAgICAgICAgICAgIG1vbi5zZXREaXJlY3Rpb24oZGlyKTtcblxuICAgICAgICAgICAgdmFyIGhwID0gKHNlbGYuX3JvdW5kTnVtIC0gMSkgKiAyMCArIDEzMDtcbiAgICAgICAgICAgIG1vbi5zZXRIcChocCwgaHApO1xuICAgICAgICAgICAgbW9uLmJvcm4oKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3lNb25zdGVyOiBmdW5jdGlvbiBkZXN0cm95TW9uc3Rlcihtb25zdGVyKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbW9uc3RlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtb25zdGVyID09IHRoaXMuX21vbnN0ZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9uc3RlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcC5yZW1vdmVFbml0eShtb25zdGVyLm5vZGUpO1xuICAgICAgICBtb25zdGVyLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG5cbiAgICByZW1vdmVFbml0eTogZnVuY3Rpb24gcmVtb3ZlRW5pdHkoZW5pdHkpIHtcbiAgICAgICAgaWYgKGVuaXR5ID09IHRoaXMuX3BsYXllcikge30gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lNb25zdGVyKGVuaXR5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBraWxsTW9uc3RlcjogZnVuY3Rpb24ga2lsbE1vbnN0ZXIoKSB7XG4gICAgICAgIHRoaXMuX2tpbGxOdW0rKztcbiAgICB9LFxuXG4gICAgZ2V0QWN0b3JCeVJlZ2lvbjogZnVuY3Rpb24gZ2V0QWN0b3JCeVJlZ2lvbihhY3RvciwgcmVnaW9uKSB7XG4gICAgICAgIHZhciBtb25zID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbW9uc3RlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtb24gPSB0aGlzLl9tb25zdGVyc1tpXTtcbiAgICAgICAgICAgIHZhciBjb2xsID0gbW9uLmdldENvbGxpc2lvbigpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGFjdG9yLm5vZGUueSAtIG1vbi5ub2RlLnkpIDwgMzAgJiYgY2MuSW50ZXJzZWN0aW9uLnJlY3RSZWN0KG1vbi5nZXRDb2xsaXNpb24oKSwgcmVnaW9uKSkgbW9ucy5wdXNoKG1vbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vbnM7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnR0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuX2N1cnJNaXNzaW9uICYmICF0aGlzLmxhdW5jaE1pc3Npb24oKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghdGhpcy5fcGxheWVyLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNGYWlsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNGYWlsID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzRmFpbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdWlNYW5hZ2VyLm9wZW5VSSgnbWlzc2lvbl9mYWlsJywgeyByZXRyeUNvdW50OiB0aGlzLl9yZXRyeUNvdW50IH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcblxuICAgICAgICBpZiAodGhpcy5fbGF1bmNoTmV4dE1pc3Npb25FbmRUaW1lID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1cnJUaW1lID4gdGhpcy5fbGF1bmNoTmV4dE1pc3Npb25FbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF1bmNoTmV4dE1pc3Npb25FbmRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGF1bmNoTWlzc2lvbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1Jlc3VsdEZhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5jb250cm9sRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jaGVja01pc3Npb25DbGVhbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuY29udHJvbEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX21hcC5jYW1lcmFUbyh0aGlzLl9tYXAuZ2V0Q3VyclBvc2l0aW9uKCkueCAtIHRoaXMuX21hcC52aWV3U2l6ZS53aWR0aCAvIDIsIDAsIDEsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSA9IGN1cnJUaW1lICsgMTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLl90cmlnZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIG5lZWRFeGVjID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IHRoaXMuX3RyaWdnZXJzW2ldO1xuICAgICAgICAgICAgc3dpdGNoICh0cmlnZ2VyLmV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBUcmlnZ2VyVHlwZS5USU1FOlxuICAgICAgICAgICAgICAgICAgICBuZWVkRXhlYyA9IGN1cnJUaW1lIC0gdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA+PSB0cmlnZ2VyLnBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgVHJpZ2dlclR5cGUuQVJFQTpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IG5ldyBjYy5WZWMyKHRoaXMuX3BsYXllci5ub2RlLngsIHRoaXMuX3BsYXllci5ub2RlLnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnaW9uID0gbmV3IGNjLlJlY3QodHJpZ2dlci5wYXJhbS54LCB0cmlnZ2VyLnBhcmFtLnksIHRyaWdnZXIucGFyYW0ud2lkdGgsIHRyaWdnZXIucGFyYW0uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgbmVlZEV4ZWMgPSByZWdpb24uY29udGFpbnMocG9zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmVlZEV4ZWMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjQ21kKHRyaWdnZXIuY29tbWFuZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGV4ZWNDbWQ6IGZ1bmN0aW9uIGV4ZWNDbWQoY29tbWFuZHMpIHtcbiAgICAgICAgdmFyIG5lZWRCcmVhayA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1hbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY21kID0gY29tbWFuZHNbaV07XG4gICAgICAgICAgICBpZiAoIWNtZCkgY29udGludWU7XG4gICAgICAgICAgICBzd2l0Y2ggKGNtZC5jbWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkNPTlRST0xfRU5BQkxFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLmNvbnRyb2xFbmFibGVkID0gY21kLmFyZ3MuZW5hYmxlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sTGF5ZXIuYWN0aXZlID0gY21kLmFyZ3MuZW5hYmxlZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuTE9DS19BUkVBOlxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnaW9uID0gbmV3IGNjLlJlY3QoY21kLmFyZ3MueCwgY21kLmFyZ3MueSwgY21kLmFyZ3Mud2lkdGgsIGNtZC5hcmdzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcC5sb2NrUmVnaW9uID0gcmVnaW9uO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5DUkVBVEVfTU9OOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU1vbnN0ZXIoY21kLmFyZ3MuaWQsIGNtZC5hcmdzLnBvcywgY21kLmFyZ3MuZGlyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuU0hPV19NT1ZFX1RJUFM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRpcHMuYWN0aXZlID0gY21kLmFyZ3Muc2hvdztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuU0hPV19UUkFOU19ET09SOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlFZmZlY3QoOCwgMCwgbmV3IGNjLlZlYzIoY21kLmFyZ3MueCwgY21kLmFyZ3MueSksIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuQ0hBTkdFX0hVUkRMRTpcbiAgICAgICAgICAgICAgICAgICAgbmVlZEJyZWFrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VIdXJkbGUoY21kLmFyZ3MuaWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5NT1ZFX0NBTUVSQTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLmNhbWVyYVRvKGNtZC5hcmdzLngsIGNtZC5hcmdzLnksIGNtZC5hcmdzLnRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRCcmVhaykgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hlY2tNaXNzaW9uQ2xlYW46IGZ1bmN0aW9uIGNoZWNrTWlzc2lvbkNsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2N1cnJNaXNzaW9uKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBjb25kcyA9IHRoaXMuX2N1cnJNaXNzaW9uLmNvbmQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb25kID0gY29uZHNbaV07XG4gICAgICAgICAgICB2YXIgY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN3aXRjaCAoY29uZC5jb25kVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQ29uZFR5cGUuVE9UQUxfTU9OX0tJTEw6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9raWxsTnVtIDwgY29uZC5udW0pIGNvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENvbmRUeXBlLkNPTkZJR19DVVNUT006XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIHNob3dSZXN1bHRGYWNlOiBmdW5jdGlvbiBzaG93UmVzdWx0RmFjZShzdWNjZXNzKSB7fSxcblxuICAgIHBsYXlFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlFZmZlY3QoaWQsIGxheWVyLCBwb3MsIGZsaXAsIGtlZXApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9lZmZlY3QvXCIgKyBpZCwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBub2RlLnggPSBwb3MueDtcbiAgICAgICAgICAgIG5vZGUueSA9IHBvcy55O1xuICAgICAgICAgICAgaWYgKGZsaXApIG5vZGUuc2NhbGVYID0gLTE7XG4gICAgICAgICAgICBpZiAoa2VlcCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2tlZXBFZmZlY3RzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb24gPSBub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5vbignZmluaXNoZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFrZWVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fbWFwLmFkZEVmZmVjdChub2RlLCBsYXllcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjA3MzVIUFNyWkdhNitNUE1oa3Z3YnUnLCAnYm9vdF9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxib290X2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbG9hZGVkU2NlbmUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKEdsb2JhbC5pbml0dGVkICYmICF0aGlzLl9sb2FkZWRTY2VuZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9hZGVkU2NlbmUgPSB0cnVlO1xuICAgICAgICAgICAgR2FtZVV0aWwubG9hZFNjZW5lKFwibG9hZGluZ1wiKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmJjYzAzZVkrMU4zWm0xQWFYcFppWlUnLCAnYnVmZmVyX3RhYmxlJyk7XG4vLyBzY3JpcHRcXHV0aWxcXGJ1ZmZlcl90YWJsZS5qc1xuXG5tb2R1bGUuZXhwb3J0c1snY2xhc3MnXSA9IGNjLkNsYXNzKHtcblxuICAgIGN0b3I6IGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xuICAgICAgICB0aGlzLl9mcmVlSWR4ID0gW107XG4gICAgICAgIHRoaXMuX3RhYmxlID0gW107XG4gICAgfSxcblxuICAgIGFsbG9jSW5kZXg6IGZ1bmN0aW9uIGFsbG9jSW5kZXgoKSB7XG4gICAgICAgIHZhciByZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy5fZnJlZUlkeC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLl9mcmVlSWR4LnBvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWR4Kys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQob2JqKSB7XG4gICAgICAgIHZhciBpZHggPSB0aGlzLmFsbG9jSW5kZXgoKTtcbiAgICAgICAgaWYgKGlkeCA+PSB0aGlzLl90YWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlkeCA9IHRoaXMuX3RhYmxlLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlLnB1c2gob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlW2lkeF0gPSBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkeDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQnlJbmRleDogZnVuY3Rpb24gcmVtb3ZlQnlJbmRleChpZHgpIHtcbiAgICAgICAgaWYgKGlkeCA+PSB0aGlzLl90YWJsZS5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5fdGFibGVbaWR4XTtcbiAgICAgICAgdGhpcy5fdGFibGVbaWR4XSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2ZyZWVJZHgucHVzaChpZHgpO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICByZW1vdmVCeU9iamVjdDogZnVuY3Rpb24gcmVtb3ZlQnlPYmplY3Qob2JqKSB7XG4gICAgICAgIGlmIChvYmogPT09IG51bGwpIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3RhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdGFibGVbaV0gPT0gb2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQnlJbmRleChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiBnZXRPYmplY3QoaWR4KSB7XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fdGFibGUubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlW2lkeF07XG4gICAgfSxcblxuICAgIGVhY2g6IGZ1bmN0aW9uIGVhY2goZnVuYykge1xuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3RhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdGFibGVbaV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmdW5jKGksIHRoaXMuX3RhYmxlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZDQ1MjZwSzM5RWQ3dFFRVXpjZWVRSCcsICdjb2luX25vdF9lbm91Z2gnKTtcbi8vIHNjcmlwdFxcdWlcXGNvaW5fbm90X2Vub3VnaC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybCA9IHRoaXMuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgfSxcblxuICAgIG9uRXhjaGFuZ2VCdXR0b25DbGljazogZnVuY3Rpb24gb25FeGNoYW5nZUJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdleGNoYW5nZV9jb2luJyk7XG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2FuY2VsQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzMxZTQyaGw1UnhFbUpnQTJGUnJmbm8xJywgJ2NvbnRyb2xfZGVmaW5lJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGNvbnRyb2xfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENvbnRyb2xLZXk6IHtcbiAgICAgICAgTk9ORTogMCxcbiAgICAgICAgVVA6IDEsXG4gICAgICAgIERPV046IDIsXG4gICAgICAgIExFRlQ6IDMsXG4gICAgICAgIFJJR0hUOiA0LFxuICAgICAgICBKVU1QOiA1LFxuICAgICAgICBISVQ6IDYsXG4gICAgICAgIFNLSUxMMTogNyxcbiAgICAgICAgU0tJTEwyOiA4LFxuICAgICAgICBTS0lMTDM6IDksXG4gICAgICAgIFNLSUxMNDogMTAsXG4gICAgICAgIFNLSUxMNTogMTEsXG4gICAgICAgIFNLSUxMNjogMTJcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDM3MzNVcUFXQkFySXVPbjJHWkdmVGMnLCAnZW4nKTtcbi8vIHNjcmlwdFxcaTE4blxcZGF0YVxcZW4uanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJHV19HQU1FXCI6IFwiR1cgR2FtZVwiXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzc3YTVZZDN5SkdPcFhLbE5qUzBvVzMnLCAnZXhjaGFuZ2VfY29pbicpO1xuLy8gc2NyaXB0XFx1aVxcZXhjaGFuZ2VfY29pbi5qc1xuXG52YXIgZXhjaGFuZ2VQb2ludHMgPSBbMSwgNiwgMzgsIDk4LCA1ODgsIDE2ODhdO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG93bkxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcmF0ZUxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgaXRlbUNvbnRlbnQ6IGNjLk5vZGUsXG4gICAgICAgIGl0ZW1QcmVmYWI6IGNjLlByZWZhYlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VSYXRlID0gR2xvYmFsLmFjY291bnRNb2R1bGUuZXhjaGFuZ2VSYXRlO1xuICAgICAgICB0aGlzLl9vd25Qb2ludCA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLnNjb3JlTnVtO1xuXG4gICAgICAgIHRoaXMucmF0ZUxhYmVsLnN0cmluZyA9IGNjLmpzLmZvcm1hdFN0cihHYW1lTGFuZy50KCdleGNoYW5nZV9mb3JtYXQnKSwgMSwgdGhpcy5fZXhjaGFuZ2VSYXRlKTtcbiAgICAgICAgdGhpcy5vd25MYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnb3duX3BvaW50X2Zvcm1hdCcpLCB0aGlzLl9vd25Qb2ludCk7XG5cbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9FWENIQU5HRV9HT0xELCB0aGlzLm9uRXhjaGFuZ2VTdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2V4Y2hhbmdlSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleGNoYW5nZVBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLml0ZW1QcmVmYWIpO1xuXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpO1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gZXhjaGFuZ2VQb2ludHNbaV07XG4gICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnZXhjaGFuZ2VfZm9ybWF0JyksIHBvaW50LCBwb2ludCAqIHRoaXMuX2V4Y2hhbmdlUmF0ZSk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b24gPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuQnV0dG9uKTtcbiAgICAgICAgICAgIHZhciBldmVudEhhbmRsZXIgPSBuZXcgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcigpO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIuY29tcG9uZW50ID0gXCJleGNoYW5nZV9jb2luXCI7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIuaGFuZGxlciA9IFwib25JdGVtRXhjaGFuZ2VCdXR0b25DbGlja1wiO1xuICAgICAgICAgICAgYnV0dG9uLm5vZGUudGFnID0gaTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGlja0V2ZW50cy5wdXNoKGV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5pdGVtQ29udGVudDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkV4Y2hhbmdlU3VjY2VzczogZnVuY3Rpb24gb25FeGNoYW5nZVN1Y2Nlc3MoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIG9uSXRlbUV4Y2hhbmdlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uSXRlbUV4Y2hhbmdlQnV0dG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgcG9pbnQgPSBleGNoYW5nZVBvaW50c1t0YXJnZXQudGFnXTtcbiAgICAgICAgdmFyIGNvaW4gPSBwb2ludCAqIHRoaXMuX2V4Y2hhbmdlUmF0ZTtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBtZXNzYWdlOiBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnY29uZmlybV9leGNoYW5nZV9jb2luJyksIHBvaW50LCBjb2luKSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjayhidXR0b25JZCkge1xuICAgICAgICAgICAgICAgIGlmIChidXR0b25JZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBHYW1lUnBjLkNsdDJTcnYuZXhjaGFuZ2VHb2xkKGNvaW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdtZXNzYWdlX2JveCcsIGRhdGEpO1xuICAgIH0sXG5cbiAgICBvbkNsb3NlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xvc2VCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2QxZTI2RG1BMDVKaExWL1d1RFZ1TmlFJywgJ2V4aXRfY29uZmlybV9kaWFsb2cnKTtcbi8vIHNjcmlwdFxcY29tbW9uXFxleGl0X2NvbmZpcm1fZGlhbG9nLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgb25Pa0J1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbk9rQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNhbmNlbEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk0NzA2bGkxWjlNV1lEVkpwTWN4SVZDJywgJ2Zsb2F0X21lc3NhZ2VfY3RybCcpO1xuLy8gc2NyaXB0XFx1aVxcZmxvYXRfbWVzc2FnZV9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBmbG9hdE1lc3NhZ2VDb250YWluZXI6IGNjLk5vZGVcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCB0aGlzLm9uTWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9tZXNzYWdlSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VIYW5kbGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgb25NZXNzYWdlOiBmdW5jdGlvbiBvbk1lc3NhZ2UoZXZlbnRUeXBlLCBtZXNzYWdlKSB7XG4gICAgICAgIGNjLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuXG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgbGFiZWwuc3RyaW5nID0gbWVzc2FnZTtcblxuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNlcXVlbmNlKG5ldyBjYy5TcGF3bihuZXcgY2MuTW92ZUJ5KDEsIG5ldyBjYy5WZWMyKDAsIDEwMCkpLCBuZXcgY2MuRmFkZU91dCgxKSksIG5ldyBjYy5DYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5mbG9hdE1lc3NhZ2VDb250YWluZXI7XG4gICAgICAgIG5vZGUucnVuQWN0aW9uKGFjdGlvbik7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWQ2OGRXSXlHWkZwSXNJSUoxWEFHMHQnLCAnZ2FtZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxnYW1lX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBwaHlzaWNhbE5vZGVzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdHlwZTogW2NjLk5vZGVdXG4gICAgICAgIH0sXG5cbiAgICAgICAgY291bnREb3duTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29pbkxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIG1heFBoeXNpY2FsOiA1LFxuICAgICAgICBjaGFyZ2VQaHlzaWNhbFRpbWU6IDYwMFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlNYW5hZ2VyID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCgndWlfbWFuYWdlcicpO1xuICAgICAgICB0aGlzLl9waHlzaWNhbFBvaW50cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGh5c2ljYWxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBoeXNpY2FsTm9kZXNbaV07XG4gICAgICAgICAgICB0aGlzLl9waHlzaWNhbFBvaW50cy5wdXNoKG5vZGUuZ2V0Q29tcG9uZW50KCdwaHlzaWNhbF9wb2ludCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvdW50RG93blRpbWUgPSAwO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvdW50RG93bigpO1xuXG4gICAgICAgIHRoaXMuX3BoeXNpY2FsID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuXG4gICAgICAgIHRoaXMuX2NvdW50dGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX29uQ291bnREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5vbkNvdW50RG93bigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0SGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fU1RBUlRfR0FNRSwgdGhpcy5vblN0YXJ0R2FtZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9HRVRfR0FNRV9EQVRBLCB0aGlzLm9uR2V0R2FtZURhdGEuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fRVhDSEFOR0VfR09MRCwgdGhpcy5vbkV4Y2hhbmdlQ29pbi5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fYnV5UGh5c2ljYWxIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9CVVlfUEhZU0lDQUwsIHRoaXMub25CdXlGdWxsUGh5c2ljYWwuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fc3RhcnRIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2dldEdhbWVEYXRhSGFuZGxlcik7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9leGNoYW5nZUhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fYnV5UGh5c2ljYWxIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fYnV5UGh5c2ljYWxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RhcnRIYW5kbGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBHYW1lUnBjLkNsdDJTcnYuZ2V0R2FtZURhdGEoKTtcbiAgICB9LFxuXG4gICAgcmVzZXRDb3VudERvd246IGZ1bmN0aW9uIHJlc2V0Q291bnREb3duKCkge1xuICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lKTtcbiAgICB9LFxuXG4gICAgc3RhcnRDb3VudERvd246IGZ1bmN0aW9uIHN0YXJ0Q291bnREb3duKHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50dGluZykgcmV0dXJuO1xuICAgICAgICB0aGlzLl9jb3VudHRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lID0gdGltZTtcbiAgICAgICAgdGhpcy51cGRhdGVDb3VudERvd24oKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl9vbkNvdW50RG93biwgMSk7XG4gICAgfSxcblxuICAgIHN0b3BDb3VudERvd246IGZ1bmN0aW9uIHN0b3BDb3VudERvd24oKSB7XG4gICAgICAgIGlmICghdGhpcy5fY291bnR0aW5nKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2NvdW50dGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fb25Db3VudERvd24pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVDb3VudERvd246IGZ1bmN0aW9uIHVwZGF0ZUNvdW50RG93bigpIHtcbiAgICAgICAgdGhpcy5jb3VudERvd25MYWJlbC5zdHJpbmcgPSBUaW1lVXRpbC5zZWNUb01TKHRoaXMuX2NvdW50RG93blRpbWUpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVQaHlzaWNhbDogZnVuY3Rpb24gdXBkYXRlUGh5c2ljYWwoKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLl9waHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDA7XG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy5tYXhQaHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDE7XG4gICAgfSxcblxuICAgIGNoYXJnZVBoeXNpY2FsOiBmdW5jdGlvbiBjaGFyZ2VQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsID49IHRoaXMubWF4UGh5c2ljYWwpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwrKztcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgIH0sXG5cbiAgICBjb3N0UGh5c2ljYWw6IGZ1bmN0aW9uIGNvc3RQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwtLTtcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25BZGRDb2luQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQWRkQ29pbkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLl91aU1hbmFnZXIub3BlblVJKCdleGNoYW5nZV9jb2luJyk7XG4gICAgfSxcblxuICAgIG9uQ291bnREb3duOiBmdW5jdGlvbiBvbkNvdW50RG93bigpIHtcbiAgICAgICAgdGhpcy5fY291bnREb3duVGltZS0tO1xuICAgICAgICBpZiAodGhpcy5fY291bnREb3duVGltZSA8IDApIHRoaXMuX2NvdW50RG93blRpbWUgPSAwO1xuICAgICAgICBpZiAodGhpcy5fY291bnREb3duVGltZSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jaGFyZ2VQaHlzaWNhbCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsIDwgdGhpcy5tYXhQaHlzaWNhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50RG93blRpbWUgPSB0aGlzLmNoYXJnZVBoeXNpY2FsVGltZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wQ291bnREb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDb3VudERvd24oKTtcbiAgICB9LFxuXG4gICAgb25CdXlGdWxsUGh5c2ljYWw6IGZ1bmN0aW9uIG9uQnV5RnVsbFBoeXNpY2FsKCkge1xuICAgICAgICB0aGlzLmNvaW5MYWJlbC5zdHJpbmcgPSBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtO1xuICAgICAgICB0aGlzLl9waHlzaWNhbCA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLnBvd2VyO1xuICAgICAgICB0aGlzLnVwZGF0ZVBoeXNpY2FsKCk7XG4gICAgICAgIHRoaXMucmVzZXRDb3VudERvd24oKTtcbiAgICB9LFxuXG4gICAgb25FeGNoYW5nZUNvaW46IGZ1bmN0aW9uIG9uRXhjaGFuZ2VDb2luKCkge1xuICAgICAgICB0aGlzLmNvaW5MYWJlbC5zdHJpbmcgPSBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtO1xuICAgIH0sXG5cbiAgICBvbkdldEdhbWVEYXRhOiBmdW5jdGlvbiBvbkdldEdhbWVEYXRhKCkge1xuICAgICAgICB0aGlzLmNvaW5MYWJlbC5zdHJpbmcgPSBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtO1xuICAgICAgICB0aGlzLl9waHlzaWNhbCA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLnBvd2VyO1xuICAgICAgICB0aGlzLnVwZGF0ZVBoeXNpY2FsKCk7XG4gICAgICAgIHRoaXMucmVzZXRDb3VudERvd24oKTtcbiAgICB9LFxuXG4gICAgb25TdGFydEdhbWU6IGZ1bmN0aW9uIG9uU3RhcnRHYW1lKCkge1xuICAgICAgICBHYW1lVXRpbC5sb2FkU2NlbmUoJ2JhdHRsZScpO1xuICAgIH0sXG5cbiAgICBvblBsYXlCdXR0b25DbGljazogZnVuY3Rpb24gb25QbGF5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmNvc3RQaHlzaWNhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5zdGFydEdhbWUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3VpTWFuYWdlci5vcGVuVUkoJ3BoeXNpY2FsX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJlZ2lzdGVCdXR0b25DbGljazogZnVuY3Rpb24gb25SZWdpc3RlQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLkFORFJPSUQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC9BcHBBY3Rpdml0eVwiO1xuICAgICAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gXCJxdWlja1JlZ2lzdGVyXCI7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IFwiKClWXCI7XG4gICAgICAgICAgICAgICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChjbGFzc05hbWUsIG1ldGhvZE5hbWUsIG1ldGhvZFNpZ25hdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Gb3JnZXRCdXR0b25DbGljazogZnVuY3Rpb24gb25Gb3JnZXRCdXR0b25DbGljaygpIHtcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuQU5EUk9JRCkge1xuICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBcIm9yZy9jb2NvczJkeC9qYXZhc2NyaXB0L0FwcEFjdGl2aXR5XCI7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBcInF1aWNrUmVnaXN0ZXJcIjtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kU2lnbmF0dXJlID0gXCIoKVZcIjtcbiAgICAgICAgICAgICAgICBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKGNsYXNzTmFtZSwgbWV0aG9kTmFtZSwgbWV0aG9kU2lnbmF0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzA4NjBhdGJCVkZTNnhIN0lGYU5USjMnLCAnZ2FtZV9ldmVudF9kaXNwYXRjaGVyJyk7XG4vLyBzY3JpcHRcXGV2ZW50XFxnYW1lX2V2ZW50X2Rpc3BhdGNoZXIuanNcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24gZW1pdChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV07XG4gICAgICAgIGlmIChoYW5kbGVycykge1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzW2tdKGV2ZW50VHlwZSwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiBhZGRFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdO1xuICAgICAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcnNba10gPT0gaGFuZGxlcikgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICAgICAgaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdID0gaGFuZGxlcnM7XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB7IHR5cGU6IGV2ZW50VHlwZSwgaWQ6IGhhbmRsZXJzLmxlbmd0aCAtIDEgfTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiByZW1vdmVFdmVudEhhbmRsZXIoZW5pdHkpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fbGlzdGVuZXJzW2VuaXR5LnR5cGVdO1xuICAgICAgICBpZiAoaGFuZGxlcnMgJiYgZW5pdHkuaWQgPj0gMCAmJiBlbml0eS5pZCA8IGhhbmRsZXJzLmxlbmd0aCkgaGFuZGxlcnMuc3BsaWNlKGVuaXR5LmlkLCAxKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQWxsRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiByZW1vdmVBbGxFdmVudEhhbmRsZXIoZXZlbnRUeXBlKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdID0gbnVsbDtcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FjZGQ3ek1zcEJQSTdjTFczOTNaN1dhJywgJ2dhbWVfZXZlbnQnKTtcbi8vIHNjcmlwdFxcZXZlbnRcXGdhbWVfZXZlbnQuanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgT05fSFRUUF9SRVFVRVNUOiAweDAwMDAwMDAxLFxuICAgIE9OX0hUVFBfUkVTUE9ORDogMHgwMDAwMDAwMixcbiAgICBPTl9ORVRXT1JLX0VSUk9SOiAweDAwMDAwMDAzLFxuXG4gICAgT05fTE9HSU5fUkVTVUxUOiAweDAwMDEwMDAxLFxuICAgIE9OX0dFVF9HQU1FX0RBVEE6IDB4MDAwMTAwMDIsXG4gICAgT05fRVhDSEFOR0VfR09MRDogMHgwMDAxMDAwMyxcbiAgICBPTl9TVEFSVF9HQU1FOiAweDAwMDEwMDA0LFxuICAgIE9OX0JVWV9QSFlTSUNBTDogMHgwMDAxMDAwNSxcbiAgICBPTl9CVVlfVElNRV9UT19QTEFZOiAweDAwMDEwMDA2LFxuXG4gICAgT05fUkVUVVJOX0dBTUU6IDB4MDAwMjAwMDIsXG5cbiAgICBPTl9GTE9BVF9NRVNTQUdFOiAweDAwMDMwMDAxXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTZmZmNKeklxdEVWb0lhTkR5dm1sUGonLCAnZ2FtZV9uZXQnKTtcbi8vIHNjcmlwdFxcbmV0d29ya1xcZ2FtZV9uZXQuanNcblxudmFyIEh0dHBDb25uZWN0aW9uID0gcmVxdWlyZSgnaHR0cF9jb25uZWN0aW9uJylbJ2NsYXNzJ107XG52YXIgSHR0cFV0aWwgPSByZXF1aXJlKCdodHRwX3V0aWwnKTtcbnZhciBHYW1lUHJvdG9jb2wgPSByZXF1aXJlKCdnYW1lX3Byb3RvY29sJyk7XG5cbm1vZHVsZS5leHBvcnRzWydjbGFzcyddID0gY2MuQ2xhc3Moe1xuXG4gICAgY3RvcjogZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5faHR0cFJlYXVlc3RJbmZvID0gbnVsbDtcbiAgICAgICAgdGhpcy5faHR0cEhhbmRsZXJzID0ge307XG4gICAgICAgIHRoaXMuX2h0dHBDb25uZWN0aW9uID0gbmV3IEh0dHBDb25uZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuX2h0dHBDb25uZWN0aW9uLnNldENpcGhlckNvZGUoJ2Z3ZV4qJjNpamNkaGY0NTU0MycpO1xuICAgICAgICB0aGlzLl9odHRwQ29ubmVjdGlvbi5zZXRSZXNwb25kQ2FsbGJhY2sodGhpcy5odHRwUmVzcG9uZC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmV0cnlIdHRwUmVxdWVzdDogZnVuY3Rpb24gcmV0cnlIdHRwUmVxdWVzdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9odHRwUmVhdWVzdEluZm8pIHJldHVybjtcbiAgICAgICAgdGhpcy5odHRwUmVxdWVzdCh0aGlzLl9odHRwUmVhdWVzdEluZm8uZGF0YSwgdGhpcy5faHR0cFJlYXVlc3RJbmZvLmNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaHR0cFJlcXVlc3Q6IGZ1bmN0aW9uIGh0dHBSZXF1ZXN0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0hUVFBfUkVRVUVTVCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHByb3RvY29sSWQgPSBkYXRhLmdhbWVNc2dJZDtcbiAgICAgICAgdmFyIHVybCA9IEdhbWVQcm90b2NvbC5VUkxzW3Byb3RvY29sSWRdO1xuICAgICAgICB0aGlzLmFkZEh0dHBSZXNwb25kTGlzdGVuZXIocHJvdG9jb2xJZCwgZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlSHR0cFJlc3BvbmRMaXN0ZW5lcihwcm90b2NvbElkKTtcbiAgICAgICAgICAgIHNlbGYuX2h0dHBSZWF1ZXN0SW5mbyA9IG51bGw7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIGNhbGxiYWNrKGpzb24pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5faHR0cFJlYXVlc3RJbmZvID0geyBkYXRhOiBkYXRhLCBjYWxsYmFjazogY2FsbGJhY2sgfTtcbiAgICAgICAgdGhpcy5faHR0cENvbm5lY3Rpb24ucmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH0sXG5cbiAgICBodHRwUmVzcG9uZDogZnVuY3Rpb24gaHR0cFJlc3BvbmQoc3RhdHMsIGpzb24pIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fSFRUUF9SRVNQT05EKTtcbiAgICAgICAgaWYgKHN0YXRzID09IEh0dHBVdGlsLlN0YXRzLk9LKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlciA9IHRoaXMuX2h0dHBIYW5kbGVyc1tqc29uLmRhdGEuZ2FtZU1zZ0lkXTtcbiAgICAgICAgICAgIGhhbmRsZXIgJiYgaGFuZGxlcihqc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX05FVFdPUktfRVJST1IpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVIdHRwUmVzcG9uZExpc3RlbmVyKHRoaXMuX2h0dHBSZWF1ZXN0SW5mby5kYXRhLmdhbWVNc2dJZCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkSHR0cFJlc3BvbmRMaXN0ZW5lcjogZnVuY3Rpb24gYWRkSHR0cFJlc3BvbmRMaXN0ZW5lcihwcm90b2NvbElkLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuX2h0dHBIYW5kbGVyc1twcm90b2NvbElkXSA9IGhhbmRsZXI7XG4gICAgfSxcblxuICAgIHJlbW92ZUh0dHBSZXNwb25kTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZUh0dHBSZXNwb25kTGlzdGVuZXIocHJvdG9jb2xJZCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLl9odHRwSGFuZGxlcnNbcHJvdG9jb2xJZF0gPSBudWxsO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmY2Y3YzNZRFBKSnRybDVqWmpTYzNyUCcsICdnYW1lX3Byb3RvY29sJyk7XG4vLyBzY3JpcHRcXG5ldHdvcmtcXGdhbWVfcHJvdG9jb2wuanNcblxudmFyIF9VUkxzO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgUHJvdG9jb2wgPSB7XG4gICAgTE9HSU46IDEsXG4gICAgR0VUX0RBVEE6IDIsXG4gICAgRVhDSEFOR0VfR09MRDogMyxcbiAgICBTVEFSVF9HQU1FOiA0LFxuICAgIEZVTExfUE9XRVI6IDUsXG4gICAgQ09OVElOVUVfR0FNRTogNixcbiAgICBSRVNVTFRfR0FNRTogN1xufTtcbm1vZHVsZS5leHBvcnRzLlByb3RvY29sID0gUHJvdG9jb2w7XG5cbnZhciBVUkxzID0gKF9VUkxzID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuTE9HSU4sIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9pbmRleC9sb2dpblwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5HRVRfREFUQSwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL1Nob3VyZW5sYWlsZS9pbmRleD90eXBlPWdldEdhbWVEYXRhXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLkVYQ0hBTkdFX0dPTEQsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9pbmRleC9leGNoYW5nZVwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5TVEFSVF9HQU1FLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vU2hvdXJlbmxhaWxlL2luZGV4P3R5cGU9c3RhcnRHYW1lXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLkZVTExfUE9XRVIsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9TaG91cmVubGFpbGUvaW5kZXg/dHlwZT1idXlGdWxsUG93ZXJcIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuQ09OVElOVUVfR0FNRSwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL1Nob3VyZW5sYWlsZS9pbmRleD90eXBlPWJ1eVRpbWVUb1BsYXlHYW1lXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLlJFU1VMVF9HQU1FLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vU2hvdXJlbmxhaWxlL2luZGV4P3R5cGU9Z2FtZVJlc3VsdFwiKSwgX1VSTHMpO1xubW9kdWxlLmV4cG9ydHMuVVJMcyA9IFVSTHM7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiMDc3ZWhKUE9CRDNLZFZ4czN0bGIxSScsICdnYW1lX3JwYycpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxnYW1lX3JwYy5qc1xuXG52YXIgR2FtZVByb3RvY29sID0gcmVxdWlyZShcImdhbWVfcHJvdG9jb2xcIik7XG5cbnZhciBTcnYyQ2x0ID0ge1xuICAgIHJldExvZ2luOiBmdW5jdGlvbiByZXRMb2dpbihqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldExvZ2luOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkgR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuID0ganNvbi5kYXRhLnRva2VuO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9MT0dJTl9SRVNVTFQsIGpzb24pO1xuICAgIH0sXG5cbiAgICByZXRHZXRHYW1lRGF0YTogZnVuY3Rpb24gcmV0R2V0R2FtZURhdGEoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRHZXRHYW1lRGF0YTpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmlzVmlwID0ganNvbi5kYXRhLmlzVklQO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA9IGpzb24uZGF0YS5nb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuc2NvcmVOdW0gPSBqc29uLmRhdGEuc2NvcmVOdW07XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5uaWNrTmFtZSA9IGpzb24uZGF0YS5uaWtlbmFtZTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmlzRmlyc3RMb2dpbiA9IGpzb24uZGF0YS5pc0ZpcnN0O1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubWF4U2NvcmUgPSBqc29uLmRhdGEubWF4U2NvcmU7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5wb3dlciA9IGpzb24uZGF0YS5wb3dlcjtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm5leHRQb3dlclRpbWUgPSBqc29uLmRhdGEubmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmV4Y2hhbmdlUmF0ZSA9IGpzb24uZGF0YS5vbmVJbnRlZ3JhbEdvbGROdW07XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9HRVRfR0FNRV9EQVRBKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXRFeGNoYW5nZUdvbGQ6IGZ1bmN0aW9uIHJldEV4Y2hhbmdlR29sZChqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldEV4Y2hhbmdlR29sZDpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW0gPSBqc29uLmRhdGEuZ29sZE51bTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLnNjb3JlTnVtID0ganNvbi5kYXRhLnNjb3JlTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRVhDSEFOR0VfR09MRCk7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBHYW1lTGFuZy50KCdleGNoYW5nZV9zdWNjZXNzJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXRTdGFydEdhbWU6IGZ1bmN0aW9uIHJldFN0YXJ0R2FtZShqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldFN0YXJ0R2FtZTpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm1heFNjb3JlID0ganNvbi5kYXRhLm1heFNjb3JlO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXIgPSBqc29uLmRhdGEucG93ZXI7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lID0ganNvbi5kYXRhLm5leHRQb3dlclRpbWU7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9TVEFSVF9HQU1FKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0QnV5RnVsbFBoeXNpY2FsOiBmdW5jdGlvbiByZXRCdXlGdWxsUGh5c2ljYWwoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRCdXlGdWxsUGh5c2ljYWw6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtID0ganNvbi5kYXRhLmdvbGROdW07XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5wb3dlciA9IGpzb24uZGF0YS5wb3dlcjtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm5leHRQb3dlclRpbWUgPSBqc29uLmRhdGEubmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0JVWV9QSFlTSUNBTCk7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBHYW1lTGFuZy50KCdidXlfcGh5c2ljYWxfc3VjY2VzcycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0QnV5VGltZVRvUGxheUdhbWU6IGZ1bmN0aW9uIHJldEJ1eVRpbWVUb1BsYXlHYW1lKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0QnV5VGltZVRvUGxheUdhbWU6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtID0ganNvbi5kYXRhLmdvbGROdW07XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9CVVlfVElNRV9UT19QTEFZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0R2FtZVJlc3VsdDogZnVuY3Rpb24gcmV0R2FtZVJlc3VsdChqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldEdhbWVSZXN1bHQ6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5tYXhTY29yZSA9IGpzb24uZGF0YS5tYXhTY29yZTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0dBTUVfUkVTVUxUKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMuU3J2MkNsdCA9IFNydjJDbHQ7XG5cbnZhciBDbHQyU3J2ID0ge1xuICAgIGxvZ2luOiBmdW5jdGlvbiBsb2dpbihhY2NvdW50LCBwYXNzd2QpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuTE9HSU4sXG4gICAgICAgICAgICBhY2NvdW50OiBhY2NvdW50LFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3ZFxuICAgICAgICB9LCBTcnYyQ2x0LnJldExvZ2luKTtcbiAgICB9LFxuXG4gICAgZ2V0R2FtZURhdGE6IGZ1bmN0aW9uIGdldEdhbWVEYXRhKCkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5HRVRfREFUQSxcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW5cbiAgICAgICAgfSwgU3J2MkNsdC5yZXRHZXRHYW1lRGF0YSk7XG4gICAgfSxcblxuICAgIGV4Y2hhbmdlR29sZDogZnVuY3Rpb24gZXhjaGFuZ2VHb2xkKGdvbGQpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuRVhDSEFOR0VfR09MRCxcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW4sXG4gICAgICAgICAgICBuZWVkR29sZDogZ29sZFxuICAgICAgICB9LCBTcnYyQ2x0LnJldEV4Y2hhbmdlR29sZCk7XG4gICAgfSxcblxuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5TVEFSVF9HQU1FLFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlblxuICAgICAgICB9LCBTcnYyQ2x0LnJldFN0YXJ0R2FtZSk7XG4gICAgfSxcblxuICAgIGJ1eUZ1bGxQaHlzaWNhbDogZnVuY3Rpb24gYnV5RnVsbFBoeXNpY2FsKCkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5GVUxMX1BPV0VSLFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlblxuICAgICAgICB9LCBTcnYyQ2x0LnJldEJ1eUZ1bGxQaHlzaWNhbCk7XG4gICAgfSxcblxuICAgIGJ1eVRpbWVUb1BsYXlHYW1lOiBmdW5jdGlvbiBidXlUaW1lVG9QbGF5R2FtZSh0aW1lcykge1xuICAgICAgICBjYy5sb2coJ2J1eVRpbWVUb1BsYXlHYW1lJywgdGltZXMpO1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5DT05USU5VRV9HQU1FLFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlbixcbiAgICAgICAgICAgIGxldmVsOiB0aW1lc1xuICAgICAgICB9LCBTcnYyQ2x0LnJldEJ1eVRpbWVUb1BsYXlHYW1lKTtcbiAgICB9LFxuXG4gICAgZ2FtZVJlc3VsdDogZnVuY3Rpb24gZ2FtZVJlc3VsdChzY29yZSkge1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldC5odHRwUmVxdWVzdCh7XG4gICAgICAgICAgICB0eXBlOiBHbG9iYWwuZ2FtZVR5cGUsXG4gICAgICAgICAgICBnYW1lTXNnSWQ6IEdhbWVQcm90b2NvbC5Qcm90b2NvbC5DT05USU5VRV9HQU1FLFxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlbixcbiAgICAgICAgICAgIHNjb3JlOiBzY29yZVxuICAgICAgICB9LCBTcnYyQ2x0LnJldEdhbWVSZXN1bHQpO1xuICAgIH1cbn07XG5tb2R1bGUuZXhwb3J0cy5DbHQyU3J2ID0gQ2x0MlNydjtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUwMzE2Q0RSd3RMVjdjWUZRUTBDWExRJywgJ2dhbWVfdXRpbCcpO1xuLy8gc2NyaXB0XFx1dGlsXFxnYW1lX3V0aWwuanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBsb2FkU2NlbmU6IGZ1bmN0aW9uIGxvYWRTY2VuZShuYW1lKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShuYW1lKTtcbiAgICAgICAgLypjYy5kaXJlY3Rvci5wcmVsb2FkU2NlbmUobmFtZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUobmFtZSk7XHJcbiAgICAgICAgfSk7Ki9cbiAgICB9XG5cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhODQwZElmZGdoQzg1WmJEUENXaTFNMycsICdodHRwX2Nvbm5lY3Rpb24nKTtcbi8vIHNjcmlwdFxcbmV0d29ya1xcY29ubmVjdGlvblxcaHR0cF9jb25uZWN0aW9uLmpzXG5cbnZhciBIdHRwVXRpbCA9IHJlcXVpcmUoXCJodHRwX3V0aWxcIik7XG52YXIgWFhURUEgPSByZXF1aXJlKFwieHh0ZWFcIik7XG5cbm1vZHVsZS5leHBvcnRzW1wiY2xhc3NcIl0gPSBjYy5DbGFzcyh7XG4gICAgY3RvcjogZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2lwaGVyQ29kZSA9ICdxMXcyZTNyNHQ1eTZ1N2k4bzlwMCc7XG4gICAgICAgIHRoaXMuX3Jlc3BvbmRDYWxsYmFjayA9IG51bGw7XG4gICAgfSxcblxuICAgIHNldENpcGhlckNvZGU6IGZ1bmN0aW9uIHNldENpcGhlckNvZGUoY29kZSkge1xuICAgICAgICB0aGlzLl9jaXBoZXJDb2RlID0gY29kZTtcbiAgICB9LFxuXG4gICAgc2V0UmVzcG9uZENhbGxiYWNrOiBmdW5jdGlvbiBzZXRSZXNwb25kQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fcmVzcG9uZENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSxcblxuICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIHJlcXVlc3QodXJsLCBkYXRhKSB7XG4gICAgICAgIHZhciBqc29uID0gWFhURUEudXRmMTZ0bzgoSlNPTi5zdHJpbmdpZnkoZGF0YSkudHJpbSgpKTtcbiAgICAgICAgdmFyIGVuY3J5cHQgPSBYWFRFQS5lbmNyeXB0KGpzb24sIHRoaXMuX2NpcGhlckNvZGUpO1xuICAgICAgICB2YXIgZW5jb2RlID0gWFhURUEuYmFzZTY0ZW5jb2RlKGVuY3J5cHQpO1xuICAgICAgICBlbmNvZGUgPSBlbmNvZGUucmVwbGFjZSgvXFwrL2csICclMkInKTtcbiAgICAgICAgSHR0cFV0aWwucmVxdWVzdCh1cmwsIEh0dHBVdGlsLk1ldGhvZC5QT1NULCB7IG1zZ0RhdGE6IGVuY29kZSB9LCB0aGlzLnJlc3BvbmQuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHJlc3BvbmQ6IGZ1bmN0aW9uIHJlc3BvbmQoc3RhdHMsIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZXNwb25kQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChzdGF0cyA9PSBIdHRwVXRpbC5TdGF0cy5PSykge1xuICAgICAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlY29kZSA9IFhYVEVBLmJhc2U2NGRlY29kZShqc29uLm1zZ0RhdGEpO1xuICAgICAgICAgICAgICAgIHZhciBkZWNyeXB0ID0gWFhURUEuZGVjcnlwdChkZWNvZGUsIHRoaXMuX2NpcGhlckNvZGUpO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gSlNPTi5wYXJzZShkZWNyeXB0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25kQ2FsbGJhY2soc3RhdHMsIHsgY29kZToganNvbi5SZXN1bHRDb2RlLCBkYXRhOiBjb250ZW50IH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0cyA9PSBIdHRwVXRpbC5TdGF0cy5GQUlMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzcG9uZENhbGxiYWNrKHN0YXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzQyY2M5aXVGOVBvck4zY2xJbkhYNEwnLCAnaHR0cF91dGlsJyk7XG4vLyBzY3JpcHRcXGxpYlxcdXRpbFxcaHR0cF91dGlsLmpzXG5cbnZhciBNZXRob2QgPSB7XG4gICAgR0VUOiAnR0VUJyxcbiAgICBQT1NUOiAnUE9TVCdcbn07XG5cbnZhciBTdGF0cyA9IHtcbiAgICBPSzogMCxcbiAgICBGQUlMOiAxXG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2QgPSBNZXRob2Q7XG5cbm1vZHVsZS5leHBvcnRzLlN0YXRzID0gU3RhdHM7XG5cbm1vZHVsZS5leHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiAodXJsLCBtZXRob2QsIGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgdmFyIHhociA9IGNjLmxvYWRlci5nZXRYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmxvZygnb25yZWFkeXN0YXRlY2hhbmdlJyk7XG4gICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmIHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhTdGF0cy5PSywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhTdGF0cy5GQUlMKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgaXNGaXJzdCA9IHRydWU7XG4gICAgdmFyIGFyZ1N0cmluZyA9ICcnO1xuICAgIGZvciAodmFyIGtleSBpbiBhcmdzKSB7XG4gICAgICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgICAgICBhcmdTdHJpbmcgKz0ga2V5ICsgXCI9XCIgKyBhcmdzW2tleV07XG4gICAgICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdTdHJpbmcgKz0gJyYnICsga2V5ICsgJz0nICsgYXJnc1trZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCA9PT0gTWV0aG9kLkdFVCkge1xuICAgICAgICBpZiAoYXJnU3RyaW5nLmxlbmd0aCA9PT0gMCkgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO2Vsc2UgeGhyLm9wZW4obWV0aG9kLCB1cmwgKyBhcmdTdHJpbmcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBNZXRob2QuUE9TVCkge1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0LUVuY29kaW5nXCIsIFwiZ3ppcCwgZGVmbGF0ZVwiKTtcblxuICAgIFsnbG9hZHN0YXJ0JywgJ2Fib3J0JywgJ2Vycm9yJywgJ2xvYWQnLCAnbG9hZGVuZCcsICd0aW1lb3V0J10uZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRuYW1lKSB7XG4gICAgICAgIHhocltcIm9uXCIgKyBldmVudG5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2MubG9nKFwiXFxuRXZlbnQgOiBcIiArIGV2ZW50bmFtZSk7XG4gICAgICAgICAgICBpZiAoZXZlbnRuYW1lID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudG5hbWUgPT09ICdsb2FkZW5kJyAmJiAhc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFN0YXRzLkZBSUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgaWYgKG1ldGhvZCA9PT0gTWV0aG9kLkdFVCkge1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBNZXRob2QuUE9TVCkge1xuICAgICAgICB4aHIuc2VuZChhcmdTdHJpbmcpO1xuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjNGE3ZUlBb2doTVJKUVdZcllKS0xPNScsICdodXJkbGVfY2ZnJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xcZGF0YVxcaHVyZGxlX2NmZy5qc1xuXG4vKlxyXG7or7TmmI5cclxuICAgIGNtZFR5cGXvvIjmjIfku6TnsbvlnovvvIlcclxuICAgICAgICAx77yaY29udHJvbGVuYWJsZWRcclxuICAgICAgICAy77ya6ZSB5a6a5Yy65Z+fXHJcbiAgICAgICAgM++8muWIt+aAqiBpZO+8iOaAqueJqWlk77yJIHBvc++8iOWIt+aAquWdkOagh++8iWRpcu+8iOaWueWQkSAtMeW3piAx5Y+z77yJXHJcbiAgICAgICAgNO+8muW8gOWni1xyXG4gICAgICAgIDU6IGdvZ29nb1xyXG5cclxuICAgIGNvbmRUeXBl77yI5a6M5oiQ5p2h5Lu277yJXHJcbiAgICAgICAgMe+8muadgOaAquaVsCBudW3vvIjmnYDmgKrmlbDph4/vvIlcclxuXHJcbiAgICBldmVudFxyXG4gICAgICAgIDE65pe26Ze0XHJcbiAgICAgICAgMu+8muWcsOWbvuWMuuWfn1xyXG4qL1xuXG5tb2R1bGUuZXhwb3J0cy5kYXRhID0gW3tcbiAgICBpZDogMSxcbiAgICBtYXBJZDogMSxcbiAgICBib3JuUG9zOiB7IHg6IDQ1MCwgeTogMjM1IH0sXG4gICAgbWlzc2lvbjogW3tcbiAgICAgICAgdHJpZ2dlcnM6IFt7XG4gICAgICAgICAgICBldmVudDogMSxcbiAgICAgICAgICAgIHBhcmFtOiAwLFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGVuYWJsZWQ6IGZhbHNlIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAuNSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiB0cnVlIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAxLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgZW5hYmxlZDogdHJ1ZSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBldmVudDogMixcbiAgICAgICAgICAgIHBhcmFtOiB7IHg6IDgwMCwgeTogMCwgd2lkdGg6IDEyMDAsIGhlaWdodDogNjQwIH0sXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogZmFsc2UgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDE1MDAsIHk6IDI3MCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAxNjAwLCB5OiAxODUgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMTUwMCwgeTogMTAwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sXG4gICAgICAgIGNvbmQ6IFt7IGNvbmRUeXBlOiAxLCBudW06IDMgfV1cbiAgICB9LCB7XG4gICAgICAgIHRyaWdnZXJzOiBbe1xuICAgICAgICAgICAgZXZlbnQ6IDEsXG4gICAgICAgICAgICBwYXJhbTogMCxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAwLCB5OiAwLCB3aWR0aDogNDAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiB0cnVlIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAyLFxuICAgICAgICAgICAgcGFyYW06IHsgeDogMjYwMCwgeTogMCwgd2lkdGg6IDMwMCwgaGVpZ2h0OiA2NDAgfSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiBmYWxzZSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHg6IDIwMDAsIHk6IDAsIHdpZHRoOiAyMDAwLCBoZWlnaHQ6IDY0MCB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMjcwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDEwMCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAxODUgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMzYwMCwgeTogMTg1IH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sXG4gICAgICAgIGNvbmQ6IFt7IGNvbmRUeXBlOiAxLCBudW06IDQgfV1cbiAgICB9LCB7XG4gICAgICAgIHRyaWdnZXJzOiBbe1xuICAgICAgICAgICAgZXZlbnQ6IDEsXG4gICAgICAgICAgICBwYXJhbTogMCxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAyMDAwLCB5OiAwLCB3aWR0aDogNDAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiB0cnVlIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAyLFxuICAgICAgICAgICAgcGFyYW06IHsgeDogNDYwMCwgeTogMCwgd2lkdGg6IDMwMCwgaGVpZ2h0OiA2NDAgfSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDUsXG4gICAgICAgICAgICAgICAgYXJnczogeyBzaG93OiBmYWxzZSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMixcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHg6IDQwMDAsIHk6IDAsIHdpZHRoOiAyMDAwLCBoZWlnaHQ6IDY0MCB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMjcwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDEwMCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAxODUgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogNTQwMCwgeTogMTYwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDU0MDAsIHk6IDIyMCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgICAgICBjb25kOiBbeyBjb25kVHlwZTogMSwgbnVtOiA1IH1dXG4gICAgfSwge1xuICAgICAgICB0cmlnZ2VyczogW3tcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAsXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA0LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogNTUzNSwgeTogMTcwIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAyLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBldmVudDogMixcbiAgICAgICAgICAgIHBhcmFtOiB7IHg6IDU0ODAsIHk6IDEyMCwgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDAgfSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDYsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMCB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XSxcbiAgICAgICAgY29uZDogW3sgY29uZFR5cGU6IDIgfV1cbiAgICB9XVxufV07XG5cbi8qe1xyXG4gICAgY21kOiBbXHJcbiAgICAgICAgeyBjbWRUeXBlOiA0LCB2YWx1ZTogZmFsc2UgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDEgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfSwgdGltZTogMiwgY2FtZXJhOiBmYWxzZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDUsIHBvczogeyB4OiAyNTAwLCB5OiAxODV9LCB0aW1lOiAyLCBkaXI6IDEgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDEsIHJhbmdlOiB7IHg6IDMwMDAsIHk6IDAsIHdpZHRoOiAxMDAwLCBoZWlnaHQ6IDY0MCB9LCB0aW1lOiAxLjUsIGNhbWVyYTogdHJ1ZSwgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMjcwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDEwMCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAxODUgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogMzYwMCwgeTogMTg1IH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiAyMDAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfSwgdGltZTogMS41LCBjYW1lcmE6IHRydWUsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiA0LCB2YWx1ZTogdHJ1ZSB9LFxyXG4gICAgXSxcclxuICAgIGNvbmQ6IFtcclxuICAgICAgICB7IGNvbmRUeXBlOiAxLCBudW06IDQgfSxcclxuICAgIF0sXHJcbn0sXHJcbntcclxuICAgIGNtZDogW1xyXG4gICAgICAgIHsgY21kVHlwZTogNCwgdmFsdWU6IGZhbHNlIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAxIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH0sIHRpbWU6IDIsIGNhbWVyYTogZmFsc2UsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiA1LCBwb3M6IHsgeDogNDUwMCwgeTogMTg1fSwgdGltZTogMiwgZGlyOiAxIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiA1MDAwLCB5OiAwLCB3aWR0aDogMTAwMCwgaGVpZ2h0OiA2NDAgfSwgdGltZTogMS41LCBjYW1lcmE6IHRydWUsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDI3MCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAxMDAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMTg1IH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDU0MDAsIHk6IDE2MCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiA1NDAwLCB5OiAyMjAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDIsIHRpbWU6IDIgfSwgXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiA0MDAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfSwgdGltZTogMS41LCBjYW1lcmE6IHRydWUsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiA0LCB2YWx1ZTogdHJ1ZSB9LFxyXG4gICAgXSxcclxuICAgIGNvbmQ6IFtcclxuICAgICAgICB7IGNvbmRUeXBlOiAxLCBudW06IDUgfSxcclxuICAgIF0sXHJcbn0sKi9cblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI1MGVhY1RRcEJMWUk1LzNYclVMSTJYJywgJ2h1cmRsZV9kZWZpbmUnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcaHVyZGxlX2RlZmluZS5qc1xuXG5tb2R1bGUuZXhwb3J0cy5UcmlnZ2VyVHlwZSA9IHtcbiAgICBOT05FOiAwLFxuICAgIFRJTUU6IDEsXG4gICAgQVJFQTogMlxufTtcblxubW9kdWxlLmV4cG9ydHMuQ21kVHlwZSA9IHtcbiAgICBOT05FOiAwLFxuICAgIENPTlRST0xfRU5BQkxFRDogMSxcbiAgICBMT0NLX0FSRUE6IDIsXG4gICAgQ1JFQVRFX01PTjogMyxcbiAgICBTSE9XX1RSQU5TX0RPT1I6IDQsXG4gICAgU0hPV19NT1ZFX1RJUFM6IDUsXG4gICAgQ0hBTkdFX0hVUkRMRTogNixcbiAgICBNT1ZFX0NBTUVSQTogN1xufTtcblxubW9kdWxlLmV4cG9ydHMuQ29uZFR5cGUgPSB7XG4gICAgTk9ORTogMCxcbiAgICBUT1RBTF9NT05fS0lMTDogMSxcbiAgICBDT05GSUdfQ1VTVE9NOiAyXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYWY2ZDNQNTFwOUtFSUpvMkdDeDNXS2EnLCAnaHVyZGxlX3Byb3ZpZGVyJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xccHJvdmlkZXJcXGh1cmRsZV9wcm92aWRlci5qc1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnaHVyZGxlX2NmZycpLmRhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldENvbmZpZzogZnVuY3Rpb24gZ2V0Q29uZmlnKGlkKSB7XG4gICAgICAgIHJldHVybiBjZmdbaWRdO1xuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhNDgyMGc2OW1CTHA3dGxDWmZEM01ERScsICdpMThuJyk7XG4vLyBzY3JpcHRcXGkxOG5cXGkxOG4uanNcblxudmFyIFBvbHlnbG90ID0gcmVxdWlyZSgncG9seWdsb3QnKTtcbnZhciBsYW5ndWFnZSA9IHJlcXVpcmUoJ3poJyk7IC8vIHVwZGF0ZSB0aGlzIHRvIHNldCB5b3VyIGRlZmF1bHQgZGlzcGxheWluZyBsYW5ndWFnZSBpbiBlZGl0b3JcblxuLy8gbGV0IHBvbHlnbG90ID0gbnVsbDtcbnZhciBwb2x5Z2xvdCA9IG5ldyBQb2x5Z2xvdCh7IHBocmFzZXM6IGxhbmd1YWdlIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKipcclxuICAgICAqIFRoaXMgbWV0aG9kIGFsbG93IHlvdSB0byBzd2l0Y2ggbGFuZ3VhZ2UgZHVyaW5nIHJ1bnRpbWUsIGxhbmd1YWdlIGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgc2FtZSBhcyB5b3VyIGRhdGEgZmlsZSBuYW1lIFxyXG4gICAgICogc3VjaCBhcyB3aGVuIGxhbmd1YWdlIGlzICd6aCcsIGl0IHdpbGwgbG9hZCB5b3VyICd6aC5qcycgZGF0YSBzb3VyY2UuXHJcbiAgICAgKiBAbWV0aG9kIGluaXQgXHJcbiAgICAgKiBAcGFyYW0gbGFuZ3VhZ2UgLSB0aGUgbGFuZ3VhZ2Ugc3BlY2lmaWMgZGF0YSBmaWxlIG5hbWUsIHN1Y2ggYXMgJ3poJyB0byBsb2FkICd6aC5qcydcclxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQobGFuZ3VhZ2UpIHtcbiAgICAgICAgdmFyIGRhdGEgPSByZXF1aXJlKGxhbmd1YWdlKTtcbiAgICAgICAgcG9seWdsb3QucmVwbGFjZShkYXRhKTtcbiAgICB9LFxuICAgIC8qKlxyXG4gICAgICogdGhpcyBtZXRob2QgdGFrZXMgYSB0ZXh0IGtleSBhcyBpbnB1dCwgYW5kIHJldHVybiB0aGUgbG9jYWxpemVkIHN0cmluZ1xyXG4gICAgICogUGxlYXNlIHJlYWQgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyBmb3IgZGV0YWlsc1xyXG4gICAgICogQG1ldGhvZCB0XHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGxvY2FsaXplZCBzdHJpbmdcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBcclxuICAgICAqIHZhciBteVRleHQgPSBpMThuLnQoJ01ZX1RFWFRfS0VZJyk7XHJcbiAgICAgKiBcclxuICAgICAqIC8vIGlmIHlvdXIgZGF0YSBzb3VyY2UgaXMgZGVmaW5lZCBhcyBcclxuICAgICAqIC8vIHtcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwifVxyXG4gICAgICogLy8geW91IGNhbiB1c2UgdGhlIGZvbGxvd2luZyB0byBpbnRlcnBvbGF0ZSB0aGUgdGV4dCBcclxuICAgICAqIHZhciBncmVldGluZ1RleHQgPSBpMThuLnQoJ2hlbGxvX25hbWUnLCB7bmFtZTogJ25hbnRhcyd9KTsgLy8gSGVsbG8sIG5hbnRhc1xyXG4gICAgICovXG4gICAgdDogZnVuY3Rpb24gdChrZXksIG9wdCkge1xuICAgICAgICByZXR1cm4gcG9seWdsb3QudChrZXksIG9wdCk7XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzVmMWEwLzVpOTFLeHJzSm43MVBHZlkyJywgJ2luaXRfY29uZmlnJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xcaW5pdF9jb25maWcuanNcblxubW9kdWxlLmV4cG9ydHMuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBHbG9iYWwuaHVyZGxlUHJvdmlkZXIgPSByZXF1aXJlKCdodXJkbGVfcHJvdmlkZXInKTtcbiAgICBHbG9iYWwuc2tpbGxQcm92aWRlciA9IHJlcXVpcmUoJ3NraWxsX3Byb3ZpZGVyJyk7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2U5NDhqNDNzSkRBNGVPVGZhc3RqTGknLCAnaW5pdF9tb2R1bGUnKTtcbi8vIHNjcmlwdFxcbW9kdWxlXFxpbml0X21vZHVsZS5qc1xuXG52YXIgTG9naW5Nb2R1bGUgPSByZXF1aXJlKCdsb2dpbl9tb2R1bGUnKVsnY2xhc3MnXTtcbnZhciBBY2NvdW50TW9kdWxlID0gcmVxdWlyZSgnYWNjb3VudF9tb2R1bGUnKVsnY2xhc3MnXTtcblxubW9kdWxlLmV4cG9ydHMuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBHbG9iYWwubG9naW5Nb2R1bGUgPSBuZXcgTG9naW5Nb2R1bGUoKTtcbiAgICBHbG9iYWwuYWNjb3VudE1vZHVsZSA9IG5ldyBBY2NvdW50TW9kdWxlKCk7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2ZkNDg2WjB4cE10WWFpNGRTM2pnZHInLCAnam95X2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcam95X2N0cmwuanNcblxudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0aWNrOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBzdGlja01vdmVSYWRpdXM6IDEwMCxcblxuICAgICAgICBzdGlja0tpY2tiYWNrVGltZTogMC4zLFxuXG4gICAgICAgIGJhY2tncm91bmRMb3dBbHBoYTogNTAsXG5cbiAgICAgICAgYmFja2dyb3VuZEhpZ2hBbHBoYTogMjU1LFxuXG4gICAgICAgIGJhY2tncm91bmRGYWRlVGltZTogMC4yXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9tb3ZlUG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fZGlyY3Rpb24gPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQub3BhY2l0eSA9IHRoaXMuYmFja2dyb3VuZExvd0FscGhhO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25Ub3VjaENhbmNlbCwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBsYXllcjogZnVuY3Rpb24gc2V0UGxheWVyKHBsYXllcikge1xuICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsID0gcGxheWVyO1xuICAgIH0sXG5cbiAgICBvblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIG9uVG91Y2hTdGFydChldmVudCkge1xuICAgICAgICB0aGlzLmRvU3RhcnRTdGFmZigpO1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB0aGlzLm5vZGUuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0aWNrUG9zaXRpb24obG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICBvblRvdWNoTW92ZTogZnVuY3Rpb24gb25Ub3VjaE1vdmUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gdGhpcy5ub2RlLmNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlKGV2ZW50KTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGlja1Bvc2l0aW9uKGxvY2F0aW9uKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaEVuZDogZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaENhbmNlbDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlU3RpY2tQb3NpdGlvbjogZnVuY3Rpb24gdXBkYXRlU3RpY2tQb3NpdGlvbihsb2NhdGlvbikge1xuICAgICAgICB2YXIgcmFkaXVzID0gTWF0aC5zcXJ0KE1hdGgucG93KGxvY2F0aW9uLngsIDIpICsgTWF0aC5wb3cobG9jYXRpb24ueSwgMikpO1xuICAgICAgICBpZiAocmFkaXVzID4gdGhpcy5zdGlja01vdmVSYWRpdXMpIHtcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IHRoaXMuc3RpY2tNb3ZlUmFkaXVzIC8gcmFkaXVzO1xuICAgICAgICAgICAgbG9jYXRpb24ueCAqPSBzY2FsZTtcbiAgICAgICAgICAgIGxvY2F0aW9uLnkgKj0gc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9jYXRpb24ueCA9PT0gMCAmJiBsb2NhdGlvbi55ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLmF0YW4yKGxvY2F0aW9uLngsIGxvY2F0aW9uLnkpO1xuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKDE4MCAtIHIgKiAxODAgLyBNYXRoLlBJKSAtIDY3LjU7XG4gICAgICAgICAgICBpZiAoZCA8IDApIGQgPSAzNjAgKyBkO1xuICAgICAgICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDQ1KTtcblxuICAgICAgICAgICAgc3dpdGNoIChkKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RpY2sueCA9IGxvY2F0aW9uLng7XG4gICAgICAgIHRoaXMuc3RpY2sueSA9IGxvY2F0aW9uLnk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPT0gMSA/IHRoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LlJJR0hUKSA6IHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5SSUdIVCk7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID09IC0xID8gdGhpcy5fcGxheWVyQ3RybC5rZXlEb3duKENvbnRyb2xLZXkuTEVGVCkgOiB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuTEVGVCk7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID09IDEgPyB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5VUCkgOiB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuVVApO1xuICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9PSAtMSA/IHRoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LkRPV04pIDogdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LkRPV04pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvU3RhcnRTdGFmZjogZnVuY3Rpb24gZG9TdGFydFN0YWZmKCkge1xuICAgICAgICB0aGlzLnN0aWNrLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgdGltZSA9ICh0aGlzLmJhY2tncm91bmRIaWdoQWxwaGEgLSB0aGlzLmJhY2tncm91bmQub3BhY2l0eSkgLyAodGhpcy5iYWNrZ3JvdW5kSGlnaEFscGhhIC0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGEpICogdGhpcy5iYWNrZ3JvdW5kRmFkZVRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZVRvKHRpbWUsIHRoaXMuYmFja2dyb3VuZEhpZ2hBbHBoYSk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZG9FbmRTdGFmZjogZnVuY3Rpb24gZG9FbmRTdGFmZigpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciB0aW1lID0gKHRoaXMuYmFja2dyb3VuZC5vcGFjaXR5IC0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGEpIC8gKHRoaXMuYmFja2dyb3VuZEhpZ2hBbHBoYSAtIHRoaXMuYmFja2dyb3VuZExvd0FscGhhKSAqIHRoaXMuYmFja2dyb3VuZEZhZGVUaW1lO1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVUbyh0aW1lLCB0aGlzLmJhY2tncm91bmRMb3dBbHBoYSk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICBhY3Rpb24gPSBuZXcgY2MuTW92ZVRvKHRoaXMuc3RpY2tLaWNrYmFja1RpbWUsIDAsIDApO1xuICAgICAgICBhY3Rpb24uZWFzaW5nKG5ldyBjYy5lYXNlQmFja091dCgpKTtcbiAgICAgICAgdGhpcy5zdGljay5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMDtcbiAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5SSUdIVCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuTEVGVCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuVVApO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LkRPV04pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldERpcmVjdGlvbjogZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlyY3Rpb247XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzUzOTdSQ1NSOUZuTENxR1YxL1o2YUQnLCAnbG9hZGluZ19jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxsb2FkaW5nX2N0cmwuanNcblxudmFyIFNUQVRFX0RFRkFVTFQgPSAtMTtcbnZhciBTVEFURV9DSEVDS19VUERBVEUgPSAwO1xudmFyIFNUQVRFX1VQREFUSU5HID0gMTtcbnZhciBTVEFURV9MT0FEX0FTU0VUUyA9IDI7XG52YXIgU1RBVEVfSU5JVF9HQU1FID0gMztcbnZhciBTVEFURV9FTlRFUl9HQU1FID0gNDtcbnZhciBTVEFURV9ET05FID0gNTtcblxudmFyIExvYWRpbmdTdGF0ZUluZm8gPSBbe1xuICAgIHN0YXJ0OiAwLFxuICAgIGVuZDogMC4wMixcbiAgICBsYW5nOiAnY2hlY2tpbmdfdXBkYXRlJ1xufSwge1xuICAgIHN0YXJ0OiAwLjAyLFxuICAgIGVuZDogMC4wNSxcbiAgICBsYW5nOiAndXBkYXRpbmdfYXNzZXRzJ1xufSwge1xuICAgIHN0YXJ0OiAwLjA1LFxuICAgIGVuZDogMC45LFxuICAgIGxhbmc6ICdsb2FkaW5nX2Fzc2V0cydcbn0sIHtcbiAgICBzdGFydDogMC45LFxuICAgIGVuZDogMSxcbiAgICBsYW5nOiAnaW5pdHRpbmdfZ2FtZSdcbn0sIHtcbiAgICBzdGFydDogMSxcbiAgICBlbmQ6IDEsXG4gICAgbGFuZzogJ2VudGVyaW5nX2dhbWUnXG59XTtcblxudmFyIFBhbmVsVHlwZSA9IHtcbiAgICBOT05FOiAwLFxuICAgIENPTkZJUk06IDEsXG4gICAgU1RBUlRfVVBEQVRFOiAyLFxuICAgIFJFVFJZX1VQREFURTogM1xufTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHJlbW90ZUFzc2V0UGF0aDogJ3JlbW90ZV9hc3NzZXQnLFxuXG4gICAgICAgIGxvY2FsTWFuaWZlc3Q6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuUmF3QXNzZXRcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVQYW5lbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZU1lc3NhZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlUHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByb2dyZXNzQmFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ29uZmlybUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUNhbmNlbEJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ2FuY2VsTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ01lc3NhZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ1BlcmNlbnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ1Byb2dyZXNzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Qcm9ncmVzc0JhclxuICAgICAgICB9LFxuXG4gICAgICAgIGxvYWRpbmdQYXJ0aWNsZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUGFydGljbGVTeXN0ZW1cbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkQXNzZXRUaW1lOiAyLFxuICAgICAgICBlbnRlckdhbWVUaW1lOiAxXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IFNUQVRFX0RFRkFVTFQ7XG4gICAgICAgIHRoaXMuX25lZWRVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmVlZFJldHJ5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvYWRBc3NldFN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMubG9hZGluZ1BlcmNlbnQuc3RyaW5nID0gJyc7XG4gICAgICAgIHRoaXMubG9hZGluZ01lc3NhZ2Uuc3RyaW5nID0gJyc7XG4gICAgICAgIHRoaXMubG9hZGluZ1BhcnRpY2xlLm5vZGUueCA9IC0yNDkuNTtcbiAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLk5PTkUpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGVja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlVXBkYXRlTGlzdGVuZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2FtKSB7XG4gICAgICAgICAgICB0aGlzLl9hbS5yZWxlYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9hbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlQ2hlY2tMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlQ2hlY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoZWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9jaGVja0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZVVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVVcGRhdGVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy8g5Y+q5pyJ5Y6f55Sf5Luj56CB6ZyA6KaB55So54Ot5pu05paw5Yqf6IO9XG4gICAgICAgIC8vdGhpcy5zZXRTdGF0ZShjYy5zeXMuaXNOYXRpdmUgPyBTVEFURV9DSEVDS19VUERBVEUgOiBTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfTE9BRF9BU1NFVFMpO1xuICAgIH0sXG5cbiAgICBzZXRTdGF0ZTogZnVuY3Rpb24gc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IHN0YXRlKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgIGlmIChzdGF0ZSAhPSBTVEFURV9ERUZBVUxUICYmIHN0YXRlICE9IFNUQVRFX0RPTkUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZ1BlcmNlbnQoTG9hZGluZ1N0YXRlSW5mb1tzdGF0ZV0uc3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KExvYWRpbmdTdGF0ZUluZm9bc3RhdGVdLmxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfQ0hFQ0tfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfVVBEQVRJTkc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0xPQURfQVNTRVRTOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRMb2FkQXNzZXRzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0lOSVRfR0FNRTpcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0VOVEVSX0dBTUU6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEVudGVyR2FtZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRVcGRhdGVQZXJjZW50OiBmdW5jdGlvbiBzZXRVcGRhdGVQZXJjZW50KHBlcmNlbnQpIHtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwKSBwZXJjZW50ID0gMDtlbHNlIGlmIChwZXJjZW50ID4gMSkgcGVyY2VudCA9IDE7XG4gICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCd1cGRhdGVfcGVyY2VudCcpICsgTWF0aC5jZWlsKHBlcmNlbnQgKiAxMDApLnRvU3RyaW5nKCkgKyBcIiVcIjtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5wcm9ncmVzcyA9IHBlcmNlbnQ7XG4gICAgfSxcblxuICAgIHNldExvYWRpbmdQZXJjZW50OiBmdW5jdGlvbiBzZXRMb2FkaW5nUGVyY2VudChwZXJjZW50KSB7XG4gICAgICAgIGlmIChwZXJjZW50IDwgMCkgcGVyY2VudCA9IDA7ZWxzZSBpZiAocGVyY2VudCA+IDEpIHBlcmNlbnQgPSAxO1xuICAgICAgICB0aGlzLmxvYWRpbmdQZXJjZW50LnN0cmluZyA9IE1hdGguY2VpbChwZXJjZW50ICogMTAwKS50b1N0cmluZygpICsgXCIlXCI7XG4gICAgICAgIHRoaXMubG9hZGluZ1Byb2dyZXNzLnByb2dyZXNzID0gcGVyY2VudDtcbiAgICAgICAgdGhpcy5sb2FkaW5nUGFydGljbGUubm9kZS54ID0gcGVyY2VudCAqIDQ5OSAtIDI0OS41O1xuICAgIH0sXG5cbiAgICBjaGVja0NiOiBmdW5jdGlvbiBjaGVja0NiKGV2ZW50KSB7XG4gICAgICAgIGNjLmxvZygnQ29kZTogJyArIGV2ZW50LmdldEV2ZW50Q29kZSgpKTtcblxuICAgICAgICB2YXIgbmVlZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZ2V0RXZlbnRDb2RlKCkpIHtcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9OT19MT0NBTF9NQU5JRkVTVDpcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJObyBsb2NhbCBtYW5pZmVzdCBmaWxlIGZvdW5kLCBob3QgdXBkYXRlIHNraXBwZWQuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfTE9BRF9BU1NFVFMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX0RPV05MT0FEX01BTklGRVNUOlxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX1BBUlNFX01BTklGRVNUOlxuICAgICAgICAgICAgICAgIGNjLmxvZyhcIkZhaWwgdG8gZG93bmxvYWQgbWFuaWZlc3QgZmlsZSwgaG90IHVwZGF0ZSBza2lwcGVkLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0xPQURfQVNTRVRTKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5BTFJFQURZX1VQX1RPX0RBVEU6XG4gICAgICAgICAgICAgICAgY2MubG9nKFwiQWxyZWFkeSB1cCB0byBkYXRlIHdpdGggdGhlIGxhdGVzdCByZW1vdGUgdmVyc2lvbi5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuTkVXX1ZFUlNJT05fRk9VTkQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLkNPTkZJUk0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBuZWVkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZFJlbW92ZSkgdGhpcy5yZW1vdmVDaGVja0xpc3RlbmVyKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZUNiOiBmdW5jdGlvbiB1cGRhdGVDYihldmVudCkge1xuICAgICAgICB2YXIgbmVlZFJlc3RhcnQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZhaWxlZCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmdldEV2ZW50Q29kZSgpKSB7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX1BST0dSRVNTSU9OOlxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50ID0gZXZlbnQuZ2V0UGVyY2VudCgpO1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50QnlGaWxlID0gZXZlbnQuZ2V0UGVyY2VudEJ5RmlsZSgpO1xuICAgICAgICAgICAgICAgIHZhciBtc2cgPSBldmVudC5nZXRNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG1zZykgY2MubG9nKG1zZyk7XG4gICAgICAgICAgICAgICAgY2MubG9nKHBlcmNlbnQudG9GaXhlZCgyKSArICclJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcGRhdGVQZXJjZW50KHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX0ZJTklTSEVEOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnVXBkYXRlIGZpbmlzaGVkLiAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBuZWVkUmVzdGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9OT19MT0NBTF9NQU5JRkVTVDpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ05vIGxvY2FsIG1hbmlmZXN0IGZpbGUgZm91bmQsIGhvdCB1cGRhdGUgc2tpcHBlZC4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfRE9XTkxPQURfTUFOSUZFU1Q6XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfUEFSU0VfTUFOSUZFU1Q6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdGYWlsIHRvIGRvd25sb2FkIG1hbmlmZXN0IGZpbGUsIGhvdCB1cGRhdGUgc2tpcHBlZC4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuQUxSRUFEWV9VUF9UT19EQVRFOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnQWxyZWFkeSB1cCB0byBkYXRlIHdpdGggdGhlIGxhdGVzdCByZW1vdGUgdmVyc2lvbi4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX0ZBSUxFRDpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ1VwZGF0ZSBmYWlsZWQuICcgKyBldmVudC5nZXRNZXNzYWdlKCkpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfVVBEQVRJTkc6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdBc3NldCB1cGRhdGUgZXJyb3I6ICcgKyBldmVudC5nZXRBc3NldElkKCkgKyAnLCAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX0RFQ09NUFJFU1M6XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjYy5sb2coZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmFpbGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVVwZGF0ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLl9uZWVkUmV0cnkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLlJFVFJZX1VQREFURSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZFJlc3RhcnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVXBkYXRlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hQYXRocyA9IGpzYi5maWxlVXRpbHMuZ2V0U2VhcmNoUGF0aHMoKTtcbiAgICAgICAgICAgIHZhciBuZXdQYXRocyA9IHRoaXMuX2FtLmdldExvY2FsTWFuaWZlc3QoKS5nZXRTZWFyY2hQYXRocygpO1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQoc2VhcmNoUGF0aHMsIG5ld1BhdGhzKTtcbiAgICAgICAgICAgIC8vY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdIb3RVcGRhdGVTZWFyY2hQYXRocycsIEpTT04uc3RyaW5naWZ5KHNlYXJjaFBhdGhzKSk7XG4gICAgICAgICAgICBqc2IuZmlsZVV0aWxzLnNldFNlYXJjaFBhdGhzKHNlYXJjaFBhdGhzKTtcbiAgICAgICAgICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNoZWNrVXBkYXRlOiBmdW5jdGlvbiBjaGVja1VwZGF0ZSgpIHtcbiAgICAgICAgdmFyIHN0b3JhZ2VQYXRoID0gKGpzYi5maWxlVXRpbHMgPyBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpIDogJy8nKSArIHRoaXMucmVtb3RlQXNzZXRQYXRoO1xuICAgICAgICBjYy5sb2coJ1N0b3JhZ2UgcGF0aCBmb3IgcmVtb3RlIGFzc2V0IDogJyArIHN0b3JhZ2VQYXRoKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FtKSB7XG4gICAgICAgICAgICB0aGlzLl9hbSA9IG5ldyBqc2IuQXNzZXRzTWFuYWdlcih0aGlzLmxvY2FsTWFuaWZlc3QsIHN0b3JhZ2VQYXRoKTtcbiAgICAgICAgICAgIHRoaXMuX2FtLnJldGFpbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fYW0uZ2V0TG9jYWxNYW5pZmVzdCgpLmlzTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXIgPSBuZXcganNiLkV2ZW50TGlzdGVuZXJBc3NldHNNYW5hZ2VyKHRoaXMuX2FtLCB0aGlzLmNoZWNrQ2IuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHRoaXMuX2NoZWNrTGlzdGVuZXIsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYW0uY2hlY2tVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydExvYWRBc3NldHM6IGZ1bmN0aW9uIHN0YXJ0TG9hZEFzc2V0cygpIHtcbiAgICAgICAgdGhpcy5fbG9hZEFzc2V0U3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgIH0sXG5cbiAgICBzdGFydEVudGVyR2FtZTogZnVuY3Rpb24gc3RhcnRFbnRlckdhbWUoKSB7XG4gICAgICAgIHRoaXMuX2VudGVyR2FtZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLmVudGVyR2FtZVRpbWU7XG4gICAgfSxcblxuICAgIGluaXRHYW1lOiBmdW5jdGlvbiBpbml0R2FtZSgpIHtcbiAgICAgICAgcmVxdWlyZSgnaW5pdF9jb25maWcnKS5leGVjKCk7XG4gICAgICAgIHJlcXVpcmUoJ2luaXRfbW9kdWxlJykuZXhlYygpO1xuICAgIH0sXG5cbiAgICBlbnRlckdhbWU6IGZ1bmN0aW9uIGVudGVyR2FtZSgpIHtcbiAgICAgICAgR2FtZVV0aWwubG9hZFNjZW5lKFwibG9naW5cIik7XG4gICAgfSxcblxuICAgIHNob3dVcGRhdGVQYW5lbDogZnVuY3Rpb24gc2hvd1VwZGF0ZVBhbmVsKHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gUGFuZWxUeXBlLk5PTkUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFuZWwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhbmVsVHlwZS5DT05GSVJNOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbmZpcm1MYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdzdGFydF91cGRhdGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbExhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2V4aXRfZ2FtZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCdjb25maXJtX3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQYW5lbFR5cGUuU1RBUlRfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbEJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcGRhdGVQZXJjZW50KDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQYW5lbFR5cGUuUkVUUllfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbmZpcm1MYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdyZXRyeV91cGRhdGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbExhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2V4aXRfZ2FtZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCdmYWlsX3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGRvVXBkYXRlOiBmdW5jdGlvbiBkb1VwZGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hbSkgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMuX3VwZGF0ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0ZW5lciA9IG5ldyBqc2IuRXZlbnRMaXN0ZW5lckFzc2V0c01hbmFnZXIodGhpcy5fYW0sIHRoaXMudXBkYXRlQ2IuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfVVBEQVRJTkcpO1xuICAgICAgICB0aGlzLl9hbS51cGRhdGUoKTtcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2xpY2s6IGZ1bmN0aW9uIG9uQ29uZmlybUNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5fbmVlZFJldHJ5IHx8IHRoaXMuX25lZWRVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1VwZGF0ZVBhbmVsKFBhbmVsVHlwZS5TVEFSVF9VUERBVEUpO1xuICAgICAgICAgICAgdGhpcy5kb1VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2s6IGZ1bmN0aW9uIG9uQ2FuY2VsQ2xpY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0xPQURfQVNTRVRTOlxuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgLSB0aGlzLl9sb2FkQXNzZXRTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVFbGFwYXNlZCA+IHRoaXMubG9hZEFzc2V0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkQXNzZXRTdGFydFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0lOSVRfR0FNRSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGxvYWRJbmZvID0gTG9hZGluZ1N0YXRlSW5mb1tTVEFURV9MT0FEX0FTU0VUU107XG4gICAgICAgICAgICAgICAgdmFyIGFzc2V0TG9hZFBlcmNlbnQgPSB0aW1lRWxhcGFzZWQgLyB0aGlzLmxvYWRBc3NldFRpbWU7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsTG9hZFBlcmNlbnQgPSAobG9hZEluZm8uZW5kIC0gbG9hZEluZm8uc3RhcnQpICogYXNzZXRMb2FkUGVyY2VudCArIGxvYWRJbmZvLnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZ1BlcmNlbnQodG90YWxMb2FkUGVyY2VudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0lOSVRfR0FNRTpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0VOVEVSX0dBTUUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTVEFURV9FTlRFUl9HQU1FOlxuICAgICAgICAgICAgICAgIGlmIChHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgPj0gdGhpcy5fZW50ZXJHYW1lRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbnRlckdhbWVFbmRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnRlckdhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9ET05FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2ODBiY0xRc241Skg3R1lUWldIMURQUScsICdsb2dpbl9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxsb2dpbl9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBhY2NvdW50RWRpdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuXG4gICAgICAgIHBhc3N3ZEVkaXQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcblxuICAgICAgICBtc2dMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NvdW50U2VsZWN0UGFuZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NvdW50U2Nyb2xsVmlldzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlld1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWNjb3VudFNlbGVjdFBhbmVsLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucmVhZExvZ2luSW5mbygpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50KCk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50KCk7XG4gICAgfSxcblxuICAgIGFkZEV2ZW50OiBmdW5jdGlvbiBhZGRFdmVudCgpIHtcbiAgICAgICAgdGhpcy5fbG9naW5IYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9MT0dJTl9SRVNVTFQsIHRoaXMub25Mb2dpblJlc3VsdC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXZlbnQ6IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fbG9naW5IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fbG9naW5IYW5kbGVyID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc2F2ZUxvZ2luSW5mbzogZnVuY3Rpb24gc2F2ZUxvZ2luSW5mbygpIHtcbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50JywgdGhpcy5fbG9naW5BY2NvdW50KTtcbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHRoaXMuX2xvZ2luUGFzc3dkKTtcbiAgICB9LFxuXG4gICAgcmVhZExvZ2luSW5mbzogZnVuY3Rpb24gcmVhZExvZ2luSW5mbygpIHtcbiAgICAgICAgdGhpcy5fbG9naW5BY2NvdW50ID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2NvdW50JykgfHwgJyc7XG4gICAgICAgIHRoaXMuX2xvZ2luUGFzc3dkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwYXNzd29yZCcpIHx8ICcnO1xuICAgICAgICB0aGlzLmFjY291bnRFZGl0LnN0cmluZyA9IHRoaXMuX2xvZ2luQWNjb3VudDtcbiAgICAgICAgdGhpcy5wYXNzd2RFZGl0LnN0cmluZyA9IHRoaXMuX2xvZ2luUGFzc3dkO1xuICAgIH0sXG5cbiAgICBzZXRBY2NvdW50TGlzdDogZnVuY3Rpb24gc2V0QWNjb3VudExpc3QobGlzdCkge1xuICAgICAgICB0aGlzLmFjY291bnRTY3JvbGxWaWV3LmNvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrIGluIGxpc3QpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKCdwcmVmYWIvdWkvY29tcG9uZW50cy9hY2NvdW50X2l0ZW0nLCBjYy5QcmVmYWIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gbm9kZS5nZXRDaGlsZEJ5TmFtZSgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5nZXRDaGlsZEJ5TmFtZSgnbmFtZV9sYWJlbCcpLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGtleXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBsaXN0W2tleV07XG4gICAgICAgICAgICAgICAgYnV0dG9uLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NvdW50U2VsZWN0UGFuZWwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2xvZ2luQWNjb3VudCA9IGxpc3Rba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmxvZ2luKHNlbGYuX2xvZ2luQWNjb3VudCwgc2VsZi5fbG9naW5QYXNzd2QpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNlbGYuYWNjb3VudFNjcm9sbFZpZXcuY29udGVudC5hZGRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9naW5SZXN1bHQ6IGZ1bmN0aW9uIG9uTG9naW5SZXN1bHQoZXZlbnRUeXBlLCBkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmNvZGUgPT0gMSkge1xuICAgICAgICAgICAgY2MubG9nKFwiTG9naW4gU3VjY2Vzc1wiLCBkYXRhLmRhdGEudG9rZW4pO1xuICAgICAgICAgICAgdGhpcy5zYXZlTG9naW5JbmZvKCk7XG4gICAgICAgICAgICBHYW1lVXRpbC5sb2FkU2NlbmUoJ2dhbWUnKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmRhdGEuZ2FpTnVtYmVyKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJNdWx0aSBBY2NvdW50XCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRBY2NvdW50TGlzdChkYXRhLmRhdGEuZ2FpTnVtYmVyKTtcbiAgICAgICAgICAgIHRoaXMuYWNjb3VudFNlbGVjdFBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5sb2coXCJBY2NvdW50IG9yIFBhc3N3b3JkIGluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMubXNnTGFiZWwuc3RyaW5nID0gZGF0YS5kYXRhLmVycm9yTXNnO1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2dpbkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkxvZ2luQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIHZhciBhY2NvdW50ID0gdGhpcy5hY2NvdW50RWRpdC5zdHJpbmc7XG4gICAgICAgIHZhciBwYXNzd2QgPSB0aGlzLnBhc3N3ZEVkaXQuc3RyaW5nO1xuICAgICAgICBpZiAoYWNjb3VudC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdhY2NvdW50X25vdF9lbXB0eScpO1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhc3N3ZC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdwYXNzd2Rfbm90X2VtcHR5Jyk7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2luQWNjb3VudCA9IHRoaXMuYWNjb3VudEVkaXQuc3RyaW5nO1xuICAgICAgICB0aGlzLl9sb2dpblBhc3N3ZCA9IHRoaXMucGFzc3dkRWRpdC5zdHJpbmc7XG4gICAgICAgIEdhbWVScGMuQ2x0MlNydi5sb2dpbih0aGlzLl9sb2dpbkFjY291bnQsIHRoaXMuX2xvZ2luUGFzc3dkKTtcbiAgICB9LFxuXG4gICAgb25SZWdpc3RlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uUmVnaXN0ZUJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBjYy5sb2coXCJyZWdpc3RlXCIpO1xuICAgIH0sXG5cbiAgICBvbkZvcmdldEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkZvcmdldEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBjYy5sb2coXCJmb3JnZXRcIik7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUxMDM2UkdrM3hBajZsYWVDUFVUdDZ3JywgJ2xvZ2luX21vZHVsZScpO1xuLy8gc2NyaXB0XFxtb2R1bGVcXGxvZ2luX21vZHVsZS5qc1xuXG5tb2R1bGUuZXhwb3J0c1snY2xhc3MnXSA9IGNjLkNsYXNzKHtcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90b2tlbjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9rZW4gPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl90b2tlbiA9ICcnO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZGZjMWYvMzNKTG9wNjc4Z040VGRuVicsICdtYWluJyk7XG4vLyBzY3JpcHRcXG1haW4uanNcblxudmFyIFN5bmNUaW1lciA9IHJlcXVpcmUoJ3N5bmNfdGltZXInKVsnY2xhc3MnXTtcbnZhciBHYW1lTmV0ID0gcmVxdWlyZSgnZ2FtZV9uZXQnKVsnY2xhc3MnXTtcbnZhciBHYW1lRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcImdhbWVfZXZlbnRfZGlzcGF0Y2hlclwiKVsnY2xhc3MnXTtcblxud2luZG93LkdhbWVVdGlsID0gcmVxdWlyZSgnZ2FtZV91dGlsJyk7XG53aW5kb3cuVGltZVV0aWwgPSByZXF1aXJlKCd0aW1lX3V0aWwnKTtcblxud2luZG93LkdhbWVMYW5nID0gcmVxdWlyZSgnaTE4bicpO1xud2luZG93LkdhbWVScGMgPSByZXF1aXJlKCdnYW1lX3JwYycpO1xud2luZG93LkdhbWVFdmVudCA9IHJlcXVpcmUoJ2dhbWVfZXZlbnQnKTtcblxud2luZG93Lkdsb2JhbCA9IHt9O1xuR2xvYmFsLmluaXR0ZWQgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGNjLmdhbWUuYWRkUGVyc2lzdFJvb3ROb2RlKHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICghR2xvYmFsLmluaXR0ZWQpIHRoaXMuaW5pdCgpO2Vsc2UgdGhpcy5nYW1lVXBkYXRlKGR0KTtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVUeXBlID0gMzY7XG4gICAgICAgIEdsb2JhbC5zeW5jVGltZXIgPSBuZXcgU3luY1RpbWVyKCk7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0ID0gbmV3IEdhbWVOZXQoKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIgPSBuZXcgR2FtZUV2ZW50RGlzcGF0Y2hlcigpO1xuICAgICAgICBHbG9iYWwuaW5pdHRlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIGdhbWVVcGRhdGU6IGZ1bmN0aW9uIGdhbWVVcGRhdGUoZHQpIHtcbiAgICAgICAgR2xvYmFsLnN5bmNUaW1lci51cGRhdGUoZHQpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWI0YmVIZWRlaEVINmVMbnlXaFJObEMnLCAnbWFwX2N0cmwnKTtcbi8vIHNjcmlwdFxcbWFwXFxtYXBfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbG9ja1JlZ2lvbjoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQocmVnaW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xvY2tSZWdpb24uZXF1YWxzKHJlZ2lvbikpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAocmVnaW9uLnggPCAwKSByZWdpb24ueCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lvbi55IDwgMCkgcmVnaW9uLnkgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpb24ud2lkdGggPT09IDAgfHwgcmVnaW9uLnhNYXggPj0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoKSByZWdpb24ud2lkdGggPSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGggLSByZWdpb24ueDtcbiAgICAgICAgICAgICAgICBpZiAocmVnaW9uLmhlaWdodCA9PT0gMCB8fCByZWdpb24ueU1heCA+PSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0KSByZWdpb24uaGVpZ2h0ID0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCAtIHJlZ2lvbi55O1xuICAgICAgICAgICAgICAgIHRoaXMuX29sZExvY2tSZWdpb24gPSB0aGlzLl9jdXJyTG9ja1JlZ2lvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NrUmVnaW9uID0gcmVnaW9uLmNsb25lKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9ja1JlZ2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBsYXllclNpemU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5TaXplXVxuICAgICAgICB9LFxuXG4gICAgICAgIHZpZXdTaXplOiBuZXcgY2MuU2l6ZSgpXG4gICAgfSxcblxuICAgIGdldEN1cnJQb3NpdGlvbjogZnVuY3Rpb24gZ2V0Q3VyclBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VyclBvcztcbiAgICB9LFxuXG4gICAgZ2V0Q2FtZXJhUG9zaXRpb246IGZ1bmN0aW9uIGdldENhbWVyYVBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhQ3VyclBvaW50O1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fZW5pdGllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuX3RteExheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwidG14XCIpO1xuICAgICAgICB0aGlzLl90bXhDdHJsID0gdGhpcy5fdG14TGF5ZXIuZ2V0Q29tcG9uZW50KGNjLlRpbGVkTWFwKTtcbiAgICAgICAgdGhpcy5fZ3JvdW5kQ3RybCA9IHRoaXMuX3RteEN0cmwuZ2V0TGF5ZXIoXCJncm91bmRcIik7XG5cbiAgICAgICAgdGhpcy5fdGlsZVNpemUgPSB0aGlzLl90bXhDdHJsLmdldFRpbGVTaXplKCk7XG4gICAgICAgIHRoaXMuX21hcFNpemUgPSB0aGlzLl90bXhDdHJsLmdldE1hcFNpemUoKTtcbiAgICAgICAgdGhpcy5fbWFwUGl4ZXNTaXplID0gbmV3IGNjLlNpemUodGhpcy5fbWFwU2l6ZS53aWR0aCAqIHRoaXMuX3RpbGVTaXplLndpZHRoLCB0aGlzLl9tYXBTaXplLmhlaWdodCAqIHRoaXMuX3RpbGVTaXplLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5fbG9ja1ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9ja1kgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9ja1JlZ2lvbiA9IG5ldyBjYy5SZWN0KDAsIDAsIHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCwgdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5fcGl2b3RDdXJyID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fcGl2b3RTdGFydCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX3Bpdm90VGFyZ2V0ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VFbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9jdXJyUG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5faXNQb3NpdGlvbkRpcnR5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFDdXJyUG9pbnQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlZExvY2sgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9vdGhlckxheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwib3RoZXJfbGF5ZXJcIik7XG4gICAgICAgIHRoaXMuX29iamVjdExheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwib2JqZWN0X2xheWVyXCIpO1xuICAgICAgICB0aGlzLl9lZmZlY3RMYXllcnMgPSBbXTtcblxuICAgICAgICB2YXIgaSwgbGF5ZXI7XG4gICAgICAgIGZvciAoaSA9IDA7OyBpKyspIHtcbiAgICAgICAgICAgIGxheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZWZmZWN0X2xheWVyX1wiICsgaSk7XG4gICAgICAgICAgICBpZiAoIWxheWVyKSBicmVhaztcbiAgICAgICAgICAgIHRoaXMuX2VmZmVjdExheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXllcnMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDs7IGkrKykge1xuICAgICAgICAgICAgbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJsYXllcl9cIiArIGkpO1xuICAgICAgICAgICAgaWYgKCFsYXllcikgYnJlYWs7XG4gICAgICAgICAgICB0aGlzLl9sYXllcnMucHVzaChsYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fZW5pdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2VuaXRpZXMucG9wKCk7XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2NrWCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NrWSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2NrUmVnaW9uLnggPSAwLCB0aGlzLl9sb2NrUmVnaW9uLnkgPSAwLCB0aGlzLl9sb2NrUmVnaW9uLndkaXRoID0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoLCB0aGlzLl9sb2NrUmVnaW9uLmhlaWdodCA9IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQsIHRoaXMuX3Bpdm90Q3Vyci54ID0gdGhpcy5fcGl2b3RDdXJyLnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdFN0YXJ0LnggPSB0aGlzLl9waXZvdFN0YXJ0LnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdFRhcmdldC54ID0gdGhpcy5fcGl2b3RUYXJnZXQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueCA9IHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VFbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9pc1Bvc2l0aW9uRGlydHkgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCA9IHRoaXMuX2NhbWVyYUN1cnJQb2ludC55ID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueCA9IHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnkgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnggPSB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnkgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueCA9IHRoaXMuX2NhbWVyYU1vdmVTcGVlZC55ID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZWRMb2NrID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy51cGRhdGVWaWV3UmFuZ2UoKTtcbiAgICB9LFxuXG4gICAgYWRkRW5pdHk6IGZ1bmN0aW9uIGFkZEVuaXR5KGVuaXR5KSB7XG4gICAgICAgIHRoaXMuX29iamVjdExheWVyLmFkZENoaWxkKGVuaXR5KTtcbiAgICAgICAgdGhpcy5fZW5pdGllcy5wdXNoKGVuaXR5KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlRW5pdHk6IGZ1bmN0aW9uIHJlbW92ZUVuaXR5KGVuaXR5KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZW5pdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGVuaXR5ID09IHRoaXMuX2VuaXRpZXNbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbml0aWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRFZmZlY3Q6IGZ1bmN0aW9uIGFkZEVmZmVjdChlZmZlY3QsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdExheWVyc1tpbmRleF0uYWRkQ2hpbGQoZWZmZWN0KTtcbiAgICB9LFxuXG4gICAgY2hlY2tNb3ZlUG9pbnQ6IGZ1bmN0aW9uIGNoZWNrTW92ZVBvaW50KGNvbCwgcm93KSB7XG4gICAgICAgIHJvdyA9IHRoaXMuX21hcFNpemUuaGVpZ2h0IC0gcm93IC0gMTtcbiAgICAgICAgdmFyIGdpZCA9IHRoaXMuX2dyb3VuZEN0cmwuZ2V0VGlsZUdJREF0KGNvbCwgcm93KTtcbiAgICAgICAgaWYgKGdpZCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuX3RteEN0cmwuZ2V0UHJvcGVydGllc0ZvckdJRChnaWQpO1xuICAgICAgICByZXR1cm4gcHJvcCAmJiBwcm9wLm9ic3RhY2xlID09PSBcInRydWVcIjtcbiAgICB9LFxuXG4gICAgZ2V0TWFwU2l6ZTogZnVuY3Rpb24gZ2V0TWFwU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RteEN0cmwuZ2V0TWFwU2l6ZSgpO1xuICAgIH0sXG5cbiAgICBnZXRNYXBQaXhlc1NpemU6IGZ1bmN0aW9uIGdldE1hcFBpeGVzU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcFBpeGVzU2l6ZTtcbiAgICB9LFxuXG4gICAgZ2V0VGlsZVNpemU6IGZ1bmN0aW9uIGdldFRpbGVTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG14Q3RybC5nZXRUaWxlU2l6ZSgpO1xuICAgIH0sXG5cbiAgICBjYW1lcmFUbzogZnVuY3Rpb24gY2FtZXJhVG8oeCwgeSwgdGltZSwgY29tcGxldGVMb2NrKSB7XG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCA9PSB4ICYmIHRoaXMuX2NhbWVyYUN1cnJQb2ludC55ID09IHkpIHJldHVybjtcblxuICAgICAgICB2YXIgdGFyZ2V0WCA9IHg7XG4gICAgICAgIHZhciB0YXJnZXRZID0geTtcbiAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICB0YXJnZXRYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh4ID49IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCAtIHRoaXMudmlld1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIHRhcmdldFggPSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGggLSB0aGlzLnZpZXdTaXplLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5IDwgMCkge1xuICAgICAgICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoeSA+PSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0IC0gdGhpcy52aWV3U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRhcmdldFkgPSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0IC0gdGhpcy52aWV3U2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhQ3VyclBvaW50LnggPT0gdGFyZ2V0WCAmJiB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSA9PSB0YXJnZXRZKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHNjYWxlVGltZVggPSBNYXRoLmFicygodGhpcy5fY2FtZXJhQ3VyclBvaW50LnggLSB0YXJnZXRYKSAvICh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCAtIHgpKSB8fCAxO1xuICAgICAgICB2YXIgc2NhbGVUaW1lWSA9IE1hdGguYWJzKCh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSAtIHRhcmdldFkpIC8gKHRoaXMuX2NhbWVyYUN1cnJQb2ludC55IC0geSkpIHx8IDE7XG4gICAgICAgIHRpbWUgKj0gTWF0aC5tYXgoc2NhbGVUaW1lWCwgc2NhbGVUaW1lWSk7XG5cbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUgPSB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lICsgdGltZTtcbiAgICAgICAgdGhpcy5fY2FtZXJhU3RhcnRQb2ludC54ID0gdGhpcy5fY2FtZXJhQ3VyclBvaW50Lng7XG4gICAgICAgIHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueSA9IHRoaXMuX2NhbWVyYUN1cnJQb2ludC55O1xuICAgICAgICB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC54ID0gdGFyZ2V0WDtcbiAgICAgICAgdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueSA9IHRhcmdldFk7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC54ID0gKHRhcmdldFggLSB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCkgLyB0aW1lO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueSA9ICh0YXJnZXRZIC0gdGhpcy5fY2FtZXJhQ3VyclBvaW50LnkpIC8gdGltZTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZWRMb2NrID0gY29tcGxldGVMb2NrO1xuICAgIH0sXG5cbiAgICBlbmRDYW1lcmFUbzogZnVuY3Rpb24gZW5kQ2FtZXJhVG8oKSB7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnggPSB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC55ID0gLTE7XG4gICAgICAgIHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueCA9IHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueSA9IC0xO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueCA9IHRoaXMuX2NhbWVyYU1vdmVTcGVlZC55ID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZWRMb2NrID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHNldE1hcFBvc2l0aW9uOiBmdW5jdGlvbiBzZXRNYXBQb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyUG9zLnggPT0geCAmJiB0aGlzLl9jdXJyUG9zLnkgPT0geSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghdGhpcy5fbG9ja1gpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHg7XG4gICAgICAgICAgICB0aGlzLl9pc1Bvc2l0aW9uRGlydHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fbG9ja1kpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHk7XG4gICAgICAgICAgICB0aGlzLl9pc1Bvc2l0aW9uRGlydHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldE1hcFBvdml0OiBmdW5jdGlvbiBzZXRNYXBQb3ZpdCh4LCB5LCB0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9waXZvdFRhcmdldC54ICE9PSB4IHx8IHRoaXMuX3Bpdm90VGFyZ2V0LnkgIT09IHkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90VGFyZ2V0LnggPSB4O1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RUYXJnZXQueSA9IHk7XG4gICAgICAgICAgICB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnggPSAoeCAtIHRoaXMuX3Bpdm90Q3Vyci54KSAvIHRpbWU7XG4gICAgICAgICAgICB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnkgPSAoeSAtIHRoaXMuX3Bpdm90Q3Vyci55KSAvIHRpbWU7XG4gICAgICAgICAgICB0aGlzLl9waXZvdFN0YXJ0LnggPSB0aGlzLl9waXZvdEN1cnIueDtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90U3RhcnQueSA9IHRoaXMuX3Bpdm90Q3Vyci55O1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgICAgICB0aGlzLl9waXZvdENoYW5nZUVuZFRpbWUgPSB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSArIHRpbWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5kQ2hhbmdlUGl2b3Q6IGZ1bmN0aW9uIGVuZENoYW5nZVBpdm90KCkge1xuICAgICAgICB0aGlzLl9waXZvdFN0YXJ0LnggPSB0aGlzLl9waXZvdFN0YXJ0LnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdFRhcmdldC54ID0gdGhpcy5fcGl2b3RUYXJnZXQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueCA9IHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VFbmRUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgc2hvY2s6IGZ1bmN0aW9uIHNob2NrKCkge1xuICAgICAgICB2YXIgdmlld1NpemUgPSB0aGlzLnZpZXdTaXplO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLnNlcXVlbmNlKG5ldyBjYy5tb3ZlQnkoMC4wMywgMCwgMTApLCBuZXcgY2MubW92ZUJ5KDAuMDMsIDAsIC0yMCksIG5ldyBjYy5tb3ZlQnkoMC4wMywgMCwgMTApLCBuZXcgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbm9kZS54ID0gMDtcbiAgICAgICAgICAgIG5vZGUueSA9IDA7XG4gICAgICAgIH0pKTtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB2YXIgbmVlZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faXNQb3NpdGlvbkRpcnR5KSB7XG4gICAgICAgICAgICBuZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2lzUG9zaXRpb25EaXJ0eSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1Bpdm90KGN1cnJUaW1lKTtcbiAgICAgICAgICAgIG5lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lID4gMCkge1xuICAgICAgICAgICAgbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5lZWRVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlld1JhbmdlKGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlRW5pdHlaT3JkZXIoKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc1Bpdm90OiBmdW5jdGlvbiBwcm9jZXNzUGl2b3QoY3VyclRpbWUpIHtcbiAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX3Bpdm90Q2hhbmdlRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDdXJyLnggPSB0aGlzLl9waXZvdFRhcmdldC54O1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDdXJyLnkgPSB0aGlzLl9waXZvdFRhcmdldC55O1xuICAgICAgICAgICAgdGhpcy5lbmRDaGFuZ2VQaXZvdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IGN1cnJUaW1lIC0gdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWU7XG4gICAgICAgICAgICB0aGlzLl9waXZvdEN1cnIueCA9IHRoaXMuX3Bpdm90U3RhcnQueCArIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueCAqIHRpbWVFbGFwYXNlZDtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q3Vyci55ID0gdGhpcy5fcGl2b3RTdGFydC55ICsgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC55ICogdGltZUVsYXBhc2VkO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZUVuaXR5Wk9yZGVyOiBmdW5jdGlvbiB1cGRhdGVFbml0eVpPcmRlcigpIHtcbiAgICAgICAgdGhpcy5fZW5pdGllcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS55IDwgYi55ID8gMSA6IC0xO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9lbml0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9lbml0aWVzW2ldLnNldExvY2FsWk9yZGVyKGkgKyAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVWaWV3UmFuZ2U6IGZ1bmN0aW9uIHVwZGF0ZVZpZXdSYW5nZShjdXJyVGltZSkge1xuICAgICAgICB2YXIgbWFwV2lkdGggPSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGg7XG4gICAgICAgIHZhciBtYXBIZWlnaHQgPSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0O1xuICAgICAgICB2YXIgdmlld1NpemUgPSB0aGlzLnZpZXdTaXplO1xuICAgICAgICB2YXIgbWFwUG9zID0gbmV3IGNjLlZlYzIoKTtcblxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUgPiAwKSB7XG4gICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3MueCA9IHRoaXMuX2NhbWVyYVRhcmdldFBvaW50Lng7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnkgPSB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC55O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYW1lcmFNb3ZlZExvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9ja1ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2NrWSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZW5kQ2FtZXJhVG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IGN1cnJUaW1lIC0gdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBtYXBQb3MueCA9IHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueCArIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC54ICogdGltZUVsYXBhc2VkO1xuICAgICAgICAgICAgICAgIG1hcFBvcy55ID0gdGhpcy5fY2FtZXJhU3RhcnRQb2ludC55ICsgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnkgKiB0aW1lRWxhcGFzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGltaXRSZWdpb24gPSBuZXcgY2MuUmVjdCgpO1xuICAgICAgICAgICAgbGltaXRSZWdpb24ueCA9IHRoaXMuX2xvY2tSZWdpb24ueDtcbiAgICAgICAgICAgIGxpbWl0UmVnaW9uLnkgPSB0aGlzLl9sb2NrUmVnaW9uLnk7XG4gICAgICAgICAgICBsaW1pdFJlZ2lvbi53aWR0aCA9IHRoaXMuX2xvY2tSZWdpb24ud2lkdGggLSB2aWV3U2l6ZS53aWR0aDtcbiAgICAgICAgICAgIGxpbWl0UmVnaW9uLmhlaWdodCA9IHRoaXMuX2xvY2tSZWdpb24uaGVpZ2h0IC0gdmlld1NpemUuaGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xvY2tYKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnggPSB0aGlzLl9jdXJyUG9zLnggKyB0aGlzLl9waXZvdEN1cnIueCAtIHZpZXdTaXplLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBpZiAobWFwUG9zLnggPCBsaW1pdFJlZ2lvbi54TWluKSBtYXBQb3MueCA9IGxpbWl0UmVnaW9uLnhNaW47XG4gICAgICAgICAgICAgICAgaWYgKG1hcFBvcy54ID4gbGltaXRSZWdpb24ueE1heCkgbWFwUG9zLnggPSBsaW1pdFJlZ2lvbi54TWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9sb2NrWSkge1xuICAgICAgICAgICAgICAgIG1hcFBvcy55ID0gdGhpcy5fY3VyclBvcy55ICsgdGhpcy5fcGl2b3RDdXJyLnkgLSB2aWV3U2l6ZS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGlmIChtYXBQb3MueSA8IGxpbWl0UmVnaW9uLnlNaW4pIG1hcFBvcy55ID0gbGltaXRSZWdpb24ueU1pbjtcbiAgICAgICAgICAgICAgICBpZiAobWFwUG9zLnkgPiBsaW1pdFJlZ2lvbi55TWF4KSBtYXBQb3MueSA9IGxpbWl0UmVnaW9uLnlNYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueCA9IG1hcFBvcy54O1xuICAgICAgICB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSA9IG1hcFBvcy55O1xuXG4gICAgICAgIHRoaXMuX3Bpdm90T2Zmc2V0ID0gdGhpcy5fY3VyclBvcy54IC0gbWFwUG9zLng7XG5cbiAgICAgICAgdGhpcy5fdG14TGF5ZXIuc2V0UG9zaXRpb24oLW1hcFBvcy54LCAtbWFwUG9zLnkpO1xuICAgICAgICB0aGlzLl9vYmplY3RMYXllci5zZXRQb3NpdGlvbigtbWFwUG9zLngsIC1tYXBQb3MueSk7XG4gICAgICAgIHRoaXMuX290aGVyTGF5ZXIuc2V0UG9zaXRpb24oLW1hcFBvcy54LCAtbWFwUG9zLnkpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2VmZmVjdExheWVycy5sZW5ndGg7IGkrKykgdGhpcy5fZWZmZWN0TGF5ZXJzW2ldLnNldFBvc2l0aW9uKC1tYXBQb3MueCwgLW1hcFBvcy55KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2xheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXJzW2ldO1xuICAgICAgICAgICAgdmFyIHNpemUgPSB0aGlzLmxheWVyU2l6ZVtpXTtcbiAgICAgICAgICAgIGxheWVyLnggPSAtbWFwUG9zLnggLyAodGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoIC0gdmlld1NpemUud2lkdGgpICogKHNpemUud2lkdGggLSB2aWV3U2l6ZS53aWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2I3NTJkd3NQaWxPY3JlYlZIdEhyRzNHJywgJ21lc3NhZ2VfYm94Jyk7XG4vLyBzY3JpcHRcXHVpXFxtZXNzYWdlX2JveC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi5cbiAgICAgICAgbWVzc2FnZUxhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLl91aUN0cmwuYXJncztcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBhcmdzLmNhbGxiYWNrO1xuICAgICAgICB0aGlzLm1lc3NhZ2VMYWJlbC5zdHJpbmcgPSBhcmdzLm1lc3NhZ2U7XG4gICAgfSxcblxuICAgIG9uQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gZXZlbnQudGFyZ2V0Lm5hbWU7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ29rX2J1dHRvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2NhbmNlbF9idXR0b24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjY2I1MG9UVmpsTVRyNGErZThnbVYrYicsICdtaXNzaW9uX2ZhaWwnKTtcbi8vIHNjcmlwdFxcdWlcXHJlc3VsdFxcbWlzc2lvbl9mYWlsLmpzXG5cbnZhciB0aW1lc01hcENvaW4gPSBbMTAsIDMwLCA1MF07XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcmV0cnlCdXR0b246IGNjLk5vZGUsXG4gICAgICAgIHJldHVybkJ1dHRvbjogY2MuTm9kZSxcbiAgICAgICAgcmV0cnlDb2luTGFiZWw6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwgPSB0aGlzLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgICAgICB0aGlzLl9yZXRyeUNvdW50ID0gMyAtIHRoaXMuX3VpQ3RybC5hcmdzLnJldHJ5Q291bnQ7XG4gICAgICAgIGlmICh0aGlzLl9yZXRyeUNvdW50ID49IDMpIHtcbiAgICAgICAgICAgIHRoaXMucmV0cnlCdXR0b24uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJldHVybkJ1dHRvbi54ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZWVkQ29pbiA9IHRpbWVzTWFwQ29pblt0aGlzLl9yZXRyeUNvdW50XTtcbiAgICAgICAgICAgIHRoaXMucmV0cnlDb2luTGFiZWwuc3RyaW5nID0gbmVlZENvaW47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9FWENIQU5HRV9HT0xELCB0aGlzLm9uRXhjaGFuZ2VTdWNjZXNzLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9jb250aW51ZUhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0JVWV9USU1FX1RPX1BMQVksIHRoaXMub25Db250aW51ZUdhbWUuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fZXhjaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2NvbnRpbnVlSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlSGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uRXhjaGFuZ2VTdWNjZXNzOiBmdW5jdGlvbiBvbkV4Y2hhbmdlU3VjY2VzcygpIHtcbiAgICAgICAgdmFyIG5lZWRDb2luID0gdGltZXNNYXBDb2luW3RoaXMuX3JldHJ5Q291bnRdO1xuICAgICAgICBpZiAoR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA+PSBuZWVkQ29pbikge1xuICAgICAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmJ1eVRpbWVUb1BsYXlHYW1lKHRoaXMuX3JldHJ5Q291bnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ29udGludWVHYW1lOiBmdW5jdGlvbiBvbkNvbnRpbnVlR2FtZSgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIG9uUmV0cnlCdXR0b25DbGljazogZnVuY3Rpb24gb25SZXRyeUJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB2YXIgbmVlZENvaW4gPSB0aW1lc01hcENvaW5bdGhpcy5fcmV0cnlDb3VudF07XG4gICAgICAgIHZhciBvd25Db2luID0gR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bTtcbiAgICAgICAgaWYgKG93bkNvaW4gPCBuZWVkQ29pbikge1xuICAgICAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdjb2luX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5idXlUaW1lVG9QbGF5R2FtZSh0aGlzLl9yZXRyeUNvdW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJldHVybkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHVybkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fUkVUVVJOX0dBTUUpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTUwZjRSZ2R1UklwWnUvamxXVVQzWksnLCAnbW9kZWxfcGFuZWwnKTtcbi8vIHNjcmlwdFxcdWlcXGNvbXBvbmVudFxcbW9kZWxfcGFuZWwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdG91Y2hTdGFydCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZSA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fdG91Y2hFbmQgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fdG91Y2hDYW5jZWwgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VFbnRlciA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlTGVhdmUgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZURvd24gPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRE9XTiwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlTW92ZSA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VVcCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlV2hlbGwgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fdG91Y2hTdGFydCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl90b3VjaE1vdmUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl90b3VjaEVuZCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuX3RvdWNoQ2FuY2VsLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9tb3VzZUVudGVyLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0xFQVZFLCB0aGlzLl9tb3VzZUxlYXZlLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIHRoaXMuX21vdXNlRG93biwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCB0aGlzLl9tb3VzZU1vdmUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAsIHRoaXMuX21vdXNlVXAsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIHRoaXMuX21vdXNlV2hlbGwsIHRoaXMubm9kZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZWZiOTkxMkN0RFA0U2VhcGczcUhUSycsICdtb25zdGVyX2N0cmwnKTtcbi8vIHNjcmlwdFxcYWN0b3JcXG1vbnN0ZXJfY3RybC5qc1xuXG52YXIgQWN0b3JEZWZpbmUgPSByZXF1aXJlKFwiYWN0b3JfZGVmaW5lXCIpO1xudmFyIEFjdG9yID0gcmVxdWlyZShcImFjdG9yX2N0cmxcIik7XG5cbnZhciBBY3RvckFjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yQWN0aW9uO1xudmFyIEFjdG9yRGlyZWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JEaXJlY3Rpb247XG52YXIgQWN0aW9uQ29tcGxldGVUeXBlID0gQWN0b3JEZWZpbmUuQWN0aW9uQ29tcGxldGVUeXBlO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IEFjdG9yLFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX0FJTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSUhvbGRFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlBdHRhY2tEZWxheUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSVJ1bm5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX0FJTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSUhvbGRFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlBdHRhY2tEZWxheUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9BSVJ1bm5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBydW46IGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgICAgdGhpcy5fQUlSdW5uZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICB0aGlzLl9BSVJ1bm5lZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXG4gICAgICAgIHRoaXMuX3N1cGVyKGR0KTtcbiAgICB9LFxuXG4gICAgbmV4dEFjdGlvbjogZnVuY3Rpb24gbmV4dEFjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzRGVhZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLkJPUk4pIHtcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX0FJUnVubmVkICYmIHRoaXMuX2Jvcm5FbmRUaW1lIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fQUlSdW5uZWQgJiYgdGhpcy5fYm9ybkVuZFRpbWUgPD0gMCkge1xuICAgICAgICAgICAgdmFyIHBsYXllciA9IHRoaXMuX2xvZ2ljTWFuYWdlci5nZXRQbGF5ZXIoKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuaXNEZWFkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaXNYID0gcGxheWVyLm5vZGUueCAtIHRoaXMubm9kZS54O1xuICAgICAgICAgICAgdmFyIGRpc1kgPSBwbGF5ZXIubm9kZS55IC0gdGhpcy5ub2RlLnk7XG4gICAgICAgICAgICB2YXIgZGlyWCA9IEFjdG9yRGlyZWN0aW9uLkxFRlQ7XG4gICAgICAgICAgICB2YXIgZGlyWSA9IDA7XG4gICAgICAgICAgICBpZiAoZGlzWCA+IDApIGRpclggPSBBY3RvckRpcmVjdGlvbi5SSUdIVDtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXNZKSA+IDEwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpc1kgPiAwKSBkaXJZID0gMTtlbHNlIGRpclkgPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyWSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpclgpO1xuXG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlzWSkgPCAyMCAmJiBNYXRoLmFicyhkaXNYKSA8IDYwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX0FJQXR0YWNrRGVsYXlFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBza2lsbCA9IEdsb2JhbC5za2lsbFByb3ZpZGVyLmdldENvbmZpZygxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFza2lsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlBdHRhY2tEZWxheUVuZFRpbWUgPSBjdXJyVGltZSArIDU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3N0dXJlTGlzdCA9IFtza2lsbC5wb3N0dXJlc1swXV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdHRhY2socG9zdHVyZUxpc3QsIDEsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX0FJTW92ZUVuZFRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJUaW1lIDw9IHRoaXMuX0FJTW92ZUVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwZWVkID0gbmV3IGNjLlZlYzIoMTAwICogZGlyWCwgMTAwICogZGlyWSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tb3ZlU3RhcnRUaW1lIDw9IDAgfHwgc3BlZWQueCAhPT0gdGhpcy5fY3Vyck1vdmVTcGVlZC54IHx8IHNwZWVkLnkgIT09IHRoaXMuX2N1cnJNb3ZlU3BlZWQueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydE1vdmUoc3BlZWQueCwgc3BlZWQueSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0FJTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0FJSG9sZEVuZFRpbWUgPSBjdXJyVGltZSArIE1hdGgucmFuZG9tKCkgKiAyICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX0FJSG9sZEVuZFRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX0FJSG9sZEVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9BSU1vdmVFbmRUaW1lID0gY3VyclRpbWUgKyBNYXRoLnJhbmRvbSgpICogMiArIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJhOTIyL3RLRUZGUUpHTzZxNVd5V1lPJywgJ25hdGl2ZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxuYXRpdmVfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGV4aXREaWFsb2c6IGNjLlByZWZhYlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY2MubG9nKCdrZXlEb3duOiAnICsga2V5Q29kZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleUNvZGUgPT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PSBjYy5LRVkuZXNjYXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0V4aXREaWFsb2coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIOe7keWumumUruebmOS6i+S7tlxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIobGlzdGVuZXIsIHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIHNob3dFeGl0RGlhbG9nOiBmdW5jdGlvbiBzaG93RXhpdERpYWxvZygpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFeGl0RGlhbG9nKCk7XG4gICAgICAgIHZhciBkaWFsb2cgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmV4aXREaWFsb2cpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgdGhpcy5fZXhpdERpYWxvZyA9IGRpYWxvZztcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXhpdERpYWxvZzogZnVuY3Rpb24gcmVtb3ZlRXhpdERpYWxvZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V4aXREaWFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuX2V4aXREaWFsb2cucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgdGhpcy5fZXhpdERpYWxvZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9leGl0RGlhbG9nID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkyMDNld3djYUpBVHEvemRnT2drc2piJywgJ25ldHdvcmtfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcbmV0d29ya19jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsb2FkaW5nUHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuXG4gICAgICAgIGVycm9yUHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fSFRUUF9SRVFVRVNULCB0aGlzLm9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3Jlc3BvbmRIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9IVFRQX1JFU1BPTkQsIHRoaXMub25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbmV0d29ya0Vycm9ySGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fTkVUV09SS19FUlJPUiwgdGhpcy5vbkV2ZW50LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3JlcXVlc3RIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3Jlc3BvbmRIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX25ldHdvcmtFcnJvckhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc3BvbmRIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbmV0d29ya0Vycm9ySGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uRXZlbnQ6IGZ1bmN0aW9uIG9uRXZlbnQoZXZlbnRUeXBlLCBkYXRhKSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEdhbWVFdmVudC5PTl9IVFRQX1JFUVVFU1Q6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TG9hZGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBodHRwIHJlcXVlc3RcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgR2FtZUV2ZW50Lk9OX0hUVFBfUkVTUE9ORDpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBodHRwIHJlc3BvbmRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgR2FtZUV2ZW50Lk9OX05FVFdPUktfRVJST1I6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBuZXR3b3JrIGVycm9yXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob3dFcnJvcjogZnVuY3Rpb24gc2hvd0Vycm9yKCkge1xuICAgICAgICB2YXIgcGFuZWwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmVycm9yUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHBhbmVsKTtcbiAgICB9LFxuXG4gICAgc2hvd0xvYWRpbmc6IGZ1bmN0aW9uIHNob3dMb2FkaW5nKHZhbHVlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTG9hZGluZygpO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9hZGluZ1ByZWZhYik7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQocGFuZWwpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1BhbmVsID0gcGFuZWw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlTG9hZGluZzogZnVuY3Rpb24gcmVtb3ZlTG9hZGluZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdQYW5lbCkge1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1BhbmVsLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgIC8vdGhpcy5fbG9hZGluZ1BhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdQYW5lbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YyM2ZiOXQ0MTFLd3F2VThIT2FYT1ZEJywgJ25ldHdvcmtfZXJyb3InKTtcbi8vIHNjcmlwdFxcY29tbW9uXFxuZXR3b3JrX2Vycm9yLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgb25SZXRyeUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHJ5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0LnJldHJ5SHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgb25FeGl0QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRXhpdEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5lbmQoKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkYjE4ZlZFY2F0R2w2dGY1QXlZdE9RaCcsICdwaHlzaWNhbF9ub3RfZW5vdWdoJyk7XG4vLyBzY3JpcHRcXHVpXFxwaHlzaWNhbF9ub3RfZW5vdWdoLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybCA9IHRoaXMuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgfSxcblxuICAgIG9uQnV5QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQnV5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgICAgICB2YXIgY29pbiA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgICAgIGlmIChHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtIDwgNTApIHtcbiAgICAgICAgICAgIHRoaXMuX3VpQ3RybC5tYW5hZ2VyLm9wZW5VSSgnY29pbl9ub3RfZW5vdWdoJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5idXlGdWxsUGh5c2ljYWwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNhbmNlbEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5ZWMxMUVJS01SQUk1RDV2b0IrNkJOQycsICdwaHlzaWNhbF9wb2ludCcpO1xuLy8gc2NyaXB0XFx1aVxcY29tcG9uZW50XFxwaHlzaWNhbF9wb2ludC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3Rhcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT0gc3RhdGUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXIuYWN0aXZlID0gc3RhdGUgPT09IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IDE7XG4gICAgICAgIC8vdGhpcy5fYW5pbWF0aW9uID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAvL3RoaXMuX2FuaW1hdGlvbi5vbignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVGaW5pc2gsIHRoaXMpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGM4ZTh6cWZCQkloYjVhdlY2VUltMk8nLCAncGxheWVyX2N0cmwnKTtcbi8vIHNjcmlwdFxcYWN0b3JcXHBsYXllcl9jdHJsLmpzXG5cbnZhciBDb250cm9sRGVmaW5lID0gcmVxdWlyZShcImNvbnRyb2xfZGVmaW5lXCIpO1xudmFyIEFjdG9yRGVmaW5lID0gcmVxdWlyZShcImFjdG9yX2RlZmluZVwiKTtcbnZhciBBY3RvciA9IHJlcXVpcmUoXCJhY3Rvcl9jdHJsXCIpO1xuXG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcbnZhciBBY3RvckFjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yQWN0aW9uO1xudmFyIEFjdG9yRGlyZWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JEaXJlY3Rpb247XG52YXIgQWN0aW9uQ29tcGxldGVUeXBlID0gQWN0b3JEZWZpbmUuQWN0aW9uQ29tcGxldGVUeXBlO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IEFjdG9yLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzdGF0ZUJhcjoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQoYmFyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVCYXIgPSBiYXI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVCYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29udHJvbEVuYWJsZWQ6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ID49IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZWxpdmVFZmZlY3RVbmRlcjogY2MuQW5pbWF0aW9uLFxuICAgICAgICByZWxpdmVFZmZlY3RVcHBlcjogY2MuQW5pbWF0aW9uXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VW5kZXIub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBzZWxmLnJlbGl2ZUVmZmVjdFVuZGVyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVwcGVyLm9uKCdmaW5pc2hlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5yZWxpdmVFZmZlY3RVcHBlci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9rZXlEb3duQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl9rZXlEb3duVGltZSA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCA9IC0xO1xuXG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX2tleURvd25Db3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fa2V5RG93blRpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2tleURvd25UaW1lW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ID0gLTE7XG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAodGhpcy5fc3RhdGVCYXIpIHRoaXMuX3N0YXRlQmFyLnNldEhwKHRoaXMuX2hwLCB0aGlzLl9ocE1heCwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBzZXRIcDogZnVuY3Rpb24gc2V0SHAodmFsdWUsIG1heCkge1xuICAgICAgICB0aGlzLl9zdXBlcih2YWx1ZSwgbWF4KTtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlQmFyKSB0aGlzLl9zdGF0ZUJhci5zZXRIcCh0aGlzLl9ocCwgdGhpcy5faHBNYXgsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc2V0QWN0b3JQb3NpdGlvbjogZnVuY3Rpb24gc2V0QWN0b3JQb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKHgsIHkpO1xuICAgICAgICB0aGlzLl9tYXAuc2V0TWFwUG9zaXRpb24oeCwgeSk7XG4gICAgfSxcblxuICAgIHNldEFjdGlvbjogZnVuY3Rpb24gc2V0QWN0aW9uKGFjdGlvbiwgZGlyLCBwYXJhbSwgdGltZSkge1xuICAgICAgICB0aGlzLl9zdXBlcihhY3Rpb24sIGRpciwgcGFyYW0sIHRpbWUpO1xuICAgICAgICAvL3RoaXMudXBkYXRlTWFwUGl2b3QoKTtcbiAgICB9LFxuXG4gICAgc2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBzZXREaXJlY3Rpb24oZGlyKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGRpcik7XG4gICAgICAgIC8vdGhpcy51cGRhdGVNYXBQaXZvdCgpO1xuICAgIH0sXG5cbiAgICBkYW1hZ2U6IGZ1bmN0aW9uIGRhbWFnZSh2YWx1ZSkge1xuICAgICAgICB2YXIgYW5pID0gdmFsdWUgPiAwO1xuICAgICAgICB0aGlzLl9zdXBlcih2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3N0YXRlQmFyLnNldEhwKHRoaXMuX2hwLCB0aGlzLl9ocE1heCwgYW5pKTtcbiAgICB9LFxuXG4gICAgYnJlYWthYmxlOiBmdW5jdGlvbiBicmVha2FibGUoKSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGFzdElucHV0QXR0YWNrS2V5KCkgPT0gQ29udHJvbEtleS5ISVQgJiYgY3VyclRpbWUgPj0gdGhpcy5fYXR0YWNrRW5kVGltZTtcbiAgICB9LFxuXG4gICAgbmVlZERpc2FwcGVhcjogZnVuY3Rpb24gbmVlZERpc2FwcGVhcigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBuZXh0QWN0aW9uOiBmdW5jdGlvbiBuZXh0QWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9ybkVuZFRpbWUgPiAwKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICBpZiAoIXRoaXMuY29udHJvbEVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJFTElWRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDdXJyZW50QWN0aW9uQ29tcGxldGVUeXBlKCkgPT0gQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0RGlyID0gdGhpcy5nZXRMYXN0SW5wdXRNb3ZlRGlyZWN0aW9uKCk7XG4gICAgICAgIHZhciBkaXIgPSBuZXh0RGlyLnggPT09IDAgPyB0aGlzLl9kaXJlY3Rpb24gOiBuZXh0RGlyLng7XG5cbiAgICAgICAgdmFyIGF0dGFja0tleSA9IHRoaXMuZ2V0TGFzdElucHV0QXR0YWNrS2V5KCk7XG4gICAgICAgIGlmIChhdHRhY2tLZXkgIT09IENvbnRyb2xLZXkuTk9ORSAmJiBjdXJyVGltZSA+PSB0aGlzLl9hdHRhY2tFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKGF0dGFja0tleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQ29udHJvbEtleS5ISVQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGFydEhpdChkaXIpKSB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGVyTW92ZSgpKSB7fSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbml0aWF0aXZlTW92ZSkgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjaGVja0F0dGFja1Bvc3R1cmU6IGZ1bmN0aW9uIGNoZWNrQXR0YWNrUG9zdHVyZShza2lsbElkKSB7XG4gICAgICAgIGlmIChza2lsbElkID09IDApIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0QXR0YWNrU2tpbGxJZCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyclRpbWUgPj0gdGhpcy5fcG9zdHVyZUJyZWFrRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xhc3RIaXRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0Tm9ybWFsQXR0YWNrUG9zdHVyZSh0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NjLmxvZyhcImxhc3QgaW5kZXhcIiArIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXgpO1xuICAgICAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLmdldE5vcm1hbEF0dGFja1Bvc3R1cmUodGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXBvc3R1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wb3N0dXJlQnJlYWtFbmRUaW1lID0gY3VyclRpbWUgKyBwb3N0dXJlLnRpbWUgKyAwLjI7XG4gICAgICAgICAgICByZXR1cm4gcG9zdHVyZTtcbiAgICAgICAgfSBlbHNlIHt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBnZXROb3JtYWxBdHRhY2tQb3N0dXJlOiBmdW5jdGlvbiBnZXROb3JtYWxBdHRhY2tQb3N0dXJlKGluZGV4KSB7XG4gICAgICAgIHZhciBza2lsbCA9IEdsb2JhbC5za2lsbFByb3ZpZGVyLmdldENvbmZpZygwKTtcbiAgICAgICAgaWYgKCFza2lsbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBza2lsbC5wb3N0dXJlc1tpbmRleF07XG4gICAgfSxcblxuICAgIHN0YXJ0SGl0OiBmdW5jdGlvbiBzdGFydEhpdChkaXIpIHtcbiAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLmNoZWNrQXR0YWNrUG9zdHVyZSgwKTtcbiAgICAgICAgaWYgKCFwb3N0dXJlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydEF0dGFjayhbcG9zdHVyZV0sIDEsIGRpcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBlbnRlck1vdmU6IGZ1bmN0aW9uIGVudGVyTW92ZSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBkaXJWZWMgPSB0aGlzLmdldExhc3RJbnB1dE1vdmVEaXJlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRpclZlYy5lcXVhbHMoY2MuVmVjMi5aRVJPKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBzcGVlZCA9IHRoaXMuY2FsY01vdmVTcGVlZChkaXJWZWMpO1xuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA8PSAwIHx8IHNwZWVkLnggIT09IHRoaXMuX2N1cnJNb3ZlU3BlZWQueCB8fCBzcGVlZC55ICE9PSB0aGlzLl9jdXJyTW92ZVNwZWVkLnkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpclZlYy54KTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRNb3ZlKHNwZWVkLngsIHNwZWVkLnksIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHBsYXlSZWxpdmVFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlSZWxpdmVFZmZlY3QoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVbmRlci5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VXBwZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVuZGVyLnBsYXkoJ2RlZmF1bHQnKTtcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVcHBlci5wbGF5KCdkZWZhdWx0Jyk7XG4gICAgfSxcblxuICAgIGNhbGNNb3ZlU3BlZWQ6IGZ1bmN0aW9uIGNhbGNNb3ZlU3BlZWQoZGlyVmVjKSB7XG4gICAgICAgIHZhciBtb3ZlU3BlZWQgPSBuZXcgY2MuVmVjMihkaXJWZWMueCAqIHRoaXMubW92ZVNwZWVkLngsIGRpclZlYy55ICogdGhpcy5tb3ZlU3BlZWQueSk7XG4gICAgICAgIHJldHVybiBtb3ZlU3BlZWQ7XG4gICAgfSxcblxuICAgIGtleURvd246IGZ1bmN0aW9uIGtleURvd24oa2V5KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlEb3duQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuX2tleURvd25UaW1lW2tleV0gPSB0aGlzLl9rZXlEb3duQ291bnQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAga2V5VXA6IGZ1bmN0aW9uIGtleVVwKGtleSkge1xuICAgICAgICB0aGlzLl9rZXlEb3duVGltZVtrZXldID0gMDtcbiAgICB9LFxuXG4gICAgZ2V0TGFzdElucHV0TW92ZURpcmVjdGlvbjogZnVuY3Rpb24gZ2V0TGFzdElucHV0TW92ZURpcmVjdGlvbigpIHtcbiAgICAgICAgdmFyIHUgPSAwLFxuICAgICAgICAgICAgdiA9IDA7XG4gICAgICAgIHZhciB1dCA9IDAsXG4gICAgICAgICAgICB2dCA9IDA7XG5cbiAgICAgICAgaWYgKHV0IDwgdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5MRUZUXSkge1xuICAgICAgICAgICAgdXQgPSB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LkxFRlRdO1xuICAgICAgICAgICAgdSA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dCA8IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuUklHSFRdKSB7XG4gICAgICAgICAgICB1dCA9IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuUklHSFRdO1xuICAgICAgICAgICAgdSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZ0IDwgdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5VUF0pIHtcbiAgICAgICAgICAgIHZ0ID0gdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5VUF07XG4gICAgICAgICAgICB2ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodnQgPCB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LkRPV05dKSB7XG4gICAgICAgICAgICB2dCA9IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuRE9XTl07XG4gICAgICAgICAgICB2ID0gLTE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IGNjLlZlYzIodSwgdik7XG4gICAgfSxcblxuICAgIGdldExhc3RJbnB1dEF0dGFja0tleTogZnVuY3Rpb24gZ2V0TGFzdElucHV0QXR0YWNrS2V5KCkge1xuICAgICAgICB2YXIgY2sgPSBDb250cm9sS2V5Lk5PTkU7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xFbmFibGVkKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IENvbnRyb2xLZXkuSlVNUDsgaSA8PSBDb250cm9sS2V5LlNLSUxMNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUaW1lIDwgdGhpcy5fa2V5RG93blRpbWVbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWUgPSB0aGlzLl9rZXlEb3duVGltZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgY2sgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2s7XG4gICAgfSxcblxuICAgIHVwZGF0ZU1hcFBpdm90OiBmdW5jdGlvbiB1cGRhdGVNYXBQaXZvdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uUlVOKSB0aGlzLl9tYXAuc2V0TWFwUG92aXQodGhpcy5fZGlyZWN0aW9uICogLTEwMCwgMCwgMik7ZWxzZSB0aGlzLl9tYXAuc2V0TWFwUG92aXQodGhpcy5fZGlyZWN0aW9uICogMTAwLCAwLCAxKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NjMzY2L0oxL2hFMDRUQ0hCU0ZJdDh0JywgJ3BvbHlnbG90Jyk7XG4vLyBzY3JpcHRcXGkxOG5cXHBvbHlnbG90LmpzXG5cbi8vICAgICAoYykgMjAxMi0yMDE2IEFpcmJuYiwgSW5jLlxuLy9cbi8vICAgICBwb2x5Z2xvdC5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEXG4vLyAgICAgbGljZW5zZS4gRm9yIGFsbCBsaWNlbnNpbmcgaW5mb3JtYXRpb24sIGRldGFpbHMsIGFuZCBkb2N1bWVudGlvbjpcbi8vICAgICBodHRwOi8vYWlyYm5iLmdpdGh1Yi5jb20vcG9seWdsb3QuanNcbi8vXG4vL1xuLy8gUG9seWdsb3QuanMgaXMgYW4gSTE4biBoZWxwZXIgbGlicmFyeSB3cml0dGVuIGluIEphdmFTY3JpcHQsIG1hZGUgdG9cbi8vIHdvcmsgYm90aCBpbiB0aGUgYnJvd3NlciBhbmQgaW4gTm9kZS4gSXQgcHJvdmlkZXMgYSBzaW1wbGUgc29sdXRpb24gZm9yXG4vLyBpbnRlcnBvbGF0aW9uIGFuZCBwbHVyYWxpemF0aW9uLCBiYXNlZCBvZmYgb2YgQWlyYm5iJ3Ncbi8vIGV4cGVyaWVuY2UgYWRkaW5nIEkxOG4gZnVuY3Rpb25hbGl0eSB0byBpdHMgQmFja2JvbmUuanMgYW5kIE5vZGUgYXBwcy5cbi8vXG4vLyBQb2x5bGdsb3QgaXMgYWdub3N0aWMgdG8geW91ciB0cmFuc2xhdGlvbiBiYWNrZW5kLiBJdCBkb2Vzbid0IHBlcmZvcm0gYW55XG4vLyB0cmFuc2xhdGlvbjsgaXQgc2ltcGx5IGdpdmVzIHlvdSBhIHdheSB0byBtYW5hZ2UgdHJhbnNsYXRlZCBwaHJhc2VzIGZyb21cbi8vIHlvdXIgY2xpZW50LSBvciBzZXJ2ZXItc2lkZSBKYXZhU2NyaXB0IGFwcGxpY2F0aW9uLlxuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuUG9seWdsb3QgPSBmYWN0b3J5KHJvb3QpO1xuICB9XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcblxuICAvLyAjIyMgUG9seWdsb3QgY2xhc3MgY29uc3RydWN0b3JcbiAgZnVuY3Rpb24gUG9seWdsb3Qob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMucGhyYXNlcyA9IHt9O1xuICAgIHRoaXMuZXh0ZW5kKG9wdGlvbnMucGhyYXNlcyB8fCB7fSk7XG4gICAgdGhpcy5jdXJyZW50TG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgJ2VuJztcbiAgICB0aGlzLmFsbG93TWlzc2luZyA9ICEhb3B0aW9ucy5hbGxvd01pc3Npbmc7XG4gICAgdGhpcy53YXJuID0gb3B0aW9ucy53YXJuIHx8IHdhcm47XG4gIH1cblxuICAvLyAjIyMgVmVyc2lvblxuICBQb2x5Z2xvdC5WRVJTSU9OID0gJzEuMC4wJztcblxuICAvLyAjIyMgcG9seWdsb3QubG9jYWxlKFtsb2NhbGVdKVxuICAvL1xuICAvLyBHZXQgb3Igc2V0IGxvY2FsZS4gSW50ZXJuYWxseSwgUG9seWdsb3Qgb25seSB1c2VzIGxvY2FsZSBmb3IgcGx1cmFsaXphdGlvbi5cbiAgUG9seWdsb3QucHJvdG90eXBlLmxvY2FsZSA9IGZ1bmN0aW9uIChuZXdMb2NhbGUpIHtcbiAgICBpZiAobmV3TG9jYWxlKSB0aGlzLmN1cnJlbnRMb2NhbGUgPSBuZXdMb2NhbGU7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExvY2FsZTtcbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QuZXh0ZW5kKHBocmFzZXMpXG4gIC8vXG4gIC8vIFVzZSBgZXh0ZW5kYCB0byB0ZWxsIFBvbHlnbG90IGhvdyB0byB0cmFuc2xhdGUgYSBnaXZlbiBrZXkuXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC5leHRlbmQoe1xuICAvLyAgICAgICBcImhlbGxvXCI6IFwiSGVsbG9cIixcbiAgLy8gICAgICAgXCJoZWxsb19uYW1lXCI6IFwiSGVsbG8sICV7bmFtZX1cIlxuICAvLyAgICAgfSk7XG4gIC8vXG4gIC8vIFRoZSBrZXkgY2FuIGJlIGFueSBzdHJpbmcuICBGZWVsIGZyZWUgdG8gY2FsbCBgZXh0ZW5kYCBtdWx0aXBsZSB0aW1lcztcbiAgLy8gaXQgd2lsbCBvdmVycmlkZSBhbnkgcGhyYXNlcyB3aXRoIHRoZSBzYW1lIGtleSwgYnV0IGxlYXZlIGV4aXN0aW5nIHBocmFzZXNcbiAgLy8gdW50b3VjaGVkLlxuICAvL1xuICAvLyBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHBhc3MgbmVzdGVkIHBocmFzZSBvYmplY3RzLCB3aGljaCBnZXQgZmxhdHRlbmVkXG4gIC8vIGludG8gYW4gb2JqZWN0IHdpdGggdGhlIG5lc3RlZCBrZXlzIGNvbmNhdGVuYXRlZCB1c2luZyBkb3Qgbm90YXRpb24uXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC5leHRlbmQoe1xuICAvLyAgICAgICBcIm5hdlwiOiB7XG4gIC8vICAgICAgICAgXCJoZWxsb1wiOiBcIkhlbGxvXCIsXG4gIC8vICAgICAgICAgXCJoZWxsb19uYW1lXCI6IFwiSGVsbG8sICV7bmFtZX1cIixcbiAgLy8gICAgICAgICBcInNpZGViYXJcIjoge1xuICAvLyAgICAgICAgICAgXCJ3ZWxjb21lXCI6IFwiV2VsY29tZVwiXG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9KTtcbiAgLy9cbiAgLy8gICAgIGNvbnNvbGUubG9nKHBvbHlnbG90LnBocmFzZXMpO1xuICAvLyAgICAgLy8ge1xuICAvLyAgICAgLy8gICAnbmF2LmhlbGxvJzogJ0hlbGxvJyxcbiAgLy8gICAgIC8vICAgJ25hdi5oZWxsb19uYW1lJzogJ0hlbGxvLCAle25hbWV9JyxcbiAgLy8gICAgIC8vICAgJ25hdi5zaWRlYmFyLndlbGNvbWUnOiAnV2VsY29tZSdcbiAgLy8gICAgIC8vIH1cbiAgLy9cbiAgLy8gYGV4dGVuZGAgYWNjZXB0cyBhbiBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQsIGBwcmVmaXhgLCB3aGljaCBjYW4gYmUgdXNlZFxuICAvLyB0byBwcmVmaXggZXZlcnkga2V5IGluIHRoZSBwaHJhc2VzIG9iamVjdCB3aXRoIHNvbWUgc3RyaW5nLCB1c2luZyBkb3RcbiAgLy8gbm90YXRpb24uXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC5leHRlbmQoe1xuICAvLyAgICAgICBcImhlbGxvXCI6IFwiSGVsbG9cIixcbiAgLy8gICAgICAgXCJoZWxsb19uYW1lXCI6IFwiSGVsbG8sICV7bmFtZX1cIlxuICAvLyAgICAgfSwgXCJuYXZcIik7XG4gIC8vXG4gIC8vICAgICBjb25zb2xlLmxvZyhwb2x5Z2xvdC5waHJhc2VzKTtcbiAgLy8gICAgIC8vIHtcbiAgLy8gICAgIC8vICAgJ25hdi5oZWxsbyc6ICdIZWxsbycsXG4gIC8vICAgICAvLyAgICduYXYuaGVsbG9fbmFtZSc6ICdIZWxsbywgJXtuYW1lfSdcbiAgLy8gICAgIC8vIH1cbiAgLy9cbiAgLy8gVGhpcyBmZWF0dXJlIGlzIHVzZWQgaW50ZXJuYWxseSB0byBzdXBwb3J0IG5lc3RlZCBwaHJhc2Ugb2JqZWN0cy5cbiAgUG9seWdsb3QucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uIChtb3JlUGhyYXNlcywgcHJlZml4KSB7XG4gICAgdmFyIHBocmFzZTtcblxuICAgIGZvciAodmFyIGtleSBpbiBtb3JlUGhyYXNlcykge1xuICAgICAgaWYgKG1vcmVQaHJhc2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcGhyYXNlID0gbW9yZVBocmFzZXNba2V5XTtcbiAgICAgICAgaWYgKHByZWZpeCkga2V5ID0gcHJlZml4ICsgJy4nICsga2V5O1xuICAgICAgICBpZiAodHlwZW9mIHBocmFzZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aGlzLmV4dGVuZChwaHJhc2UsIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5waHJhc2VzW2tleV0gPSBwaHJhc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LnVuc2V0KHBocmFzZXMpXG4gIC8vIFVzZSBgdW5zZXRgIHRvIHNlbGVjdGl2ZWx5IHJlbW92ZSBrZXlzIGZyb20gYSBwb2x5Z2xvdCBpbnN0YW5jZS5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LnVuc2V0KFwic29tZV9rZXlcIik7XG4gIC8vICAgICBwb2x5Z2xvdC51bnNldCh7XG4gIC8vICAgICAgIFwiaGVsbG9cIjogXCJIZWxsb1wiLFxuICAvLyAgICAgICBcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwiXG4gIC8vICAgICB9KTtcbiAgLy9cbiAgLy8gVGhlIHVuc2V0IG1ldGhvZCBjYW4gdGFrZSBlaXRoZXIgYSBzdHJpbmcgKGZvciB0aGUga2V5KSwgb3IgYW4gb2JqZWN0IGhhc2ggd2l0aFxuICAvLyB0aGUga2V5cyB0aGF0IHlvdSB3b3VsZCBsaWtlIHRvIHVuc2V0LlxuICBQb2x5Z2xvdC5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbiAobW9yZVBocmFzZXMsIHByZWZpeCkge1xuICAgIHZhciBwaHJhc2U7XG5cbiAgICBpZiAodHlwZW9mIG1vcmVQaHJhc2VzID09PSAnc3RyaW5nJykge1xuICAgICAgZGVsZXRlIHRoaXMucGhyYXNlc1ttb3JlUGhyYXNlc107XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBtb3JlUGhyYXNlcykge1xuICAgICAgICBpZiAobW9yZVBocmFzZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHBocmFzZSA9IG1vcmVQaHJhc2VzW2tleV07XG4gICAgICAgICAgaWYgKHByZWZpeCkga2V5ID0gcHJlZml4ICsgJy4nICsga2V5O1xuICAgICAgICAgIGlmICh0eXBlb2YgcGhyYXNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy51bnNldChwaHJhc2UsIGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBocmFzZXNba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LmNsZWFyKClcbiAgLy9cbiAgLy8gQ2xlYXJzIGFsbCBwaHJhc2VzLiBVc2VmdWwgZm9yIHNwZWNpYWwgY2FzZXMsIHN1Y2ggYXMgZnJlZWluZ1xuICAvLyB1cCBtZW1vcnkgaWYgeW91IGhhdmUgbG90cyBvZiBwaHJhc2VzIGJ1dCBubyBsb25nZXIgbmVlZCB0b1xuICAvLyBwZXJmb3JtIGFueSB0cmFuc2xhdGlvbi4gQWxzbyB1c2VkIGludGVybmFsbHkgYnkgYHJlcGxhY2VgLlxuICBQb2x5Z2xvdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5waHJhc2VzID0ge307XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LnJlcGxhY2UocGhyYXNlcylcbiAgLy9cbiAgLy8gQ29tcGxldGVseSByZXBsYWNlIHRoZSBleGlzdGluZyBwaHJhc2VzIHdpdGggYSBuZXcgc2V0IG9mIHBocmFzZXMuXG4gIC8vIE5vcm1hbGx5LCBqdXN0IHVzZSBgZXh0ZW5kYCB0byBhZGQgbW9yZSBwaHJhc2VzLCBidXQgdW5kZXIgY2VydGFpblxuICAvLyBjaXJjdW1zdGFuY2VzLCB5b3UgbWF5IHdhbnQgdG8gbWFrZSBzdXJlIG5vIG9sZCBwaHJhc2VzIGFyZSBseWluZyBhcm91bmQuXG4gIFBvbHlnbG90LnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24gKG5ld1BocmFzZXMpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5leHRlbmQobmV3UGhyYXNlcyk7XG4gIH07XG5cbiAgLy8gIyMjIHBvbHlnbG90LnQoa2V5LCBvcHRpb25zKVxuICAvL1xuICAvLyBUaGUgbW9zdC11c2VkIG1ldGhvZC4gUHJvdmlkZSBhIGtleSwgYW5kIGB0YCB3aWxsIHJldHVybiB0aGVcbiAgLy8gcGhyYXNlLlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QudChcImhlbGxvXCIpO1xuICAvLyAgICAgPT4gXCJIZWxsb1wiXG4gIC8vXG4gIC8vIFRoZSBwaHJhc2UgdmFsdWUgaXMgcHJvdmlkZWQgZmlyc3QgYnkgYSBjYWxsIHRvIGBwb2x5Z2xvdC5leHRlbmQoKWAgb3JcbiAgLy8gYHBvbHlnbG90LnJlcGxhY2UoKWAuXG4gIC8vXG4gIC8vIFBhc3MgaW4gYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gcGVyZm9ybSBpbnRlcnBvbGF0aW9uLlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QudChcImhlbGxvX25hbWVcIiwge25hbWU6IFwiU3Bpa2VcIn0pO1xuICAvLyAgICAgPT4gXCJIZWxsbywgU3Bpa2VcIlxuICAvL1xuICAvLyBJZiB5b3UgbGlrZSwgeW91IGNhbiBwcm92aWRlIGEgZGVmYXVsdCB2YWx1ZSBpbiBjYXNlIHRoZSBwaHJhc2UgaXMgbWlzc2luZy5cbiAgLy8gVXNlIHRoZSBzcGVjaWFsIG9wdGlvbiBrZXkgXCJfXCIgdG8gc3BlY2lmeSBhIGRlZmF1bHQuXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC50KFwiaV9saWtlX3RvX3dyaXRlX2luX2xhbmd1YWdlXCIsIHtcbiAgLy8gICAgICAgXzogXCJJIGxpa2UgdG8gd3JpdGUgaW4gJXtsYW5ndWFnZX0uXCIsXG4gIC8vICAgICAgIGxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIlxuICAvLyAgICAgfSk7XG4gIC8vICAgICA9PiBcIkkgbGlrZSB0byB3cml0ZSBpbiBKYXZhU2NyaXB0LlwiXG4gIC8vXG4gIFBvbHlnbG90LnByb3RvdHlwZS50ID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xuICAgIHZhciBwaHJhc2UsIHJlc3VsdDtcbiAgICBvcHRpb25zID0gb3B0aW9ucyA9PSBudWxsID8ge30gOiBvcHRpb25zO1xuICAgIC8vIGFsbG93IG51bWJlciBhcyBhIHBsdXJhbGl6YXRpb24gc2hvcnRjdXRcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdudW1iZXInKSB7XG4gICAgICBvcHRpb25zID0geyBzbWFydF9jb3VudDogb3B0aW9ucyB9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMucGhyYXNlc1trZXldID09PSAnc3RyaW5nJykge1xuICAgICAgcGhyYXNlID0gdGhpcy5waHJhc2VzW2tleV07XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5fID09PSAnc3RyaW5nJykge1xuICAgICAgcGhyYXNlID0gb3B0aW9ucy5fO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hbGxvd01pc3NpbmcpIHtcbiAgICAgIHBocmFzZSA9IGtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53YXJuKCdNaXNzaW5nIHRyYW5zbGF0aW9uIGZvciBrZXk6IFwiJyArIGtleSArICdcIicpO1xuICAgICAgcmVzdWx0ID0ga2V5O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBocmFzZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMgPSBjbG9uZShvcHRpb25zKTtcbiAgICAgIHJlc3VsdCA9IGNob29zZVBsdXJhbEZvcm0ocGhyYXNlLCB0aGlzLmN1cnJlbnRMb2NhbGUsIG9wdGlvbnMuc21hcnRfY291bnQpO1xuICAgICAgcmVzdWx0ID0gaW50ZXJwb2xhdGUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QuaGFzKGtleSlcbiAgLy9cbiAgLy8gQ2hlY2sgaWYgcG9seWdsb3QgaGFzIGEgdHJhbnNsYXRpb24gZm9yIGdpdmVuIGtleVxuICBQb2x5Z2xvdC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgaW4gdGhpcy5waHJhc2VzO1xuICB9O1xuXG4gIC8vICMjIyMgUGx1cmFsaXphdGlvbiBtZXRob2RzXG4gIC8vIFRoZSBzdHJpbmcgdGhhdCBzZXBhcmF0ZXMgdGhlIGRpZmZlcmVudCBwaHJhc2UgcG9zc2liaWxpdGllcy5cbiAgdmFyIGRlbGltZXRlciA9ICd8fHx8JztcblxuICAvLyBNYXBwaW5nIGZyb20gcGx1cmFsaXphdGlvbiBncm91cCBwbHVyYWwgbG9naWMuXG4gIHZhciBwbHVyYWxUeXBlcyA9IHtcbiAgICBjaGluZXNlOiBmdW5jdGlvbiBjaGluZXNlKG4pIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgZ2VybWFuOiBmdW5jdGlvbiBnZXJtYW4obikge1xuICAgICAgcmV0dXJuIG4gIT09IDEgPyAxIDogMDtcbiAgICB9LFxuICAgIGZyZW5jaDogZnVuY3Rpb24gZnJlbmNoKG4pIHtcbiAgICAgIHJldHVybiBuID4gMSA/IDEgOiAwO1xuICAgIH0sXG4gICAgcnVzc2lhbjogZnVuY3Rpb24gcnVzc2lhbihuKSB7XG4gICAgICByZXR1cm4gbiAlIDEwID09PSAxICYmIG4gJSAxMDAgIT09IDExID8gMCA6IG4gJSAxMCA+PSAyICYmIG4gJSAxMCA8PSA0ICYmIChuICUgMTAwIDwgMTAgfHwgbiAlIDEwMCA+PSAyMCkgPyAxIDogMjtcbiAgICB9LFxuICAgIGN6ZWNoOiBmdW5jdGlvbiBjemVjaChuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gMSA/IDAgOiBuID49IDIgJiYgbiA8PSA0ID8gMSA6IDI7XG4gICAgfSxcbiAgICBwb2xpc2g6IGZ1bmN0aW9uIHBvbGlzaChuKSB7XG4gICAgICByZXR1cm4gbiA9PT0gMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDI7XG4gICAgfSxcbiAgICBpY2VsYW5kaWM6IGZ1bmN0aW9uIGljZWxhbmRpYyhuKSB7XG4gICAgICByZXR1cm4gbiAlIDEwICE9PSAxIHx8IG4gJSAxMDAgPT09IDExID8gMSA6IDA7XG4gICAgfVxuICB9O1xuXG4gIC8vIE1hcHBpbmcgZnJvbSBwbHVyYWxpemF0aW9uIGdyb3VwIHRvIGluZGl2aWR1YWwgbG9jYWxlcy5cbiAgdmFyIHBsdXJhbFR5cGVUb0xhbmd1YWdlcyA9IHtcbiAgICBjaGluZXNlOiBbJ2ZhJywgJ2lkJywgJ2phJywgJ2tvJywgJ2xvJywgJ21zJywgJ3RoJywgJ3RyJywgJ3poJ10sXG4gICAgZ2VybWFuOiBbJ2RhJywgJ2RlJywgJ2VuJywgJ2VzJywgJ2ZpJywgJ2VsJywgJ2hlJywgJ2h1JywgJ2l0JywgJ25sJywgJ25vJywgJ3B0JywgJ3N2J10sXG4gICAgZnJlbmNoOiBbJ2ZyJywgJ3RsJywgJ3B0LWJyJ10sXG4gICAgcnVzc2lhbjogWydocicsICdydSddLFxuICAgIGN6ZWNoOiBbJ2NzJywgJ3NrJ10sXG4gICAgcG9saXNoOiBbJ3BsJ10sXG4gICAgaWNlbGFuZGljOiBbJ2lzJ11cbiAgfTtcblxuICBmdW5jdGlvbiBsYW5nVG9UeXBlTWFwKG1hcHBpbmcpIHtcbiAgICB2YXIgdHlwZSxcbiAgICAgICAgbGFuZ3MsXG4gICAgICAgIGwsXG4gICAgICAgIHJldCA9IHt9O1xuICAgIGZvciAodHlwZSBpbiBtYXBwaW5nKSB7XG4gICAgICBpZiAobWFwcGluZy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICBsYW5ncyA9IG1hcHBpbmdbdHlwZV07XG4gICAgICAgIGZvciAobCBpbiBsYW5ncykge1xuICAgICAgICAgIHJldFtsYW5nc1tsXV0gPSB0eXBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBUcmltIGEgc3RyaW5nLlxuICB2YXIgdHJpbVJlID0gL15cXHMrfFxccyskL2c7XG4gIGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gICAgcmV0dXJuIHJlcGxhY2UuY2FsbChzdHIsIHRyaW1SZSwgJycpO1xuICB9XG5cbiAgLy8gQmFzZWQgb24gYSBwaHJhc2UgdGV4dCB0aGF0IGNvbnRhaW5zIGBuYCBwbHVyYWwgZm9ybXMgc2VwYXJhdGVkXG4gIC8vIGJ5IGBkZWxpbWV0ZXJgLCBhIGBsb2NhbGVgLCBhbmQgYSBgY291bnRgLCBjaG9vc2UgdGhlIGNvcnJlY3RcbiAgLy8gcGx1cmFsIGZvcm0sIG9yIG5vbmUgaWYgYGNvdW50YCBpcyBgbnVsbGAuXG4gIGZ1bmN0aW9uIGNob29zZVBsdXJhbEZvcm0odGV4dCwgbG9jYWxlLCBjb3VudCkge1xuICAgIHZhciByZXQsIHRleHRzLCBjaG9zZW5UZXh0O1xuICAgIGlmIChjb3VudCAhPSBudWxsICYmIHRleHQpIHtcbiAgICAgIHRleHRzID0gdGV4dC5zcGxpdChkZWxpbWV0ZXIpO1xuICAgICAgY2hvc2VuVGV4dCA9IHRleHRzW3BsdXJhbFR5cGVJbmRleChsb2NhbGUsIGNvdW50KV0gfHwgdGV4dHNbMF07XG4gICAgICByZXQgPSB0cmltKGNob3NlblRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQgPSB0ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZnVuY3Rpb24gcGx1cmFsVHlwZU5hbWUobG9jYWxlKSB7XG4gICAgdmFyIGxhbmdUb1BsdXJhbFR5cGUgPSBsYW5nVG9UeXBlTWFwKHBsdXJhbFR5cGVUb0xhbmd1YWdlcyk7XG4gICAgcmV0dXJuIGxhbmdUb1BsdXJhbFR5cGVbbG9jYWxlXSB8fCBsYW5nVG9QbHVyYWxUeXBlLmVuO1xuICB9XG5cbiAgZnVuY3Rpb24gcGx1cmFsVHlwZUluZGV4KGxvY2FsZSwgY291bnQpIHtcbiAgICByZXR1cm4gcGx1cmFsVHlwZXNbcGx1cmFsVHlwZU5hbWUobG9jYWxlKV0oY291bnQpO1xuICB9XG5cbiAgLy8gIyMjIGludGVycG9sYXRlXG4gIC8vXG4gIC8vIERvZXMgdGhlIGRpcnR5IHdvcmsuIENyZWF0ZXMgYSBgUmVnRXhwYCBvYmplY3QgZm9yIGVhY2hcbiAgLy8gaW50ZXJwb2xhdGlvbiBwbGFjZWhvbGRlci5cbiAgdmFyIGRvbGxhclJlZ2V4ID0gL1xcJC9nO1xuICB2YXIgZG9sbGFyQmlsbHNZYWxsID0gJyQkJCQnO1xuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShwaHJhc2UsIG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBhcmcgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKGFyZyAhPT0gJ18nICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoYXJnKSkge1xuICAgICAgICAvLyBFbnN1cmUgcmVwbGFjZW1lbnQgdmFsdWUgaXMgZXNjYXBlZCB0byBwcmV2ZW50IHNwZWNpYWwgJC1wcmVmaXhlZFxuICAgICAgICAvLyByZWdleCByZXBsYWNlIHRva2Vucy4gdGhlIFwiJCQkJFwiIGlzIG5lZWRlZCBiZWNhdXNlIGVhY2ggXCIkXCIgbmVlZHMgdG9cbiAgICAgICAgLy8gYmUgZXNjYXBlZCB3aXRoIFwiJFwiIGl0c2VsZiwgYW5kIHdlIG5lZWQgdHdvIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0LlxuICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBvcHRpb25zW2FyZ107XG4gICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSByZXBsYWNlLmNhbGwob3B0aW9uc1thcmddLCBkb2xsYXJSZWdleCwgZG9sbGFyQmlsbHNZYWxsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSBjcmVhdGUgYSBuZXcgYFJlZ0V4cGAgZWFjaCB0aW1lIGluc3RlYWQgb2YgdXNpbmcgYSBtb3JlLWVmZmljaWVudFxuICAgICAgICAvLyBzdHJpbmcgcmVwbGFjZSBzbyB0aGF0IHRoZSBzYW1lIGFyZ3VtZW50IGNhbiBiZSByZXBsYWNlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgICAvLyBpbiB0aGUgc2FtZSBwaHJhc2UuXG4gICAgICAgIHBocmFzZSA9IHJlcGxhY2UuY2FsbChwaHJhc2UsIG5ldyBSZWdFeHAoJyVcXFxceycgKyBhcmcgKyAnXFxcXH0nLCAnZycpLCByZXBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwaHJhc2U7XG4gIH1cblxuICAvLyAjIyMgd2FyblxuICAvL1xuICAvLyBQcm92aWRlcyBhIHdhcm5pbmcgaW4gdGhlIGNvbnNvbGUgaWYgYSBwaHJhc2Uga2V5IGlzIG1pc3NpbmcuXG4gIGZ1bmN0aW9uIHdhcm4obWVzc2FnZSkge1xuICAgIHJvb3QuY29uc29sZSAmJiByb290LmNvbnNvbGUud2FybiAmJiByb290LmNvbnNvbGUud2FybignV0FSTklORzogJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gIyMjIGNsb25lXG4gIC8vXG4gIC8vIENsb25lIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gY2xvbmUoc291cmNlKSB7XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICByZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICByZXR1cm4gUG9seWdsb3Q7XG59KTtcbi8vXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MjY4YUx5d3hGQ0E3cU5RY1JDS1ljNycsICdyb3VuZF9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXHJvdW5kX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBudW1iZXJzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdHlwZTogW2NjLlByZWZhYl1cbiAgICAgICAgfSxcblxuICAgICAgICByb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9udW1zID0gW107XG4gICAgICAgIHRoaXMuX2FuaSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMucm91bmQuYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHNldFJvdW5kOiBmdW5jdGlvbiBzZXRSb3VuZCh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgO2Vsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtlbHNlIHJldHVybjtcblxuICAgICAgICB3aGlsZSAodGhpcy5fbnVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX251bXMucG9wKCk7XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbmkuc3RvcCgpO1xuICAgICAgICB0aGlzLnJvdW5kLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIHZhciB0b3RhbFdpZHRoID0gMDtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKG5ldyBjYy5kZWxheVRpbWUoMC4yKSk7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2gobmV3IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VJbnQodmFsdWUuY2hhckF0KGluZGV4KSk7XG4gICAgICAgICAgICAgICAgdmFyIHByZWZhYiA9IHNlbGYubnVtYmVyc1tudW1dO1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgICAgICBub2RlLnggPSB0b3RhbFdpZHRoO1xuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gc2VsZi5ub2RlO1xuICAgICAgICAgICAgICAgIHRvdGFsV2lkdGggKz0gbm9kZS53aWR0aDtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIHNlbGYuX251bXMucHVzaChub2RlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25zLnB1c2gobmV3IGNjLmRlbGF5VGltZSgwLjIpKTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKG5ldyBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLnJvdW5kLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLnJvdW5kLnggPSB0b3RhbFdpZHRoIC0gMzU7XG4gICAgICAgICAgICBzZWxmLl9hbmkucGxheSgncm91bmRfaW1nJyk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24obmV3IGNjLlNlcXVlbmNlKGFjdGlvbnMpKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlZDI5MU4zaTF0RFU3WDBmMEJEcGNFNicsICdza2lsbF9jZmcnKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxkYXRhXFxza2lsbF9jZmcuanNcblxuLypcclxuYWN0VHlwZSDnsbvlnovor7TmmI7vvJpcclxuICAgIDE6IOWBmuaIkOS8pOWusyDlv4XloavlrZfmrrUoYWN0VmFsdWUgcmFuYWdlKVxyXG4gICAgMjog6Ieq6Lqr5pa95Yqg56Gs55u0IOW/heWhq+Wtl+autShhY3RWYWx1ZSlcclxuICAgIDM6IOmch+Wxj1xyXG4gICAgNDog5pKt5pS+54m55pWIXHJcbiovXG5cbm1vZHVsZS5leHBvcnRzLmRhdGEgPSBbe1xuICAgIGlkOiAwLFxuICAgIHBvc3R1cmVzOiBbe1xuICAgICAgICBpZDogMSxcbiAgICAgICAgYWN0aW9uSW5kZXg6IDEsXG4gICAgICAgIHRpbWU6IDAuMyxcbiAgICAgICAgdGltZVBvaW50czogW3tcbiAgICAgICAgICAgIGFjdFR5cGU6IDEsXG4gICAgICAgICAgICB0YWtlVGltZTogMC4yNSxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMjBdLFxuICAgICAgICAgICAgcmFuZ2U6IG5ldyBjYy5SZWN0KDMwLCA4OCwgMzgsIDI5KSxcbiAgICAgICAgICAgIGF0dGFja1R5cGU6IDEsXG4gICAgICAgICAgICBzb3VuZDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiAyLCAvLzLku6Pooajlr7noh6rouqvmlr3liqDnoaznm7RcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgYWN0VmFsdWU6IFswLjNdXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogMixcbiAgICAgICAgYWN0aW9uSW5kZXg6IDIsXG4gICAgICAgIHRpbWU6IDAuNCxcbiAgICAgICAgdGltZVBvaW50czogW3tcbiAgICAgICAgICAgIGFjdFR5cGU6IDEsXG4gICAgICAgICAgICB0YWtlVGltZTogMC4yLFxuICAgICAgICAgICAgYWN0VmFsdWU6IFsyMl0sXG4gICAgICAgICAgICByYW5nZTogbmV3IGNjLlJlY3QoMzMsIDk4LCAzMCwgNDUpLFxuICAgICAgICAgICAgYXR0YWNrVHlwZTogMixcbiAgICAgICAgICAgIGF0dGFja1BhcmFtOiB7IHRvcFRpbWU6IDAuNCwgdG9wSGVpZ2h0OiAxMDAsIGRpc3RhbmNlOiAzMCwgY29tYm86IDM1IH0sXG4gICAgICAgICAgICBzb3VuZDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiAyLCAvLzLku6Pooajlr7noh6rouqvmlr3liqDnoaznm7RcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgYWN0VmFsdWU6IFswLjRdXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogMyxcbiAgICAgICAgYWN0aW9uSW5kZXg6IDMsXG4gICAgICAgIHRpbWU6IDAuNSxcbiAgICAgICAgZWZmZWN0VGltZVBvaW50OiAwLFxuICAgICAgICB0aW1lUG9pbnRzOiBbe1xuICAgICAgICAgICAgYWN0VHlwZTogMSxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLjI1LFxuICAgICAgICAgICAgYWN0VmFsdWU6IFsyNl0sXG4gICAgICAgICAgICByYW5nZTogbmV3IGNjLlJlY3QoNDEsIDc4LCA5MCwgMzMpLFxuICAgICAgICAgICAgYXR0YWNrVHlwZTogMixcbiAgICAgICAgICAgIGF0dGFja1BhcmFtOiB7IHRvcFRpbWU6IDAuNCwgdG9wSGVpZ2h0OiAyMCwgZGlzdGFuY2U6IDMwMCwgY29tYm86IDcwIH0sXG4gICAgICAgICAgICBzb3VuZDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiAyLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzAuNV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogMyxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLjI1XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDQsXG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGxheWVyOiAxLFxuICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogNCxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgbGF5ZXI6IDAsXG4gICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiA0LFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBsYXllcjogMSxcbiAgICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgICAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9XG4gICAgICAgIH1dXG4gICAgfV1cbn0sIHtcbiAgICBpZDogMSxcbiAgICBwb3N0dXJlczogW3tcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGFjdGlvbkluZGV4OiAxLFxuICAgICAgICB0aW1lOiAwLjMsXG4gICAgICAgIHRpbWVQb2ludHM6IFt7XG4gICAgICAgICAgICBhY3RUeXBlOiAxLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAuMjUsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzIwXSxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgY2MuUmVjdCgzMCwgODgsIDM4LCAyOSksXG4gICAgICAgICAgICBhdHRhY2tUeXBlOiAxLFxuICAgICAgICAgICAgc291bmQ6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogMiwgLy8y5Luj6KGo5a+56Ieq6Lqr5pa95Yqg56Gs55u0XG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMC4zXVxuICAgICAgICB9XVxuICAgIH1dXG59XTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzM3ZjM0MnAyYkZGS3FBSkpCNHhrWmcwJywgJ3NraWxsX2RlZmluZScpO1xuLy8gc2NyaXB0XFxhY3Rvclxcc2tpbGxfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzLlRpbWVQb2ludEFjdFR5cGUgPSB7XG4gICAgREFNQUdFOiAxLFxuICAgIFNFTEZfREVMQVk6IDIsXG4gICAgU0hPQ0tfU0NSRUVOOiAzLFxuICAgIFBMQVlfRUZGRUNUOiA0XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5BdHRhY2tUeXBlID0ge1xuICAgIE5PUk1BTDogMSxcbiAgICBGTFk6IDJcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczZWJlM3Y5Z0NSTmJxb0Y2Z2ZjRzVNcycsICdza2lsbF9wcm92aWRlcicpO1xuLy8gc2NyaXB0XFxjb25maWdcXHByb3ZpZGVyXFxza2lsbF9wcm92aWRlci5qc1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnc2tpbGxfY2ZnJykuZGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0Q29uZmlnOiBmdW5jdGlvbiBnZXRDb25maWcoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNmZ1tpZF07XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ExYmUwYlB1V3hHVWFTT1hYSEZtenBuJywgJ3N0YXRlX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcc3RhdGVfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaHBBbHBoYToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaHBMaWdodDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbmFtZUxhYmVsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZVRpbWU6IDNcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zdGFydFdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5fdGFyZ2V0V2lkdGggPSAwO1xuICAgICAgICB0aGlzLl9tYXhXaWR0aCA9IHRoaXMuaHBMaWdodC53aWR0aDtcbiAgICB9LFxuXG4gICAgc2V0TmFtZTogZnVuY3Rpb24gc2V0TmFtZShuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZUxhYmVsLnN0cmluZyA9IG5hbWU7XG4gICAgfSxcblxuICAgIHNldEhwOiBmdW5jdGlvbiBzZXRIcChocCwgbWF4LCBhbmkpIHtcbiAgICAgICAgaWYgKGhwIDwgMCkgaHAgPSAwO1xuICAgICAgICBpZiAobWF4IDwgMSkgbWF4ID0gMTtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSBocCAvIG1heDtcbiAgICAgICAgdmFyIHdpZHRoID0gcGVyY2VudCAqIHRoaXMuX21heFdpZHRoO1xuICAgICAgICBpZiAoIWFuaSkge1xuICAgICAgICAgICAgdGhpcy5ocEFscGhhLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLmhwTGlnaHQud2lkdGggPSB3aWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaHBMaWdodC53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRXaWR0aCA9IHRoaXMuaHBBbHBoYS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldFdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLl90aW1lID0gdGhpcy5fZGVsYXlUaW1lID0gKHRoaXMuX3N0YXJ0V2lkdGggLSB0aGlzLl90YXJnZXRXaWR0aCkgLyB0aGlzLl9tYXhXaWR0aCAqIHRoaXMubW92ZVRpbWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5fZGVsYXlUaW1lID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lIC09IGR0O1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGF5VGltZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gdGhpcy5fdGltZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5ocExpZ2h0LndpZHRoID0gdGhpcy5fdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5fdGltZSAtIHRoaXMuX2RlbGF5VGltZTsgLy8gdGhpcy5tb3ZlVGltZTtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHRoaXMuX21heFdpZHRoICogZSAvIHRoaXMubW92ZVRpbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5ocEFscGhhLndpZHRoID0gdGhpcy5fc3RhcnRXaWR0aCAtIGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2I0M2IxdFJCdzVIbXJxa1B0TVVUMjN1JywgJ3N5bmNfdGltZXInKTtcbi8vIHNjcmlwdFxcdGltZXJcXHN5bmNfdGltZXIuanNcblxubW9kdWxlLmV4cG9ydHNbXCJjbGFzc1wiXSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl90aWNrID0gMDtcbiAgICAgICAgdGhpcy5fb3JnaW5UaWNrID0gMDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl90aWNrID0gMDtcbiAgICAgICAgdGhpcy5fb3JnaW5UaWNrID0gMDtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5fdGljayArPSBkdDtcbiAgICAgICAgdGhpcy5fb3JnaW5UaWNrICs9IGR0O1xuICAgIH0sXG5cbiAgICBnZXRUaW1lcjogZnVuY3Rpb24gZ2V0VGltZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aWNrO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTRjYTBmSXFZUkFNN2RmOUFCejE2MFEnLCAndGVzdF9tYXAnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXHRlc3RfbWFwLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcm91bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBlZGl0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWJjOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb1NvdXJjZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIHRoaXMuX3JvdW5kTnVtID0gdGhpcy5yb3VuZC5nZXRDb21wb25lbnQoJ3JvdW5kX2N0cmwnKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICAvL2NjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYygncmVzb3VyY2VzL3NvdW5kL2JnJywgdHJ1ZSk7XG4gICAgICAgIC8vdGhpcy5fbWFwLmxvY2tSZWdpb24gPSBuZXcgY2MuUmVjdCgwLCAwLCAxNTAwLCA2NDApO1xuICAgICAgICAvL3RoaXMuX21hcC5zZXRNYXBQb3ZpdCgtMTAwLCAwLCAxKTtcbiAgICB9LFxuXG4gICAgb25DbGljazogZnVuY3Rpb24gb25DbGljaygpIHtcbiAgICAgICAgLy9jYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoJ3Jlc291cmNlcy9zb3VuZC9iZycsIHRydWUpO1xuICAgICAgICB0aGlzLmFiYy5wbGF5KCk7XG4gICAgICAgIC8vY2MubG9hZGVyLmxvYWRSZXMoJ3NvdW5kL2JnJywgY2MuQXVkaW9DbGlwLCBmdW5jdGlvbiAoZXJyLCBjbGlwKSB7XG4gICAgICAgIC8vICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYygncmVzb3VyY2VzL3NvdW5kL2JnLm1wMycpO1xuICAgICAgICAvLyAgICBjYy5sb2coJ3BwcDogJywgZXJyLCBjbGlwKTtcbiAgICAgICAgLy99KTtcbiAgICAgICAgdGhpcy5fcm91bmROdW0uc2V0Um91bmQodGhpcy5lZGl0LnN0cmluZyk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgY2MubG9nKHRoaXMuYWJjLmlzUGxheWluZyk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxMTJhYmF6ZFhKSEY1QW1ZdEN0bzJncycsICd0aW1lX3V0aWwnKTtcbi8vIHNjcmlwdFxcdXRpbFxcdGltZV91dGlsLmpzXG5cbmZ1bmN0aW9uIGZpbGxaZXJvKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID4gOSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnMCcgKyB2YWx1ZS50b1N0cmluZygpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIHNlY1RvTVM6IGZ1bmN0aW9uIHNlY1RvTVMoc2VjKSB7XG4gICAgICAgIHZhciBzID0gc2VjICUgNjA7XG4gICAgICAgIHZhciBtID0gKHNlYyAtIHMpIC8gNjA7XG4gICAgICAgIHZhciByZXQgPSBjYy5qcy5mb3JtYXRTdHIoXCIlczolc1wiLCBmaWxsWmVybyhtKSwgZmlsbFplcm8ocykpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBzZWNUb0hNUzogZnVuY3Rpb24gc2VjVG9ITVMoc2VjKSB7XG4gICAgICAgIHZhciB0ID0gc2VjICUgMzYwMDtcbiAgICAgICAgdmFyIGggPSAoc2VjIC0gdCkgLyAzNjAwO1xuICAgICAgICB2YXIgcyA9IHQgJSA2MDtcbiAgICAgICAgdmFyIG0gPSAodCAtIHMpIC8gNjA7XG4gICAgICAgIHZhciByZXQgPSBjYy5qcy5mb3JtYXRTdHIoXCIlczolczolc1wiLCBmaWxsWmVybyhoKSwgZmlsbFplcm8obSksIGZpbGxaZXJvKHMpKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkMmM5OWorSHJkTkE2bWZHSnRqbjVtUCcsICd1aV9jdHJsJyk7XG4vLyBzY3JpcHRcXHVpXFx1aV9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpZDoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJncyA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFuYWdlcjoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQobWFuYWdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hbmFnZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2lkID0gLTE7XG4gICAgfSxcblxuICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmNsb3NlVUkodGhpcy5ub2RlKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGU1NDJHWENScEVLb2xQRXVMRmdRTVQnLCAndWlfbWFuYWdlcicpO1xuLy8gc2NyaXB0XFx1aVxcdWlfbWFuYWdlci5qc1xuXG52YXIgQnVmZmVyVGFibGUgPSByZXF1aXJlKCdidWZmZXJfdGFibGUnKVsnY2xhc3MnXTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB1aUNvbnRhaW5lcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl90YWJsZSA9IFtdO1xuICAgIH0sXG5cbiAgICBvcGVuVUk6IGZ1bmN0aW9uIG9wZW5VSShuYW1lLCBhcmdzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoJ3ByZWZhYi91aS8nICsgbmFtZSwgY2MuUHJlZmFiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHNlbGYuX3RhYmxlLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB2YXIgY3RybCA9IG5vZGUuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgICAgICAgICBjdHJsLmlkID0gaWQ7XG4gICAgICAgICAgICBjdHJsLmFyZ3MgPSBhcmdzO1xuICAgICAgICAgICAgY3RybC5tYW5hZ2VyID0gc2VsZjtcbiAgICAgICAgICAgIHNlbGYudWlDb250YWluZXIuYWRkQ2hpbGQobm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjbG9zZVVJOiBmdW5jdGlvbiBjbG9zZVVJKG5vZGUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG5vZGUgPT0gdGhpcy5fdGFibGVbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvc2VBbGw6IGZ1bmN0aW9uIGNsb3NlQWxsKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fdGFibGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl90YWJsZS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChub2RlLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1NWYzMXRIN2h0Tlg3OVNQK3FOSEExRicsICd4eHRlYScpO1xuLy8gc2NyaXB0XFxsaWJcXHRoaXJkXFx4eHRlYVxceHh0ZWEuanNcblxuZnVuY3Rpb24gdXRmMTZ0bzgoc3RyKSB7XG4gICAgdmFyIG91dCwgaSwgbGVuLCBjO1xuICAgIG91dCA9IFtdO1xuICAgIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPj0gMHgwMDAxICYmIGMgPD0gMHgwMDdGKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPiAweDA3RkYpIHtcbiAgICAgICAgICAgIG91dFtpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhFMCB8IGMgPj4gMTIgJiAweDBGLCAweDgwIHwgYyA+PiA2ICYgMHgzRiwgMHg4MCB8IGMgPj4gMCAmIDB4M0YpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0W2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEMwIHwgYyA+PiA2ICYgMHgxRiwgMHg4MCB8IGMgPj4gMCAmIDB4M0YpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG59XG5mdW5jdGlvbiB1dGY4dG8xNihzdHIpIHtcbiAgICB2YXIgb3V0LCBpLCBsZW4sIGM7XG4gICAgdmFyIGNoYXIyLCBjaGFyMztcbiAgICBvdXQgPSBbXTtcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBzd2l0Y2ggKGMgPj4gNCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IHN0ci5jaGFyQXQoaSAtIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgJiAweDFGKSA8PCA2IHwgY2hhcjIgJiAweDNGKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICAgICAgICAgIGNoYXIzID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChjICYgMHgwRikgPDwgMTIgfCAoY2hhcjIgJiAweDNGKSA8PCA2IHwgKGNoYXIzICYgMHgzRikgPDwgMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cbnZhciBiYXNlNjRFbmNvZGVDaGFycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiO1xudmFyIGJhc2U2NERlY29kZUNoYXJzID0gbmV3IEFycmF5KC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCA2MiwgLTEsIC0xLCAtMSwgNjMsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDksIDUwLCA1MSwgLTEsIC0xLCAtMSwgLTEsIC0xKTtcbmZ1bmN0aW9uIGJhc2U2NGVuY29kZShzdHIpIHtcbiAgICB2YXIgb3V0LCBpLCBsZW47XG4gICAgdmFyIGMxLCBjMiwgYzM7XG4gICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpID0gMDtcbiAgICBvdXQgPSBcIlwiO1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIGMxID0gc3RyLmNoYXJDb2RlQXQoaSsrKSAmIDB4ZmY7XG4gICAgICAgIGlmIChpID09IGxlbikge1xuICAgICAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdChjMSA+PiAyKTtcbiAgICAgICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoKGMxICYgMHgzKSA8PCA0KTtcbiAgICAgICAgICAgIG91dCArPSBcIj09XCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjMiA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGlmIChpID09IGxlbikge1xuICAgICAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdChjMSA+PiAyKTtcbiAgICAgICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoKGMxICYgMHgzKSA8PCA0IHwgKGMyICYgMHhGMCkgPj4gNCk7XG4gICAgICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KChjMiAmIDB4RikgPDwgMik7XG4gICAgICAgICAgICBvdXQgKz0gXCI9XCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjMyA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoYzEgPj4gMik7XG4gICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoKGMxICYgMHgzKSA8PCA0IHwgKGMyICYgMHhGMCkgPj4gNCk7XG4gICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoKGMyICYgMHhGKSA8PCAyIHwgKGMzICYgMHhDMCkgPj4gNik7XG4gICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoYzMgJiAweDNGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIGJhc2U2NGRlY29kZShzdHIpIHtcbiAgICB2YXIgYzEsIGMyLCBjMywgYzQ7XG4gICAgdmFyIGksIGxlbiwgb3V0O1xuICAgIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaSA9IDA7XG4gICAgb3V0ID0gXCJcIjtcbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjMSA9IGJhc2U2NERlY29kZUNoYXJzW3N0ci5jaGFyQ29kZUF0KGkrKykgJiAweGZmXTtcbiAgICAgICAgfSB3aGlsZSAoaSA8IGxlbiAmJiBjMSA9PSAtMSk7XG4gICAgICAgIGlmIChjMSA9PSAtMSkgYnJlYWs7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGMyID0gYmFzZTY0RGVjb2RlQ2hhcnNbc3RyLmNoYXJDb2RlQXQoaSsrKSAmIDB4ZmZdO1xuICAgICAgICB9IHdoaWxlIChpIDwgbGVuICYmIGMyID09IC0xKTtcbiAgICAgICAgaWYgKGMyID09IC0xKSBicmVhaztcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYzEgPDwgMiB8IChjMiAmIDB4MzApID4+IDQpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjMyA9IHN0ci5jaGFyQ29kZUF0KGkrKykgJiAweGZmO1xuICAgICAgICAgICAgaWYgKGMzID09IDYxKSByZXR1cm4gb3V0O1xuICAgICAgICAgICAgYzMgPSBiYXNlNjREZWNvZGVDaGFyc1tjM107XG4gICAgICAgIH0gd2hpbGUgKGkgPCBsZW4gJiYgYzMgPT0gLTEpO1xuICAgICAgICBpZiAoYzMgPT0gLTEpIGJyZWFrO1xuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYzIgJiAwWEYpIDw8IDQgfCAoYzMgJiAweDNDKSA+PiAyKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYzQgPSBzdHIuY2hhckNvZGVBdChpKyspICYgMHhmZjtcbiAgICAgICAgICAgIGlmIChjNCA9PSA2MSkgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIGM0ID0gYmFzZTY0RGVjb2RlQ2hhcnNbYzRdO1xuICAgICAgICB9IHdoaWxlIChpIDwgbGVuICYmIGM0ID09IC0xKTtcbiAgICAgICAgaWYgKGM0ID09IC0xKSBicmVhaztcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMzICYgMHgwMykgPDwgNiB8IGM0KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIGxvbmcyc3RyKHYsIHcpIHtcbiAgICB2YXIgdmwgPSB2Lmxlbmd0aDtcbiAgICB2YXIgc2wgPSB2W3ZsIC0gMV0gJiAweGZmZmZmZmZmO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmw7IGkrKykge1xuICAgICAgICB2W2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSh2W2ldICYgMHhmZiwgdltpXSA+Pj4gOCAmIDB4ZmYsIHZbaV0gPj4+IDE2ICYgMHhmZiwgdltpXSA+Pj4gMjQgJiAweGZmKTtcbiAgICB9XG4gICAgaWYgKHcpIHtcbiAgICAgICAgcmV0dXJuIHYuam9pbignJykuc3Vic3RyaW5nKDAsIHNsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdi5qb2luKCcnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdHIybG9uZyhzLCB3KSB7XG4gICAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICAgIHZhciB2ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgICAgICB2W2kgPj4gMl0gPSBzLmNoYXJDb2RlQXQoaSkgfCBzLmNoYXJDb2RlQXQoaSArIDEpIDw8IDggfCBzLmNoYXJDb2RlQXQoaSArIDIpIDw8IDE2IHwgcy5jaGFyQ29kZUF0KGkgKyAzKSA8PCAyNDtcbiAgICB9XG4gICAgaWYgKHcpIHtcbiAgICAgICAgdlt2Lmxlbmd0aF0gPSBsZW47XG4gICAgfVxuICAgIHJldHVybiB2O1xufVxuZnVuY3Rpb24geHh0ZWFfZW5jcnlwdChzdHIsIGtleSkge1xuICAgIGlmIChzdHIgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgdmFyIHYgPSBzdHIybG9uZyhzdHIsIHRydWUpO1xuICAgIHZhciBrID0gc3RyMmxvbmcoa2V5LCBmYWxzZSk7XG4gICAgdmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG4gICAgdmFyIHogPSB2W25dLFxuICAgICAgICB5ID0gdlswXSxcbiAgICAgICAgZGVsdGEgPSAweDlFMzc3OUI5O1xuICAgIHZhciBteCxcbiAgICAgICAgZSxcbiAgICAgICAgcSA9IE1hdGguZmxvb3IoNiArIDUyIC8gKG4gKyAxKSksXG4gICAgICAgIHN1bSA9IDA7XG4gICAgd2hpbGUgKHEtLSA+IDApIHtcbiAgICAgICAgc3VtID0gc3VtICsgZGVsdGEgJiAweGZmZmZmZmZmO1xuICAgICAgICBlID0gc3VtID4+PiAyICYgMztcbiAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBuOyBwKyspIHtcbiAgICAgICAgICAgIHkgPSB2W3AgKyAxXTtcbiAgICAgICAgICAgIG14ID0gKHogPj4+IDUgXiB5IDw8IDIpICsgKHkgPj4+IDMgXiB6IDw8IDQpIF4gKHN1bSBeIHkpICsgKGtbcCAmIDMgXiBlXSBeIHopO1xuICAgICAgICAgICAgeiA9IHZbcF0gPSB2W3BdICsgbXggJiAweGZmZmZmZmZmO1xuICAgICAgICB9XG4gICAgICAgIHkgPSB2WzBdO1xuICAgICAgICBteCA9ICh6ID4+PiA1IF4geSA8PCAyKSArICh5ID4+PiAzIF4geiA8PCA0KSBeIChzdW0gXiB5KSArIChrW3AgJiAzIF4gZV0gXiB6KTtcbiAgICAgICAgeiA9IHZbbl0gPSB2W25dICsgbXggJiAweGZmZmZmZmZmO1xuICAgIH1cbiAgICByZXR1cm4gbG9uZzJzdHIodiwgZmFsc2UpO1xufVxuZnVuY3Rpb24geHh0ZWFfZGVjcnlwdChzdHIsIGtleSkge1xuICAgIGlmIChzdHIgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgdmFyIHYgPSBzdHIybG9uZyhzdHIsIGZhbHNlKTtcbiAgICB2YXIgayA9IHN0cjJsb25nKGtleSwgZmFsc2UpO1xuICAgIHZhciBuID0gdi5sZW5ndGggLSAxO1xuICAgIHZhciB6ID0gdltuIC0gMV0sXG4gICAgICAgIHkgPSB2WzBdLFxuICAgICAgICBkZWx0YSA9IDB4OUUzNzc5Qjk7XG4gICAgdmFyIG14LFxuICAgICAgICBlLFxuICAgICAgICBxID0gTWF0aC5mbG9vcig2ICsgNTIgLyAobiArIDEpKSxcbiAgICAgICAgc3VtID0gcSAqIGRlbHRhICYgMHhmZmZmZmZmZjtcbiAgICB3aGlsZSAoc3VtICE9IDApIHtcbiAgICAgICAgZSA9IHN1bSA+Pj4gMiAmIDM7XG4gICAgICAgIGZvciAodmFyIHAgPSBuOyBwID4gMDsgcC0tKSB7XG4gICAgICAgICAgICB6ID0gdltwIC0gMV07XG4gICAgICAgICAgICBteCA9ICh6ID4+PiA1IF4geSA8PCAyKSArICh5ID4+PiAzIF4geiA8PCA0KSBeIChzdW0gXiB5KSArIChrW3AgJiAzIF4gZV0gXiB6KTtcbiAgICAgICAgICAgIHkgPSB2W3BdID0gdltwXSAtIG14ICYgMHhmZmZmZmZmZjtcbiAgICAgICAgfVxuICAgICAgICB6ID0gdltuXTtcbiAgICAgICAgbXggPSAoeiA+Pj4gNSBeIHkgPDwgMikgKyAoeSA+Pj4gMyBeIHogPDwgNCkgXiAoc3VtIF4geSkgKyAoa1twICYgMyBeIGVdIF4geik7XG4gICAgICAgIHkgPSB2WzBdID0gdlswXSAtIG14ICYgMHhmZmZmZmZmZjtcbiAgICAgICAgc3VtID0gc3VtIC0gZGVsdGEgJiAweGZmZmZmZmZmO1xuICAgIH1cbiAgICByZXR1cm4gbG9uZzJzdHIodiwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHV0ZjE2dG84OiB1dGYxNnRvOCxcbiAgICB1dGY4dG8xNjogdXRmOHRvMTYsXG4gICAgYmFzZTY0ZW5jb2RlOiBiYXNlNjRlbmNvZGUsXG4gICAgYmFzZTY0ZGVjb2RlOiBiYXNlNjRkZWNvZGUsXG4gICAgZW5jcnlwdDogeHh0ZWFfZW5jcnlwdCxcbiAgICBkZWNyeXB0OiB4eHRlYV9kZWNyeXB0XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjZlYTNtK1hEQkNNYjVBYTA3dWpQQTYnLCAnemgnKTtcbi8vIHNjcmlwdFxcaTE4blxcZGF0YVxcemguanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJHV19HQU1FXCI6IFwi55uW5LuY6YCa5ri45oiPXCIsXG4gICAgXCJjaGVja2luZ191cGRhdGVcIjogXCLmraPlnKjmo4Dmn6Xmm7TmlrBcIixcbiAgICBcInVwZGF0aW5nX2Fzc2V0c1wiOiBcIuato+WcqOabtOaWsOi1hOa6kFwiLFxuICAgIFwibG9hZGluZ19hc3NldHNcIjogXCLmraPlnKjliqDovb3otYTmupDvvIzkuI3nlKjmtYHph4/llpTvvIFcIixcbiAgICBcImluaXR0aW5nX2dhbWVcIjogXCLmraPlnKjliJ3lp4vljJbmuLjmiI9cIixcbiAgICBcImVudGVyaW5nX2dhbWVcIjogXCLmraPlnKjov5vlhaXmuLjmiI9cIixcbiAgICBcInVwZGF0ZV9wZXJjZW50XCI6IFwi5pu05paw6L+b5bqm77yaXCIsXG4gICAgXCJjb25maXJtX3VwZGF0ZVwiOiBcIuWPkeeOsOWcqOaWsOeJiOacrO+8jOS9oOmcgOimgeabtOaWsOaJjeiDvee7p+e7rea4uOaIj1wiLFxuICAgIFwic3RhcnRfdXBkYXRlXCI6IFwi5pu05pawXCIsXG4gICAgXCJleGl0X2dhbWVcIjogXCLpgIDlh7pcIixcbiAgICBcInJldHJ5X3VwZGF0ZVwiOiBcIumHjeivlVwiLFxuICAgIFwiZmFpbF91cGRhdGVcIjogXCLmm7TmlrDlpLHotKXvvIzor7fph43or5VcIixcbiAgICBcImFjY291bnRfbm90X2VtcHR5XCI6IFwi5biQ5Y+35LiN6IO95Li656m6XCIsXG4gICAgXCJwYXNzd2Rfbm90X2VtcHR5XCI6IFwi5a+G56CB5LiN6IO95Li656m6XCIsXG4gICAgXCJleGNoYW5nZV9mb3JtYXRcIjogXCIlZOenr+WIhj0lZOmHkeW4gVwiLFxuICAgIFwib3duX3BvaW50X2Zvcm1hdFwiOiBcIuenr+WIhu+8miVkXCIsXG4gICAgXCJjb25maXJtX2V4Y2hhbmdlX2NvaW5cIjogXCLnoa7lrprkvb/nlKglZOenr+WIhuWFkeaNoiVk6YeR5biB5ZCX77yfXCIsXG4gICAgXCJleGNoYW5nZV9zdWNjZXNzXCI6IFwi5YWR5o2i5oiQ5YqfXCIsXG4gICAgXCJidXlfcGh5c2ljYWxfc3VjY2Vzc1wiOiBcIui0reS5sOS9k+WKm+aIkOWKn1wiXG59O1xuXG5jYy5fUkZwb3AoKTsiXX0=
