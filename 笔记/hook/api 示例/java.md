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

## 根据对象指针获取它的类名
```js
let javaObject = Java.cast(elementPtr, Java.use('java.lang.Object')); 
let className = javaObject.getClass().getName(); 
console.log(`对象类型: ${className}`);
```
