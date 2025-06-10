# SSL_CTX_set_custom_verify
SSL_CTX_set_custom_verify 是 OpenSSL/BoringSSL 库中用于​​自定义 SSL/TLS 证书验证逻辑​​的核心函数，主要应用于深度定制证书校验流程或绕过特定安全机制（如 SSL Pinning）

```c
void SSL_CTX_set_custom_verify(SSL_CTX *ctx, int mode, SSL_verify_cb callback);
```
- ​​SSL_CTX *ctx​​: SSL 上下文对象，承载全局配置（如证书、私钥、协议版本等）。
- int mode: 验证模式标志位，控制校验行为: SSL_VERIFY_NONE-完全跳过证书验证; SSL_VERIFY_PEER-强制验证对端证书（默认启用）; SSL_VERIFY_FAIL_IF_NO_PEER_CERT-对端未提供证书时直接失败
- ​​SSL_verify_cb callback​​: 自定义验证回调函数，原型为 `int callback(int preverify_ok, X509_STORE_CTX *x509_ctx);` 
