var ActorDefine = require("actor_define");
var Actor = require("actor_ctrl");

var ActorAction = ActorDefine.ActorAction;
var ActorDirection = ActorDefine.ActorDirection;
var ActionCompleteType = ActorDefine.ActionCompleteType;

cc.Class({
    extends: Actor,

    onLoad: function () {
        this._AIMoveEndTime = 0;
        this._AIHoldEndTime = 0;
        this._AIAttackDelayEndTime = 0;
        this._AIRunned = false;
        this._super();
    },

    reset: function () {
        this._AIMoveEndTime = 0;
        this._AIHoldEndTime = 0;
        this._AIAttackDelayEndTime = 0;
        this._AIRunned = false;
        this._super();
    },
    
    run: function () {
        this._AIRunned = true;
    },
    
    stop: function () {
        this._AIRunned = false;
    },

    update: function (dt) {

        this._super(dt);
    },

    nextAction: function () {
        if (this._isDead)
            return;
        
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
            var disY = player.node.y - this.node.y
            var dirX = ActorDirection.LEFT;
            var dirY = 0;
            if (disX > 0)
                dirX = ActorDirection.RIGHT;
            if (Math.abs(disY) > 10) {
                if (disY > 0)
                    dirY = 1;
                else
                    dirY = -1;
            } else {
                dirY = 0;
            }
                
            this.setDirection(dirX);
            
            var currTime = Global.syncTimer.getTimer();
            if (Math.abs(disY) < 20 && Math.abs(disX) < 60 ) {
                if (currTime >= this._AIAttackDelayEndTime) {
                    var skill = Global.skillProvider.getConfig(1);
                    if (!skill) {
                        //this._super();
                        return;
                    }
                    this.stopMove();
                    this._AIAttackDelayEndTime = currTime + 5;
                    var postureList = [ skill.postures[0] ];
                    this.startAttack(postureList, 1, this._direction);
                } else {
                    this._super();
                }
            } else if (this._AIMoveEndTime > 0) {
                if (currTime <= this._AIMoveEndTime) {
                    var speed = new cc.Vec2(100 * dirX, 100 * dirY);
                    if (this._moveStartTime <= 0 || speed.x !== this._currMoveSpeed.x || speed.y !== this._currMoveSpeed.y ) {
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
            }  else {
                this._AIMoveEndTime = currTime + Math.random() * 2 + 2;
            }
        }
    },
});
