module.exports = {
    
    loadScene: function (name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    },
    
}
