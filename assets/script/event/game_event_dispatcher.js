module.exports.class = cc.Class({

    // use this for initialization
    ctor: function () {
        this._listeners = {};
    },
    
    emit: function (eventType, data) {
        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                handlers[k](eventType, data);
            }
        }
    },
    
    addEventHandler: function (eventType, handler) {
        if (typeof(handler) !== 'function')
            return;
            
        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                if (handlers[k] == handler)
                    return;
            }
        }
        
        if (!handlers) {
            handlers = [];
            this._listeners[eventType] = handlers;
        }
        
        handlers.push(handler);
        
        return { type: eventType, id: handlers.length - 1 };
    },
    
    removeEventHandler: function (enity) {
        var handlers = this._listeners[enity.type];
        if (handlers && enity.id >= 0 && enity.id < handlers.length)
            handlers.splice(enity.id, 1);
    },
    
    removeAllEventHandler: function (eventType) {
        this._listeners[eventType] = null;
    },
    
    clear: function () {
        this._listeners = {};
    }
});
