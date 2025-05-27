Java.perform(function() {
    let PMMReport = Java.use("com.xunmeng.pinduoduo.pmm.PMMReport");
    PMMReport["b"].overload('com.xunmeng.core.d.a.a.a.b', 'boolean').implementation = function (bVar, z) {
        console.log(`PMMReport.b is called: bVar=${bVar}`);
        console.log();
        this["b"](bVar, z);
    };
});

