# Carinya Parc Website - TODO List

> Last Updated: 2025-11-25
> Status: Post-Launch - Focus on Content & Conversion

---

## Priority Framework

Tasks organized by **Impact × Effort** to maximize value:

- **High Impact, Low Effort** = Do First (Quick Wins)
- **High Impact, High Effort** = Strategic Work (Plan & Execute)
- **Low Impact, Low Effort** = Fill Time
- **Low Impact, High Effort** = Avoid / Defer

---

## ✓ Quick Wins - High Impact, Low Effort (Next 2 Weeks)

### Content Enhancements

- [ ] Add "Last Updated" dates to all blog posts frontmatter
- [ ] Implement reading time estimates for blog posts
- [ ] Add author bio component to blog post pages
- [ ] Add "Related Posts" section to individual blog post pages
- [ ] Optimize homepage to show 6 latest posts instead of 3
- [ ] Add location-specific keywords to homepage meta description
- [ ] Review and optimize all image alt text for SEO and accessibility

### Navigation & UX

- [ ] Add "Popular Posts" or "Start Here" section to blog page
- [ ] Create simple recipe listing page at `/recipes` (currently only individual recipe pages)
- [ ] Add internal links between related blog posts
- [ ] Improve footer navigation to include all key pages

### Technical SEO

- [ ] Add structured data testing and validation suite
- [ ] Implement FAQ schema markup (when FAQ content exists)
- [ ] Add WebSite schema with search action
- [ ] Optimize meta descriptions for uniqueness across all pages

---

## ✓ Strategic Work - High Impact, High Effort (Next 1-2 Months)

### Priority Missing Pages

These align with the navigation structure already visible on homepage:

1. **Experience the Farm Page** (`/experience` or `/tours`)
   - [ ] Create page with tours, workshops, and stays information
   - [ ] Add "Coming Soon" waitlist or simple enquiry form
   - [ ] Include photo gallery of farm experiences
   - [ ] Add workshop descriptions and future calendar placeholder

2. **Produce & Products Page** (`/produce` or `/shop`)
   - [ ] Create page showcasing what's grown/raised at Carinya Parc
   - [ ] Add seasonal availability information
   - [ ] Include product descriptions (Dexter beef, eggs, vegetables, native plants)
   - [ ] Link to recipes using Carinya Parc produce

3. **Contact Page** (`/contact`)
   - [ ] Create dedicated contact page with contact form
   - [ ] Implement `/api/contact` endpoint with validation
   - [ ] Add inquiry type selection (general, tours, volunteer, partnership)
   - [ ] Configure email delivery for form submissions
   - [ ] Include response time expectations

### Content Expansion

- [ ] Write 5-7 new blog posts targeting keyword opportunities:
  - [ ] "10 Native Plants for NSW Regeneration Projects"
  - [ ] "How to Start Composting: Complete Beginner's Guide"
  - [ ] "What is Regenerative Agriculture? A Simple Explanation"
  - [ ] "Regenerative Farm The Branch NSW" (location-focused)
  - [ ] "Food Forest Design Guide for Australian Climate"
- [ ] Create 5-7 new farm-to-table recipes:
  - [ ] 2-3 seasonal vegetable recipes
  - [ ] 2-3 Dexter beef recipes
  - [ ] 2 native ingredient recipes

### Local SEO Enhancement

- [ ] Create location-specific landing pages or blog posts:
  - [ ] "Farm Tours Near Stroud NSW"
  - [ ] "Eco-Tourism Mid-North Coast NSW"
  - [ ] "Sustainable Farming Newcastle Region"
- [ ] Add content mentioning nearby attractions (Barrington Tops, Port Stephens)
- [ ] Enhance local business schema markup with more details

---

## ✓ Important But Lower Priority (Next 2-3 Months)

### Educational Content

- [ ] Create comprehensive FAQ page with 15-20 common questions
- [ ] Add downloadable resources page:
  - [ ] Planting calendar for mid-north coast NSW
  - [ ] Native species selection guide
  - [ ] Composting guide PDF
  - [ ] Soil health checklist
- [ ] Create pillar content pages:
  - [ ] "Regenerative Agriculture Complete Guide"
  - [ ] "Permaculture in Australia"
  - [ ] "Native Australian Plants for Revegetation"

### Community Features

- [ ] Add testimonials section to homepage
- [ ] Create volunteer stories/profiles page
- [ ] Add "Get Involved" or community engagement page
- [ ] Develop volunteer opportunity descriptions
- [ ] Add event calendar structure (for future use)

### Visual Content

- [ ] Add photo gallery page or section
- [ ] Create seasonal photo series showing land transformation
- [ ] Create simple infographics for key concepts (polyculture design, food forest layers)
- [ ] Add property map with zones and features

---

## ✓ Newsletter & Email Strategy (Ongoing)

### Email Content

- [ ] Create welcome email sequence for new subscribers (3-5 emails)
- [ ] Develop monthly newsletter template
- [ ] Create email-exclusive content strategy
- [ ] Add "Subscribe to specific topics" segmentation

### Lead Magnets

- [ ] Create free downloadable planting guide
- [ ] Create seasonal composting calendar PDF
- [ ] Create recipe e-book featuring farm produce
- [ ] Add content upgrades for popular blog posts

---

## ✓ Technical Improvements (As Needed)

### Performance

- [ ] Implement ISR (Incremental Static Regeneration) for blog posts
- [ ] Add dynamic OG image generation for blog posts
- [ ] Review and optimize bundle size
- [ ] Implement response streaming for improved perceived performance

### Testing & Quality

- [ ] Implement Playwright E2E tests for critical user journeys
- [ ] Add performance testing with Lighthouse CI budgets
- [ ] Expand security test coverage
- [ ] Create automated accessibility testing in CI pipeline

### Architecture

- [ ] Enable TypeScript strict mode and resolve issues
- [ ] Implement React Error Boundaries for granular error handling
- [ ] Add proper API validation middleware using Zod consistently
- [ ] Document all component APIs with TypeScript interfaces

---

## ✓ Future Features (Deferred Until Need is Validated)

### Interactive Features

- [ ] Add blog post commenting system
- [ ] Implement site search functionality
- [ ] Add event RSVP/booking system
- [ ] Create member/volunteer portal

### E-commerce Preparation

- [ ] Create product catalog structure
- [ ] Implement pre-order system for seasonal products
- [ ] Add CSA (Community Supported Agriculture) program page
- [ ] Develop subscription box program details

### Advanced Features

- [ ] Implement RSS feed for blog
- [ ] Add social sharing buttons to blog posts
- [ ] Implement Progressive Web App (PWA) features
- [ ] Add dark mode support
- [ ] Create newsletter archive pages

---

## ✓ Infrastructure & DevOps (Low Priority)

- [ ] Configure promotion workflow from staging to production
- [ ] Implement blue-green deployment strategy
- [ ] Add canary deployment capabilities
- [ ] Configure automated backup testing
- [ ] Add horizontal scaling automation

---

## DONE ✓

### Core Infrastructure

- [x] Set up CI/CD pipeline with automated testing
- [x] Configure linting, formatting, and dependency scanning
- [x] Document deployment process and architecture
- [x] Create comprehensive test structure (unit, integration, smoke, security)
- [x] Set up MSW for API mocking in tests

### SEO & Discoverability

- [x] Implement JSON-LD structured data (Article, Recipe, LocalBusiness, Organization, Breadcrumb)
- [x] Create dynamic sitemap.xml with content discovery
- [x] Optimize robots.txt
- [x] Add comprehensive metadata (Open Graph, Twitter Cards, canonical URLs)
- [x] Submit sitemap to Google Search Console and Bing Webmaster Tools
- [x] Set up Google Business Profile

### Core Pages & Content

- [x] Homepage with hero, mission sections, and latest posts (3 posts)
- [x] About page with property details and story
- [x] About sub-pages (Jonathan, The Property)
- [x] Regenerate page with stats and overview
- [x] Blog listing page with categories and featured posts
- [x] Individual blog post pages (8 posts published)
- [x] Recipe pages with rich schema (3 recipes published)
- [x] Legal pages (Privacy Policy, Terms of Service)
- [x] Subscribe page with newsletter form

### Components & UI

- [x] Breadcrumb navigation component (implemented across all pages)
- [x] SchemaMarkup component for structured data
- [x] Header with mobile navigation
- [x] Footer with navigation and newsletter signup
- [x] Hero components (multiple variants)
- [x] Section components for consistent layouts
- [x] Toast notification system
- [x] Newsletter subscription form with validation

### Newsletter & Forms

- [x] MailerLite API integration with error handling
- [x] Form validation with Zod schemas
- [x] Rate limiting for subscription endpoints
- [x] Honeypot and spam protection
- [x] Loading states and comprehensive error handling

### Performance & Assets

- [x] Add next/font integration for optimal font loading
- [x] Configure Next.js Image component with optimization
- [x] Create image optimization scripts
- [x] Audit and optimize image assets (compression, lazy loading)
- [x] Implement code splitting for JavaScript bundles

### Security & Compliance

- [x] Implement Content Security Policy (CSP)
- [x] Add secure HTTP headers
- [x] Implement cookie consent mechanism
- [x] Sanitize user inputs in API endpoints
- [x] Conduct security vulnerability scan

### Error Tracking & Monitoring

- [x] Set up Sentry for client, server, and edge environments
- [x] Configure Google Tag Manager
- [x] Set up Vercel Analytics
- [x] Add global error boundaries
- [x] Implement structured error tracking

### Development Environment

- [x] Create comprehensive README and documentation
- [x] Document architecture in docs/architecture/
- [x] Set up monorepo with shared packages (ui, eslint-config, typescript-config)
- [x] Configure proper environment setup
- [x] Enforce code style consistency

---

## Notes on Prioritization

### Why These Priorities?

**Quick Wins** focus on:

- Content enhancements that improve SEO immediately
- Small UX improvements with high user impact
- Technical SEO that search engines can index now

**Strategic Work** focuses on:

- Missing pages referenced on homepage (creates broken expectations)
- Content that drives organic search traffic
- Local SEO (high-intent searches for farm tours/experiences)

**Deferred Items**:

- E-commerce features (no products ready to sell)
- Complex interactive features (validate need first)
- Infrastructure improvements (current setup is sufficient)

### Decision Framework

When choosing what to work on next, ask:

1. Does this help visitors understand "Is this for me?" and "What do I do next?"
2. Does this improve organic search visibility for high-intent keywords?
3. Does this support the business objective (newsletter growth, guest enquiries)?
4. Can it be completed in a reasonable timeframe with current resources?

If "yes" to 3+, prioritize it. If "no" to all, defer it.

---

## Maintenance Checklist (Quarterly)

- [ ] Review and update existing blog posts
- [ ] Update seasonal content
- [ ] Monitor and fix broken links
- [ ] Review underperforming pages via analytics
- [ ] Proofread new content for consistency
- [ ] Update docs to reflect any architectural changes
- [ ] Review and update this TODO based on completed work and new priorities
