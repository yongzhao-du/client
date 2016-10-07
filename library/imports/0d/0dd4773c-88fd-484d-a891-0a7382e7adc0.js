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