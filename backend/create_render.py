import os
import json
import urllib.request
from urllib.error import HTTPError

RENDER_TOKEN = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
DATABASE_URL = "postgresql://neondb_owner:npg_G9FuUW6fgcro@ep-fragrant-boat-ak1ivwjo.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require"
REPO_URL = "https://github.com/sahanasahana21439-collab/Hospital_Management"

headers = {
    "Authorization": f"Bearer {RENDER_TOKEN}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def make_request(method, url, data=None):
    req = urllib.request.Request(url, method=method, headers=headers)
    if data:
        req.data = json.dumps(data).encode("utf-8")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        raise

def get_owner_id():
    owners = make_request("GET", "https://api.render.com/v1/owners")
    if not owners:
        raise Exception("No Render owners found for this token.")
    # Usually the first owner is the user/team
    return owners[0]['owner']['id']

def create_service(owner_id):
    payload = {
        "type": "web_service",
        "name": "hospital-management-api",
        "ownerId": owner_id,
        "repo": REPO_URL,
        "autoDeploy": "yes",
        "branch": "main",
        "rootDir": "backend",
        "serviceDetails": {
            "env": "python",
            "region": "singapore",
            "envSpecificDetails": {
                "buildCommand": "pip install -r requirements.txt",
                "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
            },
            "plan": "free",
            "envVars": [
                {
                    "key": "DATABASE_URL",
                    "value": DATABASE_URL
                }
            ]
        }
    }
    print("Creating Render service...")
    return make_request("POST", "https://api.render.com/v1/services", payload)

def main():
    try:
        owner_id = get_owner_id()
        print(f"Found Owner ID: {owner_id}")
        service = create_service(owner_id)
        print("Service created successfully!")
        print(json.dumps(service, indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
