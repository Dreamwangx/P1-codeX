# React Native 本地安装与调试指南

## 1) 环境准备
- Node.js >= 20
- JDK 17（Android）
- Android Studio（SDK + 模拟器）
- Xcode（iOS，macOS）
- Watchman（macOS 推荐）

检查：
```bash
node -v
npm -v
```

## 2) 安装依赖
```bash
npm install
```

> 当前仓库为基础骨架，没有强依赖 RN 包；接入真实 RN 工程时请在 `apps/mobile-rn` 下安装 `react`, `react-native`, `@react-native/*`。

## 3) 本地校验
```bash
npm test
npm run typecheck
```

## 4) 启动 RN 调试（接入 RN CLI 后）
在 `apps/mobile-rn` 目录：

```bash
npm run start
npm run android
npm run ios
```

## 5) 调试建议
- JS 逻辑调试：Metro + Dev Menu + React Native DevTools
- Android: `adb logcat`
- iOS: Xcode device logs
- 网络抓包：Charles/Proxyman

## 6) 当前骨架说明
- `src/main.ts` -> `app/bootstrap.ts` 启动链路。
- `bridge/*` 封装扫码/推送/蓝牙能力接口。
- `services/http` + `services/auth` 提供请求/鉴权基线。
