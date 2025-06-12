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



### hook function
```js
Interceptor.attach(target_address, {
    onEnter: function (args) {

    },
    onLeave: function (ret) {

    }
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

## pointer to string
```js
Memory.readCString(address)
Memory.readUtf8String(address)
ptr(address).readCString()
```

## 内存提权
```js
Memory.protect(address, size, protection);
```

