# 本地安装、启动与调试指南（浏览器 + iOS/Android 真机）

> 这份文档按“从零到可调试”写，适用于第一次接手这个仓库的同学。

## 1. 你现在拿到的是什么

当前仓库是 **Week 1-8 基础骨架**，重点是架构与能力抽象（bridge/http/auth/push/ble/telemetry），不是完整业务应用。

因此：
- 可以先跑通 **Web 本地调试**（浏览器）。
- 可以继续接入 **Capacitor 原生容器调试**（iOS/Android/真机）。

---

## 2. 环境准备

## 2.1 必备工具
- Node.js: `>=20`（建议 20 LTS）
- npm: `>=10`
- Git

检查命令：

```bash
node -v
npm -v
git --version
```

## 2.2 iOS 调试额外要求（macOS）
- Xcode（最新稳定版）
- CocoaPods（`pod --version`）
- Apple Developer 证书/描述文件（真机安装需要）

## 2.3 Android 调试额外要求
- Android Studio
- Android SDK + Platform Tools（`adb`）
- 配好 `ANDROID_HOME`/`ANDROID_SDK_ROOT`

检查命令：

```bash
adb version
```

---

## 3. 安装依赖

> 当前仓库是最小骨架，首次运行前请先安装 Web 和 Capacitor 相关依赖。

在仓库根目录执行：

```bash
npm install -D typescript
npm install -w apps/web -D vite
npm install -w apps/capacitor @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

安装完成后，建议先确认基础检查：

```bash
npm test
npm run typecheck
```

---

## 4. 浏览器本地调试（Web）

在仓库根目录执行：

```bash
npm run dev -w apps/web
```

默认访问：
- `http://localhost:5173`

调试方式：
- 打开 Chrome DevTools
- 看 Console：可看到 bootstrap、push/ble warmup、perf 日志
- Network 中检查 HTTP 请求封装是否生效（traceId / auth header）

如果端口被占用：

```bash
npm run dev -w apps/web -- --port 5174
```

---

## 5. iOS 真机/模拟器调试（Capacitor）

## 5.1 先构建 Web 静态资源

```bash
npm run build -w apps/web
```

## 5.2 同步到原生工程

```bash
cd apps/capacitor
npx cap sync ios
```

## 5.3 用 Xcode 打开

```bash
npx cap open ios
```

在 Xcode 内：
1. 选择 Team（签名）
2. 选择模拟器或真机
3. 点击 Run

真机调试建议：
- 使用 Safari -> Develop -> 你的设备 -> WebView 页面
- 查看 console、network、source map

---

## 6. Android 真机/模拟器调试（Capacitor）

## 6.1 先构建 Web 静态资源

```bash
npm run build -w apps/web
```

## 6.2 同步到原生工程

```bash
cd apps/capacitor
npx cap sync android
```

## 6.3 用 Android Studio 打开

```bash
npx cap open android
```

在 Android Studio 内：
1. 选择模拟器或 USB 真机
2. 点击 Run
3. 用 Logcat 查看原生日志

WebView 调试：
- 在真机开启开发者模式和 USB 调试
- Chrome 打开 `chrome://inspect` 进行 H5 页面调试

---

## 7. 常见问题排查

## 7.1 `npm test` 找不到 `tests/**/*.test.mjs`
已在脚本里修复为 `tests/*.test.mjs`，避免 CI shell 不支持 `globstar`。

## 7.2 `vite: command not found`
说明还没安装 `apps/web` 依赖：

```bash
npm install -w apps/web -D vite
```

## 7.3 `@capacitor/*` 模块找不到
说明还没安装 `apps/capacitor` 依赖：

```bash
npm install -w apps/capacitor @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

## 7.4 iOS 无法真机安装（签名错误）
- 检查 Apple ID、Team、Bundle ID
- 检查 Provisioning Profile
- 真机“设置 -> 通用 -> VPN 与设备管理”信任证书

## 7.5 Android 连不上设备
- 检查 USB 调试
- `adb devices` 看是否授权
- 数据线换成可传输数据线

---

## 8. 推荐调试顺序（最省时间）

1. 先跑 `npm test` + `npm run typecheck`
2. 再跑 `npm run dev -w apps/web` 做浏览器调试
3. 然后 `build -> cap sync -> open ios/android` 做端侧联调
4. 最后再接扫码/推送/蓝牙真实插件实现

---

## 9. 给新同学的一句话

先把 **浏览器链路跑通**，再上 **Capacitor 容器**，最后做 **真机能力联调**，这样不会被原生环境问题卡死。
