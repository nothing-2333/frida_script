## 参数
无论静态注册还是动态注册, JNI 函数的第一个参数必须是 JNIEnv*(指向 JNI 环境的指针), 第二个参数是 jobject 或 jclass(取决于 Java 方法是实例方法还是静态方法), 之后才是 Java 方法中声明的参数
- ​​jobject​: 当 Java 的 native 方法是​​实例方法​​时, 此参数表示调用该方法的 Java 对象实例(相当于 Java 中的 this)。
- ​​jclass​: 当 Java 的 native 方法是​​静态方法​​时, 此参数表示声明该方法的 Java 类(相当于 Java 中的 类名.class)