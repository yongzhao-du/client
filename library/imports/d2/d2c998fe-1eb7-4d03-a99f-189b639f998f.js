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