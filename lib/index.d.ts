import { WrapPromise } from "./WrapPromise";
export { YEEFOX_AUTH } from "./interface";
import { YEEFOX_AUTH } from "./interface";
import './scss/style.scss';
export declare class YeefoxAuthSdk {
    promise: WrapPromise<string> | undefined;
    private readonly html;
    private readonly ready;
    readonly appId: string | undefined;
    static instance(appId?: string): YeefoxAuthSdk;
    protected constructor(appId?: string);
    static get VERSION(): string;
    grantAssetView(options: YEEFOX_AUTH.AuthMethodData.AssetView, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon): Promise<string>;
    grantUserInfo(options: YEEFOX_AUTH.AuthMethodData.UserInfo, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon): Promise<string>;
    grantAssetHosting(options: YEEFOX_AUTH.AuthMethodData.AssetHosting, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon): Promise<string>;
    private eventHandler;
    private sendMessage;
}
