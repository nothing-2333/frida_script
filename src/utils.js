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

function print_memory(address) {
    console.log(hexdump(address, {
        offset: 0,
        length: 64,
        header: true,
        ansi: true,
    }));
}

let a = [0x7c109dd334,0x7c109dd334,0x7c109dd334]
console.log(a.includes(0x7c109dd334));


module.exports = { log, print_stack, print_memory };