cc.Class({
    extends: cc.Component,

    properties: {
        star: {
            default: null,
            type: cc.Node,
        },
        
        state: {
            get: function () {
                this._state;
            },
            
            set: function (state) {
                if (this._state == state)
                    return;
                this.star.active = (state === 0);
                this._state = state;
            }
        }
    },

    onLoad: function () {
        this.state = 1;
        //this._animation = this.node.getComponent(cc.Animation);
        //this._animation.on('finish', this.onAnimateFinish, this);
    },
});
