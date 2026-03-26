import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
service_id = "srv-csltcqq3910c73e0scg0"
new_db_url = "postgresql://neondb_owner:npg_G9FuUW6fgcro@ep-fragrant-boat-ak1ivwjo-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def update_env_vars(service_id, db_url):
    # First get current env vars to avoid overwriting others if any
    url = f"https://api.render.com/v1/services/{service_id}/env-vars"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        env_vars = json.loads(response.read().decode())
    
    # Update or add DATABASE_URL
    found = False
    for ev in env_vars:
        if ev['envVar']['key'] == 'DATABASE_URL':
            ev['envVar']['value'] = db_url
            found = True
            break
    
    if not found:
        env_vars.append({"envVar": {"key": "DATABASE_URL", "value": db_url}})
    
    # Send update (Render API for env vars is a bit different, usually a list of objects)
    # The Put request expects the whole list
    payload = [ev['envVar'] for ev in env_vars]
    
    req_update = urllib.request.Request(url, method="PUT", headers=headers, data=json.dumps(payload).encode())
    with urllib.request.urlopen(req_update) as resp:
        return json.loads(resp.read().decode())

try:
    result = update_env_vars(service_id, new_db_url)
    print("Environment variables updated successfully!")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
