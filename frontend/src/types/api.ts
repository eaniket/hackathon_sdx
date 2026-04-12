export type CreatorCard = {
  id: number;
  name: string;
  slug: string;
  category: string;
  avatar_url: string;
  primary_platforms: string[];
  total_audience: number;
  growth_30d: number;
  engagement_rate: number;
  detected_sponsored_posts: number;
  unique_brand_partners: number;
};

export type GrowthPoint = {
  label: string;
  value: number;
};

export type PlatformMetrics = {
  platform: string;
  username: string;
  profile_url: string;
  followers: number;
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  posts_per_week: number;
  growth_7d: number;
  growth_30d: number;
  growth_90d: number;
};

export type ContentItem = {
  id: number;
  platform: string;
  title: string;
  caption: string;
  content_url: string;
  thumbnail_url: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export type BrandDeal = {
  id: number;
  brand_name: string;
  platform: string;
  deal_date: string;
  source_type: string;
  confidence: number;
  evidence_text: string;
  campaign_type: string;
  source_url: string;
};

export type CreatorDetail = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  category: string;
  avatar_url: string;
  location: string;
  total_audience: number;
  growth_30d: number;
  engagement_rate: number;
  detected_sponsored_posts: number;
  unique_brand_partners: number;
  platforms: PlatformMetrics[];
  content: ContentItem[];
  brand_deals: BrandDeal[];
  audience_growth: GrowthPoint[];
  engagement_trend: GrowthPoint[];
  monetization_history: {
    channel: string;
    status: string;
    detail: string;
  }[];
};

export type CreatorsResponse = {
  items: CreatorCard[];
};

export type Allocation = {
  label: string;
  value: number;
};

export type PortfolioPosition = {
  investment_id: number;
  creator_id: number;
  creator_name: string;
  creator_slug: string;
  category: string;
  amount: number;
  created_at: string;
};

export type Portfolio = {
  total_invested: number;
  creators_backed: number;
  allocations: Allocation[];
  positions: PortfolioPosition[];
};

export type MethodologyMetric = {
  name: string;
  definition: string;
  formula: string;
};

export type MethodologySection = {
  title: string;
  items: string[];
};

export type Methodology = {
  philosophy: string;
  sections: MethodologySection[];
  metrics: MethodologyMetric[];
};
