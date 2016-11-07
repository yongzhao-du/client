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
    extends: Actor,

    properties: {
        stateBar: {
            set: function (bar) {
                this._stateBar = bar;
            },
            
            get: function () {
                return this._stateBar;
            }
        },

        controlEnabled: {
            set: function (enabled) {
                if (enabled) {
                    this._controlEnabledCount += 1;
                } else {
                    this._controlEnabledCount -= 1;
                }
            },

            get: function () {
                return this._controlEnabledCount >= 0;
            }
            
        },

        reliveEffectUnder: cc.Animation,
        reliveEffectUpper: cc.Animation,
    },

    onLoad: function () {
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

    reset: function () {
        this._keyDownCount = 0;
        for (var i = 0; i < this._keyDownTime.length; i++) {
            this._keyDownTime[i] = 0;
        }
        this._controlEnabledCount = -1;
        this._lastAttackSkillId = 0;
        this._lastAttackPostureIndex = 0;
        this._postureBreakEndTime = 0;
        this._super();
        if (this._stateBar)
            this._stateBar.setHp(this._hp, this._hpMax, false);
    },

    setHp: function (value, max) {
        this._super(value, max)
        if (this._stateBar)
            this._stateBar.setHp(this._hp, this._hpMax, false);
    },

    setActorPosition: function (x, y) {
        this._super(x, y);
        this._map.setMapPosition(x, y);
    },  

    setAction: function (action, dir, param, time) {
        this._super(action, dir, param, time);
        //this.updateMapPivot();
    },

    setDirection: function (dir) {
        this._super(dir);
        //this.updateMapPivot();
    },

    damage: function (value) {
        var ani = value > 0;
        this._super(value);
        this._stateBar.setHp(this._hp, this._hpMax, ani);
    },

    breakable: function () {
        var currTime = Global.syncTimer.getTimer();
        return this.getLastInputAttackKey() == ControlKey.HIT && currTime >= this._attackEndTime;
    },

    needDisappear: function () {
        return false;
    },
    
    nextAction: function () {
        if (this._bornEndTime > 0)
            return;

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
                    if (!this.startHit(dir))
                        this._super();
                    break;
                default:
                    this._super();
                    break;
            }
        } else if (this.enterMove()) {

        } else {
            if (this._initiativeMove) 
                this.stopMove();
            this._super();
        }
    },

    checkAttackPosture: function (skillId) {
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
        } else {

        }
        return null;
    },

    getNormalAttackPosture: function (index) {
        var skill = Global.skillProvider.getConfig(0);
        if (!skill)
            return null;
        return skill.postures[index];
    },

    startHit: function (dir) {
        var posture = this.checkAttackPosture(0)
        if (!posture) {
            return false;
        }
        this.startAttack([posture], 1, dir);
        return true;
    },
    
    enterMove: function () {
        var result = true;
        var dirVec = this.getLastInputMoveDirection();
        if (dirVec.equals(cc.Vec2.ZERO))
            return false;
        
        var speed = this.calcMoveSpeed(dirVec);
        if (this._moveStartTime <= 0 || speed.x !== this._currMoveSpeed.x || speed.y !== this._currMoveSpeed.y ) {
            this.setDirection(dirVec.x);
            this.startMove(speed.x, speed.y, true);
        }
        
        return true;
    },

     playReliveEffect: function () {
        var self = this;
        this.reliveEffectUnder.node.active = true;
        this.reliveEffectUpper.node.active = true;
        this.reliveEffectUnder.play('default');
        this.reliveEffectUpper.play('default');
    },
    
    calcMoveSpeed: function (dirVec) {
        var moveSpeed = new cc.Vec2(dirVec.x * this.moveSpeed.x, dirVec.y * this.moveSpeed.y);
        return moveSpeed;
    },
    
    keyDown: function (key) {
        if (this.controlEnabled) {
            this._keyDownCount++;
            this._keyDownTime[key] = this._keyDownCount;
        }
        var guideStep = this.logicManager.guideStep;
        if ((guideStep == GuideStep.MOVE)
        && (key == ControlKey.LEFT
        || key == ControlKey.UP
        || key == ControlKey.DOWN
        || key == ControlKey.RIGHT)) {
            this.logicManager.endGuide();
        } else if (guideStep == GuideStep.TOUCH) {
            cc.log("key down DO_TOUCH_GUIDE");
            if (key == ControlKey.HIT) {
                cc.log("key down DO_TOUCH_GUIDE end");
                this.logicManager.endGuide();
            }
        }
    },
    
    keyUp: function (key) {
        this._keyDownTime[key] = 0;
    },
    
    getLastInputMoveDirection: function () {
        var u = 0, v = 0;
        var ut = 0, vt = 0;
        
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

    getLastInputAttackKey: function () {
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

    updateMapPivot: function () {
        if (this._currAction == ActorAction.RUN)
            this._map.setMapPovit(this._direction * -100, 0 ,2);
        else
            this._map.setMapPovit(this._direction * 100, 0, 1);
    },
});
