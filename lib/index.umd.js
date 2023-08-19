(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.yeefoxDAppSdk = {}));
})(this, (function (exports) { 'use strict';

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

    exports.YEEFOX_AUTH = void 0;
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
        (function (SerialEvent) {
            SerialEvent["READY"] = "READY";
            SerialEvent["APPROVE"] = "APPROVE";
            SerialEvent["REJECT"] = "REJECT";
        })(YEEFOX_AUTH.SerialEvent || (YEEFOX_AUTH.SerialEvent = {}));
    })(exports.YEEFOX_AUTH || (exports.YEEFOX_AUTH = {}));

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

    var css_248z = ".yeefox-iframe{border:0;flex:1;width:100%}.yeefox-iframe-container{background:#fff;bottom:0;display:flex;flex-direction:column;left:0;overflow:hidden;position:fixed;right:0;top:100vh}.yeefox-iframe-container.animate{transition:top .3s linear}.yeefox-iframe-container.open{top:0}";
    styleInject(css_248z);

    var UserInfoField = exports.YEEFOX_AUTH.UserInfoField;
    var AuthEvent = exports.YEEFOX_AUTH.AuthEvent;
    var SerialEvent = exports.YEEFOX_AUTH.SerialEvent;
    const YEEFOX_ORIGIN = 'https://h5.yeefox.cc';
    const YEEFOX_AUTH_SIGNATURE = 'YEEFOX:OPEN_AUTH:';
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
            this.html = new YeefoxAuthIframe((e, data) => this.eventHandler(e, data));
            this.ready = new WrapPromise();
        }
        static get VERSION() {
            return '1.0.0';
        }
        grantAssetView(options, commonOption) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.promise) {
                    throw new Error('当前有授权在进行中');
                }
                yield this.html.show();
                yield this.ready;
                this.promise = new WrapPromise();
                this.sendMessage(exports.YEEFOX_AUTH.AuthEvent.ASSET_VIEW, {
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
                if (options.fields.indexOf(UserInfoField.WALLET) !== -1) {
                    if (!options.chain) {
                        throw new Error('请选择链地址所在的区块链');
                    }
                }
                if (this.promise) {
                    throw new Error('当前有授权在进行中');
                }
                yield this.html.show();
                yield this.ready;
                this.promise = new WrapPromise();
                this.sendMessage(exports.YEEFOX_AUTH.AuthEvent.USER_INFO, {
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
                yield this.html.show();
                yield this.ready;
                this.promise = new WrapPromise();
                this.sendMessage(exports.YEEFOX_AUTH.AuthEvent.ASSET_HOSTING, {
                    data: options,
                    custom: commonOption === null || commonOption === void 0 ? void 0 : commonOption.custom,
                    sign: commonOption === null || commonOption === void 0 ? void 0 : commonOption.sign,
                    appId: this.appId
                });
                return this.promise;
            });
        }
        eventHandler(eventType, data) {
            switch (eventType) {
                case SerialEvent.READY:
                    this.sendMessage(AuthEvent.READY, { data: window.location.origin });
                    this.ready.resolve();
                    break;
                case SerialEvent.APPROVE:
                    if (this.promise) {
                        this.promise.resolve(data.serial);
                        this.promise = undefined;
                        this.html.hide();
                    }
                    break;
                case SerialEvent.REJECT:
                    if (this.promise) {
                        this.promise.reject(data.reason);
                        this.promise = undefined;
                        this.html.hide();
                    }
                    break;
            }
        }
        sendMessage(eventType, data) {
            this.html.sendMessage(eventType, data);
        }
    }
    class YeefoxAuthIframe {
        constructor(eventHandler) {
            this.container = document.createElement('div');
            this.container.className = 'yeefox-iframe-container animate';
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'yeefox-iframe';
            this.container.appendChild(this.iframe);
            this.visited = false;
            this.eventHandler = eventHandler;
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
        messageHandler(e) {
            if (typeof e.data === "object" && e.data) {
                if (typeof e.data.type === "string" && e.data.type.indexOf(YEEFOX_AUTH_SIGNATURE) === 0) {
                    let type = e.data.type.substring(YEEFOX_AUTH_SIGNATURE.length);
                    if (type === SerialEvent.READY) {
                        this.origin = e.data.data.data;
                    }
                    this.eventHandler(type, e.data.data);
                }
            }
        }
        sendMessage(eventType, data) {
            var _a;
            this.iframe.contentWindow.postMessage({
                type: `${YEEFOX_AUTH_SIGNATURE}${eventType}`,
                data,
            }, (_a = this.origin) !== null && _a !== void 0 ? _a : "*");
        }
        hide() {
            this.container.classList.remove('open');
        }
    }

    exports.YeefoxAuthSdk = YeefoxAuthSdk;

}));
//# sourceMappingURL=index.umd.js.map
