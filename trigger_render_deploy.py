import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
service_id = "srv-d713035m5p6s738r3f7g"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def trigger_deploy(service_id):
    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    req = urllib.request.Request(url, method="POST", headers=headers, data=json.dumps({"clearCache": "clear"}).encode())
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

try:
    result = trigger_deploy(service_id)
    print("Deployment triggered successfully!")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
