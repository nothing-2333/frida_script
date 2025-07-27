function log(label) {
  const args = Array.from(arguments).slice(1);
  const message = args.map(arg => 
    typeof arg === 'string' ? arg : JSON.stringify(arg)
  ).join(' ');
  
  console.log(`[${label}] ${message}`);
}

function print_stack(name) {
    Java.perform(function () {
        var Exception = Java.use("java.lang.Exception");
        var ins = Exception.$new("Exception");
        var straces = ins.getStackTrace();
        if (straces != undefined && straces != null) {
            var strace = straces.toString();
            var replaceStr = strace.replace(/,/g, "\n");
            console.log("=============================" + name + " Stack strat=======================");
            console.log(replaceStr);
            console.log("=============================" + name + " Stack end=======================\r\n");
            Exception.$dispose();
        }
    });
}

function print_memory(address, length=64) {
    console.log(hexdump(address, {
        offset: 0,
        length: length,
        header: true,
        ansi: true,
    }));
}

function print_jobject(jobject, can_print_fields=false, can_print_methods=false)
{
    let className = jobject.getClass().getName(); 
    console.log(`${className} -> `, jobject.toString());

    if (can_print_fields)
    {
        // 获取对象的所有字段
        let fields = jobject.getClass().getDeclaredFields();
        for (let field of fields) {
            field.setAccessible(true); // 确保可以访问私有字段
            let fieldName = field.getName();
            let fieldValue = field.get(jobject);
            console.log('  Field:', fieldName, 'Value:', fieldValue);
        }
    }

    if (can_print_methods)
    {
        // 获取对象的所有方法
        let methods = jobject.getClass().getDeclaredMethods();
        for (let method of methods) {
            method.setAccessible(true); // 确保可以访问私有方法
            let methodName = method.getName();
            console.log('  Method:', methodName);
        }
    }
}


module.exports = { log, print_stack, print_memory, print_jobject };