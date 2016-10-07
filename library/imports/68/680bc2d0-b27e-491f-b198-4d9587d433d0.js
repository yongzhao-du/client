cc.Class({
    'extends': cc.Component,

    properties: {

        accountEdit: {
            'default': null,
            type: cc.EditBox
        },

        passwdEdit: {
            'default': null,
            type: cc.EditBox
        },

        msgLabel: {
            'default': null,
            type: cc.Label
        },

        accountSelectPanel: {
            'default': null,
            type: cc.Node
        },

        accountScrollView: {
            'default': null,
            type: cc.ScrollView
        }
    },

    onLoad: function onLoad() {
        this.msgLabel.node.active = false;
        this.accountSelectPanel.active = false;

        this.readLoginInfo();
        this.addEvent();
    },

    onDestroy: function onDestroy() {
        this.removeEvent();
    },

    addEvent: function addEvent() {
        this._loginHandler = Global.gameEventDispatcher.addEventHandler(GameEvent.ON_LOGIN_RESULT, this.onLoginResult.bind(this));
    },

    removeEvent: function removeEvent() {
        Global.gameEventDispatcher.removeEventHandler(this._loginHandler);
        this._loginHandler = null;
    },

    saveLoginInfo: function saveLoginInfo() {
        cc.sys.localStorage.setItem('account', this._loginAccount);
        cc.sys.localStorage.setItem('password', this._loginPasswd);
    },

    readLoginInfo: function readLoginInfo() {
        this._loginAccount = cc.sys.localStorage.getItem('account') || '';
        this._loginPasswd = cc.sys.localStorage.getItem('password') || '';
        this.accountEdit.string = this._loginAccount;
        this.passwdEdit.string = this._loginPasswd;
    },

    setAccountList: function setAccountList(list) {
        this.accountScrollView.content.removeAllChildren();
        var self = this;
        var keys = [];
        for (var k in list) {
            keys.push(k);
            cc.loader.loadRes('prefab/ui/components/account_item', cc.Prefab, function (err, prefab) {
                var node = cc.instantiate(prefab);
                var button = node.getChildByName('button');
                var label = node.getChildByName('name_label').getComponent(cc.Label);
                var key = keys.shift();
                label.string = list[key];
                button.on('touchend', function () {
                    self.accountSelectPanel.active = false;
                    self._loginAccount = list[key];
                    GameRpc.Clt2Srv.login(self._loginAccount, self._loginPasswd);
                });
                self.accountScrollView.content.addChild(node);
            });
        }
    },

    onLoginResult: function onLoginResult(eventType, data) {
        if (data.code == 1) {
            cc.log("Login Success", data.data.token);
            this.saveLoginInfo();
            GameUtil.loadScene('game');
        } else if (data.data.gaiNumber) {
            cc.log("Multi Account");
            this.setAccountList(data.data.gaiNumber);
            this.accountSelectPanel.active = true;
            this.msgLabel.node.active = false;
        } else {
            cc.log("Account or Password incorrect");
            this.msgLabel.string = data.data.errorMsg;
            this.msgLabel.node.active = true;
        }
    },

    onLoginButtonClick: function onLoginButtonClick() {
        var account = this.accountEdit.string;
        var passwd = this.passwdEdit.string;
        if (account.length <= 0) {
            this.msgLabel.string = GameLang.t('account_not_empty');
            this.msgLabel.node.active = true;
            return;
        }
        if (passwd.length <= 0) {
            this.msgLabel.string = GameLang.t('passwd_not_empty');
            this.msgLabel.node.active = true;
            return;
        }

        this._loginAccount = this.accountEdit.string;
        this._loginPasswd = this.passwdEdit.string;
        GameRpc.Clt2Srv.login(this._loginAccount, this._loginPasswd);
    },

    onRegisteButtonClick: function onRegisteButtonClick() {
        cc.log("registe");
    },

    onForgetButtonClick: function onForgetButtonClick() {
        cc.log("forget");
    }

});