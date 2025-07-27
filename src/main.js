const { log, print_stack, print_memory, print_jobject } = require("./utils");
import { VM, InstPosition, VMAction } from "../qbdi/frida-qbdi.js";


Java.perform(function () {
    hook_android_dlopen_ext();
});

function hook_native_main()
{
    // 获取 ShellBridge 类
    var ShellBridge = Java.use('com.meituan.android.common.mtguard.ShellBridge');

    // Hook main 方法
    ShellBridge.main.overload('int', '[Ljava.lang.Object;').implementation = function (i, objArr) {
        console.log('args: ', i);
        print_jobject(objArr)
        var result = this.main(i, objArr);
        console.log('return: ', result);
        return result;
    };
}

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
                        setTimeout(hook_libmtguard_main, 10); 
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
function hook_libmtguard_main() {
    let libmtguard_base = Module.getBaseAddress("libmtguard.so");
    console.log("libmtguard.so address: ", libmtguard_base);
    
    let target_address;

    // for (let address of [0x25df0, 0x2653c, 0x268c8, 0x26aa4, 0x26c78])
    // {
    //     target_address = libmtguard_base.add(address);
    //     console.log("[+] Hooking function at: " + target_address);
    //     Interceptor.attach(target_address, {
    //         onEnter: function (args) {
    //             console.log("调用 ", address.toString(16), this.context.x20);
    //         },
    //     });
    // }


    // target_address = libmtguard_base.add(0x26530);
    // console.log("[+] Hooking function at: " + target_address);
    // Interceptor.attach(target_address, {
    //     onEnter: function (args) {
    //         console.log("结果: ", this.context.x0, this.context.x1);
    //         let javaObject = Java.cast(this.context.x1, Java.use('java.lang.Object')); 
    //         print_jobject(javaObject)
    //     },
    // });

    // target_address = libmtguard_base.add(0x3E254);
    // console.log("[+] Hooking function at: " + target_address);
    // Interceptor.attach(target_address, {
    //     onEnter: function (args) {
    //         console.log("调用: ", this.context.x0, this.context.x1, this.context.x2, this.context.x3);
    //         console.log("findModuleByAddress", this.context.x8)
    //     },
    // });0x7455492000

    target_address = libmtguard_base.add(0x25D2C);
    console.log("[+] Hooking function at: " + target_address);
    Interceptor.attach(target_address, {
        onEnter: function (args) {
            console.log("返回: ", this.context.x0, this.context.x1, this.context.x2, this.context.x3);
            trace_libmtguard(this.context.x0, this.context.x1, this.context.x2, this.context.x3)
        },
    });

}



function trace_libmtguard(...args)
{
    var vm = new VM();
    var state = vm.getGPRState();
    var stack = vm.allocateVirtualStack(state, 0x100000);

    let libmtguard_module = Process.findModuleByName("libmtguard.so");
    console.log("libmtguard.so: ", libmtguard_module.base);
    
    vm.addInstrumentedRange(libmtguard_module.base, libmtguard_module.base.add(libmtguard_module.size));

    var icbk = vm.newInstCallback(function(vm, gpr, fpr, data) {
        var inst = vm.getInstAnalysis();
        // gpr.dump(); // Display context
        console.log("0x" + inst.address.toString(16) + " " + inst.disassembly); // Display instruction dissassembly
        return VMAction.CONTINUE;
    });

    var iid = vm.addCodeCB(InstPosition.PREINST, icbk);

    var result = vm.call(libmtguard_module.base.add(0x25D2C), args);
    console.log("函数返回值:", result);
    if (result != 0x0)
    {
        console.log("获取结果:", result);
        let javaObject = Java.cast(result, Java.use('java.lang.Object')); 
        print_jobject(javaObject)
    }

    return result
}


