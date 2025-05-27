import requests

# 定义请求的目标 URL
url = "http://172.24.113.encrypt228:5000/"

# 定义要发送的 JSON 数据
data = {
    "str1": r'{"sid":25,"seq":6,"extkey":"a593fc032a49390f","clienttime":"2025-03-10 11:37:20","jdkey":"--a593fc032a49390f-d1f47c6e3b891398498284fbe7ee6c5ffb05e","clientversion":"13.2.2","client":"android","sdkversion":"4.2.2","whwswswws":"BApXS214offBC9q4Q8kfutLLJaXe7YyImEmgIPiBo9xJ1Moly04EyslqL6A","build":"99724","installtionid":"385f184992244ca4ac399eb21c993c79","eventid":"locationUpdate","uid":"","eventparam":{"eventid":"locationUpdate","extkey":"a593fc032a49390f"}}',
    "str2": "4.2.2",
    "z5": True
}

# 发送 POST 请求
response = requests.post(url, json=data)

# 检查响应
if response.status_code == 200:
    print("result:", response.json())
else:
    print(f"fail code:{response.status_code}")
    print("message:", response.text)