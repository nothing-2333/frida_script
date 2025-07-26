/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { log, print_stack, print_memory } = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\r\n\r\nJava.perform(() => {\r\n    hook_android_dlopen_ext()\r\n});\r\n\r\nfunction hook_android_dlopen_ext()\r\n{\r\n    let android_dlopen_ext_func_addr = Module.findExportByName(null, \"android_dlopen_ext\");\r\n    if (android_dlopen_ext_func_addr) {\r\n        Interceptor.attach(android_dlopen_ext_func_addr, {\r\n            onEnter(args) {\r\n                let pathptr = args[0];\r\n                if (pathptr !== undefined && pathptr != null) {\r\n                    this.path = ptr(pathptr).readCString();\r\n                    log(\"android_dlopen_ext\", this.path);\r\n                    if (this.path.endsWith(\"libmtguard.so\"))\r\n                    {\r\n                        setTimeout(hook_libmtguard_main_rerutn, 10); \r\n                    }\r\n                }\r\n            },\r\n            onLeave(ret) {\r\n\r\n            }\r\n        });\r\n    } else {\r\n        log(\"android_dlopen_ext not found\");\r\n    }\r\n}\r\nfunction hook_libmtguard_main_rerutn() {\r\n    let libmtguard_base = Module.getBaseAddress(\"libmtguard.so\");\r\n    if (!libmtguard_base) {\r\n        console.error(\"[-] libmtguard.so not loaded yet\");\r\n        return;\r\n    }\r\n    \r\n    let target_address = libmtguard_base.add(0x26038);\r\n    console.log(\"[+] Hooking function at: \" + target_address);\r\n    Interceptor.attach(target_address, {\r\n        onEnter: function (args) {\r\n            // 获取 JNIEnv 指针\r\n            let env = Java.vm.getEnv();\r\n            \r\n            // 直接使用 x20 寄存器的值作为 jobject 指针\r\n            let objArrayPtr = ptr(this.context.x20);\r\n            \r\n            // 获取数组长度\r\n            let length = env.getArrayLength(objArrayPtr);\r\n            console.log(\"[+] Object array length: \" + length);\r\n            \r\n            for (let i = 0; i < length; i++)\r\n            {\r\n                let elementPtr = env.getObjectArrayElement(objArrayPtr, i);\r\n                let javaObject = Java.cast(elementPtr, Java.use('java.lang.Object')); \r\n                let className = javaObject.getClass().getName(); \r\n                console.log(`对象类型: ${className}`, javaObject.toString());\r\n\r\n            }\r\n\r\n        },\r\n        onLeave: function (ret) {\r\n            // 可以在这里处理返回值\r\n        }\r\n    });\r\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module) => {

eval("function log(label) {\r\n  const args = Array.from(arguments).slice(1);\r\n  const message = args.map(arg => \r\n    typeof arg === 'string' ? arg : JSON.stringify(arg)\r\n  ).join(' ');\r\n  \r\n  console.log(`[${label}] ${message}`);\r\n}\r\n\r\nfunction print_stack(name) {\r\n    Java.perform(function () {\r\n        var Exception = Java.use(\"java.lang.Exception\");\r\n        var ins = Exception.$new(\"Exception\");\r\n        var straces = ins.getStackTrace();\r\n        if (straces != undefined && straces != null) {\r\n            var strace = straces.toString();\r\n            var replaceStr = strace.replace(/,/g, \"\\n\");\r\n            console.log(\"=============================\" + name + \" Stack strat=======================\");\r\n            console.log(replaceStr);\r\n            console.log(\"=============================\" + name + \" Stack end=======================\\r\\n\");\r\n            Exception.$dispose();\r\n        }\r\n    });\r\n}\r\n\r\nfunction print_memory(address, length=64) {\r\n    console.log(hexdump(address, {\r\n        offset: 0,\r\n        length: length,\r\n        header: true,\r\n        ansi: true,\r\n    }));\r\n}\r\n\r\nmodule.exports = { log, print_stack, print_memory };\n\n//# sourceURL=webpack:///./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;