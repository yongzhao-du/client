"use strict";
cc._RFpush(module, '70860atbBVFS6xH7IFaNTJ3', 'game_event_dispatcher');
// script\event\game_event_dispatcher.js

module.exports['class'] = cc.Class({

    // use this for initialization
    ctor: function ctor() {
        this._listeners = {};
    },

    emit: function emit(eventType, data) {
        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                handlers[k](eventType, data);
            }
        }
    },

    addEventHandler: function addEventHandler(eventType, handler) {
        if (typeof handler !== 'function') return;

        var handlers = this._listeners[eventType];
        if (handlers) {
            for (var k in handlers) {
                if (handlers[k] == handler) return;
            }
        }

        if (!handlers) {
            handlers = [];
            this._listeners[eventType] = handlers;
        }

        handlers.push(handler);

        return { type: eventType, id: handlers.length - 1 };
    },

    removeEventHandler: function removeEventHandler(enity) {
        var handlers = this._listeners[enity.type];
        if (handlers && enity.id >= 0 && enity.id < handlers.length) handlers.splice(enity.id, 1);
    },

    removeAllEventHandler: function removeAllEventHandler(eventType) {
        this._listeners[eventType] = null;
    },

    clear: function clear() {
        this._listeners = {};
    }
});

cc._RFpop();