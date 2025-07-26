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