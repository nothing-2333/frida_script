# hook 一个 so 的所有导出函数
```js
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
```