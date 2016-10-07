module.exports.class = cc.Class({
    
    properties: {
        token: {
            get: function () {
                return this._token;
            },
            
            set: function (value) {
                this._token = value.toString();
            },
        },
    },
    
    ctor: function () {
        this.reset();
    },
    
    reset: function () {
        this._token = '';
    },
    
});
