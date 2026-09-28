import os
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.agent.runner import run_agent, HINDSIGHT_BASE_URL
from hindsight_client import Hindsight
from dotenv import load_dotenv

load_dotenv()

if sys.stdout and hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def main():
    api_key = os.getenv("HINDSIGHT_API_KEY")
    if not api_key:
        print("ERROR: HINDSIGHT_API_KEY is not set in environment or .env file.")
        sys.exit(1)

    print("=" * 60)
    print("ContentAtlas — Strategy Agent CLI (Groq + Hindsight)")
    print("=" * 60)
    print("Type 'exit' or 'quit' to stop.\n")

    with Hindsight(
        base_url=HINDSIGHT_BASE_URL,
        api_key=api_key
    ) as hindsight_client:

        while True:
            try:
                query = input("\nYou: ").strip()
            except (KeyboardInterrupt, EOFError):
                print("\nExiting.")
                break

            if query.lower() in ["exit", "quit"]:
                break

            if not query:
                continue

            try:
                answer = run_agent(query, hindsight_client)
                print("\nAgent:")
                print(answer)
            except Exception as e:
                print(f"\n[Agent Error]: {e}")


if __name__ == "__main__":
    main()
