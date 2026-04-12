from collections import Counter

from sqlmodel import Session, select

from app.models.entities import Creator, Investment
from app.schemas.portfolio import AllocationResponse, PortfolioPositionResponse, PortfolioResponse


def get_portfolio(session: Session, user_id: int) -> PortfolioResponse:
    investments = session.exec(
        select(Investment).where(Investment.user_id == user_id).order_by(Investment.created_at.desc())
    ).all()
    creators = {
        creator.id: creator
        for creator in session.exec(select(Creator)).all()
        if creator.id is not None
    }
    allocations_counter = Counter()
    positions: list[PortfolioPositionResponse] = []
    total_invested = 0
    creators_backed = set()

    for investment in investments:
        creator = creators.get(investment.creator_id)
        if creator is None or investment.id is None:
            continue
        total_invested += investment.amount
        creators_backed.add(investment.creator_id)
        allocations_counter[creator.category] += investment.amount
        positions.append(
            PortfolioPositionResponse(
                investment_id=investment.id,
                creator_id=creator.id or 0,
                creator_name=creator.name,
                creator_slug=creator.slug,
                category=creator.category,
                amount=investment.amount,
                created_at=investment.created_at,
            )
        )

    return PortfolioResponse(
        total_invested=total_invested,
        creators_backed=len(creators_backed),
        allocations=[
            AllocationResponse(label=label, value=value)
            for label, value in allocations_counter.items()
        ],
        positions=positions,
    )
