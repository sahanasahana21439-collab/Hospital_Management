import urllib.request
import json

token = "rnd_cYL4iocN4Uz1nG399eXFMtYrPFhh"
service_id = "srv-d713035m5p6s738r3f7g"

# The user's pooled connection string
db_url = "postgresql://neondb_owner:npg_G9FuUW6fgcro@ep-fragrant-boat-ak1ivwjo-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def set_env_vars(service_id):
    url = f"https://api.render.com/v1/services/{service_id}/env-vars"
    
    # Render API expects a list of {key, value} objects
    payload = [
        {"key": "DATABASE_URL", "value": db_url},
        {"key": "JWT_SECRET", "value": "supersecretkey123"},
        {"key": "ALGORITHM", "value": "HS256"},
        {"key": "ACCESS_TOKEN_EXPIRE_MINUTES", "value": "60"}
    ]
    
    # Use PUT to set the entire list
    req = urllib.request.Request(url, method="PUT", headers=headers, data=json.dumps(payload).encode())
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error during PUT: {e}")
        # Try PATCH if PUT fails (some APIs use PATCH for partial updates but Render usually uses PUT for the whole list)
        return str(e)

try:
    result = set_env_vars(service_id)
    print("Environment variables update attempted.")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
