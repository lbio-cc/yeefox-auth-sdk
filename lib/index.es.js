/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class WrapPromise {
    constructor() {
        const handler = {
            get(target, p, receiver) {
                switch (p) {
                    case 'resolve':
                        return handler._resolve;
                    case 'reject':
                        return handler._reject;
                    case 'then':
                        return target.then.bind(target);
                    case 'catch':
                        return target.catch.bind(target);
                    case 'finally':
                        return target.finally.bind(target);
                    default:
                        return Reflect.get(target, p, receiver);
                }
            },
            _resolve: undefined,
            _resolved: false,
            _reject: undefined,
        };
        const promise = new Promise((resolve, reject) => {
            handler._resolve = (value) => {
                if (!handler._resolved) {
                    handler._resolved = true;
                    resolve(value);
                }
            };
            handler._reject = (value) => {
                if (!handler._resolved) {
                    handler._resolved = true;
                    reject(value);
                }
            };
        });
        return new Proxy(promise, handler);
    }
    then(onfulfilled, onrejected) {
        return this;
    }
    catch(onrejected) {
        return this;
    }
    reject(reason) {
        return Promise.resolve(reason);
    }
    ;
    resolve(value) {
        return Promise.resolve(value);
    }
    finally(onfinally) {
        return this;
    }
    get [Symbol.toStringTag]() { return 'WrapPromise'; }
    ;
}

var YEEFOX_AUTH;
(function (YEEFOX_AUTH) {
    (function (UserInfoField) {
        UserInfoField["CODE"] = "code";
        UserInfoField["WALLET"] = "wallet";
        UserInfoField["NICK_NAME"] = "nickName";
        UserInfoField["PHONE"] = "phone";
    })(YEEFOX_AUTH.UserInfoField || (YEEFOX_AUTH.UserInfoField = {}));
    (function (AuthEvent) {
        AuthEvent["USER_INFO"] = "USER_INFO";
        AuthEvent["ASSET_HOSTING"] = "ASSET_HOSTING";
        AuthEvent["ASSET_TRANSFER"] = "ASSET_TRANSFER";
        AuthEvent["ASSET_VIEW"] = "ASSET_VIEW";
        AuthEvent["SIGN"] = "SIGN";
        AuthEvent["READY"] = "READY";
    })(YEEFOX_AUTH.AuthEvent || (YEEFOX_AUTH.AuthEvent = {}));
    (function (DAppEvent) {
        DAppEvent["USER_INFO"] = "DAPP_USER_INFO";
    })(YEEFOX_AUTH.DAppEvent || (YEEFOX_AUTH.DAppEvent = {}));
    (function (ServerEvent) {
        ServerEvent["READY"] = "READY";
        ServerEvent["APPROVE"] = "APPROVE";
        ServerEvent["REJECT"] = "REJECT";
        ServerEvent["USER_INFO"] = "USER_INFO";
    })(YEEFOX_AUTH.ServerEvent || (YEEFOX_AUTH.ServerEvent = {}));
})(YEEFOX_AUTH || (YEEFOX_AUTH = {}));

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".yeefox-iframe{border:0;flex:1;width:100%}.yeefox-iframe-container{background:#fff;bottom:0;display:flex;flex-direction:column;left:0;overflow:hidden;position:fixed;right:0;top:100vh;z-index:10000}.yeefox-iframe-container.animate{transition:top .3s linear}.yeefox-iframe-container.open{top:0}";
styleInject(css_248z);

const YEEFOX_ORIGIN = 'https://h5.yeefox.cc';
const YEEFOX_AUTH_SIGNATURE = 'YEEFOX:OPEN_AUTH:';
const YEEFOX_DAPP_SIGNATURE = 'YEEFOX:DAPP:';
let yeefoxAuthSdkInstance;
class YeefoxAuthSdk {
    static instance(appId) {
        if (!yeefoxAuthSdkInstance) {
            yeefoxAuthSdkInstance = new YeefoxAuthSdk(appId);
        }
        return yeefoxAuthSdkInstance;
    }
    constructor(appId) {
        this.appId = appId;
        this.html = new YeefoxAuthIframe((message) => this.messageHandler(message));
        this.ready = new WrapPromise();
        this.mode = "iframe" /* YEEFOX_AUTH.Mode.HTML */;
        this.serial = 0;
        this.checkDapp();
    }
    static get VERSION() {
        return '1.3.1';
    }
    checkDapp() {
        if (typeof window.setYeefoxMessageHandler != "undefined") {
            window.setYeefoxMessageHandler((message) => this.messageHandler(message));
            this.mode = "dapp" /* YEEFOX_AUTH.Mode.DAPP */;
            this.ready.resolve();
        }
        else {
            window.addEventListener("yeefox:ready", () => {
                window.setYeefoxMessageHandler((message) => this.messageHandler(message));
                this.mode = "dapp" /* YEEFOX_AUTH.Mode.DAPP */;
                this.ready.resolve();
            });
        }
    }
    grantAssetView(options, commonOption) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promise) {
                throw new Error('当前有授权在进行中');
            }
            yield this.showFrontend();
            yield this.ready;
            this.promise = new WrapPromise();
            this.sendMessage(YEEFOX_AUTH.AuthEvent.ASSET_VIEW, {
                data: options,
                custom: commonOption === null || commonOption === void 0 ? void 0 : commonOption.custom,
                sign: commonOption === null || commonOption === void 0 ? void 0 : commonOption.sign,
                appId: this.appId
            });
            return this.promise;
        });
    }
    grantUserInfo(options, commonOption) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.fields.indexOf(YEEFOX_AUTH.UserInfoField.WALLET) !== -1) {
                if (!options.chain) {
                    throw new Error('请选择链地址所在的区块链');
                }
            }
            if (this.promise) {
                throw new Error('当前有授权在进行中');
            }
            yield this.showFrontend();
            yield this.ready;
            this.promise = new WrapPromise();
            this.sendMessage(YEEFOX_AUTH.AuthEvent.USER_INFO, {
                data: options,
                custom: commonOption === null || commonOption === void 0 ? void 0 : commonOption.custom,
                sign: commonOption === null || commonOption === void 0 ? void 0 : commonOption.sign,
                appId: this.appId
            });
            return this.promise;
        });
    }
    grantAssetHosting(options, commonOption) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promise) {
                throw new Error('当前有授权在进行中');
            }
            yield this.showFrontend();
            yield this.ready;
            this.promise = new WrapPromise();
            this.sendMessage(YEEFOX_AUTH.AuthEvent.ASSET_HOSTING, {
                data: options,
                custom: commonOption === null || commonOption === void 0 ? void 0 : commonOption.custom,
                sign: commonOption === null || commonOption === void 0 ? void 0 : commonOption.sign,
                appId: this.appId
            });
            return this.promise;
        });
    }
    getUserInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promise) {
                throw new Error('当前有授权在进行中');
            }
            yield this.ready;
            this.promise = new WrapPromise();
            this.sendMessage(YEEFOX_AUTH.DAppEvent.USER_INFO, {
                data: options,
            });
            return this.promise;
        });
    }
    eventHandler(eventType, data) {
        switch (eventType) {
            case YEEFOX_AUTH.ServerEvent.READY:
                this.sendMessage(YEEFOX_AUTH.AuthEvent.READY, { data: window.location.origin });
                this.serial = data.serial;
                this.ready.resolve();
                break;
            case YEEFOX_AUTH.ServerEvent.APPROVE:
                if (this.promise) {
                    this.promise.resolve(data.serial);
                    this.promise = undefined;
                    this.html.hide();
                }
                break;
            case YEEFOX_AUTH.ServerEvent.REJECT:
                if (this.promise) {
                    this.promise.reject(new Error(data.reason));
                    this.promise = undefined;
                    this.html.hide();
                }
                break;
            case YEEFOX_AUTH.ServerEvent.USER_INFO:
                if (this.promise) {
                    this.promise.resolve(data);
                    this.promise = undefined;
                }
        }
    }
    showFrontend() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode === "iframe" /* YEEFOX_AUTH.Mode.HTML */) {
                yield this.html.show();
            }
        });
    }
    messageHandler(e) {
        if (typeof e.data === "object" && e.data) {
            const prefix = this.mode === "iframe" /* YEEFOX_AUTH.Mode.HTML */ ? YEEFOX_AUTH_SIGNATURE : YEEFOX_DAPP_SIGNATURE;
            if (typeof e.data.type === "string" && e.data.type.indexOf(prefix) === 0) {
                let type = e.data.type.substring(prefix.length);
                this.eventHandler(type, e.data.data);
            }
        }
    }
    sendMessage(eventType, data) {
        if (this.mode === "iframe" /* YEEFOX_AUTH.Mode.HTML */) {
            this.html.sendMessage(eventType, data);
        }
        else {
            window.postYeefoxMessage({
                type: `${YEEFOX_DAPP_SIGNATURE}${eventType}`,
                data,
                serial: this.serial++
            });
        }
    }
}
class YeefoxAuthIframe {
    constructor(messageHandler) {
        this.container = document.createElement('div');
        this.container.className = 'yeefox-iframe-container animate';
        this.iframe = document.createElement('iframe');
        this.iframe.className = 'yeefox-iframe';
        this.container.appendChild(this.iframe);
        this.visited = false;
        this.messageHandler = messageHandler;
        document.body.appendChild(this.container);
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.visited) {
                window.addEventListener('message', (e) => this.messageHandler(e));
                this.iframe.src = `${YEEFOX_ORIGIN}/#/pages/auth/iframe`;
                this.visited = true;
            }
            this.container.classList.add('open');
        });
    }
    sendMessage(eventType, data) {
        this.iframe.contentWindow.postMessage({
            type: `${YEEFOX_AUTH_SIGNATURE}${eventType}`,
            data,
        }, "*");
    }
    hide() {
        this.container.classList.remove('open');
    }
}

export { YEEFOX_AUTH, YeefoxAuthSdk };
