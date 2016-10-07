module.exports['class'] = cc.Class({

    ctor: function ctor() {
        this._idx = -1;
        this._freeIdx = [];
        this._table = [];
    },

    allocIndex: function allocIndex() {
        var ret = 0;
        if (this._freeIdx.length > 0) {
            ret = this._freeIdx.pop();
        } else {
            ret = this._idx++;
        }
        return ret;
    },

    insert: function insert(obj) {
        var idx = this.allocIndex();
        if (idx >= this._table.length) {
            idx = this._table.length;
            this._table.push(obj);
        } else {
            this._table[idx] = obj;
        }
        return idx;
    },

    removeByIndex: function removeByIndex(idx) {
        if (idx >= this._table.length) return null;
        var obj = this._table[idx];
        this._table[idx] = null;
        this._freeIdx.push(idx);
        return obj;
    },

    removeByObject: function removeByObject(obj) {
        if (obj === null) return null;
        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] == obj) {
                return this.removeByIndex(i);
            }
        }
        return null;
    },

    getObject: function getObject(idx) {
        if (idx >= this._table.length) return null;
        return this._table[idx];
    },

    each: function each(func) {
        if (typeof func !== 'function') return;

        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] !== null) {
                func(i, this._table[i]);
            }
        }
    }

});