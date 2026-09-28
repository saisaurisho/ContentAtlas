import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.database import engine, Base
from scripts.seed_database import seed_database


def reset_and_seed():
    print("=" * 60)
    print("ContentAtlas — Demo Reset & Clean State Initialization")
    print("=" * 60)

    print(" [*] Dropping existing database tables...")
    Base.metadata.drop_all(bind=engine)
    print(" [OK] Dropped all tables cleanly.")

    print(" [*] Re-creating schema and reseeding database...")
    seed_database()
    print(" [OK] Clean demo state ready!")


if __name__ == "__main__":
    reset_and_seed()
