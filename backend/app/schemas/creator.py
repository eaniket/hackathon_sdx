from datetime import datetime

from pydantic import BaseModel


class CreatorCardResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    avatar_url: str
    primary_platforms: list[str]
    total_audience: int
    growth_30d: float
    engagement_rate: float
    detected_sponsored_posts: int
    unique_brand_partners: int


class PlatformMetricsResponse(BaseModel):
    platform: str
    username: str
    profile_url: str
    followers: int
    avg_views: int
    avg_likes: int
    avg_comments: int
    avg_shares: int
    posts_per_week: float
    growth_7d: float
    growth_30d: float
    growth_90d: float


class ContentItemResponse(BaseModel):
    id: int
    platform: str
    title: str
    caption: str
    content_url: str
    thumbnail_url: str
    published_at: datetime
    views: int
    likes: int
    comments: int
    shares: int


class BrandDealResponse(BaseModel):
    id: int
    brand_name: str
    platform: str
    deal_date: datetime
    source_type: str
    confidence: float
    evidence_text: str
    campaign_type: str
    source_url: str


class GrowthPointResponse(BaseModel):
    label: str
    value: float


class MonetizationItemResponse(BaseModel):
    channel: str
    status: str
    detail: str


class CreatorDetailResponse(BaseModel):
    id: int
    name: str
    slug: str
    bio: str
    category: str
    avatar_url: str
    location: str
    total_audience: int
    growth_30d: float
    engagement_rate: float
    detected_sponsored_posts: int
    unique_brand_partners: int
    platforms: list[PlatformMetricsResponse]
    content: list[ContentItemResponse]
    brand_deals: list[BrandDealResponse]
    audience_growth: list[GrowthPointResponse]
    engagement_trend: list[GrowthPointResponse]
    monetization_history: list[MonetizationItemResponse]


class CreatorQueryResponse(BaseModel):
    items: list[CreatorCardResponse]
