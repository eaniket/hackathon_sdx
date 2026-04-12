import json
import sys
from pathlib import Path

from sqlmodel import select

from app.db.seed import initialize_database
from app.db.session import get_session
from app.models.entities import ContentItem, Creator


def run(path_value: str) -> None:
    path = Path(path_value)
    payload = json.loads(path.read_text())
    initialize_database()
    with get_session() as session:
        for item in payload:
            slug = item["creator_slug"]
            creator = session.exec(select(Creator).where(Creator.slug == slug)).first()
            if creator is None or creator.id is None:
                continue
            session.add(
                ContentItem(
                    creator_id=creator.id,
                    platform=item["platform"],
                    external_id=item["external_id"],
                    title=item["title"],
                    caption=item["caption"],
                    content_url=item["content_url"],
                    thumbnail_url=item["thumbnail_url"],
                    published_at=item["published_at"],
                    views=item["views"],
                    likes=item["likes"],
                    comments=item["comments"],
                    shares=item["shares"],
                )
            )
        session.commit()


if __name__ == "__main__":
    run(sys.argv[1])
