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

eval("const { log, print_stack, print_memory } = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\r\n\r\nJava.perform(function() {\r\n    hook_android_dlopen_ext();\r\n});\r\n\r\nfunction hook_android_dlopen_ext()\r\n{\r\n    let android_dlopen_ext_func_addr = Module.findExportByName(null, \"android_dlopen_ext\");\r\n    if (android_dlopen_ext_func_addr) {\r\n        Interceptor.attach(android_dlopen_ext_func_addr, {\r\n            onEnter(args) {\r\n                let pathptr = args[0];\r\n                if (pathptr !== undefined && pathptr != null) {\r\n                    this.path = ptr(pathptr).readCString();\r\n                    \r\n                    if (this.path.endsWith(\"libttboringssl.so\"))\r\n                    {\r\n                        log(\"android_dlopen_ext\", this.path);\r\n                        // 延迟加载\r\n                        // setTimeout(hook_SSL_CTX_set_custom_verify, 0)\r\n                        // setTimeout(() => hook_export_functions(\"libttboringssl.so\"), 0)\r\n                    }\r\n\r\n                    if (this.path.endsWith(\"libvcn.so\"))\r\n                    {\r\n                        log(\"android_dlopen_ext\", this.path);\r\n                        // 延迟加载\r\n                        setTimeout(hook_callback_of_libvcn, 10)\r\n                    }\r\n                    if (this.path.endsWith(\"libsscronet.so\"))\r\n                    {\r\n                        log(\"android_dlopen_ext\", this.path);\r\n                        // 延迟加载\r\n                        setTimeout(hook_callback_of_libsscronet, 10)\r\n                    }\r\n                }\r\n\r\n            },\r\n            onLeave(ret) {\r\n\r\n            }\r\n        });\r\n    } else {\r\n        log(\"android_dlopen_ext not found\");\r\n    }\r\n}\r\n\r\nfunction hook_callback_of_libsscronet()\r\n{\r\n    const libsscronet = Process.getModuleByName(\"libsscronet.so\");\r\n    if (libsscronet)\r\n    {\r\n        let callback_of_libsscronet = libsscronet.base.add(0x3c77d8);\r\n\r\n        Interceptor.attach(callback_of_libsscronet, {\r\n            onEnter: function (args) {\r\n                log(\"hook_callback_of_libsscronet args0\", args[0])\r\n            },\r\n            onLeave: function (ret) {\r\n                if (ret.toInt32() == 1)\r\n                {\r\n                    ret.replace(0x0);\r\n                }\r\n                \r\n                log(\"hook_callback_of_libsscronet ret\", ret.toInt32())\r\n            }\r\n        });\r\n    }\r\n    else\r\n    {\r\n        console.error(\"未找到 libsscronet.so 模块\");\r\n    }\r\n}\r\n\r\nfunction hook_callback_of_libvcn()\r\n{\r\n    const libvcn = Process.getModuleByName(\"libvcn.so\");\r\n    if (libvcn)\r\n    {\r\n        let callback_of_libvcn = libvcn.base.add(0x17334);\r\n\r\n        Interceptor.attach(callback_of_libvcn, {\r\n            onEnter: function (args) {\r\n                log(\"callback_of_libvcn args0\", args[0])\r\n            },\r\n            onLeave: function (ret) {\r\n                if (ret.toInt32() == 1)\r\n                {\r\n                    ret.replace(0x0);\r\n                }\r\n                log(\"callback_of_libvcn ret\", ret.toInt32())\r\n            }\r\n        });\r\n    }\r\n    else\r\n    {\r\n        console.error(\"未找到 libvcn.so 模块\");\r\n    }\r\n}\r\n\r\nfunction hook_export_functions(target_module) {\r\n\r\n    // 1. 枚举并 Hook 所有导出函数\r\n    Module.enumerateExports(target_module, {\r\n        onMatch: function (export_item) {\r\n            try {\r\n                if (export_item.type == \"function\") \r\n                {\r\n                    hook_export_function(export_item.name, export_item.address);\r\n                    // console.log(`[+] hook ${export_item.name} 成功`);\r\n                }\r\n            } catch (error) {\r\n                console.log(`[!] hook ${export_item.name} 失败: ${error}`);\r\n            }\r\n        },\r\n        onComplete: function () {\r\n            console.log(`[+] 已完成 ${target_module} 所有导出函数的 Hook`);\r\n        }\r\n    });\r\n\r\n    // 2. Hook 函数的具体实现\r\n    function hook_export_function(func_name, func_address) {\r\n        Interceptor.attach(func_address, {\r\n            onEnter: function (args) {\r\n                console.log(`[→] ${func_name} 被调用`);\r\n            },\r\n            onLeave: function (ret) {\r\n                console.log(`[←] ${func_name} 返回`);\r\n            }\r\n        });\r\n    }\r\n}\r\n\r\nfunction hook_SSL_CTX_set_custom_verify()\r\n{\r\n    let SSL_CTX_set_custom_verify = Module.getExportByName('libttboringssl.so', 'SSL_CTX_set_custom_verify');\r\n    Interceptor.attach(SSL_CTX_set_custom_verify, {\r\n        onEnter: function(args)\r\n        {\r\n            console.log(`SSL_CTX: ${args[0]}`)\r\n            console.log(`验证模式: ${args[1]}`)\r\n            console.log(`回调函数地址: ${args[2]}`)\r\n\r\n            let callback_module = Process.findModuleByAddress(args[2]);\r\n\r\n            console.log(\"module: \" + callback_module.name, \"offset: \" + ptr(args[2]).sub(callback_module.base))\r\n        }\r\n    })\r\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module) => {

eval("function log(label) {\r\n  const args = Array.from(arguments).slice(1);\r\n  const message = args.map(arg => \r\n    typeof arg === 'string' ? arg : JSON.stringify(arg)\r\n  ).join(' ');\r\n  \r\n  console.log(`[${label}] ${message}`);\r\n}\r\n\r\nfunction print_stack(name) {\r\n    Java.perform(function () {\r\n        var Exception = Java.use(\"java.lang.Exception\");\r\n        var ins = Exception.$new(\"Exception\");\r\n        var straces = ins.getStackTrace();\r\n        if (straces != undefined && straces != null) {\r\n            var strace = straces.toString();\r\n            var replaceStr = strace.replace(/,/g, \"\\n\");\r\n            console.log(\"=============================\" + name + \" Stack strat=======================\");\r\n            console.log(replaceStr);\r\n            console.log(\"=============================\" + name + \" Stack end=======================\\r\\n\");\r\n            Exception.$dispose();\r\n        }\r\n    });\r\n}\r\n\r\nfunction print_memory(address) {\r\n    console.log(hexdump(address, {\r\n        offset: 0,\r\n        length: 64,\r\n        header: true,\r\n        ansi: true,\r\n    }));\r\n}\r\n\r\nmodule.exports = { log, print_stack, print_memory };\n\n//# sourceURL=webpack:///./src/utils.js?");

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