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

## 遍历 object[]
```js
// 获取 JNIEnv 指针
let env = Java.vm.getEnv();
// 直接使用 x20 寄存器的值作为 jobject 指针
let objArrayPtr = ptr(this.context.x20);
// 获取数组长度
let length = env.getArrayLength(objArrayPtr);
// 遍历
for (let i = 0; i < length; ++i)
{
    let elementPtr = env.getObjectArrayElement(objArrayPtr, i);
}
```