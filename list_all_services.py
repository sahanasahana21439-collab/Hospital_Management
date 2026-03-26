import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

def get_services():
    url = "https://api.render.com/v1/services"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

try:
    services = get_services()
    print(f"Total services found: {len(services)}")
    for s in services:
        svc = s['service']
        print(f"[{svc['id']}] {svc['name']} -> {svc['serviceDetails']['url']}")
except Exception as e:
    print(f"Error: {e}")
