# @yeefox/auth-sdk
以狐钱包授权SDK (1.3.0)

## 安装

通过npm 安装

`npm install @yeefox/auth-sdk`



## 如何引入

打包后的版本在 `lib` 文件夹

```javascript
import {YEEFOX_AUTH, YeefoxAuthSdk} from "@yeefox/auth-sdk/lib";
```

如果您使用打包工具, 可也以这样

```javascript
import {YEEFOX_AUTH, YeefoxAuthSdk} from "@yeefox/auth-sdk";
```

或者在浏览器直接引入

```html
<script type="text/javascript" src="node_modules/@yeefox/auth-sdk/lib/index.umd.js"></script>
<script type="text/javascript">
    const appId="xxx";
	const yeefoxAuth = window.YEEFOX.YeefoxAuthSdk.instance(appId);
</script>
```

使用申请授权接口前, 初始化必须传入 appId, 使用DApp授权接口则不需要



## 调用方法

- 初始化SDK, 使用单例模式, 用instance方法获得实例

  ```javascript
  const appId="xxx";
  const yeefoxAuth = YeefoxAuthSdk.instance(appId);
  ```

### 申请授权接口 (需要appId)

1. 申请授权用户信息接口(grantUserInfo)

   `fields`参数包含

   | UserInfoField 代码 | 值(字符串) | 意义   |
   | ------------------ |----------| ------ |
   | CODE               | code     | 用户码 |
   | WALLET             | wallet   | 链地址 |
   | PHONE              | phone    | 手机号 |
   | NICK_NAME          | nickName | 昵称   |

   `chain` 参数为以狐钱包链代码, 在fields中包含wallet时必填

   `walletType` 参数在链为天舟链时可选, `0x`是EVM链地址格式, `iaa`是原生链地址格式

2. 申请授权用户资产列表查看接口(grantAssetView)

   `chains`参数为以狐钱包链代码数组, 可选. 当填入时, 用户只能在选择的链中授权链地址

3. 申请授权用户资产托管接口(grantAssetHosting)

   `chain`参数为资产的以狐钱包链代码

   `class_id`参数为资产的分类ID

   `token_id`参数为资产的TokenID

   `type`参数为资产类型

   | 值(数字) | 意义                    |
   | -------- | ----------------------- |
   | 137      | Web3域名                |
   | 721      | NFT(Non-Fungible Token) |
   | 1155     | MT(Multi-Token)         |

   `amount`参数为数量, 在137和721时恒定为1, 1155时为需要托管的数量



上面三个接口都会异步返回(Promise<string>)一个授权序列号, 将序列号交于后端以实际执行授权.

```javascript
try{
    const serial = await yeefoxAuth.grantUserInfo({
        fields: [YEEFOX_AUTH.UserInfoField.CODE, YEEFOX_AUTH.UserInfoField.WALLET, YEEFOX_AUTH.UserInfoField.PHONE],
        chain: "wenchang-tianzhou"
    });
    console.log("授权成功, 凭证序列号",serial)
}
catch(e){
    console.error("授权失败", e);
}
```

如果授权发生错误(用户拒绝, 参数错误等) 会抛出错误.

### DApp授权接口 (不需要appId)

1. DApp授权用户信息

   `fields`参数包含

   | UserInfoField 代码 | 值(字符串) | 意义   |
   | ------------------ | ---------- | ------ |
   | CODE               | code       | 用户码 |
   | WALLET             | wallet     | 链地址 |

   `chain` 参数为以狐钱包链代码, 在fields中包含wallet时必填

在调用DApp接口前应该先检测DApp环境是否有效

```javascript
if(YeefoxAuthSdk.dappAvailable()){
    ...
}
else{
    console.error("未检测到DApp环境")
}
```





调用示例代码

```javascript
try {
    const result = await yeefoxAuth.getUserInfo({
        fields: [
            YEEFOX_AUTH.UserInfoField.CODE,
            YEEFOX_AUTH.UserInfoField.WALLET,
        ],
        chain: 'wenchang-tianzhou',
    });

    console.log("授权成功, 用户信息",result)
}
catch (e){
    console.error("授权失败", e);
}
```





## 附录

以狐钱包链代码(2023-08-28)

| 链代码            | 链名称 |
| ----------------- | ------ |
| wenchang-tianhe   | 天和链 |
| wenchang-tianzhou | 天舟链 |
| conflux           | 树图链 |

