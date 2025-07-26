# frida_script

frida 中文手册: https://frida.ivory.cafe/

frida 官网: https://frida.re/docs/home/

## adb
```bash
# 在 Android 设备上获取当前焦点窗口信息的命令
adb shell dumpsys window | findstr mCurrentFocus
```

## webpack 打包
```bash
npx webpack
```

## frida
```bash
frida -U -f com.ss.android.ugc.aweme -l hook.js
```

## 二合一
```bash
# windows
npx webpack; frida -U -f com.sankuai.meituan -l hook.js
```