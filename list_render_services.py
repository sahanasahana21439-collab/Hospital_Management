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
    for s in services:
        svc = s['service']
        # Print ONLY the ID to ensure it's not truncated
        print(svc['id'])
except Exception as e:
    print(f"Error: {e}")
