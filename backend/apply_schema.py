import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def apply_schema():
    if not DATABASE_URL:
        print("DATABASE_URL not found in environment")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()

        schema_path = os.path.join(os.path.dirname(__file__), "..", "db", "schema.sql")
        with open(schema_path, 'r') as file:
            schema_sql = file.read()

        cursor.execute(schema_sql)
        print("Successfully applied schema.sql to Neon Database.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error applying schema: {e}")

if __name__ == "__main__":
    apply_schema()
