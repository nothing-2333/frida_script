const { log, print_stack, print_memory } = require("./utils");

Java.perform(() => {
    hook_RegisterNatives()
});

function hook_main()
{
    const base = Module.getBaseAddress("libmtguard.so");
    const targetFunc = base.add(0x2B0AC); 

    console.log(targetFunc);
    const ObjectArrayClass = Java.use("[Ljava.lang.Object;");
    console.log(ObjectArrayClass);
    
    Interceptor.attach(targetFunc, {
        onEnter(args) {
            console.log("状态码: ", args[0].toInt32());
            let obj = args[1];
            try {
                obj = Java.cast(obj, ObjectArrayClass);
                console.log(obj, JSON.stringify(obj))
            } catch (error) {
                console.log(error);
            }
        },
        onLeave(retval) {
            console.log("返回值: ", retval, JSON.stringify(retval));
        }
    });
}

function hook_RegisterNatives() {
    let symbols = Module.enumerateSymbolsSync("libart.so");
    let addrRegisterNatives = null;
    for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i];
        if (symbol.name.indexOf("art") >= 0 &&
                symbol.name.indexOf("JNI") >= 0 && 
                symbol.name.indexOf("RegisterNatives") >= 0 && 
                symbol.name.indexOf("CheckJNI") < 0) {
            addrRegisterNatives = symbol.address;
        }
    }

    if (addrRegisterNatives != null) {
        Interceptor.attach(addrRegisterNatives, {
            onEnter: function (args) {
                log("RegisterNatives", "method_count: ", args[3]);
                let env = args[0];
                let java_class = args[1];
                let class_name = Java.vm.tryGetEnv().getClassName(java_class);

                let methods_ptr = ptr(args[2]);

                let method_count = parseInt(args[3]);
                for (let i = 0; i < method_count; i++) {
                    let name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));
                    let sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));
                    let fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2));

                    let name = Memory.readCString(name_ptr);
                    let sig = Memory.readCString(sig_ptr);
                    let find_module = Process.findModuleByAddress(fnPtr_ptr);
                    log("RegisterNatives", [
                        "java_class: " + class_name,
                        "name: " + name,
                        "sig: " + sig, 
                        "fnPtr: " + fnPtr_ptr, 
                        "module_name: " + find_module.name, 
                        "module_base: " + find_module.base, 
                        "offset: " + ptr(fnPtr_ptr).sub(find_module.base),
                    ]);
                    console.log("")
                }
                
            }
        });
    }
}