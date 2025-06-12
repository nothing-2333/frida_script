const { log, print_stack, print_memory } = require("./utils");

Java.perform(function() {
    hook_android_dlopen_ext();
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
                    
                    if (this.path.endsWith("libttboringssl.so"))
                    {
                        log("android_dlopen_ext", this.path);
                        // 延迟加载
                        // setTimeout(hook_SSL_CTX_set_custom_verify, 0)
                        // setTimeout(() => hook_export_functions("libttboringssl.so"), 0)
                    }

                    if (this.path.endsWith("libvcn.so"))
                    {
                        log("android_dlopen_ext", this.path);
                        // 延迟加载
                        setTimeout(hook_callback_of_libvcn, 10)
                    }
                    if (this.path.endsWith("libsscronet.so"))
                    {
                        log("android_dlopen_ext", this.path);
                        // 延迟加载
                        setTimeout(hook_callback_of_libsscronet, 10)
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

function hook_callback_of_libsscronet()
{
    const libsscronet = Process.getModuleByName("libsscronet.so");
    if (libsscronet)
    {
        let callback_of_libsscronet = libsscronet.base.add(0x3c77d8);

        Interceptor.attach(callback_of_libsscronet, {
            onEnter: function (args) {
                log("hook_callback_of_libsscronet args0", args[0])
            },
            onLeave: function (ret) {
                if (ret.toInt32() == 1)
                {
                    ret.replace(0x0);
                }
                
                log("hook_callback_of_libsscronet ret", ret.toInt32())
            }
        });
    }
    else
    {
        console.error("未找到 libsscronet.so 模块");
    }
}

function hook_callback_of_libvcn()
{
    const libvcn = Process.getModuleByName("libvcn.so");
    if (libvcn)
    {
        let callback_of_libvcn = libvcn.base.add(0x17334);

        Interceptor.attach(callback_of_libvcn, {
            onEnter: function (args) {
                log("callback_of_libvcn args0", args[0])
            },
            onLeave: function (ret) {
                if (ret.toInt32() == 1)
                {
                    ret.replace(0x0);
                }
                log("callback_of_libvcn ret", ret.toInt32())
            }
        });
    }
    else
    {
        console.error("未找到 libvcn.so 模块");
    }
}

function hook_export_functions(target_module) {

    // 1. 枚举并 Hook 所有导出函数
    Module.enumerateExports(target_module, {
        onMatch: function (export_item) {
            try {
                if (export_item.type == "function") 
                {
                    hook_export_function(export_item.name, export_item.address);
                    // console.log(`[+] hook ${export_item.name} 成功`);
                }
            } catch (error) {
                console.log(`[!] hook ${export_item.name} 失败: ${error}`);
            }
        },
        onComplete: function () {
            console.log(`[+] 已完成 ${target_module} 所有导出函数的 Hook`);
        }
    });

    // 2. Hook 函数的具体实现
    function hook_export_function(func_name, func_address) {
        Interceptor.attach(func_address, {
            onEnter: function (args) {
                console.log(`[→] ${func_name} 被调用`);
            },
            onLeave: function (ret) {
                console.log(`[←] ${func_name} 返回`);
            }
        });
    }
}

function hook_SSL_CTX_set_custom_verify()
{
    let SSL_CTX_set_custom_verify = Module.getExportByName('libttboringssl.so', 'SSL_CTX_set_custom_verify');
    Interceptor.attach(SSL_CTX_set_custom_verify, {
        onEnter: function(args)
        {
            console.log(`SSL_CTX: ${args[0]}`)
            console.log(`验证模式: ${args[1]}`)
            console.log(`回调函数地址: ${args[2]}`)

            let callback_module = Process.findModuleByAddress(args[2]);

            console.log("module: " + callback_module.name, "offset: " + ptr(args[2]).sub(callback_module.base))
        }
    })
}