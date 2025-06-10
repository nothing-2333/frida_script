const { log, print_stack, print_memory } = require("./utils");

Java.perform(function() {
    hook_android_dlopen_ext();
});

let a = {}

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
                        setTimeout(hook_libttboringssl, 0); 
                        // hook_SSL_CTX_set_custom_verify
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

function hook_libttboringssl()
{
    hook_export_functions("libttboringssl.so")
}

function hook_export_functions(target_module) {

    // 1. 枚举并 Hook 所有导出函数
    Module.enumerateExports(target_module, {
        onMatch: function (export_func) {
            hook_export_function(export_func.name, export_func.address);
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
    let callbacks = []

    let SSL_CTX_set_custom_verify = Module.getExportByName('libttboringssl.so', 'SSL_CTX_set_custom_verify');
    Interceptor.attach(SSL_CTX_set_custom_verify, {
        onEnter: function (args)
        {
            console.log(`SSL_CTX: ${args[0]}`)
            console.log(`验证模式: ${args[1]}`)
            console.log(`回调函数地址: ${args[2]}`)

            callbacks.push(args[2].toString())
            if (!callbacks.includes(args[2].toString()))
            {
                // hook callback
                Interceptor.attach(args[2], {
                    onEnter: function (args)
                    {
                       log("callback", callbacks);
                        
                    },
                    onLeave: function (ret)
                    {
                        console.log("返回值:", ret);
                        if (ret.toInt32() !== 0)
                        {
                            ret.replace(0);
                        }
                    }
                })
            }

        }
    })
}