from flask import Flask, request, jsonify
import frida

app = Flask(__name__)

# 初始化 Frida
device = frida.get_usb_device()
pid = device.spawn(["com.jingdong.app.mall"])  # 强制启动应用
session = device.attach(pid)  # 附加到启动的进程

# 加载 Frida 脚本
with open("hook.js", "r", encoding="utf8") as f:
    script_code = f.read()
script = session.create_script(script_code)
script.load()

# 恢复目标进程
device.resume(pid)

# 定义 HTTP 接口
@app.route('/encrypt', methods=['POST'])
def encrypt():
    # 获取参数
    data = request.json
    context = data.get('context') 
    str1 = data.get('str1')
    str2 = data.get('str2')
    z5 = data.get('z5', False)
    # rpc 调用
    try:
        result = script.exports.invoke_encrypt(context, str1, str2, z5)
        return jsonify({"encrypted": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # 绑定到局域网 IP