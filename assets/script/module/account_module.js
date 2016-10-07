module.exports.class = cc.Class({
    
    properties: {
        isVip: {
            get: function () {
                return this._isVip;
            },
            
            set: function (value) {
                if (value
                && (typeof(value) === 'boolean'
                || value === 'true'
                || (Boolean(value))))
                    this._isVip = true;
                else
                    this._isVip = false;
            },
        },
        
        goldNum: {
            get: function () {
                return this._goldNum;
            },
            
            set: function (value) {
                this._goldNum = parseInt(value) || 0;
            },
        },
        
        scoreNum: {
            get: function () {
                return this._scoreNum;
            },
            
            set: function (value) {
                this._scoreNum = parseInt(value) || 0;
            },
        },
        
        nickName: {
            get: function () {
                return this._nickName;
            },
            
            set: function (value) {
                this._nickName = value ? value.toString() : '';
            },
        },

        isFirstLogin: {
            get: function () {
                return this._isFirstLogin;
            },
            
            set: function (value) {
                if (value
                && (typeof(value) === 'boolean'
                || value === 'true'
                || (Boolean(value))))
                    this._isFirstLogin = true;
                else
                    this._isFirstLogin = false;
            },
        },
        
        maxScore: {
            get: function () {
                return this._maxScore;
            },
            
            set: function (value) {
                this._maxScore = parseInt(value) || 0;
            },
        },
        
        power: {
            get: function () {
                return this._power;
            },
            
            set: function (value) {
                this._power = parseInt(value) || 0;
            },
        },
        
        nextPowerTime: {
            get: function () {
                return this._nextPowerTime;
            },
            
            set: function (value) {
                value = parseFloat(value);
                this._nextPowerTime = (typeof(value) === 'number' ? value : this.defaultNextPowerTime);
            },
        },
        
        exchangeRate: {
            get: function () {
                return this._exchangeRate;
            },
            
            set: function (value) {
                this._exchangeRate = parseFloat(value) || this.defaultExchangeRate;
            },
        },
        
        defaultNextPowerTime: 300,
        defaultExchangeRate: 10,
    },
    
    ctor: function () {
        this.reset();
    },
    
    reset: function () {
        this._nickName = '';
        this.isFirstLogin = true;
        this._isVip = false;
        this._goldNum = 0;
        this._scoreNum = 0;
        this._maxScore = 0;
        this._power = 0;
        this._nextPowerTime = this.defaultNextPowerTime;
        this._exchangeRate = this.defaultExchangeRate; 
    },
    
});
