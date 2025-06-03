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
                    log("android_dlopen_ext", this.path);
                }
            },
            onLeave(ret) {
                if (this.path.endsWith("libttboringssl.so"))
                {
                    // 在这里添加更多逻辑
                    hook_SSL_CTX_set_custom_verify()
                }
            }
        });
    } else {
        log("android_dlopen_ext not found");
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

        },
        onLeave: function (ret)
        {
            console.log("返回值:", ret);
        }
    })
}