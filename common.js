function log(label, content)
{
    if (Array.isArray(content))
    {
        for (let i = 0; i < content.length; ++i)
        {
            console.log(`[${label}] ${content[i]}`)
        }
    }
    else console.log(`[${label}] ${content}`)
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

function print_memory(address) {
    console.log(hexdump(address, {
        offset: 0,
        length: 64,
        header: true,
        ansi: true,
    }));
}

export { log, print_stack, print_memory}