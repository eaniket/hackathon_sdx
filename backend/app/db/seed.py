from datetime import datetime, timedelta

from sqlmodel import delete, select

from app.db.session import create_db_and_tables, engine, get_session
from app.models.entities import BrandDeal, ContentItem, Creator, CreatorPlatform, Investment, User
from app.services.brand_deals import extract_brand_deals


def _days_ago(days: int) -> datetime:
    return datetime.utcnow() - timedelta(days=days)


CREATORS = [
    {
        "name": "Maya Vale",
        "slug": "maya-vale",
        "bio": "Fashion creator translating downtown style into sell-through moments across video and editorial formats.",
        "category": "fashion",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        "location": "New York, NY",
    },
    {
        "name": "Arjun Mix",
        "slug": "arjun-mix",
        "bio": "Music creator blending DJ edits, release breakdowns, and fan community drops.",
        "category": "music",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "location": "Los Angeles, CA",
    },
    {
        "name": "Nina Frame",
        "slug": "nina-frame",
        "bio": "Creator focused on creator tools, workflows, and internet-native business systems.",
        "category": "education",
        "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        "location": "Austin, TX",
    },
    {
        "name": "Leo Rift",
        "slug": "leo-rift",
        "bio": "Gaming host building a loyal live and short-form audience around competitive play and culture.",
        "category": "gaming",
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        "location": "Seattle, WA",
    },
    {
        "name": "Talia North",
        "slug": "talia-north",
        "bio": "Podcast and newsletter creator covering internet brands, culture, and consumer finance.",
        "category": "podcasts",
        "avatar_url": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
        "location": "Chicago, IL",
    },
    {
        "name": "Owen Pace",
        "slug": "owen-pace",
        "bio": "Fitness creator pairing training content with durable subscription and product demand.",
        "category": "fitness",
        "avatar_url": "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
        "location": "Miami, FL",
    },
]

PLATFORMS = {
    "maya-vale": [
        ("TikTok", "mayavale", 128400, 96000, 9800, 420, 510, 5.2, 4.8, 14.2, 38.5),
        ("Instagram", "maya.vale", 42100, 18200, 3400, 128, 74, 4.0, 2.1, 6.4, 15.8),
        ("Newsletter", "Studio Dispatch", 3480, 2140, 0, 0, 0, 1.0, 1.4, 5.2, 12.1),
    ],
    "arjun-mix": [
        ("YouTube", "arjunmix", 88400, 142000, 11200, 360, 660, 2.6, 3.2, 11.6, 28.0),
        ("TikTok", "arjunmixcuts", 67300, 78400, 6100, 240, 410, 4.8, 5.4, 18.1, 40.2),
        ("Spotify", "Arjun Mix", 219000, 0, 0, 0, 0, 0.4, 2.3, 7.3, 16.4),
    ],
    "nina-frame": [
        ("YouTube", "ninaframe", 54400, 61800, 5400, 310, 180, 1.8, 1.7, 7.9, 21.0),
        ("X", "ninaframe", 24800, 18200, 760, 94, 180, 7.0, 2.8, 9.6, 20.1),
        ("Newsletter", "Signal Stack", 12100, 8200, 0, 0, 0, 2.0, 2.4, 8.7, 23.6),
    ],
    "leo-rift": [
        ("YouTube", "leorift", 138000, 175000, 12600, 840, 930, 3.2, 2.2, 8.1, 19.4),
        ("TikTok", "leoriftplays", 94000, 132000, 9200, 370, 610, 6.1, 4.6, 13.7, 31.8),
        ("Twitch", "leoriftlive", 28400, 0, 0, 0, 0, 5.0, 1.2, 4.8, 10.0),
    ],
    "talia-north": [
        ("Podcast", "Talia North", 36200, 19800, 0, 0, 0, 1.0, 1.1, 4.1, 12.9),
        ("Newsletter", "North Star Brief", 18400, 9400, 0, 0, 0, 2.0, 2.7, 8.3, 17.6),
        ("Instagram", "talianorth", 22100, 9400, 1200, 80, 54, 3.1, 1.3, 5.6, 14.2),
    ],
    "owen-pace": [
        ("Instagram", "owenpace", 106000, 54400, 6800, 180, 120, 5.8, 1.9, 6.8, 16.5),
        ("YouTube", "owenpace", 43200, 48600, 4100, 240, 92, 2.0, 1.4, 5.1, 12.0),
        ("TikTok", "owenpacefit", 77400, 102000, 7400, 220, 310, 6.4, 3.2, 10.6, 24.3),
    ],
}

CONTENT = {
    "maya-vale": [
        ("TikTok", "fall outerwear rotation", "paid partnership with Glossier on the look, #ad but still very me", 6, 122000, 12500, 480, 612),
        ("Instagram", "studio rail preview", "three looks from the capsule and one Notion board that kept the launch sane", 12, 22100, 3820, 141, 94),
        ("Newsletter", "issue 48", "launch notes, merch pacing, and what sold through first", 3, 2900, 0, 0, 0),
    ],
    "arjun-mix": [
        ("YouTube", "how i built this set", "sponsored by Spotify for Artists and the tools are actually useful", 7, 165000, 13200, 420, 720),
        ("TikTok", "festival edit", "use code ARJUN10 with Red Bull samples for the pack", 4, 93400, 6800, 260, 430),
        ("YouTube", "release reaction", "fan cut breakdown from tonight's drop", 15, 118000, 10400, 310, 560),
    ],
    "nina-frame": [
        ("YouTube", "my creator CRM", "sponsored by Notion, full template linked below", 5, 73400, 6100, 360, 220),
        ("X", "ops stack update", "moved all campaign tracking into Figma and Notion this week", 9, 21400, 920, 108, 204),
        ("Newsletter", "signal stack #62", "pricing creator work, sponsor ops, and distribution math", 2, 8800, 0, 0, 0),
    ],
    "leo-rift": [
        ("YouTube", "ranked grind week 4", "new loadout notes with zero sponsor script this time", 3, 182000, 13600, 910, 1040),
        ("TikTok", "clutch montage", "paid partnership with Nike gaming collection #partner", 8, 148000, 9800, 420, 680),
        ("YouTube", "stream recap", "community challenge recap and what we're testing next", 10, 142000, 11800, 760, 830),
    ],
    "talia-north": [
        ("Podcast", "consumer internet feels fragile", "this episode is sponsored by Shopify and that matters for founders", 5, 24400, 0, 0, 0),
        ("Newsletter", "north star 91", "brand deal math and why repeat partners matter", 3, 10200, 0, 0, 0),
        ("Instagram", "studio notes", "quick clip from this week's recording session", 11, 9800, 1200, 78, 48),
    ],
    "owen-pace": [
        ("Instagram", "recovery day", "partnered with Nike Training on this mobility block", 4, 44200, 7200, 184, 133),
        ("TikTok", "gym flow", "three movements i keep in every hypertrophy cycle", 6, 114000, 7600, 240, 354),
        ("YouTube", "meal prep for lean mass", "sponsored by Shopify for the program storefront", 9, 59200, 4380, 250, 104),
    ],
}

INITIAL_INVESTMENTS = [
    {"creator_slug": "maya-vale", "amount": 25},
    {"creator_slug": "nina-frame", "amount": 50},
]


def initialize_database() -> None:
    create_db_and_tables()
    with get_session() as session:
        if session.exec(select(Creator)).first() is not None:
            extract_brand_deals(session)
            return

        session.exec(delete(Investment))
        session.exec(delete(BrandDeal))
        session.exec(delete(ContentItem))
        session.exec(delete(CreatorPlatform))
        session.exec(delete(Creator))
        session.exec(delete(User))
        session.commit()

        user = User(email="demo@creator.market", display_name="Demo Investor")
        session.add(user)
        session.commit()
        session.refresh(user)

        creator_id_map: dict[str, int] = {}
        for creator_data in CREATORS:
            creator = Creator(**creator_data)
            session.add(creator)
            session.commit()
            session.refresh(creator)
            creator_id_map[creator.slug] = creator.id or 0

        for slug, platform_rows in PLATFORMS.items():
            creator_id = creator_id_map[slug]
            for row in platform_rows:
                (
                    platform,
                    username,
                    followers,
                    avg_views,
                    avg_likes,
                    avg_comments,
                    avg_shares,
                    posts_per_week,
                    growth_7d,
                    growth_30d,
                    growth_90d,
                ) = row
                session.add(
                    CreatorPlatform(
                        creator_id=creator_id,
                        platform=platform,
                        username=username,
                        profile_url=f"https://example.com/{username}",
                        followers=followers,
                        avg_views=avg_views,
                        avg_likes=avg_likes,
                        avg_comments=avg_comments,
                        avg_shares=avg_shares,
                        posts_per_week=posts_per_week,
                        growth_7d=growth_7d,
                        growth_30d=growth_30d,
                        growth_90d=growth_90d,
                    )
                )
            session.commit()

        for slug, content_rows in CONTENT.items():
            creator_id = creator_id_map[slug]
            for index, row in enumerate(content_rows, start=1):
                platform, title, caption, days_ago, views, likes, comments, shares = row
                session.add(
                    ContentItem(
                        creator_id=creator_id,
                        platform=platform,
                        external_id=f"{slug}-{platform.lower()}-{index}",
                        title=title,
                        caption=caption,
                        content_url=f"https://example.com/{slug}/{index}",
                        thumbnail_url=f"https://picsum.photos/seed/{slug}-{index}/800/600",
                        published_at=_days_ago(days_ago),
                        views=views,
                        likes=likes,
                        comments=comments,
                        shares=shares,
                    )
                )
            session.commit()

        extract_brand_deals(session)

        verified_brand_deals = [
            BrandDeal(
                creator_id=creator_id_map["maya-vale"],
                content_item_id=1,
                brand_name="Glossier",
                platform="TikTok",
                deal_date=_days_ago(6),
                source_type="verified",
                confidence=0.98,
                evidence_text="paid partnership with Glossier on the look",
                campaign_type="brand_partnership",
                source_url="https://example.com/maya-vale/1",
            ),
            BrandDeal(
                creator_id=creator_id_map["nina-frame"],
                content_item_id=7,
                brand_name="Notion",
                platform="YouTube",
                deal_date=_days_ago(5),
                source_type="verified",
                confidence=0.97,
                evidence_text="sponsored by Notion, full template linked below",
                campaign_type="software_sponsorship",
                source_url="https://example.com/nina-frame/1",
            ),
        ]
        session.add_all(verified_brand_deals)
        session.commit()

        for item in INITIAL_INVESTMENTS:
            session.add(
                Investment(
                    user_id=user.id or 1,
                    creator_id=creator_id_map[item["creator_slug"]],
                    amount=item["amount"],
                )
            )
        session.commit()
