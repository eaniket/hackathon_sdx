# Creator Investing Platform Implementation Plan

## Objective

Build a creator investing platform inspired by the product philosophy and UI clarity of Forum, adapted for creators instead of topic-based engagement-backed assets.

The MVP should let users:

- discover creators through transparent engagement and monetization metrics
- inspect creator profiles across multiple platforms
- view detected and verified brand deal history
- simulate investing small amounts into creators
- track positions in a portfolio dashboard

The product should feel close to Forum in these ways:

- clean, data-first UI
- transparent methodology
- market-style navigation and layout
- emphasis on interpretable metrics over black-box scoring
- fast scanning and comparison across profiles

## Product Principles

- No black-box `investability score` or `risk score` in the MVP.
- Prefer raw metrics, trends, and methodology explanations.
- Prioritize active engagement over vanity metrics.
- Treat brand deals and monetization history as first-class investor signals.
- Keep investing simulated for the hackathon MVP.
- Mirror Forum's clean and serious interface style without copying branding.

## MVP Scope

### Core flows

1. User lands on the app and browses creators.
2. User filters or searches for a creator.
3. User opens a creator profile.
4. User reviews growth, engagement, and brand deal history.
5. User simulates investing a small amount.
6. User sees the position appear in their portfolio.

### MVP pages

1. Landing page
2. Discovery page
3. Creator profile page
4. Portfolio page
5. Methodology page

### MVP features

- creator discovery feed
- creator detail pages
- cross-platform metrics
- growth and engagement charts
- sponsored content / brand deal detection
- simulated investing flow
- portfolio tracking
- methodology and source transparency

## Tech Stack

### Frontend

- React.js
- shadcn/ui
- Tailwind CSS
- React Router or Next.js-style routing if the React setup supports it
- Recharts for charts
- TanStack Query for API state management

### Backend

- FastAPI
- Pydantic
- SQLAlchemy or SQLModel
- PostgreSQL preferred, SQLite acceptable for hackathon speed
- Alembic for migrations if time permits

### AI / enrichment

- LLM for brand-deal extraction from captions, descriptions, and transcripts
- Rule-based prefilter before calling the LLM

## Suggested Repo Structure

```text
hackathon/
  backend/
    app/
      api/
      core/
      db/
      models/
      schemas/
      services/
      tasks/
      main.py
    requirements.txt
  frontend/
    src/
      components/
      components/ui/
      pages/
      routes/
      lib/
      hooks/
      types/
      App.tsx
      main.tsx
    package.json
  plan.md
```

## UI Direction

The UI should feel close to Forum in spirit:

- minimal, dark or neutral financial dashboard aesthetic
- strong tables, cards, and compact metric rows
- clear hierarchy with restrained color usage
- charts that support quick comparison
- subtle hover states and polished spacing
- avoid creator-economy cliches like loud gradients or playful social-app visuals

### Design rules

- Use one restrained accent color.
- Keep backgrounds layered but subtle.
- Use tabular numerals for metrics.
- Prefer dense, scannable cards over oversized marketing sections.
- Use tooltips for formulas and methodology.
- Keep labels plain and investor-facing.

## Information Architecture

### 1. Landing page

Purpose:
Introduce the product and route users into discovery.

Sections:

- headline
- subheadline
- CTA to explore creators
- sample creator cards
- short methodology teaser

Suggested messaging:

- "Back emerging creators with transparent engagement and monetization data."
- "Creator market data for investors."

### 2. Discovery page

Purpose:
Let users browse creators like investable profiles.

Components:

- top navigation
- search bar
- category filters
- platform filters
- sorting controls
- creator card grid or table

Creator card fields:

- avatar
- creator name
- category
- primary platforms
- total audience
- 30d growth
- engagement rate
- detected sponsored posts
- unique brand partners

### 3. Creator profile page

Purpose:
Serve as the core diligence page.

Sections:

- creator header
- platform overview cards
- audience and growth chart
- engagement metrics table
- recent content list
- brand deal history
- monetization history
- invest action panel
- methodology panel

### 4. Portfolio page

Purpose:
Show simulated positions and aggregate allocations.

Sections:

- total invested
- creators backed
- allocations by category
- recent activity
- positions table

### 5. Methodology page

Purpose:
Build trust and align with Forum-like transparency.

Sections:

- what we measure
- sources by platform
- update frequency
- metric definitions
- sponsored content detection methodology
- detected vs verified brand deal explanation
- limitations

## Data Model

### creators

- `id`
- `name`
- `slug`
- `bio`
- `category`
- `avatar_url`
- `location`
- `created_at`
- `updated_at`

### creator_platforms

- `id`
- `creator_id`
- `platform`
- `username`
- `profile_url`
- `followers`
- `avg_views`
- `avg_likes`
- `avg_comments`
- `avg_shares`
- `posts_per_week`
- `growth_7d`
- `growth_30d`
- `growth_90d`
- `last_updated_at`

### content_items

- `id`
- `creator_id`
- `platform`
- `external_id`
- `title`
- `caption`
- `content_url`
- `thumbnail_url`
- `published_at`
- `views`
- `likes`
- `comments`
- `shares`

### brand_deals

- `id`
- `creator_id`
- `content_item_id`
- `brand_name`
- `platform`
- `deal_date`
- `source_type`
- `confidence`
- `evidence_text`
- `campaign_type`
- `source_url`
- `created_at`

`source_type` values:

- `detected`
- `verified`
- `manual`

### investments

- `id`
- `user_id`
- `creator_id`
- `amount`
- `created_at`

### users

For MVP, authentication can be skipped or replaced with a single seeded demo user.

- `id`
- `email`
- `display_name`

## Metric Definitions

Keep all metrics interpretable.

### Discovery metrics

- `total audience`
  Sum of followers/subscribers across supported platforms

- `30d growth`
  Percentage change in audience over the last 30 days

- `engagement rate`
  `(avg_likes + avg_comments + avg_shares) / followers`
  Calculated per platform, with a simple aggregate shown on cards

- `detected sponsored posts`
  Count of content items flagged as likely sponsored in the selected time window

- `unique brand partners`
  Count of distinct brand names across detected and verified brand deals

### Profile metrics

- audience by platform
- 7d / 30d / 90d growth
- avg views per post
- avg likes / comments / shares
- posts per week
- top recent content
- last sponsorship date
- number of detected sponsored posts
- number of verified brand deals

## Brand Deal Detection Pipeline

### Goal

Identify likely sponsorships from creator content and convert them into structured, auditable brand-deal records.

### Input sources

- YouTube descriptions
- YouTube transcripts if available
- Instagram captions
- TikTok captions
- X posts
- newsletter text if available

### Detection strategy

1. Collect recent content for each creator.
2. Run rule-based heuristics to identify likely candidates.
3. Send candidates to the LLM for structured extraction.
4. Save structured outputs into `brand_deals`.
5. Surface evidence in the UI.

### Heuristic triggers

- `#ad`
- `#sponsored`
- `#partner`
- `paid partnership`
- `sponsored by`
- `in partnership with`
- promo code patterns
- known affiliate link domains
- tagged brand handles

### LLM extraction output

Return:

- `is_brand_deal`
- `brand_name`
- `confidence`
- `campaign_type`
- `evidence_text`
- `reasoning`

### UI display rules

Do not claim exact total lifetime sponsorships.

Prefer labels like:

- `Detected sponsored posts`
- `Verified brand deals`
- `Brands worked with`
- `Recent sponsorship activity`

## API Plan

### Public read endpoints

- `GET /api/creators`
  Returns creator cards with summary metrics

- `GET /api/creators/{slug}`
  Returns creator profile details

- `GET /api/creators/{slug}/content`
  Returns recent content items

- `GET /api/creators/{slug}/brand-deals`
  Returns detected and verified brand deal history

- `GET /api/portfolio`
  Returns portfolio summary and positions for demo user

- `GET /api/methodology`
  Returns metric definitions and source notes

### Mutating endpoints

- `POST /api/investments`
  Body:
  - `creator_id`
  - `amount`

  Creates a simulated investment

- `POST /api/brand-deals/detect`
  Runs or queues brand-deal detection for seeded content

## Frontend Component Plan

### Shared components

- `AppShell`
- `TopNav`
- `MetricCard`
- `SectionHeader`
- `DataTable`
- `GrowthChart`
- `PlatformBadge`
- `InvestDialog`
- `MethodologyTooltip`
- `BrandDealList`
- `CreatorCard`

### Discovery page components

- `DiscoveryFilters`
- `CreatorCardGrid`
- `SortControl`

### Creator page components

- `CreatorHeader`
- `PlatformOverview`
- `EngagementTable`
- `RecentContentTable`
- `BrandDealTimeline`
- `InvestSidebar`

### Portfolio components

- `PortfolioSummary`
- `PositionTable`
- `AllocationChart`

## Backend Service Plan

### Services

- `creator_service.py`
  Handles creator listing and detail aggregation

- `portfolio_service.py`
  Handles simulated investments and portfolio summary

- `brand_deal_service.py`
  Handles sponsorship detection and structured storage

- `content_service.py`
  Handles ingestion and normalization of creator content

### Tasks

- seed creators
- seed content
- run sponsorship detection over content
- recompute summary metrics

## Seeding Strategy

Use a seeded dataset for the MVP.

### Seed 8-12 creators

Each creator should have:

- 2-3 platforms
- growth metrics
- recent content items
- at least 1-3 detected brand deals for some creators
- category and bio

Suggested categories:

- music
- fashion
- gaming
- podcasts
- education
- fitness

### Why seeding is acceptable

The hackathon goal is to prove the product and methodology, not to solve every data integration challenge in one weekend.

## Implementation Phases

### Phase 1: Project setup

Goal:
Initialize frontend and backend skeleton.

Tasks:

- scaffold React app
- install shadcn/ui
- scaffold FastAPI app
- set up database
- define initial schema
- create seed scripts

### Phase 2: Core frontend shell

Goal:
Build navigation and page skeletons.

Tasks:

- app shell
- top nav
- discovery page layout
- creator profile layout
- portfolio page layout
- methodology page layout

### Phase 3: Seeded backend and APIs

Goal:
Serve creators, content, brand deals, and portfolio data.

Tasks:

- create tables
- add seed data
- implement creator list endpoint
- implement creator detail endpoint
- implement portfolio endpoints

### Phase 4: Discovery and profile UI

Goal:
Render real seeded data from APIs.

Tasks:

- creator card grid
- filters and sorting
- profile header
- platform metrics cards
- growth chart
- engagement metrics table
- content list

### Phase 5: Brand deal detection

Goal:
Make monetization history a standout feature.

Tasks:

- add heuristic sponsor detection
- add LLM classification endpoint or service
- store parsed deals
- render brand deal history and evidence

### Phase 6: Simulated investing

Goal:
Complete the investor loop.

Tasks:

- invest dialog
- create investment endpoint
- update portfolio page
- show recent activity

### Phase 7: Methodology and polish

Goal:
Make the product credible and presentation-ready.

Tasks:

- methodology page content
- tooltips for formulas
- table polish
- empty states
- loading states
- responsive behavior

## Timeline Recommendation

### Day 1

- project setup
- schema and seeds
- backend endpoints for creators
- discovery page
- creator profile structure

### Day 2

- brand deal pipeline
- invest flow
- portfolio page
- methodology page
- styling and polish

### Final hours

- seed stronger demo data
- test end-to-end flows
- tighten copy
- prepare judge demo script

## Demo Script

1. Open the discovery page and scan creator opportunities.
2. Filter by a category like fashion or music.
3. Open a creator profile with visible growth and sponsor activity.
4. Show transparent metrics across platforms.
5. Show detected and verified brand deals with evidence.
6. Simulate a `$25` investment.
7. Open portfolio and show the new position.
8. End on the methodology page to reinforce credibility.

## Success Criteria

The MVP is successful if:

- users can compare creators quickly
- brand deal history is visible and believable
- the investing loop works end to end
- the UI feels serious and investor-grade
- the methodology is transparent enough to build trust

## Post-MVP Extensions

- live integrations for creator platforms
- creator-claimed and verified profiles
- deeper monetization history
- real notifications and watchlists
- creator comparisons
- real money rails and legal structure
- investor profiles and multi-user auth

## Immediate Build Order

1. Set up `backend/` and `frontend/`
2. Define schema and seed creators
3. Build `GET /api/creators` and `GET /api/creators/{slug}`
4. Build discovery page
5. Build creator profile page
6. Add brand-deal UI with seeded records
7. Add invest flow and portfolio page
8. Add methodology page
9. Polish visuals to feel close to Forum's interface style

## Detailed Todo List

This section is the working checklist for the full MVP. It is intentionally detailed so implementation can be done phase by phase without having to re-scope work mid-build.

### Phase 0: Product and UX alignment `Completed`

- [x] Confirm the MVP story: discover creators, inspect transparent metrics, simulate investing, track portfolio.
- [x] Finalize the positioning statement so the product stays aligned with Forum's philosophy but remains creator-specific.
- [x] Confirm that the MVP will avoid black-box scores and use raw metrics plus methodology instead.
- [x] Decide the initial creator categories to support in the seed dataset.
- [x] Decide the first supported content sources for the MVP.
  Recommended: YouTube first, optional Instagram or TikTok second.
- [x] Decide whether the app will use a dark neutral theme or a light neutral theme inspired by Forum.
- [x] Define the exact navigation tabs and page names.
- [x] Write the short product copy for landing, discovery, profile, portfolio, and methodology pages.
- [x] Define the user-facing labels for all metrics so naming stays consistent throughout the app.

### Phase 1: Project scaffolding `Completed`

#### Repository setup

- [x] Create `backend/` directory structure.
- [x] Create `frontend/` directory structure.
- [x] Add a root `README` later if needed, but do not prioritize it now.
- [x] Decide whether to use a monorepo-style root workflow or separate frontend/backend commands.

#### Backend setup

- [x] Initialize FastAPI project.
- [x] Add dependency management for Python packages.
- [x] Create `app/main.py`.
- [x] Create `app/api/`, `app/models/`, `app/schemas/`, `app/services/`, `app/db/`, `app/core/`, and `app/tasks/`.
- [x] Configure environment variable loading.
- [x] Add local development settings.
- [x] Set up CORS for the frontend origin.
- [x] Decide on SQLite or Postgres for MVP.
  Recommended: SQLite if speed matters more than infra realism.

#### Frontend setup

- [x] Initialize React app.
- [x] Install Tailwind CSS.
- [x] Install and initialize shadcn/ui.
- [x] Add routing setup.
- [x] Add TanStack Query.
- [x] Add charting library.
- [x] Set up a base layout and theming foundation.
- [x] Add font setup and numeric display styles suitable for data-heavy UI.

### Phase 2: Data modeling and backend foundation `Completed`

#### Database design

- [x] Implement `creators` table/model.
- [x] Implement `creator_platforms` table/model.
- [x] Implement `content_items` table/model.
- [x] Implement `brand_deals` table/model.
- [x] Implement `investments` table/model.
- [x] Implement `users` table/model or create a seeded demo-user strategy.
- [x] Add timestamps where needed.
- [x] Add indexes on fields likely to be queried often.
  Examples: `slug`, `creator_id`, `platform`, `deal_date`.

#### Schemas and serialization

- [x] Create Pydantic schemas for creator list responses.
- [x] Create Pydantic schemas for creator detail responses.
- [x] Create Pydantic schemas for content items.
- [x] Create Pydantic schemas for brand deal responses.
- [x] Create Pydantic schemas for portfolio summary and positions.
- [x] Create request schema for posting a simulated investment.

#### Seed strategy

- [x] Define 8-12 sample creators.
- [x] Assign each creator a category and short bio.
- [x] Assign 2-3 platforms per creator.
- [x] Create realistic platform metrics for each creator.
- [x] Create 10-20 recent content items per creator.
- [x] Create seeded brand deal records for a subset of creators.
- [x] Create optional monetization history fields or placeholder structures.
- [x] Seed a demo user and a few sample investments.

### Phase 3: Core API implementation `Completed`

#### Read APIs

- [x] Implement `GET /api/creators`.
- [x] Add sorting support for `30d growth`, `engagement rate`, and `sponsored activity`.
- [x] Add optional category filtering.
- [x] Add optional platform filtering.
- [x] Add optional search by creator name or handle.
- [x] Implement `GET /api/creators/{slug}`.
- [x] Implement `GET /api/creators/{slug}/content`.
- [x] Implement `GET /api/creators/{slug}/brand-deals`.
- [x] Implement `GET /api/portfolio`.
- [x] Implement `GET /api/methodology`.

#### Mutation APIs

- [x] Implement `POST /api/investments`.
- [x] Validate fixed investment amounts for MVP.
- [x] Return updated portfolio summary after investment creation.
- [x] Add a placeholder or internal-only `POST /api/brand-deals/detect`.

#### API quality tasks

- [x] Add error handling for missing creators and invalid payloads.
- [x] Add response models consistently across endpoints.
- [x] Add lightweight logging.
- [x] Add sample health check endpoint.

### Phase 4: Metric computation and aggregation `Completed`

#### Aggregation logic

- [x] Define how `total audience` is computed across platforms.
- [x] Define how aggregate `engagement rate` is computed for discovery cards.
- [x] Define how `30d growth` is represented when creators have multiple platforms.
- [x] Define how `unique brand partners` is counted.
- [x] Define how `detected sponsored posts` is counted by time window.

#### Summary preparation

- [x] Create backend helpers to assemble creator cards.
- [x] Create backend helpers to assemble profile page datasets.
- [x] Create chart-friendly time series payloads for growth and engagement.
- [x] Create platform-specific metric blocks for the profile page.
- [x] Decide which calculations happen in seed scripts versus response assembly.

#### Methodology alignment

- [x] Write exact formulas for user-facing metrics.
- [x] Record which metrics are directly sourced and which are derived.
- [x] Add update-frequency metadata to the methodology response.
- [x] Add source labels to methodology content.

### Phase 5: Brand-deal detection pipeline design `Completed`

#### Detection rules

- [x] Define the keyword and pattern heuristics for likely sponsor content.
- [x] Define the rules for promo-code detection.
- [x] Define the rules for affiliate-link detection.
- [x] Define how tagged brands or mentions will be normalized.
- [x] Define which evidence text will be surfaced in the UI.

#### LLM extraction design

- [x] Define the structured output schema for sponsorship extraction.
- [x] Design the prompt for classifying sponsored content.
- [x] Design the prompt for extracting brand name and evidence.
- [x] Decide how confidence will be stored and displayed.
- [x] Decide which content sources will actually be passed to the LLM.

#### Data workflow

- [x] Design how candidate content is selected before LLM calls.
- [x] Design how extracted records map into the `brand_deals` table.
- [x] Define the difference between `detected`, `verified`, and `manual` source types.
- [x] Decide whether the MVP runs detection offline in a seed script or on demand via an endpoint.
  Recommended: run it offline or as a manual script for MVP.

### Phase 6: Frontend app shell and shared UI `Completed`

#### Layout and navigation

- [x] Build app shell with persistent top navigation.
- [x] Add routes for landing, discovery, creator profile, portfolio, and methodology.
- [x] Add active nav states.
- [x] Add responsive page containers.
- [x] Add loading and empty states for all major views.

#### Shared components

- [x] Build `MetricCard`.
- [x] Build `SectionHeader`.
- [x] Build `CreatorCard`.
- [x] Build `DataTable`.
- [x] Build `PlatformBadge`.
- [x] Build `GrowthChart`.
- [x] Build `BrandDealList`.
- [x] Build `MethodologyTooltip`.
- [x] Build `InvestDialog`.

#### Styling system

- [x] Define spacing scale for dense dashboard layouts.
- [x] Define color tokens for positive/neutral/alert states.
- [x] Define typography styles for headings, labels, and numeric values.
- [x] Add subtle panel, border, and hover styles to match a market-style product.

### Phase 7: Landing page implementation `Completed`

- [x] Build hero section with headline and subheadline.
- [x] Add CTA to explore creators.
- [x] Add a compact preview of sample creator cards.
- [x] Add a short section explaining the thesis of the product.
- [x] Add a short note about transparent methodology.
- [x] Keep the landing page lightweight and product-forward rather than marketing-heavy.

### Phase 8: Discovery page implementation `Completed`

#### Data and controls

- [x] Fetch creator summaries from `GET /api/creators`.
- [x] Implement search input.
- [x] Implement category filter.
- [x] Implement platform filter.
- [x] Implement sort selector.
- [x] Implement URL state for filters if time permits.

#### Presentation

- [x] Render creator cards or table rows.
- [x] Display avatar, category, platform badges, total audience, 30d growth, engagement rate, and sponsorship metrics.
- [x] Add consistent number formatting.
- [x] Add click-through to creator profile pages.
- [x] Add loading skeletons.
- [x] Add empty results state.

### Phase 9: Creator profile page implementation `Completed`

#### Header and overview

- [x] Build creator header section.
- [x] Show bio, category, and platform links.
- [x] Show overview cards for total audience, recent growth, engagement, and sponsorship activity.

#### Charts and metrics

- [x] Add audience growth chart.
- [x] Add engagement trend chart or compact time-series view.
- [x] Add platform overview cards.
- [x] Add engagement metrics table.
- [x] Add recent content table or feed.

#### Monetization and sponsorship

- [x] Add brand deal history section.
- [x] Show detected vs verified records clearly.
- [x] Display brand names, dates, platform, and evidence snippets.
- [x] Add recent sponsorship activity summary.
- [x] Add a placeholder monetization-history section if deeper monetization data is not yet seeded.

#### Methodology exposure

- [x] Add tooltips or inline labels for metric definitions.
- [x] Add a local methodology summary box on the profile page.
- [x] Link to the full methodology page.

### Phase 10: Simulated investment flow `Completed`

#### Investment UX

- [x] Add `Invest` action on creator profile page.
- [x] Build invest dialog with fixed amount buttons.
- [x] Add confirmation state.
- [x] Add disclaimer that the MVP uses simulated investing.

#### Integration

- [x] Wire dialog to `POST /api/investments`.
- [x] Refresh portfolio-related data after investment.
- [x] Show success toast or inline confirmation.
- [x] Prevent invalid submissions or duplicate rapid clicks.

### Phase 11: Portfolio page implementation `Completed`

#### Summary

- [x] Fetch portfolio data from `GET /api/portfolio`.
- [x] Show total invested.
- [x] Show total creators backed.
- [x] Show category allocation summary.
- [x] Show recent activity.

#### Positions

- [x] Render positions table with creator name, category, amount invested, and date.
- [x] Add links back to creator profiles.
- [x] Add empty state for a fresh portfolio if needed.

### Phase 12: Methodology page implementation `Completed`

- [x] Write a concise explanation of the product's measurement philosophy.
- [x] Add source-by-source breakdown.
- [x] Add update frequency section.
- [x] Add metric definitions section.
- [x] Add explanation of how `engagement rate`, `30d growth`, and `sponsored content detection` work.
- [x] Add explanation of `detected` versus `verified` brand deals.
- [x] Add limitations section so the app feels honest and rigorous.

### Phase 13: Data polish and realism `Completed`

- [x] Review all seeded creator metrics for realism.
- [x] Ensure different creator categories feel meaningfully distinct.
- [x] Make sure some creators have sponsor activity and some do not.
- [x] Make sure recent content feels believable and varied.
- [x] Ensure there is enough variance in growth and engagement to make discovery interesting.
- [x] Add realistic brand names and campaign examples where appropriate.

### Phase 14: Visual polish and Forum-style alignment `Completed`

- [x] Tighten spacing, typography, and chart styling.
- [x] Reduce unnecessary visual noise.
- [x] Make cards feel denser and more investor-facing.
- [x] Normalize border, shadow, and hover treatment across components.
- [x] Make tables easy to scan quickly.
- [x] Keep charts readable and restrained.
- [x] Review the app against Forum's UI tone and remove anything that feels too consumer-social.

### Phase 15: QA and end-to-end walkthrough `Completed`

#### Functional QA

- [x] Verify all routes load correctly.
- [x] Verify all seeded creators appear in discovery.
- [x] Verify creator profile navigation works.
- [x] Verify portfolio updates after a simulated investment.
- [x] Verify brand deal sections render without broken states.
- [x] Verify methodology page content is accurate and consistent with UI labels.

#### UX QA

- [x] Check responsive behavior on desktop and laptop sizes.
- [x] Check empty states, loading states, and error states.
- [x] Verify number formatting is consistent.
- [x] Verify date formatting is consistent.
- [x] Verify charts render cleanly with sample data.

#### Demo QA

- [x] Rehearse the main judge demo flow.
- [x] Confirm one strong creator profile for live demo use.
- [x] Confirm portfolio starts in a sensible demo state.
- [x] Confirm methodology page supports credibility questions.

### Phase 16: Optional stretch tasks `Completed`

- [x] Add creator comparison view.
- [x] Add watchlist functionality.
- [x] Add richer monetization history beyond brand deals.
- [x] Add creator-submitted verification flow.
- [x] Add import scripts for real public content data.
- [x] Add a richer sponsor timeline visualization.
- [x] Add market-style table view toggle on discovery page.
