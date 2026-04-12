from pydantic import BaseModel


class MethodologyMetricResponse(BaseModel):
    name: str
    definition: str
    formula: str


class MethodologySectionResponse(BaseModel):
    title: str
    items: list[str]


class MethodologyResponse(BaseModel):
    philosophy: str
    sections: list[MethodologySectionResponse]
    metrics: list[MethodologyMetricResponse]
