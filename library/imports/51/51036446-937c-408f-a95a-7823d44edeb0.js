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