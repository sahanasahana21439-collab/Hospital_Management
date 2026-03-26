import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
service_id = "srv-d713035m5p6s738r3f7g"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

def get_service_details(service_id):
    url = f"https://api.render.com/v1/services/{service_id}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def get_env_vars(service_id):
    url = f"https://api.render.com/v1/services/{service_id}/env-vars"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return str(e)

try:
    service = get_service_details(service_id)
    env_vars = get_env_vars(service_id)
    print("--- Service Details ---")
    print(json.dumps(service, indent=2))
    print("--- Env Vars ---")
    print(json.dumps(env_vars, indent=2))
except Exception as e:
    print(f"Error: {e}")
