module.exports.class = cc.Class({
    
    ctor: function () {
        this._idx = -1;
    	this._freeIdx = [];
    	this._table = [];
    },
    
    allocIndex: function () {
    	var ret = 0;
    	if (this._freeIdx.length > 0) {
        	ret = this._freeIdx.pop();
    	} else {
    		ret = this._idx++;
    	}
    	return ret
    },
    
    insert: function (obj) {
    	var idx = this.allocIndex();
    	if (idx >= this._table.length) {
    	    idx = this._table.length
    	    this._table.push(obj);
    	} else {
    	    this._table[idx] = obj;
    	}
    	return idx
    },
    
    removeByIndex: function (idx) {
        if (idx >= this._table.length)
            return null;
        var obj = this._table[idx];
    	this._table[idx] = null;
    	this._freeIdx.push(idx);
    	return obj
    },

    removeByObject: function (obj) {
        if (obj === null)
            return null;
        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] == obj) {
                return this.removeByIndex(i);
            }
        }
        return null;
    },
    
    getObject: function (idx) {
        if (idx >= this._table.length)
            return null;
	    return this._table[idx];
    },

    each: function (func) {
    	if (typeof(func) !== 'function')
    		return
    
        for (var i = 0; i < this._table.length; i++) {
            if (this._table[i] !== null) {
                func(i, this._table[i]);
            }
        }
    }
    
});
