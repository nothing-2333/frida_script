# android_dlopen_ext
```js
function hook_android_dlopen_ext()
{
    let android_dlopen_ext_func_addr  = Module.findExportByName(null, "android_dlopen_ext")
    Interceptor.attach(android_dlopen_ext_func_addr, {
        onEnter(args) {
            let pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                this.path = ptr(pathptr).readCString();
                log("Load", this.path)
            }
        },
        onLeave(ret) {
            if (this.path.includes("libmatch03.so"))
            {
                
            }
        }
    });
}

```