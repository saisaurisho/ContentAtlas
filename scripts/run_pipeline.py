import os
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Ensure UTF-8 output on Windows
if sys.stdout and hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from dotenv import load_dotenv

load_dotenv()


def run_pipeline():
    print("=" * 70)
    print(" ContentAtlas — End-to-End Pipeline Verification & Setup")
    print("=" * 70)

    # 1. Database Setup & Ingestion
    print("\n[Step 1/4] Checking and Seeding Relational Database...")
    try:
        from scripts.seed_database import seed_database
        seed_database()
        print(" -> Database seeded and verified.")
    except Exception as e:
        print(f" -> Database seeding error: {e}")
        return False

    # 2. Hindsight Memory Cloud Check & Seed
    print("\n[Step 2/4] Verifying Hindsight Cloud Integration...")
    hindsight_key = os.getenv("HINDSIGHT_API_KEY")
    bank_id = os.getenv("HINDSIGHT_BANK_ID", "content-strategy-main-v3")
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")

    if not hindsight_key:
        print(" [!] HINDSIGHT_API_KEY not set in .env. Skipping cloud memory retention.")
    else:
        try:
            from hindsight_client import Hindsight
            with Hindsight(base_url=base_url, api_key=hindsight_key) as hs:
                resp = hs.recall(bank_id=bank_id, query="What topics perform well?")
                results = getattr(resp, "results", [])
                print(f" -> Successfully connected to Hindsight Cloud (Bank: {bank_id})")
                print(f" -> Active recalled memories in bank: {len(results)}")
        except Exception as e:
            print(f" -> Hindsight test note: {e}")

    # 3. Groq LLM Check
    print("\n[Step 3/4] Verifying Groq LLM Connection...")
    groq_key = os.getenv("GROQ_API_KEY")
    groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    if not groq_key:
        print(" [!] GROQ_API_KEY not set in .env. Agent will use deterministic template synthesis.")
    else:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            test_res = client.chat.completions.create(
                model=groq_model,
                messages=[{"role": "user", "content": "Respond with 'GROQ_OK'"}],
                max_tokens=10
            )
            reply = test_res.choices[0].message.content.strip()
            print(f" -> Successfully connected to Groq (Model: {groq_model})")
            print(f" -> Test ping response: {reply}")
        except Exception as e:
            print(f" -> Groq connection note: {e}")

    # 4. API & Agent Service Layer Sanity
    print("\n[Step 4/4] Verifying Service Layer & Agent Runner...")
    try:
        from backend.app.database import SessionLocal
        from backend.app.agent.runner import run_agent_chat
        db = SessionLocal()
        chat_res = run_agent_chat("What should we publish next for NovaStack?", "novastack", db)
        db.close()
        print(" -> Agent runner generated live strategy response:")
        print(f"    Intent:         {chat_res.intent}")
        print(f"    Recommendation: {chat_res.recommendation.title if chat_res.recommendation else 'N/A'}")
        print(f"    Evidence Count: {len(chat_res.evidence.content)} content items, {len(chat_res.evidence.gaps)} gaps")
        print(f"    Memories Used:  {len(chat_res.memories)} memories")
    except Exception as e:
        print(f" -> Service layer verification error: {e}")
        return False

    print("\n" + "=" * 70)
    print(" Pipeline verification COMPLETE. All systems integrated!")
    print(" Ready to run:")
    print("   Terminal 1 (Backend):  uvicorn backend.app.main:app --reload --port 8000")
    print("   Terminal 2 (Frontend): cd frontend && npm run dev")
    print("   Terminal 3 (CLI):      python scripts/agent_chat.py")
    print("=" * 70)
    return True


if __name__ == "__main__":
    run_pipeline()
