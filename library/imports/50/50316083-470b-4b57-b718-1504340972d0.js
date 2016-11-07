module.exports = {

    loadScene: function loadScene(name) {
        cc.director.loadScene(name);
        /*cc.director.preloadScene(name, function () {
            cc.director.loadScene(name);
        });*/
    },

    playButtonSound: function playButtonSound() {
        cc.loader.loadRes("sound/button_click", cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        });
    }

};