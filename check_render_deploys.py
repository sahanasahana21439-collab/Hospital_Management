import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
service_id = "srv-d713035m5p6s738r3f7g"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

def get_deploys(service_id):
    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

try:
    deploys = get_deploys(service_id)
    # Print the last 3 deploys with their status and FULL dates
    for d in deploys[:3]:
        dp = d['deploy']
        commit = dp.get('commit', {})
        print(f"Status: {dp['status'].upper()}, Commit: {commit.get('id', 'N/A')[:7]}, Date: {dp['createdAt']}")
except Exception as e:
    print(f"Error: {e}")
