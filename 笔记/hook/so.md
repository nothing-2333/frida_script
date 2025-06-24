## Module
```js
// 枚举 so 中导出函数
let expert_table = Module.enumerateExports('libfrida0xb.so'); 
console.log(JSON.stringify(expert_table, null, 2));

// 获取 so 中导出函数地址
let target_address = Module.getExportByName('libfrida0xb.so', 'func_name');

// 根据 so 名字获取地址
Module.getBaseAddress(name)
Module.findBaseAddress(name)

// 从地址读取字符串
Memory.readCString(address)
Memory.readUtf8String(address)
ptr(address).readCString()

// 内存提权
Memory.protect(address, size, protection);
```

## Process
```js
// 获取 module 对象
Process.findModuleByAddress(address)
Process.getModuleByAddress(address)
Process.findModuleByName(name)
Process.getModuleByName(name)
```

## 内存地址加减
```js
ptr(address).add(0x55)
ptr(address).sub(0x55)
```

## hook

### hook function
```js
Interceptor.attach(target_address, {
    onEnter: function (args) {

    },
    onLeave: function (ret) {

    }
});
```

### 内联 hook: 在执行到该地址时触发回调函数
```js
// 设置内联 hook
Instruction.setCallback(address, function(context) {
    console.log(`[+] address at: ${address}`);
    
    // 读取寄存器 (ARM64)
    console.log(`X0 = ${context.x0.toInt32()}`);  // 整数值
    console.log(`X1 = ${context.x1}`);            // 指针地址
    
    // 读取X1寄存器指向的内存（字符串示例）
    const memContent = Memory.readUtf8String(context.x1);
    console.log(`X1指向的字符串: ${memContent}`);
    
    // 修改寄存器
    context.x0 = ptr(0x999); 
});
```

## 创建一个函数 function
```js
let native_address = new NativePointer(address_of_the_native_function); // 字符串到指针
const native_function = new NativeFunction(native_address, 'return_type', ['argument_data_type']);
native_function(arguments);
```

## 修改机器码
```js
let writer = new X86Writer(address_of_the_instruction);
try {
  writer.flush();
} finally {
  writer.dispose();
}
```


