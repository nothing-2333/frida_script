## dlopen
dlopen 是 POSIX 标准中定义的一个函数，用于动态加载共享库（通常是 .so 文件）。它在 Linux 和 Android 系统中都有广泛的应用, dlopen 在 Android 系统中实际上是通过调用 android_dlopen_ext 来实现的

### 函数原型
```c
void *dlopen(const char *filename, int flag);
```
### hook 示例
```js
function hook_dlopen()
{
    let dlopen_func_addr = Module.findExportByName(null, "dlopen");
    if (dlopen_func_addr) {
        Interceptor.attach(dlopen_func_addr, {
            onEnter(args) {
                let pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    this.path = ptr(pathptr).readCString();
                    log("android_dlopen_ext", this.path);
                }
            },
            onLeave(ret) {
                if (this.path.endsWith("librust_wynd_proxy.so"))
                {
                    hook_address()
                }
            }
        });
    } else {
        log("dlopen not found");
    }
}
```

## android_dlopen_ext
android_dlopen_ext 是 Android 系统特有的扩展函数，仅适用于 Android 平台
### 函数原型
```c
void *android_dlopen_ext(const char *filename, int flag, struct android_dlextinfo *extinfo);
```
### hook 示例
```js
function hook_android_dlopen_ext()
{
    let android_dlopen_ext_func_addr = Module.findExportByName(null, "android_dlopen_ext");
    if (android_dlopen_ext_func_addr) {
        Interceptor.attach(android_dlopen_ext_func_addr, {
            onEnter(args) {
                let pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    this.path = ptr(pathptr).readCString();
                    log("android_dlopen_ext", this.path);
                }
            },
            onLeave(ret) {
                if (this.path.endsWith("librust_wynd_proxy.so"))
                {
                    hook_address()
                }
            }
        });
    } else {
        log("android_dlopen_ext not found");
    }
}
```

## System.loadLibrary 
Java 中用于加载动态库（.so 文件）的方法

### hook 示例
```js
function hook_system_loadLibrary()
{
    const System = Java.use('java.lang.System');
    const Runtime = Java.use('java.lang.Runtime');
    const VMStack = Java.use('dalvik.system.VMStack');

    System.loadLibrary.implementation = function (library) {
        log("System.loadLibrary", library);


        // 调用原始的 loadLibrary 方法
        const loaded = Runtime.getRuntime().loadLibrary(VMStack.getCallingClassLoader(), library);

        return loaded;
    };
}
```

## 所有的实现都是调用了 Linux 的 api, 如
- 文件操作：通过 open 系统调用打开共享库文件。
- 内存映射：使用 mmap 系统调用将共享库的代码和数据映射到进程的地址空间。
- 符号解析：动态链接器解析共享库中的符号，确保函数和变量的正确链接