# hook java
## 查找类
```js
Java.perform(function () {
    let class_reference = Java.use('');
    class_reference.method.overload('int').implementation = function (){
        console.log("Hook 开始");


    }
})
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
## hook 构造函数
```js
Java.perform(function() {
    let class_reference = Java.use('');
    class_reference.$init.implementation = function(){
        console.log("Hook Start");


    }
});
```

# 方法调用
```js
Java.perform(function() {
    let class_reference = Java.use('');
    let instance = class_reference.$new();
    instance.method();
})
```