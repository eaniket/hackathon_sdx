from datetime import datetime
import re

from sqlmodel import Session, select

from app.models.entities import BrandDeal, ContentItem

BRAND_PATTERNS: dict[str, str] = {
    "notion": "Notion",
    "nike": "Nike",
    "spotify": "Spotify",
    "shopify": "Shopify",
    "glossier": "Glossier",
    "red bull": "Red Bull",
    "adobe": "Adobe",
    "figma": "Figma",
}

SPONSOR_PATTERNS = [
    r"#ad\b",
    r"#sponsored\b",
    r"#partner\b",
    r"paid partnership",
    r"sponsored by",
    r"in partnership with",
    r"use code [A-Z0-9]+",
]


def extract_brand_deals(session: Session) -> None:
    existing_ids = {
        deal.content_item_id
        for deal in session.exec(select(BrandDeal)).all()
        if deal.source_type == "detected"
    }
    content_items = session.exec(select(ContentItem)).all()
    for item in content_items:
        if item.id is None or item.id in existing_ids:
            continue
        text = f"{item.title} {item.caption}".lower()
        if not any(re.search(pattern, text) for pattern in SPONSOR_PATTERNS):
            continue
        brand_name = next(
            (canonical for fragment, canonical in BRAND_PATTERNS.items() if fragment in text),
            "Unknown",
        )
        evidence_text = item.caption[:140]
        session.add(
            BrandDeal(
                creator_id=item.creator_id,
                content_item_id=item.id,
                brand_name=brand_name,
                platform=item.platform,
                deal_date=item.published_at,
                source_type="detected",
                confidence=0.82 if brand_name != "Unknown" else 0.64,
                evidence_text=evidence_text,
                campaign_type="sponsored_post",
                source_url=item.content_url,
            )
        )
    session.commit()


def recent_sponsorship_activity(brand_deals: list[BrandDeal]) -> str:
    if not brand_deals:
        return "No recent sponsorship activity"
    latest = max(brand_deals, key=lambda deal: deal.deal_date)
    return latest.deal_date.strftime("%b %d, %Y")
