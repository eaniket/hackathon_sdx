import type {
  CreatorDetail,
  CreatorsResponse,
  Methodology,
  Portfolio,
} from "../types/api";

const API_BASE = "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function getCreators(params: URLSearchParams): Promise<CreatorsResponse> {
  return request<CreatorsResponse>(`/creators?${params.toString()}`);
}

export function getCreator(slug: string): Promise<CreatorDetail> {
  return request<CreatorDetail>(`/creators/${slug}`);
}

export function getPortfolio(): Promise<Portfolio> {
  return request<Portfolio>("/portfolio");
}

export function createInvestment(creatorId: number, amount: number): Promise<Portfolio> {
  return request<Portfolio>("/investments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ creator_id: creatorId, amount }),
  });
}

export function getMethodology(): Promise<Methodology> {
  return request<Methodology>("/methodology");
}

export function verifyBrandDeal(
  slug: string,
  payload: {
    brand_name: string;
    platform: string;
    evidence_text: string;
    campaign_type: string;
  },
): Promise<CreatorDetail["brand_deals"]> {
  return request<CreatorDetail["brand_deals"]>(`/creators/${slug}/brand-deals/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
