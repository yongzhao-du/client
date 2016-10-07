"use strict";
cc._RFpush(module, 'a4820g69mBLp7tlCZfD3MDE', 'i18n');
// script\i18n\i18n.js

var Polyglot = require('polyglot');
var language = require('zh'); // update this to set your default displaying language in editor

// let polyglot = null;
var polyglot = new Polyglot({ phrases: language });

module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name 
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init 
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init: function init(language) {
        var data = require(language);
        polyglot.replace(data);
    },
    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     * 
     * var myText = i18n.t('MY_TEXT_KEY');
     * 
     * // if your data source is defined as 
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text 
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t: function t(key, opt) {
        return polyglot.t(key, opt);
    }
};

cc._RFpop();