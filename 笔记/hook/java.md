## 查找类
```js
Java.perform(function () {
    let class_reference = Java.use('');
    class_reference.method.overload('int').implementation = function (){
        console.log("Hook 开始");


    }
})
```

## hook 构造函数
```js
Java.perform(function() {
    let class_reference = Java.use('');
    class_reference.$init.implementation = function(){
        console.log("Hook Start");

    }
});
```

## 查找实例
```js
Java.performNow(function() {
    Java.choose('', {
        onMatch: function(instance) {
            console.log("找到实例");
        },
        onComplete: function() {}
    });
});
```

## 方法调用
```js
Java.perform(function() {
    let class_reference = Java.use('');
    let instance = class_reference.$new();
    instance.method();
})
```

## jstr 转 cstr
```js
let env = Java.vm.tryGetEnv()
let cstr = env.getStringUtfChars(jstr)
console.log(cstr.readCString())
```

## cstr 转 jstr
```js
let env = Java.vm.tryGetEnv()
let jstr = env.newStringUtf('bbs.125.la') 
ret.replace(jstr)
```