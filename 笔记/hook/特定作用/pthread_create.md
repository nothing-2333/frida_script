## 线程创建
hook `libc.so` 中的 `pthread_create` 函数

```js
let pthread_creat_addr = Module.findExportByName("libc.so", "pthread_create")
Interceptor.attach(pthread_creat_addr, {
    onEnter(args){
        console.log("pthread_create 被调用")
        let func_addr = args[2]
        console.log("函数地址: " + func_addr)
        console.log('堆栈:\n' 
        + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n')
        + '\n'
        );
        
    }
})
```

