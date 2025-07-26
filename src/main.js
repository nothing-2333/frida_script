const { log, print_stack, print_memory } = require("./utils");

Java.perform(() => {
    hook_android_dlopen_ext()
});

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
                    if (this.path.endsWith("libmtguard.so"))
                    {
                        setTimeout(hook_libmtguard_main_rerutn, 10); 
                    }
                }
            },
            onLeave(ret) {

            }
        });
    } else {
        log("android_dlopen_ext not found");
    }
}
function hook_libmtguard_main_rerutn() {
    let libmtguard_base = Module.getBaseAddress("libmtguard.so");
    if (!libmtguard_base) {
        console.error("[-] libmtguard.so not loaded yet");
        return;
    }
    
    let target_address = libmtguard_base.add(0x26038);
    console.log("[+] Hooking function at: " + target_address);
    Interceptor.attach(target_address, {
        onEnter: function (args) {
            // 获取 JNIEnv 指针
            let env = Java.vm.getEnv();
            
            // 直接使用 x20 寄存器的值作为 jobject 指针
            let objArrayPtr = ptr(this.context.x20);
            
            // 获取数组长度
            let length = env.getArrayLength(objArrayPtr);
            console.log("[+] Object array length: " + length);
            
            for (let i = 0; i < length; i++)
            {
                let elementPtr = env.getObjectArrayElement(objArrayPtr, i);
                let javaObject = Java.cast(elementPtr, Java.use('java.lang.Object')); 
                let className = javaObject.getClass().getName(); 
                console.log(`对象类型: ${className}`, javaObject.toString());
            }

        },
    });
}