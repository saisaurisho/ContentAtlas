import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
client = Hindsight(
    base_url=base_url,
    api_key=os.environ["HINDSIGHT_API_KEY"]
)

bank_id = os.getenv("HINDSIGHT_BANK_ID", "content-strategy-main")

print(f"Connecting to Hindsight at {base_url} (Bank: {bank_id})...")

client.retain(
    bank_id=bank_id,
    content="Our AI Agents tutorials have historically received high engagement."
)

print("Memory retained!")

memories = client.recall(
    bank_id=bank_id,
    query="What type of content has performed well?"
)

print("\nRecalled memories:")
print(memories)
