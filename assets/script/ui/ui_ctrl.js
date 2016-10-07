cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            set: function (value) {
                this._id = value;
            },
            
            get: function () {
                return this._id;
            },
        },
        
        args: {
            set: function (value) {
                this._args = value;
            },
            
            get: function () {
                return this._args;
            },
        },
        
        manager: {
            set: function (manager) {
                this._manager = manager;
            },
            
            get: function () {
                return this._manager;
            },
        }
    },

    onLoad: function () {
        this._id = -1;
    },
    
    close: function () {
        this.manager.closeUI(this.node);
    },
    
});
