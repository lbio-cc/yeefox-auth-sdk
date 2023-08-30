export declare namespace YEEFOX_AUTH {
    const enum Mode {
        HTML = "iframe",
        DAPP = "dapp"
    }
    enum UserInfoField {
        CODE = "code",
        WALLET = "wallet",
        NICK_NAME = "nickName",
        PHONE = "phone"
    }
    enum AuthEvent {
        USER_INFO = "USER_INFO",
        ASSET_HOSTING = "ASSET_HOSTING",
        ASSET_TRANSFER = "ASSET_TRANSFER",
        ASSET_VIEW = "ASSET_VIEW",
        SIGN = "SIGN",
        READY = "READY"
    }
    enum DAppEvent {
        USER_INFO = "DAPP_USER_INFO"
    }
    namespace AuthMethodData {
        interface UserInfo {
            fields: UserInfoField[];
            chain?: string;
            walletType?: '0x' | 'iaa';
        }
        interface AssetView {
            chains?: string[];
        }
        interface AssetHosting {
            chain: string;
            class_id: string;
            token_id: string;
            type: 721 | 1155 | 137;
            amount: number;
        }
        interface AssetTransfer extends AssetHosting {
            recipient: string;
        }
    }
    namespace DAppMethodData {
        interface UserInfo {
            fields: Exclude<UserInfoField, UserInfoField.PHONE>[];
            chain?: string;
            walletType?: '0x' | 'iaa';
        }
    }
    namespace AuthEventData {
        interface Ready {
            data: string;
        }
        interface UserCommon {
            custom?: string;
            sign?: string;
        }
        interface Common extends UserCommon {
            appId?: string;
            data: any;
        }
        interface UserInfo extends Common {
            data: AuthMethodData.UserInfo;
        }
        interface AssetView extends Common {
            data: AuthMethodData.AssetView;
        }
        interface AssetHosting extends Common {
            data: AuthMethodData.AssetHosting;
        }
        interface AssetTransfer extends Common {
            data: AuthMethodData.AssetTransfer;
        }
    }
    namespace DAppEventData {
        interface UserInfo {
            data: DAppMethodData.UserInfo;
        }
    }
    type AuthEventDataType<T extends AuthEvent = AuthEvent> = T extends AuthEvent.READY ? AuthEventData.Ready : T extends AuthEvent.USER_INFO ? AuthEventData.UserInfo : T extends AuthEvent.ASSET_VIEW ? AuthEventData.AssetView : T extends AuthEvent.ASSET_HOSTING ? AuthEventData.AssetHosting : T extends AuthEvent.ASSET_TRANSFER ? AuthEventData.AssetTransfer : never;
    type DAppEventDataType<T extends DAppEvent = DAppEvent> = T extends DAppEvent.USER_INFO ? DAppEventData.UserInfo : never;
    enum ServerEvent {
        READY = "READY",
        APPROVE = "APPROVE",
        REJECT = "REJECT",
        USER_INFO = "USER_INFO"
    }
    namespace ServerEventData {
        interface Ready {
            serial: number;
        }
        interface Approve {
            serial: string;
        }
        interface Reject {
            reason?: string;
        }
        interface UserInfo {
            code?: string;
            wallet?: string;
        }
    }
    type ServerEventDataType<T extends ServerEvent = ServerEvent> = T extends ServerEvent.READY ? ServerEventData.Ready : T extends ServerEvent.APPROVE ? ServerEventData.Approve : T extends ServerEvent.REJECT ? ServerEventData.Reject : T extends ServerEvent.USER_INFO ? ServerEventData.UserInfo : never;
}
