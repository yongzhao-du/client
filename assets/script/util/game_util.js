module.exports = {
    
    loadScene: function (name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    },
    
    playButtonSound: function () {
        cc.loader.loadRes("sound/button_click", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        });
    }
    
}
