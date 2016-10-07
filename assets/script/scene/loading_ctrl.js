const STATE_DEFAULT         = -1;
const STATE_CHECK_UPDATE    = 0;
const STATE_UPDATING        = 1;
const STATE_LOAD_ASSETS     = 2;
const STATE_INIT_GAME       = 3;
const STATE_ENTER_GAME      = 4;
const STATE_DONE            = 5;

const LoadingStateInfo = [
    {
        start: 0,
        end: 0.02,
        lang: 'checking_update',
    },
    {
        start: 0.02,
        end: 0.05,
        lang: 'updating_assets',
    },
    {
        start: 0.05,
        end: 0.9,
        lang: 'loading_assets',
    },
    {
        start: 0.9,
        end: 1,
        lang: 'initting_game',
    },
    {
        start: 1,
        end: 1,
        lang: 'entering_game',
    }
]

const PanelType = {
    NONE: 0,
    CONFIRM: 1,
    START_UPDATE: 2,
    RETRY_UPDATE: 3,
}

cc.Class({
    extends: cc.Component,

    properties: {
        
        remoteAssetPath: 'remote_assset',
        
        localManifest: {
            default: null,
            url: cc.RawAsset
        },
        
        updatePanel: {
            default: null,
            type: cc.Node
        },
        
        updateMessage: {
            default: null,
            type: cc.Label,
        },
        
        updateProgress: {
            default: null,
            type: cc.ProgressBar
        },
        
        updateConfirmButton: {
            default: null,
            type: cc.Button
        },
        
        updateConfirmLabel: {
            default: null,
            type: cc.Label
        },
        
        updateCancelButton: {
            default: null,
            type: cc.Button
        },
        
        updateCancelLabel: {
            default: null,
            type: cc.Label
        },

        loadingMessage: {
            default: null,
            type: cc.Label
        },
        
        loadingPercent: {
            default: null,
            type: cc.Label
        },
        
        loadingProgress: {
            default: null,
            type: cc.ProgressBar
        },
        
        loadingParticle: {
            default: null,
            type: cc.ParticleSystem
        },
        
        loadAssetTime: 2,
        enterGameTime: 1,
    },

    onLoad: function () {
        this._state = STATE_DEFAULT;
        this._needUpdate = false;
        this._needRetry = false;
        this._loadAssetStartTime = 0;
        this.loadingPercent.string = '';
        this.loadingMessage.string = '';
        this.loadingParticle.node.x = -249.5;
        this.showUpdatePanel(PanelType.NONE);
        
    },
    
    onDestroy: function () {
        this.removeCheckListener();
        this.removeUpdateListener();
        if (this._am) {
            this._am.release();
            this._am = null;
        }
    },
    
    removeCheckListener: function () {
        if (this._checkListener) {
            cc.eventManager.removeListener(this._checkListener);
            this._checkListener = null;
        }
    },
    
    removeUpdateListener: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },
    
    start: function () {
        // 只有原生代码需要用热更新功能
        //this.setState(cc.sys.isNative ? STATE_CHECK_UPDATE : STATE_LOAD_ASSETS);
        this.setState(STATE_LOAD_ASSETS);
    },
    
    setState: function (state) {
        if (this._state == state)
            return;
        this._state = state;
        if (state != STATE_DEFAULT && state != STATE_DONE) {
            this.setLoadingPercent(LoadingStateInfo[state].start);
            this.loadingMessage.string = GameLang.t(LoadingStateInfo[state].lang);
        }
        switch (state) {
            case STATE_CHECK_UPDATE:
                this.checkUpdate();
                break;
            case STATE_UPDATING:
                break;
            case STATE_LOAD_ASSETS:
                this.startLoadAssets();
                break;
            case STATE_INIT_GAME:
                this.initGame();
                break;
            case STATE_ENTER_GAME:
                this.startEnterGame();
                break;
            default:
                break;
        }
    },
    
    setUpdatePercent: function (percent) {
        if (percent < 0) percent = 0;
        else if (percent > 1) percent = 1;
        this.updateMessage.string = GameLang.t('update_percent') + Math.ceil(percent * 100).toString() + "%";
        this.updateProgress.progress = percent;
    },
    
    setLoadingPercent: function (percent) {
        if (percent < 0) percent = 0;
        else if (percent > 1) percent = 1;
        this.loadingPercent.string = Math.ceil(percent * 100).toString()  + "%"
        this.loadingProgress.progress = percent;
        this.loadingParticle.node.x = percent * 499 - 249.5;
    },
    
    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        
        var needRemove = true;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                this.setState(STATE_LOAD_ASSETS);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.showUpdatePanel(PanelType.CONFIRM);
                break;
            default:
                needRemove = false;
                break;
        }
        
        if (needRemove)
            this.removeCheckListener();
    },
    
    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();
                var msg = event.getMessage();
                if (msg) cc.log(msg);
                cc.log(percent.toFixed(2) + '%');
                this.setUpdatePercent(percent);
                break;
                
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
                
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
                
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
                
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                failed = true;
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this.removeUpdateListener();
            this._needRetry = true;
            this.showUpdatePanel(PanelType.RETRY_UPDATE);
        }

        if (needRestart) {
            this.removeUpdateListener();
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            //cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.game.restart();
        }
    },
    
    checkUpdate: function () {
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this.remoteAssetPath);
        cc.log('Storage path for remote asset : ' + storagePath);

        if (!this._am) {
            this._am = new jsb.AssetsManager(this.localManifest, storagePath);
            this._am.retain();
        }

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded())
        {
            if (!this._checkListener) {
                this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
                cc.eventManager.addListener(this._checkListener, 1);
            }
            this._am.checkUpdate();
        }
    },
    
    startLoadAssets: function () {
        this._loadAssetStartTime = Global.syncTimer.getTimer();
    },
    
    startEnterGame: function () {
        this._enterGameEndTime = Global.syncTimer.getTimer() + this.enterGameTime;
    },
    
    initGame: function () {
        require('init_config').exec();
        require('init_module').exec();
    },
    
    enterGame: function () {
        GameUtil.loadScene("login");
    },
    
    showUpdatePanel: function (type) {
        if (type == PanelType.NONE) {
            this.updatePanel.active = false;
            return;
        }
        switch (type) {
            case PanelType.CONFIRM:
                this.updateConfirmButton.active = true;
                this.updateCancelButton.active = true;
                this.updateProgress.active = false;
                this.updateConfirmLabel.string = GameLang.t('start_update');
                this.updateCancelLabel.string = GameLang.t('exit_game');
                this.updateMessage.string = GameLang.t('confirm_update');
                break;
            case PanelType.START_UPDATE:
                this.updateConfirmButton.active = false;
                this.updateCancelButton.active = false;
                this.updateProgress.active = true;
                this.setUpdatePercent(0);
                break;
            case PanelType.RETRY_UPDATE:
                this.updateConfirmButton.active = true;
                this.updateCancelButton.active = true;
                this.updateProgress.active = false;
                this.updateConfirmLabel.string = GameLang.t('retry_update');
                this.updateCancelLabel.string = GameLang.t('exit_game');
                this.updateMessage.string = GameLang.t('fail_update');
                break;
            default:
                break;
        }
        this.updatePanel.active = true;
    },
    
    doUpdate: function () {
        if (!this._am)
            return;
        if (!this._updateListener) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);
        }
        this.setState(STATE_UPDATING);
        this._am.update();
    },
    
    onConfirmClick: function () {
        if (this._needRetry || this._needUpdate) {
            this.showUpdatePanel(PanelType.START_UPDATE);
            this.doUpdate();
        }
    },
    
    onCancelClick: function () {
        cc.director.end();
    },
    
    update: function (dt) {
        switch (this._state) {
            case STATE_LOAD_ASSETS:
                var timeElapased = Global.syncTimer.getTimer() - this._loadAssetStartTime;
                if (timeElapased > this.loadAssetTime) {
                    this._loadAssetStartTime = 0;
                    this.setState(STATE_INIT_GAME);
                    return;
                }
                var loadInfo = LoadingStateInfo[STATE_LOAD_ASSETS];
                var assetLoadPercent = timeElapased / this.loadAssetTime;
                var totalLoadPercent = (loadInfo.end - loadInfo.start) * assetLoadPercent + loadInfo.start;
                this.setLoadingPercent(totalLoadPercent);
                break;
            case STATE_INIT_GAME:
                this.setState(STATE_ENTER_GAME);
                break;
            case STATE_ENTER_GAME:
                if (Global.syncTimer.getTimer() >= this._enterGameEndTime) {
                    this._enterGameEndTime = 0;
                    this.enterGame();
                    this.setState(STATE_DONE);
                }
                break;
            default:
                break;
        }
    },
});
