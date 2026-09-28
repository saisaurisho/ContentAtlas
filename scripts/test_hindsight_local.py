import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

base_url = os.getenv("HINDSIGHT_LOCAL_URL", "http://localhost:8888")
client = Hindsight(
    base_url=base_url
)

bank_id = "content-strategy"

print(f"Connecting to Local Hindsight at {base_url} (Bank: {bank_id})...")

try:
    client.retain(
        bank_id,
        "Our AI Agents tutorials have historically received high engagement."
    )

    print("Memory retained successfully!")

    memories = client.recall(
        bank_id,
        "What type of content has performed well?"
    )

    print("\nRecalled memories:")
    print(memories)
except Exception as e:
    print(f"Local Hindsight instance not reachable: {e}")
    print("Ensure local hindsight server is running on http://localhost:8888")
