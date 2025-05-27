```js
let pthread_creat_addr = Module.findExportByName("libc.so", "pthread_create")
Interceptor.attach(pthread_creat_addr, {
    onEnter(args){
        console.log("call pthread_create...")
        let func_addr = args[2]
        console.log("The thread function address is " + func_addr)
        console.log('pthread_create called from:\n' 
        + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n')
        + '\n'
        );
        
    }
})
```