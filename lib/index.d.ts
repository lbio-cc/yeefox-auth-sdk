import { WrapPromise } from "./WrapPromise";
export { YEEFOX_AUTH } from "./interface";
import { YEEFOX_AUTH } from "./interface";
import AuthEvent = YEEFOX_AUTH.AuthEvent;
import SerialEvent = YEEFOX_AUTH.SerialEvent;
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
    eventHandler<T extends SerialEvent>(eventType: T, data: YEEFOX_AUTH.SerialEventDataType<T>): void;
    sendMessage<T extends AuthEvent>(eventType: T, data: YEEFOX_AUTH.AuthEventDataType<T>): void;
}
export declare class YeefoxAuthIframe {
    private readonly container;
    private readonly iframe;
    private visited;
    private origin;
    private readonly eventHandler;
    constructor(eventHandler: (eventType: SerialEvent, data: any) => Promise<void> | void);
    show(): Promise<void>;
    messageHandler(e: MessageEvent): void;
    sendMessage<T extends AuthEvent>(eventType: T, data: any): void;
    hide(): void;
}
