cc.Class({
    extends: cc.Component,

    properties: {
        lockRegion: {
            set: function (region) {
                if (this._lockRegion.equals(region))
                    return;
                if (region.x < 0)
                    region.x = 0;
                if (region.y < 0)
                    region.y = 0;
                if (region.width === 0 || region.xMax >= this._mapPixesSize.width)
                    region.width = this._mapPixesSize.width - region.x;
                if (region.height === 0 || region.yMax >= this._mapPixesSize.height)
                    region.height = this._mapPixesSize.height - region.y;
                this._oldLockRegion = this._currLockRegion;
                this._lockRegion = region.clone();
            },

            get: function () {
                return this._lockRegion;
            },
        },

        layerSize: {
            default: [],
            type: [cc.Size],
        },

        viewSize: new cc.Size(),
    },

    getCurrPosition: function () {
        return this._currPos;
    },

    getCameraPosition: function () {
        return this._cameraCurrPoint;
    },

    // use this for initialization
    onLoad: function () {
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
        for (i = 0; ; i++) {
            layer = this.node.getChildByName("effect_layer_" + i);
            if (!layer) break;
            this._effectLayers.push(layer);
        }
        this._layers = [];
        for (i = 0; ; i++ ) {
            layer = this.node.getChildByName("layer_" + i);
            if (!layer) break;
            this._layers.push(layer);
        }
    },
    
    reset: function () {
        while (this._enities.length > 0) {
            var node = this._enities.pop();
            node.parent = null;
        }

        this._lockX = false;
        this._lockY = false;
        this._lockRegion.x = 0,
        this._lockRegion.y = 0,
        this._lockRegion.wdith = this._mapPixesSize.width,
        this._lockRegion.height = this._mapPixesSize.height,

        this._pivotCurr.x = this._pivotCurr.y = 0;
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

    addEnity: function (enity) {
        this._objectLayer.addChild(enity);
        this._enities.push(enity);
    },

    removeEnity: function (enity) {
        for (var i = 0; i < this._enities.length; i++) {
            if (enity == this._enities[i]) {
                this._enities.splice(i, 1);
                break;
            }
        }
    },

    addEffect: function (effect, index) {
        this._effectLayers[index].addChild(effect);
    },

    checkMovePoint: function (col, row) {
        row = this._mapSize.height - row - 1;
        var gid = this._groundCtrl.getTileGIDAt(col, row);
        if (gid === 0) return false;
        var prop = this._tmxCtrl.getPropertiesForGID(gid);
        return prop && prop.obstacle === "true";
    },

    getMapSize: function () {
        return this._tmxCtrl.getMapSize();
    },

    getMapPixesSize: function () {
        return this._mapPixesSize;
    },

    getTileSize: function () {
        return this._tmxCtrl.getTileSize();
    },

    cameraTo: function (x, y, time, completeLock) {
        if (this._cameraCurrPoint.x == x && this._cameraCurrPoint.y == y)
            return;

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

        if (this._cameraCurrPoint.x == targetX && this._cameraCurrPoint.y == targetY)
            return;

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

    endCameraTo: function () {
        this._cameraMoveStartTime = 0;
        this._cameraMoveEndTime = 0;
        this._cameraTargetPoint.x = this._cameraTargetPoint.y = -1;
        this._cameraStartPoint.x = this._cameraStartPoint.y = -1;
        this._cameraMoveSpeed.x = this._cameraMoveSpeed.y = 0;
        this._cameraMovedLock = false;
    },
    
    setMapPosition: function (x, y) {
        if (this._currPos.x == x && this._currPos.y == y) 
            return;
        
        if (!this._lockX) {
            this._currPos.x = x;
            this._isPositionDirty = true;
        }
        if (!this._lockY) {
            this._currPos.y = y;
            this._isPositionDirty = true;
        }
    },
    
    setMapPovit: function (x, y, time) {
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

    endChangePivot: function () {
        this._pivotStart.x = this._pivotStart.y = 0;
        this._pivotTarget.x = this._pivotTarget.y = 0;
        this._pivotChangeSpeed.x = this._pivotChangeSpeed.y = 0;
        this._pivotChangeStartTime = 0;
        this._pivotChangeEndTime = 0;
    },
    
    shock: function () {
        var viewSize = this.viewSize;
        var node = this.node;
        node.stopAllActions();
        var action = new cc.sequence(new cc.moveBy(0.03, 0, 10),
            new cc.moveBy(0.03, 0, -20),
            new cc.moveBy(0.03, 0, 10),
            new cc.callFunc(function () {
                node.x = 0;
                node.y = 0;
            }));
        node.runAction(action);
    },

    update: function (dt) {
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
    
    processPivot: function (currTime) {
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
    
    updateEnityZOrder: function () {
        this._enities.sort(function (a, b) {
            return a.y < b.y ? 1 : -1;
        });
        for (var i = 0; i < this._enities.length; i++) {
            this._enities[i].setLocalZOrder(i + 1);
        }
    },

    updateViewRange: function (currTime) {
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
        for (var i = 0; i < this._effectLayers.length; i++)
            this._effectLayers[i].setPosition(-mapPos.x, -mapPos.y);
        
        for (var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[i];
            var size = this.layerSize[i];
            layer.x = -mapPos.x / (this._mapPixesSize.width - viewSize.width) * (size.width - viewSize.width);
        }
    },
});
