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

eval("const { log, print_stack, print_memory } = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\r\n\r\nJava.perform(() => {\r\n    hook_RegisterNatives()\r\n});\r\n\r\nfunction hook_RegisterNatives() {\r\n    let symbols = Module.enumerateSymbolsSync(\"libart.so\");\r\n    let addrRegisterNatives = null;\r\n    for (let i = 0; i < symbols.length; i++) {\r\n        let symbol = symbols[i];\r\n        if (symbol.name.indexOf(\"art\") >= 0 &&\r\n                symbol.name.indexOf(\"JNI\") >= 0 && \r\n                symbol.name.indexOf(\"RegisterNatives\") >= 0 && \r\n                symbol.name.indexOf(\"CheckJNI\") < 0) {\r\n            addrRegisterNatives = symbol.address;\r\n        }\r\n    }\r\n\r\n    if (addrRegisterNatives != null) {\r\n        Interceptor.attach(addrRegisterNatives, {\r\n            onEnter: function (args) {\r\n                log(\"RegisterNatives\", \"method_count: \", args[3]);\r\n                let env = args[0];\r\n                let java_class = args[1];\r\n                let class_name = Java.vm.tryGetEnv().getClassName(java_class);\r\n\r\n                let methods_ptr = ptr(args[2]);\r\n\r\n                let method_count = parseInt(args[3]);\r\n                for (let i = 0; i < method_count; i++) {\r\n                    let name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));\r\n                    let sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));\r\n                    let fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2));\r\n\r\n                    let name = Memory.readCString(name_ptr);\r\n                    let sig = Memory.readCString(sig_ptr);\r\n                    let find_module = Process.findModuleByAddress(fnPtr_ptr);\r\n                    log(\"RegisterNatives\", [\r\n                        \"java_class: \" + class_name,\r\n                        \"name: \" + name,\r\n                        \"sig: \" + sig, \r\n                        \"fnPtr: \" + fnPtr_ptr, \r\n                        \"module_name: \" + find_module.name, \r\n                        \"module_base: \" + find_module.base, \r\n                        \"offset: \" + ptr(fnPtr_ptr).sub(find_module.base),\r\n                    ]);\r\n                    console.log(\"\")\r\n                }\r\n                \r\n            }\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/main.js?");

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