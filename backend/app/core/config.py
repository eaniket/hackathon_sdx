from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = Path(
    os.environ.get(
        "DATABASE_PATH",
        "/tmp/creator_investing.db" if os.environ.get("VERCEL") else str(BASE_DIR / "creator_investing.db"),
    )
)
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DATABASE_PATH}")
