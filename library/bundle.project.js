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
        cc.loader.loadRes("sound/5", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        });
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
                    if (this._floatStartTime <= 0) this.startHurt(0.3, this._direction);
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
var GuideDefine = require("guide_define");
var TriggerType = HurldeDefine.TriggerType;
var CmdType = HurldeDefine.CmdType;
var CondType = HurldeDefine.CondType;
var ControlKey = ControlDefine.ControlKey;
var GuideStep = GuideDefine.GuideStep;
var GuideMask = GuideDefine.GuideMask;

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
        playerPrefab: cc.Prefab,
        guideFingerAni: cc.Animation,

        guideStep: {
            get: function get() {
                return this._guideStep;
            },

            set: function set(step) {
                this._guideStep;
            }
        }
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
        this._totalKillNum = 0;

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

        if (this._resultHandler) {
            Global.gameEventDispatcher.removeEventHandler(this._resultHandler);
            this._resultHandler = null;
        }

        cc.audioEngine.stopMusic(true);

        // 不能这样做，destroy时所有listener已移除
        //cc.eventManager.removeListener(this._listener);
    },

    pause: function pause(show) {
        //cc.director.pause();
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

    onResultGame: function onResultGame() {
        Global.gameEventDispatcher.removeEventHandler(this._resultHandler);
        this._resultHandler = null;
        this._uiManager.openUI('mission_fail', { killNum: this._totalKillNum, roundNum: this._roundNum });
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
        this._totalKillNum = 0;
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
        this._totalKillNum++;
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
                cc.log('retry count', this._retryCount);
                if (this._retryCount > 0) {
                    this._uiManager.openUI('relive_confirm', { retryCount: this._retryCount, killNum: this._totalKillNum, roundNum: this._roundNum });
                } else {
                    this._resultHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GAME_RESULT, this.onResultGame.bind(this));
                    var maxScore = parseInt(this._totalKillNum + 1 + "0" + this._roundNum);
                    GameRpc.Clt2Srv.gameResult(maxScore);
                }

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
                    if (!(Global.guideStep & GuideMask.TRANS_DOOR_ARROW)) {
                        this.playEffect(9, 1, new cc.Vec2(cmd.args.x, cmd.args.y), false, true);
                        this._guideStep = GuideStep.ENTER_TRANS_DOOR;
                        Global.guideStep |= GuideMask.TRANS_DOOR_ARROW;
                    }
                    break;

                case CmdType.CHANGE_HURDLE:
                    needBreak = true;
                    if (this._guideStep == GuideStep.ENTER_TRANS_DOOR) {
                        cc.sys.localStorage.setItem('guide_mask', Global.guideStep);
                        this._guideStep = GuideStep.NONE;
                    }
                    this.changeHurdle(cmd.args.id);
                    break;

                case CmdType.MOVE_CAMERA:
                    this._map.cameraTo(cmd.args.x, cmd.args.y, cmd.args.time);
                    break;

                case CmdType.DO_MOVE_GUIDE:
                    if (!(Global.guideStep & GuideMask.MOVE)) {
                        this.guideFingerAni.node.x = this.joyStick.x;
                        this.guideFingerAni.node.y = this.joyStick.y;
                        this.guideFingerAni.play('guide_finger_move');
                        this._guideStep = GuideStep.MOVE;
                        Global.guideStep |= GuideMask.MOVE;
                    }
                    break;

                case CmdType.DO_TOUCH_GUIDE:
                    if (!(Global.guideStep & GuideMask.HIT)) {
                        cc.log("DO_TOUCH_GUIDE");
                        this.guideFingerAni.node.x = this.attackButton.x;
                        this.guideFingerAni.node.y = this.attackButton.y;
                        this.guideFingerAni.play('guide_finger_touch');
                        this._guideStep = GuideStep.TOUCH;
                        Global.guideStep |= GuideMask.HIT;
                    }
                    break;

                default:
                    break;
            }
            if (needBreak) break;
        }
    },

    endGuide: function endGuide() {
        this.guideFingerAni.node.x = -5000;
        this.guideFingerAni.node.y = -5000;
        this.guideFingerAni.stop();
        this._guideStep = GuideStep.NONE;
        cc.sys.localStorage.setItem("guide_mask", Global.guideStep);
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
},{"control_define":"control_define","guide_define":"guide_define","hurdle_define":"hurdle_define"}],"boot_ctrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f0735HPSrZGa6+MPMhkvwbu', 'boot_ctrl');
// script\scene\boot_ctrl.js

cc.Class({
    "extends": cc.Component,

    onLoad: function onLoad() {
        if (cc.sys.platform == cc.sys.WIN32) {
            cc.view.setFrameSize(1136, 640);
        }
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
        GameUtil.playButtonSound();
        this._uiCtrl.close();
        this._uiCtrl.manager.openUI('exchange_coin');
    },

    onCancelButtonClick: function onCancelButtonClick() {
        GameUtil.playButtonSound();
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
        goldLabel: cc.Label,
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
        this.goldLabel.string = cc.js.formatStr(GameLang.t('own_gold_num_format_2'), Global.accountModule.goldNum);

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
        GameUtil.playButtonSound();
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
        GameUtil.playButtonSound();
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

    start: function start() {
        if (this._isBattle) {
            cc.director.pause();
        }
    },

    setNativeCtrl: function setNativeCtrl(nativeCtrl) {
        this._nativeCtrl = nativeCtrl;
    },

    setIsBattle: function setIsBattle(value) {
        this._isBattle = value;
    },

    onOkButtonClick: function onOkButtonClick() {
        GameUtil.playButtonSound();
        cc.director.end();
    },

    onCancelButtonClick: function onCancelButtonClick() {
        GameUtil.playButtonSound();
        if (this._isBattle) {
            cc.director.resume();
        }
        if (this._nativeCtrl) {
            this._nativeCtrl.removeExitDialog();
        }
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

        this.loadMusic();
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
        cc.audioEngine.stopMusic(true);
    },

    start: function start() {
        GameRpc.Clt2Srv.getGameData();
    },

    resetCountDown: function resetCountDown() {
        this.stopCountDown();
        if (this._physical < this.maxPhysical) {
            this.countDownLabel.node.active = true;
            this.startCountDown(Global.accountModule.nextPowerTime);
        } else {
            this.countDownLabel.node.active = false;
        }
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

    loadMusic: function loadMusic() {
        var self = this;
        cc.loader.loadRes("sound/game", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playMusic(audioClip, true);
        });
    },

    onAddCoinButtonClick: function onAddCoinButtonClick() {
        GameUtil.playButtonSound();
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
        GameUtil.playButtonSound();
        if (this.costPhysical()) {
            this.stopCountDown();
            GameRpc.Clt2Srv.startGame();
        } else {
            this._uiManager.openUI('physical_not_enough');
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
    ON_GAME_RESULT: 0x00010007,
    ON_LOGIN_TIME_OUT: 0x00010008,

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
            cc.log('game net code', json.code);
            if (json.code === 6) {
                Global.gameEventDispatcher.emit(GameEvent.ON_LOGIN_TIME_OUT);
                this.removeHttpRespondListener(this._httpReauestInfo.data.gameMsgId);
            } else {
                var handler = this._httpHandlers[json.data.gameMsgId];
                handler && handler(json);
            }
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

var URLs = (_URLs = {}, _defineProperty(_URLs, Protocol.LOGIN, "http://youxi.egatewang.cn/index/login"), _defineProperty(_URLs, Protocol.GET_DATA, "http://youxi.egatewang.cn/Daluandou/index?type=getGameData"), _defineProperty(_URLs, Protocol.EXCHANGE_GOLD, "http://youxi.egatewang.cn/index/exchange"), _defineProperty(_URLs, Protocol.START_GAME, "http://youxi.egatewang.cn/Daluandou/index?type=startGame"), _defineProperty(_URLs, Protocol.FULL_POWER, "http://youxi.egatewang.cn/Daluandou/index?type=buyFullPower"), _defineProperty(_URLs, Protocol.CONTINUE_GAME, "http://youxi.egatewang.cn/Daluandou/index?type=buyTimeToPlayGame"), _defineProperty(_URLs, Protocol.RESULT_GAME, "http://youxi.egatewang.cn/Daluandou/index?type=gameResult"), _URLs);
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
            gameMsgId: GameProtocol.Protocol.RESULT_GAME,
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
    },

    playButtonSound: function playButtonSound() {
        cc.loader.loadRes("sound/button_click", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        });
    }

};

cc._RFpop();
},{}],"guide_define":[function(require,module,exports){
"use strict";
cc._RFpush(module, '25e22qXhJZGCKjUYNYP/kHX', 'guide_define');
// script\scene\battle\guide_define.js

module.exports.GuideStep = {
    NONE: 0,
    MOVE: 1,
    TOUCH: 2,
    ENTER_TRANS_DOOR: 3
};

module.exports.GuideMask = {
    MOVE: 0x0001,
    HIT: 0x0002,
    TRANS_DOOR_ARROW: 0x0004
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
            }, {
                cmdType: 8,
                args: {}
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
            }, {
                cmdType: 9,
                args: {}
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
                cmdType: 5,
                args: { show: true }
            }, {
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
                cmdType: 5,
                args: { show: false }
            }, {
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
            GameUtil.playButtonSound();
            this.showUpdatePanel(PanelType.START_UPDATE);
            this.doUpdate();
        }
    },

    onCancelClick: function onCancelClick() {
        GameUtil.playButtonSound();
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
        Global.accountModule.reset();

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
            this.msgLabel.string = GameLang.t('accout_or_passwd_error');
            this.msgLabel.node.active = true;
        }
    },

    onLoginButtonClick: function onLoginButtonClick() {
        GameUtil.playButtonSound();
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
        GameUtil.playButtonSound();
        if (cc.sys.platform == cc.sys.ANDROID) {
            var className = "org/cocos2dx/javascript/AppActivity";
            var methodName = "quickRegister";
            var methodSignature = "()V";
            jsb.reflection.callStaticMethod(className, methodName, methodSignature);
        }
    },

    onForgetButtonClick: function onForgetButtonClick() {
        GameUtil.playButtonSound();
        if (cc.sys.platform == cc.sys.ANDROID) {
            var className = "org/cocos2dx/javascript/AppActivity";
            var methodName = "quickRegister";
            var methodSignature = "()V";
            jsb.reflection.callStaticMethod(className, methodName, methodSignature);
        }
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
},{}],"login_time_out":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd38ccu6iCNOg7kLObVBv5rg', 'login_time_out');
// script\common\login_time_out.js

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
    onLoad: function onLoad() {},

    onReturnButtonClick: function onReturnButtonClick() {
        GameUtil.playButtonSound();
        GameUtil.loadScene('login');
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

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

    onDestroy: function onDestroy() {},

    update: function update(dt) {
        if (!Global.initted) this.init();else this.gameUpdate(dt);
    },

    init: function init() {
        Global.gameType = 41;
        Global.syncTimer = new SyncTimer();
        Global.gameNet = new GameNet();
        Global.gameEventDispatcher = new GameEventDispatcher();

        var guideStep = cc.sys.localStorage.getItem("guide_mask");
        if (!guideStep) guideStep = 0;
        Global.guideStep = guideStep;

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
        GameUtil.playButtonSound();
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
        returnButton: cc.Node,
        killLabel: cc.Label,
        roundLabel: cc.Label,
        maxKillLabel: cc.Label,
        maxRoundLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._killNum = this._uiCtrl.args.killNum;
        this._roundNum = this._uiCtrl.args.roundNum;

        this.killLabel.string = this._killNum.toString();
        this.roundLabel.string = this._roundNum.toString();

        var maxScore = Global.accountModule.maxScore.toString();
        cc.log('maxScore', maxScore);
        var i = maxScore.length;
        for (; i >= 0; i--) {
            if (maxScore.charAt(i) === '0') break;
        }
        var maxKill = parseInt(maxScore.substring(0, i)) - 1;
        var maxRound = maxScore.substring(i + 1, maxScore.length);

        this.maxKillLabel.string = maxKill.toString();
        this.maxRoundLabel.string = maxRound;
    },

    start: function start() {
        cc.loader.loadRes("sound/4", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playMusic(audioClip, false);
        });
    },

    onDestroy: function onDestroy() {},

    onReturnButtonClick: function onReturnButtonClick() {
        GameUtil.playButtonSound();
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
            if (Math.abs(disY) > 19) {
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
                    this._AIAttackDelayEndTime = currTime + Math.random() * 3 + 1.5;
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
                    this._AIHoldEndTime = currTime + Math.random() * 0.5 + 0.5;
                }
            } else if (this._AIHoldEndTime > 0) {
                if (currTime >= this._AIHoldEndTime) {
                    this._AIHoldEndTime = 0;
                }
            } else {
                this._AIMoveEndTime = currTime + Math.random() * 2 + 0.5;
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
        exitDialog: cc.Prefab,
        pausePanel: cc.Prefab
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

        this._hideCall = function () {
            cc.log("hide");
            if (self.pausePanel && !cc.director.isPaused()) {
                self.showPauseFace();
            }
        };

        cc.game.on(cc.game.EVENT_HIDE, this._hideCall);
    },

    onDestroy: function onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this._hideCall);
    },

    showPauseFace: function showPauseFace() {
        if (this._pauseFace) return;

        var panel = cc.instantiate(this.pausePanel);
        var component = panel.getComponent("pause_panel");
        component.setNativeCtrl(this);

        this.node.addChild(panel);
        this._pauseFace = panel;
    },

    removePauseFace: function removePauseFace() {
        if (this._pauseFace && this._pauseFace.isValid) {
            this._pauseFace.removeFromParent();
            this._pauseFace.destroy();
            this._pauseFace = null;
        }
    },

    showExitDialog: function showExitDialog() {
        if (this._exitDialog) return;

        var dialog = cc.instantiate(this.exitDialog);
        var component = dialog.getComponent("exit_confirm_dialog");
        component.setNativeCtrl(this);
        component.setIsBattle(this.node.getComponent('battle_ctrl') !== null);

        this.node.addChild(dialog);
        this._exitDialog = dialog;
    },

    removeExitDialog: function removeExitDialog() {
        if (this._exitDialog && this._exitDialog.isValid) {
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
        },

        loginTimeOutPrefab: {
            "default": null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._requestHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_REQUEST, this.onEvent.bind(this));
        this._respondHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_HTTP_RESPOND, this.onEvent.bind(this));
        this._networkErrorHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_NETWORK_ERROR, this.onEvent.bind(this));
        this._loginTimeOutHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_LOGIN_TIME_OUT, this.onEvent.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._requestHandler);
        Global.gameEventDispatcher.removeEventHandler(this._respondHandler);
        Global.gameEventDispatcher.removeEventHandler(this._networkErrorHandler);
        Global.gameEventDispatcher.removeEventHandler(this._loginTimeOutHandler);
        this._requestHandler = null;
        this._respondHandler = null;
        this._networkErrorHandler = null;
        this._loginTimeOutHandler = null;
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

            case GameEvent.ON_LOGIN_TIME_OUT:
                this.showLoginTimeOut();
                cc.log("on login time out");
                break;

            default:
                break;
        }
    },

    showLoginTimeOut: function showLoginTimeOut() {
        var panel = cc.instantiate(this.loginTimeOutPrefab);
        this.node.addChild(panel);
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
},{}],"pause_panel":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c4b6dY2mnpKl71yPtU8wXsA', 'pause_panel');
// script\common\pause_panel.js

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
    onLoad: function onLoad() {
        var self = this;
        this._touchEnd = this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (self._nativeCtrl) {
                self._nativeCtrl.removePauseFace();
                cc.director.resume();
            }
        }, this.node);

        this._mouseUp = this.node.on(cc.Node.EventType.MOUSE_UP, function () {
            if (self._nativeCtrl) {
                self._nativeCtrl.removePauseFace();
                cc.director.resume();
            }
        }, this.node);
    },

    onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this.node);
        this.node.off(cc.Node.EventType.MOUSE_UP, this._mouseUp, this.node);
    },

    start: function start() {
        cc.director.pause();
    },

    setNativeCtrl: function setNativeCtrl(nativeCtrl) {
        this._nativeCtrl = nativeCtrl;
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
        GameUtil.playButtonSound();
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
        GameUtil.playButtonSound();
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

var GuideDefine = require("guide_define");
var ControlDefine = require("control_define");
var ActorDefine = require("actor_define");
var Actor = require("actor_ctrl");

var ControlKey = ControlDefine.ControlKey;
var ActorAction = ActorDefine.ActorAction;
var ActorDirection = ActorDefine.ActorDirection;
var ActionCompleteType = ActorDefine.ActionCompleteType;
var GuideStep = GuideDefine.GuideStep;

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
        var guideStep = this.logicManager.guideStep;
        if (guideStep == GuideStep.MOVE && (key == ControlKey.LEFT || key == ControlKey.UP || key == ControlKey.DOWN || key == ControlKey.RIGHT)) {
            this.logicManager.endGuide();
        } else if (guideStep == GuideStep.TOUCH) {
            cc.log("key down DO_TOUCH_GUIDE");
            if (key == ControlKey.HIT) {
                cc.log("key down DO_TOUCH_GUIDE end");
                this.logicManager.endGuide();
            }
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
},{"actor_ctrl":"actor_ctrl","actor_define":"actor_define","control_define":"control_define","guide_define":"guide_define"}],"polyglot":[function(require,module,exports){
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

},{}],"relive_confirm":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3238fZEtz1Pep+9vrOYryWj', 'relive_confirm');
// script\ui\relive_confirm.js

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
        retryCountLabel: cc.Label,
        needCoinLabel: cc.Label,
        goldCountLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._uiCtrl = this.getComponent('ui_ctrl');
        this._retryCount = 3 - this._uiCtrl.args.retryCount;
        this._killNum = this._uiCtrl.args.killNum;
        this._roundNum = this._uiCtrl.args.roundNum;
        /*if (this._retryCount >= 3) {
            this.retryButton.active = false;
            this.returnButton.x = 0;*/
        var needCoin = timesMapCoin[this._retryCount];
        this.retryCountLabel.string = this._uiCtrl.args.retryCount.toString();
        this.goldCountLabel.string = cc.js.formatStr(GameLang.t('own_gold_num_format'), Global.accountModule.goldNum);
        this.needCoinLabel.string = needCoin.toString();
        this._exchangeHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_EXCHANGE_GOLD, this.onExchangeSuccess.bind(this));
        this._continueHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_BUY_TIME_TO_PLAY, this.onContinueGame.bind(this));
        this._resultHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_GAME_RESULT, this.onResultGame.bind(this));
    },

    onDestroy: function onDestroy() {
        Global.gameEventDispatcher.removeEventHandler(this._exchangeHandler);
        Global.gameEventDispatcher.removeEventHandler(this._continueHandler);
        Global.gameEventDispatcher.removeEventHandler(this._resultHandler);
        this._resultHandler = null;
        this._exchangeHandler = null;
        this._continueHandler = null;
    },

    onExchangeSuccess: function onExchangeSuccess() {
        var needCoin = timesMapCoin[this._retryCount];
        if (Global.accountModule.goldNum >= needCoin) {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },

    onResultGame: function onResultGame() {
        this._uiCtrl.close();
        this._uiCtrl.manager.openUI('mission_fail', { killNum: this._killNum, roundNum: this._roundNum });
    },

    onContinueGame: function onContinueGame() {
        this._uiCtrl.close();
    },

    onRetryButtonClick: function onRetryButtonClick() {
        GameUtil.playButtonSound();
        var needCoin = timesMapCoin[this._retryCount];
        var ownCoin = Global.accountModule.goldNum;
        if (ownCoin < needCoin) {
            this._uiCtrl.manager.openUI('coin_not_enough');
        } else {
            GameRpc.Clt2Srv.buyTimeToPlayGame(this._retryCount);
        }
    },

    onReturnButtonClick: function onReturnButtonClick() {
        GameUtil.playButtonSound();
        var maxScore = parseInt(this._killNum + 1 + "0" + this._roundNum);
        GameRpc.Clt2Srv.gameResult(maxScore);
    }
});

cc._RFpop();
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
            var oldNode = this._nums.pop();
            var action = new cc.Sequence(new cc.FadeOut(0.5), new cc.CallFunc(function (target, data) {
                data.parent = null;
                data.destroy();
            }, null, oldNode));
            oldNode.runAction(action);
        }

        this._nums.splice(0, this._nums.length);
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
    "buy_physical_success": "购买体力成功",
    "accout_or_passwd_error": "帐号或密码错误",
    "own_gold_num_format": "拥有：%d 金币",
    "own_gold_num_format_2": "金币：%d"
};

cc._RFpop();
},{}]},{},["player_ctrl","account_module","time_util","test_map","game_net","map_ctrl","game_ctrl","hurdle_define","guide_define","native_ctrl","buffer_table","control_define","relive_confirm","exchange_coin","skill_define","skill_provider","joy_ctrl","round_ctrl","ui_manager","game_util","login_module","xxtea","init_config","login_ctrl","game_event_dispatcher","http_util","loading_ctrl","init_module","attack_ctrl","LabelLocalized","actor_ctrl","network_ctrl","float_message_ctrl","model_panel","physical_point","state_ctrl","i18n","http_connection","game_event","hurdle_provider","game_rpc","sync_timer","message_box","hurdle_cfg","pause_panel","polyglot","mission_fail","battle_ctrl","exit_confirm_dialog","ui_ctrl","en","login_time_out","physical_not_enough","main","monster_ctrl","skill_cfg","boot_ctrl","network_error","zh","game_protocol","coin_not_enough","actor_define"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvcjEyMS9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9MYWJlbExvY2FsaXplZC5qcyIsImFzc2V0cy9zY3JpcHQvbW9kdWxlL2FjY291bnRfbW9kdWxlLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9hY3Rvcl9kZWZpbmUuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9hdHRhY2tfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2JhdHRsZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9ib290X2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3V0aWwvYnVmZmVyX3RhYmxlLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9jb2luX25vdF9lbm91Z2guanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2JhdHRsZS9jb250cm9sX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9kYXRhL2VuLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9leGNoYW5nZV9jb2luLmpzIiwiYXNzZXRzL3NjcmlwdC9jb21tb24vZXhpdF9jb25maXJtX2RpYWxvZy5qcyIsImFzc2V0cy9zY3JpcHQvdWkvZmxvYXRfbWVzc2FnZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9nYW1lX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2V2ZW50L2dhbWVfZXZlbnRfZGlzcGF0Y2hlci5qcyIsImFzc2V0cy9zY3JpcHQvZXZlbnQvZ2FtZV9ldmVudC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX25ldC5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9nYW1lX3Byb3RvY29sLmpzIiwiYXNzZXRzL3NjcmlwdC9uZXR3b3JrL2dhbWVfcnBjLmpzIiwiYXNzZXRzL3NjcmlwdC91dGlsL2dhbWVfdXRpbC5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2d1aWRlX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvbmV0d29yay9jb25uZWN0aW9uL2h0dHBfY29ubmVjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHQvbGliL3V0aWwvaHR0cF91dGlsLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvZGF0YS9odXJkbGVfY2ZnLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9iYXR0bGUvaHVyZGxlX2RlZmluZS5qcyIsImFzc2V0cy9zY3JpcHQvY29uZmlnL3Byb3ZpZGVyL2h1cmRsZV9wcm92aWRlci5qcyIsImFzc2V0cy9zY3JpcHQvaTE4bi9pMThuLmpzIiwiYXNzZXRzL3NjcmlwdC9jb25maWcvaW5pdF9jb25maWcuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9pbml0X21vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL2pveV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9sb2FkaW5nX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL2xvZ2luX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L21vZHVsZS9sb2dpbl9tb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0L2NvbW1vbi9sb2dpbl90aW1lX291dC5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbi5qcyIsImFzc2V0cy9zY3JpcHQvbWFwL21hcF9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC91aS9tZXNzYWdlX2JveC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvcmVzdWx0L21pc3Npb25fZmFpbC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvY29tcG9uZW50L21vZGVsX3BhbmVsLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9tb25zdGVyX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL25hdGl2ZV9jdHJsLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9uZXR3b3JrX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2NvbW1vbi9uZXR3b3JrX2Vycm9yLmpzIiwiYXNzZXRzL3NjcmlwdC9jb21tb24vcGF1c2VfcGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L3VpL3BoeXNpY2FsX25vdF9lbm91Z2guanMiLCJhc3NldHMvc2NyaXB0L3VpL2NvbXBvbmVudC9waHlzaWNhbF9wb2ludC5qcyIsImFzc2V0cy9zY3JpcHQvYWN0b3IvcGxheWVyX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L2kxOG4vcG9seWdsb3QuanMiLCJhc3NldHMvc2NyaXB0L3VpL3JlbGl2ZV9jb25maXJtLmpzIiwiYXNzZXRzL3NjcmlwdC9zY2VuZS9iYXR0bGUvcm91bmRfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvY29uZmlnL2RhdGEvc2tpbGxfY2ZnLmpzIiwiYXNzZXRzL3NjcmlwdC9hY3Rvci9za2lsbF9kZWZpbmUuanMiLCJhc3NldHMvc2NyaXB0L2NvbmZpZy9wcm92aWRlci9za2lsbF9wcm92aWRlci5qcyIsImFzc2V0cy9zY3JpcHQvc2NlbmUvYmF0dGxlL3N0YXRlX2N0cmwuanMiLCJhc3NldHMvc2NyaXB0L3RpbWVyL3N5bmNfdGltZXIuanMiLCJhc3NldHMvc2NyaXB0L3NjZW5lL3Rlc3RfbWFwLmpzIiwiYXNzZXRzL3NjcmlwdC91dGlsL3RpbWVfdXRpbC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvdWlfY3RybC5qcyIsImFzc2V0cy9zY3JpcHQvdWkvdWlfbWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHQvbGliL3RoaXJkL3h4dGVhL3h4dGVhLmpzIiwiYXNzZXRzL3NjcmlwdC9pMThuL2RhdGEvemguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3IwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODYzMzFwMFhEWkZqYmhOTmwvMWNRaGonLCAnTGFiZWxMb2NhbGl6ZWQnKTtcbi8vIHNjcmlwdFxcaTE4blxcTGFiZWxMb2NhbGl6ZWQuanNcblxudmFyIGkxOG4gPSByZXF1aXJlKCdpMThuJyk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5MYWJlbCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGV4dEtleToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAnVEVYVF9LRVknLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogJ0VudGVyIGkxOG4ga2V5IGhlcmUnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NnTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZ05vZGUuc2V0U3RyaW5nKHRoaXMuc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTm9kZVNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiAnSGVyZSBzaG93cyB0aGUgbG9jYWxpemVkIHN0cmluZyBvZiBUZXh0IEtleScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTE4bi50KHRoaXMudGV4dEtleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdQbGVhc2Ugc2V0IGxhYmVsIHRleHQga2V5IGluIFRleHQgS2V5IHByb3BlcnR5LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwZGQ0N2M4aVAxSVRhaVJDbk9DNTYzQScsICdhY2NvdW50X21vZHVsZScpO1xuLy8gc2NyaXB0XFxtb2R1bGVcXGFjY291bnRfbW9kdWxlLmpzXG5cbm1vZHVsZS5leHBvcnRzWydjbGFzcyddID0gY2MuQ2xhc3Moe1xuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc1ZpcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmlwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAndHJ1ZScgfHwgQm9vbGVhbih2YWx1ZSkpKSB0aGlzLl9pc1ZpcCA9IHRydWU7ZWxzZSB0aGlzLl9pc1ZpcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvbGROdW06IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nb2xkTnVtO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9nb2xkTnVtID0gcGFyc2VJbnQodmFsdWUpIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2NvcmVOdW06IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY29yZU51bTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NvcmVOdW0gPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBuaWNrTmFtZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25pY2tOYW1lO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uaWNrTmFtZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmlyc3RMb2dpbjoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRmlyc3RMb2dpbjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB2YWx1ZSA9PT0gJ3RydWUnIHx8IEJvb2xlYW4odmFsdWUpKSkgdGhpcy5faXNGaXJzdExvZ2luID0gdHJ1ZTtlbHNlIHRoaXMuX2lzRmlyc3RMb2dpbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1heFNjb3JlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4U2NvcmU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heFNjb3JlID0gcGFyc2VJbnQodmFsdWUpIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG93ZXI6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3dlcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG93ZXIgPSBwYXJzZUludCh2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0UG93ZXJUaW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0UG93ZXJUaW1lID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogdGhpcy5kZWZhdWx0TmV4dFBvd2VyVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBleGNoYW5nZVJhdGU6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGNoYW5nZVJhdGU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4Y2hhbmdlUmF0ZSA9IHBhcnNlRmxvYXQodmFsdWUpIHx8IHRoaXMuZGVmYXVsdEV4Y2hhbmdlUmF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWZhdWx0TmV4dFBvd2VyVGltZTogMzAwLFxuICAgICAgICBkZWZhdWx0RXhjaGFuZ2VSYXRlOiAxMFxuICAgIH0sXG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgdGhpcy5fbmlja05hbWUgPSAnJztcbiAgICAgICAgdGhpcy5pc0ZpcnN0TG9naW4gPSB0cnVlO1xuICAgICAgICB0aGlzLl9pc1ZpcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9nb2xkTnVtID0gMDtcbiAgICAgICAgdGhpcy5fc2NvcmVOdW0gPSAwO1xuICAgICAgICB0aGlzLl9tYXhTY29yZSA9IDA7XG4gICAgICAgIHRoaXMuX3Bvd2VyID0gMDtcbiAgICAgICAgdGhpcy5fbmV4dFBvd2VyVGltZSA9IHRoaXMuZGVmYXVsdE5leHRQb3dlclRpbWU7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlUmF0ZSA9IHRoaXMuZGVmYXVsdEV4Y2hhbmdlUmF0ZTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTAzN2FDeHU3OURVNHMvOEJXVFpVd3QnLCAnYWN0b3JfY3RybCcpO1xuLy8gc2NyaXB0XFxhY3RvclxcYWN0b3JfY3RybC5qc1xuXG52YXIgU2tpbGxEZWZpbmUgPSByZXF1aXJlKFwic2tpbGxfZGVmaW5lXCIpO1xudmFyIEFjdG9yRGVmaW5lID0gcmVxdWlyZShcImFjdG9yX2RlZmluZVwiKTtcbnZhciBBY3RvckRpcmVjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yRGlyZWN0aW9uO1xudmFyIEFjdG9yQWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JBY3Rpb247XG52YXIgQWN0aW9uTmFtZSA9IEFjdG9yRGVmaW5lLkFjdGlvbk5hbWU7XG52YXIgQWN0aW9uQ2xpcEluZGV4ID0gQWN0b3JEZWZpbmUuQWN0aW9uQ2xpcEluZGV4O1xudmFyIEFjdGlvbkNvbXBsZXRlVHlwZSA9IEFjdG9yRGVmaW5lLkFjdGlvbkNvbXBsZXRlVHlwZTtcbnZhciBUaW1lUG9pbnRBY3RUeXBlID0gU2tpbGxEZWZpbmUuVGltZVBvaW50QWN0VHlwZTtcbnZhciBBdHRhY2tUeXBlID0gU2tpbGxEZWZpbmUuQXR0YWNrVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1vdmVTcGVlZDogbmV3IGNjLlZlYzIoMCwgMCksXG5cbiAgICAgICAgbG9naWNNYW5hZ2VyOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChtYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9naWNNYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2dpY01hbmFnZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLmFkZEVuaXR5KHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJtb2RlbFwiKTtcbiAgICAgICAgdGhpcy5fbW9kZWxBbmltYXRpb24gPSB0aGlzLl9tb2RlbC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5fYm9keSA9IHRoaXMuX21vZGVsLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKTtcbiAgICAgICAgdmFyIGJveCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQm94Q29sbGlkZXIpO1xuICAgICAgICB0aGlzLl9ib3ggPSBuZXcgY2MuUmVjdChib3gub2Zmc2V0LnggLSBib3guc2l6ZS53aWR0aCAvIDIsIGJveC5vZmZzZXQueSAtIGJveC5zaXplLmhlaWdodCAvIDIsIGJveC5zaXplLndpZHRoLCBib3guc2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fY3VyckFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuXG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25lZWRTdG9wUG9zdHVyZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdHRhY2tFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuXG4gICAgICAgIHRoaXMuX25lZWRSZWxpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgLy8g5Y+X5Ye757uT5LqL5pe26Ze077yI5Y2z5Y+X5Ye756Gs55u077yJXG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlgJLlnLDnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fY29sbGFwc2VFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDotbfouqvnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZSA9IDEwMDtcbiAgICAgICAgdGhpcy5fcmVtYWluQ29tYm9WYWx1ZSA9IHRoaXMuX2RlZmF1bHRDb21ib1ZhbHVlO1xuXG4gICAgICAgIHRoaXMuX2hwTWF4ID0gMTAwMDtcbiAgICAgICAgdGhpcy5faHAgPSAxMDAwO1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLklETEUsIEFjdG9yRGlyZWN0aW9uLlJJR0hUKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCA9IHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueCA9IHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnggPSB0aGlzLl9mbG9hdFNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuXG4gICAgICAgIHRoaXMuX2lzQXR0YWNraW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25lZWRTdG9wUG9zdHVyZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdHRhY2tFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnNwbGljZSgwLCB0aGlzLl9za2lsbFRpbWVTdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fY3VyclBvc3R1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXNbaV0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9jdXJyTW92ZVNwZWVkLnggPSB0aGlzLl9jdXJyTW92ZVNwZWVkLnkgPSAwO1xuXG4gICAgICAgIHRoaXMuX25lZWRSZWxpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgLy8g5Y+X5Ye757uT5LqL5pe26Ze077yI5Y2z5Y+X5Ye756Gs55u077yJXG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDlgJLlnLDnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fY29sbGFwc2VFbmRUaW1lID0gMDtcblxuICAgICAgICAvLyDotbfouqvnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX2Jvcm5FbmRUaW1lID0gMDtcblxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZW1haW5Db21ib1ZhbHVlID0gdGhpcy5fZGVmYXVsdENvbWJvVmFsdWU7XG5cbiAgICAgICAgdGhpcy5faHAgPSB0aGlzLl9ocE1heDtcblxuICAgICAgICB0aGlzLl9tb2RlbC55ID0gMDtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSURMRSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgYm9ybjogZnVuY3Rpb24gYm9ybigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9ib3JuRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRoaXMuX21vZGVsQW5pbWF0aW9uLmdldENsaXBzKClbQWN0aW9uQ2xpcEluZGV4LkJPUk5dLmR1cmF0aW9uO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5CT1JOLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICBzZXRBY3RvclBvc2l0aW9uOiBmdW5jdGlvbiBzZXRBY3RvclBvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy5ub2RlLnggPSB4O1xuICAgICAgICB0aGlzLm5vZGUueSA9IHk7XG4gICAgfSxcblxuICAgIHNldERpcmVjdGlvbjogZnVuY3Rpb24gc2V0RGlyZWN0aW9uKGRpcikge1xuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09PSBkaXIgfHwgZGlyICE9IEFjdG9yRGlyZWN0aW9uLkxFRlQgJiYgZGlyICE9IEFjdG9yRGlyZWN0aW9uLlJJR0hUKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRpcjtcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlWCA9IGRpcjtcbiAgICB9LFxuXG4gICAgZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBnZXREaXJlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIHNldEFjdGlvbjogZnVuY3Rpb24gc2V0QWN0aW9uKGFjdGlvbiwgZGlyLCBwYXJhbSwgdGltZSkge1xuICAgICAgICB2YXIgYWN0aW9uTmFtZSA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLkFUVEFDSzpcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lID0gQWN0aW9uTmFtZVthY3Rpb25dICsgcGFyYW07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWUgPSBBY3Rpb25OYW1lW2FjdGlvbl07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VyckFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgdGhpcy5fbW9kZWxBbmltYXRpb24ucGxheShhY3Rpb25OYW1lKTtcbiAgICAgICAgaWYgKCF0aW1lIHx8IHRpbWUgPT09IDApIHRoaXMuX2N1cnJBY3Rpb25FbmRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpICsgdGhpcy5fbW9kZWxBbmltYXRpb24uY3VycmVudENsaXAuZHVyYXRpb247ZWxzZSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWU7XG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpcik7XG4gICAgfSxcblxuICAgIHNldEhwOiBmdW5jdGlvbiBzZXRIcCh2YWx1ZSwgbWF4KSB7XG4gICAgICAgIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMDtcbiAgICAgICAgaWYgKHZhbHVlIDwgMSkgdmFsdWUgPSAxO1xuICAgICAgICB0aGlzLl9ocE1heCA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9ocCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBnZXRIcDogZnVuY3Rpb24gZ2V0SHAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ocDtcbiAgICB9LFxuXG4gICAgZ2V0Q29sbGlzaW9uOiBmdW5jdGlvbiBnZXRDb2xsaXNpb24oKSB7XG4gICAgICAgIHZhciB4ZmYgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShuZXcgY2MuVmVjMigwLCAwKSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShuZXcgY2MuVmVjMih0aGlzLl9ib3gueCwgdGhpcy5fYm94LnkpKTtcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PSBBY3RvckRpcmVjdGlvbi5MRUZUKSBvZmZzZXQueCAtPSB0aGlzLl9ib3gud2lkdGg7XG4gICAgICAgIHJldHVybiBuZXcgY2MuUmVjdChvZmZzZXQueCwgb2Zmc2V0LnksIHRoaXMuX2JveC53aWR0aCwgdGhpcy5fYm94LmhlaWdodCk7XG4gICAgfSxcblxuICAgIGlzRGVhZDogZnVuY3Rpb24gaXNEZWFkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEZWFkO1xuICAgIH0sXG5cbiAgICByZWxpdmU6IGZ1bmN0aW9uIHJlbGl2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX25lZWRSZWxpdmUgfHwgIXRoaXMuX2lzRGVhZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9uZWVkUmVsaXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgc3RhcnRSZWxpdmU6IGZ1bmN0aW9uIHN0YXJ0UmVsaXZlKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JlbGl2ZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5SRUxJVkVdLmR1cmF0aW9uICsgMTtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uUkVMSVZFLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLnBsYXlSZWxpdmVFZmZlY3QoKTtcbiAgICB9LFxuXG4gICAgZW5kUmVsaXZlOiBmdW5jdGlvbiBlbmRSZWxpdmUoKSB7XG4gICAgICAgIHRoaXMuX2lzRGVhZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVsaXZlRW5kVGltZSA9IDA7XG4gICAgfSxcblxuICAgIHN0YXJ0SHVydDogZnVuY3Rpb24gc3RhcnRIdXJ0KHRpbWUsIGRpcikge1xuICAgICAgICB0aGlzLl9odXJ0RW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWU7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkhVUlQsIGRpcik7XG4gICAgfSxcblxuICAgIGVuZEh1cnQ6IGZ1bmN0aW9uIGVuZEh1cnQoKSB7XG4gICAgICAgIHRoaXMuX2h1cnRFbmRUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgc3RhcnRGbG9hdDogZnVuY3Rpb24gc3RhcnRGbG9hdCh0b3BUaW1lLCB0b3BIZWlnaHQsIGRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdGhpcy5fZmxvYXRUb3BUaW1lID0gdGhpcy5fZmxvYXRTdGFydFRpbWUgKyB0b3BUaW1lO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCA9IHRoaXMubm9kZS54O1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueSA9IHRoaXMuX21vZGVsLnk7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnggPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yID0gMiAqIHRvcEhlaWdodCAvICh0b3BUaW1lICogdG9wVGltZSk7XG4gICAgICAgIHRoaXMuX2Zsb2F0U3BlZWQueCA9IGRpc3RhbmNlIC8gKHRvcFRpbWUgKiAyKTtcbiAgICAgICAgdGhpcy5fZmxvYXRTcGVlZC55ID0gdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yICogdG9wVGltZTtcbiAgICB9LFxuXG4gICAgZW5kRmxvYXQ6IGZ1bmN0aW9uIGVuZEZsb2F0KCkge1xuICAgICAgICB0aGlzLl9mbG9hdFN0YXRlID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXRTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFRvcFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueSA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0VXBTdGFydFBvcy54ID0gMDtcbiAgICAgICAgdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueCA9IDA7XG4gICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnggPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9mbG9hdFVwQWNjZWxlcmF0b3IgPSAwO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kLzVcIiwgY2MuQXVkaW9DbGlwLCBmdW5jdGlvbiAoZXJyLCBhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzdGFydENvbGxhcHNlOiBmdW5jdGlvbiBzdGFydENvbGxhcHNlKCkge1xuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5DT0xMQVBTRV0uZHVyYXRpb24gKyAxO1xuICAgICAgICB0aGlzLnNldEFjdGlvbihBY3RvckFjdGlvbi5DT0xMQVBTRSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZW5kQ29sbGFwc2U6IGZ1bmN0aW9uIGVuZENvbGxhcHNlKCkge1xuICAgICAgICB0aGlzLl9jb2xsYXBzZUVuZFRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydFJlY292ZXI6IGZ1bmN0aW9uIHN0YXJ0UmVjb3ZlcigpIHtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmVjb3ZlckVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLl9tb2RlbEFuaW1hdGlvbi5nZXRDbGlwcygpW0FjdGlvbkNsaXBJbmRleC5SRUNPVkVSXS5kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uUkVDT1ZFUiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZW5kUmVjb3ZlcjogZnVuY3Rpb24gZW5kUmVjb3ZlcigpIHtcbiAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlY292ZXJFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcmVtYWluQ29tYm9WYWx1ZSA9IHRoaXMuX2RlZmF1bHRDb21ib1ZhbHVlO1xuICAgIH0sXG5cbiAgICBtb3ZlVG86IGZ1bmN0aW9uIG1vdmVUbyh4LCB5LCB0aW1lLCBkaXIpIHtcbiAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICB2YXIgc3BlZWRYID0gKHggLSB0aGlzLm5vZGUueCkgLyB0aW1lO1xuICAgICAgICB2YXIgc3BlZWRZID0gKHkgLSB0aGlzLm5vZGUueSkgLyB0aW1lO1xuICAgICAgICB0aGlzLnN0YXJ0TW92ZShzcGVlZFgsIHNwZWVkWSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnNldERpcmVjdGlvbihkaXIpO1xuICAgICAgICB0aGlzLl90YXJnZXRNb3ZlUG9zID0gbmV3IGNjLlZlYzIoeCwgeSk7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gdGhpcy5fbW92ZVN0YXJ0VGltZSArIHRpbWU7XG4gICAgfSxcblxuICAgIHN0YXJ0TW92ZTogZnVuY3Rpb24gc3RhcnRNb3ZlKHNwZWVkWCwgc3BlZWRZLCBpbml0aWF0aXZlKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYXRpdmVNb3ZlID0gaW5pdGlhdGl2ZTtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdGhpcy5fY3Vyck1vdmVTcGVlZC54ID0gc3BlZWRYO1xuICAgICAgICB0aGlzLl9jdXJyTW92ZVNwZWVkLnkgPSBzcGVlZFk7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5ub2RlLng7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy55ID0gdGhpcy5ub2RlLnk7XG4gICAgfSxcblxuICAgIHN0b3BNb3ZlOiBmdW5jdGlvbiBzdG9wTW92ZSgpIHtcbiAgICAgICAgdGhpcy5fbW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5faW5pdGlhdGl2ZU1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0TW92ZVBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJNb3ZlU3BlZWQueCA9IHRoaXMuX2N1cnJNb3ZlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVTdGFydFBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnkgPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydEF0dGFjazogZnVuY3Rpb24gc3RhcnRBdHRhY2socG9zdHVyZUxpc3QsIHBvc3R1cmVDb3VudCwgZGlyKSB7XG4gICAgICAgIHRoaXMuc3RvcEF0dGFjaygpO1xuICAgICAgICB0aGlzLl9pc0F0dGFja2luZyA9IHRydWU7XG4gICAgICAgIGlmIChwb3N0dXJlQ291bnQgPiB0aGlzLl9jdXJyUG9zdHVyZXMubGVuZ3RoKSBwb3N0dXJlQ291bnQgPSB0aGlzLl9jdXJyUG9zdHVyZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvc3R1cmVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZXNbaV0gPSBwb3N0dXJlTGlzdFtpXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUNvdW50ID0gcG9zdHVyZUNvdW50O1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5sYXVuY2hQb3N0dXJlKHBvc3R1cmVMaXN0WzBdLCBkaXIpO1xuICAgIH0sXG5cbiAgICBzdG9wQXR0YWNrOiBmdW5jdGlvbiBzdG9wQXR0YWNrKCkge1xuICAgICAgICB0aGlzLl9pc0F0dGFja2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJyZWFrUG9zdHVyZSgpO1xuICAgIH0sXG5cbiAgICBsYXVuY2hQb3N0dXJlOiBmdW5jdGlvbiBsYXVuY2hQb3N0dXJlKHBvc3R1cmUsIGRpcikge1xuICAgICAgICB0aGlzLmxhdW5jaFNraWxsVGltZUxpc3QocG9zdHVyZSk7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkFUVEFDSywgZGlyLCBwb3N0dXJlLmFjdGlvbkluZGV4LCBwb3N0dXJlLnRpbWUpO1xuICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUgPSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZTtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmUgPSBwb3N0dXJlO1xuICAgIH0sXG5cbiAgICBsYXVuY2hTa2lsbFRpbWVMaXN0OiBmdW5jdGlvbiBsYXVuY2hTa2lsbFRpbWVMaXN0KHBvc3R1cmUpIHtcbiAgICAgICAgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLnNwbGljZSgwLCB0aGlzLl9za2lsbFRpbWVTdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICB2YXIgY291bnQgPSBwb3N0dXJlLnRpbWVQb2ludHMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0aW1lUG9pbnQgPSBwb3N0dXJlLnRpbWVQb2ludHNbaV07XG4gICAgICAgICAgICB2YXIgdGltZVN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHRpbWVQb2ludDogdGltZVBvaW50LFxuICAgICAgICAgICAgICAgIHRha2VFbmRUaW1lOiBjdXJyVGltZSArIHRpbWVQb2ludC50YWtlVGltZSxcbiAgICAgICAgICAgICAgICBwb3N0dXJlOiBwb3N0dXJlLFxuICAgICAgICAgICAgICAgIHRha2VkOiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX3NraWxsVGltZVN0YXRlcy5wdXNoKHRpbWVTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYnJlYWtQb3N0dXJlOiBmdW5jdGlvbiBicmVha1Bvc3R1cmUoKSB7XG4gICAgICAgIHRoaXMuX3NraWxsVGltZVN0YXRlcy5zcGxpY2UoMCwgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPSAwO1xuICAgIH0sXG5cbiAgICBzdGFydERpc2FwcGVhcjogZnVuY3Rpb24gc3RhcnREaXNhcHBlYXIoKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLkRJU0FQUEVBUiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0h1cnQ6IGZ1bmN0aW9uIHByb2Nlc3NIdXJ0KGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9odXJ0RW5kVGltZSkgdGhpcy5lbmRIdXJ0KCk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NGbG9hdDogZnVuY3Rpb24gcHJvY2Vzc0Zsb2F0KGN1cnJUaW1lKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fZmxvYXRTdGF0ZSkge1xuICAgICAgICAgICAgLy/kuIrljYfov4fnqItcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiAhPT0gQWN0b3JBY3Rpb24uSFVSVF9GTFkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSFVSVF9GTFksIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBjdXJyVGltZSAtIHRoaXMuX2Zsb2F0U3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9mbG9hdFRvcFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZUVsYXBhc2VkID0gdGhpcy5fZmxvYXRUb3BUaW1lIC0gdGhpcy5fZmxvYXRTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zsb2F0U3RhdGUrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLl9mbG9hdFVwU3RhcnRQb3MueCArIHRpbWVFbGFwYXNlZCAqIHRoaXMuX2Zsb2F0U3BlZWQueDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMuX2Zsb2F0VXBTdGFydFBvcy55ICsgdGhpcy5fZmxvYXRTcGVlZC55ICogdGltZUVsYXBhc2VkIC0gdGhpcy5fZmxvYXRVcEFjY2VsZXJhdG9yICogdGltZUVsYXBhc2VkICogdGltZUVsYXBhc2VkIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5nZXRGaXhlZE1vdmVQb2ludCh0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnksIHgsIHRoaXMubm9kZS55KTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHJlc3VsdC5keDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC55ID0geTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ID0gcmVzdWx0LmR4O1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zsb2F0RG93blN0YXJ0UG9zLnkgPSB5O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL+S4i+iQvei/h+eoi1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5IVVJUX0ZBTEwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3Rpb24oQWN0b3JBY3Rpb24uSFVSVF9GQUxMLCB0aGlzLl9kaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGltZUVsYXBhc2VkID0gY3VyclRpbWUgLSB0aGlzLl9mbG9hdFRvcFRpbWU7XG4gICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLl9mbG9hdERvd25TdGFydFBvcy54ICsgdGltZUVsYXBhc2VkICogdGhpcy5fZmxvYXRTcGVlZC54O1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fZmxvYXREb3duU3RhcnRQb3MueSAtIDMwMDAgKiAodGltZUVsYXBhc2VkICogdGltZUVsYXBhc2VkKSAvIDI7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNb3ZlUG9pbnQodGhpcy5ub2RlLngsIHRoaXMubm9kZS55LCB4LCB0aGlzLm5vZGUueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSByZXN1bHQuZHg7XG4gICAgICAgICAgICAgICAgaWYgKHkgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxvYXRTdGF0ZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC55ID0geTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy/nu5PmnZ9cbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEZsb2F0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwueSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvbGxhcHNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRBY3RvclBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NDb2xsYXBzZTogZnVuY3Rpb24gcHJvY2Vzc0NvbGxhcHNlKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jb2xsYXBzZUVuZFRpbWUpIHRoaXMuZW5kQ29sbGFwc2UoKTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc1JlY292ZXI6IGZ1bmN0aW9uIHByb2Nlc3NSZWNvdmVyKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9yZWNvdmVyRW5kVGltZSkgdGhpcy5lbmRSZWNvdmVyKCk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NBdHRhY2s6IGZ1bmN0aW9uIHByb2Nlc3NBdHRhY2soY3VyclRpbWUpIHtcbiAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLl9jdXJyUG9zdHVyZTtcbiAgICAgICAgaWYgKHBvc3R1cmUpIHtcbiAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jdXJyUG9zdHVyZUVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyclBvc3R1cmVFbmRUaW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjdXJyVGltZSA+PSB0aGlzLl9hdHRhY2tFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zdHVyZUluZGV4Kys7XG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFN0b3BQb3N0dXJlIHx8IHRoaXMuX2N1cnJQb3N0dXJlSW5kZXggPj0gdGhpcy5fY3VyclBvc3R1cmVDb3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEF0dGFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3N0dXJlID0gdGhpcy5fY3VyclBvc3R1cmVbdGhpcy5fY3VyclBvc3R1cmVJbmRleF07XG4gICAgICAgICAgICAgICAgdGhpcy5sYXVuY2hQb3N0dXJlKHBvc3R1cmUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcHJvY2Vzc01vdmU6IGZ1bmN0aW9uIHByb2Nlc3NNb3ZlKGN1cnJUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uICE9PSBBY3RvckFjdGlvbi5SVU4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLlJVTiwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdmFyIHRpbWVFbGFwYXNlZCA9IGN1cnJUaW1lIC0gdGhpcy5fbW92ZVN0YXJ0VGltZTtcbiAgICAgICAgaWYgKHRoaXMuX21vdmVFbmRUaW1lID4gMCAmJiBjdXJyVGltZSA+PSB0aGlzLl9tb3ZlRW5kVGltZSkge1xuICAgICAgICAgICAgdGltZUVsYXBhc2VkID0gdGhpcy5fbW92ZUVuZFRpbWUgLSB0aGlzLl9tb3ZlU3RhcnRUaW1lO1xuICAgICAgICAgICAgcG9zLnggPSB0aGlzLl90YXJnZXRNb3ZlUG9zLng7XG4gICAgICAgICAgICBwb3MueSA9IHRoaXMuX3RhcmdldE1vdmVQb3MueTtcbiAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcy54ID0gdGhpcy5fbW92ZVN0YXJ0UG9zLnggKyB0aW1lRWxhcGFzZWQgKiB0aGlzLl9jdXJyTW92ZVNwZWVkLng7XG4gICAgICAgICAgICBwb3MueSA9IHRoaXMuX21vdmVTdGFydFBvcy55ICsgdGltZUVsYXBhc2VkICogdGhpcy5fY3Vyck1vdmVTcGVlZC55O1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmdldEZpeGVkTW92ZVBvaW50KHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSwgcG9zLngsIHBvcy55KTtcbiAgICAgICAgdGhpcy5zZXRBY3RvclBvc2l0aW9uKHJlc3VsdC5keCwgcmVzdWx0LmR5KTtcbiAgICB9LFxuXG4gICAgLy8g5Yik5pat5b2T5YmN5Yqo5L2c5Y+v5ZCm5a6M5oiQ5oiW5Y+v5ZCm5omT5patXG4gICAgZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZTogZnVuY3Rpb24gZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZShjdXJyVGltZSkge1xuICAgICAgICBpZiAodGhpcy5fcmVsaXZlRW5kVGltZSA+IDAgfHwgdGhpcy5fYm9ybkVuZFRpbWUgPiAwIHx8IHRoaXMuX3JlY292ZXJFbmRUaW1lID4gMCB8fCB0aGlzLl9mbG9hdFN0YXJ0VGltZSA+IDAgfHwgdGhpcy5fY29sbGFwc2VFbmRUaW1lID4gMCB8fCB0aGlzLl9yZWNvdmVyRW5kVGltZSA+IDAgfHwgdGhpcy5faHVydEVuZFRpbWUgPiAwKSByZXR1cm4gQWN0aW9uQ29tcGxldGVUeXBlLlVOQ09NUExFVEFCTEU7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLl9jdXJyQWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLklETEU6XG4gICAgICAgICAgICBjYXNlIEFjdG9yQWN0aW9uLlJVTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9jdXJyQWN0aW9uRW5kVGltZSkgcmV0dXJuIEFjdGlvbkNvbXBsZXRlVHlwZS5DT01QTEVUQUJMRTtlbHNlIHJldHVybiBBY3Rpb25Db21wbGV0ZVR5cGUuQlJFQUtBQkxFO1xuICAgIH0sXG5cbiAgICBuZXh0QWN0aW9uOiBmdW5jdGlvbiBuZXh0QWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIC8v5L+d5oyB56e75YqoXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VyckFjdGlvbiAhPT0gQWN0b3JBY3Rpb24uSURMRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aW9uKEFjdG9yQWN0aW9uLklETEUsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgfSxcblxuICAgIGJyZWFrYWJsZTogZnVuY3Rpb24gYnJlYWthYmxlKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIG5lZWREaXNhcHBlYXI6IGZ1bmN0aW9uIG5lZWREaXNhcHBlYXIoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2Jvcm5FbmRUaW1lID4gMCAmJiBjdXJyVGltZSA+PSB0aGlzLl9ib3JuRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5faXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9ib3JuRW5kVGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcmVsaXZlRW5kVGltZSA+IDAgJiYgY3VyclRpbWUgPj0gdGhpcy5fcmVsaXZlRW5kVGltZSkge1xuICAgICAgICAgICAgdGhpcy5lbmRSZWxpdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0Zsb2F0KGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9odXJ0RW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0h1cnQoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbGxhcHNlRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NvbGxhcHNlKGN1cnJUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZWNvdmVyRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JlY292ZXIoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5pu05paw5oqA6IO95L2c55So5pe26Ze054K5XG4gICAgICAgIHRoaXMudXBkYXRlU2tpbGxUaW1lUG9pbnRzKGN1cnJUaW1lKTtcblxuICAgICAgICBpZiAodGhpcy5faXNBdHRhY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0F0dGFjayhjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01vdmUoY3VyclRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBsZXRlVHlwZSA9IHRoaXMuZ2V0Q3VycmVudEFjdGlvbkNvbXBsZXRlVHlwZShjdXJyVGltZSk7XG4gICAgICAgIHN3aXRjaCAoY29tcGxldGVUeXBlKSB7XG4gICAgICAgICAgICAvLyDlt7LlrozmiJDmiJblj6/lrozmiJBcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coJ2FiYycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9naWNNYW5hZ2VyLnJlbW92ZUVuaXR5KHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5DT0xMQVBTRSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNEZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRSZWxpdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZWVkRGlzYXBwZWFyKCkgJiYgdGhpcy5fY3VyckFjdGlvbiAhPSBBY3RvckFjdGlvbi5ESVNBUFBFQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGlzYXBwZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UmVjb3ZlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJFTElWRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uUkVDT1ZFUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJBY3Rpb24gPT0gQWN0b3JBY3Rpb24uQk9STikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRBY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIOWPr+aJk+aWrVxuICAgICAgICAgICAgY2FzZSBBY3Rpb25Db21wbGV0ZVR5cGUuQlJFQUtBQkxFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJyZWFrYWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dEFjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8g5pyq5a6M5oiQ5oiW5LiN5Y+v5a6M5oiQXG4gICAgICAgICAgICBjYXNlIEFjdGlvbkNvbXBsZXRlVHlwZS5VTkNPTVBMRVRBQkxFOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNraWxsVGltZVBvaW50czogZnVuY3Rpb24gdXBkYXRlU2tpbGxUaW1lUG9pbnRzKGN1cnJUaW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2tpbGxUaW1lU3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGltZVN0YXRlID0gdGhpcy5fc2tpbGxUaW1lU3RhdGVzW2ldO1xuICAgICAgICAgICAgaWYgKCF0aW1lU3RhdGUudGFrZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPj0gdGltZVN0YXRlLnRha2VFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFrZVNraWxsVGltZVBvaW50KHRpbWVTdGF0ZS50aW1lUG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lU3RhdGUudGFrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxUaW1lUG9pbnQ6IGZ1bmN0aW9uIHRha2VTa2lsbFRpbWVQb2ludCh0aW1lUG9pbnQpIHtcbiAgICAgICAgc3dpdGNoICh0aW1lUG9pbnQuYWN0VHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLkRBTUFHRTpcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VTa2lsbERhbWFnZSh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSBUaW1lUG9pbnRBY3RUeXBlLlNFTEZfREVMQVk6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlU2tpbGxTZWxmRGVsYXkodGltZVBvaW50KTticmVhaztcbiAgICAgICAgICAgIGNhc2UgVGltZVBvaW50QWN0VHlwZS5TSE9DS19TQ1JFRU46XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwLnNob2NrKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRpbWVQb2ludEFjdFR5cGUuUExBWV9FRkZFQ1Q6XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlUGxheUVmZmVjdCh0aW1lUG9pbnQpO2JyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRha2VTa2lsbERhbWFnZTogZnVuY3Rpb24gdGFrZVNraWxsRGFtYWdlKHRpbWVQb2ludCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2UobmV3IGNjLlZlYzIodGltZVBvaW50LnJhbmdlLngsIHRpbWVQb2ludC5yYW5nZS55KSk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgb2Zmc2V0LnggLT0gdGltZVBvaW50LnJhbmdlLndpZHRoO1xuICAgICAgICB2YXIgcmVnaW9uID0gbmV3IGNjLlJlY3Qob2Zmc2V0LngsIG9mZnNldC55LCB0aW1lUG9pbnQucmFuZ2Uud2lkdGgsIHRpbWVQb2ludC5yYW5nZS5oZWlnaHQpO1xuICAgICAgICB2YXIgaGl0dGluZ0FjdG9ycyA9IG51bGw7XG4gICAgICAgIHZhciBwbGF5ZXIgPSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCk7XG4gICAgICAgIHZhciBhdHRhY2tWYWx1ZSA9IHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICAgICAgaWYgKHRoaXMgPT09IHBsYXllcikgaGl0dGluZ0FjdG9ycyA9IHRoaXMuX2xvZ2ljTWFuYWdlci5nZXRBY3RvckJ5UmVnaW9uKHRoaXMsIHJlZ2lvbik7ZWxzZSB7XG4gICAgICAgICAgICBoaXR0aW5nQWN0b3JzID0gW3BsYXllcl07XG4gICAgICAgICAgICBhdHRhY2tWYWx1ZSArPSAodGhpcy5fbG9naWNNYW5hZ2VyLmdldFJvdW5kKCkgLSAxKSAqIDIwO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaXR0aW5nQWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYWN0b3IgPSBoaXR0aW5nQWN0b3JzW2ldO1xuICAgICAgICAgICAgaWYgKGFjdG9yLnN0dWNrKHRoaXMsIHJlZ2lvbi5jbG9uZSgpLCB0aW1lUG9pbnQuYXR0YWNrVHlwZSwgYXR0YWNrVmFsdWUsIHRpbWVQb2ludC5hdHRhY2tQYXJhbSkpIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAmJiB0aW1lUG9pbnQuc291bmQgJiYgdGltZVBvaW50LnNvdW5kICE9PSAwKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kL1wiICsgdGltZVBvaW50LnNvdW5kLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGF1ZGlvQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gcmVzdWx0O1xuICAgIH0sXG5cbiAgICB0YWtlU2tpbGxTZWxmRGVsYXk6IGZ1bmN0aW9uIHRha2VTa2lsbFNlbGZEZWxheSh0aW1lUG9pbnQpIHtcbiAgICAgICAgdGhpcy5fYXR0YWNrRW5kVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKSArIHRpbWVQb2ludC5hY3RWYWx1ZVswXTtcbiAgICB9LFxuXG4gICAgdGFrZVBsYXlFZmZlY3Q6IGZ1bmN0aW9uIHRha2VQbGF5RWZmZWN0KHRpbWVQb2ludCkge1xuICAgICAgICBpZiAodGhpcy5fbG9naWNNYW5hZ2VyKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gbmV3IGNjLlZlYzIodGhpcy5ub2RlLnggKyB0aW1lUG9pbnQucG9zaXRpb24ueCwgdGhpcy5ub2RlLnkgKyB0aW1lUG9pbnQucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLl9sb2dpY01hbmFnZXIucGxheUVmZmVjdCh0aW1lUG9pbnQuaWQsIHRpbWVQb2ludC5sYXllciwgcG9zLCB0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3R1Y2s6IGZ1bmN0aW9uIHN0dWNrKGFjdG9yLCByZWdpb24sIGF0dGFja1R5cGUsIGF0dGFja1ZhbHVlLCBhdHRhY2tQYXJhbSkge1xuICAgICAgICBpZiAodGhpcy5faXNJbnZpbmNpYmxlIHx8IHRoaXMuX2lzRGVhZCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGFtYWdlKGF0dGFja1ZhbHVlKTtcbiAgICAgICAgdGhpcy5wbGF5SGl0RWZmZWN0KHJlZ2lvbik7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPiAwKSB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0F0dGFja2luZykgdGhpcy5zdG9wQXR0YWNrKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0RmxvYXQoMC43LCAxNTAsIDE1MCAqIGFjdG9yLmdldERpcmVjdGlvbigpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAoYXR0YWNrVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5OT1JNQUw6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mbG9hdFN0YXJ0VGltZSA8PSAwKSB0aGlzLnN0YXJ0SHVydCgwLjMsIHRoaXMuX2RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNrVHlwZS5GTFk6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgLT0gYXR0YWNrUGFyYW0uY29tYm87XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5Db21ib1ZhbHVlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbkNvbWJvVmFsdWUgPSB0aGlzLl9kZWZhdWx0Q29tYm9WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEZsb2F0KGF0dGFja1BhcmFtLnRvcFRpbWUsIGF0dGFja1BhcmFtLnRvcEhlaWdodCwgYXR0YWNrUGFyYW0uZGlzdGFuY2UgKiBhY3Rvci5nZXREaXJlY3Rpb24oKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGRhbWFnZTogZnVuY3Rpb24gZGFtYWdlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2hwIC09IHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5faHAgPCAwKSB0aGlzLl9ocCA9IDA7XG4gICAgICAgIGlmICh0aGlzLl9ocCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0RlYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpcy5fbG9naWNNYW5hZ2VyLmdldFBsYXllcigpKSB0aGlzLl9sb2dpY01hbmFnZXIua2lsbE1vbnN0ZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0RlYWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXlSZWxpdmVFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlSZWxpdmVFZmZlY3QoKSB7fSxcblxuICAgIHBsYXlIaXRFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlIaXRFZmZlY3QocmVnaW9uKSB7XG4gICAgICAgIHZhciBwb2ludCA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2UobmV3IGNjLlZlYzIocmVnaW9uLngsIHJlZ2lvbi55KSk7XG4gICAgICAgIHJlZ2lvbi54ID0gcG9pbnQueDtcbiAgICAgICAgcmVnaW9uLnkgPSBwb2ludC55O1xuICAgICAgICB2YXIgYm94ID0gdGhpcy5fYm94LmNsb25lKCk7XG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gQWN0b3JEaXJlY3Rpb24uTEVGVCkgcmVnaW9uLnggPSAtcmVnaW9uLng7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBjYy5yZWN0SW50ZXJzZWN0aW9uKHJlZ2lvbiwgdGhpcy5fYm94KTtcbiAgICAgICAgdmFyIHBvcyA9IG5ldyBjYy5WZWMyKHRoaXMubm9kZS54ICsgaW50ZXJzZWN0aW9uLmNlbnRlci54LCB0aGlzLm5vZGUueSArIGludGVyc2VjdGlvbi5jZW50ZXIueSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvZWZmZWN0LzRcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBub2RlLnggPSBwb3MueDtcbiAgICAgICAgICAgIG5vZGUueSA9IHBvcy55O1xuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltYXRpb24ub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX21hcC5hZGRFZmZlY3Qobm9kZSwgMSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFJlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpO1xuICAgICAgICB2YXIgbG9ja1Jlc3VsdCA9IHRoaXMuZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQobWFwUmVzdWx0LnN4LCBtYXBSZXN1bHQuc3ksIG1hcFJlc3VsdC5keCwgbWFwUmVzdWx0LmR5KTtcbiAgICAgICAgaWYgKCFsb2NrUmVzdWx0LnBhc3MpIHtcbiAgICAgICAgICAgIGxvY2tSZXN1bHQucGFzcyA9IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5zeCkgIT09IE1hdGguZmxvb3IobG9ja1Jlc3VsdC5keCkgfHwgTWF0aC5mbG9vcihsb2NrUmVzdWx0LnN5KSAhPT0gTWF0aC5mbG9vcihsb2NrUmVzdWx0LmR5KTtcbiAgICAgICAgICAgIHJldHVybiBsb2NrUmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9ja1Jlc3VsdC5wYXNzID0gbWFwUmVzdWx0LnBhc3M7XG4gICAgICAgICAgICByZXR1cm4gbG9ja1Jlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwUmVzdWx0O1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZE1hcE1vdmVQb2ludDogZnVuY3Rpb24gZ2V0Rml4ZWRNYXBNb3ZlUG9pbnQoc3gsIHN5LCBkeCwgZHkpIHtcbiAgICAgICAgdmFyIG1hcFBpeGVzU2l6ZSA9IHRoaXMuX21hcC5nZXRNYXBQaXhlc1NpemUoKTtcbiAgICAgICAgdmFyIG1hcFBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAoc3ggPCAwKSB7XG4gICAgICAgICAgICBzeCA9IDA7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5mbG9vcihzeCkgPj0gbWFwUGl4ZXNTaXplLndpZHRoKSB7XG4gICAgICAgICAgICBzeCA9IG1hcFBpeGVzU2l6ZS53aWR0aCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN5IDwgMCkge1xuICAgICAgICAgICAgc3kgPSAwO1xuICAgICAgICAgICAgbWFwUGFzcyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3Ioc3kpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHN5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICBtYXBQYXNzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdU91dCA9IGZhbHNlLFxuICAgICAgICAgICAgdk91dCA9IGZhbHNlO1xuICAgICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmZsb29yKGR4KSA+PSBtYXBQaXhlc1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIGR4ID0gbWFwUGl4ZXNTaXplLndpZHRoIC0gMTtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICAgIHVPdXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguZmxvb3IoZHkpID49IG1hcFBpeGVzU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIGR5ID0gbWFwUGl4ZXNTaXplLmhlaWdodCAtIDE7XG4gICAgICAgICAgICB1T3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1T3V0ICYmIHZPdXQpIG1hcFBhc3MgPSBmYWxzZTtcblxuICAgICAgICB2YXIgbGluZVBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobWFwUGFzcykge1xuICAgICAgICAgICAgdmFyIHRpbGVTaXplID0gdGhpcy5fbWFwLmdldFRpbGVTaXplKCk7XG4gICAgICAgICAgICB2YXIgdXggPSBzeCAvIHRpbGVTaXplLndpZHRoO1xuICAgICAgICAgICAgdmFyIHV5ID0gc3kgLyB0aWxlU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgdWR4ID0gZHggLyB0aWxlU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciB1ZHkgPSBkeSAvIHRpbGVTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHZhciBweCA9IHVkeCAtIHV4O1xuICAgICAgICAgICAgdmFyIHB5ID0gdWR5IC0gdXk7XG4gICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgubWF4KDEsIE1hdGgubWF4KE1hdGguY2VpbChNYXRoLmFicyhweCkpLCBNYXRoLmNlaWwoTWF0aC5hYnMocHkpKSkpO1xuXG4gICAgICAgICAgICBweCA9IHB4IC8gZGlzdDtcbiAgICAgICAgICAgIHB5ID0gcHkgLyBkaXN0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRpc3QgLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdYID0gTWF0aC5mbG9vcih1eCArIHB4KTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3WSA9IE1hdGguZmxvb3IodXkgKyBweSk7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFggPSBNYXRoLmZsb29yKHV4KTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkWSA9IE1hdGguZmxvb3IodXkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXAuY2hlY2tNb3ZlUG9pbnQobmV3WCwgbmV3WSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXggKz0gcHg7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG5ld1gsIG9sZFkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV4ICs9IHB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWFwLmNoZWNrTW92ZVBvaW50KG9sZFgsIG5ld1kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHV5ICs9IHB5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVQYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR4ID0gTWF0aC5mbG9vcih1eCAqIHRpbGVTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGR5ID0gTWF0aC5mbG9vcih1eSAqIHRpbGVTaXplLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwYXNzOiBtYXBQYXNzICYmIGxpbmVQYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICB9LFxuXG4gICAgZ2V0Rml4ZWRMb2NrUmVnaW9uUG9pbnQ6IGZ1bmN0aW9uIGdldEZpeGVkTG9ja1JlZ2lvblBvaW50KHN4LCBzeSwgZHgsIGR5KSB7XG4gICAgICAgIHZhciBsb2NrUmVnaW9uID0gdGhpcy5fbWFwLmxvY2tSZWdpb24uY2xvbmUoKTtcbiAgICAgICAgaWYgKGxvY2tSZWdpb24ueE1pbiA9PT0gMCAmJiBsb2NrUmVnaW9uLnlNaW4gPT09IDAgJiYgbG9ja1JlZ2lvbi54TWF4ID09PSAwICYmIGxvY2tSZWdpb24ueE1heCA9PT0gMCkge1xuICAgICAgICAgICAgbG9ja1JlZ2lvbi54TWluID0gMDtcbiAgICAgICAgICAgIGxvY2tSZWdpb24ueU1pbiA9IDA7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnhNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkud2lkdGg7XG4gICAgICAgICAgICBsb2NrUmVnaW9uLnlNYXggPSB0aGlzLl9tYXAuZ2V0TWFwUGl4ZXNTaXplKCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYWx0V2lkdGggPSB0aGlzLmdldENvbGxpc2lvbigpLndpZHRoIC8gMjtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWluICs9IGhhbHRXaWR0aDtcbiAgICAgICAgbG9ja1JlZ2lvbi54TWF4IC09IGhhbHRXaWR0aDtcbiAgICAgICAgdmFyIHBhc3MgPSB0cnVlO1xuICAgICAgICBpZiAobG9ja1JlZ2lvbi5jb250YWlucyhuZXcgY2MuVmVjMihzeCwgc3kpKSkge1xuICAgICAgICAgICAgaWYgKGR4IDw9IGxvY2tSZWdpb24ueE1pbikge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWluICsgMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGR4ID49IGxvY2tSZWdpb24ueE1heCkge1xuICAgICAgICAgICAgICAgIGR4ID0gbG9ja1JlZ2lvbi54TWF4IC0gMTtcbiAgICAgICAgICAgICAgICBwYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHkgPD0gbG9ja1JlZ2lvbi55TWluKSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNaW4gKyAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZHkgPj0gbG9ja1JlZ2lvbi55TWF4KSB7XG4gICAgICAgICAgICAgICAgZHkgPSBsb2NrUmVnaW9uLnlNYXggLSAxO1xuICAgICAgICAgICAgICAgIHBhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0geyBwYXNzOiBwYXNzLCBzeDogc3gsIHN5OiBzeSwgZHk6IGR5LCBkeDogZHggfTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZmNTJiSHczeXBLTTRKTHhpMldoV0wvJywgJ2FjdG9yX2RlZmluZScpO1xuLy8gc2NyaXB0XFxhY3RvclxcYWN0b3JfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFjdG9yRGlyZWN0aW9uOiB7XG4gICAgICAgIExFRlQ6IC0xLFxuICAgICAgICBSSUdIVDogMVxuICAgIH0sXG5cbiAgICBBY3RvckFjdGlvbjoge1xuICAgICAgICBJRExFOiAwLFxuICAgICAgICBQUkVSVU46IDEsXG4gICAgICAgIFJVTjogMixcbiAgICAgICAgQVRUQUNLOiAzLFxuICAgICAgICBIVVJUOiA0LFxuICAgICAgICBIVVJUX0ZMWTogNSxcbiAgICAgICAgSFVSVF9GQUxMOiA2LFxuICAgICAgICBDT0xMQVBTRTogNyxcbiAgICAgICAgUkVDT1ZFUjogOCxcbiAgICAgICAgQk9STjogOSxcbiAgICAgICAgRElTQVBQRUFSOiAxMCxcbiAgICAgICAgUkVMSVZFOiAxMVxuICAgIH0sXG5cbiAgICBBY3Rpb25OYW1lOiBbXCJpZGxlXCIsIFwicHJlcnVuXCIsIFwicnVuXCIsIFwiYXR0YWNrX1wiLCBcImh1cnRcIiwgXCJodXJ0X2ZseVwiLCBcImh1cnRfZmFsbFwiLCBcImNvbGxhcHNlXCIsIFwic3RhbmR1cFwiLCBcImJvcm5cIiwgXCJkaXNhcHBlYXJcIiwgXCJyZWxpdmVcIl0sXG5cbiAgICBBY3Rpb25DbGlwSW5kZXg6IHtcbiAgICAgICAgSURMRTogMCxcbiAgICAgICAgUlVOOiAxLFxuICAgICAgICBBVFRBQ0tfMTogMixcbiAgICAgICAgQVRUQUNLXzI6IDMsXG4gICAgICAgIEFUVEFDS18zOiA0LFxuICAgICAgICBIVVJUOiA1LFxuICAgICAgICBIVVJUX0ZMWTogNixcbiAgICAgICAgSFVSVF9GQUxMOiA3LFxuICAgICAgICBDT0xMQVBTRTogOCxcbiAgICAgICAgUkVDT1ZFUjogOSxcbiAgICAgICAgQk9STjogMTAsXG4gICAgICAgIERJU0FQUEVBUjogMTEsXG4gICAgICAgIFJFTElWRTogMTJcbiAgICB9LFxuXG4gICAgQWN0aW9uQ29tcGxldGVUeXBlOiB7XG4gICAgICAgIENPTVBMRVRBQkxFOiAwLFxuICAgICAgICBVTkNPTVBMRVRBQkxFOiAxLFxuICAgICAgICBCUkVBS0FCTEU6IDJcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2Y2YmZJQy9vVkhJYktpazhxTTJIQUMnLCAnYXR0YWNrX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcYXR0YWNrX2N0cmwuanNcblxudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgYXR0YWNrQToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYXR0YWNrQjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWN0aW9uVGltZTogMC4xXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5vblRvdWNoQ2FuY2VsLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGxheWVyOiBmdW5jdGlvbiBzZXRQbGF5ZXIocGxheWVyKSB7XG4gICAgICAgIHRoaXMuX3BsYXllckN0cmwgPSBwbGF5ZXI7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9TdGFydFN0YWZmKCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9FbmRTdGFmZigpO1xuICAgICAgICAvL3RoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LkhJVCk7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5ZXJDdHJsKSB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuSElUKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaENhbmNlbDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5ISVQpO1xuICAgIH0sXG5cbiAgICBkb1N0YXJ0U3RhZmY6IGZ1bmN0aW9uIGRvU3RhcnRTdGFmZigpIHtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVPdXQodGhpcy5hY3Rpb25UaW1lKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICBkb0VuZFN0YWZmOiBmdW5jdGlvbiBkb0VuZFN0YWZmKCkge1xuICAgICAgICB0aGlzLmF0dGFja0Euc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5hdHRhY2tBLm9wYWNpdHkgPSAwO1xuICAgICAgICB2YXIgdGltZSA9ICgyNTUgLSB0aGlzLmF0dGFja0Eub3BhY2l0eSkgLyAyNTUgKiB0aGlzLmFjdGlvblRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZUluKHRoaXMuYWN0aW9uVGltZSk7XG4gICAgICAgIHRoaXMuYXR0YWNrQS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NlNTE4RkhSbDlBVXB5aFR3SlhLbTV1JywgJ2JhdHRsZV9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGJhdHRsZV9jdHJsLmpzXG5cbnZhciBIdXJsZGVEZWZpbmUgPSByZXF1aXJlKFwiaHVyZGxlX2RlZmluZVwiKTtcbnZhciBDb250cm9sRGVmaW5lID0gcmVxdWlyZShcImNvbnRyb2xfZGVmaW5lXCIpO1xudmFyIEd1aWRlRGVmaW5lID0gcmVxdWlyZShcImd1aWRlX2RlZmluZVwiKTtcbnZhciBUcmlnZ2VyVHlwZSA9IEh1cmxkZURlZmluZS5UcmlnZ2VyVHlwZTtcbnZhciBDbWRUeXBlID0gSHVybGRlRGVmaW5lLkNtZFR5cGU7XG52YXIgQ29uZFR5cGUgPSBIdXJsZGVEZWZpbmUuQ29uZFR5cGU7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcbnZhciBHdWlkZVN0ZXAgPSBHdWlkZURlZmluZS5HdWlkZVN0ZXA7XG52YXIgR3VpZGVNYXNrID0gR3VpZGVEZWZpbmUuR3VpZGVNYXNrO1xuXG52YXIgSHVyZGxlTG9hZEJpdCA9IHtcbiAgICBNQVA6IDB4MDAwMVxufTtcblxudmFyIGRlZmF1bHRSZXRyeUNvdW50ID0gMztcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRyYW5zZm9ybU1hc2s6IGNjLk5vZGUsXG4gICAgICAgIGpveVN0aWNrOiBjYy5Ob2RlLFxuICAgICAgICBhdHRhY2tCdXR0b246IGNjLk5vZGUsXG4gICAgICAgIG1hcExheWVyOiBjYy5Ob2RlLFxuICAgICAgICBjb250cm9sTGF5ZXI6IGNjLk5vZGUsXG4gICAgICAgIHN0YXRlQmFyOiBjYy5Ob2RlLFxuICAgICAgICBtb3ZlVGlwczogY2MuTm9kZSxcbiAgICAgICAgcm91bmRCYXI6IGNjLk5vZGUsXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiLFxuICAgICAgICBndWlkZUZpbmdlckFuaTogY2MuQW5pbWF0aW9uLFxuXG4gICAgICAgIGd1aWRlU3RlcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2d1aWRlU3RlcDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZVN0ZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBtYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlci5lbmFibGVkRGVidWdEcmF3ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fdWlNYW5hZ2VyID0gdGhpcy5ub2RlLmdldENvbXBvbmVudCgndWlfbWFuYWdlcicpO1xuICAgICAgICB0aGlzLl9yZXRyeUNvdW50ID0gZGVmYXVsdFJldHJ5Q291bnQ7XG5cbiAgICAgICAgLy8g5o6n5Yi255u45YWzXG4gICAgICAgIHRoaXMuX3JvdW5kQmFyID0gdGhpcy5yb3VuZEJhci5nZXRDb21wb25lbnQoJ3JvdW5kX2N0cmwnKTtcbiAgICAgICAgdGhpcy5fam95U3RpY2sgPSB0aGlzLmpveVN0aWNrLmdldENvbXBvbmVudChcImpveV9jdHJsXCIpO1xuICAgICAgICB0aGlzLl9hdHRhY2tCdXR0b24gPSB0aGlzLmF0dGFja0J1dHRvbi5nZXRDb21wb25lbnQoXCJhdHRhY2tfY3RybFwiKTtcbiAgICAgICAgdGhpcy5fc3RhdGVCYXIgPSB0aGlzLnN0YXRlQmFyLmdldENvbXBvbmVudChcInN0YXRlX2N0cmxcIik7XG4gICAgICAgIHRoaXMuX3BsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKS5nZXRDb21wb25lbnQoJ3BsYXllcl9jdHJsJyk7XG4gICAgICAgIHRoaXMuX3BsYXllci5sb2dpY01hbmFnZXIgPSB0aGlzO1xuICAgICAgICB0aGlzLl9wbGF5ZXIuc3RhdGVCYXIgPSB0aGlzLl9zdGF0ZUJhcjtcbiAgICAgICAgdGhpcy5fam95U3RpY2suc2V0UGxheWVyKHRoaXMuX3BsYXllcik7XG4gICAgICAgIHRoaXMuX2F0dGFja0J1dHRvbi5zZXRQbGF5ZXIodGhpcy5fcGxheWVyKTtcblxuICAgICAgICAvLyDlhbPljaHnm7jlhbNcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUlkID0gLTE7XG4gICAgICAgIHRoaXMuX2h1cmRsZUxvYWRNYXNrID0gMDtcbiAgICAgICAgdGhpcy5fc3RhcnR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNGYWlsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVDb25maWcgPSBudWxsO1xuICAgICAgICB0aGlzLl9tYXAgPSBudWxsO1xuXG4gICAgICAgIC8vIOS7u+WKoeebuOWFs1xuICAgICAgICB0aGlzLl9taXNzaW9ucyA9IFtdO1xuICAgICAgICB0aGlzLl90cmlnZ2VycyA9IFtdO1xuICAgICAgICB0aGlzLl9jdXJyTWlzc2lvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX21pc3Npb25TdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9odXJkbGVTdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9raWxsTnVtID0gMDtcbiAgICAgICAgdGhpcy5fcm91bmROdW0gPSAwO1xuICAgICAgICB0aGlzLl90b3RhbEtpbGxOdW0gPSAwO1xuXG4gICAgICAgIHRoaXMuX2tlZXBFZmZlY3RzID0gW107XG4gICAgICAgIHRoaXMuX21vbnN0ZXJzID0gW107XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBzZWxmLm9uS2V5UHJlc3NlZC5iaW5kKHNlbGYpLFxuICAgICAgICAgICAgb25LZXlSZWxlYXNlZDogc2VsZi5vbktleVJlbGVhc2VkLmJpbmQoc2VsZilcbiAgICAgICAgfTtcbiAgICAgICAgLy8g57uR5a6a6byg5qCH5LqL5Lu2XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0aGlzLl9saXN0ZW5lciwgdGhpcy5ub2RlKTtcblxuICAgICAgICAvLyDmnaXoh6rlpLHotKXnqpflj6PvvIzlpI3mtLvmjInpkq5cbiAgICAgICAgdGhpcy5fcmVsaXZlSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fQlVZX1RJTUVfVE9fUExBWSwgdGhpcy5vblJldHJ5R2FtZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fcmV0dXJuSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fUkVUVVJOX0dBTUUsIHRoaXMub25SZXR1cm5FdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9yZWxpdmVIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3JldHVybkhhbmRsZXIpO1xuXG4gICAgICAgIHRoaXMuX3JlbGl2ZUhhbmRsZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZXR1cm5IYW5kbGVyID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5fcmVzdWx0SGFuZGxlcikge1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3Jlc3VsdEhhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wTXVzaWModHJ1ZSk7XG5cbiAgICAgICAgLy8g5LiN6IO96L+Z5qC35YGa77yMZGVzdHJveeaXtuaJgOaciWxpc3RlbmVy5bey56e76ZmkXG4gICAgICAgIC8vY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX2xpc3RlbmVyKTtcbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHNob3cpIHtcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5wYXVzZSgpO1xuICAgIH0sXG5cbiAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICB2YXIgY2sgPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnc6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LlVQO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuTEVGVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnM6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkRPV047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5SSUdIVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmo6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkhJVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2sgJiYgdGhpcy5fcGxheWVyKSB0aGlzLl9wbGF5ZXIua2V5RG93bihjayk7XG4gICAgfSxcblxuICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGNrID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5VUDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgY2sgPSBDb250cm9sS2V5LkxFRlQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5zOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ET1dOO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICBjayA9IENvbnRyb2xLZXkuUklHSFQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5qOlxuICAgICAgICAgICAgICAgIGNrID0gQ29udHJvbEtleS5ISVQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNrICYmIHRoaXMuX3BsYXllcikgdGhpcy5fcGxheWVyLmtleVVwKGNrKTtcbiAgICB9LFxuXG4gICAgb25SZXN1bHRHYW1lOiBmdW5jdGlvbiBvblJlc3VsdEdhbWUoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9yZXN1bHRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlci5vcGVuVUkoJ21pc3Npb25fZmFpbCcsIHsga2lsbE51bTogdGhpcy5fdG90YWxLaWxsTnVtLCByb3VuZE51bTogdGhpcy5fcm91bmROdW0gfSk7XG4gICAgfSxcblxuICAgIG9uUmV0cnlHYW1lOiBmdW5jdGlvbiBvblJldHJ5R2FtZSgpIHtcbiAgICAgICAgdGhpcy5fcmV0cnlDb3VudC0tO1xuICAgICAgICB0aGlzLl9wbGF5ZXIucmVsaXZlKCk7XG4gICAgfSxcblxuICAgIG9uUmV0dXJuRXZlbnQ6IGZ1bmN0aW9uIG9uUmV0dXJuRXZlbnQoKSB7XG4gICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIC8vdGhpcy5sb2FkTXVzaWMoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VIdXJkbGUoMCk7XG4gICAgfSxcblxuICAgIGNsZWFyRWZmZWN0czogZnVuY3Rpb24gY2xlYXJFZmZlY3RzKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fa2VlcEVmZmVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9rZWVwRWZmZWN0cy5wb3AoKTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyTW9uc3RlcjogZnVuY3Rpb24gY2xlYXJNb25zdGVyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fbW9uc3RlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG1vbiA9IHRoaXMuX21vbnN0ZXJzLnBvcCgpO1xuICAgICAgICAgICAgbW9uLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyTWlzc2lvbjogZnVuY3Rpb24gY2xlYXJNaXNzaW9uKCkge1xuICAgICAgICB0aGlzLl90cmlnZ2Vycy5zcGxpY2UoMCwgdGhpcy5fdHJpZ2dlcnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fbWlzc2lvbnMuc3BsaWNlKDAsIHRoaXMuX21pc3Npb25zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2N1cnJNaXNzaW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbWlzc2lvblN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2tpbGxOdW0gPSAwO1xuICAgIH0sXG5cbiAgICBjbGVhckh1cmRsZTogZnVuY3Rpb24gY2xlYXJIdXJkbGUoKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlci5jbG9zZUFsbCgpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIubWFwID0gbnVsbDtcbiAgICAgICAgdGhpcy5jbGVhckVmZmVjdHMoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVNYXAoKTtcbiAgICAgICAgdGhpcy5jbGVhck1vbnN0ZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhck1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJIdXJkbGVJZCA9IC0xO1xuICAgICAgICB0aGlzLl9odXJkbGVMb2FkTWFzayA9IDA7XG4gICAgICAgIHRoaXMuX2h1cmRsZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2lzRmFpbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yb3VuZE51bSA9IDA7XG4gICAgICAgIHRoaXMuX3RvdGFsS2lsbE51bSA9IDA7XG4gICAgICAgIHRoaXMucm91bmRCYXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JldHJ5Q291bnQgPSBkZWZhdWx0UmV0cnlDb3VudDtcbiAgICB9LFxuXG4gICAgaW5pdE1pc3Npb246IGZ1bmN0aW9uIGluaXRNaXNzaW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2N1cnJIdXJkbGVDb25maWcpIHJldHVybjtcbiAgICAgICAgdmFyIGNmZyA9IHRoaXMuX2N1cnJIdXJkbGVDb25maWc7XG4gICAgICAgIGZvciAodmFyIGkgPSBjZmcubWlzc2lvbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgdGhpcy5fbWlzc2lvbnMucHVzaChjZmcubWlzc2lvbltpXSk7XG4gICAgICAgIHRoaXMuX21pc3Npb25TdGFydFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9raWxsTnVtID0gMDtcbiAgICB9LFxuXG4gICAgY2hhbmdlSHVyZGxlOiBmdW5jdGlvbiBjaGFuZ2VIdXJkbGUoaWQpIHtcbiAgICAgICAgdGhpcy5fc3RhcnR0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJIdXJkbGVJZCA+PSAwICYmIHRoaXMuX2N1cnJIdXJkbGVJZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKDApO1xuICAgICAgICB9IGVsc2UgaWYgKGlkID49IDApIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtTWFzay5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1NYXNrLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICB0aGlzLmxvYWRIdXJkbGUoaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbGVhckh1cmRsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHR5cGUsIGJvcm4pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1NYXNrLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciBzZXF1ZW5jZSA9IG51bGw7XG4gICAgICAgIHZhciBhY3Rpb24gPSBudWxsO1xuICAgICAgICB2YXIgdGltZSA9IDA7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGUgPT09IDApIHtcbiAgICAgICAgICAgIC8v5Y+Y6buRXG4gICAgICAgICAgICB0aW1lID0gKDI1NSAtIHRoaXMudHJhbnNmb3JtTWFzay5vcGFjaXR5KSAvIDI1NSAqIDAuNTtcbiAgICAgICAgICAgIGFjdGlvbiA9IG5ldyBjYy5TZXF1ZW5jZShuZXcgY2MuRmFkZUluKHRpbWUpLCBuZXcgY2MuQ2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVzZXRIdXJkbGUoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAxKSB7XG4gICAgICAgICAgICAvLyDlj5jpgI/mmI5cbiAgICAgICAgICAgIGlmIChib3JuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheWVyLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aW1lID0gdGhpcy50cmFuc2Zvcm1NYXNrLm9wYWNpdHkgLyAyNTUgKiAwLjU7XG4gICAgICAgICAgICBhY3Rpb24gPSBuZXcgY2MuU2VxdWVuY2UobmV3IGNjLkZhZGVPdXQodGltZSksIG5ldyBjYy5DYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyLnNldEhwKDIwMCwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcGxheWVyLmJvcm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5zdGFydEh1cmRsZSgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJhbnNmb3JtTWFzay5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgc3RhcnRIdXJkbGU6IGZ1bmN0aW9uIHN0YXJ0SHVyZGxlKCkge1xuICAgICAgICB0aGlzLmxvYWRNdXNpYygpO1xuICAgICAgICB0aGlzLl9yb3VuZE51bSsrO1xuICAgICAgICB0aGlzLnJvdW5kQmFyLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JvdW5kQmFyLnNldFJvdW5kKHRoaXMuX3JvdW5kTnVtKTtcbiAgICAgICAgdGhpcy5fcGxheWVyLmNvbnRyb2xFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc3RhcnR0ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBsb2FkSHVyZGxlOiBmdW5jdGlvbiBsb2FkSHVyZGxlKGlkKSB7XG4gICAgICAgIHZhciBjZmcgPSBHbG9iYWwuaHVyZGxlUHJvdmlkZXIuZ2V0Q29uZmlnKGlkKTtcbiAgICAgICAgaWYgKCFjZmcpIHJldHVybjtcbiAgICAgICAgdGhpcy5jbGVhckh1cmRsZSgpO1xuICAgICAgICB0aGlzLl9jdXJySHVyZGxlSWQgPSBpZDtcbiAgICAgICAgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZyA9IGNmZztcbiAgICAgICAgdGhpcy5pbml0TWlzc2lvbigpO1xuICAgICAgICB0aGlzLmxvYWRNYXAoY2ZnLm1hcElkKTtcbiAgICB9LFxuXG4gICAgcmVzZXRIdXJkbGU6IGZ1bmN0aW9uIHJlc2V0SHVyZGxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2N1cnJIdXJkbGVDb25maWcpIHJldHVybjtcbiAgICAgICAgdGhpcy5fc3RhcnR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdWlNYW5hZ2VyLmNsb3NlQWxsKCk7XG4gICAgICAgIHRoaXMuY2xlYXJFZmZlY3RzKCk7XG4gICAgICAgIHRoaXMuX21hcC5yZXNldCgpO1xuICAgICAgICB0aGlzLmNsZWFyTW9uc3RlcigpO1xuICAgICAgICB0aGlzLmNsZWFyTWlzc2lvbigpO1xuICAgICAgICB0aGlzLmluaXRNaXNzaW9uKCk7XG4gICAgICAgIHRoaXMuX2lzRmFpbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaCA9IHRydWU7XG4gICAgICAgIHRoaXMucm91bmRCYXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BsYXllci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIuc2V0QWN0b3JQb3NpdGlvbih0aGlzLl9jdXJySHVyZGxlQ29uZmlnLmJvcm5Qb3MueCwgdGhpcy5fY3Vyckh1cmRsZUNvbmZpZy5ib3JuUG9zLnkpO1xuICAgICAgICB0aGlzLl9wbGF5ZXIubWFwID0gdGhpcy5fbWFwO1xuICAgICAgICB0aGlzLl9wbGF5ZXIuc2V0SHAoMjAwLCAyMDApO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSgxKTtcbiAgICB9LFxuXG4gICAgbGF1bmNoTWlzc2lvbjogZnVuY3Rpb24gbGF1bmNoTWlzc2lvbigpIHtcbiAgICAgICAgdmFyIG1pc3Npb24gPSB0aGlzLl9taXNzaW9ucy5wb3AoKTtcbiAgICAgICAgaWYgKCFtaXNzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyTWlzc2lvbiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3Vyck1pc3Npb24gPSBtaXNzaW9uO1xuICAgICAgICB0aGlzLl90cmlnZ2Vycy5zcGxpY2UoMCwgdGhpcy5fdHJpZ2dlcnMubGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaXNzaW9uLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl90cmlnZ2Vycy5wdXNoKG1pc3Npb24udHJpZ2dlcnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2tpbGxOdW0gPSAwO1xuICAgICAgICB0aGlzLl9taXNzaW9uU3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbG9hZE11c2ljOiBmdW5jdGlvbiBsb2FkTXVzaWMoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJzb3VuZC9iZ1wiLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGF1ZGlvQ2xpcCkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKGF1ZGlvQ2xpcCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBsb2FkTWFwOiBmdW5jdGlvbiBsb2FkTWFwKGlkKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvbWFwL1wiICsgaWQudG9TdHJpbmcoKSwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICBzZWxmLm9uSHVyZGxlU3RlcExvYWRlZChIdXJkbGVMb2FkQml0Lk1BUCwgZXJyLCBwcmVmYWIpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlTWFwOiBmdW5jdGlvbiByZW1vdmVNYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFwKSByZXR1cm47XG4gICAgICAgIHRoaXMuX21hcC5ub2RlLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hcC5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fbWFwID0gbnVsbDtcbiAgICB9LFxuXG4gICAgb25IdXJkbGVTdGVwTG9hZGVkOiBmdW5jdGlvbiBvbkh1cmRsZVN0ZXBMb2FkZWQoYml0LCBlcnIsIHByZWZhYikge1xuICAgICAgICBzd2l0Y2ggKGJpdCkge1xuICAgICAgICAgICAgY2FzZSBIdXJkbGVMb2FkQml0Lk1BUDpcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLm1hcExheWVyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG5vZGUuZ2V0Q29tcG9uZW50KFwibWFwX2N0cmxcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5faHVyZGxlTG9hZE1hc2sgfD0gSHVyZGxlTG9hZEJpdC5NQVA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZEh1cmRsZSgpKSB7XG4gICAgICAgICAgICAvL3RoaXMuX3BsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLm1hcCA9IHRoaXMuX21hcDtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5zZXRBY3RvclBvc2l0aW9uKHRoaXMuX2N1cnJIdXJkbGVDb25maWcuYm9yblBvcy54LCB0aGlzLl9jdXJySHVyZGxlQ29uZmlnLmJvcm5Qb3MueSk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSgxLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0xvYWRlZEh1cmRsZTogZnVuY3Rpb24gaXNMb2FkZWRIdXJkbGUoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIG1hc2sgPSAwO1xuICAgICAgICBmb3IgKHZhciBrIGluIEh1cmRsZUxvYWRCaXQpIHtcbiAgICAgICAgICAgIG1hc2sgfD0gSHVyZGxlTG9hZEJpdFtrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5faHVyZGxlTG9hZE1hc2sgPT0gbWFzaztcbiAgICB9LFxuXG4gICAgZ2V0UGxheWVyOiBmdW5jdGlvbiBnZXRQbGF5ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5ZXI7XG4gICAgfSxcblxuICAgIGdldFJvdW5kOiBmdW5jdGlvbiBnZXRSb3VuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdW5kTnVtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVNb25zdGVyOiBmdW5jdGlvbiBjcmVhdGVNb25zdGVyKGlkLCBwb3MsIGRpcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL2FjdG9yL21vbnN0ZXJcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICB2YXIgbW9uID0gbm9kZS5nZXRDb21wb25lbnQoXCJtb25zdGVyX2N0cmxcIik7XG4gICAgICAgICAgICBtb24ubG9naWNNYW5hZ2VyID0gc2VsZjtcbiAgICAgICAgICAgIHNlbGYuX21vbnN0ZXJzLnB1c2gobW9uKTtcbiAgICAgICAgICAgIG1vbi5zZXRBY3RvclBvc2l0aW9uKHBvcy54LCBwb3MueSk7XG4gICAgICAgICAgICBtb24ubWFwID0gc2VsZi5fbWFwO1xuICAgICAgICAgICAgbW9uLnNldERpcmVjdGlvbihkaXIpO1xuXG4gICAgICAgICAgICB2YXIgaHAgPSAoc2VsZi5fcm91bmROdW0gLSAxKSAqIDIwICsgMTMwO1xuICAgICAgICAgICAgbW9uLnNldEhwKGhwLCBocCk7XG4gICAgICAgICAgICBtb24uYm9ybigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGVzdHJveU1vbnN0ZXI6IGZ1bmN0aW9uIGRlc3Ryb3lNb25zdGVyKG1vbnN0ZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9tb25zdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG1vbnN0ZXIgPT0gdGhpcy5fbW9uc3RlcnNbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb25zdGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWFwLnJlbW92ZUVuaXR5KG1vbnN0ZXIubm9kZSk7XG4gICAgICAgIG1vbnN0ZXIubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHJlbW92ZUVuaXR5OiBmdW5jdGlvbiByZW1vdmVFbml0eShlbml0eSkge1xuICAgICAgICBpZiAoZW5pdHkgPT0gdGhpcy5fcGxheWVyKSB7fSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU1vbnN0ZXIoZW5pdHkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGtpbGxNb25zdGVyOiBmdW5jdGlvbiBraWxsTW9uc3RlcigpIHtcbiAgICAgICAgdGhpcy5fa2lsbE51bSsrO1xuICAgICAgICB0aGlzLl90b3RhbEtpbGxOdW0rKztcbiAgICB9LFxuXG4gICAgZ2V0QWN0b3JCeVJlZ2lvbjogZnVuY3Rpb24gZ2V0QWN0b3JCeVJlZ2lvbihhY3RvciwgcmVnaW9uKSB7XG4gICAgICAgIHZhciBtb25zID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbW9uc3RlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtb24gPSB0aGlzLl9tb25zdGVyc1tpXTtcbiAgICAgICAgICAgIHZhciBjb2xsID0gbW9uLmdldENvbGxpc2lvbigpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGFjdG9yLm5vZGUueSAtIG1vbi5ub2RlLnkpIDwgMzAgJiYgY2MuSW50ZXJzZWN0aW9uLnJlY3RSZWN0KG1vbi5nZXRDb2xsaXNpb24oKSwgcmVnaW9uKSkgbW9ucy5wdXNoKG1vbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vbnM7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnR0ZWQpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuX2N1cnJNaXNzaW9uICYmICF0aGlzLmxhdW5jaE1pc3Npb24oKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghdGhpcy5fcGxheWVyLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNGYWlsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNGYWlsID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzRmFpbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRmFpbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2MubG9nKCdyZXRyeSBjb3VudCcsIHRoaXMuX3JldHJ5Q291bnQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aU1hbmFnZXIub3BlblVJKCdyZWxpdmVfY29uZmlybScsIHsgcmV0cnlDb3VudDogdGhpcy5fcmV0cnlDb3VudCwga2lsbE51bTogdGhpcy5fdG90YWxLaWxsTnVtLCByb3VuZE51bTogdGhpcy5fcm91bmROdW0gfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fR0FNRV9SRVNVTFQsIHRoaXMub25SZXN1bHRHYW1lLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2NvcmUgPSBwYXJzZUludCh0aGlzLl90b3RhbEtpbGxOdW0gKyAxICsgXCIwXCIgKyB0aGlzLl9yb3VuZE51bSk7XG4gICAgICAgICAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5nYW1lUmVzdWx0KG1heFNjb3JlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VyclRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJyVGltZSA+IHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhdW5jaE5leHRNaXNzaW9uRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxhdW5jaE1pc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRGYWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5ZXIuY29udHJvbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2hlY2tNaXNzaW9uQ2xlYW4oKSkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyLmNvbnRyb2xFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXAuY2FtZXJhVG8odGhpcy5fbWFwLmdldEN1cnJQb3NpdGlvbigpLnggLSB0aGlzLl9tYXAudmlld1NpemUud2lkdGggLyAyLCAwLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9sYXVuY2hOZXh0TWlzc2lvbkVuZFRpbWUgPSBjdXJyVGltZSArIDE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5fdHJpZ2dlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBuZWVkRXhlYyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSB0aGlzLl90cmlnZ2Vyc1tpXTtcbiAgICAgICAgICAgIHN3aXRjaCAodHJpZ2dlci5ldmVudCkge1xuICAgICAgICAgICAgICAgIGNhc2UgVHJpZ2dlclR5cGUuVElNRTpcbiAgICAgICAgICAgICAgICAgICAgbmVlZEV4ZWMgPSBjdXJyVGltZSAtIHRoaXMuX21pc3Npb25TdGFydFRpbWUgPj0gdHJpZ2dlci5wYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFRyaWdnZXJUeXBlLkFSRUE6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBuZXcgY2MuVmVjMih0aGlzLl9wbGF5ZXIubm9kZS54LCB0aGlzLl9wbGF5ZXIubm9kZS55KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG5ldyBjYy5SZWN0KHRyaWdnZXIucGFyYW0ueCwgdHJpZ2dlci5wYXJhbS55LCB0cmlnZ2VyLnBhcmFtLndpZHRoLCB0cmlnZ2VyLnBhcmFtLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIG5lZWRFeGVjID0gcmVnaW9uLmNvbnRhaW5zKHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRFeGVjKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXhlY0NtZCh0cmlnZ2VyLmNvbW1hbmRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBleGVjQ21kOiBmdW5jdGlvbiBleGVjQ21kKGNvbW1hbmRzKSB7XG4gICAgICAgIHZhciBuZWVkQnJlYWsgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tYW5kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNtZCA9IGNvbW1hbmRzW2ldO1xuICAgICAgICAgICAgaWYgKCFjbWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgc3dpdGNoIChjbWQuY21kVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5DT05UUk9MX0VOQUJMRUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BsYXllci5jb250cm9sRW5hYmxlZCA9IGNtZC5hcmdzLmVuYWJsZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbExheWVyLmFjdGl2ZSA9IGNtZC5hcmdzLmVuYWJsZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkxPQ0tfQVJFQTpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IG5ldyBjYy5SZWN0KGNtZC5hcmdzLngsIGNtZC5hcmdzLnksIGNtZC5hcmdzLndpZHRoLCBjbWQuYXJncy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAubG9ja1JlZ2lvbiA9IHJlZ2lvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIENtZFR5cGUuQ1JFQVRFX01PTjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVNb25zdGVyKGNtZC5hcmdzLmlkLCBjbWQuYXJncy5wb3MsIGNtZC5hcmdzLmRpcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLlNIT1dfTU9WRV9USVBTOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUaXBzLmFjdGl2ZSA9IGNtZC5hcmdzLnNob3c7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLlNIT1dfVFJBTlNfRE9PUjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0KDgsIDAsIG5ldyBjYy5WZWMyKGNtZC5hcmdzLngsIGNtZC5hcmdzLnkpLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKEdsb2JhbC5ndWlkZVN0ZXAgJiBHdWlkZU1hc2suVFJBTlNfRE9PUl9BUlJPVykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheUVmZmVjdCg5LCAxLCBuZXcgY2MuVmVjMihjbWQuYXJncy54LCBjbWQuYXJncy55KSwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVTdGVwID0gR3VpZGVTdGVwLkVOVEVSX1RSQU5TX0RPT1I7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWwuZ3VpZGVTdGVwIHw9IEd1aWRlTWFzay5UUkFOU19ET09SX0FSUk9XO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkNIQU5HRV9IVVJETEU6XG4gICAgICAgICAgICAgICAgICAgIG5lZWRCcmVhayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ndWlkZVN0ZXAgPT0gR3VpZGVTdGVwLkVOVEVSX1RSQU5TX0RPT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZ3VpZGVfbWFzaycsIEdsb2JhbC5ndWlkZVN0ZXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVTdGVwID0gR3VpZGVTdGVwLk5PTkU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VIdXJkbGUoY21kLmFyZ3MuaWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5NT1ZFX0NBTUVSQTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLmNhbWVyYVRvKGNtZC5hcmdzLngsIGNtZC5hcmdzLnksIGNtZC5hcmdzLnRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgQ21kVHlwZS5ET19NT1ZFX0dVSURFOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShHbG9iYWwuZ3VpZGVTdGVwICYgR3VpZGVNYXNrLk1PVkUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmd1aWRlRmluZ2VyQW5pLm5vZGUueCA9IHRoaXMuam95U3RpY2sueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3VpZGVGaW5nZXJBbmkubm9kZS55ID0gdGhpcy5qb3lTdGljay55O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkZUZpbmdlckFuaS5wbGF5KCdndWlkZV9maW5nZXJfbW92ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVTdGVwID0gR3VpZGVTdGVwLk1PVkU7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWwuZ3VpZGVTdGVwIHw9IEd1aWRlTWFzay5NT1ZFO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBDbWRUeXBlLkRPX1RPVUNIX0dVSURFOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShHbG9iYWwuZ3VpZGVTdGVwICYgR3VpZGVNYXNrLkhJVCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIkRPX1RPVUNIX0dVSURFXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkZUZpbmdlckFuaS5ub2RlLnggPSB0aGlzLmF0dGFja0J1dHRvbi54O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkZUZpbmdlckFuaS5ub2RlLnkgPSB0aGlzLmF0dGFja0J1dHRvbi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkZUZpbmdlckFuaS5wbGF5KCdndWlkZV9maW5nZXJfdG91Y2gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlU3RlcCA9IEd1aWRlU3RlcC5UT1VDSDtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbC5ndWlkZVN0ZXAgfD0gR3VpZGVNYXNrLkhJVDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRCcmVhaykgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5kR3VpZGU6IGZ1bmN0aW9uIGVuZEd1aWRlKCkge1xuICAgICAgICB0aGlzLmd1aWRlRmluZ2VyQW5pLm5vZGUueCA9IC01MDAwO1xuICAgICAgICB0aGlzLmd1aWRlRmluZ2VyQW5pLm5vZGUueSA9IC01MDAwO1xuICAgICAgICB0aGlzLmd1aWRlRmluZ2VyQW5pLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fZ3VpZGVTdGVwID0gR3VpZGVTdGVwLk5PTkU7XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImd1aWRlX21hc2tcIiwgR2xvYmFsLmd1aWRlU3RlcCk7XG4gICAgfSxcblxuICAgIGNoZWNrTWlzc2lvbkNsZWFuOiBmdW5jdGlvbiBjaGVja01pc3Npb25DbGVhbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJyTWlzc2lvbikgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgICAgICB2YXIgY29uZHMgPSB0aGlzLl9jdXJyTWlzc2lvbi5jb25kO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29uZCA9IGNvbmRzW2ldO1xuICAgICAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICBzd2l0Y2ggKGNvbmQuY29uZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIENvbmRUeXBlLlRPVEFMX01PTl9LSUxMOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2lsbE51bSA8IGNvbmQubnVtKSBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDb25kVHlwZS5DT05GSUdfQ1VTVE9NOlxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBzaG93UmVzdWx0RmFjZTogZnVuY3Rpb24gc2hvd1Jlc3VsdEZhY2Uoc3VjY2Vzcykge30sXG5cbiAgICBwbGF5RWZmZWN0OiBmdW5jdGlvbiBwbGF5RWZmZWN0KGlkLCBsYXllciwgcG9zLCBmbGlwLCBrZWVwKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvZWZmZWN0L1wiICsgaWQsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbm9kZS54ID0gcG9zLng7XG4gICAgICAgICAgICBub2RlLnkgPSBwb3MueTtcbiAgICAgICAgICAgIGlmIChmbGlwKSBub2RlLnNjYWxlWCA9IC0xO1xuICAgICAgICAgICAgaWYgKGtlZXApIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9rZWVwRWZmZWN0cy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gbm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24ub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX21hcC5hZGRFZmZlY3Qobm9kZSwgbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YwNzM1SFBTclpHYTYrTVBNaGt2d2J1JywgJ2Jvb3RfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYm9vdF9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldJTjMyKSB7XG4gICAgICAgICAgICBjYy52aWV3LnNldEZyYW1lU2l6ZSgxMTM2LCA2NDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvYWRlZFNjZW5lID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmIChHbG9iYWwuaW5pdHRlZCAmJiAhdGhpcy5fbG9hZGVkU2NlbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRlZFNjZW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZShcImxvYWRpbmdcIik7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJiY2MwM2VZKzFOM1ptMUFhWHBaaVpVJywgJ2J1ZmZlcl90YWJsZScpO1xuLy8gc2NyaXB0XFx1dGlsXFxidWZmZXJfdGFibGUuanNcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9pZHggPSAtMTtcbiAgICAgICAgdGhpcy5fZnJlZUlkeCA9IFtdO1xuICAgICAgICB0aGlzLl90YWJsZSA9IFtdO1xuICAgIH0sXG5cbiAgICBhbGxvY0luZGV4OiBmdW5jdGlvbiBhbGxvY0luZGV4KCkge1xuICAgICAgICB2YXIgcmV0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX2ZyZWVJZHgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5fZnJlZUlkeC5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkeCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGluc2VydDogZnVuY3Rpb24gaW5zZXJ0KG9iaikge1xuICAgICAgICB2YXIgaWR4ID0gdGhpcy5hbGxvY0luZGV4KCk7XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fdGFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZHggPSB0aGlzLl90YWJsZS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLl90YWJsZS5wdXNoKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVtpZHhdID0gb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgfSxcblxuICAgIHJlbW92ZUJ5SW5kZXg6IGZ1bmN0aW9uIHJlbW92ZUJ5SW5kZXgoaWR4KSB7XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fdGFibGUubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuX3RhYmxlW2lkeF07XG4gICAgICAgIHRoaXMuX3RhYmxlW2lkeF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9mcmVlSWR4LnB1c2goaWR4KTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9LFxuXG4gICAgcmVtb3ZlQnlPYmplY3Q6IGZ1bmN0aW9uIHJlbW92ZUJ5T2JqZWN0KG9iaikge1xuICAgICAgICBpZiAob2JqID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlW2ldID09IG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUJ5SW5kZXgoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIGdldE9iamVjdDogZnVuY3Rpb24gZ2V0T2JqZWN0KGlkeCkge1xuICAgICAgICBpZiAoaWR4ID49IHRoaXMuX3RhYmxlLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZVtpZHhdO1xuICAgIH0sXG5cbiAgICBlYWNoOiBmdW5jdGlvbiBlYWNoKGZ1bmMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RhYmxlW2ldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhpLCB0aGlzLl90YWJsZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmQ0NTI2cEszOUVkN3RRUVV6Y2VlUUgnLCAnY29pbl9ub3RfZW5vdWdoJyk7XG4vLyBzY3JpcHRcXHVpXFxjb2luX25vdF9lbm91Z2guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwgPSB0aGlzLmdldENvbXBvbmVudCgndWlfY3RybCcpO1xuICAgIH0sXG5cbiAgICBvbkV4Y2hhbmdlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRXhjaGFuZ2VCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgICAgICB0aGlzLl91aUN0cmwubWFuYWdlci5vcGVuVUkoJ2V4Y2hhbmdlX2NvaW4nKTtcbiAgICB9LFxuXG4gICAgb25DYW5jZWxCdXR0b25DbGljazogZnVuY3Rpb24gb25DYW5jZWxCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzMxZTQyaGw1UnhFbUpnQTJGUnJmbm8xJywgJ2NvbnRyb2xfZGVmaW5lJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGNvbnRyb2xfZGVmaW5lLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENvbnRyb2xLZXk6IHtcbiAgICAgICAgTk9ORTogMCxcbiAgICAgICAgVVA6IDEsXG4gICAgICAgIERPV046IDIsXG4gICAgICAgIExFRlQ6IDMsXG4gICAgICAgIFJJR0hUOiA0LFxuICAgICAgICBKVU1QOiA1LFxuICAgICAgICBISVQ6IDYsXG4gICAgICAgIFNLSUxMMTogNyxcbiAgICAgICAgU0tJTEwyOiA4LFxuICAgICAgICBTS0lMTDM6IDksXG4gICAgICAgIFNLSUxMNDogMTAsXG4gICAgICAgIFNLSUxMNTogMTEsXG4gICAgICAgIFNLSUxMNjogMTJcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDM3MzNVcUFXQkFySXVPbjJHWkdmVGMnLCAnZW4nKTtcbi8vIHNjcmlwdFxcaTE4blxcZGF0YVxcZW4uanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJHV19HQU1FXCI6IFwiR1cgR2FtZVwiXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzc3YTVZZDN5SkdPcFhLbE5qUzBvVzMnLCAnZXhjaGFuZ2VfY29pbicpO1xuLy8gc2NyaXB0XFx1aVxcZXhjaGFuZ2VfY29pbi5qc1xuXG52YXIgZXhjaGFuZ2VQb2ludHMgPSBbMSwgNiwgMzgsIDk4LCA1ODgsIDE2ODhdO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdvbGRMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIG93bkxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgcmF0ZUxhYmVsOiBjYy5MYWJlbCxcbiAgICAgICAgaXRlbUNvbnRlbnQ6IGNjLk5vZGUsXG4gICAgICAgIGl0ZW1QcmVmYWI6IGNjLlByZWZhYlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VSYXRlID0gR2xvYmFsLmFjY291bnRNb2R1bGUuZXhjaGFuZ2VSYXRlO1xuICAgICAgICB0aGlzLl9vd25Qb2ludCA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLnNjb3JlTnVtO1xuXG4gICAgICAgIHRoaXMucmF0ZUxhYmVsLnN0cmluZyA9IGNjLmpzLmZvcm1hdFN0cihHYW1lTGFuZy50KCdleGNoYW5nZV9mb3JtYXQnKSwgMSwgdGhpcy5fZXhjaGFuZ2VSYXRlKTtcbiAgICAgICAgdGhpcy5vd25MYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnb3duX3BvaW50X2Zvcm1hdCcpLCB0aGlzLl9vd25Qb2ludCk7XG4gICAgICAgIHRoaXMuZ29sZExhYmVsLnN0cmluZyA9IGNjLmpzLmZvcm1hdFN0cihHYW1lTGFuZy50KCdvd25fZ29sZF9udW1fZm9ybWF0XzInKSwgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSk7XG5cbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9FWENIQU5HRV9HT0xELCB0aGlzLm9uRXhjaGFuZ2VTdWNjZXNzLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2V4Y2hhbmdlSGFuZGxlcik7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleGNoYW5nZVBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLml0ZW1QcmVmYWIpO1xuXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpO1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gZXhjaGFuZ2VQb2ludHNbaV07XG4gICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnZXhjaGFuZ2VfZm9ybWF0JyksIHBvaW50LCBwb2ludCAqIHRoaXMuX2V4Y2hhbmdlUmF0ZSk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b24gPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuQnV0dG9uKTtcbiAgICAgICAgICAgIHZhciBldmVudEhhbmRsZXIgPSBuZXcgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcigpO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIuY29tcG9uZW50ID0gXCJleGNoYW5nZV9jb2luXCI7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIuaGFuZGxlciA9IFwib25JdGVtRXhjaGFuZ2VCdXR0b25DbGlja1wiO1xuICAgICAgICAgICAgYnV0dG9uLm5vZGUudGFnID0gaTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGlja0V2ZW50cy5wdXNoKGV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5pdGVtQ29udGVudDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkV4Y2hhbmdlU3VjY2VzczogZnVuY3Rpb24gb25FeGNoYW5nZVN1Y2Nlc3MoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIG9uSXRlbUV4Y2hhbmdlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uSXRlbUV4Y2hhbmdlQnV0dG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIHBvaW50ID0gZXhjaGFuZ2VQb2ludHNbdGFyZ2V0LnRhZ107XG4gICAgICAgIHZhciBjb2luID0gcG9pbnQgKiB0aGlzLl9leGNoYW5nZVJhdGU7XG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgbWVzc2FnZTogY2MuanMuZm9ybWF0U3RyKEdhbWVMYW5nLnQoJ2NvbmZpcm1fZXhjaGFuZ2VfY29pbicpLCBwb2ludCwgY29pbiksXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soYnV0dG9uSWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYnV0dG9uSWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmV4Y2hhbmdlR29sZChjb2luKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3VpQ3RybC5tYW5hZ2VyLm9wZW5VSSgnbWVzc2FnZV9ib3gnLCBkYXRhKTtcbiAgICB9LFxuXG4gICAgb25DbG9zZUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNsb3NlQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIEdhbWVVdGlsLnBsYXlCdXR0b25Tb3VuZCgpO1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDFlMjZEbUEwNUpoTFYvV3VEVnVOaUUnLCAnZXhpdF9jb25maXJtX2RpYWxvZycpO1xuLy8gc2NyaXB0XFxjb21tb25cXGV4aXRfY29uZmlybV9kaWFsb2cuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0JhdHRsZSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXROYXRpdmVDdHJsOiBmdW5jdGlvbiBzZXROYXRpdmVDdHJsKG5hdGl2ZUN0cmwpIHtcbiAgICAgICAgdGhpcy5fbmF0aXZlQ3RybCA9IG5hdGl2ZUN0cmw7XG4gICAgfSxcblxuICAgIHNldElzQmF0dGxlOiBmdW5jdGlvbiBzZXRJc0JhdHRsZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9pc0JhdHRsZSA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBvbk9rQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uT2tCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNhbmNlbEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBHYW1lVXRpbC5wbGF5QnV0dG9uU291bmQoKTtcbiAgICAgICAgaWYgKHRoaXMuX2lzQmF0dGxlKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbmF0aXZlQ3RybCkge1xuICAgICAgICAgICAgdGhpcy5fbmF0aXZlQ3RybC5yZW1vdmVFeGl0RGlhbG9nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NDcwNmxpMVo5TVdZRFZKcE1jeElWQycsICdmbG9hdF9tZXNzYWdlX2N0cmwnKTtcbi8vIHNjcmlwdFxcdWlcXGZsb2F0X21lc3NhZ2VfY3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgZmxvYXRNZXNzYWdlQ29udGFpbmVyOiBjYy5Ob2RlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwgdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fbWVzc2FnZUhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9tZXNzYWdlSGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uTWVzc2FnZTogZnVuY3Rpb24gb25NZXNzYWdlKGV2ZW50VHlwZSwgbWVzc2FnZSkge1xuICAgICAgICBjYy5sb2cobWVzc2FnZSk7XG4gICAgICAgIHZhciBub2RlID0gbmV3IGNjLk5vZGUoKTtcblxuICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmFkZENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIGxhYmVsLnN0cmluZyA9IG1lc3NhZ2U7XG5cbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TZXF1ZW5jZShuZXcgY2MuU3Bhd24obmV3IGNjLk1vdmVCeSgxLCBuZXcgY2MuVmVjMigwLCAxMDApKSwgbmV3IGNjLkZhZGVPdXQoMSkpLCBuZXcgY2MuQ2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMuZmxvYXRNZXNzYWdlQ29udGFpbmVyO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFkNjhkV0l5R1pGcElzSUlKMVhBRzB0JywgJ2dhbWVfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcZ2FtZV9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGh5c2ljYWxOb2Rlczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5Ob2RlXVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvdW50RG93bkxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIGNvaW5MYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBtYXhQaHlzaWNhbDogNSxcbiAgICAgICAgY2hhcmdlUGh5c2ljYWxUaW1lOiA2MDBcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlciA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoJ3VpX21hbmFnZXInKTtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWxQb2ludHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBoeXNpY2FsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5waHlzaWNhbE5vZGVzW2ldO1xuICAgICAgICAgICAgdGhpcy5fcGh5c2ljYWxQb2ludHMucHVzaChub2RlLmdldENvbXBvbmVudCgncGh5c2ljYWxfcG9pbnQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVDb3VudERvd24oKTtcblxuICAgICAgICB0aGlzLl9waHlzaWNhbCA9IDA7XG4gICAgICAgIHRoaXMudXBkYXRlUGh5c2ljYWwoKTtcblxuICAgICAgICB0aGlzLl9jb3VudHRpbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9vbkNvdW50RG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMub25Db3VudERvd24oKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9zdGFydEhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX1NUQVJUX0dBTUUsIHRoaXMub25TdGFydEdhbWUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2dldEdhbWVEYXRhSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fR0VUX0dBTUVfREFUQSwgdGhpcy5vbkdldEdhbWVEYXRhLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9leGNoYW5nZUhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0VYQ0hBTkdFX0dPTEQsIHRoaXMub25FeGNoYW5nZUNvaW4uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2J1eVBoeXNpY2FsSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fQlVZX1BIWVNJQ0FMLCB0aGlzLm9uQnV5RnVsbFBoeXNpY2FsLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMubG9hZE11c2ljKCk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fc3RhcnRIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2dldEdhbWVEYXRhSGFuZGxlcik7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9leGNoYW5nZUhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fYnV5UGh5c2ljYWxIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fYnV5UGh5c2ljYWxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2V0R2FtZURhdGFIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXhjaGFuZ2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RhcnRIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKHRydWUpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIEdhbWVScGMuQ2x0MlNydi5nZXRHYW1lRGF0YSgpO1xuICAgIH0sXG5cbiAgICByZXNldENvdW50RG93bjogZnVuY3Rpb24gcmVzZXRDb3VudERvd24oKSB7XG4gICAgICAgIHRoaXMuc3RvcENvdW50RG93bigpO1xuICAgICAgICBpZiAodGhpcy5fcGh5c2ljYWwgPCB0aGlzLm1heFBoeXNpY2FsKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50RG93bkxhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDb3VudERvd24oR2xvYmFsLmFjY291bnRNb2R1bGUubmV4dFBvd2VyVGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50RG93bkxhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnRDb3VudERvd246IGZ1bmN0aW9uIHN0YXJ0Q291bnREb3duKHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50dGluZykgcmV0dXJuO1xuICAgICAgICB0aGlzLl9jb3VudHRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lID0gdGltZTtcbiAgICAgICAgdGhpcy51cGRhdGVDb3VudERvd24oKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLl9vbkNvdW50RG93biwgMSk7XG4gICAgfSxcblxuICAgIHN0b3BDb3VudERvd246IGZ1bmN0aW9uIHN0b3BDb3VudERvd24oKSB7XG4gICAgICAgIGlmICghdGhpcy5fY291bnR0aW5nKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2NvdW50dGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fb25Db3VudERvd24pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVDb3VudERvd246IGZ1bmN0aW9uIHVwZGF0ZUNvdW50RG93bigpIHtcbiAgICAgICAgdGhpcy5jb3VudERvd25MYWJlbC5zdHJpbmcgPSBUaW1lVXRpbC5zZWNUb01TKHRoaXMuX2NvdW50RG93blRpbWUpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVQaHlzaWNhbDogZnVuY3Rpb24gdXBkYXRlUGh5c2ljYWwoKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLl9waHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDA7XG4gICAgICAgIGZvciAoOyBpIDwgdGhpcy5tYXhQaHlzaWNhbDsgaSsrKSB0aGlzLl9waHlzaWNhbFBvaW50c1tpXS5zdGF0ZSA9IDE7XG4gICAgfSxcblxuICAgIGNoYXJnZVBoeXNpY2FsOiBmdW5jdGlvbiBjaGFyZ2VQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsID49IHRoaXMubWF4UGh5c2ljYWwpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwrKztcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgIH0sXG5cbiAgICBjb3N0UGh5c2ljYWw6IGZ1bmN0aW9uIGNvc3RQaHlzaWNhbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY2FsIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGh5c2ljYWwtLTtcbiAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNhbCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbG9hZE11c2ljOiBmdW5jdGlvbiBsb2FkTXVzaWMoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJzb3VuZC9nYW1lXCIsIGNjLkF1ZGlvQ2xpcCwgZnVuY3Rpb24gKGVyciwgYXVkaW9DbGlwKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoYXVkaW9DbGlwLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uQWRkQ29pbkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkFkZENvaW5CdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHRoaXMuX3VpTWFuYWdlci5vcGVuVUkoJ2V4Y2hhbmdlX2NvaW4nKTtcbiAgICB9LFxuXG4gICAgb25Db3VudERvd246IGZ1bmN0aW9uIG9uQ291bnREb3duKCkge1xuICAgICAgICB0aGlzLl9jb3VudERvd25UaW1lLS07XG4gICAgICAgIGlmICh0aGlzLl9jb3VudERvd25UaW1lIDwgMCkgdGhpcy5fY291bnREb3duVGltZSA9IDA7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudERvd25UaW1lID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJnZVBoeXNpY2FsKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGh5c2ljYWwgPCB0aGlzLm1heFBoeXNpY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnREb3duVGltZSA9IHRoaXMuY2hhcmdlUGh5c2ljYWxUaW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNvdW50RG93bigpO1xuICAgIH0sXG5cbiAgICBvbkJ1eUZ1bGxQaHlzaWNhbDogZnVuY3Rpb24gb25CdXlGdWxsUGh5c2ljYWwoKSB7XG4gICAgICAgIHRoaXMuY29pbkxhYmVsLnN0cmluZyA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgICAgIHRoaXMuX3BoeXNpY2FsID0gR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXI7XG4gICAgICAgIHRoaXMudXBkYXRlUGh5c2ljYWwoKTtcbiAgICAgICAgdGhpcy5yZXNldENvdW50RG93bigpO1xuICAgIH0sXG5cbiAgICBvbkV4Y2hhbmdlQ29pbjogZnVuY3Rpb24gb25FeGNoYW5nZUNvaW4oKSB7XG4gICAgICAgIHRoaXMuY29pbkxhYmVsLnN0cmluZyA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgfSxcblxuICAgIG9uR2V0R2FtZURhdGE6IGZ1bmN0aW9uIG9uR2V0R2FtZURhdGEoKSB7XG4gICAgICAgIHRoaXMuY29pbkxhYmVsLnN0cmluZyA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgICAgIHRoaXMuX3BoeXNpY2FsID0gR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXI7XG4gICAgICAgIHRoaXMudXBkYXRlUGh5c2ljYWwoKTtcbiAgICAgICAgdGhpcy5yZXNldENvdW50RG93bigpO1xuICAgIH0sXG5cbiAgICBvblN0YXJ0R2FtZTogZnVuY3Rpb24gb25TdGFydEdhbWUoKSB7XG4gICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnYmF0dGxlJyk7XG4gICAgfSxcblxuICAgIG9uUGxheUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblBsYXlCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIGlmICh0aGlzLmNvc3RQaHlzaWNhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BDb3VudERvd24oKTtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5zdGFydEdhbWUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3VpTWFuYWdlci5vcGVuVUkoJ3BoeXNpY2FsX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3MDg2MGF0YkJWRlM2eEg3SUZhTlRKMycsICdnYW1lX2V2ZW50X2Rpc3BhdGNoZXInKTtcbi8vIHNjcmlwdFxcZXZlbnRcXGdhbWVfZXZlbnRfZGlzcGF0Y2hlci5qc1xuXG5tb2R1bGUuZXhwb3J0c1snY2xhc3MnXSA9IGNjLkNsYXNzKHtcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIGN0b3I6IGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbiBlbWl0KGV2ZW50VHlwZSwgZGF0YSkge1xuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnRUeXBlXTtcbiAgICAgICAgaWYgKGhhbmRsZXJzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIGhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNba10oZXZlbnRUeXBlLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIGFkZEV2ZW50SGFuZGxlcihldmVudFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV07XG4gICAgICAgIGlmIChoYW5kbGVycykge1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyc1trXSA9PSBoYW5kbGVyKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICBoYW5kbGVycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBoYW5kbGVycztcbiAgICAgICAgfVxuXG4gICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHsgdHlwZTogZXZlbnRUeXBlLCBpZDogaGFuZGxlcnMubGVuZ3RoIC0gMSB9O1xuICAgIH0sXG5cbiAgICByZW1vdmVFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIHJlbW92ZUV2ZW50SGFuZGxlcihlbml0eSkge1xuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9saXN0ZW5lcnNbZW5pdHkudHlwZV07XG4gICAgICAgIGlmIChoYW5kbGVycyAmJiBlbml0eS5pZCA+PSAwICYmIGVuaXR5LmlkIDwgaGFuZGxlcnMubGVuZ3RoKSBoYW5kbGVycy5zcGxpY2UoZW5pdHkuaWQsIDEpO1xuICAgIH0sXG5cbiAgICByZW1vdmVBbGxFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIHJlbW92ZUFsbEV2ZW50SGFuZGxlcihldmVudFR5cGUpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBudWxsO1xuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYWNkZDd6TXNwQlBJN2NMVzM5M1o3V2EnLCAnZ2FtZV9ldmVudCcpO1xuLy8gc2NyaXB0XFxldmVudFxcZ2FtZV9ldmVudC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBPTl9IVFRQX1JFUVVFU1Q6IDB4MDAwMDAwMDEsXG4gICAgT05fSFRUUF9SRVNQT05EOiAweDAwMDAwMDAyLFxuICAgIE9OX05FVFdPUktfRVJST1I6IDB4MDAwMDAwMDMsXG5cbiAgICBPTl9MT0dJTl9SRVNVTFQ6IDB4MDAwMTAwMDEsXG4gICAgT05fR0VUX0dBTUVfREFUQTogMHgwMDAxMDAwMixcbiAgICBPTl9FWENIQU5HRV9HT0xEOiAweDAwMDEwMDAzLFxuICAgIE9OX1NUQVJUX0dBTUU6IDB4MDAwMTAwMDQsXG4gICAgT05fQlVZX1BIWVNJQ0FMOiAweDAwMDEwMDA1LFxuICAgIE9OX0JVWV9USU1FX1RPX1BMQVk6IDB4MDAwMTAwMDYsXG4gICAgT05fR0FNRV9SRVNVTFQ6IDB4MDAwMTAwMDcsXG4gICAgT05fTE9HSU5fVElNRV9PVVQ6IDB4MDAwMTAwMDgsXG5cbiAgICBPTl9SRVRVUk5fR0FNRTogMHgwMDAyMDAwMixcblxuICAgIE9OX0ZMT0FUX01FU1NBR0U6IDB4MDAwMzAwMDFcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxNmZmY0p6SXF0RVZvSWFORHl2bWxQaicsICdnYW1lX25ldCcpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxnYW1lX25ldC5qc1xuXG52YXIgSHR0cENvbm5lY3Rpb24gPSByZXF1aXJlKCdodHRwX2Nvbm5lY3Rpb24nKVsnY2xhc3MnXTtcbnZhciBIdHRwVXRpbCA9IHJlcXVpcmUoJ2h0dHBfdXRpbCcpO1xudmFyIEdhbWVQcm90b2NvbCA9IHJlcXVpcmUoJ2dhbWVfcHJvdG9jb2wnKTtcblxubW9kdWxlLmV4cG9ydHNbJ2NsYXNzJ10gPSBjYy5DbGFzcyh7XG5cbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9odHRwUmVhdWVzdEluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9odHRwSGFuZGxlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5faHR0cENvbm5lY3Rpb24gPSBuZXcgSHR0cENvbm5lY3Rpb24oKTtcbiAgICAgICAgdGhpcy5faHR0cENvbm5lY3Rpb24uc2V0Q2lwaGVyQ29kZSgnZndlXiomM2lqY2RoZjQ1NTQzJyk7XG4gICAgICAgIHRoaXMuX2h0dHBDb25uZWN0aW9uLnNldFJlc3BvbmRDYWxsYmFjayh0aGlzLmh0dHBSZXNwb25kLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZXRyeUh0dHBSZXF1ZXN0OiBmdW5jdGlvbiByZXRyeUh0dHBSZXF1ZXN0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2h0dHBSZWF1ZXN0SW5mbykgcmV0dXJuO1xuICAgICAgICB0aGlzLmh0dHBSZXF1ZXN0KHRoaXMuX2h0dHBSZWF1ZXN0SW5mby5kYXRhLCB0aGlzLl9odHRwUmVhdWVzdEluZm8uY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBodHRwUmVxdWVzdDogZnVuY3Rpb24gaHR0cFJlcXVlc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fSFRUUF9SRVFVRVNUKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJvdG9jb2xJZCA9IGRhdGEuZ2FtZU1zZ0lkO1xuICAgICAgICB2YXIgdXJsID0gR2FtZVByb3RvY29sLlVSTHNbcHJvdG9jb2xJZF07XG4gICAgICAgIHRoaXMuYWRkSHR0cFJlc3BvbmRMaXN0ZW5lcihwcm90b2NvbElkLCBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVIdHRwUmVzcG9uZExpc3RlbmVyKHByb3RvY29sSWQpO1xuICAgICAgICAgICAgc2VsZi5faHR0cFJlYXVlc3RJbmZvID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2soanNvbik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9odHRwUmVhdWVzdEluZm8gPSB7IGRhdGE6IGRhdGEsIGNhbGxiYWNrOiBjYWxsYmFjayB9O1xuICAgICAgICB0aGlzLl9odHRwQ29ubmVjdGlvbi5yZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfSxcblxuICAgIGh0dHBSZXNwb25kOiBmdW5jdGlvbiBodHRwUmVzcG9uZChzdGF0cywganNvbikge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9IVFRQX1JFU1BPTkQpO1xuICAgICAgICBpZiAoc3RhdHMgPT0gSHR0cFV0aWwuU3RhdHMuT0spIHtcbiAgICAgICAgICAgIGNjLmxvZygnZ2FtZSBuZXQgY29kZScsIGpzb24uY29kZSk7XG4gICAgICAgICAgICBpZiAoanNvbi5jb2RlID09PSA2KSB7XG4gICAgICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fTE9HSU5fVElNRV9PVVQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlSHR0cFJlc3BvbmRMaXN0ZW5lcih0aGlzLl9odHRwUmVhdWVzdEluZm8uZGF0YS5nYW1lTXNnSWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IHRoaXMuX2h0dHBIYW5kbGVyc1tqc29uLmRhdGEuZ2FtZU1zZ0lkXTtcbiAgICAgICAgICAgICAgICBoYW5kbGVyICYmIGhhbmRsZXIoanNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9ORVRXT1JLX0VSUk9SKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSHR0cFJlc3BvbmRMaXN0ZW5lcih0aGlzLl9odHRwUmVhdWVzdEluZm8uZGF0YS5nYW1lTXNnSWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkZEh0dHBSZXNwb25kTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZEh0dHBSZXNwb25kTGlzdGVuZXIocHJvdG9jb2xJZCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLl9odHRwSGFuZGxlcnNbcHJvdG9jb2xJZF0gPSBoYW5kbGVyO1xuICAgIH0sXG5cbiAgICByZW1vdmVIdHRwUmVzcG9uZExpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVIdHRwUmVzcG9uZExpc3RlbmVyKHByb3RvY29sSWQsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5faHR0cEhhbmRsZXJzW3Byb3RvY29sSWRdID0gbnVsbDtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZmNmN2MzWURQSkp0cmw1alpqU2MzclAnLCAnZ2FtZV9wcm90b2NvbCcpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxnYW1lX3Byb3RvY29sLmpzXG5cbnZhciBfVVJMcztcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIFByb3RvY29sID0ge1xuICAgIExPR0lOOiAxLFxuICAgIEdFVF9EQVRBOiAyLFxuICAgIEVYQ0hBTkdFX0dPTEQ6IDMsXG4gICAgU1RBUlRfR0FNRTogNCxcbiAgICBGVUxMX1BPV0VSOiA1LFxuICAgIENPTlRJTlVFX0dBTUU6IDYsXG4gICAgUkVTVUxUX0dBTUU6IDdcbn07XG5tb2R1bGUuZXhwb3J0cy5Qcm90b2NvbCA9IFByb3RvY29sO1xuXG52YXIgVVJMcyA9IChfVVJMcyA9IHt9LCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLkxPR0lOLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vaW5kZXgvbG9naW5cIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuR0VUX0RBVEEsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9EYWx1YW5kb3UvaW5kZXg/dHlwZT1nZXRHYW1lRGF0YVwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5FWENIQU5HRV9HT0xELCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vaW5kZXgvZXhjaGFuZ2VcIiksIF9kZWZpbmVQcm9wZXJ0eShfVVJMcywgUHJvdG9jb2wuU1RBUlRfR0FNRSwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL0RhbHVhbmRvdS9pbmRleD90eXBlPXN0YXJ0R2FtZVwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5GVUxMX1BPV0VSLCBcImh0dHA6Ly95b3V4aS5lZ2F0ZXdhbmcuY24vRGFsdWFuZG91L2luZGV4P3R5cGU9YnV5RnVsbFBvd2VyXCIpLCBfZGVmaW5lUHJvcGVydHkoX1VSTHMsIFByb3RvY29sLkNPTlRJTlVFX0dBTUUsIFwiaHR0cDovL3lvdXhpLmVnYXRld2FuZy5jbi9EYWx1YW5kb3UvaW5kZXg/dHlwZT1idXlUaW1lVG9QbGF5R2FtZVwiKSwgX2RlZmluZVByb3BlcnR5KF9VUkxzLCBQcm90b2NvbC5SRVNVTFRfR0FNRSwgXCJodHRwOi8veW91eGkuZWdhdGV3YW5nLmNuL0RhbHVhbmRvdS9pbmRleD90eXBlPWdhbWVSZXN1bHRcIiksIF9VUkxzKTtcbm1vZHVsZS5leHBvcnRzLlVSTHMgPSBVUkxzO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjA3N2VoSlBPQkQzS2RWeHMzdGxiMUknLCAnZ2FtZV9ycGMnKTtcbi8vIHNjcmlwdFxcbmV0d29ya1xcZ2FtZV9ycGMuanNcblxudmFyIEdhbWVQcm90b2NvbCA9IHJlcXVpcmUoXCJnYW1lX3Byb3RvY29sXCIpO1xuXG52YXIgU3J2MkNsdCA9IHtcbiAgICByZXRMb2dpbjogZnVuY3Rpb24gcmV0TG9naW4oanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRMb2dpbjpcIiArIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIGlmIChqc29uLmNvZGUgPT09IDEpIEdsb2JhbC5sb2dpbk1vZHVsZS50b2tlbiA9IGpzb24uZGF0YS50b2tlbjtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fTE9HSU5fUkVTVUxULCBqc29uKTtcbiAgICB9LFxuXG4gICAgcmV0R2V0R2FtZURhdGE6IGZ1bmN0aW9uIHJldEdldEdhbWVEYXRhKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0R2V0R2FtZURhdGE6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5pc1ZpcCA9IGpzb24uZGF0YS5pc1ZJUDtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW0gPSBqc29uLmRhdGEuZ29sZE51bTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLnNjb3JlTnVtID0ganNvbi5kYXRhLnNjb3JlTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubmlja05hbWUgPSBqc29uLmRhdGEubmlrZW5hbWU7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5pc0ZpcnN0TG9naW4gPSBqc29uLmRhdGEuaXNGaXJzdDtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLm1heFNjb3JlID0ganNvbi5kYXRhLm1heFNjb3JlO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXIgPSBqc29uLmRhdGEucG93ZXI7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lID0ganNvbi5kYXRhLm5leHRQb3dlclRpbWU7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5leGNoYW5nZVJhdGUgPSBqc29uLmRhdGEub25lSW50ZWdyYWxHb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fR0VUX0dBTUVfREFUQSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0RXhjaGFuZ2VHb2xkOiBmdW5jdGlvbiByZXRFeGNoYW5nZUdvbGQoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRFeGNoYW5nZUdvbGQ6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtID0ganNvbi5kYXRhLmdvbGROdW07XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5zY29yZU51bSA9IGpzb24uZGF0YS5zY29yZU51bTtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0VYQ0hBTkdFX0dPTEQpO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwgR2FtZUxhbmcudCgnZXhjaGFuZ2Vfc3VjY2VzcycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX0ZMT0FUX01FU1NBR0UsIGpzb24uZGF0YS5lcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmV0U3RhcnRHYW1lOiBmdW5jdGlvbiByZXRTdGFydEdhbWUoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRTdGFydEdhbWU6XCIgKyBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICBpZiAoanNvbi5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5tYXhTY29yZSA9IGpzb24uZGF0YS5tYXhTY29yZTtcbiAgICAgICAgICAgIEdsb2JhbC5hY2NvdW50TW9kdWxlLnBvd2VyID0ganNvbi5kYXRhLnBvd2VyO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubmV4dFBvd2VyVGltZSA9IGpzb24uZGF0YS5uZXh0UG93ZXJUaW1lO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fU1RBUlRfR0FNRSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldEJ1eUZ1bGxQaHlzaWNhbDogZnVuY3Rpb24gcmV0QnV5RnVsbFBoeXNpY2FsKGpzb24pIHtcbiAgICAgICAgY2MubG9nKFwicmV0QnV5RnVsbFBoeXNpY2FsOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA9IGpzb24uZGF0YS5nb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUucG93ZXIgPSBqc29uLmRhdGEucG93ZXI7XG4gICAgICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5uZXh0UG93ZXJUaW1lID0ganNvbi5kYXRhLm5leHRQb3dlclRpbWU7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9CVVlfUEhZU0lDQUwpO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fRkxPQVRfTUVTU0FHRSwgR2FtZUxhbmcudCgnYnV5X3BoeXNpY2FsX3N1Y2Nlc3MnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldEJ1eVRpbWVUb1BsYXlHYW1lOiBmdW5jdGlvbiByZXRCdXlUaW1lVG9QbGF5R2FtZShqc29uKSB7XG4gICAgICAgIGNjLmxvZyhcInJldEJ1eVRpbWVUb1BsYXlHYW1lOlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA9IGpzb24uZGF0YS5nb2xkTnVtO1xuICAgICAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuZW1pdChHYW1lRXZlbnQuT05fQlVZX1RJTUVfVE9fUExBWSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldEdhbWVSZXN1bHQ6IGZ1bmN0aW9uIHJldEdhbWVSZXN1bHQoanNvbikge1xuICAgICAgICBjYy5sb2coXCJyZXRHYW1lUmVzdWx0OlwiICsganNvbi5kYXRhLmVycm9yTXNnKTtcbiAgICAgICAgaWYgKGpzb24uY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgR2xvYmFsLmFjY291bnRNb2R1bGUubWF4U2NvcmUgPSBqc29uLmRhdGEubWF4U2NvcmU7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9HQU1FX1JFU1VMVCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5lbWl0KEdhbWVFdmVudC5PTl9GTE9BVF9NRVNTQUdFLCBqc29uLmRhdGEuZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzLlNydjJDbHQgPSBTcnYyQ2x0O1xuXG52YXIgQ2x0MlNydiA9IHtcbiAgICBsb2dpbjogZnVuY3Rpb24gbG9naW4oYWNjb3VudCwgcGFzc3dkKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkxPR0lOLFxuICAgICAgICAgICAgYWNjb3VudDogYWNjb3VudCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd2RcbiAgICAgICAgfSwgU3J2MkNsdC5yZXRMb2dpbik7XG4gICAgfSxcblxuICAgIGdldEdhbWVEYXRhOiBmdW5jdGlvbiBnZXRHYW1lRGF0YSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuR0VUX0RBVEEsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuXG4gICAgICAgIH0sIFNydjJDbHQucmV0R2V0R2FtZURhdGEpO1xuICAgIH0sXG5cbiAgICBleGNoYW5nZUdvbGQ6IGZ1bmN0aW9uIGV4Y2hhbmdlR29sZChnb2xkKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0Lmh0dHBSZXF1ZXN0KHtcbiAgICAgICAgICAgIHR5cGU6IEdsb2JhbC5nYW1lVHlwZSxcbiAgICAgICAgICAgIGdhbWVNc2dJZDogR2FtZVByb3RvY29sLlByb3RvY29sLkVYQ0hBTkdFX0dPTEQsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuLFxuICAgICAgICAgICAgbmVlZEdvbGQ6IGdvbGRcbiAgICAgICAgfSwgU3J2MkNsdC5yZXRFeGNoYW5nZUdvbGQpO1xuICAgIH0sXG5cbiAgICBzdGFydEdhbWU6IGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuU1RBUlRfR0FNRSxcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW5cbiAgICAgICAgfSwgU3J2MkNsdC5yZXRTdGFydEdhbWUpO1xuICAgIH0sXG5cbiAgICBidXlGdWxsUGh5c2ljYWw6IGZ1bmN0aW9uIGJ1eUZ1bGxQaHlzaWNhbCgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuRlVMTF9QT1dFUixcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW5cbiAgICAgICAgfSwgU3J2MkNsdC5yZXRCdXlGdWxsUGh5c2ljYWwpO1xuICAgIH0sXG5cbiAgICBidXlUaW1lVG9QbGF5R2FtZTogZnVuY3Rpb24gYnV5VGltZVRvUGxheUdhbWUodGltZXMpIHtcbiAgICAgICAgY2MubG9nKCdidXlUaW1lVG9QbGF5R2FtZScsIHRpbWVzKTtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuQ09OVElOVUVfR0FNRSxcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWwubG9naW5Nb2R1bGUudG9rZW4sXG4gICAgICAgICAgICBsZXZlbDogdGltZXNcbiAgICAgICAgfSwgU3J2MkNsdC5yZXRCdXlUaW1lVG9QbGF5R2FtZSk7XG4gICAgfSxcblxuICAgIGdhbWVSZXN1bHQ6IGZ1bmN0aW9uIGdhbWVSZXN1bHQoc2NvcmUpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVOZXQuaHR0cFJlcXVlc3Qoe1xuICAgICAgICAgICAgdHlwZTogR2xvYmFsLmdhbWVUeXBlLFxuICAgICAgICAgICAgZ2FtZU1zZ0lkOiBHYW1lUHJvdG9jb2wuUHJvdG9jb2wuUkVTVUxUX0dBTUUsXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFsLmxvZ2luTW9kdWxlLnRva2VuLFxuICAgICAgICAgICAgc2NvcmU6IHNjb3JlXG4gICAgICAgIH0sIFNydjJDbHQucmV0R2FtZVJlc3VsdCk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzLkNsdDJTcnYgPSBDbHQyU3J2O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTAzMTZDRFJ3dExWN2NZRlFRMENYTFEnLCAnZ2FtZV91dGlsJyk7XG4vLyBzY3JpcHRcXHV0aWxcXGdhbWVfdXRpbC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGxvYWRTY2VuZTogZnVuY3Rpb24gbG9hZFNjZW5lKG5hbWUpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKG5hbWUpO1xuICAgICAgICAvKmNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShuYW1lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShuYW1lKTtcclxuICAgICAgICB9KTsqL1xuICAgIH0sXG5cbiAgICBwbGF5QnV0dG9uU291bmQ6IGZ1bmN0aW9uIHBsYXlCdXR0b25Tb3VuZCgpIHtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJzb3VuZC9idXR0b25fY2xpY2tcIiwgY2MuQXVkaW9DbGlwLCBmdW5jdGlvbiAoZXJyLCBhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QoYXVkaW9DbGlwLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI1ZTIycVhoSlpHQ0tqVVlOWVAva0hYJywgJ2d1aWRlX2RlZmluZScpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxndWlkZV9kZWZpbmUuanNcblxubW9kdWxlLmV4cG9ydHMuR3VpZGVTdGVwID0ge1xuICAgIE5PTkU6IDAsXG4gICAgTU9WRTogMSxcbiAgICBUT1VDSDogMixcbiAgICBFTlRFUl9UUkFOU19ET09SOiAzXG59O1xuXG5tb2R1bGUuZXhwb3J0cy5HdWlkZU1hc2sgPSB7XG4gICAgTU9WRTogMHgwMDAxLFxuICAgIEhJVDogMHgwMDAyLFxuICAgIFRSQU5TX0RPT1JfQVJST1c6IDB4MDAwNFxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E4NDBkSWZkZ2hDODVaYkRQQ1dpMU0zJywgJ2h0dHBfY29ubmVjdGlvbicpO1xuLy8gc2NyaXB0XFxuZXR3b3JrXFxjb25uZWN0aW9uXFxodHRwX2Nvbm5lY3Rpb24uanNcblxudmFyIEh0dHBVdGlsID0gcmVxdWlyZShcImh0dHBfdXRpbFwiKTtcbnZhciBYWFRFQSA9IHJlcXVpcmUoXCJ4eHRlYVwiKTtcblxubW9kdWxlLmV4cG9ydHNbXCJjbGFzc1wiXSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yOiBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9jaXBoZXJDb2RlID0gJ3ExdzJlM3I0dDV5NnU3aThvOXAwJztcbiAgICAgICAgdGhpcy5fcmVzcG9uZENhbGxiYWNrID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc2V0Q2lwaGVyQ29kZTogZnVuY3Rpb24gc2V0Q2lwaGVyQ29kZShjb2RlKSB7XG4gICAgICAgIHRoaXMuX2NpcGhlckNvZGUgPSBjb2RlO1xuICAgIH0sXG5cbiAgICBzZXRSZXNwb25kQ2FsbGJhY2s6IGZ1bmN0aW9uIHNldFJlc3BvbmRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLl9yZXNwb25kQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9LFxuXG4gICAgcmVxdWVzdDogZnVuY3Rpb24gcmVxdWVzdCh1cmwsIGRhdGEpIHtcbiAgICAgICAgdmFyIGpzb24gPSBYWFRFQS51dGYxNnRvOChKU09OLnN0cmluZ2lmeShkYXRhKS50cmltKCkpO1xuICAgICAgICB2YXIgZW5jcnlwdCA9IFhYVEVBLmVuY3J5cHQoanNvbiwgdGhpcy5fY2lwaGVyQ29kZSk7XG4gICAgICAgIHZhciBlbmNvZGUgPSBYWFRFQS5iYXNlNjRlbmNvZGUoZW5jcnlwdCk7XG4gICAgICAgIGVuY29kZSA9IGVuY29kZS5yZXBsYWNlKC9cXCsvZywgJyUyQicpO1xuICAgICAgICBIdHRwVXRpbC5yZXF1ZXN0KHVybCwgSHR0cFV0aWwuTWV0aG9kLlBPU1QsIHsgbXNnRGF0YTogZW5jb2RlIH0sIHRoaXMucmVzcG9uZC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcmVzcG9uZDogZnVuY3Rpb24gcmVzcG9uZChzdGF0cywgcmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc3BvbmRDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHN0YXRzID09IEh0dHBVdGlsLlN0YXRzLk9LKSB7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb2RlID0gWFhURUEuYmFzZTY0ZGVjb2RlKGpzb24ubXNnRGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIGRlY3J5cHQgPSBYWFRFQS5kZWNyeXB0KGRlY29kZSwgdGhpcy5fY2lwaGVyQ29kZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBKU09OLnBhcnNlKGRlY3J5cHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3BvbmRDYWxsYmFjayhzdGF0cywgeyBjb2RlOiBqc29uLlJlc3VsdENvZGUsIGRhdGE6IGNvbnRlbnQgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRzID09IEh0dHBVdGlsLlN0YXRzLkZBSUwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25kQ2FsbGJhY2soc3RhdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NDJjYzlpdUY5UG9yTjNjbEluSFg0TCcsICdodHRwX3V0aWwnKTtcbi8vIHNjcmlwdFxcbGliXFx1dGlsXFxodHRwX3V0aWwuanNcblxudmFyIE1ldGhvZCA9IHtcbiAgICBHRVQ6ICdHRVQnLFxuICAgIFBPU1Q6ICdQT1NUJ1xufTtcblxudmFyIFN0YXRzID0ge1xuICAgIE9LOiAwLFxuICAgIEZBSUw6IDFcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1ldGhvZCA9IE1ldGhvZDtcblxubW9kdWxlLmV4cG9ydHMuU3RhdHMgPSBTdGF0cztcblxubW9kdWxlLmV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgYXJncywgY2FsbGJhY2spIHtcbiAgICB2YXIgc3VjY2VzcyA9IHRydWU7XG5cbiAgICB2YXIgeGhyID0gY2MubG9hZGVyLmdldFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MubG9nKCdvbnJlYWR5c3RhdGVjaGFuZ2UnKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFN0YXRzLk9LLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFN0YXRzLkZBSUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICB2YXIgYXJnU3RyaW5nID0gJyc7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZ3MpIHtcbiAgICAgICAgaWYgKGlzRmlyc3QpIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyArPSBrZXkgKyBcIj1cIiArIGFyZ3Nba2V5XTtcbiAgICAgICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ1N0cmluZyArPSAnJicgKyBrZXkgKyAnPScgKyBhcmdzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09PSBNZXRob2QuR0VUKSB7XG4gICAgICAgIGlmIChhcmdTdHJpbmcubGVuZ3RoID09PSAwKSB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7ZWxzZSB4aHIub3BlbihtZXRob2QsIHVybCArIGFyZ1N0cmluZywgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09IE1ldGhvZC5QT1NUKSB7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKGNjLnN5cy5pc05hdGl2ZSkgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHQtRW5jb2RpbmdcIiwgXCJnemlwLCBkZWZsYXRlXCIpO1xuXG4gICAgWydsb2Fkc3RhcnQnLCAnYWJvcnQnLCAnZXJyb3InLCAnbG9hZCcsICdsb2FkZW5kJywgJ3RpbWVvdXQnXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudG5hbWUpIHtcbiAgICAgICAgeGhyW1wib25cIiArIGV2ZW50bmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJcXG5FdmVudCA6IFwiICsgZXZlbnRuYW1lKTtcbiAgICAgICAgICAgIGlmIChldmVudG5hbWUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50bmFtZSA9PT0gJ2xvYWRlbmQnICYmICFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soU3RhdHMuRkFJTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpZiAobWV0aG9kID09PSBNZXRob2QuR0VUKSB7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09IE1ldGhvZC5QT1NUKSB7XG4gICAgICAgIHhoci5zZW5kKGFyZ1N0cmluZyk7XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M0YTdlSUFvZ2hNUkpRV1lyWUpLTE81JywgJ2h1cmRsZV9jZmcnKTtcbi8vIHNjcmlwdFxcY29uZmlnXFxkYXRhXFxodXJkbGVfY2ZnLmpzXG5cbi8qXHJcbuivtOaYjlxyXG4gICAgY21kVHlwZe+8iOaMh+S7pOexu+Wei++8iVxyXG4gICAgICAgIDHvvJpjb250cm9sZW5hYmxlZFxyXG4gICAgICAgIDLvvJrplIHlrprljLrln59cclxuICAgICAgICAz77ya5Yi35oCqIGlk77yI5oCq54mpaWTvvIkgcG9z77yI5Yi35oCq5Z2Q5qCH77yJZGly77yI5pa55ZCRIC0x5bemIDHlj7PvvIlcclxuICAgICAgICA077ya5byA5aeLXHJcbiAgICAgICAgNTogZ29nb2dvXHJcblxyXG4gICAgY29uZFR5cGXvvIjlrozmiJDmnaHku7bvvIlcclxuICAgICAgICAx77ya5p2A5oCq5pWwIG51be+8iOadgOaAquaVsOmHj++8iVxyXG5cclxuICAgIGV2ZW50XHJcbiAgICAgICAgMTrml7bpl7RcclxuICAgICAgICAy77ya5Zyw5Zu+5Yy65Z+fXHJcbiovXG5cbm1vZHVsZS5leHBvcnRzLmRhdGEgPSBbe1xuICAgIGlkOiAxLFxuICAgIG1hcElkOiAxLFxuICAgIGJvcm5Qb3M6IHsgeDogNDUwLCB5OiAyMzUgfSxcbiAgICBtaXNzaW9uOiBbe1xuICAgICAgICB0cmlnZ2VyczogW3tcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAsXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAxLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgZW5hYmxlZDogZmFsc2UgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZXZlbnQ6IDEsXG4gICAgICAgICAgICBwYXJhbTogMC41LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IHRydWUgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDEsXG4gICAgICAgICAgICAgICAgYXJnczogeyBlbmFibGVkOiB0cnVlIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA4LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHt9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBldmVudDogMixcbiAgICAgICAgICAgIHBhcmFtOiB7IHg6IDgwMCwgeTogMCwgd2lkdGg6IDEyMDAsIGhlaWdodDogNjQwIH0sXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogZmFsc2UgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDE1MDAsIHk6IDI3MCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAxNjAwLCB5OiAxODUgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMTUwMCwgeTogMTAwIH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDksXG4gICAgICAgICAgICAgICAgYXJnczoge31cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgICAgICBjb25kOiBbeyBjb25kVHlwZTogMSwgbnVtOiAzIH1dXG4gICAgfSwge1xuICAgICAgICB0cmlnZ2VyczogW3tcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAsXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAyLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogMCwgeTogMCwgd2lkdGg6IDQwMDAsIGhlaWdodDogNjQwIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogdHJ1ZSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBldmVudDogMixcbiAgICAgICAgICAgIHBhcmFtOiB7IHg6IDI2MDAsIHk6IDAsIHdpZHRoOiAzMDAsIGhlaWdodDogNjQwIH0sXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogZmFsc2UgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAyMDAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDI3MCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAxMDAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMTg1IH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDM2MDAsIHk6IDE4NSB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgICAgICBjb25kOiBbeyBjb25kVHlwZTogMSwgbnVtOiA0IH1dXG4gICAgfSwge1xuICAgICAgICB0cmlnZ2VyczogW3tcbiAgICAgICAgICAgIGV2ZW50OiAxLFxuICAgICAgICAgICAgcGFyYW06IDAsXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAyLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgeDogMjAwMCwgeTogMCwgd2lkdGg6IDQwMDAsIGhlaWdodDogNjQwIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogdHJ1ZSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBldmVudDogMixcbiAgICAgICAgICAgIHBhcmFtOiB7IHg6IDQ2MDAsIHk6IDAsIHdpZHRoOiAzMDAsIGhlaWdodDogNjQwIH0sXG4gICAgICAgICAgICBjb21tYW5kczogW3tcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA1LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgc2hvdzogZmFsc2UgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiA0MDAwLCB5OiAwLCB3aWR0aDogMjAwMCwgaGVpZ2h0OiA2NDAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDI3MCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAxMDAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogMyxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMTg1IH0sIGRpcjogLTEgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDMsXG4gICAgICAgICAgICAgICAgYXJnczogeyBpZDogMSwgcG9zOiB7IHg6IDU0MDAsIHk6IDE2MCB9LCBkaXI6IC0xIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiAzLFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDEsIHBvczogeyB4OiA1NDAwLCB5OiAyMjAgfSwgZGlyOiAtMSB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XSxcbiAgICAgICAgY29uZDogW3sgY29uZFR5cGU6IDEsIG51bTogNSB9XVxuICAgIH0sIHtcbiAgICAgICAgdHJpZ2dlcnM6IFt7XG4gICAgICAgICAgICBldmVudDogMSxcbiAgICAgICAgICAgIHBhcmFtOiAwLFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IHRydWUgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDQsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiA1NTM1LCB5OiAxNzAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGNtZFR5cGU6IDIsXG4gICAgICAgICAgICAgICAgYXJnczogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGV2ZW50OiAyLFxuICAgICAgICAgICAgcGFyYW06IHsgeDogNTQ4MCwgeTogMTIwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMCB9LFxuICAgICAgICAgICAgY29tbWFuZHM6IFt7XG4gICAgICAgICAgICAgICAgY21kVHlwZTogNSxcbiAgICAgICAgICAgICAgICBhcmdzOiB7IHNob3c6IGZhbHNlIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjbWRUeXBlOiA2LFxuICAgICAgICAgICAgICAgIGFyZ3M6IHsgaWQ6IDAgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfV0sXG4gICAgICAgIGNvbmQ6IFt7IGNvbmRUeXBlOiAyIH1dXG4gICAgfV1cbn1dO1xuXG4vKntcclxuICAgIGNtZDogW1xyXG4gICAgICAgIHsgY21kVHlwZTogNCwgdmFsdWU6IGZhbHNlIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAxIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH0sIHRpbWU6IDIsIGNhbWVyYTogZmFsc2UsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiA1LCBwb3M6IHsgeDogMjUwMCwgeTogMTg1fSwgdGltZTogMiwgZGlyOiAxIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAxLCByYW5nZTogeyB4OiAzMDAwLCB5OiAwLCB3aWR0aDogMTAwMCwgaGVpZ2h0OiA2NDAgfSwgdGltZTogMS41LCBjYW1lcmE6IHRydWUsIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDM0MDAsIHk6IDI3MCB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiAzNDAwLCB5OiAxMDAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogMzQwMCwgeTogMTg1IH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDM2MDAsIHk6IDE4NSB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogMjAwMCwgeTogMCwgd2lkdGg6IDIwMDAsIGhlaWdodDogNjQwIH0sIHRpbWU6IDEuNSwgY2FtZXJhOiB0cnVlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogNCwgdmFsdWU6IHRydWUgfSxcclxuICAgIF0sXHJcbiAgICBjb25kOiBbXHJcbiAgICAgICAgeyBjb25kVHlwZTogMSwgbnVtOiA0IH0sXHJcbiAgICBdLFxyXG59LFxyXG57XHJcbiAgICBjbWQ6IFtcclxuICAgICAgICB7IGNtZFR5cGU6IDQsIHZhbHVlOiBmYWxzZSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9LCB0aW1lOiAyLCBjYW1lcmE6IGZhbHNlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogNSwgcG9zOiB7IHg6IDQ1MDAsIHk6IDE4NX0sIHRpbWU6IDIsIGRpcjogMSB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogNTAwMCwgeTogMCwgd2lkdGg6IDEwMDAsIGhlaWdodDogNjQwIH0sIHRpbWU6IDEuNSwgY2FtZXJhOiB0cnVlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiA1MjAwLCB5OiAyNzAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogNTIwMCwgeTogMTAwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAzLCBpZDogMSwgcG9zOiB7IHg6IDUyMDAsIHk6IDE4NSB9LCBkaXI6IC0xICB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMywgaWQ6IDEsIHBvczogeyB4OiA1NDAwLCB5OiAxNjAgfSwgZGlyOiAtMSAgfSxcclxuICAgICAgICB7IGNtZFR5cGU6IDMsIGlkOiAxLCBwb3M6IHsgeDogNTQwMCwgeTogMjIwIH0sIGRpcjogLTEgIH0sXHJcbiAgICAgICAgeyBjbWRUeXBlOiAyLCB0aW1lOiAyIH0sIFxyXG4gICAgICAgIHsgY21kVHlwZTogMSwgcmFuZ2U6IHsgeDogNDAwMCwgeTogMCwgd2lkdGg6IDIwMDAsIGhlaWdodDogNjQwIH0sIHRpbWU6IDEuNSwgY2FtZXJhOiB0cnVlLCB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogMiwgdGltZTogMiB9LFxyXG4gICAgICAgIHsgY21kVHlwZTogNCwgdmFsdWU6IHRydWUgfSxcclxuICAgIF0sXHJcbiAgICBjb25kOiBbXHJcbiAgICAgICAgeyBjb25kVHlwZTogMSwgbnVtOiA1IH0sXHJcbiAgICBdLFxyXG59LCovXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyNTBlYWNUUXBCTFlJNS8zWHJVTEkyWCcsICdodXJkbGVfZGVmaW5lJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxiYXR0bGVcXGh1cmRsZV9kZWZpbmUuanNcblxubW9kdWxlLmV4cG9ydHMuVHJpZ2dlclR5cGUgPSB7XG4gICAgTk9ORTogMCxcbiAgICBUSU1FOiAxLFxuICAgIEFSRUE6IDJcbn07XG5cbm1vZHVsZS5leHBvcnRzLkNtZFR5cGUgPSB7XG4gICAgTk9ORTogMCxcbiAgICBDT05UUk9MX0VOQUJMRUQ6IDEsXG4gICAgTE9DS19BUkVBOiAyLFxuICAgIENSRUFURV9NT046IDMsXG4gICAgU0hPV19UUkFOU19ET09SOiA0LFxuICAgIFNIT1dfTU9WRV9USVBTOiA1LFxuICAgIENIQU5HRV9IVVJETEU6IDYsXG4gICAgTU9WRV9DQU1FUkE6IDcsXG4gICAgRE9fTU9WRV9HVUlERTogOCxcbiAgICBET19UT1VDSF9HVUlERTogOVxufTtcblxubW9kdWxlLmV4cG9ydHMuQ29uZFR5cGUgPSB7XG4gICAgTk9ORTogMCxcbiAgICBUT1RBTF9NT05fS0lMTDogMSxcbiAgICBDT05GSUdfQ1VTVE9NOiAyXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYWY2ZDNQNTFwOUtFSUpvMkdDeDNXS2EnLCAnaHVyZGxlX3Byb3ZpZGVyJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xccHJvdmlkZXJcXGh1cmRsZV9wcm92aWRlci5qc1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnaHVyZGxlX2NmZycpLmRhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldENvbmZpZzogZnVuY3Rpb24gZ2V0Q29uZmlnKGlkKSB7XG4gICAgICAgIHJldHVybiBjZmdbaWRdO1xuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhNDgyMGc2OW1CTHA3dGxDWmZEM01ERScsICdpMThuJyk7XG4vLyBzY3JpcHRcXGkxOG5cXGkxOG4uanNcblxudmFyIFBvbHlnbG90ID0gcmVxdWlyZSgncG9seWdsb3QnKTtcbnZhciBsYW5ndWFnZSA9IHJlcXVpcmUoJ3poJyk7IC8vIHVwZGF0ZSB0aGlzIHRvIHNldCB5b3VyIGRlZmF1bHQgZGlzcGxheWluZyBsYW5ndWFnZSBpbiBlZGl0b3JcblxuLy8gbGV0IHBvbHlnbG90ID0gbnVsbDtcbnZhciBwb2x5Z2xvdCA9IG5ldyBQb2x5Z2xvdCh7IHBocmFzZXM6IGxhbmd1YWdlIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKipcclxuICAgICAqIFRoaXMgbWV0aG9kIGFsbG93IHlvdSB0byBzd2l0Y2ggbGFuZ3VhZ2UgZHVyaW5nIHJ1bnRpbWUsIGxhbmd1YWdlIGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgc2FtZSBhcyB5b3VyIGRhdGEgZmlsZSBuYW1lIFxyXG4gICAgICogc3VjaCBhcyB3aGVuIGxhbmd1YWdlIGlzICd6aCcsIGl0IHdpbGwgbG9hZCB5b3VyICd6aC5qcycgZGF0YSBzb3VyY2UuXHJcbiAgICAgKiBAbWV0aG9kIGluaXQgXHJcbiAgICAgKiBAcGFyYW0gbGFuZ3VhZ2UgLSB0aGUgbGFuZ3VhZ2Ugc3BlY2lmaWMgZGF0YSBmaWxlIG5hbWUsIHN1Y2ggYXMgJ3poJyB0byBsb2FkICd6aC5qcydcclxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQobGFuZ3VhZ2UpIHtcbiAgICAgICAgdmFyIGRhdGEgPSByZXF1aXJlKGxhbmd1YWdlKTtcbiAgICAgICAgcG9seWdsb3QucmVwbGFjZShkYXRhKTtcbiAgICB9LFxuICAgIC8qKlxyXG4gICAgICogdGhpcyBtZXRob2QgdGFrZXMgYSB0ZXh0IGtleSBhcyBpbnB1dCwgYW5kIHJldHVybiB0aGUgbG9jYWxpemVkIHN0cmluZ1xyXG4gICAgICogUGxlYXNlIHJlYWQgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyBmb3IgZGV0YWlsc1xyXG4gICAgICogQG1ldGhvZCB0XHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGxvY2FsaXplZCBzdHJpbmdcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBcclxuICAgICAqIHZhciBteVRleHQgPSBpMThuLnQoJ01ZX1RFWFRfS0VZJyk7XHJcbiAgICAgKiBcclxuICAgICAqIC8vIGlmIHlvdXIgZGF0YSBzb3VyY2UgaXMgZGVmaW5lZCBhcyBcclxuICAgICAqIC8vIHtcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwifVxyXG4gICAgICogLy8geW91IGNhbiB1c2UgdGhlIGZvbGxvd2luZyB0byBpbnRlcnBvbGF0ZSB0aGUgdGV4dCBcclxuICAgICAqIHZhciBncmVldGluZ1RleHQgPSBpMThuLnQoJ2hlbGxvX25hbWUnLCB7bmFtZTogJ25hbnRhcyd9KTsgLy8gSGVsbG8sIG5hbnRhc1xyXG4gICAgICovXG4gICAgdDogZnVuY3Rpb24gdChrZXksIG9wdCkge1xuICAgICAgICByZXR1cm4gcG9seWdsb3QudChrZXksIG9wdCk7XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzVmMWEwLzVpOTFLeHJzSm43MVBHZlkyJywgJ2luaXRfY29uZmlnJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xcaW5pdF9jb25maWcuanNcblxubW9kdWxlLmV4cG9ydHMuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBHbG9iYWwuaHVyZGxlUHJvdmlkZXIgPSByZXF1aXJlKCdodXJkbGVfcHJvdmlkZXInKTtcbiAgICBHbG9iYWwuc2tpbGxQcm92aWRlciA9IHJlcXVpcmUoJ3NraWxsX3Byb3ZpZGVyJyk7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2U5NDhqNDNzSkRBNGVPVGZhc3RqTGknLCAnaW5pdF9tb2R1bGUnKTtcbi8vIHNjcmlwdFxcbW9kdWxlXFxpbml0X21vZHVsZS5qc1xuXG52YXIgTG9naW5Nb2R1bGUgPSByZXF1aXJlKCdsb2dpbl9tb2R1bGUnKVsnY2xhc3MnXTtcbnZhciBBY2NvdW50TW9kdWxlID0gcmVxdWlyZSgnYWNjb3VudF9tb2R1bGUnKVsnY2xhc3MnXTtcblxubW9kdWxlLmV4cG9ydHMuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBHbG9iYWwubG9naW5Nb2R1bGUgPSBuZXcgTG9naW5Nb2R1bGUoKTtcbiAgICBHbG9iYWwuYWNjb3VudE1vZHVsZSA9IG5ldyBBY2NvdW50TW9kdWxlKCk7XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2ZkNDg2WjB4cE10WWFpNGRTM2pnZHInLCAnam95X2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXGJhdHRsZVxcam95X2N0cmwuanNcblxudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQ29udHJvbEtleSA9IENvbnRyb2xEZWZpbmUuQ29udHJvbEtleTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0aWNrOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBzdGlja01vdmVSYWRpdXM6IDEwMCxcblxuICAgICAgICBzdGlja0tpY2tiYWNrVGltZTogMC4zLFxuXG4gICAgICAgIGJhY2tncm91bmRMb3dBbHBoYTogNTAsXG5cbiAgICAgICAgYmFja2dyb3VuZEhpZ2hBbHBoYTogMjU1LFxuXG4gICAgICAgIGJhY2tncm91bmRGYWRlVGltZTogMC4yXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9tb3ZlUG9zID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fZGlyY3Rpb24gPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQub3BhY2l0eSA9IHRoaXMuYmFja2dyb3VuZExvd0FscGhhO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmQub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMub25Ub3VjaENhbmNlbCwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBsYXllcjogZnVuY3Rpb24gc2V0UGxheWVyKHBsYXllcikge1xuICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsID0gcGxheWVyO1xuICAgIH0sXG5cbiAgICBvblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIG9uVG91Y2hTdGFydChldmVudCkge1xuICAgICAgICB0aGlzLmRvU3RhcnRTdGFmZigpO1xuICAgICAgICB2YXIgbG9jYXRpb24gPSB0aGlzLm5vZGUuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0aWNrUG9zaXRpb24obG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICBvblRvdWNoTW92ZTogZnVuY3Rpb24gb25Ub3VjaE1vdmUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gdGhpcy5ub2RlLmNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlKGV2ZW50KTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGlja1Bvc2l0aW9uKGxvY2F0aW9uKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaEVuZDogZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaENhbmNlbDogZnVuY3Rpb24gb25Ub3VjaENhbmNlbChldmVudCkge1xuICAgICAgICB0aGlzLmRvRW5kU3RhZmYoKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlU3RpY2tQb3NpdGlvbjogZnVuY3Rpb24gdXBkYXRlU3RpY2tQb3NpdGlvbihsb2NhdGlvbikge1xuICAgICAgICB2YXIgcmFkaXVzID0gTWF0aC5zcXJ0KE1hdGgucG93KGxvY2F0aW9uLngsIDIpICsgTWF0aC5wb3cobG9jYXRpb24ueSwgMikpO1xuICAgICAgICBpZiAocmFkaXVzID4gdGhpcy5zdGlja01vdmVSYWRpdXMpIHtcbiAgICAgICAgICAgIHZhciBzY2FsZSA9IHRoaXMuc3RpY2tNb3ZlUmFkaXVzIC8gcmFkaXVzO1xuICAgICAgICAgICAgbG9jYXRpb24ueCAqPSBzY2FsZTtcbiAgICAgICAgICAgIGxvY2F0aW9uLnkgKj0gc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9jYXRpb24ueCA9PT0gMCAmJiBsb2NhdGlvbi55ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLmF0YW4yKGxvY2F0aW9uLngsIGxvY2F0aW9uLnkpO1xuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLmZsb29yKDE4MCAtIHIgKiAxODAgLyBNYXRoLlBJKSAtIDY3LjU7XG4gICAgICAgICAgICBpZiAoZCA8IDApIGQgPSAzNjAgKyBkO1xuICAgICAgICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDQ1KTtcblxuICAgICAgICAgICAgc3dpdGNoIChkKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnkgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RpY2sueCA9IGxvY2F0aW9uLng7XG4gICAgICAgIHRoaXMuc3RpY2sueSA9IGxvY2F0aW9uLnk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmN0aW9uLnggPT0gMSA/IHRoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LlJJR0hUKSA6IHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5SSUdIVCk7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID09IC0xID8gdGhpcy5fcGxheWVyQ3RybC5rZXlEb3duKENvbnRyb2xLZXkuTEVGVCkgOiB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuTEVGVCk7XG4gICAgICAgICAgICB0aGlzLl9kaXJjdGlvbi55ID09IDEgPyB0aGlzLl9wbGF5ZXJDdHJsLmtleURvd24oQ29udHJvbEtleS5VUCkgOiB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuVVApO1xuICAgICAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9PSAtMSA/IHRoaXMuX3BsYXllckN0cmwua2V5RG93bihDb250cm9sS2V5LkRPV04pIDogdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LkRPV04pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvU3RhcnRTdGFmZjogZnVuY3Rpb24gZG9TdGFydFN0YWZmKCkge1xuICAgICAgICB0aGlzLnN0aWNrLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgdGltZSA9ICh0aGlzLmJhY2tncm91bmRIaWdoQWxwaGEgLSB0aGlzLmJhY2tncm91bmQub3BhY2l0eSkgLyAodGhpcy5iYWNrZ3JvdW5kSGlnaEFscGhhIC0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGEpICogdGhpcy5iYWNrZ3JvdW5kRmFkZVRpbWU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZVRvKHRpbWUsIHRoaXMuYmFja2dyb3VuZEhpZ2hBbHBoYSk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgZG9FbmRTdGFmZjogZnVuY3Rpb24gZG9FbmRTdGFmZigpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciB0aW1lID0gKHRoaXMuYmFja2dyb3VuZC5vcGFjaXR5IC0gdGhpcy5iYWNrZ3JvdW5kTG93QWxwaGEpIC8gKHRoaXMuYmFja2dyb3VuZEhpZ2hBbHBoYSAtIHRoaXMuYmFja2dyb3VuZExvd0FscGhhKSAqIHRoaXMuYmFja2dyb3VuZEZhZGVUaW1lO1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVUbyh0aW1lLCB0aGlzLmJhY2tncm91bmRMb3dBbHBoYSk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICBhY3Rpb24gPSBuZXcgY2MuTW92ZVRvKHRoaXMuc3RpY2tLaWNrYmFja1RpbWUsIDAsIDApO1xuICAgICAgICBhY3Rpb24uZWFzaW5nKG5ldyBjYy5lYXNlQmFja091dCgpKTtcbiAgICAgICAgdGhpcy5zdGljay5ydW5BY3Rpb24oYWN0aW9uKTtcblxuICAgICAgICB0aGlzLl9kaXJjdGlvbi54ID0gMDtcbiAgICAgICAgdGhpcy5fZGlyY3Rpb24ueSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllckN0cmwpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckN0cmwua2V5VXAoQ29udHJvbEtleS5SSUdIVCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuTEVGVCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJDdHJsLmtleVVwKENvbnRyb2xLZXkuVVApO1xuICAgICAgICAgICAgdGhpcy5fcGxheWVyQ3RybC5rZXlVcChDb250cm9sS2V5LkRPV04pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldERpcmVjdGlvbjogZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlyY3Rpb247XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzUzOTdSQ1NSOUZuTENxR1YxL1o2YUQnLCAnbG9hZGluZ19jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxsb2FkaW5nX2N0cmwuanNcblxudmFyIFNUQVRFX0RFRkFVTFQgPSAtMTtcbnZhciBTVEFURV9DSEVDS19VUERBVEUgPSAwO1xudmFyIFNUQVRFX1VQREFUSU5HID0gMTtcbnZhciBTVEFURV9MT0FEX0FTU0VUUyA9IDI7XG52YXIgU1RBVEVfSU5JVF9HQU1FID0gMztcbnZhciBTVEFURV9FTlRFUl9HQU1FID0gNDtcbnZhciBTVEFURV9ET05FID0gNTtcblxudmFyIExvYWRpbmdTdGF0ZUluZm8gPSBbe1xuICAgIHN0YXJ0OiAwLFxuICAgIGVuZDogMC4wMixcbiAgICBsYW5nOiAnY2hlY2tpbmdfdXBkYXRlJ1xufSwge1xuICAgIHN0YXJ0OiAwLjAyLFxuICAgIGVuZDogMC4wNSxcbiAgICBsYW5nOiAndXBkYXRpbmdfYXNzZXRzJ1xufSwge1xuICAgIHN0YXJ0OiAwLjA1LFxuICAgIGVuZDogMC45LFxuICAgIGxhbmc6ICdsb2FkaW5nX2Fzc2V0cydcbn0sIHtcbiAgICBzdGFydDogMC45LFxuICAgIGVuZDogMSxcbiAgICBsYW5nOiAnaW5pdHRpbmdfZ2FtZSdcbn0sIHtcbiAgICBzdGFydDogMSxcbiAgICBlbmQ6IDEsXG4gICAgbGFuZzogJ2VudGVyaW5nX2dhbWUnXG59XTtcblxudmFyIFBhbmVsVHlwZSA9IHtcbiAgICBOT05FOiAwLFxuICAgIENPTkZJUk06IDEsXG4gICAgU1RBUlRfVVBEQVRFOiAyLFxuICAgIFJFVFJZX1VQREFURTogM1xufTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHJlbW90ZUFzc2V0UGF0aDogJ3JlbW90ZV9hc3NzZXQnLFxuXG4gICAgICAgIGxvY2FsTWFuaWZlc3Q6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuUmF3QXNzZXRcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVQYW5lbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZU1lc3NhZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlUHJvZ3Jlc3M6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByb2dyZXNzQmFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ29uZmlybUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUNhbmNlbEJ1dHRvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlQ2FuY2VsTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ01lc3NhZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ1BlcmNlbnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZGluZ1Byb2dyZXNzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Qcm9ncmVzc0JhclxuICAgICAgICB9LFxuXG4gICAgICAgIGxvYWRpbmdQYXJ0aWNsZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUGFydGljbGVTeXN0ZW1cbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkQXNzZXRUaW1lOiAyLFxuICAgICAgICBlbnRlckdhbWVUaW1lOiAxXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IFNUQVRFX0RFRkFVTFQ7XG4gICAgICAgIHRoaXMuX25lZWRVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmVlZFJldHJ5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvYWRBc3NldFN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMubG9hZGluZ1BlcmNlbnQuc3RyaW5nID0gJyc7XG4gICAgICAgIHRoaXMubG9hZGluZ01lc3NhZ2Uuc3RyaW5nID0gJyc7XG4gICAgICAgIHRoaXMubG9hZGluZ1BhcnRpY2xlLm5vZGUueCA9IC0yNDkuNTtcbiAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLk5PTkUpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGVja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlVXBkYXRlTGlzdGVuZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2FtKSB7XG4gICAgICAgICAgICB0aGlzLl9hbS5yZWxlYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9hbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlQ2hlY2tMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlQ2hlY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoZWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9jaGVja0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZVVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVVcGRhdGVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgLy8g5Y+q5pyJ5Y6f55Sf5Luj56CB6ZyA6KaB55So54Ot5pu05paw5Yqf6IO9XG4gICAgICAgIC8vdGhpcy5zZXRTdGF0ZShjYy5zeXMuaXNOYXRpdmUgPyBTVEFURV9DSEVDS19VUERBVEUgOiBTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfTE9BRF9BU1NFVFMpO1xuICAgIH0sXG5cbiAgICBzZXRTdGF0ZTogZnVuY3Rpb24gc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IHN0YXRlKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgIGlmIChzdGF0ZSAhPSBTVEFURV9ERUZBVUxUICYmIHN0YXRlICE9IFNUQVRFX0RPTkUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZ1BlcmNlbnQoTG9hZGluZ1N0YXRlSW5mb1tzdGF0ZV0uc3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KExvYWRpbmdTdGF0ZUluZm9bc3RhdGVdLmxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfQ0hFQ0tfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU1RBVEVfVVBEQVRJTkc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0xPQURfQVNTRVRTOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRMb2FkQXNzZXRzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0lOSVRfR0FNRTpcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0VOVEVSX0dBTUU6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEVudGVyR2FtZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRVcGRhdGVQZXJjZW50OiBmdW5jdGlvbiBzZXRVcGRhdGVQZXJjZW50KHBlcmNlbnQpIHtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwKSBwZXJjZW50ID0gMDtlbHNlIGlmIChwZXJjZW50ID4gMSkgcGVyY2VudCA9IDE7XG4gICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCd1cGRhdGVfcGVyY2VudCcpICsgTWF0aC5jZWlsKHBlcmNlbnQgKiAxMDApLnRvU3RyaW5nKCkgKyBcIiVcIjtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5wcm9ncmVzcyA9IHBlcmNlbnQ7XG4gICAgfSxcblxuICAgIHNldExvYWRpbmdQZXJjZW50OiBmdW5jdGlvbiBzZXRMb2FkaW5nUGVyY2VudChwZXJjZW50KSB7XG4gICAgICAgIGlmIChwZXJjZW50IDwgMCkgcGVyY2VudCA9IDA7ZWxzZSBpZiAocGVyY2VudCA+IDEpIHBlcmNlbnQgPSAxO1xuICAgICAgICB0aGlzLmxvYWRpbmdQZXJjZW50LnN0cmluZyA9IE1hdGguY2VpbChwZXJjZW50ICogMTAwKS50b1N0cmluZygpICsgXCIlXCI7XG4gICAgICAgIHRoaXMubG9hZGluZ1Byb2dyZXNzLnByb2dyZXNzID0gcGVyY2VudDtcbiAgICAgICAgdGhpcy5sb2FkaW5nUGFydGljbGUubm9kZS54ID0gcGVyY2VudCAqIDQ5OSAtIDI0OS41O1xuICAgIH0sXG5cbiAgICBjaGVja0NiOiBmdW5jdGlvbiBjaGVja0NiKGV2ZW50KSB7XG4gICAgICAgIGNjLmxvZygnQ29kZTogJyArIGV2ZW50LmdldEV2ZW50Q29kZSgpKTtcblxuICAgICAgICB2YXIgbmVlZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZ2V0RXZlbnRDb2RlKCkpIHtcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9OT19MT0NBTF9NQU5JRkVTVDpcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJObyBsb2NhbCBtYW5pZmVzdCBmaWxlIGZvdW5kLCBob3QgdXBkYXRlIHNraXBwZWQuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfTE9BRF9BU1NFVFMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX0RPV05MT0FEX01BTklGRVNUOlxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX1BBUlNFX01BTklGRVNUOlxuICAgICAgICAgICAgICAgIGNjLmxvZyhcIkZhaWwgdG8gZG93bmxvYWQgbWFuaWZlc3QgZmlsZSwgaG90IHVwZGF0ZSBza2lwcGVkLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0xPQURfQVNTRVRTKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5BTFJFQURZX1VQX1RPX0RBVEU6XG4gICAgICAgICAgICAgICAgY2MubG9nKFwiQWxyZWFkeSB1cCB0byBkYXRlIHdpdGggdGhlIGxhdGVzdCByZW1vdGUgdmVyc2lvbi5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9MT0FEX0FTU0VUUyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuTkVXX1ZFUlNJT05fRk9VTkQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLkNPTkZJUk0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBuZWVkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZFJlbW92ZSkgdGhpcy5yZW1vdmVDaGVja0xpc3RlbmVyKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZUNiOiBmdW5jdGlvbiB1cGRhdGVDYihldmVudCkge1xuICAgICAgICB2YXIgbmVlZFJlc3RhcnQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZhaWxlZCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmdldEV2ZW50Q29kZSgpKSB7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX1BST0dSRVNTSU9OOlxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50ID0gZXZlbnQuZ2V0UGVyY2VudCgpO1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50QnlGaWxlID0gZXZlbnQuZ2V0UGVyY2VudEJ5RmlsZSgpO1xuICAgICAgICAgICAgICAgIHZhciBtc2cgPSBldmVudC5nZXRNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG1zZykgY2MubG9nKG1zZyk7XG4gICAgICAgICAgICAgICAgY2MubG9nKHBlcmNlbnQudG9GaXhlZCgyKSArICclJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcGRhdGVQZXJjZW50KHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX0ZJTklTSEVEOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnVXBkYXRlIGZpbmlzaGVkLiAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBuZWVkUmVzdGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9OT19MT0NBTF9NQU5JRkVTVDpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ05vIGxvY2FsIG1hbmlmZXN0IGZpbGUgZm91bmQsIGhvdCB1cGRhdGUgc2tpcHBlZC4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfRE9XTkxPQURfTUFOSUZFU1Q6XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfUEFSU0VfTUFOSUZFU1Q6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdGYWlsIHRvIGRvd25sb2FkIG1hbmlmZXN0IGZpbGUsIGhvdCB1cGRhdGUgc2tpcHBlZC4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuQUxSRUFEWV9VUF9UT19EQVRFOlxuICAgICAgICAgICAgICAgIGNjLmxvZygnQWxyZWFkeSB1cCB0byBkYXRlIHdpdGggdGhlIGxhdGVzdCByZW1vdGUgdmVyc2lvbi4nKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuVVBEQVRFX0ZBSUxFRDpcbiAgICAgICAgICAgICAgICBjYy5sb2coJ1VwZGF0ZSBmYWlsZWQuICcgKyBldmVudC5nZXRNZXNzYWdlKCkpO1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfVVBEQVRJTkc6XG4gICAgICAgICAgICAgICAgY2MubG9nKCdBc3NldCB1cGRhdGUgZXJyb3I6ICcgKyBldmVudC5nZXRBc3NldElkKCkgKyAnLCAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX0RFQ09NUFJFU1M6XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjYy5sb2coZXZlbnQuZ2V0TWVzc2FnZSgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmFpbGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVVwZGF0ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLl9uZWVkUmV0cnkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLlJFVFJZX1VQREFURSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZFJlc3RhcnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVXBkYXRlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hQYXRocyA9IGpzYi5maWxlVXRpbHMuZ2V0U2VhcmNoUGF0aHMoKTtcbiAgICAgICAgICAgIHZhciBuZXdQYXRocyA9IHRoaXMuX2FtLmdldExvY2FsTWFuaWZlc3QoKS5nZXRTZWFyY2hQYXRocygpO1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQoc2VhcmNoUGF0aHMsIG5ld1BhdGhzKTtcbiAgICAgICAgICAgIC8vY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdIb3RVcGRhdGVTZWFyY2hQYXRocycsIEpTT04uc3RyaW5naWZ5KHNlYXJjaFBhdGhzKSk7XG4gICAgICAgICAgICBqc2IuZmlsZVV0aWxzLnNldFNlYXJjaFBhdGhzKHNlYXJjaFBhdGhzKTtcbiAgICAgICAgICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNoZWNrVXBkYXRlOiBmdW5jdGlvbiBjaGVja1VwZGF0ZSgpIHtcbiAgICAgICAgdmFyIHN0b3JhZ2VQYXRoID0gKGpzYi5maWxlVXRpbHMgPyBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpIDogJy8nKSArIHRoaXMucmVtb3RlQXNzZXRQYXRoO1xuICAgICAgICBjYy5sb2coJ1N0b3JhZ2UgcGF0aCBmb3IgcmVtb3RlIGFzc2V0IDogJyArIHN0b3JhZ2VQYXRoKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FtKSB7XG4gICAgICAgICAgICB0aGlzLl9hbSA9IG5ldyBqc2IuQXNzZXRzTWFuYWdlcih0aGlzLmxvY2FsTWFuaWZlc3QsIHN0b3JhZ2VQYXRoKTtcbiAgICAgICAgICAgIHRoaXMuX2FtLnJldGFpbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbmVlZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fYW0uZ2V0TG9jYWxNYW5pZmVzdCgpLmlzTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXIgPSBuZXcganNiLkV2ZW50TGlzdGVuZXJBc3NldHNNYW5hZ2VyKHRoaXMuX2FtLCB0aGlzLmNoZWNrQ2IuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHRoaXMuX2NoZWNrTGlzdGVuZXIsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYW0uY2hlY2tVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydExvYWRBc3NldHM6IGZ1bmN0aW9uIHN0YXJ0TG9hZEFzc2V0cygpIHtcbiAgICAgICAgdGhpcy5fbG9hZEFzc2V0U3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgIH0sXG5cbiAgICBzdGFydEVudGVyR2FtZTogZnVuY3Rpb24gc3RhcnRFbnRlckdhbWUoKSB7XG4gICAgICAgIHRoaXMuX2VudGVyR2FtZUVuZFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgKyB0aGlzLmVudGVyR2FtZVRpbWU7XG4gICAgfSxcblxuICAgIGluaXRHYW1lOiBmdW5jdGlvbiBpbml0R2FtZSgpIHtcbiAgICAgICAgcmVxdWlyZSgnaW5pdF9jb25maWcnKS5leGVjKCk7XG4gICAgICAgIHJlcXVpcmUoJ2luaXRfbW9kdWxlJykuZXhlYygpO1xuICAgIH0sXG5cbiAgICBlbnRlckdhbWU6IGZ1bmN0aW9uIGVudGVyR2FtZSgpIHtcbiAgICAgICAgR2FtZVV0aWwubG9hZFNjZW5lKFwibG9naW5cIik7XG4gICAgfSxcblxuICAgIHNob3dVcGRhdGVQYW5lbDogZnVuY3Rpb24gc2hvd1VwZGF0ZVBhbmVsKHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gUGFuZWxUeXBlLk5PTkUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFuZWwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhbmVsVHlwZS5DT05GSVJNOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbmZpcm1MYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdzdGFydF91cGRhdGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbExhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2V4aXRfZ2FtZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCdjb25maXJtX3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQYW5lbFR5cGUuU1RBUlRfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbEJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcGRhdGVQZXJjZW50KDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQYW5lbFR5cGUuUkVUUllfVVBEQVRFOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uZmlybUJ1dHRvbi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FuY2VsQnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbmZpcm1MYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdyZXRyeV91cGRhdGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbmNlbExhYmVsLnN0cmluZyA9IEdhbWVMYW5nLnQoJ2V4aXRfZ2FtZScpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZS5zdHJpbmcgPSBHYW1lTGFuZy50KCdmYWlsX3VwZGF0ZScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGRvVXBkYXRlOiBmdW5jdGlvbiBkb1VwZGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hbSkgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMuX3VwZGF0ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0ZW5lciA9IG5ldyBqc2IuRXZlbnRMaXN0ZW5lckFzc2V0c01hbmFnZXIodGhpcy5fYW0sIHRoaXMudXBkYXRlQ2IuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU1RBVEVfVVBEQVRJTkcpO1xuICAgICAgICB0aGlzLl9hbS51cGRhdGUoKTtcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2xpY2s6IGZ1bmN0aW9uIG9uQ29uZmlybUNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5fbmVlZFJldHJ5IHx8IHRoaXMuX25lZWRVcGRhdGUpIHtcbiAgICAgICAgICAgIEdhbWVVdGlsLnBsYXlCdXR0b25Tb3VuZCgpO1xuICAgICAgICAgICAgdGhpcy5zaG93VXBkYXRlUGFuZWwoUGFuZWxUeXBlLlNUQVJUX1VQREFURSk7XG4gICAgICAgICAgICB0aGlzLmRvVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljazogZnVuY3Rpb24gb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0xPQURfQVNTRVRTOlxuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgLSB0aGlzLl9sb2FkQXNzZXRTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVFbGFwYXNlZCA+IHRoaXMubG9hZEFzc2V0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkQXNzZXRTdGFydFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0lOSVRfR0FNRSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGxvYWRJbmZvID0gTG9hZGluZ1N0YXRlSW5mb1tTVEFURV9MT0FEX0FTU0VUU107XG4gICAgICAgICAgICAgICAgdmFyIGFzc2V0TG9hZFBlcmNlbnQgPSB0aW1lRWxhcGFzZWQgLyB0aGlzLmxvYWRBc3NldFRpbWU7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsTG9hZFBlcmNlbnQgPSAobG9hZEluZm8uZW5kIC0gbG9hZEluZm8uc3RhcnQpICogYXNzZXRMb2FkUGVyY2VudCArIGxvYWRJbmZvLnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZ1BlcmNlbnQodG90YWxMb2FkUGVyY2VudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNUQVRFX0lOSVRfR0FNRTpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFNUQVRFX0VOVEVSX0dBTUUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTVEFURV9FTlRFUl9HQU1FOlxuICAgICAgICAgICAgICAgIGlmIChHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCkgPj0gdGhpcy5fZW50ZXJHYW1lRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbnRlckdhbWVFbmRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnRlckdhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTVEFURV9ET05FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2ODBiY0xRc241Skg3R1lUWldIMURQUScsICdsb2dpbl9jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxsb2dpbl9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBhY2NvdW50RWRpdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuXG4gICAgICAgIHBhc3N3ZEVkaXQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcblxuICAgICAgICBtc2dMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NvdW50U2VsZWN0UGFuZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NvdW50U2Nyb2xsVmlldzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlld1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBHbG9iYWwuYWNjb3VudE1vZHVsZS5yZXNldCgpO1xuXG4gICAgICAgIHRoaXMubXNnTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2NvdW50U2VsZWN0UGFuZWwuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZWFkTG9naW5JbmZvKCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnQoKTtcbiAgICB9LFxuXG4gICAgYWRkRXZlbnQ6IGZ1bmN0aW9uIGFkZEV2ZW50KCkge1xuICAgICAgICB0aGlzLl9sb2dpbkhhbmRsZXIgPSBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudEhhbmRsZXIoR2FtZUV2ZW50Lk9OX0xPR0lOX1JFU1VMVCwgdGhpcy5vbkxvZ2luUmVzdWx0LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICByZW1vdmVFdmVudDogZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9sb2dpbkhhbmRsZXIpO1xuICAgICAgICB0aGlzLl9sb2dpbkhhbmRsZXIgPSBudWxsO1xuICAgIH0sXG5cbiAgICBzYXZlTG9naW5JbmZvOiBmdW5jdGlvbiBzYXZlTG9naW5JbmZvKCkge1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY291bnQnLCB0aGlzLl9sb2dpbkFjY291bnQpO1xuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bhc3N3b3JkJywgdGhpcy5fbG9naW5QYXNzd2QpO1xuICAgIH0sXG5cbiAgICByZWFkTG9naW5JbmZvOiBmdW5jdGlvbiByZWFkTG9naW5JbmZvKCkge1xuICAgICAgICB0aGlzLl9sb2dpbkFjY291bnQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnQnKSB8fCAnJztcbiAgICAgICAgdGhpcy5fbG9naW5QYXNzd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Bhc3N3b3JkJykgfHwgJyc7XG4gICAgICAgIHRoaXMuYWNjb3VudEVkaXQuc3RyaW5nID0gdGhpcy5fbG9naW5BY2NvdW50O1xuICAgICAgICB0aGlzLnBhc3N3ZEVkaXQuc3RyaW5nID0gdGhpcy5fbG9naW5QYXNzd2Q7XG4gICAgfSxcblxuICAgIHNldEFjY291bnRMaXN0OiBmdW5jdGlvbiBzZXRBY2NvdW50TGlzdChsaXN0KSB7XG4gICAgICAgIHRoaXMuYWNjb3VudFNjcm9sbFZpZXcuY29udGVudC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gbGlzdCkge1xuICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoJ3ByZWZhYi91aS9jb21wb25lbnRzL2FjY291bnRfaXRlbScsIGNjLlByZWZhYiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgICAgIHZhciBidXR0b24gPSBub2RlLmdldENoaWxkQnlOYW1lKCdidXR0b24nKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENoaWxkQnlOYW1lKCduYW1lX2xhYmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5cy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGxhYmVsLnN0cmluZyA9IGxpc3Rba2V5XTtcbiAgICAgICAgICAgICAgICBidXR0b24ub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY291bnRTZWxlY3RQYW5lbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbG9naW5BY2NvdW50ID0gbGlzdFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBHYW1lUnBjLkNsdDJTcnYubG9naW4oc2VsZi5fbG9naW5BY2NvdW50LCBzZWxmLl9sb2dpblBhc3N3ZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5hY2NvdW50U2Nyb2xsVmlldy5jb250ZW50LmFkZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2dpblJlc3VsdDogZnVuY3Rpb24gb25Mb2dpblJlc3VsdChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAxKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJMb2dpbiBTdWNjZXNzXCIsIGRhdGEuZGF0YS50b2tlbik7XG4gICAgICAgICAgICB0aGlzLnNhdmVMb2dpbkluZm8oKTtcbiAgICAgICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5nYWlOdW1iZXIpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIk11bHRpIEFjY291bnRcIik7XG4gICAgICAgICAgICB0aGlzLnNldEFjY291bnRMaXN0KGRhdGEuZGF0YS5nYWlOdW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5hY2NvdW50U2VsZWN0UGFuZWwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubXNnTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIkFjY291bnQgb3IgUGFzc3dvcmQgaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdhY2NvdXRfb3JfcGFzc3dkX2Vycm9yJyk7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvZ2luQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uTG9naW5CdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHZhciBhY2NvdW50ID0gdGhpcy5hY2NvdW50RWRpdC5zdHJpbmc7XG4gICAgICAgIHZhciBwYXNzd2QgPSB0aGlzLnBhc3N3ZEVkaXQuc3RyaW5nO1xuICAgICAgICBpZiAoYWNjb3VudC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdhY2NvdW50X25vdF9lbXB0eScpO1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhc3N3ZC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgPSBHYW1lTGFuZy50KCdwYXNzd2Rfbm90X2VtcHR5Jyk7XG4gICAgICAgICAgICB0aGlzLm1zZ0xhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2luQWNjb3VudCA9IHRoaXMuYWNjb3VudEVkaXQuc3RyaW5nO1xuICAgICAgICB0aGlzLl9sb2dpblBhc3N3ZCA9IHRoaXMucGFzc3dkRWRpdC5zdHJpbmc7XG4gICAgICAgIEdhbWVScGMuQ2x0MlNydi5sb2dpbih0aGlzLl9sb2dpbkFjY291bnQsIHRoaXMuX2xvZ2luUGFzc3dkKTtcbiAgICB9LFxuXG4gICAgb25SZWdpc3RlQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uUmVnaXN0ZUJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBHYW1lVXRpbC5wbGF5QnV0dG9uU291bmQoKTtcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuQU5EUk9JRCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwib3JnL2NvY29zMmR4L2phdmFzY3JpcHQvQXBwQWN0aXZpdHlcIjtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gXCJxdWlja1JlZ2lzdGVyXCI7XG4gICAgICAgICAgICB2YXIgbWV0aG9kU2lnbmF0dXJlID0gXCIoKVZcIjtcbiAgICAgICAgICAgIGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoY2xhc3NOYW1lLCBtZXRob2ROYW1lLCBtZXRob2RTaWduYXR1cmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRm9yZ2V0QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRm9yZ2V0QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIEdhbWVVdGlsLnBsYXlCdXR0b25Tb3VuZCgpO1xuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5BTkRST0lEKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJvcmcvY29jb3MyZHgvamF2YXNjcmlwdC9BcHBBY3Rpdml0eVwiO1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBcInF1aWNrUmVnaXN0ZXJcIjtcbiAgICAgICAgICAgIHZhciBtZXRob2RTaWduYXR1cmUgPSBcIigpVlwiO1xuICAgICAgICAgICAganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChjbGFzc05hbWUsIG1ldGhvZE5hbWUsIG1ldGhvZFNpZ25hdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNTEwMzZSR2szeEFqNmxhZUNQVVR0NncnLCAnbG9naW5fbW9kdWxlJyk7XG4vLyBzY3JpcHRcXG1vZHVsZVxcbG9naW5fbW9kdWxlLmpzXG5cbm1vZHVsZS5leHBvcnRzWydjbGFzcyddID0gY2MuQ2xhc3Moe1xuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Rva2VuO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2tlbiA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3RvcjogZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3Rva2VuID0gJyc7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2QzOGNjdTZpQ05PZzdrTE9iVkJ2NXJnJywgJ2xvZ2luX3RpbWVfb3V0Jyk7XG4vLyBzY3JpcHRcXGNvbW1vblxcbG9naW5fdGltZV9vdXQuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgb25SZXR1cm5CdXR0b25DbGljazogZnVuY3Rpb24gb25SZXR1cm5CdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIEdhbWVVdGlsLmxvYWRTY2VuZSgnbG9naW4nKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZGZjMWYvMzNKTG9wNjc4Z040VGRuVicsICdtYWluJyk7XG4vLyBzY3JpcHRcXG1haW4uanNcblxudmFyIFN5bmNUaW1lciA9IHJlcXVpcmUoJ3N5bmNfdGltZXInKVsnY2xhc3MnXTtcbnZhciBHYW1lTmV0ID0gcmVxdWlyZSgnZ2FtZV9uZXQnKVsnY2xhc3MnXTtcbnZhciBHYW1lRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcImdhbWVfZXZlbnRfZGlzcGF0Y2hlclwiKVsnY2xhc3MnXTtcblxud2luZG93LkdhbWVVdGlsID0gcmVxdWlyZSgnZ2FtZV91dGlsJyk7XG53aW5kb3cuVGltZVV0aWwgPSByZXF1aXJlKCd0aW1lX3V0aWwnKTtcblxud2luZG93LkdhbWVMYW5nID0gcmVxdWlyZSgnaTE4bicpO1xud2luZG93LkdhbWVScGMgPSByZXF1aXJlKCdnYW1lX3JwYycpO1xud2luZG93LkdhbWVFdmVudCA9IHJlcXVpcmUoJ2dhbWVfZXZlbnQnKTtcblxud2luZG93Lkdsb2JhbCA9IHt9O1xuR2xvYmFsLmluaXR0ZWQgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGNjLmdhbWUuYWRkUGVyc2lzdFJvb3ROb2RlKHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge30sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoIUdsb2JhbC5pbml0dGVkKSB0aGlzLmluaXQoKTtlbHNlIHRoaXMuZ2FtZVVwZGF0ZShkdCk7XG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lVHlwZSA9IDQxO1xuICAgICAgICBHbG9iYWwuc3luY1RpbWVyID0gbmV3IFN5bmNUaW1lcigpO1xuICAgICAgICBHbG9iYWwuZ2FtZU5ldCA9IG5ldyBHYW1lTmV0KCk7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyID0gbmV3IEdhbWVFdmVudERpc3BhdGNoZXIoKTtcblxuICAgICAgICB2YXIgZ3VpZGVTdGVwID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ3VpZGVfbWFza1wiKTtcbiAgICAgICAgaWYgKCFndWlkZVN0ZXApIGd1aWRlU3RlcCA9IDA7XG4gICAgICAgIEdsb2JhbC5ndWlkZVN0ZXAgPSBndWlkZVN0ZXA7XG5cbiAgICAgICAgR2xvYmFsLmluaXR0ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBnYW1lVXBkYXRlOiBmdW5jdGlvbiBnYW1lVXBkYXRlKGR0KSB7XG4gICAgICAgIEdsb2JhbC5zeW5jVGltZXIudXBkYXRlKGR0KTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFiNGJlSGVkZWhFSDZlTG55V2hSTmxDJywgJ21hcF9jdHJsJyk7XG4vLyBzY3JpcHRcXG1hcFxcbWFwX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxvY2tSZWdpb246IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHJlZ2lvbikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sb2NrUmVnaW9uLmVxdWFscyhyZWdpb24pKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lvbi54IDwgMCkgcmVnaW9uLnggPSAwO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpb24ueSA8IDApIHJlZ2lvbi55ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocmVnaW9uLndpZHRoID09PSAwIHx8IHJlZ2lvbi54TWF4ID49IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCkgcmVnaW9uLndpZHRoID0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoIC0gcmVnaW9uLng7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lvbi5oZWlnaHQgPT09IDAgfHwgcmVnaW9uLnlNYXggPj0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCkgcmVnaW9uLmhlaWdodCA9IHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQgLSByZWdpb24ueTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbGRMb2NrUmVnaW9uID0gdGhpcy5fY3VyckxvY2tSZWdpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9ja1JlZ2lvbiA9IHJlZ2lvbi5jbG9uZSgpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2tSZWdpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGF5ZXJTaXplOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBbY2MuU2l6ZV1cbiAgICAgICAgfSxcblxuICAgICAgICB2aWV3U2l6ZTogbmV3IGNjLlNpemUoKVxuICAgIH0sXG5cbiAgICBnZXRDdXJyUG9zaXRpb246IGZ1bmN0aW9uIGdldEN1cnJQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJQb3M7XG4gICAgfSxcblxuICAgIGdldENhbWVyYVBvc2l0aW9uOiBmdW5jdGlvbiBnZXRDYW1lcmFQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYUN1cnJQb2ludDtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2VuaXRpZXMgPSBbXTtcblxuICAgICAgICB0aGlzLl90bXhMYXllciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInRteFwiKTtcbiAgICAgICAgdGhpcy5fdG14Q3RybCA9IHRoaXMuX3RteExheWVyLmdldENvbXBvbmVudChjYy5UaWxlZE1hcCk7XG4gICAgICAgIHRoaXMuX2dyb3VuZEN0cmwgPSB0aGlzLl90bXhDdHJsLmdldExheWVyKFwiZ3JvdW5kXCIpO1xuXG4gICAgICAgIHRoaXMuX3RpbGVTaXplID0gdGhpcy5fdG14Q3RybC5nZXRUaWxlU2l6ZSgpO1xuICAgICAgICB0aGlzLl9tYXBTaXplID0gdGhpcy5fdG14Q3RybC5nZXRNYXBTaXplKCk7XG4gICAgICAgIHRoaXMuX21hcFBpeGVzU2l6ZSA9IG5ldyBjYy5TaXplKHRoaXMuX21hcFNpemUud2lkdGggKiB0aGlzLl90aWxlU2l6ZS53aWR0aCwgdGhpcy5fbWFwU2l6ZS5oZWlnaHQgKiB0aGlzLl90aWxlU2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX2xvY2tYID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvY2tZID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvY2tSZWdpb24gPSBuZXcgY2MuUmVjdCgwLCAwLCB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGgsIHRoaXMuX21hcFBpeGVzU2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX3Bpdm90Q3VyciA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX3Bpdm90U3RhcnQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9waXZvdFRhcmdldCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgdGhpcy5fY3VyclBvcyA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIHRoaXMuX2lzUG9zaXRpb25EaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhQ3VyclBvaW50ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQgPSBuZXcgY2MuVmVjMigpO1xuICAgICAgICB0aGlzLl9jYW1lcmFTdGFydFBvaW50ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVNwZWVkID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZWRMb2NrID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fb3RoZXJMYXllciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm90aGVyX2xheWVyXCIpO1xuICAgICAgICB0aGlzLl9vYmplY3RMYXllciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm9iamVjdF9sYXllclwiKTtcbiAgICAgICAgdGhpcy5fZWZmZWN0TGF5ZXJzID0gW107XG5cbiAgICAgICAgdmFyIGksIGxheWVyO1xuICAgICAgICBmb3IgKGkgPSAwOzsgaSsrKSB7XG4gICAgICAgICAgICBsYXllciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImVmZmVjdF9sYXllcl9cIiArIGkpO1xuICAgICAgICAgICAgaWYgKCFsYXllcikgYnJlYWs7XG4gICAgICAgICAgICB0aGlzLl9lZmZlY3RMYXllcnMucHVzaChsYXllcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGF5ZXJzID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7OyBpKyspIHtcbiAgICAgICAgICAgIGxheWVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwibGF5ZXJfXCIgKyBpKTtcbiAgICAgICAgICAgIGlmICghbGF5ZXIpIGJyZWFrO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2VuaXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9lbml0aWVzLnBvcCgpO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9ja1ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9ja1kgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9ja1JlZ2lvbi54ID0gMCwgdGhpcy5fbG9ja1JlZ2lvbi55ID0gMCwgdGhpcy5fbG9ja1JlZ2lvbi53ZGl0aCA9IHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCwgdGhpcy5fbG9ja1JlZ2lvbi5oZWlnaHQgPSB0aGlzLl9tYXBQaXhlc1NpemUuaGVpZ2h0LCB0aGlzLl9waXZvdEN1cnIueCA9IHRoaXMuX3Bpdm90Q3Vyci55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RTdGFydC54ID0gdGhpcy5fcGl2b3RTdGFydC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RUYXJnZXQueCA9IHRoaXMuX3Bpdm90VGFyZ2V0LnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnggPSB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlRW5kVGltZSA9IDA7XG5cbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gMDtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gMDtcbiAgICAgICAgdGhpcy5faXNQb3NpdGlvbkRpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhQ3VyclBvaW50LnggPSB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnggPSB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC55ID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhU3RhcnRQb2ludC54ID0gdGhpcy5fY2FtZXJhU3RhcnRQb2ludC55ID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnggPSB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVkTG9jayA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudXBkYXRlVmlld1JhbmdlKCk7XG4gICAgfSxcblxuICAgIGFkZEVuaXR5OiBmdW5jdGlvbiBhZGRFbml0eShlbml0eSkge1xuICAgICAgICB0aGlzLl9vYmplY3RMYXllci5hZGRDaGlsZChlbml0eSk7XG4gICAgICAgIHRoaXMuX2VuaXRpZXMucHVzaChlbml0eSk7XG4gICAgfSxcblxuICAgIHJlbW92ZUVuaXR5OiBmdW5jdGlvbiByZW1vdmVFbml0eShlbml0eSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2VuaXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbml0eSA9PSB0aGlzLl9lbml0aWVzW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5pdGllcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkRWZmZWN0OiBmdW5jdGlvbiBhZGRFZmZlY3QoZWZmZWN0LCBpbmRleCkge1xuICAgICAgICB0aGlzLl9lZmZlY3RMYXllcnNbaW5kZXhdLmFkZENoaWxkKGVmZmVjdCk7XG4gICAgfSxcblxuICAgIGNoZWNrTW92ZVBvaW50OiBmdW5jdGlvbiBjaGVja01vdmVQb2ludChjb2wsIHJvdykge1xuICAgICAgICByb3cgPSB0aGlzLl9tYXBTaXplLmhlaWdodCAtIHJvdyAtIDE7XG4gICAgICAgIHZhciBnaWQgPSB0aGlzLl9ncm91bmRDdHJsLmdldFRpbGVHSURBdChjb2wsIHJvdyk7XG4gICAgICAgIGlmIChnaWQgPT09IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLl90bXhDdHJsLmdldFByb3BlcnRpZXNGb3JHSUQoZ2lkKTtcbiAgICAgICAgcmV0dXJuIHByb3AgJiYgcHJvcC5vYnN0YWNsZSA9PT0gXCJ0cnVlXCI7XG4gICAgfSxcblxuICAgIGdldE1hcFNpemU6IGZ1bmN0aW9uIGdldE1hcFNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90bXhDdHJsLmdldE1hcFNpemUoKTtcbiAgICB9LFxuXG4gICAgZ2V0TWFwUGl4ZXNTaXplOiBmdW5jdGlvbiBnZXRNYXBQaXhlc1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXBQaXhlc1NpemU7XG4gICAgfSxcblxuICAgIGdldFRpbGVTaXplOiBmdW5jdGlvbiBnZXRUaWxlU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RteEN0cmwuZ2V0VGlsZVNpemUoKTtcbiAgICB9LFxuXG4gICAgY2FtZXJhVG86IGZ1bmN0aW9uIGNhbWVyYVRvKHgsIHksIHRpbWUsIGNvbXBsZXRlTG9jaykge1xuICAgICAgICBpZiAodGhpcy5fY2FtZXJhQ3VyclBvaW50LnggPT0geCAmJiB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSA9PSB5KSByZXR1cm47XG5cbiAgICAgICAgdmFyIHRhcmdldFggPSB4O1xuICAgICAgICB2YXIgdGFyZ2V0WSA9IHk7XG4gICAgICAgIGlmICh4IDwgMCkge1xuICAgICAgICAgICAgdGFyZ2V0WCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA+PSB0aGlzLl9tYXBQaXhlc1NpemUud2lkdGggLSB0aGlzLnZpZXdTaXplLndpZHRoKSB7XG4gICAgICAgICAgICB0YXJnZXRYID0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoIC0gdGhpcy52aWV3U2l6ZS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeSA8IDApIHtcbiAgICAgICAgICAgIHRhcmdldFkgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHkgPj0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCAtIHRoaXMudmlld1NpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0YXJnZXRZID0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodCAtIHRoaXMudmlld1NpemUuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYUN1cnJQb2ludC54ID09IHRhcmdldFggJiYgdGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgPT0gdGFyZ2V0WSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzY2FsZVRpbWVYID0gTWF0aC5hYnMoKHRoaXMuX2NhbWVyYUN1cnJQb2ludC54IC0gdGFyZ2V0WCkgLyAodGhpcy5fY2FtZXJhQ3VyclBvaW50LnggLSB4KSkgfHwgMTtcbiAgICAgICAgdmFyIHNjYWxlVGltZVkgPSBNYXRoLmFicygodGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgLSB0YXJnZXRZKSAvICh0aGlzLl9jYW1lcmFDdXJyUG9pbnQueSAtIHkpKSB8fCAxO1xuICAgICAgICB0aW1lICo9IE1hdGgubWF4KHNjYWxlVGltZVgsIHNjYWxlVGltZVkpO1xuXG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWUgPSBHbG9iYWwuc3luY1RpbWVyLmdldFRpbWVyKCk7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lID0gdGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSArIHRpbWU7XG4gICAgICAgIHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueCA9IHRoaXMuX2NhbWVyYUN1cnJQb2ludC54O1xuICAgICAgICB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnkgPSB0aGlzLl9jYW1lcmFDdXJyUG9pbnQueTtcbiAgICAgICAgdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueCA9IHRhcmdldFg7XG4gICAgICAgIHRoaXMuX2NhbWVyYVRhcmdldFBvaW50LnkgPSB0YXJnZXRZO1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueCA9ICh0YXJnZXRYIC0gdGhpcy5fY2FtZXJhQ3VyclBvaW50LngpIC8gdGltZTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnkgPSAodGFyZ2V0WSAtIHRoaXMuX2NhbWVyYUN1cnJQb2ludC55KSAvIHRpbWU7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVkTG9jayA9IGNvbXBsZXRlTG9jaztcbiAgICB9LFxuXG4gICAgZW5kQ2FtZXJhVG86IGZ1bmN0aW9uIGVuZENhbWVyYVRvKCkge1xuICAgICAgICB0aGlzLl9jYW1lcmFNb3ZlU3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZUVuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC54ID0gdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueSA9IC0xO1xuICAgICAgICB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnggPSB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnkgPSAtMTtcbiAgICAgICAgdGhpcy5fY2FtZXJhTW92ZVNwZWVkLnggPSB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbWVyYU1vdmVkTG9jayA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRNYXBQb3NpdGlvbjogZnVuY3Rpb24gc2V0TWFwUG9zaXRpb24oeCwgeSkge1xuICAgICAgICBpZiAodGhpcy5fY3VyclBvcy54ID09IHggJiYgdGhpcy5fY3VyclBvcy55ID09IHkpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuX2xvY2tYKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB4O1xuICAgICAgICAgICAgdGhpcy5faXNQb3NpdGlvbkRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2xvY2tZKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB5O1xuICAgICAgICAgICAgdGhpcy5faXNQb3NpdGlvbkRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRNYXBQb3ZpdDogZnVuY3Rpb24gc2V0TWFwUG92aXQoeCwgeSwgdGltZSkge1xuICAgICAgICBpZiAodGhpcy5fcGl2b3RUYXJnZXQueCAhPT0geCB8fCB0aGlzLl9waXZvdFRhcmdldC55ICE9PSB5KSB7XG4gICAgICAgICAgICB0aGlzLl9waXZvdFRhcmdldC54ID0geDtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90VGFyZ2V0LnkgPSB5O1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC54ID0gKHggLSB0aGlzLl9waXZvdEN1cnIueCkgLyB0aW1lO1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VTcGVlZC55ID0gKHkgLSB0aGlzLl9waXZvdEN1cnIueSkgLyB0aW1lO1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RTdGFydC54ID0gdGhpcy5fcGl2b3RDdXJyLng7XG4gICAgICAgICAgICB0aGlzLl9waXZvdFN0YXJ0LnkgPSB0aGlzLl9waXZvdEN1cnIueTtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDaGFuZ2VFbmRUaW1lID0gdGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgKyB0aW1lO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGVuZENoYW5nZVBpdm90OiBmdW5jdGlvbiBlbmRDaGFuZ2VQaXZvdCgpIHtcbiAgICAgICAgdGhpcy5fcGl2b3RTdGFydC54ID0gdGhpcy5fcGl2b3RTdGFydC55ID0gMDtcbiAgICAgICAgdGhpcy5fcGl2b3RUYXJnZXQueCA9IHRoaXMuX3Bpdm90VGFyZ2V0LnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnggPSB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnkgPSAwO1xuICAgICAgICB0aGlzLl9waXZvdENoYW5nZVN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Bpdm90Q2hhbmdlRW5kVGltZSA9IDA7XG4gICAgfSxcblxuICAgIHNob2NrOiBmdW5jdGlvbiBzaG9jaygpIHtcbiAgICAgICAgdmFyIHZpZXdTaXplID0gdGhpcy52aWV3U2l6ZTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5zZXF1ZW5jZShuZXcgY2MubW92ZUJ5KDAuMDMsIDAsIDEwKSwgbmV3IGNjLm1vdmVCeSgwLjAzLCAwLCAtMjApLCBuZXcgY2MubW92ZUJ5KDAuMDMsIDAsIDEwKSwgbmV3IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5vZGUueCA9IDA7XG4gICAgICAgICAgICBub2RlLnkgPSAwO1xuICAgICAgICB9KSk7XG4gICAgICAgIG5vZGUucnVuQWN0aW9uKGFjdGlvbik7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgdmFyIG5lZWRVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2lzUG9zaXRpb25EaXJ0eSkge1xuICAgICAgICAgICAgbmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9pc1Bvc2l0aW9uRGlydHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcGl2b3RDaGFuZ2VTdGFydFRpbWUgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NQaXZvdChjdXJyVGltZSk7XG4gICAgICAgICAgICBuZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY2FtZXJhTW92ZVN0YXJ0VGltZSA+IDApIHtcbiAgICAgICAgICAgIG5lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZWVkVXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXdSYW5nZShjdXJyVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZUVuaXR5Wk9yZGVyKCk7XG4gICAgfSxcblxuICAgIHByb2Nlc3NQaXZvdDogZnVuY3Rpb24gcHJvY2Vzc1Bpdm90KGN1cnJUaW1lKSB7XG4gICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9waXZvdENoYW5nZUVuZFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q3Vyci54ID0gdGhpcy5fcGl2b3RUYXJnZXQueDtcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90Q3Vyci55ID0gdGhpcy5fcGl2b3RUYXJnZXQueTtcbiAgICAgICAgICAgIHRoaXMuZW5kQ2hhbmdlUGl2b3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBjdXJyVGltZSAtIHRoaXMuX3Bpdm90Q2hhbmdlU3RhcnRUaW1lO1xuICAgICAgICAgICAgdGhpcy5fcGl2b3RDdXJyLnggPSB0aGlzLl9waXZvdFN0YXJ0LnggKyB0aGlzLl9waXZvdENoYW5nZVNwZWVkLnggKiB0aW1lRWxhcGFzZWQ7XG4gICAgICAgICAgICB0aGlzLl9waXZvdEN1cnIueSA9IHRoaXMuX3Bpdm90U3RhcnQueSArIHRoaXMuX3Bpdm90Q2hhbmdlU3BlZWQueSAqIHRpbWVFbGFwYXNlZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVFbml0eVpPcmRlcjogZnVuY3Rpb24gdXBkYXRlRW5pdHlaT3JkZXIoKSB7XG4gICAgICAgIHRoaXMuX2VuaXRpZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEueSA8IGIueSA/IDEgOiAtMTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZW5pdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fZW5pdGllc1tpXS5zZXRMb2NhbFpPcmRlcihpICsgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlVmlld1JhbmdlOiBmdW5jdGlvbiB1cGRhdGVWaWV3UmFuZ2UoY3VyclRpbWUpIHtcbiAgICAgICAgdmFyIG1hcFdpZHRoID0gdGhpcy5fbWFwUGl4ZXNTaXplLndpZHRoO1xuICAgICAgICB2YXIgbWFwSGVpZ2h0ID0gdGhpcy5fbWFwUGl4ZXNTaXplLmhlaWdodDtcbiAgICAgICAgdmFyIHZpZXdTaXplID0gdGhpcy52aWV3U2l6ZTtcbiAgICAgICAgdmFyIG1hcFBvcyA9IG5ldyBjYy5WZWMyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX2NhbWVyYU1vdmVFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnggPSB0aGlzLl9jYW1lcmFUYXJnZXRQb2ludC54O1xuICAgICAgICAgICAgICAgIG1hcFBvcy55ID0gdGhpcy5fY2FtZXJhVGFyZ2V0UG9pbnQueTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FtZXJhTW92ZWRMb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2tYID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9ja1kgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVuZENhbWVyYVRvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lRWxhcGFzZWQgPSBjdXJyVGltZSAtIHRoaXMuX2NhbWVyYU1vdmVTdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgbWFwUG9zLnggPSB0aGlzLl9jYW1lcmFTdGFydFBvaW50LnggKyB0aGlzLl9jYW1lcmFNb3ZlU3BlZWQueCAqIHRpbWVFbGFwYXNlZDtcbiAgICAgICAgICAgICAgICBtYXBQb3MueSA9IHRoaXMuX2NhbWVyYVN0YXJ0UG9pbnQueSArIHRoaXMuX2NhbWVyYU1vdmVTcGVlZC55ICogdGltZUVsYXBhc2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbWl0UmVnaW9uID0gbmV3IGNjLlJlY3QoKTtcbiAgICAgICAgICAgIGxpbWl0UmVnaW9uLnggPSB0aGlzLl9sb2NrUmVnaW9uLng7XG4gICAgICAgICAgICBsaW1pdFJlZ2lvbi55ID0gdGhpcy5fbG9ja1JlZ2lvbi55O1xuICAgICAgICAgICAgbGltaXRSZWdpb24ud2lkdGggPSB0aGlzLl9sb2NrUmVnaW9uLndpZHRoIC0gdmlld1NpemUud2lkdGg7XG4gICAgICAgICAgICBsaW1pdFJlZ2lvbi5oZWlnaHQgPSB0aGlzLl9sb2NrUmVnaW9uLmhlaWdodCAtIHZpZXdTaXplLmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9sb2NrWCkge1xuICAgICAgICAgICAgICAgIG1hcFBvcy54ID0gdGhpcy5fY3VyclBvcy54ICsgdGhpcy5fcGl2b3RDdXJyLnggLSB2aWV3U2l6ZS53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFBvcy54IDwgbGltaXRSZWdpb24ueE1pbikgbWFwUG9zLnggPSBsaW1pdFJlZ2lvbi54TWluO1xuICAgICAgICAgICAgICAgIGlmIChtYXBQb3MueCA+IGxpbWl0UmVnaW9uLnhNYXgpIG1hcFBvcy54ID0gbGltaXRSZWdpb24ueE1heDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fbG9ja1kpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3MueSA9IHRoaXMuX2N1cnJQb3MueSArIHRoaXMuX3Bpdm90Q3Vyci55IC0gdmlld1NpemUuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICBpZiAobWFwUG9zLnkgPCBsaW1pdFJlZ2lvbi55TWluKSBtYXBQb3MueSA9IGxpbWl0UmVnaW9uLnlNaW47XG4gICAgICAgICAgICAgICAgaWYgKG1hcFBvcy55ID4gbGltaXRSZWdpb24ueU1heCkgbWFwUG9zLnkgPSBsaW1pdFJlZ2lvbi55TWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2FtZXJhQ3VyclBvaW50LnggPSBtYXBQb3MueDtcbiAgICAgICAgdGhpcy5fY2FtZXJhQ3VyclBvaW50LnkgPSBtYXBQb3MueTtcblxuICAgICAgICB0aGlzLl9waXZvdE9mZnNldCA9IHRoaXMuX2N1cnJQb3MueCAtIG1hcFBvcy54O1xuXG4gICAgICAgIHRoaXMuX3RteExheWVyLnNldFBvc2l0aW9uKC1tYXBQb3MueCwgLW1hcFBvcy55KTtcbiAgICAgICAgdGhpcy5fb2JqZWN0TGF5ZXIuc2V0UG9zaXRpb24oLW1hcFBvcy54LCAtbWFwUG9zLnkpO1xuICAgICAgICB0aGlzLl9vdGhlckxheWVyLnNldFBvc2l0aW9uKC1tYXBQb3MueCwgLW1hcFBvcy55KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9lZmZlY3RMYXllcnMubGVuZ3RoOyBpKyspIHRoaXMuX2VmZmVjdExheWVyc1tpXS5zZXRQb3NpdGlvbigtbWFwUG9zLngsIC1tYXBQb3MueSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9sYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsYXllciA9IHRoaXMuX2xheWVyc1tpXTtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5sYXllclNpemVbaV07XG4gICAgICAgICAgICBsYXllci54ID0gLW1hcFBvcy54IC8gKHRoaXMuX21hcFBpeGVzU2l6ZS53aWR0aCAtIHZpZXdTaXplLndpZHRoKSAqIChzaXplLndpZHRoIC0gdmlld1NpemUud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiNzUyZHdzUGlsT2NyZWJWSHRIckczRycsICdtZXNzYWdlX2JveCcpO1xuLy8gc2NyaXB0XFx1aVxcbWVzc2FnZV9ib3guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uXG4gICAgICAgIG1lc3NhZ2VMYWJlbDogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybCA9IHRoaXMuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5fdWlDdHJsLmFyZ3M7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gYXJncy5jYWxsYmFjaztcbiAgICAgICAgdGhpcy5tZXNzYWdlTGFiZWwuc3RyaW5nID0gYXJncy5tZXNzYWdlO1xuICAgIH0sXG5cbiAgICBvbkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkJ1dHRvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIEdhbWVVdGlsLnBsYXlCdXR0b25Tb3VuZCgpO1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBldmVudC50YXJnZXQubmFtZTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnb2tfYnV0dG9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnY2FuY2VsX2J1dHRvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2NjYjUwb1RWamxNVHI0YStlOGdtVitiJywgJ21pc3Npb25fZmFpbCcpO1xuLy8gc2NyaXB0XFx1aVxccmVzdWx0XFxtaXNzaW9uX2ZhaWwuanNcblxudmFyIHRpbWVzTWFwQ29pbiA9IFsxMCwgMzAsIDUwXTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByZXR1cm5CdXR0b246IGNjLk5vZGUsXG4gICAgICAgIGtpbGxMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIHJvdW5kTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBtYXhLaWxsTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBtYXhSb3VuZExhYmVsOiBjYy5MYWJlbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IHRoaXMuX3VpQ3RybC5hcmdzLmtpbGxOdW07XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtID0gdGhpcy5fdWlDdHJsLmFyZ3Mucm91bmROdW07XG5cbiAgICAgICAgdGhpcy5raWxsTGFiZWwuc3RyaW5nID0gdGhpcy5fa2lsbE51bS50b1N0cmluZygpO1xuICAgICAgICB0aGlzLnJvdW5kTGFiZWwuc3RyaW5nID0gdGhpcy5fcm91bmROdW0udG9TdHJpbmcoKTtcblxuICAgICAgICB2YXIgbWF4U2NvcmUgPSBHbG9iYWwuYWNjb3VudE1vZHVsZS5tYXhTY29yZS50b1N0cmluZygpO1xuICAgICAgICBjYy5sb2coJ21heFNjb3JlJywgbWF4U2NvcmUpO1xuICAgICAgICB2YXIgaSA9IG1heFNjb3JlLmxlbmd0aDtcbiAgICAgICAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAobWF4U2NvcmUuY2hhckF0KGkpID09PSAnMCcpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhLaWxsID0gcGFyc2VJbnQobWF4U2NvcmUuc3Vic3RyaW5nKDAsIGkpKSAtIDE7XG4gICAgICAgIHZhciBtYXhSb3VuZCA9IG1heFNjb3JlLnN1YnN0cmluZyhpICsgMSwgbWF4U2NvcmUubGVuZ3RoKTtcblxuICAgICAgICB0aGlzLm1heEtpbGxMYWJlbC5zdHJpbmcgPSBtYXhLaWxsLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMubWF4Um91bmRMYWJlbC5zdHJpbmcgPSBtYXhSb3VuZDtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInNvdW5kLzRcIiwgY2MuQXVkaW9DbGlwLCBmdW5jdGlvbiAoZXJyLCBhdWRpb0NsaXApIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyhhdWRpb0NsaXAsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge30sXG5cbiAgICBvblJldHVybkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHVybkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBHYW1lVXRpbC5wbGF5QnV0dG9uU291bmQoKTtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmVtaXQoR2FtZUV2ZW50Lk9OX1JFVFVSTl9HQU1FKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk1MGY0UmdkdVJJcFp1L2psV1VUM1pLJywgJ21vZGVsX3BhbmVsJyk7XG4vLyBzY3JpcHRcXHVpXFxjb21wb25lbnRcXG1vZGVsX3BhbmVsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3RvdWNoU3RhcnQgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl90b3VjaE1vdmUgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX3RvdWNoRW5kID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX3RvdWNoQ2FuY2VsID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlRW50ZXIgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRU5URVIsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZUxlYXZlID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0xFQVZFLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VEb3duID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZU1vdmUgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlVXAgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZVdoZWxsID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1dIRUVMLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX3RvdWNoU3RhcnQsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fdG91Y2hNb3ZlLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fdG91Y2hFbmQsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl90b3VjaENhbmNlbCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgdGhpcy5fbW91c2VFbnRlciwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgdGhpcy5fbW91c2VMZWF2ZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOLCB0aGlzLl9tb3VzZURvd24sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgdGhpcy5fbW91c2VNb3ZlLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1VQLCB0aGlzLl9tb3VzZVVwLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1dIRUVMLCB0aGlzLl9tb3VzZVdoZWxsLCB0aGlzLm5vZGUpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGVmYjk5MTJDdERQNFNlYXBnM3FIVEsnLCAnbW9uc3Rlcl9jdHJsJyk7XG4vLyBzY3JpcHRcXGFjdG9yXFxtb25zdGVyX2N0cmwuanNcblxudmFyIEFjdG9yRGVmaW5lID0gcmVxdWlyZShcImFjdG9yX2RlZmluZVwiKTtcbnZhciBBY3RvciA9IHJlcXVpcmUoXCJhY3Rvcl9jdHJsXCIpO1xuXG52YXIgQWN0b3JBY3Rpb24gPSBBY3RvckRlZmluZS5BY3RvckFjdGlvbjtcbnZhciBBY3RvckRpcmVjdGlvbiA9IEFjdG9yRGVmaW5lLkFjdG9yRGlyZWN0aW9uO1xudmFyIEFjdGlvbkNvbXBsZXRlVHlwZSA9IEFjdG9yRGVmaW5lLkFjdGlvbkNvbXBsZXRlVHlwZTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBBY3RvcixcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9BSU1vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJQXR0YWNrRGVsYXlFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlSdW5uZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9BSU1vdmVFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0FJQXR0YWNrRGVsYXlFbmRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fQUlSdW5uZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgcnVuOiBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAgIHRoaXMuX0FJUnVubmVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fQUlSdW5uZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblxuICAgICAgICB0aGlzLl9zdXBlcihkdCk7XG4gICAgfSxcblxuICAgIG5leHRBY3Rpb246IGZ1bmN0aW9uIG5leHRBY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0RlYWQpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5CT1JOKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9BSVJ1bm5lZCAmJiB0aGlzLl9ib3JuRW5kVGltZSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX0FJUnVubmVkICYmIHRoaXMuX2Jvcm5FbmRUaW1lIDw9IDApIHtcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSB0aGlzLl9sb2dpY01hbmFnZXIuZ2V0UGxheWVyKCk7XG4gICAgICAgICAgICBpZiAocGxheWVyLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGlzWCA9IHBsYXllci5ub2RlLnggLSB0aGlzLm5vZGUueDtcbiAgICAgICAgICAgIHZhciBkaXNZID0gcGxheWVyLm5vZGUueSAtIHRoaXMubm9kZS55O1xuICAgICAgICAgICAgdmFyIGRpclggPSBBY3RvckRpcmVjdGlvbi5MRUZUO1xuICAgICAgICAgICAgdmFyIGRpclkgPSAwO1xuICAgICAgICAgICAgaWYgKGRpc1ggPiAwKSBkaXJYID0gQWN0b3JEaXJlY3Rpb24uUklHSFQ7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlzWSkgPiAxOSkge1xuICAgICAgICAgICAgICAgIGlmIChkaXNZID4gMCkgZGlyWSA9IDE7ZWxzZSBkaXJZID0gLTE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpclkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldERpcmVjdGlvbihkaXJYKTtcblxuICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpc1kpIDwgMjAgJiYgTWF0aC5hYnMoZGlzWCkgPCA2MCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyVGltZSA+PSB0aGlzLl9BSUF0dGFja0RlbGF5RW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2tpbGwgPSBHbG9iYWwuc2tpbGxQcm92aWRlci5nZXRDb25maWcoMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2tpbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0FJQXR0YWNrRGVsYXlFbmRUaW1lID0gY3VyclRpbWUgKyBNYXRoLnJhbmRvbSgpICogMyArIDEuNTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc3R1cmVMaXN0ID0gW3NraWxsLnBvc3R1cmVzWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF0dGFjayhwb3N0dXJlTGlzdCwgMSwgdGhpcy5fZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fQUlNb3ZlRW5kVGltZSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclRpbWUgPD0gdGhpcy5fQUlNb3ZlRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BlZWQgPSBuZXcgY2MuVmVjMigxMDAgKiBkaXJYLCAxMDAgKiBkaXJZKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdmVTdGFydFRpbWUgPD0gMCB8fCBzcGVlZC54ICE9PSB0aGlzLl9jdXJyTW92ZVNwZWVkLnggfHwgc3BlZWQueSAhPT0gdGhpcy5fY3Vyck1vdmVTcGVlZC55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0TW92ZShzcGVlZC54LCBzcGVlZC55LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlNb3ZlRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IGN1cnJUaW1lICsgTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX0FJSG9sZEVuZFRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJUaW1lID49IHRoaXMuX0FJSG9sZEVuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fQUlIb2xkRW5kVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9BSU1vdmVFbmRUaW1lID0gY3VyclRpbWUgKyBNYXRoLnJhbmRvbSgpICogMiArIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmE5MjIvdEtFRkZRSkdPNnE1V3lXWU8nLCAnbmF0aXZlX2N0cmwnKTtcbi8vIHNjcmlwdFxcc2NlbmVcXG5hdGl2ZV9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBleGl0RGlhbG9nOiBjYy5QcmVmYWIsXG4gICAgICAgIHBhdXNlUGFuZWw6IGNjLlByZWZhYlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY2MubG9nKCdrZXlEb3duOiAnICsga2V5Q29kZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleUNvZGUgPT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PSBjYy5LRVkuZXNjYXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0V4aXREaWFsb2coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIOe7keWumumUruebmOS6i+S7tlxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIobGlzdGVuZXIsIHRoaXMubm9kZSk7XG5cbiAgICAgICAgdGhpcy5faGlkZUNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJoaWRlXCIpO1xuICAgICAgICAgICAgaWYgKHNlbGYucGF1c2VQYW5lbCAmJiAhY2MuZGlyZWN0b3IuaXNQYXVzZWQoKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1BhdXNlRmFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNjLmdhbWUub24oY2MuZ2FtZS5FVkVOVF9ISURFLCB0aGlzLl9oaWRlQ2FsbCk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBjYy5nYW1lLm9mZihjYy5nYW1lLkVWRU5UX0hJREUsIHRoaXMuX2hpZGVDYWxsKTtcbiAgICB9LFxuXG4gICAgc2hvd1BhdXNlRmFjZTogZnVuY3Rpb24gc2hvd1BhdXNlRmFjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhdXNlRmFjZSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBwYW5lbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGF1c2VQYW5lbCk7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBwYW5lbC5nZXRDb21wb25lbnQoXCJwYXVzZV9wYW5lbFwiKTtcbiAgICAgICAgY29tcG9uZW50LnNldE5hdGl2ZUN0cmwodGhpcyk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHBhbmVsKTtcbiAgICAgICAgdGhpcy5fcGF1c2VGYWNlID0gcGFuZWw7XG4gICAgfSxcblxuICAgIHJlbW92ZVBhdXNlRmFjZTogZnVuY3Rpb24gcmVtb3ZlUGF1c2VGYWNlKCkge1xuICAgICAgICBpZiAodGhpcy5fcGF1c2VGYWNlICYmIHRoaXMuX3BhdXNlRmFjZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXVzZUZhY2UucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgdGhpcy5fcGF1c2VGYWNlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX3BhdXNlRmFjZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd0V4aXREaWFsb2c6IGZ1bmN0aW9uIHNob3dFeGl0RGlhbG9nKCkge1xuICAgICAgICBpZiAodGhpcy5fZXhpdERpYWxvZykgcmV0dXJuO1xuXG4gICAgICAgIHZhciBkaWFsb2cgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmV4aXREaWFsb2cpO1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gZGlhbG9nLmdldENvbXBvbmVudChcImV4aXRfY29uZmlybV9kaWFsb2dcIik7XG4gICAgICAgIGNvbXBvbmVudC5zZXROYXRpdmVDdHJsKHRoaXMpO1xuICAgICAgICBjb21wb25lbnQuc2V0SXNCYXR0bGUodGhpcy5ub2RlLmdldENvbXBvbmVudCgnYmF0dGxlX2N0cmwnKSAhPT0gbnVsbCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGRpYWxvZyk7XG4gICAgICAgIHRoaXMuX2V4aXREaWFsb2cgPSBkaWFsb2c7XG4gICAgfSxcblxuICAgIHJlbW92ZUV4aXREaWFsb2c6IGZ1bmN0aW9uIHJlbW92ZUV4aXREaWFsb2coKSB7XG4gICAgICAgIGlmICh0aGlzLl9leGl0RGlhbG9nICYmIHRoaXMuX2V4aXREaWFsb2cuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhpcy5fZXhpdERpYWxvZy5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB0aGlzLl9leGl0RGlhbG9nLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2V4aXREaWFsb2cgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTIwM2V3d2NhSkFUcS96ZGdPZ2tzamInLCAnbmV0d29ya19jdHJsJyk7XG4vLyBzY3JpcHRcXHNjZW5lXFxuZXR3b3JrX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxvYWRpbmdQcmVmYWI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXJyb3JQcmVmYWI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9naW5UaW1lT3V0UHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fSFRUUF9SRVFVRVNULCB0aGlzLm9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX3Jlc3BvbmRIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9IVFRQX1JFU1BPTkQsIHRoaXMub25FdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fbmV0d29ya0Vycm9ySGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fTkVUV09SS19FUlJPUiwgdGhpcy5vbkV2ZW50LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9sb2dpblRpbWVPdXRIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9MT0dJTl9USU1FX09VVCwgdGhpcy5vbkV2ZW50LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3JlcXVlc3RIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX3Jlc3BvbmRIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX25ldHdvcmtFcnJvckhhbmRsZXIpO1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fbG9naW5UaW1lT3V0SGFuZGxlcik7XG4gICAgICAgIHRoaXMuX3JlcXVlc3RIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzcG9uZEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9uZXR3b3JrRXJyb3JIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbG9naW5UaW1lT3V0SGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uRXZlbnQ6IGZ1bmN0aW9uIG9uRXZlbnQoZXZlbnRUeXBlLCBkYXRhKSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEdhbWVFdmVudC5PTl9IVFRQX1JFUVVFU1Q6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TG9hZGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBodHRwIHJlcXVlc3RcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgR2FtZUV2ZW50Lk9OX0hUVFBfUkVTUE9ORDpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBodHRwIHJlc3BvbmRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgR2FtZUV2ZW50Lk9OX05FVFdPUktfRVJST1I6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBuZXR3b3JrIGVycm9yXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEdhbWVFdmVudC5PTl9MT0dJTl9USU1FX09VVDpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2dpblRpbWVPdXQoKTtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJvbiBsb2dpbiB0aW1lIG91dFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93TG9naW5UaW1lT3V0OiBmdW5jdGlvbiBzaG93TG9naW5UaW1lT3V0KCkge1xuICAgICAgICB2YXIgcGFuZWwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmxvZ2luVGltZU91dFByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChwYW5lbCk7XG4gICAgfSxcblxuICAgIHNob3dFcnJvcjogZnVuY3Rpb24gc2hvd0Vycm9yKCkge1xuICAgICAgICB2YXIgcGFuZWwgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmVycm9yUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHBhbmVsKTtcbiAgICB9LFxuXG4gICAgc2hvd0xvYWRpbmc6IGZ1bmN0aW9uIHNob3dMb2FkaW5nKHZhbHVlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTG9hZGluZygpO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9hZGluZ1ByZWZhYik7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQocGFuZWwpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1BhbmVsID0gcGFuZWw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlTG9hZGluZzogZnVuY3Rpb24gcmVtb3ZlTG9hZGluZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdQYW5lbCkge1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1BhbmVsLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgIC8vdGhpcy5fbG9hZGluZ1BhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdQYW5lbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YyM2ZiOXQ0MTFLd3F2VThIT2FYT1ZEJywgJ25ldHdvcmtfZXJyb3InKTtcbi8vIHNjcmlwdFxcY29tbW9uXFxuZXR3b3JrX2Vycm9yLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgb25SZXRyeUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHJ5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIEdsb2JhbC5nYW1lTmV0LnJldHJ5SHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgb25FeGl0QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uRXhpdEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5lbmQoKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjNGI2ZFkybW5wS2w3MXlQdFU4d1hzQScsICdwYXVzZV9wYW5lbCcpO1xuLy8gc2NyaXB0XFxjb21tb25cXHBhdXNlX3BhbmVsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl90b3VjaEVuZCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl9uYXRpdmVDdHJsKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fbmF0aXZlQ3RybC5yZW1vdmVQYXVzZUZhY2UoKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcblxuICAgICAgICB0aGlzLl9tb3VzZVVwID0gdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1VQLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5fbmF0aXZlQ3RybCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX25hdGl2ZUN0cmwucmVtb3ZlUGF1c2VGYWNlKCk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IucmVzdW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fdG91Y2hFbmQsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAsIHRoaXMuX21vdXNlVXAsIHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgc2V0TmF0aXZlQ3RybDogZnVuY3Rpb24gc2V0TmF0aXZlQ3RybChuYXRpdmVDdHJsKSB7XG4gICAgICAgIHRoaXMuX25hdGl2ZUN0cmwgPSBuYXRpdmVDdHJsO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RiMThmVkVjYXRHbDZ0ZjVBeVl0T1FoJywgJ3BoeXNpY2FsX25vdF9lbm91Z2gnKTtcbi8vIHNjcmlwdFxcdWlcXHBoeXNpY2FsX25vdF9lbm91Z2guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdWlDdHJsID0gdGhpcy5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICB9LFxuXG4gICAgb25CdXlCdXR0b25DbGljazogZnVuY3Rpb24gb25CdXlCdXR0b25DbGljaygpIHtcbiAgICAgICAgR2FtZVV0aWwucGxheUJ1dHRvblNvdW5kKCk7XG4gICAgICAgIHRoaXMuX3VpQ3RybC5jbG9zZSgpO1xuICAgICAgICB2YXIgY29pbiA9IEdsb2JhbC5hY2NvdW50TW9kdWxlLmdvbGROdW07XG4gICAgICAgIGlmIChHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtIDwgNTApIHtcbiAgICAgICAgICAgIHRoaXMuX3VpQ3RybC5tYW5hZ2VyLm9wZW5VSSgnY29pbl9ub3RfZW5vdWdoJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5idXlGdWxsUGh5c2ljYWwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvbkNhbmNlbEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBHYW1lVXRpbC5wbGF5QnV0dG9uU291bmQoKTtcbiAgICAgICAgdGhpcy5fdWlDdHJsLmNsb3NlKCk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWVjMTFFSUtNUkFJNUQ1dm9CKzZCTkMnLCAncGh5c2ljYWxfcG9pbnQnKTtcbi8vIHNjcmlwdFxcdWlcXGNvbXBvbmVudFxccGh5c2ljYWxfcG9pbnQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHN0YXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IHN0YXRlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFyLmFjdGl2ZSA9IHN0YXRlID09PSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAxO1xuICAgICAgICAvL3RoaXMuX2FuaW1hdGlvbiA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgLy90aGlzLl9hbmltYXRpb24ub24oJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlRmluaXNoLCB0aGlzKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBjOGU4enFmQkJJaGI1YXZWNlVJbTJPJywgJ3BsYXllcl9jdHJsJyk7XG4vLyBzY3JpcHRcXGFjdG9yXFxwbGF5ZXJfY3RybC5qc1xuXG52YXIgR3VpZGVEZWZpbmUgPSByZXF1aXJlKFwiZ3VpZGVfZGVmaW5lXCIpO1xudmFyIENvbnRyb2xEZWZpbmUgPSByZXF1aXJlKFwiY29udHJvbF9kZWZpbmVcIik7XG52YXIgQWN0b3JEZWZpbmUgPSByZXF1aXJlKFwiYWN0b3JfZGVmaW5lXCIpO1xudmFyIEFjdG9yID0gcmVxdWlyZShcImFjdG9yX2N0cmxcIik7XG5cbnZhciBDb250cm9sS2V5ID0gQ29udHJvbERlZmluZS5Db250cm9sS2V5O1xudmFyIEFjdG9yQWN0aW9uID0gQWN0b3JEZWZpbmUuQWN0b3JBY3Rpb247XG52YXIgQWN0b3JEaXJlY3Rpb24gPSBBY3RvckRlZmluZS5BY3RvckRpcmVjdGlvbjtcbnZhciBBY3Rpb25Db21wbGV0ZVR5cGUgPSBBY3RvckRlZmluZS5BY3Rpb25Db21wbGV0ZVR5cGU7XG52YXIgR3VpZGVTdGVwID0gR3VpZGVEZWZpbmUuR3VpZGVTdGVwO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IEFjdG9yLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzdGF0ZUJhcjoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQoYmFyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVCYXIgPSBiYXI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVCYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29udHJvbEVuYWJsZWQ6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ID49IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZWxpdmVFZmZlY3RVbmRlcjogY2MuQW5pbWF0aW9uLFxuICAgICAgICByZWxpdmVFZmZlY3RVcHBlcjogY2MuQW5pbWF0aW9uXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VW5kZXIub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBzZWxmLnJlbGl2ZUVmZmVjdFVuZGVyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVwcGVyLm9uKCdmaW5pc2hlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5yZWxpdmVFZmZlY3RVcHBlci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9rZXlEb3duQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl9rZXlEb3duVGltZSA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICAgICAgdGhpcy5fY29udHJvbEVuYWJsZWRDb3VudCA9IC0xO1xuXG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX2tleURvd25Db3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fa2V5RG93blRpbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2tleURvd25UaW1lW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250cm9sRW5hYmxlZENvdW50ID0gLTE7XG4gICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAodGhpcy5fc3RhdGVCYXIpIHRoaXMuX3N0YXRlQmFyLnNldEhwKHRoaXMuX2hwLCB0aGlzLl9ocE1heCwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBzZXRIcDogZnVuY3Rpb24gc2V0SHAodmFsdWUsIG1heCkge1xuICAgICAgICB0aGlzLl9zdXBlcih2YWx1ZSwgbWF4KTtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlQmFyKSB0aGlzLl9zdGF0ZUJhci5zZXRIcCh0aGlzLl9ocCwgdGhpcy5faHBNYXgsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc2V0QWN0b3JQb3NpdGlvbjogZnVuY3Rpb24gc2V0QWN0b3JQb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKHgsIHkpO1xuICAgICAgICB0aGlzLl9tYXAuc2V0TWFwUG9zaXRpb24oeCwgeSk7XG4gICAgfSxcblxuICAgIHNldEFjdGlvbjogZnVuY3Rpb24gc2V0QWN0aW9uKGFjdGlvbiwgZGlyLCBwYXJhbSwgdGltZSkge1xuICAgICAgICB0aGlzLl9zdXBlcihhY3Rpb24sIGRpciwgcGFyYW0sIHRpbWUpO1xuICAgICAgICAvL3RoaXMudXBkYXRlTWFwUGl2b3QoKTtcbiAgICB9LFxuXG4gICAgc2V0RGlyZWN0aW9uOiBmdW5jdGlvbiBzZXREaXJlY3Rpb24oZGlyKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGRpcik7XG4gICAgICAgIC8vdGhpcy51cGRhdGVNYXBQaXZvdCgpO1xuICAgIH0sXG5cbiAgICBkYW1hZ2U6IGZ1bmN0aW9uIGRhbWFnZSh2YWx1ZSkge1xuICAgICAgICB2YXIgYW5pID0gdmFsdWUgPiAwO1xuICAgICAgICB0aGlzLl9zdXBlcih2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3N0YXRlQmFyLnNldEhwKHRoaXMuX2hwLCB0aGlzLl9ocE1heCwgYW5pKTtcbiAgICB9LFxuXG4gICAgYnJlYWthYmxlOiBmdW5jdGlvbiBicmVha2FibGUoKSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGFzdElucHV0QXR0YWNrS2V5KCkgPT0gQ29udHJvbEtleS5ISVQgJiYgY3VyclRpbWUgPj0gdGhpcy5fYXR0YWNrRW5kVGltZTtcbiAgICB9LFxuXG4gICAgbmVlZERpc2FwcGVhcjogZnVuY3Rpb24gbmVlZERpc2FwcGVhcigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBuZXh0QWN0aW9uOiBmdW5jdGlvbiBuZXh0QWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9ybkVuZFRpbWUgPiAwKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGN1cnJUaW1lID0gR2xvYmFsLnN5bmNUaW1lci5nZXRUaW1lcigpO1xuICAgICAgICBpZiAoIXRoaXMuY29udHJvbEVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyQWN0aW9uID09IEFjdG9yQWN0aW9uLlJFTElWRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDdXJyZW50QWN0aW9uQ29tcGxldGVUeXBlKCkgPT0gQWN0aW9uQ29tcGxldGVUeXBlLkNPTVBMRVRBQkxFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0RGlyID0gdGhpcy5nZXRMYXN0SW5wdXRNb3ZlRGlyZWN0aW9uKCk7XG4gICAgICAgIHZhciBkaXIgPSBuZXh0RGlyLnggPT09IDAgPyB0aGlzLl9kaXJlY3Rpb24gOiBuZXh0RGlyLng7XG5cbiAgICAgICAgdmFyIGF0dGFja0tleSA9IHRoaXMuZ2V0TGFzdElucHV0QXR0YWNrS2V5KCk7XG4gICAgICAgIGlmIChhdHRhY2tLZXkgIT09IENvbnRyb2xLZXkuTk9ORSAmJiBjdXJyVGltZSA+PSB0aGlzLl9hdHRhY2tFbmRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BNb3ZlKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKGF0dGFja0tleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQ29udHJvbEtleS5ISVQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGFydEhpdChkaXIpKSB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVudGVyTW92ZSgpKSB7fSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbml0aWF0aXZlTW92ZSkgdGhpcy5zdG9wTW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjaGVja0F0dGFja1Bvc3R1cmU6IGZ1bmN0aW9uIGNoZWNrQXR0YWNrUG9zdHVyZShza2lsbElkKSB7XG4gICAgICAgIGlmIChza2lsbElkID09IDApIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IEdsb2JhbC5zeW5jVGltZXIuZ2V0VGltZXIoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0QXR0YWNrU2tpbGxJZCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tTa2lsbElkID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyclRpbWUgPj0gdGhpcy5fcG9zdHVyZUJyZWFrRW5kVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc3R1cmVCcmVha0VuZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xhc3RIaXRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0Tm9ybWFsQXR0YWNrUG9zdHVyZSh0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QXR0YWNrUG9zdHVyZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NjLmxvZyhcImxhc3QgaW5kZXhcIiArIHRoaXMuX2xhc3RBdHRhY2tQb3N0dXJlSW5kZXgpO1xuICAgICAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLmdldE5vcm1hbEF0dGFja1Bvc3R1cmUodGhpcy5fbGFzdEF0dGFja1Bvc3R1cmVJbmRleCk7XG4gICAgICAgICAgICBpZiAoIXBvc3R1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0SGl0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wb3N0dXJlQnJlYWtFbmRUaW1lID0gY3VyclRpbWUgKyBwb3N0dXJlLnRpbWUgKyAwLjI7XG4gICAgICAgICAgICByZXR1cm4gcG9zdHVyZTtcbiAgICAgICAgfSBlbHNlIHt9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBnZXROb3JtYWxBdHRhY2tQb3N0dXJlOiBmdW5jdGlvbiBnZXROb3JtYWxBdHRhY2tQb3N0dXJlKGluZGV4KSB7XG4gICAgICAgIHZhciBza2lsbCA9IEdsb2JhbC5za2lsbFByb3ZpZGVyLmdldENvbmZpZygwKTtcbiAgICAgICAgaWYgKCFza2lsbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBza2lsbC5wb3N0dXJlc1tpbmRleF07XG4gICAgfSxcblxuICAgIHN0YXJ0SGl0OiBmdW5jdGlvbiBzdGFydEhpdChkaXIpIHtcbiAgICAgICAgdmFyIHBvc3R1cmUgPSB0aGlzLmNoZWNrQXR0YWNrUG9zdHVyZSgwKTtcbiAgICAgICAgaWYgKCFwb3N0dXJlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydEF0dGFjayhbcG9zdHVyZV0sIDEsIGRpcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBlbnRlck1vdmU6IGZ1bmN0aW9uIGVudGVyTW92ZSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBkaXJWZWMgPSB0aGlzLmdldExhc3RJbnB1dE1vdmVEaXJlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRpclZlYy5lcXVhbHMoY2MuVmVjMi5aRVJPKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBzcGVlZCA9IHRoaXMuY2FsY01vdmVTcGVlZChkaXJWZWMpO1xuICAgICAgICBpZiAodGhpcy5fbW92ZVN0YXJ0VGltZSA8PSAwIHx8IHNwZWVkLnggIT09IHRoaXMuX2N1cnJNb3ZlU3BlZWQueCB8fCBzcGVlZC55ICE9PSB0aGlzLl9jdXJyTW92ZVNwZWVkLnkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGRpclZlYy54KTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRNb3ZlKHNwZWVkLngsIHNwZWVkLnksIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHBsYXlSZWxpdmVFZmZlY3Q6IGZ1bmN0aW9uIHBsYXlSZWxpdmVFZmZlY3QoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVbmRlci5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucmVsaXZlRWZmZWN0VXBwZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbGl2ZUVmZmVjdFVuZGVyLnBsYXkoJ2RlZmF1bHQnKTtcbiAgICAgICAgdGhpcy5yZWxpdmVFZmZlY3RVcHBlci5wbGF5KCdkZWZhdWx0Jyk7XG4gICAgfSxcblxuICAgIGNhbGNNb3ZlU3BlZWQ6IGZ1bmN0aW9uIGNhbGNNb3ZlU3BlZWQoZGlyVmVjKSB7XG4gICAgICAgIHZhciBtb3ZlU3BlZWQgPSBuZXcgY2MuVmVjMihkaXJWZWMueCAqIHRoaXMubW92ZVNwZWVkLngsIGRpclZlYy55ICogdGhpcy5tb3ZlU3BlZWQueSk7XG4gICAgICAgIHJldHVybiBtb3ZlU3BlZWQ7XG4gICAgfSxcblxuICAgIGtleURvd246IGZ1bmN0aW9uIGtleURvd24oa2V5KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlEb3duQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuX2tleURvd25UaW1lW2tleV0gPSB0aGlzLl9rZXlEb3duQ291bnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGd1aWRlU3RlcCA9IHRoaXMubG9naWNNYW5hZ2VyLmd1aWRlU3RlcDtcbiAgICAgICAgaWYgKGd1aWRlU3RlcCA9PSBHdWlkZVN0ZXAuTU9WRSAmJiAoa2V5ID09IENvbnRyb2xLZXkuTEVGVCB8fCBrZXkgPT0gQ29udHJvbEtleS5VUCB8fCBrZXkgPT0gQ29udHJvbEtleS5ET1dOIHx8IGtleSA9PSBDb250cm9sS2V5LlJJR0hUKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dpY01hbmFnZXIuZW5kR3VpZGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChndWlkZVN0ZXAgPT0gR3VpZGVTdGVwLlRPVUNIKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJrZXkgZG93biBET19UT1VDSF9HVUlERVwiKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT0gQ29udHJvbEtleS5ISVQpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJrZXkgZG93biBET19UT1VDSF9HVUlERSBlbmRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpY01hbmFnZXIuZW5kR3VpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBrZXlVcDogZnVuY3Rpb24ga2V5VXAoa2V5KSB7XG4gICAgICAgIHRoaXMuX2tleURvd25UaW1lW2tleV0gPSAwO1xuICAgIH0sXG5cbiAgICBnZXRMYXN0SW5wdXRNb3ZlRGlyZWN0aW9uOiBmdW5jdGlvbiBnZXRMYXN0SW5wdXRNb3ZlRGlyZWN0aW9uKCkge1xuICAgICAgICB2YXIgdSA9IDAsXG4gICAgICAgICAgICB2ID0gMDtcbiAgICAgICAgdmFyIHV0ID0gMCxcbiAgICAgICAgICAgIHZ0ID0gMDtcblxuICAgICAgICBpZiAodXQgPCB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LkxFRlRdKSB7XG4gICAgICAgICAgICB1dCA9IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuTEVGVF07XG4gICAgICAgICAgICB1ID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0IDwgdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5SSUdIVF0pIHtcbiAgICAgICAgICAgIHV0ID0gdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5SSUdIVF07XG4gICAgICAgICAgICB1ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodnQgPCB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LlVQXSkge1xuICAgICAgICAgICAgdnQgPSB0aGlzLl9rZXlEb3duVGltZVtDb250cm9sS2V5LlVQXTtcbiAgICAgICAgICAgIHYgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2dCA8IHRoaXMuX2tleURvd25UaW1lW0NvbnRyb2xLZXkuRE9XTl0pIHtcbiAgICAgICAgICAgIHZ0ID0gdGhpcy5fa2V5RG93blRpbWVbQ29udHJvbEtleS5ET1dOXTtcbiAgICAgICAgICAgIHYgPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgY2MuVmVjMih1LCB2KTtcbiAgICB9LFxuXG4gICAgZ2V0TGFzdElucHV0QXR0YWNrS2V5OiBmdW5jdGlvbiBnZXRMYXN0SW5wdXRBdHRhY2tLZXkoKSB7XG4gICAgICAgIHZhciBjayA9IENvbnRyb2xLZXkuTk9ORTtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbEVuYWJsZWQpIHtcbiAgICAgICAgICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gQ29udHJvbEtleS5KVU1QOyBpIDw9IENvbnRyb2xLZXkuU0tJTEw2OyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFRpbWUgPCB0aGlzLl9rZXlEb3duVGltZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VGltZSA9IHRoaXMuX2tleURvd25UaW1lW2ldO1xuICAgICAgICAgICAgICAgICAgICBjayA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaztcbiAgICB9LFxuXG4gICAgdXBkYXRlTWFwUGl2b3Q6IGZ1bmN0aW9uIHVwZGF0ZU1hcFBpdm90KCkge1xuICAgICAgICBpZiAodGhpcy5fY3VyckFjdGlvbiA9PSBBY3RvckFjdGlvbi5SVU4pIHRoaXMuX21hcC5zZXRNYXBQb3ZpdCh0aGlzLl9kaXJlY3Rpb24gKiAtMTAwLCAwLCAyKTtlbHNlIHRoaXMuX21hcC5zZXRNYXBQb3ZpdCh0aGlzLl9kaXJlY3Rpb24gKiAxMDAsIDAsIDEpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnY2MzNjYvSjEvaEUwNFRDSEJTRkl0OHQnLCAncG9seWdsb3QnKTtcbi8vIHNjcmlwdFxcaTE4blxccG9seWdsb3QuanNcblxuLy8gICAgIChjKSAyMDEyLTIwMTYgQWlyYm5iLCBJbmMuXG4vL1xuLy8gICAgIHBvbHlnbG90LmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0Rcbi8vICAgICBsaWNlbnNlLiBGb3IgYWxsIGxpY2Vuc2luZyBpbmZvcm1hdGlvbiwgZGV0YWlscywgYW5kIGRvY3VtZW50aW9uOlxuLy8gICAgIGh0dHA6Ly9haXJibmIuZ2l0aHViLmNvbS9wb2x5Z2xvdC5qc1xuLy9cbi8vXG4vLyBQb2x5Z2xvdC5qcyBpcyBhbiBJMThuIGhlbHBlciBsaWJyYXJ5IHdyaXR0ZW4gaW4gSmF2YVNjcmlwdCwgbWFkZSB0b1xuLy8gd29yayBib3RoIGluIHRoZSBicm93c2VyIGFuZCBpbiBOb2RlLiBJdCBwcm92aWRlcyBhIHNpbXBsZSBzb2x1dGlvbiBmb3Jcbi8vIGludGVycG9sYXRpb24gYW5kIHBsdXJhbGl6YXRpb24sIGJhc2VkIG9mZiBvZiBBaXJibmInc1xuLy8gZXhwZXJpZW5jZSBhZGRpbmcgSTE4biBmdW5jdGlvbmFsaXR5IHRvIGl0cyBCYWNrYm9uZS5qcyBhbmQgTm9kZSBhcHBzLlxuLy9cbi8vIFBvbHlsZ2xvdCBpcyBhZ25vc3RpYyB0byB5b3VyIHRyYW5zbGF0aW9uIGJhY2tlbmQuIEl0IGRvZXNuJ3QgcGVyZm9ybSBhbnlcbi8vIHRyYW5zbGF0aW9uOyBpdCBzaW1wbHkgZ2l2ZXMgeW91IGEgd2F5IHRvIG1hbmFnZSB0cmFuc2xhdGVkIHBocmFzZXMgZnJvbVxuLy8geW91ciBjbGllbnQtIG9yIHNlcnZlci1zaWRlIEphdmFTY3JpcHQgYXBwbGljYXRpb24uXG5cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShyb290KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5Qb2x5Z2xvdCA9IGZhY3Rvcnkocm9vdCk7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcywgZnVuY3Rpb24gKHJvb3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciByZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG4gIC8vICMjIyBQb2x5Z2xvdCBjbGFzcyBjb25zdHJ1Y3RvclxuICBmdW5jdGlvbiBQb2x5Z2xvdChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5waHJhc2VzID0ge307XG4gICAgdGhpcy5leHRlbmQob3B0aW9ucy5waHJhc2VzIHx8IHt9KTtcbiAgICB0aGlzLmN1cnJlbnRMb2NhbGUgPSBvcHRpb25zLmxvY2FsZSB8fCAnZW4nO1xuICAgIHRoaXMuYWxsb3dNaXNzaW5nID0gISFvcHRpb25zLmFsbG93TWlzc2luZztcbiAgICB0aGlzLndhcm4gPSBvcHRpb25zLndhcm4gfHwgd2FybjtcbiAgfVxuXG4gIC8vICMjIyBWZXJzaW9uXG4gIFBvbHlnbG90LlZFUlNJT04gPSAnMS4wLjAnO1xuXG4gIC8vICMjIyBwb2x5Z2xvdC5sb2NhbGUoW2xvY2FsZV0pXG4gIC8vXG4gIC8vIEdldCBvciBzZXQgbG9jYWxlLiBJbnRlcm5hbGx5LCBQb2x5Z2xvdCBvbmx5IHVzZXMgbG9jYWxlIGZvciBwbHVyYWxpemF0aW9uLlxuICBQb2x5Z2xvdC5wcm90b3R5cGUubG9jYWxlID0gZnVuY3Rpb24gKG5ld0xvY2FsZSkge1xuICAgIGlmIChuZXdMb2NhbGUpIHRoaXMuY3VycmVudExvY2FsZSA9IG5ld0xvY2FsZTtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TG9jYWxlO1xuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC5leHRlbmQocGhyYXNlcylcbiAgLy9cbiAgLy8gVXNlIGBleHRlbmRgIHRvIHRlbGwgUG9seWdsb3QgaG93IHRvIHRyYW5zbGF0ZSBhIGdpdmVuIGtleS5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LmV4dGVuZCh7XG4gIC8vICAgICAgIFwiaGVsbG9cIjogXCJIZWxsb1wiLFxuICAvLyAgICAgICBcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwiXG4gIC8vICAgICB9KTtcbiAgLy9cbiAgLy8gVGhlIGtleSBjYW4gYmUgYW55IHN0cmluZy4gIEZlZWwgZnJlZSB0byBjYWxsIGBleHRlbmRgIG11bHRpcGxlIHRpbWVzO1xuICAvLyBpdCB3aWxsIG92ZXJyaWRlIGFueSBwaHJhc2VzIHdpdGggdGhlIHNhbWUga2V5LCBidXQgbGVhdmUgZXhpc3RpbmcgcGhyYXNlc1xuICAvLyB1bnRvdWNoZWQuXG4gIC8vXG4gIC8vIEl0IGlzIGFsc28gcG9zc2libGUgdG8gcGFzcyBuZXN0ZWQgcGhyYXNlIG9iamVjdHMsIHdoaWNoIGdldCBmbGF0dGVuZWRcbiAgLy8gaW50byBhbiBvYmplY3Qgd2l0aCB0aGUgbmVzdGVkIGtleXMgY29uY2F0ZW5hdGVkIHVzaW5nIGRvdCBub3RhdGlvbi5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LmV4dGVuZCh7XG4gIC8vICAgICAgIFwibmF2XCI6IHtcbiAgLy8gICAgICAgICBcImhlbGxvXCI6IFwiSGVsbG9cIixcbiAgLy8gICAgICAgICBcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwiLFxuICAvLyAgICAgICAgIFwic2lkZWJhclwiOiB7XG4gIC8vICAgICAgICAgICBcIndlbGNvbWVcIjogXCJXZWxjb21lXCJcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pO1xuICAvL1xuICAvLyAgICAgY29uc29sZS5sb2cocG9seWdsb3QucGhyYXNlcyk7XG4gIC8vICAgICAvLyB7XG4gIC8vICAgICAvLyAgICduYXYuaGVsbG8nOiAnSGVsbG8nLFxuICAvLyAgICAgLy8gICAnbmF2LmhlbGxvX25hbWUnOiAnSGVsbG8sICV7bmFtZX0nLFxuICAvLyAgICAgLy8gICAnbmF2LnNpZGViYXIud2VsY29tZSc6ICdXZWxjb21lJ1xuICAvLyAgICAgLy8gfVxuICAvL1xuICAvLyBgZXh0ZW5kYCBhY2NlcHRzIGFuIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCwgYHByZWZpeGAsIHdoaWNoIGNhbiBiZSB1c2VkXG4gIC8vIHRvIHByZWZpeCBldmVyeSBrZXkgaW4gdGhlIHBocmFzZXMgb2JqZWN0IHdpdGggc29tZSBzdHJpbmcsIHVzaW5nIGRvdFxuICAvLyBub3RhdGlvbi5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LmV4dGVuZCh7XG4gIC8vICAgICAgIFwiaGVsbG9cIjogXCJIZWxsb1wiLFxuICAvLyAgICAgICBcImhlbGxvX25hbWVcIjogXCJIZWxsbywgJXtuYW1lfVwiXG4gIC8vICAgICB9LCBcIm5hdlwiKTtcbiAgLy9cbiAgLy8gICAgIGNvbnNvbGUubG9nKHBvbHlnbG90LnBocmFzZXMpO1xuICAvLyAgICAgLy8ge1xuICAvLyAgICAgLy8gICAnbmF2LmhlbGxvJzogJ0hlbGxvJyxcbiAgLy8gICAgIC8vICAgJ25hdi5oZWxsb19uYW1lJzogJ0hlbGxvLCAle25hbWV9J1xuICAvLyAgICAgLy8gfVxuICAvL1xuICAvLyBUaGlzIGZlYXR1cmUgaXMgdXNlZCBpbnRlcm5hbGx5IHRvIHN1cHBvcnQgbmVzdGVkIHBocmFzZSBvYmplY3RzLlxuICBQb2x5Z2xvdC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKG1vcmVQaHJhc2VzLCBwcmVmaXgpIHtcbiAgICB2YXIgcGhyYXNlO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG1vcmVQaHJhc2VzKSB7XG4gICAgICBpZiAobW9yZVBocmFzZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBwaHJhc2UgPSBtb3JlUGhyYXNlc1trZXldO1xuICAgICAgICBpZiAocHJlZml4KSBrZXkgPSBwcmVmaXggKyAnLicgKyBrZXk7XG4gICAgICAgIGlmICh0eXBlb2YgcGhyYXNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRoaXMuZXh0ZW5kKHBocmFzZSwga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnBocmFzZXNba2V5XSA9IHBocmFzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QudW5zZXQocGhyYXNlcylcbiAgLy8gVXNlIGB1bnNldGAgdG8gc2VsZWN0aXZlbHkgcmVtb3ZlIGtleXMgZnJvbSBhIHBvbHlnbG90IGluc3RhbmNlLlxuICAvL1xuICAvLyAgICAgcG9seWdsb3QudW5zZXQoXCJzb21lX2tleVwiKTtcbiAgLy8gICAgIHBvbHlnbG90LnVuc2V0KHtcbiAgLy8gICAgICAgXCJoZWxsb1wiOiBcIkhlbGxvXCIsXG4gIC8vICAgICAgIFwiaGVsbG9fbmFtZVwiOiBcIkhlbGxvLCAle25hbWV9XCJcbiAgLy8gICAgIH0pO1xuICAvL1xuICAvLyBUaGUgdW5zZXQgbWV0aG9kIGNhbiB0YWtlIGVpdGhlciBhIHN0cmluZyAoZm9yIHRoZSBrZXkpLCBvciBhbiBvYmplY3QgaGFzaCB3aXRoXG4gIC8vIHRoZSBrZXlzIHRoYXQgeW91IHdvdWxkIGxpa2UgdG8gdW5zZXQuXG4gIFBvbHlnbG90LnByb3RvdHlwZS51bnNldCA9IGZ1bmN0aW9uIChtb3JlUGhyYXNlcywgcHJlZml4KSB7XG4gICAgdmFyIHBocmFzZTtcblxuICAgIGlmICh0eXBlb2YgbW9yZVBocmFzZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkZWxldGUgdGhpcy5waHJhc2VzW21vcmVQaHJhc2VzXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG1vcmVQaHJhc2VzKSB7XG4gICAgICAgIGlmIChtb3JlUGhyYXNlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgcGhyYXNlID0gbW9yZVBocmFzZXNba2V5XTtcbiAgICAgICAgICBpZiAocHJlZml4KSBrZXkgPSBwcmVmaXggKyAnLicgKyBrZXk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwaHJhc2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLnVuc2V0KHBocmFzZSwga2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucGhyYXNlc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QuY2xlYXIoKVxuICAvL1xuICAvLyBDbGVhcnMgYWxsIHBocmFzZXMuIFVzZWZ1bCBmb3Igc3BlY2lhbCBjYXNlcywgc3VjaCBhcyBmcmVlaW5nXG4gIC8vIHVwIG1lbW9yeSBpZiB5b3UgaGF2ZSBsb3RzIG9mIHBocmFzZXMgYnV0IG5vIGxvbmdlciBuZWVkIHRvXG4gIC8vIHBlcmZvcm0gYW55IHRyYW5zbGF0aW9uLiBBbHNvIHVzZWQgaW50ZXJuYWxseSBieSBgcmVwbGFjZWAuXG4gIFBvbHlnbG90LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBocmFzZXMgPSB7fTtcbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QucmVwbGFjZShwaHJhc2VzKVxuICAvL1xuICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgdGhlIGV4aXN0aW5nIHBocmFzZXMgd2l0aCBhIG5ldyBzZXQgb2YgcGhyYXNlcy5cbiAgLy8gTm9ybWFsbHksIGp1c3QgdXNlIGBleHRlbmRgIHRvIGFkZCBtb3JlIHBocmFzZXMsIGJ1dCB1bmRlciBjZXJ0YWluXG4gIC8vIGNpcmN1bXN0YW5jZXMsIHlvdSBtYXkgd2FudCB0byBtYWtlIHN1cmUgbm8gb2xkIHBocmFzZXMgYXJlIGx5aW5nIGFyb3VuZC5cbiAgUG9seWdsb3QucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiAobmV3UGhyYXNlcykge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmV4dGVuZChuZXdQaHJhc2VzKTtcbiAgfTtcblxuICAvLyAjIyMgcG9seWdsb3QudChrZXksIG9wdGlvbnMpXG4gIC8vXG4gIC8vIFRoZSBtb3N0LXVzZWQgbWV0aG9kLiBQcm92aWRlIGEga2V5LCBhbmQgYHRgIHdpbGwgcmV0dXJuIHRoZVxuICAvLyBwaHJhc2UuXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC50KFwiaGVsbG9cIik7XG4gIC8vICAgICA9PiBcIkhlbGxvXCJcbiAgLy9cbiAgLy8gVGhlIHBocmFzZSB2YWx1ZSBpcyBwcm92aWRlZCBmaXJzdCBieSBhIGNhbGwgdG8gYHBvbHlnbG90LmV4dGVuZCgpYCBvclxuICAvLyBgcG9seWdsb3QucmVwbGFjZSgpYC5cbiAgLy9cbiAgLy8gUGFzcyBpbiBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byBwZXJmb3JtIGludGVycG9sYXRpb24uXG4gIC8vXG4gIC8vICAgICBwb2x5Z2xvdC50KFwiaGVsbG9fbmFtZVwiLCB7bmFtZTogXCJTcGlrZVwifSk7XG4gIC8vICAgICA9PiBcIkhlbGxvLCBTcGlrZVwiXG4gIC8vXG4gIC8vIElmIHlvdSBsaWtlLCB5b3UgY2FuIHByb3ZpZGUgYSBkZWZhdWx0IHZhbHVlIGluIGNhc2UgdGhlIHBocmFzZSBpcyBtaXNzaW5nLlxuICAvLyBVc2UgdGhlIHNwZWNpYWwgb3B0aW9uIGtleSBcIl9cIiB0byBzcGVjaWZ5IGEgZGVmYXVsdC5cbiAgLy9cbiAgLy8gICAgIHBvbHlnbG90LnQoXCJpX2xpa2VfdG9fd3JpdGVfaW5fbGFuZ3VhZ2VcIiwge1xuICAvLyAgICAgICBfOiBcIkkgbGlrZSB0byB3cml0ZSBpbiAle2xhbmd1YWdlfS5cIixcbiAgLy8gICAgICAgbGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiXG4gIC8vICAgICB9KTtcbiAgLy8gICAgID0+IFwiSSBsaWtlIHRvIHdyaXRlIGluIEphdmFTY3JpcHQuXCJcbiAgLy9cbiAgUG9seWdsb3QucHJvdG90eXBlLnQgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XG4gICAgdmFyIHBocmFzZSwgcmVzdWx0O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zID09IG51bGwgPyB7fSA6IG9wdGlvbnM7XG4gICAgLy8gYWxsb3cgbnVtYmVyIGFzIGEgcGx1cmFsaXphdGlvbiBzaG9ydGN1dFxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICAgIG9wdGlvbnMgPSB7IHNtYXJ0X2NvdW50OiBvcHRpb25zIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5waHJhc2VzW2tleV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICBwaHJhc2UgPSB0aGlzLnBocmFzZXNba2V5XTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLl8gPT09ICdzdHJpbmcnKSB7XG4gICAgICBwaHJhc2UgPSBvcHRpb25zLl87XG4gICAgfSBlbHNlIGlmICh0aGlzLmFsbG93TWlzc2luZykge1xuICAgICAgcGhyYXNlID0ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLndhcm4oJ01pc3NpbmcgdHJhbnNsYXRpb24gZm9yIGtleTogXCInICsga2V5ICsgJ1wiJyk7XG4gICAgICByZXN1bHQgPSBrZXk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGhyYXNlID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucyA9IGNsb25lKG9wdGlvbnMpO1xuICAgICAgcmVzdWx0ID0gY2hvb3NlUGx1cmFsRm9ybShwaHJhc2UsIHRoaXMuY3VycmVudExvY2FsZSwgb3B0aW9ucy5zbWFydF9jb3VudCk7XG4gICAgICByZXN1bHQgPSBpbnRlcnBvbGF0ZShyZXN1bHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vICMjIyBwb2x5Z2xvdC5oYXMoa2V5KVxuICAvL1xuICAvLyBDaGVjayBpZiBwb2x5Z2xvdCBoYXMgYSB0cmFuc2xhdGlvbiBmb3IgZ2l2ZW4ga2V5XG4gIFBvbHlnbG90LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleSBpbiB0aGlzLnBocmFzZXM7XG4gIH07XG5cbiAgLy8gIyMjIyBQbHVyYWxpemF0aW9uIG1ldGhvZHNcbiAgLy8gVGhlIHN0cmluZyB0aGF0IHNlcGFyYXRlcyB0aGUgZGlmZmVyZW50IHBocmFzZSBwb3NzaWJpbGl0aWVzLlxuICB2YXIgZGVsaW1ldGVyID0gJ3x8fHwnO1xuXG4gIC8vIE1hcHBpbmcgZnJvbSBwbHVyYWxpemF0aW9uIGdyb3VwIHBsdXJhbCBsb2dpYy5cbiAgdmFyIHBsdXJhbFR5cGVzID0ge1xuICAgIGNoaW5lc2U6IGZ1bmN0aW9uIGNoaW5lc2Uobikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBnZXJtYW46IGZ1bmN0aW9uIGdlcm1hbihuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gMSA/IDEgOiAwO1xuICAgIH0sXG4gICAgZnJlbmNoOiBmdW5jdGlvbiBmcmVuY2gobikge1xuICAgICAgcmV0dXJuIG4gPiAxID8gMSA6IDA7XG4gICAgfSxcbiAgICBydXNzaWFuOiBmdW5jdGlvbiBydXNzaWFuKG4pIHtcbiAgICAgIHJldHVybiBuICUgMTAgPT09IDEgJiYgbiAlIDEwMCAhPT0gMTEgPyAwIDogbiAlIDEwID49IDIgJiYgbiAlIDEwIDw9IDQgJiYgKG4gJSAxMDAgPCAxMCB8fCBuICUgMTAwID49IDIwKSA/IDEgOiAyO1xuICAgIH0sXG4gICAgY3plY2g6IGZ1bmN0aW9uIGN6ZWNoKG4pIHtcbiAgICAgIHJldHVybiBuID09PSAxID8gMCA6IG4gPj0gMiAmJiBuIDw9IDQgPyAxIDogMjtcbiAgICB9LFxuICAgIHBvbGlzaDogZnVuY3Rpb24gcG9saXNoKG4pIHtcbiAgICAgIHJldHVybiBuID09PSAxID8gMCA6IG4gJSAxMCA+PSAyICYmIG4gJSAxMCA8PSA0ICYmIChuICUgMTAwIDwgMTAgfHwgbiAlIDEwMCA+PSAyMCkgPyAxIDogMjtcbiAgICB9LFxuICAgIGljZWxhbmRpYzogZnVuY3Rpb24gaWNlbGFuZGljKG4pIHtcbiAgICAgIHJldHVybiBuICUgMTAgIT09IDEgfHwgbiAlIDEwMCA9PT0gMTEgPyAxIDogMDtcbiAgICB9XG4gIH07XG5cbiAgLy8gTWFwcGluZyBmcm9tIHBsdXJhbGl6YXRpb24gZ3JvdXAgdG8gaW5kaXZpZHVhbCBsb2NhbGVzLlxuICB2YXIgcGx1cmFsVHlwZVRvTGFuZ3VhZ2VzID0ge1xuICAgIGNoaW5lc2U6IFsnZmEnLCAnaWQnLCAnamEnLCAna28nLCAnbG8nLCAnbXMnLCAndGgnLCAndHInLCAnemgnXSxcbiAgICBnZXJtYW46IFsnZGEnLCAnZGUnLCAnZW4nLCAnZXMnLCAnZmknLCAnZWwnLCAnaGUnLCAnaHUnLCAnaXQnLCAnbmwnLCAnbm8nLCAncHQnLCAnc3YnXSxcbiAgICBmcmVuY2g6IFsnZnInLCAndGwnLCAncHQtYnInXSxcbiAgICBydXNzaWFuOiBbJ2hyJywgJ3J1J10sXG4gICAgY3plY2g6IFsnY3MnLCAnc2snXSxcbiAgICBwb2xpc2g6IFsncGwnXSxcbiAgICBpY2VsYW5kaWM6IFsnaXMnXVxuICB9O1xuXG4gIGZ1bmN0aW9uIGxhbmdUb1R5cGVNYXAobWFwcGluZykge1xuICAgIHZhciB0eXBlLFxuICAgICAgICBsYW5ncyxcbiAgICAgICAgbCxcbiAgICAgICAgcmV0ID0ge307XG4gICAgZm9yICh0eXBlIGluIG1hcHBpbmcpIHtcbiAgICAgIGlmIChtYXBwaW5nLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgIGxhbmdzID0gbWFwcGluZ1t0eXBlXTtcbiAgICAgICAgZm9yIChsIGluIGxhbmdzKSB7XG4gICAgICAgICAgcmV0W2xhbmdzW2xdXSA9IHR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFRyaW0gYSBzdHJpbmcuXG4gIHZhciB0cmltUmUgPSAvXlxccyt8XFxzKyQvZztcbiAgZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICByZXR1cm4gcmVwbGFjZS5jYWxsKHN0ciwgdHJpbVJlLCAnJyk7XG4gIH1cblxuICAvLyBCYXNlZCBvbiBhIHBocmFzZSB0ZXh0IHRoYXQgY29udGFpbnMgYG5gIHBsdXJhbCBmb3JtcyBzZXBhcmF0ZWRcbiAgLy8gYnkgYGRlbGltZXRlcmAsIGEgYGxvY2FsZWAsIGFuZCBhIGBjb3VudGAsIGNob29zZSB0aGUgY29ycmVjdFxuICAvLyBwbHVyYWwgZm9ybSwgb3Igbm9uZSBpZiBgY291bnRgIGlzIGBudWxsYC5cbiAgZnVuY3Rpb24gY2hvb3NlUGx1cmFsRm9ybSh0ZXh0LCBsb2NhbGUsIGNvdW50KSB7XG4gICAgdmFyIHJldCwgdGV4dHMsIGNob3NlblRleHQ7XG4gICAgaWYgKGNvdW50ICE9IG51bGwgJiYgdGV4dCkge1xuICAgICAgdGV4dHMgPSB0ZXh0LnNwbGl0KGRlbGltZXRlcik7XG4gICAgICBjaG9zZW5UZXh0ID0gdGV4dHNbcGx1cmFsVHlwZUluZGV4KGxvY2FsZSwgY291bnQpXSB8fCB0ZXh0c1swXTtcbiAgICAgIHJldCA9IHRyaW0oY2hvc2VuVGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldCA9IHRleHQ7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBwbHVyYWxUeXBlTmFtZShsb2NhbGUpIHtcbiAgICB2YXIgbGFuZ1RvUGx1cmFsVHlwZSA9IGxhbmdUb1R5cGVNYXAocGx1cmFsVHlwZVRvTGFuZ3VhZ2VzKTtcbiAgICByZXR1cm4gbGFuZ1RvUGx1cmFsVHlwZVtsb2NhbGVdIHx8IGxhbmdUb1BsdXJhbFR5cGUuZW47XG4gIH1cblxuICBmdW5jdGlvbiBwbHVyYWxUeXBlSW5kZXgobG9jYWxlLCBjb3VudCkge1xuICAgIHJldHVybiBwbHVyYWxUeXBlc1twbHVyYWxUeXBlTmFtZShsb2NhbGUpXShjb3VudCk7XG4gIH1cblxuICAvLyAjIyMgaW50ZXJwb2xhdGVcbiAgLy9cbiAgLy8gRG9lcyB0aGUgZGlydHkgd29yay4gQ3JlYXRlcyBhIGBSZWdFeHBgIG9iamVjdCBmb3IgZWFjaFxuICAvLyBpbnRlcnBvbGF0aW9uIHBsYWNlaG9sZGVyLlxuICB2YXIgZG9sbGFyUmVnZXggPSAvXFwkL2c7XG4gIHZhciBkb2xsYXJCaWxsc1lhbGwgPSAnJCQkJCc7XG4gIGZ1bmN0aW9uIGludGVycG9sYXRlKHBocmFzZSwgb3B0aW9ucykge1xuICAgIGZvciAodmFyIGFyZyBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAoYXJnICE9PSAnXycgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShhcmcpKSB7XG4gICAgICAgIC8vIEVuc3VyZSByZXBsYWNlbWVudCB2YWx1ZSBpcyBlc2NhcGVkIHRvIHByZXZlbnQgc3BlY2lhbCAkLXByZWZpeGVkXG4gICAgICAgIC8vIHJlZ2V4IHJlcGxhY2UgdG9rZW5zLiB0aGUgXCIkJCQkXCIgaXMgbmVlZGVkIGJlY2F1c2UgZWFjaCBcIiRcIiBuZWVkcyB0b1xuICAgICAgICAvLyBiZSBlc2NhcGVkIHdpdGggXCIkXCIgaXRzZWxmLCBhbmQgd2UgbmVlZCB0d28gaW4gdGhlIHJlc3VsdGluZyBvdXRwdXQuXG4gICAgICAgIHZhciByZXBsYWNlbWVudCA9IG9wdGlvbnNbYXJnXTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXBsYWNlbWVudCA9IHJlcGxhY2UuY2FsbChvcHRpb25zW2FyZ10sIGRvbGxhclJlZ2V4LCBkb2xsYXJCaWxsc1lhbGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAgIC8vIHN0cmluZyByZXBsYWNlIHNvIHRoYXQgdGhlIHNhbWUgYXJndW1lbnQgY2FuIGJlIHJlcGxhY2VkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cbiAgICAgICAgcGhyYXNlID0gcmVwbGFjZS5jYWxsKHBocmFzZSwgbmV3IFJlZ0V4cCgnJVxcXFx7JyArIGFyZyArICdcXFxcfScsICdnJyksIHJlcGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBocmFzZTtcbiAgfVxuXG4gIC8vICMjIyB3YXJuXG4gIC8vXG4gIC8vIFByb3ZpZGVzIGEgd2FybmluZyBpbiB0aGUgY29uc29sZSBpZiBhIHBocmFzZSBrZXkgaXMgbWlzc2luZy5cbiAgZnVuY3Rpb24gd2FybihtZXNzYWdlKSB7XG4gICAgcm9vdC5jb25zb2xlICYmIHJvb3QuY29uc29sZS53YXJuICYmIHJvb3QuY29uc29sZS53YXJuKCdXQVJOSU5HOiAnICsgbWVzc2FnZSk7XG4gIH1cblxuICAvLyAjIyMgY2xvbmVcbiAgLy9cbiAgLy8gQ2xvbmUgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiBjbG9uZShzb3VyY2UpIHtcbiAgICB2YXIgcmV0ID0ge307XG4gICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgIHJldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHJldHVybiBQb2x5Z2xvdDtcbn0pO1xuLy9cblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzMyMzhmWkV0ejFQZXArOXZyT1lyeVdqJywgJ3JlbGl2ZV9jb25maXJtJyk7XG4vLyBzY3JpcHRcXHVpXFxyZWxpdmVfY29uZmlybS5qc1xuXG52YXIgdGltZXNNYXBDb2luID0gWzEwLCAzMCwgNTBdO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJldHJ5QnV0dG9uOiBjYy5Ob2RlLFxuICAgICAgICByZXR1cm5CdXR0b246IGNjLk5vZGUsXG4gICAgICAgIHJldHJ5Q291bnRMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIG5lZWRDb2luTGFiZWw6IGNjLkxhYmVsLFxuICAgICAgICBnb2xkQ291bnRMYWJlbDogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VpQ3RybCA9IHRoaXMuZ2V0Q29tcG9uZW50KCd1aV9jdHJsJyk7XG4gICAgICAgIHRoaXMuX3JldHJ5Q291bnQgPSAzIC0gdGhpcy5fdWlDdHJsLmFyZ3MucmV0cnlDb3VudDtcbiAgICAgICAgdGhpcy5fa2lsbE51bSA9IHRoaXMuX3VpQ3RybC5hcmdzLmtpbGxOdW07XG4gICAgICAgIHRoaXMuX3JvdW5kTnVtID0gdGhpcy5fdWlDdHJsLmFyZ3Mucm91bmROdW07XG4gICAgICAgIC8qaWYgKHRoaXMuX3JldHJ5Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICB0aGlzLnJldHJ5QnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJldHVybkJ1dHRvbi54ID0gMDsqL1xuICAgICAgICB2YXIgbmVlZENvaW4gPSB0aW1lc01hcENvaW5bdGhpcy5fcmV0cnlDb3VudF07XG4gICAgICAgIHRoaXMucmV0cnlDb3VudExhYmVsLnN0cmluZyA9IHRoaXMuX3VpQ3RybC5hcmdzLnJldHJ5Q291bnQudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5nb2xkQ291bnRMYWJlbC5zdHJpbmcgPSBjYy5qcy5mb3JtYXRTdHIoR2FtZUxhbmcudCgnb3duX2dvbGRfbnVtX2Zvcm1hdCcpLCBHbG9iYWwuYWNjb3VudE1vZHVsZS5nb2xkTnVtKTtcbiAgICAgICAgdGhpcy5uZWVkQ29pbkxhYmVsLnN0cmluZyA9IG5lZWRDb2luLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50SGFuZGxlcihHYW1lRXZlbnQuT05fRVhDSEFOR0VfR09MRCwgdGhpcy5vbkV4Y2hhbmdlU3VjY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fY29udGludWVIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9CVVlfVElNRV9UT19QTEFZLCB0aGlzLm9uQ29udGludWVHYW1lLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9yZXN1bHRIYW5kbGVyID0gR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIuYWRkRXZlbnRIYW5kbGVyKEdhbWVFdmVudC5PTl9HQU1FX1JFU1VMVCwgdGhpcy5vblJlc3VsdEdhbWUuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBHbG9iYWwuZ2FtZUV2ZW50RGlzcGF0Y2hlci5yZW1vdmVFdmVudEhhbmRsZXIodGhpcy5fZXhjaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgR2xvYmFsLmdhbWVFdmVudERpc3BhdGNoZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHRoaXMuX2NvbnRpbnVlSGFuZGxlcik7XG4gICAgICAgIEdsb2JhbC5nYW1lRXZlbnREaXNwYXRjaGVyLnJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9yZXN1bHRIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5fcmVzdWx0SGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2V4Y2hhbmdlSGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlSGFuZGxlciA9IG51bGw7XG4gICAgfSxcblxuICAgIG9uRXhjaGFuZ2VTdWNjZXNzOiBmdW5jdGlvbiBvbkV4Y2hhbmdlU3VjY2VzcygpIHtcbiAgICAgICAgdmFyIG5lZWRDb2luID0gdGltZXNNYXBDb2luW3RoaXMuX3JldHJ5Q291bnRdO1xuICAgICAgICBpZiAoR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bSA+PSBuZWVkQ29pbikge1xuICAgICAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmJ1eVRpbWVUb1BsYXlHYW1lKHRoaXMuX3JldHJ5Q291bnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUmVzdWx0R2FtZTogZnVuY3Rpb24gb25SZXN1bHRHYW1lKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdtaXNzaW9uX2ZhaWwnLCB7IGtpbGxOdW06IHRoaXMuX2tpbGxOdW0sIHJvdW5kTnVtOiB0aGlzLl9yb3VuZE51bSB9KTtcbiAgICB9LFxuXG4gICAgb25Db250aW51ZUdhbWU6IGZ1bmN0aW9uIG9uQ29udGludWVHYW1lKCkge1xuICAgICAgICB0aGlzLl91aUN0cmwuY2xvc2UoKTtcbiAgICB9LFxuXG4gICAgb25SZXRyeUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHJ5QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIEdhbWVVdGlsLnBsYXlCdXR0b25Tb3VuZCgpO1xuICAgICAgICB2YXIgbmVlZENvaW4gPSB0aW1lc01hcENvaW5bdGhpcy5fcmV0cnlDb3VudF07XG4gICAgICAgIHZhciBvd25Db2luID0gR2xvYmFsLmFjY291bnRNb2R1bGUuZ29sZE51bTtcbiAgICAgICAgaWYgKG93bkNvaW4gPCBuZWVkQ29pbikge1xuICAgICAgICAgICAgdGhpcy5fdWlDdHJsLm1hbmFnZXIub3BlblVJKCdjb2luX25vdF9lbm91Z2gnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdhbWVScGMuQ2x0MlNydi5idXlUaW1lVG9QbGF5R2FtZSh0aGlzLl9yZXRyeUNvdW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJldHVybkJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBvblJldHVybkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICBHYW1lVXRpbC5wbGF5QnV0dG9uU291bmQoKTtcbiAgICAgICAgdmFyIG1heFNjb3JlID0gcGFyc2VJbnQodGhpcy5fa2lsbE51bSArIDEgKyBcIjBcIiArIHRoaXMuX3JvdW5kTnVtKTtcbiAgICAgICAgR2FtZVJwYy5DbHQyU3J2LmdhbWVSZXN1bHQobWF4U2NvcmUpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDI2OGFMeXd4RkNBN3FOUWNSQ0tZYzcnLCAncm91bmRfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxyb3VuZF9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbnVtYmVyczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5QcmVmYWJdXG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbnVtcyA9IFtdO1xuICAgICAgICB0aGlzLl9hbmkgPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICB0aGlzLnJvdW5kLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzZXRSb3VuZDogZnVuY3Rpb24gc2V0Um91bmQodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIDtlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7ZWxzZSByZXR1cm47XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuX251bXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIG9sZE5vZGUgPSB0aGlzLl9udW1zLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TZXF1ZW5jZShuZXcgY2MuRmFkZU91dCgwLjUpLCBuZXcgY2MuQ2FsbEZ1bmMoZnVuY3Rpb24gKHRhcmdldCwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGRhdGEucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBkYXRhLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0sIG51bGwsIG9sZE5vZGUpKTtcbiAgICAgICAgICAgIG9sZE5vZGUucnVuQWN0aW9uKGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9udW1zLnNwbGljZSgwLCB0aGlzLl9udW1zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2FuaS5zdG9wKCk7XG4gICAgICAgIHRoaXMucm91bmQuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgdmFyIHRvdGFsV2lkdGggPSAwO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2gobmV3IGNjLmRlbGF5VGltZSgwLjIpKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChuZXcgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUludCh2YWx1ZS5jaGFyQXQoaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZmFiID0gc2VsZi5udW1iZXJzW251bV07XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgICAgIG5vZGUueCA9IHRvdGFsV2lkdGg7XG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBzZWxmLm5vZGU7XG4gICAgICAgICAgICAgICAgdG90YWxXaWR0aCArPSBub2RlLndpZHRoO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgc2VsZi5fbnVtcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGFjdGlvbnMucHVzaChuZXcgY2MuZGVsYXlUaW1lKDAuMikpO1xuICAgICAgICBhY3Rpb25zLnB1c2gobmV3IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYucm91bmQuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYucm91bmQueCA9IHRvdGFsV2lkdGggLSAzNTtcbiAgICAgICAgICAgIHNlbGYuX2FuaS5wbGF5KCdyb3VuZF9pbWcnKTtcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihuZXcgY2MuU2VxdWVuY2UoYWN0aW9ucykpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2VkMjkxTjNpMXREVTdYMGYwQkRwY0U2JywgJ3NraWxsX2NmZycpO1xuLy8gc2NyaXB0XFxjb25maWdcXGRhdGFcXHNraWxsX2NmZy5qc1xuXG4vKlxyXG5hY3RUeXBlIOexu+Wei+ivtOaYju+8mlxyXG4gICAgMTog5YGa5oiQ5Lyk5a6zIOW/heWhq+Wtl+autShhY3RWYWx1ZSByYW5hZ2UpXHJcbiAgICAyOiDoh6rouqvmlr3liqDnoaznm7Qg5b+F5aGr5a2X5q61KGFjdFZhbHVlKVxyXG4gICAgMzog6ZyH5bGPXHJcbiAgICA0OiDmkq3mlL7nibnmlYhcclxuKi9cblxubW9kdWxlLmV4cG9ydHMuZGF0YSA9IFt7XG4gICAgaWQ6IDAsXG4gICAgcG9zdHVyZXM6IFt7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBhY3Rpb25JbmRleDogMSxcbiAgICAgICAgdGltZTogMC4zLFxuICAgICAgICB0aW1lUG9pbnRzOiBbe1xuICAgICAgICAgICAgYWN0VHlwZTogMSxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLjI1LFxuICAgICAgICAgICAgYWN0VmFsdWU6IFsyMF0sXG4gICAgICAgICAgICByYW5nZTogbmV3IGNjLlJlY3QoMzAsIDg4LCAzOCwgMjkpLFxuICAgICAgICAgICAgYXR0YWNrVHlwZTogMSxcbiAgICAgICAgICAgIHNvdW5kOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDIsIC8vMuS7o+ihqOWvueiHqui6q+aWveWKoOehrOebtFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzAuM11cbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiAyLFxuICAgICAgICBhY3Rpb25JbmRleDogMixcbiAgICAgICAgdGltZTogMC40LFxuICAgICAgICB0aW1lUG9pbnRzOiBbe1xuICAgICAgICAgICAgYWN0VHlwZTogMSxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLjIsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzIyXSxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgY2MuUmVjdCgzMywgOTgsIDMwLCA0NSksXG4gICAgICAgICAgICBhdHRhY2tUeXBlOiAyLFxuICAgICAgICAgICAgYXR0YWNrUGFyYW06IHsgdG9wVGltZTogMC40LCB0b3BIZWlnaHQ6IDEwMCwgZGlzdGFuY2U6IDMwLCBjb21ibzogMzUgfSxcbiAgICAgICAgICAgIHNvdW5kOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDIsIC8vMuS7o+ihqOWvueiHqui6q+aWveWKoOehrOebtFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzAuNF1cbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiAzLFxuICAgICAgICBhY3Rpb25JbmRleDogMyxcbiAgICAgICAgdGltZTogMC41LFxuICAgICAgICBlZmZlY3RUaW1lUG9pbnQ6IDAsXG4gICAgICAgIHRpbWVQb2ludHM6IFt7XG4gICAgICAgICAgICBhY3RUeXBlOiAxLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAuMjUsXG4gICAgICAgICAgICBhY3RWYWx1ZTogWzI2XSxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgY2MuUmVjdCg0MSwgNzgsIDkwLCAzMyksXG4gICAgICAgICAgICBhdHRhY2tUeXBlOiAyLFxuICAgICAgICAgICAgYXR0YWNrUGFyYW06IHsgdG9wVGltZTogMC40LCB0b3BIZWlnaHQ6IDIwLCBkaXN0YW5jZTogMzAwLCBjb21ibzogNzAgfSxcbiAgICAgICAgICAgIHNvdW5kOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDIsXG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMC41XVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiAzLFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAuMjVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYWN0VHlwZTogNCxcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgbGF5ZXI6IDEsXG4gICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiA0LFxuICAgICAgICAgICAgdGFrZVRpbWU6IDAsXG4gICAgICAgICAgICBsYXllcjogMCxcbiAgICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgICAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGFjdFR5cGU6IDQsXG4gICAgICAgICAgICB0YWtlVGltZTogMCxcbiAgICAgICAgICAgIGxheWVyOiAxLFxuICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICBwb3NpdGlvbjogeyB4OiAwLCB5OiAwIH1cbiAgICAgICAgfV1cbiAgICB9XVxufSwge1xuICAgIGlkOiAxLFxuICAgIHBvc3R1cmVzOiBbe1xuICAgICAgICBpZDogMSxcbiAgICAgICAgYWN0aW9uSW5kZXg6IDEsXG4gICAgICAgIHRpbWU6IDAuMyxcbiAgICAgICAgdGltZVBvaW50czogW3tcbiAgICAgICAgICAgIGFjdFR5cGU6IDEsXG4gICAgICAgICAgICB0YWtlVGltZTogMC4yNSxcbiAgICAgICAgICAgIGFjdFZhbHVlOiBbMjBdLFxuICAgICAgICAgICAgcmFuZ2U6IG5ldyBjYy5SZWN0KDMwLCA4OCwgMzgsIDI5KSxcbiAgICAgICAgICAgIGF0dGFja1R5cGU6IDEsXG4gICAgICAgICAgICBzb3VuZDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhY3RUeXBlOiAyLCAvLzLku6Pooajlr7noh6rouqvmlr3liqDnoaznm7RcbiAgICAgICAgICAgIHRha2VUaW1lOiAwLFxuICAgICAgICAgICAgYWN0VmFsdWU6IFswLjNdXG4gICAgICAgIH1dXG4gICAgfV1cbn1dO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzdmMzQycDJiRkZLcUFKSkI0eGtaZzAnLCAnc2tpbGxfZGVmaW5lJyk7XG4vLyBzY3JpcHRcXGFjdG9yXFxza2lsbF9kZWZpbmUuanNcblxubW9kdWxlLmV4cG9ydHMuVGltZVBvaW50QWN0VHlwZSA9IHtcbiAgICBEQU1BR0U6IDEsXG4gICAgU0VMRl9ERUxBWTogMixcbiAgICBTSE9DS19TQ1JFRU46IDMsXG4gICAgUExBWV9FRkZFQ1Q6IDRcbn07XG5cbm1vZHVsZS5leHBvcnRzLkF0dGFja1R5cGUgPSB7XG4gICAgTk9STUFMOiAxLFxuICAgIEZMWTogMlxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzNlYmUzdjlnQ1JOYnFvRjZnZmNHNU1zJywgJ3NraWxsX3Byb3ZpZGVyJyk7XG4vLyBzY3JpcHRcXGNvbmZpZ1xccHJvdmlkZXJcXHNraWxsX3Byb3ZpZGVyLmpzXG5cbnZhciBjZmcgPSByZXF1aXJlKCdza2lsbF9jZmcnKS5kYXRhO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRDb25maWc6IGZ1bmN0aW9uIGdldENvbmZpZyhpZCkge1xuICAgICAgICByZXR1cm4gY2ZnW2lkXTtcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTFiZTBiUHVXeEdVYVNPWFhIRm16cG4nLCAnc3RhdGVfY3RybCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcYmF0dGxlXFxzdGF0ZV9jdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBocEFscGhhOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBocExpZ2h0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBuYW1lTGFiZWw6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBtb3ZlVGltZTogM1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2RlbGF5VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3N0YXJ0V2lkdGggPSAwO1xuICAgICAgICB0aGlzLl90YXJnZXRXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX21heFdpZHRoID0gdGhpcy5ocExpZ2h0LndpZHRoO1xuICAgIH0sXG5cbiAgICBzZXROYW1lOiBmdW5jdGlvbiBzZXROYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gbmFtZTtcbiAgICB9LFxuXG4gICAgc2V0SHA6IGZ1bmN0aW9uIHNldEhwKGhwLCBtYXgsIGFuaSkge1xuICAgICAgICBpZiAoaHAgPCAwKSBocCA9IDA7XG4gICAgICAgIGlmIChtYXggPCAxKSBtYXggPSAxO1xuICAgICAgICB2YXIgcGVyY2VudCA9IGhwIC8gbWF4O1xuICAgICAgICB2YXIgd2lkdGggPSBwZXJjZW50ICogdGhpcy5fbWF4V2lkdGg7XG4gICAgICAgIGlmICghYW5pKSB7XG4gICAgICAgICAgICB0aGlzLmhwQWxwaGEud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaHBMaWdodC53aWR0aCA9IHdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ocExpZ2h0LndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFdpZHRoID0gdGhpcy5ocEFscGhhLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0V2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl9kZWxheVRpbWUgPSAodGhpcy5fc3RhcnRXaWR0aCAtIHRoaXMuX3RhcmdldFdpZHRoKSAvIHRoaXMuX21heFdpZHRoICogdGhpcy5tb3ZlVGltZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWxheVRpbWUgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgLT0gZHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGVsYXlUaW1lIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSB0aGlzLl90aW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhwTGlnaHQud2lkdGggPSB0aGlzLl90YXJnZXRXaWR0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzLl90aW1lIC0gdGhpcy5fZGVsYXlUaW1lOyAvLyB0aGlzLm1vdmVUaW1lO1xuICAgICAgICAgICAgICAgIHZhciBkID0gdGhpcy5fbWF4V2lkdGggKiBlIC8gdGhpcy5tb3ZlVGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhwQWxwaGEud2lkdGggPSB0aGlzLl9zdGFydFdpZHRoIC0gZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjQzYjF0UkJ3NUhtcnFrUHRNVVQyM3UnLCAnc3luY190aW1lcicpO1xuLy8gc2NyaXB0XFx0aW1lclxcc3luY190aW1lci5qc1xuXG5tb2R1bGUuZXhwb3J0c1tcImNsYXNzXCJdID0gY2MuQ2xhc3Moe1xuICAgIGN0b3I6IGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3RpY2sgPSAwO1xuICAgICAgICB0aGlzLl9vcmdpblRpY2sgPSAwO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3RpY2sgPSAwO1xuICAgICAgICB0aGlzLl9vcmdpblRpY2sgPSAwO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLl90aWNrICs9IGR0O1xuICAgICAgICB0aGlzLl9vcmdpblRpY2sgKz0gZHQ7XG4gICAgfSxcblxuICAgIGdldFRpbWVyOiBmdW5jdGlvbiBnZXRUaW1lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpY2s7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxNGNhMGZJcVlSQU03ZGY5QUJ6MTYwUScsICd0ZXN0X21hcCcpO1xuLy8gc2NyaXB0XFxzY2VuZVxcdGVzdF9tYXAuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGVkaXQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcblxuICAgICAgICBhYmM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvU291cmNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgdGhpcy5fcm91bmROdW0gPSB0aGlzLnJvdW5kLmdldENvbXBvbmVudCgncm91bmRfY3RybCcpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIC8vY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKCdyZXNvdXJjZXMvc291bmQvYmcnLCB0cnVlKTtcbiAgICAgICAgLy90aGlzLl9tYXAubG9ja1JlZ2lvbiA9IG5ldyBjYy5SZWN0KDAsIDAsIDE1MDAsIDY0MCk7XG4gICAgICAgIC8vdGhpcy5fbWFwLnNldE1hcFBvdml0KC0xMDAsIDAsIDEpO1xuICAgIH0sXG5cbiAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuICAgICAgICAvL2NjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYygncmVzb3VyY2VzL3NvdW5kL2JnJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWJjLnBsYXkoKTtcbiAgICAgICAgLy9jYy5sb2FkZXIubG9hZFJlcygnc291bmQvYmcnLCBjYy5BdWRpb0NsaXAsIGZ1bmN0aW9uIChlcnIsIGNsaXApIHtcbiAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKCdyZXNvdXJjZXMvc291bmQvYmcubXAzJyk7XG4gICAgICAgIC8vICAgIGNjLmxvZygncHBwOiAnLCBlcnIsIGNsaXApO1xuICAgICAgICAvL30pO1xuICAgICAgICB0aGlzLl9yb3VuZE51bS5zZXRSb3VuZCh0aGlzLmVkaXQuc3RyaW5nKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBjYy5sb2codGhpcy5hYmMuaXNQbGF5aW5nKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzExMmFiYXpkWEpIRjVBbVl0Q3RvMmdzJywgJ3RpbWVfdXRpbCcpO1xuLy8gc2NyaXB0XFx1dGlsXFx0aW1lX3V0aWwuanNcblxuZnVuY3Rpb24gZmlsbFplcm8odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPiA5ID8gdmFsdWUudG9TdHJpbmcoKSA6ICcwJyArIHZhbHVlLnRvU3RyaW5nKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgc2VjVG9NUzogZnVuY3Rpb24gc2VjVG9NUyhzZWMpIHtcbiAgICAgICAgdmFyIHMgPSBzZWMgJSA2MDtcbiAgICAgICAgdmFyIG0gPSAoc2VjIC0gcykgLyA2MDtcbiAgICAgICAgdmFyIHJldCA9IGNjLmpzLmZvcm1hdFN0cihcIiVzOiVzXCIsIGZpbGxaZXJvKG0pLCBmaWxsWmVybyhzKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHNlY1RvSE1TOiBmdW5jdGlvbiBzZWNUb0hNUyhzZWMpIHtcbiAgICAgICAgdmFyIHQgPSBzZWMgJSAzNjAwO1xuICAgICAgICB2YXIgaCA9IChzZWMgLSB0KSAvIDM2MDA7XG4gICAgICAgIHZhciBzID0gdCAlIDYwO1xuICAgICAgICB2YXIgbSA9ICh0IC0gcykgLyA2MDtcbiAgICAgICAgdmFyIHJldCA9IGNjLmpzLmZvcm1hdFN0cihcIiVzOiVzOiVzXCIsIGZpbGxaZXJvKGgpLCBmaWxsWmVybyhtKSwgZmlsbFplcm8ocykpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2QyYzk5aitIcmROQTZtZkdKdGpuNW1QJywgJ3VpX2N0cmwnKTtcbi8vIHNjcmlwdFxcdWlcXHVpX2N0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlkOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcmdzID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtYW5hZ2VyOiB7XG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChtYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFuYWdlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5faWQgPSAtMTtcbiAgICB9LFxuXG4gICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIuY2xvc2VVSSh0aGlzLm5vZGUpO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0ZTU0MkdYQ1JwRUtvbFBFdUxGZ1FNVCcsICd1aV9tYW5hZ2VyJyk7XG4vLyBzY3JpcHRcXHVpXFx1aV9tYW5hZ2VyLmpzXG5cbnZhciBCdWZmZXJUYWJsZSA9IHJlcXVpcmUoJ2J1ZmZlcl90YWJsZScpWydjbGFzcyddO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVpQ29udGFpbmVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gW107XG4gICAgfSxcblxuICAgIG9wZW5VSTogZnVuY3Rpb24gb3BlblVJKG5hbWUsIGFyZ3MpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcygncHJlZmFiL3VpLycgKyBuYW1lLCBjYy5QcmVmYWIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgdmFyIGlkID0gc2VsZi5fdGFibGUucHVzaChub2RlKTtcbiAgICAgICAgICAgIHZhciBjdHJsID0gbm9kZS5nZXRDb21wb25lbnQoJ3VpX2N0cmwnKTtcbiAgICAgICAgICAgIGN0cmwuaWQgPSBpZDtcbiAgICAgICAgICAgIGN0cmwuYXJncyA9IGFyZ3M7XG4gICAgICAgICAgICBjdHJsLm1hbmFnZXIgPSBzZWxmO1xuICAgICAgICAgICAgc2VsZi51aUNvbnRhaW5lci5hZGRDaGlsZChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNsb3NlVUk6IGZ1bmN0aW9uIGNsb3NlVUkobm9kZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3RhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9PSB0aGlzLl90YWJsZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZUFsbDogZnVuY3Rpb24gY2xvc2VBbGwoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl90YWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX3RhYmxlLnBvcCgpO1xuICAgICAgICAgICAgaWYgKG5vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzU1ZjMxdEg3aHROWDc5U1ArcU5IQTFGJywgJ3h4dGVhJyk7XG4vLyBzY3JpcHRcXGxpYlxcdGhpcmRcXHh4dGVhXFx4eHRlYS5qc1xuXG5mdW5jdGlvbiB1dGYxNnRvOChzdHIpIHtcbiAgICB2YXIgb3V0LCBpLCBsZW4sIGM7XG4gICAgb3V0ID0gW107XG4gICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA+PSAweDAwMDEgJiYgYyA8PSAweDAwN0YpIHtcbiAgICAgICAgICAgIG91dFtpXSA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYyA+IDB4MDdGRikge1xuICAgICAgICAgICAgb3V0W2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEUwIHwgYyA+PiAxMiAmIDB4MEYsIDB4ODAgfCBjID4+IDYgJiAweDNGLCAweDgwIHwgYyA+PiAwICYgMHgzRik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4QzAgfCBjID4+IDYgJiAweDFGLCAweDgwIHwgYyA+PiAwICYgMHgzRik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cbmZ1bmN0aW9uIHV0Zjh0bzE2KHN0cikge1xuICAgIHZhciBvdXQsIGksIGxlbiwgYztcbiAgICB2YXIgY2hhcjIsIGNoYXIzO1xuICAgIG91dCA9IFtdO1xuICAgIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIHN3aXRjaCAoYyA+PiA0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gc3RyLmNoYXJBdChpIC0gMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICBjaGFyMiA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYyAmIDB4MUYpIDw8IDYgfCBjaGFyMiAmIDB4M0YpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICBjaGFyMiA9IHN0ci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgICAgICAgICAgY2hhcjMgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgJiAweDBGKSA8PCAxMiB8IChjaGFyMiAmIDB4M0YpIDw8IDYgfCAoY2hhcjMgJiAweDNGKSA8PCAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxudmFyIGJhc2U2NEVuY29kZUNoYXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCI7XG52YXIgYmFzZTY0RGVjb2RlQ2hhcnMgPSBuZXcgQXJyYXkoLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDYyLCAtMSwgLTEsIC0xLCA2MywgNTIsIDUzLCA1NCwgNTUsIDU2LCA1NywgNTgsIDU5LCA2MCwgNjEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOSwgMjAsIDIxLCAyMiwgMjMsIDI0LCAyNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMjYsIDI3LCAyOCwgMjksIDMwLCAzMSwgMzIsIDMzLCAzNCwgMzUsIDM2LCAzNywgMzgsIDM5LCA0MCwgNDEsIDQyLCA0MywgNDQsIDQ1LCA0NiwgNDcsIDQ4LCA0OSwgNTAsIDUxLCAtMSwgLTEsIC0xLCAtMSwgLTEpO1xuZnVuY3Rpb24gYmFzZTY0ZW5jb2RlKHN0cikge1xuICAgIHZhciBvdXQsIGksIGxlbjtcbiAgICB2YXIgYzEsIGMyLCBjMztcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGkgPSAwO1xuICAgIG91dCA9IFwiXCI7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgYzEgPSBzdHIuY2hhckNvZGVBdChpKyspICYgMHhmZjtcbiAgICAgICAgaWYgKGkgPT0gbGVuKSB7XG4gICAgICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KGMxID4+IDIpO1xuICAgICAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdCgoYzEgJiAweDMpIDw8IDQpO1xuICAgICAgICAgICAgb3V0ICs9IFwiPT1cIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGMyID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgaWYgKGkgPT0gbGVuKSB7XG4gICAgICAgICAgICBvdXQgKz0gYmFzZTY0RW5jb2RlQ2hhcnMuY2hhckF0KGMxID4+IDIpO1xuICAgICAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdCgoYzEgJiAweDMpIDw8IDQgfCAoYzIgJiAweEYwKSA+PiA0KTtcbiAgICAgICAgICAgIG91dCArPSBiYXNlNjRFbmNvZGVDaGFycy5jaGFyQXQoKGMyICYgMHhGKSA8PCAyKTtcbiAgICAgICAgICAgIG91dCArPSBcIj1cIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGMzID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdChjMSA+PiAyKTtcbiAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdCgoYzEgJiAweDMpIDw8IDQgfCAoYzIgJiAweEYwKSA+PiA0KTtcbiAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdCgoYzIgJiAweEYpIDw8IDIgfCAoYzMgJiAweEMwKSA+PiA2KTtcbiAgICAgICAgb3V0ICs9IGJhc2U2NEVuY29kZUNoYXJzLmNoYXJBdChjMyAmIDB4M0YpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuZnVuY3Rpb24gYmFzZTY0ZGVjb2RlKHN0cikge1xuICAgIHZhciBjMSwgYzIsIGMzLCBjNDtcbiAgICB2YXIgaSwgbGVuLCBvdXQ7XG4gICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpID0gMDtcbiAgICBvdXQgPSBcIlwiO1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGMxID0gYmFzZTY0RGVjb2RlQ2hhcnNbc3RyLmNoYXJDb2RlQXQoaSsrKSAmIDB4ZmZdO1xuICAgICAgICB9IHdoaWxlIChpIDwgbGVuICYmIGMxID09IC0xKTtcbiAgICAgICAgaWYgKGMxID09IC0xKSBicmVhaztcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYzIgPSBiYXNlNjREZWNvZGVDaGFyc1tzdHIuY2hhckNvZGVBdChpKyspICYgMHhmZl07XG4gICAgICAgIH0gd2hpbGUgKGkgPCBsZW4gJiYgYzIgPT0gLTEpO1xuICAgICAgICBpZiAoYzIgPT0gLTEpIGJyZWFrO1xuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSA8PCAyIHwgKGMyICYgMHgzMCkgPj4gNCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGMzID0gc3RyLmNoYXJDb2RlQXQoaSsrKSAmIDB4ZmY7XG4gICAgICAgICAgICBpZiAoYzMgPT0gNjEpIHJldHVybiBvdXQ7XG4gICAgICAgICAgICBjMyA9IGJhc2U2NERlY29kZUNoYXJzW2MzXTtcbiAgICAgICAgfSB3aGlsZSAoaSA8IGxlbiAmJiBjMyA9PSAtMSk7XG4gICAgICAgIGlmIChjMyA9PSAtMSkgYnJlYWs7XG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChjMiAmIDBYRikgPDwgNCB8IChjMyAmIDB4M0MpID4+IDIpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjNCA9IHN0ci5jaGFyQ29kZUF0KGkrKykgJiAweGZmO1xuICAgICAgICAgICAgaWYgKGM0ID09IDYxKSByZXR1cm4gb3V0O1xuICAgICAgICAgICAgYzQgPSBiYXNlNjREZWNvZGVDaGFyc1tjNF07XG4gICAgICAgIH0gd2hpbGUgKGkgPCBsZW4gJiYgYzQgPT0gLTEpO1xuICAgICAgICBpZiAoYzQgPT0gLTEpIGJyZWFrO1xuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYzMgJiAweDAzKSA8PCA2IHwgYzQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuZnVuY3Rpb24gbG9uZzJzdHIodiwgdykge1xuICAgIHZhciB2bCA9IHYubGVuZ3RoO1xuICAgIHZhciBzbCA9IHZbdmwgLSAxXSAmIDB4ZmZmZmZmZmY7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bDsgaSsrKSB7XG4gICAgICAgIHZbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZbaV0gJiAweGZmLCB2W2ldID4+PiA4ICYgMHhmZiwgdltpXSA+Pj4gMTYgJiAweGZmLCB2W2ldID4+PiAyNCAmIDB4ZmYpO1xuICAgIH1cbiAgICBpZiAodykge1xuICAgICAgICByZXR1cm4gdi5qb2luKCcnKS5zdWJzdHJpbmcoMCwgc2wpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2LmpvaW4oJycpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN0cjJsb25nKHMsIHcpIHtcbiAgICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gICAgdmFyIHYgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgICAgIHZbaSA+PiAyXSA9IHMuY2hhckNvZGVBdChpKSB8IHMuY2hhckNvZGVBdChpICsgMSkgPDwgOCB8IHMuY2hhckNvZGVBdChpICsgMikgPDwgMTYgfCBzLmNoYXJDb2RlQXQoaSArIDMpIDw8IDI0O1xuICAgIH1cbiAgICBpZiAodykge1xuICAgICAgICB2W3YubGVuZ3RoXSA9IGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIHY7XG59XG5mdW5jdGlvbiB4eHRlYV9lbmNyeXB0KHN0ciwga2V5KSB7XG4gICAgaWYgKHN0ciA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICB2YXIgdiA9IHN0cjJsb25nKHN0ciwgdHJ1ZSk7XG4gICAgdmFyIGsgPSBzdHIybG9uZyhrZXksIGZhbHNlKTtcbiAgICB2YXIgbiA9IHYubGVuZ3RoIC0gMTtcbiAgICB2YXIgeiA9IHZbbl0sXG4gICAgICAgIHkgPSB2WzBdLFxuICAgICAgICBkZWx0YSA9IDB4OUUzNzc5Qjk7XG4gICAgdmFyIG14LFxuICAgICAgICBlLFxuICAgICAgICBxID0gTWF0aC5mbG9vcig2ICsgNTIgLyAobiArIDEpKSxcbiAgICAgICAgc3VtID0gMDtcbiAgICB3aGlsZSAocS0tID4gMCkge1xuICAgICAgICBzdW0gPSBzdW0gKyBkZWx0YSAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIGUgPSBzdW0gPj4+IDIgJiAzO1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IG47IHArKykge1xuICAgICAgICAgICAgeSA9IHZbcCArIDFdO1xuICAgICAgICAgICAgbXggPSAoeiA+Pj4gNSBeIHkgPDwgMikgKyAoeSA+Pj4gMyBeIHogPDwgNCkgXiAoc3VtIF4geSkgKyAoa1twICYgMyBeIGVdIF4geik7XG4gICAgICAgICAgICB6ID0gdltwXSA9IHZbcF0gKyBteCAmIDB4ZmZmZmZmZmY7XG4gICAgICAgIH1cbiAgICAgICAgeSA9IHZbMF07XG4gICAgICAgIG14ID0gKHogPj4+IDUgXiB5IDw8IDIpICsgKHkgPj4+IDMgXiB6IDw8IDQpIF4gKHN1bSBeIHkpICsgKGtbcCAmIDMgXiBlXSBeIHopO1xuICAgICAgICB6ID0gdltuXSA9IHZbbl0gKyBteCAmIDB4ZmZmZmZmZmY7XG4gICAgfVxuICAgIHJldHVybiBsb25nMnN0cih2LCBmYWxzZSk7XG59XG5mdW5jdGlvbiB4eHRlYV9kZWNyeXB0KHN0ciwga2V5KSB7XG4gICAgaWYgKHN0ciA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICB2YXIgdiA9IHN0cjJsb25nKHN0ciwgZmFsc2UpO1xuICAgIHZhciBrID0gc3RyMmxvbmcoa2V5LCBmYWxzZSk7XG4gICAgdmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG4gICAgdmFyIHogPSB2W24gLSAxXSxcbiAgICAgICAgeSA9IHZbMF0sXG4gICAgICAgIGRlbHRhID0gMHg5RTM3NzlCOTtcbiAgICB2YXIgbXgsXG4gICAgICAgIGUsXG4gICAgICAgIHEgPSBNYXRoLmZsb29yKDYgKyA1MiAvIChuICsgMSkpLFxuICAgICAgICBzdW0gPSBxICogZGVsdGEgJiAweGZmZmZmZmZmO1xuICAgIHdoaWxlIChzdW0gIT0gMCkge1xuICAgICAgICBlID0gc3VtID4+PiAyICYgMztcbiAgICAgICAgZm9yICh2YXIgcCA9IG47IHAgPiAwOyBwLS0pIHtcbiAgICAgICAgICAgIHogPSB2W3AgLSAxXTtcbiAgICAgICAgICAgIG14ID0gKHogPj4+IDUgXiB5IDw8IDIpICsgKHkgPj4+IDMgXiB6IDw8IDQpIF4gKHN1bSBeIHkpICsgKGtbcCAmIDMgXiBlXSBeIHopO1xuICAgICAgICAgICAgeSA9IHZbcF0gPSB2W3BdIC0gbXggJiAweGZmZmZmZmZmO1xuICAgICAgICB9XG4gICAgICAgIHogPSB2W25dO1xuICAgICAgICBteCA9ICh6ID4+PiA1IF4geSA8PCAyKSArICh5ID4+PiAzIF4geiA8PCA0KSBeIChzdW0gXiB5KSArIChrW3AgJiAzIF4gZV0gXiB6KTtcbiAgICAgICAgeSA9IHZbMF0gPSB2WzBdIC0gbXggJiAweGZmZmZmZmZmO1xuICAgICAgICBzdW0gPSBzdW0gLSBkZWx0YSAmIDB4ZmZmZmZmZmY7XG4gICAgfVxuICAgIHJldHVybiBsb25nMnN0cih2LCB0cnVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdXRmMTZ0bzg6IHV0ZjE2dG84LFxuICAgIHV0Zjh0bzE2OiB1dGY4dG8xNixcbiAgICBiYXNlNjRlbmNvZGU6IGJhc2U2NGVuY29kZSxcbiAgICBiYXNlNjRkZWNvZGU6IGJhc2U2NGRlY29kZSxcbiAgICBlbmNyeXB0OiB4eHRlYV9lbmNyeXB0LFxuICAgIGRlY3J5cHQ6IHh4dGVhX2RlY3J5cHRcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmNmVhM20rWERCQ01iNUFhMDd1alBBNicsICd6aCcpO1xuLy8gc2NyaXB0XFxpMThuXFxkYXRhXFx6aC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcIkdXX0dBTUVcIjogXCLnm5bku5jpgJrmuLjmiI9cIixcbiAgICBcImNoZWNraW5nX3VwZGF0ZVwiOiBcIuato+WcqOajgOafpeabtOaWsFwiLFxuICAgIFwidXBkYXRpbmdfYXNzZXRzXCI6IFwi5q2j5Zyo5pu05paw6LWE5rqQXCIsXG4gICAgXCJsb2FkaW5nX2Fzc2V0c1wiOiBcIuato+WcqOWKoOi9vei1hOa6kO+8jOS4jeeUqOa1gemHj+WWlO+8gVwiLFxuICAgIFwiaW5pdHRpbmdfZ2FtZVwiOiBcIuato+WcqOWIneWni+WMlua4uOaIj1wiLFxuICAgIFwiZW50ZXJpbmdfZ2FtZVwiOiBcIuato+WcqOi/m+WFpea4uOaIj1wiLFxuICAgIFwidXBkYXRlX3BlcmNlbnRcIjogXCLmm7TmlrDov5vluqbvvJpcIixcbiAgICBcImNvbmZpcm1fdXBkYXRlXCI6IFwi5Y+R546w5Zyo5paw54mI5pys77yM5L2g6ZyA6KaB5pu05paw5omN6IO957un57ut5ri45oiPXCIsXG4gICAgXCJzdGFydF91cGRhdGVcIjogXCLmm7TmlrBcIixcbiAgICBcImV4aXRfZ2FtZVwiOiBcIumAgOWHulwiLFxuICAgIFwicmV0cnlfdXBkYXRlXCI6IFwi6YeN6K+VXCIsXG4gICAgXCJmYWlsX3VwZGF0ZVwiOiBcIuabtOaWsOWksei0pe+8jOivt+mHjeivlVwiLFxuICAgIFwiYWNjb3VudF9ub3RfZW1wdHlcIjogXCLluJDlj7fkuI3og73kuLrnqbpcIixcbiAgICBcInBhc3N3ZF9ub3RfZW1wdHlcIjogXCLlr4bnoIHkuI3og73kuLrnqbpcIixcbiAgICBcImV4Y2hhbmdlX2Zvcm1hdFwiOiBcIiVk56ev5YiGPSVk6YeR5biBXCIsXG4gICAgXCJvd25fcG9pbnRfZm9ybWF0XCI6IFwi56ev5YiG77yaJWRcIixcbiAgICBcImNvbmZpcm1fZXhjaGFuZ2VfY29pblwiOiBcIuehruWumuS9v+eUqCVk56ev5YiG5YWR5o2iJWTph5HluIHlkJfvvJ9cIixcbiAgICBcImV4Y2hhbmdlX3N1Y2Nlc3NcIjogXCLlhZHmjaLmiJDlip9cIixcbiAgICBcImJ1eV9waHlzaWNhbF9zdWNjZXNzXCI6IFwi6LSt5Lmw5L2T5Yqb5oiQ5YqfXCIsXG4gICAgXCJhY2NvdXRfb3JfcGFzc3dkX2Vycm9yXCI6IFwi5biQ5Y+35oiW5a+G56CB6ZSZ6K+vXCIsXG4gICAgXCJvd25fZ29sZF9udW1fZm9ybWF0XCI6IFwi5oul5pyJ77yaJWQg6YeR5biBXCIsXG4gICAgXCJvd25fZ29sZF9udW1fZm9ybWF0XzJcIjogXCLph5HluIHvvJolZFwiXG59O1xuXG5jYy5fUkZwb3AoKTsiXX0=
