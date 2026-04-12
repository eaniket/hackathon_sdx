from datetime import datetime

from pydantic import BaseModel


class PortfolioPositionResponse(BaseModel):
    investment_id: int
    creator_id: int
    creator_name: str
    creator_slug: str
    category: str
    amount: int
    created_at: datetime


class AllocationResponse(BaseModel):
    label: str
    value: int


class PortfolioResponse(BaseModel):
    total_invested: int
    creators_backed: int
    allocations: list[AllocationResponse]
    positions: list[PortfolioPositionResponse]


class InvestmentCreateRequest(BaseModel):
    creator_id: int
    amount: int


class BrandDealVerificationRequest(BaseModel):
    brand_name: str
    platform: str
    evidence_text: str
    campaign_type: str
