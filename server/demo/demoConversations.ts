// ──────────────────────────────────────────────────────────────────────
// 80+ Pre-built Demo Conversations for HighLevel Copilot
// Each conversation has a trigger phrase, keywords for fuzzy matching,
// and a sequence of steps (tool calls + text responses) that get
// streamed to the client exactly like a real AI agent would produce.
// ──────────────────────────────────────────────────────────────────────

export interface DemoStep {
  type: 'tool' | 'text';
  // For tool steps
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  thinkMs?: number;
  // For text steps
  text?: string;
  charDelayMs?: number;
}

export interface DemoConversation {
  trigger: string;
  keywords: string[];
  steps: DemoStep[];
}

// ─── Helper: seed contacts referenced across conversations ───────────
const LEADS = {
  sarah:   { id: 'ct_001', name: 'Sarah Johnson', email: 'sarah.johnson@gmail.com', phone: '+1-555-0123', source: 'Facebook Ads', tags: ['hot-lead', 'facebook'], city: 'Austin', state: 'TX' },
  mike:    { id: 'ct_002', name: 'Mike Chen', email: 'mike.chen@outlook.com', phone: '+1-555-0456', source: 'Google Ads', tags: ['interested', 'google'], city: 'San Francisco', state: 'CA' },
  emily:   { id: 'ct_003', name: 'Emily Davis', email: 'emily.d@company.co', phone: '+1-555-0789', source: 'Website Form', tags: ['demo-booked', 'website'], city: 'New York', state: 'NY' },
  james:   { id: 'ct_004', name: 'James Wilson', email: 'jwilson@techcorp.io', phone: '+1-555-1011', source: 'Referral', tags: ['hot-lead', 'referral', 'enterprise'], city: 'Chicago', state: 'IL' },
  priya:   { id: 'ct_005', name: 'Priya Patel', email: 'priya.patel@startup.dev', phone: '+1-555-1213', source: 'LinkedIn', tags: ['follow-up-needed', 'linkedin'], city: 'Seattle', state: 'WA' },
  carlos:  { id: 'ct_006', name: 'Carlos Rodriguez', email: 'carlos.r@agency.com', phone: '+1-555-1415', source: 'Facebook Ads', tags: ['price-quoted', 'facebook'], city: 'Miami', state: 'FL' },
  amanda:  { id: 'ct_007', name: 'Amanda Foster', email: 'amanda.foster@realestate.biz', phone: '+1-555-1617', source: 'Google Ads', tags: ['hot-lead', 'google', 'high-value'], city: 'Denver', state: 'CO' },
  david:   { id: 'ct_008', name: 'David Kim', email: 'dkim@ecommerce.shop', phone: '+1-555-1819', source: 'Website Form', tags: ['cold', 'website'], city: 'Portland', state: 'OR' },
  rachel:  { id: 'ct_009', name: 'Rachel Thompson', email: 'rachel.t@marketing.agency', phone: '+1-555-2021', source: 'Referral', tags: ['interested', 'referral'], city: 'Nashville', state: 'TN' },
  alex:    { id: 'ct_010', name: 'Alex Martinez', email: 'alex.m@fitness.co', phone: '+1-555-2223', source: 'Facebook Ads', tags: ['follow-up-needed', 'facebook'], city: 'Phoenix', state: 'AZ' },
  jessica: { id: 'ct_011', name: 'Jessica Lee', email: 'jessica.lee@design.studio', phone: '+1-555-2425', source: 'LinkedIn', tags: ['demo-booked', 'linkedin'], city: 'Los Angeles', state: 'CA' },
  robert:  { id: 'ct_012', name: 'Robert Taylor', email: 'rtaylor@finance.group', phone: '+1-555-2627', source: 'Google Ads', tags: ['cold', 'google'], city: 'Boston', state: 'MA' },
  sophia:  { id: 'ct_013', name: 'Sophia Brown', email: 'sophia.b@consulting.co', phone: '+1-555-2829', source: 'Website Form', tags: ['hot-lead', 'website', 'enterprise'], city: 'Dallas', state: 'TX' },
  daniel:  { id: 'ct_014', name: 'Daniel Garcia', email: 'dgarcia@restaurant.biz', phone: '+1-555-3031', source: 'Facebook Ads', tags: ['interested', 'facebook', 'small-business'], city: 'San Antonio', state: 'TX' },
  olivia:  { id: 'ct_015', name: 'Olivia Anderson', email: 'olivia.a@healthcare.org', phone: '+1-555-3233', source: 'Referral', tags: ['price-quoted', 'referral', 'high-value'], city: 'Atlanta', state: 'GA' },
  kevin:   { id: 'ct_016', name: 'Kevin Wright', email: 'kevin.w@plumbing.pro', phone: '+1-555-3435', source: 'Google Ads', tags: ['follow-up-needed', 'google'], city: 'Columbus', state: 'OH' },
  lisa:    { id: 'ct_017', name: 'Lisa Wang', email: 'lisa.wang@tech.ai', phone: '+1-555-3637', source: 'LinkedIn', tags: ['hot-lead', 'linkedin', 'enterprise'], city: 'San Jose', state: 'CA' },
  marcus:  { id: 'ct_018', name: 'Marcus Hayes', email: 'marcus.h@gym.fit', phone: '+1-555-3839', source: 'Facebook Ads', tags: ['interested', 'facebook'], city: 'Charlotte', state: 'NC' },
};

// ════════════════════════════════════════════════════════════════════
// THE CONVERSATIONS (80+)
// ════════════════════════════════════════════════════════════════════

export const DEMO_CONVERSATIONS: DemoConversation[] = [

  // ──────────────── 1. GREETINGS & CASUAL ────────────────────────
  {
    trigger: 'hi',
    keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening'],
    steps: [
      { type: 'text', text: `Hey there! 👋 Welcome to **HighLevel Copilot**. I'm your AI-powered sales assistant.\n\nI can help you with:\n- 📊 **Lead management** — fetch, search, and score your contacts\n- 📧 **Communications** — draft and send SMS & emails\n- 🎯 **Pipeline management** — create deals and move them across stages\n- 📈 **Analytics** — prioritize leads and recommend next actions\n\nWhat would you like to work on?` },
    ],
  },
  {
    trigger: 'how are you',
    keywords: ['how are you', 'how you doing', 'whats up'],
    steps: [
      { type: 'text', text: `I'm doing great, ready to crush some sales targets! 💪\n\nYou've got **5 hot leads** and **3 pending follow-ups** in your pipeline right now. Want me to break them down?` },
    ],
  },
  {
    trigger: 'thank',
    keywords: ['thank', 'thanks', 'appreciate', 'cheers'],
    steps: [
      { type: 'text', text: `You're welcome! 🙌 That's what I'm here for. If you need anything else — lead insights, sending messages, pipeline updates — just ask.` },
    ],
  },
  {
    trigger: 'what can you do',
    keywords: ['what can you do', 'help', 'capabilities', 'features', 'what do you do'],
    steps: [
      { type: 'text', text: `Great question! Here's everything I can do inside HighLevel:\n\n🔍 **Lead Management**\n- Fetch new leads and recent contacts\n- Search by name, source, or tags\n- View detailed lead profiles\n- AI-powered lead scoring (0-100)\n\n📧 **Communications**\n- Draft & send SMS messages\n- Draft & send emails with subject lines\n- Get confirmation before sending anything\n\n🎯 **Pipeline Management**\n- View all pipelines and stages\n- Search opportunities by contact or value\n- Create new opportunities/deals\n- Move deals across pipeline stages\n\n📊 **Analytics & Recommendations**\n- Priority-ranked lead lists\n- "What should I do next?" analysis\n- Source-based strategy recommendations\n- Score-based action suggestions\n\nJust ask in plain English!` },
    ],
  },

  // ──────────────── 2-5. NEW LEADS TODAY ─────────────────────────
  {
    trigger: 'any new leads today',
    keywords: ['new leads', 'leads today', 'recent leads', 'new contacts', 'latest leads'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 24 }, toolOutput: {
        count: 5,
        leads: [LEADS.sarah, LEADS.sophia, LEADS.james, LEADS.lisa, LEADS.amanda],
      }, thinkMs: 600 },
      { type: 'text', text: `You've got **5 new leads** in the last 24 hours! Here's the breakdown:\n\n1. 🔥 **Sarah Johnson** — Facebook Ads, Austin TX *(2 hours ago)*\n2. 🔥 **Sophia Brown** — Website Form, Dallas TX *(1 hour ago)* — Enterprise tag\n3. 🔥 **James Wilson** — Referral, Chicago IL *(5 hours ago)* — Enterprise referral\n4. 🔥 **Lisa Wang** — LinkedIn, San Jose CA *(3 hours ago)* — Enterprise AI company\n5. 🟡 **Amanda Foster** — Google Ads, Denver CO *(8 hours ago)* — High-value real estate\n\n**My recommendation:** Sarah and Sophia are the freshest — speed-to-lead is critical for paid and inbound channels. Want me to draft a quick follow-up message for either of them?` },
    ],
  },
  {
    trigger: 'show me leads from this week',
    keywords: ['leads this week', 'weekly leads', 'week contacts'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 168 }, toolOutput: {
        count: 12,
        leads: [LEADS.sarah, LEADS.sophia, LEADS.james, LEADS.lisa, LEADS.amanda, LEADS.mike, LEADS.emily, LEADS.priya, LEADS.rachel, LEADS.jessica, LEADS.marcus, LEADS.daniel],
      }, thinkMs: 700 },
      { type: 'text', text: `You've had **12 new leads** this week — solid inflow! Here's the source breakdown:\n\n| Source | Count | Top Leads |\n|--------|-------|-----------|\n| Facebook Ads | 4 | Sarah Johnson, Marcus Hayes, Daniel Garcia, Alex Martinez |\n| Google Ads | 2 | Mike Chen, Amanda Foster |\n| LinkedIn | 2 | Lisa Wang, Jessica Lee |\n| Website Form | 2 | Sophia Brown, Emily Davis |\n| Referral | 2 | James Wilson, Rachel Thompson |\n\n**Key insight:** Facebook Ads is your strongest channel this week. The 4 Facebook leads should get immediate SMS follow-ups — that channel has the highest conversion when contacted within 5 minutes.\n\nShould I score these leads or draft follow-ups for the hottest ones?` },
    ],
  },

  // ──────────────── 6-10. LEAD SEARCH & DETAILS ─────────────────
  {
    trigger: 'tell me about sarah johnson',
    keywords: ['sarah johnson', 'sarah', 'tell me about sarah'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'Sarah Johnson' }, toolOutput: {
        count: 1, leads: [LEADS.sarah],
      }, thinkMs: 400 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_001' }, toolOutput: {
        contactId: 'ct_001', score: 87, bucket: 'Hot',
        factors: { recency: 23, source: 22, engagement: 18, pipeline: 12, tags: 12 },
      }, thinkMs: 500 },
      { type: 'text', text: `Here's the full profile for **Sarah Johnson**:\n\n🔥 **Lead Score: 87/100 (Hot)**\n\n| Field | Detail |\n|-------|--------|\n| Email | sarah.johnson@gmail.com |\n| Phone | +1-555-0123 |\n| Source | Facebook Ads |\n| Location | Austin, TX |\n| Tags | hot-lead, facebook |\n| Added | 2 hours ago |\n| Last Activity | 2 hours ago |\n\n**Score Breakdown:**\n- ⏱️ Recency: 23/25 — Very recent lead\n- 📣 Source: 22/25 — High-converting paid channel\n- 💬 Engagement: 18/20 — Active\n- 🎯 Pipeline: 12/15 — Has open opportunity\n- 🏷️ Tags: 12/15 — Hot lead markers\n\n**Open Opportunity:** Website Redesign ($5,000) — New Lead stage\n\n**Recommended action:** Send an immediate SMS follow-up. She came from a Facebook ad, so speed matters. Want me to draft one?` },
    ],
  },
  {
    trigger: 'search leads from google ads',
    keywords: ['google ads', 'search google', 'google leads', 'google contacts'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'Google Ads' }, toolOutput: {
        count: 4, leads: [LEADS.mike, LEADS.amanda, LEADS.robert, LEADS.kevin],
      }, thinkMs: 500 },
      { type: 'text', text: `Found **4 contacts** from Google Ads:\n\n1. 🟡 **Mike Chen** — San Francisco, CA *(1 day ago)* — Tags: interested\n2. 🔥 **Amanda Foster** — Denver, CO *(8 hours ago)* — Tags: hot-lead, high-value\n3. 🧊 **Robert Taylor** — Boston, MA *(21 days ago)* — Tags: cold\n4. 🟡 **Kevin Wright** — Columbus, OH *(6 days ago)* — Tags: follow-up-needed\n\n**Analysis:** Amanda Foster is your highest-priority Google Ads lead — she's tagged as high-value and came in just 8 hours ago. Kevin Wright has been waiting 6 days for a follow-up and might be slipping away.\n\nWant me to:\n- Score these leads?\n- Draft a follow-up for Amanda or Kevin?\n- Show pipeline details for any of them?` },
    ],
  },
  {
    trigger: 'find leads tagged enterprise',
    keywords: ['enterprise', 'tagged enterprise', 'enterprise leads', 'enterprise contacts'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'enterprise' }, toolOutput: {
        count: 3, leads: [LEADS.james, LEADS.sophia, LEADS.lisa],
      }, thinkMs: 450 },
      { type: 'text', text: `Found **3 enterprise-tagged leads** — these are your highest-value prospects:\n\n1. 🔥 **James Wilson** — Referral, Chicago IL — $25K Enterprise Package opportunity\n   - Tags: hot-lead, referral, enterprise\n   - Last activity: 3 hours ago\n\n2. 🔥 **Sophia Brown** — Website Form, Dallas TX — New, no opportunity yet\n   - Tags: hot-lead, website, enterprise\n   - Last activity: 1 hour ago\n\n3. 🔥 **Lisa Wang** — LinkedIn, San Jose CA — $35K AI Integration opportunity\n   - Tags: hot-lead, linkedin, enterprise\n   - Last activity: 1 hour ago\n\n📊 **Total enterprise pipeline value: $60,000** (James + Lisa)\n\n**Key action:** Sophia Brown doesn't have an opportunity yet — she's an enterprise lead from your website and was added just 1 hour ago. Want me to create a deal for her?` },
    ],
  },
  {
    trigger: 'look up priya patel',
    keywords: ['priya', 'patel', 'priya patel'],
    steps: [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_005' }, toolOutput: LEADS.priya, thinkMs: 350 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_005' }, toolOutput: {
        contactId: 'ct_005', score: 52, bucket: 'Warm',
        factors: { recency: 12, source: 15, engagement: 10, pipeline: 5, tags: 10 },
      }, thinkMs: 400 },
      { type: 'text', text: `Here's **Priya Patel's** profile:\n\n🟡 **Lead Score: 52/100 (Warm)**\n\n| Field | Detail |\n|-------|--------|\n| Email | priya.patel@startup.dev |\n| Phone | +1-555-1213 |\n| Source | LinkedIn |\n| Location | Seattle, WA |\n| Tags | follow-up-needed, linkedin |\n| Added | 3 days ago |\n| Last Activity | 2 days ago |\n\n**Score Breakdown:**\n- ⏱️ Recency: 12/25 — Getting stale\n- 📣 Source: 15/25 — LinkedIn (moderate intent)\n- 💬 Engagement: 10/20 — Needs re-engagement\n- 🎯 Pipeline: 5/15 — No open opportunity\n- 🏷️ Tags: 10/15 — Follow-up flag\n\n⚠️ **Alert:** Priya is tagged as "follow-up-needed" but hasn't been contacted in 2 days. LinkedIn leads have a shorter attention span — I'd recommend sending a personalized email referencing her startup. Want me to draft one?` },
    ],
  },
  {
    trigger: 'show details for james wilson',
    keywords: ['james wilson', 'james', 'wilson', 'james details'],
    steps: [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_004' }, toolOutput: LEADS.james, thinkMs: 350 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_004' }, toolOutput: {
        contactId: 'ct_004', score: 92, bucket: 'Hot',
        factors: { recency: 24, source: 20, engagement: 18, pipeline: 15, tags: 15 },
      }, thinkMs: 400 },
      { type: 'text', text: `🔥 **James Wilson — Lead Score: 92/100 (Hot)**\n\nThis is one of your top prospects!\n\n| Field | Detail |\n|-------|--------|\n| Email | jwilson@techcorp.io |\n| Phone | +1-555-1011 |\n| Source | Referral |\n| Location | Chicago, IL |\n| Tags | hot-lead, referral, enterprise |\n| Added | 5 hours ago |\n\n**Score Breakdown:**\n- ⏱️ Recency: 24/25 — Very fresh\n- 📣 Source: 20/25 — Referral (highest conversion)\n- 💬 Engagement: 18/20 — Very active\n- 🎯 Pipeline: 15/15 — Enterprise Package ($25,000)\n- 🏷️ Tags: 15/15 — Perfect tag profile\n\n**Open Deal:** Enterprise Package — $25,000, currently at **Contacted** stage\n\n**My take:** James is a referral-based enterprise lead with the highest score in your system. His $25K deal should be moved to Qualified if the demo went well. Should I advance his pipeline stage?` },
    ],
  },

  // ──────────────── 11-15. LEAD SCORING ─────────────────────────
  {
    trigger: 'score sarah johnson',
    keywords: ['score sarah', 'sarah score', 'rate sarah'],
    steps: [
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_001' }, toolOutput: {
        contactId: 'ct_001', score: 87, bucket: 'Hot',
        factors: { recency: 23, source: 22, engagement: 18, pipeline: 12, tags: 12 },
      }, thinkMs: 600 },
      { type: 'text', text: `🔥 **Sarah Johnson — Score: 87/100 (Hot)**\n\n**Factor Breakdown:**\n| Factor | Score | Max | Why |\n|--------|-------|-----|-----|\n| ⏱️ Recency | 23 | 25 | Added 2 hours ago — extremely fresh |\n| 📣 Source | 22 | 25 | Facebook Ads — high-intent paid channel |\n| 💬 Engagement | 18 | 20 | Active within the last 2 hours |\n| 🎯 Pipeline | 12 | 15 | Has open $5K opportunity |\n| 🏷️ Tags | 12 | 15 | Hot-lead tag present |\n\n**Verdict:** Sarah is a top-priority lead. Facebook Ads leads that aren't contacted within 5 minutes see a **78% drop** in conversion rate. She should be your next call or SMS.` },
    ],
  },
  {
    trigger: 'score all my leads',
    keywords: ['score all', 'score leads', 'rank leads', 'score everyone', 'lead scores'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 720 }, toolOutput: {
        count: 18,
        leads: Object.values(LEADS),
      }, thinkMs: 500 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'batch' }, toolOutput: {
        scores: [
          { name: 'James Wilson', score: 92, bucket: 'Hot' },
          { name: 'Lisa Wang', score: 90, bucket: 'Hot' },
          { name: 'Sarah Johnson', score: 87, bucket: 'Hot' },
          { name: 'Sophia Brown', score: 85, bucket: 'Hot' },
          { name: 'Amanda Foster', score: 82, bucket: 'Hot' },
          { name: 'Emily Davis', score: 72, bucket: 'Warm' },
          { name: 'Rachel Thompson', score: 68, bucket: 'Warm' },
          { name: 'Jessica Lee', score: 65, bucket: 'Warm' },
          { name: 'Mike Chen', score: 62, bucket: 'Warm' },
          { name: 'Carlos Rodriguez', score: 58, bucket: 'Warm' },
          { name: 'Marcus Hayes', score: 55, bucket: 'Warm' },
          { name: 'Daniel Garcia', score: 53, bucket: 'Warm' },
          { name: 'Priya Patel', score: 52, bucket: 'Warm' },
          { name: 'Olivia Anderson', score: 50, bucket: 'Warm' },
          { name: 'Alex Martinez', score: 45, bucket: 'Cold' },
          { name: 'Kevin Wright', score: 42, bucket: 'Cold' },
          { name: 'David Kim', score: 28, bucket: 'Cold' },
          { name: 'Robert Taylor', score: 22, bucket: 'Cold' },
        ],
      }, thinkMs: 800 },
      { type: 'text', text: `Here's your complete **lead scorecard** across all 18 contacts:\n\n### 🔥 Hot Leads (80+) — Act Immediately\n| # | Lead | Score | Source | Key Signal |\n|---|------|-------|--------|------------|\n| 1 | **James Wilson** | 92 | Referral | Enterprise $25K deal, 5h ago |\n| 2 | **Lisa Wang** | 90 | LinkedIn | Enterprise AI deal $35K, 1h ago |\n| 3 | **Sarah Johnson** | 87 | Facebook Ads | New lead, 2h ago, $5K opp |\n| 4 | **Sophia Brown** | 85 | Website Form | Enterprise, 1h ago, needs opp |\n| 5 | **Amanda Foster** | 82 | Google Ads | High-value real estate, $12K opp |\n\n### 🟡 Warm Leads (50-79) — Nurture This Week\n| # | Lead | Score | Source | Status |\n|---|------|-------|--------|--------|\n| 6 | Emily Davis | 72 | Website | Demo booked |\n| 7 | Rachel Thompson | 68 | Referral | Interested |\n| 8 | Jessica Lee | 65 | LinkedIn | Demo booked |\n| 9 | Mike Chen | 62 | Google Ads | Interested |\n| 10 | Carlos Rodriguez | 58 | Facebook | Price quoted |\n| 11-14 | *4 more* | 50-55 | Mixed | Need follow-up |\n\n### 🧊 Cold Leads (<50) — Re-engage or Archive\n| # | Lead | Score | Days Idle |\n|---|------|-------|-----------|\n| 15 | Alex Martinez | 45 | 4 days |\n| 16 | Kevin Wright | 42 | 6 days |\n| 17 | David Kim | 28 | 10 days |\n| 18 | Robert Taylor | 22 | 15 days |\n\n**Summary:** 5 Hot • 9 Warm • 4 Cold\n**Total pipeline value:** $109,500 across open deals\n\nWant me to focus on the top 5 hot leads and recommend specific next actions for each?` },
    ],
  },
  {
    trigger: 'score amanda foster',
    keywords: ['score amanda', 'amanda score', 'amanda foster score'],
    steps: [
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_007' }, toolOutput: {
        contactId: 'ct_007', score: 82, bucket: 'Hot',
        factors: { recency: 18, source: 20, engagement: 16, pipeline: 14, tags: 14 },
      }, thinkMs: 500 },
      { type: 'text', text: `🔥 **Amanda Foster — Score: 82/100 (Hot)**\n\n**Factor Breakdown:**\n| Factor | Score | Why |\n|--------|-------|-----|\n| ⏱️ Recency | 18/25 | Added 8 hours ago |\n| 📣 Source | 20/25 | Google Ads — high commercial intent |\n| 💬 Engagement | 16/20 | Active 6 hours ago |\n| 🎯 Pipeline | 14/15 | $12K Premium Listing deal |\n| 🏷️ Tags | 14/15 | hot-lead, high-value tags |\n\nAmanda is a real estate professional with a $12,000 deal in the **New Lead** stage. Google Ads leads typically research 3-5 solutions before deciding. I'd recommend a personalized email showcasing your real estate features.\n\nWant me to draft that email or move her deal to the Contacted stage?` },
    ],
  },

  // ──────────────── 16-22. WHAT SHOULD I DO NEXT ────────────────
  {
    trigger: 'what should i do next',
    keywords: ['what should i do', 'next action', 'what to do', 'priorities', 'what now', 'priority'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 48 }, toolOutput: {
        count: 8,
        leads: [LEADS.sarah, LEADS.sophia, LEADS.james, LEADS.lisa, LEADS.amanda, LEADS.mike, LEADS.jessica, LEADS.rachel],
      }, thinkMs: 600 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'batch_priority' }, toolOutput: {
        topPriorities: [
          { name: 'Sophia Brown', score: 85, reason: 'Enterprise lead, 1h old, no opportunity yet' },
          { name: 'Sarah Johnson', score: 87, reason: 'Facebook Ads, 2h old, needs first contact' },
          { name: 'Lisa Wang', score: 90, reason: '$35K deal, LinkedIn enterprise' },
          { name: 'James Wilson', score: 92, reason: '$25K referral, ready to move to Qualified' },
        ],
      }, thinkMs: 700 },
      { type: 'text', text: `Based on your current pipeline, here's your **priority action list** for right now:\n\n### 🚨 Immediate Actions (Do Now)\n\n**1. Contact Sophia Brown** *(Score: 85 🔥)*\n- Enterprise lead from website form, added just 1 hour ago\n- No opportunity created yet — you're leaving money on the table\n- **Action:** Send SMS → Create opportunity → Book demo\n\n**2. Follow up with Sarah Johnson** *(Score: 87 🔥)*\n- Facebook Ads lead from 2 hours ago\n- Speed-to-lead data shows 78% conversion drop after 5 min for paid leads\n- **Action:** Send immediate SMS follow-up\n\n### 📋 Today's Pipeline Moves\n\n**3. Advance James Wilson to Qualified** *(Score: 92 🔥)*\n- $25K enterprise referral, currently at Contacted\n- If discovery call went well, he should be in Qualified\n- **Action:** Move pipeline stage → Send proposal prep email\n\n**4. Re-engage Lisa Wang** *(Score: 90 🔥)*\n- $35K AI Integration deal, LinkedIn enterprise\n- Was active 1 hour ago — strike while it's hot\n- **Action:** Send personalized follow-up about AI capabilities\n\n### 🔔 Follow-Ups Needed\n\n**5. Kevin Wright** — 6 days without follow-up (Google Ads)\n**6. Priya Patel** — 2 days overdue (LinkedIn)\n**7. Alex Martinez** — 4 days cold (Facebook Ads)\n\nWant me to start with Action #1 — contacting Sophia Brown?` },
    ],
  },
  {
    trigger: 'what are my most urgent tasks',
    keywords: ['urgent', 'urgent tasks', 'most important', 'critical tasks'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'follow-up-needed' }, toolOutput: {
        count: 3, leads: [LEADS.priya, LEADS.alex, LEADS.kevin],
      }, thinkMs: 400 },
      { type: 'text', text: `⚠️ **3 contacts are flagged "follow-up-needed" and overdue:**\n\n1. **Kevin Wright** — Google Ads, **6 days** without contact\n   - Risk: High — Google Ads leads typically decide within 3-5 days\n   - 🔴 About to go cold permanently\n\n2. **Alex Martinez** — Facebook Ads, **4 days** idle\n   - Risk: Medium-High — Was interested but may be evaluating competitors\n\n3. **Priya Patel** — LinkedIn, **2 days** overdue\n   - Risk: Medium — LinkedIn leads accept longer timelines but patience has limits\n\nBeyond follow-ups, you also have **Sophia Brown** (1 hour old, no opportunity) and **Sarah Johnson** (2 hours old, no first contact) who need immediate attention.\n\nWhat would you like to tackle first?` },
    ],
  },

  // ──────────────── 23-32. SEND SMS ─────────────────────────────
  {
    trigger: 'send a follow-up sms to sarah',
    keywords: ['sms sarah', 'text sarah', 'message sarah', 'send sms sarah'],
    steps: [
      { type: 'tool', toolName: 'send_sms', toolInput: {
        contactId: 'ct_001', message: "Hi Sarah! Thanks for your interest. I'd love to learn more about your project needs. Do you have 15 minutes this week for a quick call?", confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Sarah Johnson (+1-555-0123)',
        message: "Hi Sarah! Thanks for your interest. I'd love to learn more about your project needs. Do you have 15 minutes this week for a quick call?",
        type: 'SMS',
      }, thinkMs: 400 },
      { type: 'text', text: `I've drafted an SMS for **Sarah Johnson**. Here's the preview:\n\n📱 **To:** Sarah Johnson (+1-555-0123)\n💬 **Message:** "Hi Sarah! Thanks for your interest. I'd love to learn more about your project needs. Do you have 15 minutes this week for a quick call?"\n\nShould I send it? (Yes/No)` },
    ],
  },
  {
    trigger: 'yes, go ahead and send it',
    keywords: ['yes', 'go ahead', 'send it', 'approve', 'confirmed', 'do it', 'yes send'],
    steps: [
      { type: 'tool', toolName: 'send_sms', toolInput: { contactId: 'ct_001', confirmed: true }, toolOutput: {
        status: 'sent', messageId: 'msg_demo_001',
        to: 'Sarah Johnson (+1-555-0123)',
        message: "Hi Sarah! Thanks for your interest. I'd love to learn more about your project needs. Do you have 15 minutes this week for a quick call?",
      }, thinkMs: 300 },
      { type: 'text', text: `✅ **SMS sent successfully** to Sarah Johnson!\n\n- **Message ID:** msg_demo_001\n- **Delivered to:** +1-555-0123\n- **Time:** Just now\n\nI'd recommend following up with an email too — multi-channel outreach increases contact rates by 40%. Want me to draft an email for Sarah as well?` },
    ],
  },
  {
    trigger: 'send sms to mike chen',
    keywords: ['sms mike', 'text mike', 'message mike chen'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'Mike Chen' }, toolOutput: {
        count: 1, leads: [LEADS.mike],
      }, thinkMs: 300 },
      { type: 'tool', toolName: 'send_sms', toolInput: {
        contactId: 'ct_002', message: "Hey Mike! I noticed you were checking out our solutions. I'd love to show you how we can help. Got 10 minutes for a quick chat?", confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Mike Chen (+1-555-0456)',
        message: "Hey Mike! I noticed you were checking out our solutions. I'd love to show you how we can help. Got 10 minutes for a quick chat?",
        type: 'SMS',
      }, thinkMs: 400 },
      { type: 'text', text: `Here's the SMS draft for **Mike Chen**:\n\n📱 **To:** Mike Chen (+1-555-0456)\n💬 **Message:** "Hey Mike! I noticed you were checking out our solutions. I'd love to show you how we can help. Got 10 minutes for a quick chat?"\n\nMike came from Google Ads 1 day ago and is tagged as "interested." This message is friendly and low-pressure. Send it?` },
    ],
  },
  {
    trigger: 'text sophia about a demo',
    keywords: ['text sophia', 'sms sophia', 'sophia demo', 'message sophia'],
    steps: [
      { type: 'tool', toolName: 'send_sms', toolInput: {
        contactId: 'ct_013', message: "Hi Sophia! I saw your inquiry and would love to schedule a personalized demo for your consulting team. We have enterprise features that could transform your workflow. When works best?", confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Sophia Brown (+1-555-2829)',
        message: "Hi Sophia! I saw your inquiry and would love to schedule a personalized demo for your consulting team. We have enterprise features that could transform your workflow. When works best?",
        type: 'SMS',
      }, thinkMs: 450 },
      { type: 'text', text: `Draft SMS for **Sophia Brown** (enterprise lead):\n\n📱 **To:** Sophia Brown (+1-555-2829)\n💬 "Hi Sophia! I saw your inquiry and would love to schedule a personalized demo for your consulting team. We have enterprise features that could transform your workflow. When works best?"\n\nSophia is an enterprise lead from your website — mentioning team features and personalized demo should resonate. Approve to send?` },
    ],
  },
  {
    trigger: 'send a text to kevin wright',
    keywords: ['kevin', 'kevin wright', 'text kevin', 'sms kevin'],
    steps: [
      { type: 'tool', toolName: 'send_sms', toolInput: {
        contactId: 'ct_016', message: "Hey Kevin! Just checking in — I noticed you were looking at our solutions a few days ago. I'm here if you have any questions or want a quick walkthrough. No pressure!", confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Kevin Wright (+1-555-3435)',
        message: "Hey Kevin! Just checking in — I noticed you were looking at our solutions a few days ago. I'm here if you have any questions or want a quick walkthrough. No pressure!",
        type: 'SMS',
      }, thinkMs: 400 },
      { type: 'text', text: `📱 Draft for **Kevin Wright** (overdue follow-up):\n\n**To:** Kevin Wright (+1-555-3435)\n**Message:** "Hey Kevin! Just checking in — I noticed you were looking at our solutions a few days ago. I'm here if you have any questions or want a quick walkthrough. No pressure!"\n\nKevin's been idle for 6 days, so I used a soft re-engagement tone. Approve?` },
    ],
  },
  {
    trigger: 'send an sms to all hot leads',
    keywords: ['sms all', 'text all', 'mass sms', 'sms hot leads', 'bulk sms'],
    steps: [
      { type: 'text', text: `⚡ Great idea to reach out to all hot leads! Let me identify them first and draft personalized messages for each.\n\nYour current **hot leads (score 80+):**\n\n1. **James Wilson** (92) — Enterprise referral\n2. **Lisa Wang** (90) — AI Integration, LinkedIn\n3. **Sarah Johnson** (87) — Facebook Ads, new\n4. **Sophia Brown** (85) — Enterprise, website form\n5. **Amanda Foster** (82) — High-value real estate\n\n⚠️ I don't send bulk identical messages — each lead deserves a personalized touch based on their source and context. Want me to draft individual SMS messages for each one? I'll show you all 5 before sending.` },
    ],
  },

  // ──────────────── 33-40. SEND EMAIL ───────────────────────────
  {
    trigger: 'send an email to emily davis',
    keywords: ['email emily', 'send email emily', 'mail emily'],
    steps: [
      { type: 'tool', toolName: 'send_email', toolInput: {
        contactId: 'ct_003',
        subject: 'Excited for Your Demo — Here\'s What We\'ll Cover',
        body: "Hi Emily,\n\nI'm looking forward to our demo! Here's what we'll cover:\n\n1. How our platform streamlines your lead management\n2. Automated follow-up workflows that save 10+ hours/week\n3. Pipeline visibility and reporting dashboards\n4. Custom integrations for your tech stack\n\nBefore we meet, is there anything specific you'd like me to focus on?\n\nBest,\nYour Sales Team",
        confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Emily Davis (emily.d@company.co)',
        subject: 'Excited for Your Demo — Here\'s What We\'ll Cover',
        type: 'Email',
      }, thinkMs: 500 },
      { type: 'text', text: `Here's the email draft for **Emily Davis** (demo booked):\n\n📧 **To:** emily.d@company.co\n📝 **Subject:** Excited for Your Demo — Here's What We'll Cover\n\n---\nHi Emily,\n\nI'm looking forward to our demo! Here's what we'll cover:\n\n1. How our platform streamlines your lead management\n2. Automated follow-up workflows that save 10+ hours/week\n3. Pipeline visibility and reporting dashboards\n4. Custom integrations for your tech stack\n\nBefore we meet, is there anything specific you'd like me to focus on?\n\nBest,\nYour Sales Team\n---\n\nEmily booked a demo via your website, so this pre-demo email sets expectations and invites engagement. Send it?` },
    ],
  },
  {
    trigger: 'draft an email for lisa wang about ai features',
    keywords: ['email lisa', 'lisa wang email', 'ai features email', 'lisa email'],
    steps: [
      { type: 'tool', toolName: 'send_email', toolInput: {
        contactId: 'ct_017',
        subject: 'AI-Powered CRM Features Built for Tech Companies',
        body: "Hi Lisa,\n\nI noticed your interest in our AI capabilities — great timing! We've recently launched several features that tech companies like yours love:\n\n🤖 **AI Copilot** — Conversational interface for managing your entire sales pipeline\n📊 **Predictive Lead Scoring** — ML-powered scoring that learns from your conversion patterns  \n⚡ **Smart Automations** — AI-triggered workflows based on lead behavior\n🔗 **API-First Architecture** — Seamless integration with your existing AI/ML stack\n\nGiven your $35K opportunity scope, I'd love to set up a technical deep-dive with our solutions team.\n\nWould Thursday or Friday work for a 30-minute call?\n\nBest regards,\nYour Sales Team",
        confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Lisa Wang (lisa.wang@tech.ai)',
        subject: 'AI-Powered CRM Features Built for Tech Companies',
        type: 'Email',
      }, thinkMs: 600 },
      { type: 'text', text: `📧 Email draft for **Lisa Wang** ($35K AI Integration deal):\n\n**To:** lisa.wang@tech.ai\n**Subject:** AI-Powered CRM Features Built for Tech Companies\n\nThe email highlights our AI features (Copilot, predictive scoring, smart automations, API architecture) — these will resonate with a tech company evaluating AI integrations.\n\nI also referenced her $35K deal scope and suggested a technical deep-dive. Ready to send?` },
    ],
  },
  {
    trigger: 'email carlos about the proposal',
    keywords: ['email carlos', 'carlos proposal', 'carlos email', 'proposal email'],
    steps: [
      { type: 'tool', toolName: 'send_email', toolInput: {
        contactId: 'ct_006',
        subject: 'Your Custom Agency Plan Proposal — $8,000/year',
        body: "Hi Carlos,\n\nFollowing up on our conversation — here's a summary of the Agency Plan we discussed:\n\n📋 **Agency Plan — $8,000/year**\n- Unlimited sub-accounts for your clients\n- White-label branding on all client-facing pages\n- Priority API access (100K calls/month)\n- Dedicated account manager\n- Custom onboarding (2 sessions)\n\n💰 **Special:** Sign by Friday and get 2 months free ($1,333 savings).\n\nI've attached the full proposal PDF. Let me know if you have questions!\n\nBest,\nYour Sales Team",
        confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Carlos Rodriguez (carlos.r@agency.com)',
        subject: 'Your Custom Agency Plan Proposal — $8,000/year',
        type: 'Email',
      }, thinkMs: 500 },
      { type: 'text', text: `📧 Proposal email for **Carlos Rodriguez** ($8K Agency Plan):\n\n**To:** carlos.r@agency.com\n**Subject:** Your Custom Agency Plan Proposal — $8,000/year\n\nThis email includes a plan breakdown, pricing, and a time-limited incentive (2 months free). Carlos has been at the "Proposal Sent" stage, so this is a natural follow-up.\n\nApprove to send?` },
    ],
  },
  {
    trigger: 'send a thank you email to rachel thompson',
    keywords: ['email rachel', 'thank you rachel', 'rachel email', 'rachel thompson email'],
    steps: [
      { type: 'tool', toolName: 'send_email', toolInput: {
        contactId: 'ct_009',
        subject: 'Thanks for the Chat, Rachel!',
        body: "Hi Rachel,\n\nIt was great connecting today! As promised, here's a recap:\n\n✅ Marketing Package — $4,500/year with everything your agency needs\n✅ Next step: I'll send over a customized demo link by end of day\n✅ Timeline: We can have you onboarded within a week\n\nYour referral from the industry network means a lot — we want to make sure you get the white-glove treatment.\n\nTalk soon!\n\nBest,\nYour Sales Team",
        confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'Rachel Thompson (rachel.t@marketing.agency)',
        subject: 'Thanks for the Chat, Rachel!',
        type: 'Email',
      }, thinkMs: 450 },
      { type: 'text', text: `📧 Thank-you email for **Rachel Thompson** ($4.5K Marketing Package):\n\n**To:** rachel.t@marketing.agency\n**Subject:** Thanks for the Chat, Rachel!\n\nThis is a warm follow-up referencing her referral source and next steps. Approve to send?` },
    ],
  },
  {
    trigger: 'draft a re-engagement email for david kim',
    keywords: ['email david', 'david kim', 're-engage david', 'david email'],
    steps: [
      { type: 'tool', toolName: 'send_email', toolInput: {
        contactId: 'ct_008',
        subject: 'Quick Question, David 👋',
        body: "Hey David,\n\nI noticed it's been a little while since we connected. No worries — I know things get busy!\n\nI wanted to share a quick update: we've launched a new e-commerce toolkit that might be perfect for your shop:\n\n🛒 **Storefront integration** — Sync your products directly\n📊 **Revenue attribution** — See which leads turn into customers\n🔄 **Abandoned cart workflows** — Automated recovery sequences\n\nWould you be open to a 10-minute recap call? I think there's a setup that could really boost your sales.\n\nNo pressure either way!\n\nBest,\nYour Sales Team",
        confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        to: 'David Kim (dkim@ecommerce.shop)',
        subject: 'Quick Question, David 👋',
        type: 'Email',
      }, thinkMs: 500 },
      { type: 'text', text: `📧 Re-engagement email for **David Kim** (cold lead, 10 days idle):\n\n**To:** dkim@ecommerce.shop\n**Subject:** Quick Question, David 👋\n\nI kept this soft and value-driven — mentioning new e-commerce features relevant to his business. David's been cold for 10 days, so a hard sell would push him away. This feels like a natural check-in.\n\nShould I send it?` },
    ],
  },

  // ──────────────── 41-52. PIPELINE MANAGEMENT ──────────────────
  {
    trigger: 'show my pipeline',
    keywords: ['pipeline', 'show pipeline', 'my pipeline', 'view pipeline', 'sales pipeline', 'pipeline stages'],
    steps: [
      { type: 'tool', toolName: 'get_pipelines', toolInput: {}, toolOutput: {
        pipelines: [{
          id: 'pipe_sales_001', name: 'Sales Pipeline',
          stages: [
            { id: 'stage_new', name: 'New Lead', count: 3, value: 52000 },
            { id: 'stage_contacted', name: 'Contacted', count: 2, value: 29500 },
            { id: 'stage_qualified', name: 'Qualified', count: 1, value: 3000 },
            { id: 'stage_proposal', name: 'Proposal Sent', count: 1, value: 8000 },
            { id: 'stage_negotiation', name: 'Negotiation', count: 1, value: 18000 },
            { id: 'stage_won', name: 'Closed Won', count: 0, value: 0 },
          ],
        }],
      }, thinkMs: 500 },
      { type: 'text', text: `Here's your **Sales Pipeline** overview:\n\n| Stage | Deals | Value |\n|-------|-------|-------|\n| 🆕 New Lead | 3 | $52,000 |\n| 📞 Contacted | 2 | $29,500 |\n| ✅ Qualified | 1 | $3,000 |\n| 📄 Proposal Sent | 1 | $8,000 |\n| 🤝 Negotiation | 1 | $18,000 |\n| 🏆 Closed Won | 0 | $0 |\n\n**Total pipeline: $110,500 across 8 open deals**\n\n📊 **Key Insights:**\n- Your **New Lead** stage has the most value ($52K) — these need to move forward ASAP\n- **Olivia Anderson's** $18K deal is in Negotiation — that's your closest to closing\n- **Carlos Rodriguez's** $8K proposal is aging — consider a follow-up\n- **Zero closed deals** — focus on advancing Negotiation and Proposal stages\n\nWant me to drill into any specific stage or deal?` },
    ],
  },
  {
    trigger: 'show deals in new lead stage',
    keywords: ['new lead stage', 'new leads pipeline', 'deals in new', 'new stage deals'],
    steps: [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { stageId: 'stage_new' }, toolOutput: {
        count: 3,
        opportunities: [
          { id: 'opp_001', name: 'Sarah Johnson — Website Redesign', contactId: 'ct_001', monetaryValue: 5000, stage: 'New Lead' },
          { id: 'opp_005', name: 'Amanda Foster — Premium Listing', contactId: 'ct_007', monetaryValue: 12000, stage: 'New Lead' },
          { id: 'opp_008', name: 'Lisa Wang — AI Integration', contactId: 'ct_017', monetaryValue: 35000, stage: 'New Lead' },
        ],
      }, thinkMs: 450 },
      { type: 'text', text: `**3 deals in the New Lead stage** ($52,000 total):\n\n1. 🔥 **Lisa Wang — AI Integration** → $35,000\n   - LinkedIn enterprise lead, added 3 hours ago\n   - *Action: Schedule discovery call, move to Contacted*\n\n2. 🔥 **Amanda Foster — Premium Listing** → $12,000\n   - Google Ads, real estate, added 8 hours ago\n   - *Action: Send personalized email, move to Contacted*\n\n3. 🟡 **Sarah Johnson — Website Redesign** → $5,000\n   - Facebook Ads, added 2 hours ago\n   - *Action: Send SMS follow-up, move to Contacted*\n\n**Total at risk:** $52,000 sitting in the earliest stage. Moving these to Contacted should be today's priority.\n\nShall I help move any of them forward?` },
    ],
  },
  {
    trigger: 'move james wilson to qualified',
    keywords: ['move james', 'james qualified', 'advance james', 'james pipeline', 'update james stage'],
    steps: [
      { type: 'tool', toolName: 'update_opportunity_stage', toolInput: {
        opportunityId: 'opp_003', stageId: 'stage_qualified', confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        opportunity: 'James Wilson — Enterprise Package',
        from: 'Contacted',
        to: 'Qualified',
        value: 25000,
      }, thinkMs: 400 },
      { type: 'text', text: `Pipeline update preview:\n\n🔄 **Move:** James Wilson — Enterprise Package\n💰 **Value:** $25,000\n📍 **From:** Contacted → **To:** Qualified\n\nThis confirms James has been qualified and is ready for a proposal. Approve this move?` },
    ],
  },
  {
    trigger: 'yes approve the pipeline change',
    keywords: ['approve pipeline', 'approve move', 'confirm move', 'yes move'],
    steps: [
      { type: 'tool', toolName: 'update_opportunity_stage', toolInput: {
        opportunityId: 'opp_003', stageId: 'stage_qualified', confirmed: true,
      }, toolOutput: {
        status: 'updated',
        opportunity: 'James Wilson — Enterprise Package',
        newStage: 'Qualified',
        value: 25000,
      }, thinkMs: 300 },
      { type: 'text', text: `✅ **Pipeline updated!**\n\n**James Wilson — Enterprise Package ($25,000)** has been moved to **Qualified**.\n\n**Next recommended step:** Send James a proposal. Want me to draft a proposal email with pricing details?` },
    ],
  },
  {
    trigger: 'create an opportunity for sophia brown',
    keywords: ['create opportunity sophia', 'new deal sophia', 'sophia opportunity', 'sophia deal', 'create deal sophia'],
    steps: [
      { type: 'tool', toolName: 'create_opportunity', toolInput: {
        contactId: 'ct_013', name: 'Sophia Brown — Enterprise Consulting Package', pipelineId: 'pipe_sales_001', stageId: 'stage_new', monetaryValue: 20000, confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        opportunity: {
          name: 'Sophia Brown — Enterprise Consulting Package',
          value: 20000,
          pipeline: 'Sales Pipeline',
          stage: 'New Lead',
          contact: 'Sophia Brown',
        },
      }, thinkMs: 500 },
      { type: 'text', text: `Here's the new opportunity I'll create:\n\n➕ **New Opportunity**\n- **Name:** Sophia Brown — Enterprise Consulting Package\n- **Contact:** Sophia Brown (sophia.b@consulting.co)\n- **Value:** $20,000\n- **Pipeline:** Sales Pipeline\n- **Stage:** New Lead\n\nSophia is tagged as enterprise and hot-lead — this $20K estimate is based on your typical enterprise deal size. Want me to adjust the value or create it as is?` },
    ],
  },
  {
    trigger: 'yes create it',
    keywords: ['yes create', 'create it', 'confirm create', 'yes do it'],
    steps: [
      { type: 'tool', toolName: 'create_opportunity', toolInput: {
        contactId: 'ct_013', name: 'Sophia Brown — Enterprise Consulting Package', monetaryValue: 20000, confirmed: true,
      }, toolOutput: {
        status: 'created',
        id: 'opp_009',
        name: 'Sophia Brown — Enterprise Consulting Package',
        value: 20000,
        stage: 'New Lead',
      }, thinkMs: 300 },
      { type: 'text', text: `✅ **Opportunity created!**\n\n- **ID:** opp_009\n- **Deal:** Sophia Brown — Enterprise Consulting Package\n- **Value:** $20,000\n- **Stage:** New Lead\n\nYour pipeline just grew to **$130,500** total! 🎉\n\nNow I'd recommend sending Sophia a personalized SMS to kick off the conversation. Want me to draft one?` },
    ],
  },
  {
    trigger: 'move olivia to closed won',
    keywords: ['olivia won', 'close olivia', 'olivia closed', 'olivia deal won', 'olivia anderson won'],
    steps: [
      { type: 'tool', toolName: 'update_opportunity_stage', toolInput: {
        opportunityId: 'opp_007', stageId: 'stage_won', confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        opportunity: 'Olivia Anderson — Healthcare Suite',
        from: 'Negotiation',
        to: 'Closed Won',
        value: 18000,
      }, thinkMs: 400 },
      { type: 'text', text: `🏆 **Closing a deal!**\n\n🔄 **Move:** Olivia Anderson — Healthcare Suite\n💰 **Value:** $18,000\n📍 **From:** Negotiation → **To:** Closed Won\n\nThis is a big win! Once confirmed, I'll also recommend sending Olivia a welcome/onboarding email. Approve?` },
    ],
  },
  {
    trigger: 'search opportunities over 10000',
    keywords: ['opportunities over', 'big deals', 'high value deals', 'deals over 10000', 'large opportunities'],
    steps: [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { minValue: 10000 }, toolOutput: {
        count: 4,
        opportunities: [
          { id: 'opp_008', name: 'Lisa Wang — AI Integration', value: 35000, stage: 'New Lead' },
          { id: 'opp_003', name: 'James Wilson — Enterprise Package', value: 25000, stage: 'Contacted' },
          { id: 'opp_007', name: 'Olivia Anderson — Healthcare Suite', value: 18000, stage: 'Negotiation' },
          { id: 'opp_005', name: 'Amanda Foster — Premium Listing', value: 12000, stage: 'New Lead' },
        ],
      }, thinkMs: 500 },
      { type: 'text', text: `Found **4 high-value deals** (>$10K):\n\n| Rank | Deal | Value | Stage |\n|------|------|-------|-------|\n| 1 | Lisa Wang — AI Integration | $35,000 | 🆕 New Lead |\n| 2 | James Wilson — Enterprise Package | $25,000 | 📞 Contacted |\n| 3 | Olivia Anderson — Healthcare Suite | $18,000 | 🤝 Negotiation |\n| 4 | Amanda Foster — Premium Listing | $12,000 | 🆕 New Lead |\n\n**Total high-value pipeline: $90,000**\n\n⚡ **Priority:** Lisa Wang and Amanda Foster are both stuck in New Lead. Moving them to Contacted would signal active engagement. Olivia's $18K is closest to closing.\n\nWant me to help advance any of these?` },
    ],
  },
  {
    trigger: 'create a deal for mike chen',
    keywords: ['deal mike', 'opportunity mike', 'mike chen deal', 'create opportunity mike'],
    steps: [
      { type: 'tool', toolName: 'create_opportunity', toolInput: {
        contactId: 'ct_002', name: 'Mike Chen — Growth Plan', pipelineId: 'pipe_sales_001', stageId: 'stage_new', monetaryValue: 6000, confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        opportunity: { name: 'Mike Chen — Growth Plan', value: 6000, stage: 'New Lead', contact: 'Mike Chen' },
      }, thinkMs: 400 },
      { type: 'text', text: `➕ **New deal preview:**\n\n- **Deal:** Mike Chen — Growth Plan\n- **Contact:** Mike Chen (mike.chen@outlook.com)\n- **Value:** $6,000\n- **Stage:** New Lead\n\nMike came from Google Ads and is tagged "interested" — a $6K Growth Plan seems right for his profile. Create this deal?` },
    ],
  },

  // ──────────────── 53-60. ANALYSIS & INSIGHTS ──────────────────
  {
    trigger: 'how is my pipeline performing',
    keywords: ['pipeline performance', 'pipeline analytics', 'pipeline metrics', 'conversion rate', 'pipeline health'],
    steps: [
      { type: 'tool', toolName: 'get_pipelines', toolInput: {}, toolOutput: {
        pipelines: [{
          id: 'pipe_sales_001', name: 'Sales Pipeline', totalValue: 110500, dealCount: 8,
          stages: [
            { name: 'New Lead', count: 3, value: 52000 },
            { name: 'Contacted', count: 2, value: 29500 },
            { name: 'Qualified', count: 1, value: 3000 },
            { name: 'Proposal Sent', count: 1, value: 8000 },
            { name: 'Negotiation', count: 1, value: 18000 },
            { name: 'Closed Won', count: 0, value: 0 },
          ],
        }],
      }, thinkMs: 600 },
      { type: 'text', text: `📊 **Pipeline Performance Report**\n\n**Total Value:** $110,500 across 8 deals\n**Average Deal Size:** $13,812\n\n### Stage Distribution\n\`\`\`\nNew Lead:      ███████████████ $52,000 (47%)\nContacted:     ████████       $29,500 (27%)\nQualified:     ██             $3,000  (3%)\nProposal Sent: ████           $8,000  (7%)\nNegotiation:   ██████         $18,000 (16%)\nClosed Won:    -              $0      (0%)\n\`\`\`\n\n### 🚨 Key Issues\n1. **Top-heavy pipeline** — 47% of value is stuck in New Lead. These need to advance or they'll go stale\n2. **Empty Closed Won** — No deals closed yet. Olivia Anderson ($18K) in Negotiation is your best bet\n3. **Qualified bottleneck** — Only $3K in Qualified means your discovery/qualification process needs acceleration\n\n### 💡 Recommendations\n- Move Lisa Wang, Amanda Foster, and Sarah Johnson out of New Lead today\n- Fast-track Olivia Anderson's negotiation to close\n- Follow up on Carlos Rodriguez's existing proposal\n\nWant me to help execute any of these?` },
    ],
  },
  {
    trigger: 'compare leads by source',
    keywords: ['compare source', 'lead source', 'source analysis', 'channel analysis', 'best source', 'source performance'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 720 }, toolOutput: { count: 18 }, thinkMs: 500 },
      { type: 'text', text: `📊 **Lead Source Analysis** (all 18 contacts)\n\n| Source | Leads | Avg Score | Deals | Pipeline Value |\n|--------|-------|-----------|-------|---------------|\n| Facebook Ads | 5 | 65 | 1 | $5,000 |\n| Google Ads | 4 | 52 | 2 | $17,000 |\n| LinkedIn | 3 | 69 | 1 | $35,000 |\n| Website Form | 3 | 62 | 1 | $3,000 |\n| Referral | 3 | 70 | 2 | $43,000 |\n\n### 🏆 Top Performer: **Referral**\n- Highest average score (70)\n- Highest pipeline value ($43K — James Wilson $25K + Olivia Anderson $18K)\n- Best conversion quality\n\n### ⚡ Best Volume: **Facebook Ads**\n- Most leads (5) but lower average score\n- Needs faster follow-up — Facebook leads cool off quickly\n\n### 💎 Hidden Gem: **LinkedIn**\n- Only 3 leads but highest single deal ($35K — Lisa Wang)\n- Enterprise-heavy, high-quality prospects\n\n### 💡 Strategy Recommendation\n- **Double down on Referral** — partner programs, ask happy customers for intros\n- **Speed up Facebook Ads follow-up** — automate SMS within 2 minutes\n- **Invest in LinkedIn outreach** — high-value enterprise prospects\n\nWant to dig deeper into any channel?` },
    ],
  },
  {
    trigger: 'which leads are going cold',
    keywords: ['cold leads', 'going cold', 'stale leads', 'inactive leads', 'dormant', 'losing leads'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'cold' }, toolOutput: {
        count: 4,
        leads: [LEADS.david, LEADS.robert, LEADS.alex, LEADS.kevin],
      }, thinkMs: 450 },
      { type: 'text', text: `⚠️ **4 leads are going cold or already cold:**\n\n| Lead | Score | Days Idle | Source | Risk |\n|------|-------|-----------|--------|------|\n| 🧊 Robert Taylor | 22 | 15 days | Google Ads | 🔴 Critical |\n| 🧊 David Kim | 28 | 10 days | Website | 🔴 Critical |\n| 🧊 Alex Martinez | 45 | 4 days | Facebook | 🟡 At risk |\n| 🧊 Kevin Wright | 42 | 6 days | Google Ads | 🟡 At risk |\n\n### Recommended Actions\n\n**Robert Taylor** (15 days) — Likely a lost cause. Consider sending a "breakup email" — surprisingly effective at getting a response.\n\n**David Kim** (10 days) — E-commerce business, send a re-engagement email about new e-commerce features.\n\n**Alex Martinez** (4 days) — Still salvageable! Quick SMS check-in could revive this.\n\n**Kevin Wright** (6 days) — On the edge. Personalized follow-up today or lose him.\n\nWant me to draft re-engagement messages for any of them?` },
    ],
  },
  {
    trigger: 'give me a daily summary',
    keywords: ['daily summary', 'summary', 'morning report', 'daily report', 'today summary', 'briefing'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 24 }, toolOutput: { count: 5 }, thinkMs: 400 },
      { type: 'tool', toolName: 'get_pipelines', toolInput: {}, toolOutput: { totalValue: 110500, dealCount: 8 }, thinkMs: 400 },
      { type: 'text', text: `📋 **Your Daily Sales Briefing**\n\n### 📊 Numbers at a Glance\n| Metric | Value |\n|--------|-------|\n| New leads (24h) | 5 |\n| Total pipeline value | $110,500 |\n| Open deals | 8 |\n| Hot leads (80+) | 5 |\n| Overdue follow-ups | 3 |\n| Deals closest to closing | 1 (Olivia, $18K) |\n\n### 🚨 Today's Top 3 Priorities\n1. **Contact Sophia Brown** — Enterprise lead, 1 hour old, no deal yet\n2. **Follow up Sarah Johnson** — Facebook Ads, 2 hours old, speed matters\n3. **Advance Olivia Anderson** — $18K in Negotiation, close it today\n\n### ⚠️ Overdue Follow-Ups\n- Kevin Wright (6 days), Priya Patel (2 days), Alex Martinez (4 days)\n\n### 🎯 Win Probability\n- Olivia Anderson ($18K) — ~70% likely to close this week\n- James Wilson ($25K) — ~50%, needs proposal\n- Lisa Wang ($35K) — ~40%, early stage but high intent\n\nWhat would you like to tackle first?` },
    ],
  },
  {
    trigger: 'forecast my revenue this month',
    keywords: ['forecast', 'revenue forecast', 'projection', 'predicted revenue', 'monthly forecast'],
    steps: [
      { type: 'tool', toolName: 'get_pipelines', toolInput: {}, toolOutput: { totalValue: 110500 }, thinkMs: 500 },
      { type: 'text', text: `📈 **Revenue Forecast — This Month**\n\nBased on your current pipeline stages and typical conversion rates:\n\n| Stage | Value | Win Rate | Weighted |\n|-------|-------|----------|----------|\n| New Lead ($52K) | 15% | $7,800 |\n| Contacted ($29.5K) | 25% | $7,375 |\n| Qualified ($3K) | 45% | $1,350 |\n| Proposal Sent ($8K) | 55% | $4,400 |\n| Negotiation ($18K) | 75% | $13,500 |\n\n**Weighted forecast: $34,425**\n\n### Upside Scenario (if you accelerate):\n- Close Olivia ($18K) + James ($25K) = $43,000 just from those two\n- Add Lisa ($35K) if fast-tracked = $78,000 potential\n\n### 💡 To Hit $50K+\n1. Close Olivia's negotiation → +$18K\n2. Get James to Proposal → +$25K at 55% = +$13,750\n3. Fast-track Lisa Wang → highest value deal\n\nShall I help prioritize the actions to maximize this month's revenue?` },
    ],
  },
  {
    trigger: 'show me leads who booked a demo',
    keywords: ['demo booked', 'booked demo', 'demo leads', 'demo scheduled'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'demo-booked' }, toolOutput: {
        count: 2, leads: [LEADS.emily, LEADS.jessica],
      }, thinkMs: 400 },
      { type: 'text', text: `Found **2 leads** with demos booked:\n\n1. **Emily Davis** — Website Form, New York NY\n   - $3,000 Monthly Retainer deal at Qualified stage\n   - Last activity: 1 day ago\n   - 📧 Has been in email conversation about scheduling\n\n2. **Jessica Lee** — LinkedIn, Los Angeles CA\n   - No opportunity created yet\n   - Last activity: 4 hours ago\n   - 🔔 Fresh engagement — should have a deal created\n\n**Actions I'd recommend:**\n- Send Emily a pre-demo prep email (I have one drafted)\n- Create an opportunity for Jessica before her demo\n\nWant me to handle either of these?` },
    ],
  },

  // ──────────────── 61-70. MULTI-STEP WORKFLOWS ─────────────────
  {
    trigger: 'do a full workup on lisa wang',
    keywords: ['full workup', 'deep dive', 'full analysis', 'workup lisa', 'lisa wang full'],
    steps: [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_017' }, toolOutput: LEADS.lisa, thinkMs: 400 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_017' }, toolOutput: {
        contactId: 'ct_017', score: 90, bucket: 'Hot',
        factors: { recency: 24, source: 15, engagement: 20, pipeline: 15, tags: 16 },
      }, thinkMs: 500 },
      { type: 'tool', toolName: 'search_opportunities', toolInput: { contactId: 'ct_017' }, toolOutput: {
        count: 1,
        opportunities: [{ id: 'opp_008', name: 'Lisa Wang — AI Integration', value: 35000, stage: 'New Lead' }],
      }, thinkMs: 400 },
      { type: 'text', text: `## 🔥 Full Workup: Lisa Wang\n\n### Profile\n| Field | Detail |\n|-------|--------|\n| Name | Lisa Wang |\n| Email | lisa.wang@tech.ai |\n| Phone | +1-555-3637 |\n| Source | LinkedIn |\n| Location | San Jose, CA |\n| Tags | hot-lead, linkedin, enterprise |\n| Added | 3 hours ago |\n| Last Active | 1 hour ago |\n\n### Lead Score: 90/100 🔥\n| Factor | Score | Max |\n|--------|-------|-----|\n| ⏱️ Recency | 24 | 25 |\n| 📣 Source | 15 | 25 |\n| 💬 Engagement | 20 | 20 |\n| 🎯 Pipeline | 15 | 15 |\n| 🏷️ Tags | 16 | 15* |\n\n*Bonus from enterprise + hot-lead combination*\n\n### Open Deal\n- **AI Integration** — $35,000 at New Lead stage\n- This is your **highest-value opportunity**\n\n### Recommended Multi-Step Plan\n1. **Now:** Send personalized SMS referencing AI capabilities\n2. **Today:** Follow up with an AI features email (I have a draft ready)\n3. **This week:** Schedule a technical deep-dive demo\n4. **Next step:** Move to Contacted → Qualified after demo\n\nShall I execute Step 1 (SMS) right now?` },
    ],
  },
  {
    trigger: 'run the full onboarding for sophia',
    keywords: ['onboarding sophia', 'full onboarding', 'onboard sophia', 'sophia onboarding'],
    steps: [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_013' }, toolOutput: LEADS.sophia, thinkMs: 300 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_013' }, toolOutput: {
        contactId: 'ct_013', score: 85, bucket: 'Hot',
        factors: { recency: 25, source: 18, engagement: 18, pipeline: 10, tags: 14 },
      }, thinkMs: 400 },
      { type: 'text', text: `## 🚀 Onboarding Plan: Sophia Brown\n\nSophia is a **hot enterprise lead** (Score: 85) who just came in 1 hour ago via website form. Here's the multi-step onboarding plan:\n\n### Step 1 ✅ Score Lead → Done (85/100, Hot)\n### Step 2: Create Opportunity\n- Suggested: Enterprise Consulting Package — $20,000\n\n### Step 3: First Contact\n- SMS: Personalized intro mentioning enterprise features\n\n### Step 4: Follow-Up Email\n- Demo scheduling with enterprise talking points\n\n### Step 5: Pipeline Move\n- After contact: New Lead → Contacted\n\nI can execute these steps one by one with your approval at each stage. Ready to start with Step 2 (create opportunity)?` },
    ],
  },
  {
    trigger: 'walk me through the carlos deal',
    keywords: ['carlos deal', 'carlos status', 'carlos rodriguez deal', 'carlos opportunity'],
    steps: [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { contactId: 'ct_006' }, toolOutput: {
        count: 1,
        opportunities: [{ id: 'opp_004', name: 'Carlos Rodriguez — Agency Plan', value: 8000, stage: 'Proposal Sent', createdAt: '5 days ago' }],
      }, thinkMs: 400 },
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_006' }, toolOutput: LEADS.carlos, thinkMs: 300 },
      { type: 'text', text: `## Carlos Rodriguez — Agency Plan ($8,000)\n\n### Deal Status\n| Field | Detail |\n|-------|--------|\n| Stage | 📄 Proposal Sent |\n| Value | $8,000 |\n| Created | 5 days ago |\n| Last Activity | 3 days ago |\n\n### Contact Info\n- Email: carlos.r@agency.com | Phone: +1-555-1415\n- Source: Facebook Ads | Location: Miami, FL\n- Tags: price-quoted, facebook\n\n### ⚠️ Concern\nCarlos received a proposal **5 days ago** and was last active **3 days ago**. This is entering the danger zone — proposals left unanswered for more than a week have a 60% drop in close rate.\n\n### Recommended Actions\n1. **Send follow-up email** referencing the proposal and adding urgency (limited-time discount)\n2. **Call Carlos** — direct conversation at proposal stage has highest close rate\n3. If no response in 2 more days, send a "last chance" email with the discount deadline\n\nWant me to draft the follow-up email with a time-limited incentive?` },
    ],
  },
  {
    trigger: 'help me close the olivia deal',
    keywords: ['close olivia', 'olivia deal', 'olivia negotiation', 'close healthcare', 'win olivia'],
    steps: [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { contactId: 'ct_015' }, toolOutput: {
        count: 1,
        opportunities: [{ id: 'opp_007', name: 'Olivia Anderson — Healthcare Suite', value: 18000, stage: 'Negotiation' }],
      }, thinkMs: 400 },
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_015' }, toolOutput: LEADS.olivia, thinkMs: 300 },
      { type: 'text', text: `## 🤝 Closing Strategy: Olivia Anderson — Healthcare Suite ($18,000)\n\nThis is your **closest deal to closing** and your second-highest value opportunity.\n\n### Current Status\n- Stage: Negotiation (5th of 6 stages)\n- Source: Referral (highest-converting channel)\n- Tags: price-quoted, referral, high-value\n- Last activity: 5 days ago ⚠️\n\n### Closing Playbook\n\n**Step 1: Re-engage Today**\nSend a concise email addressing her likely objections:\n- Healthcare compliance (HIPAA)\n- Implementation timeline\n- ROI projection based on her current workflow\n\n**Step 2: Offer a Sweetener**\n- 15% discount for signing this week ($2,700 savings)\n- Or: 3 months of premium support free\n\n**Step 3: Create Urgency**\n- Mention limited onboarding slots this month\n- Reference the referral relationship — "We want to deliver the same results as [referrer]"\n\n**Step 4: Move to Closed Won**\nOnce agreement is signed, I'll update the pipeline automatically.\n\nShall I draft the closing email for Step 1?` },
    ],
  },
  {
    trigger: 'set up jessica lee as a new opportunity',
    keywords: ['jessica opportunity', 'jessica deal', 'jessica lee deal', 'new deal jessica'],
    steps: [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: 'ct_011' }, toolOutput: LEADS.jessica, thinkMs: 300 },
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'ct_011' }, toolOutput: {
        contactId: 'ct_011', score: 65, bucket: 'Warm',
        factors: { recency: 16, source: 15, engagement: 14, pipeline: 5, tags: 15 },
      }, thinkMs: 400 },
      { type: 'tool', toolName: 'create_opportunity', toolInput: {
        contactId: 'ct_011', name: 'Jessica Lee — Design Studio Package', pipelineId: 'pipe_sales_001', stageId: 'stage_new', monetaryValue: 7500, confirmed: false,
      }, toolOutput: {
        status: 'pending_confirmation',
        opportunity: { name: 'Jessica Lee — Design Studio Package', value: 7500, stage: 'New Lead', contact: 'Jessica Lee' },
      }, thinkMs: 400 },
      { type: 'text', text: `I looked up **Jessica Lee** (Score: 65, Warm) and she's a LinkedIn lead with a demo booked but no deal in the pipeline.\n\n➕ **Proposed Opportunity:**\n- **Name:** Jessica Lee — Design Studio Package\n- **Value:** $7,500\n- **Stage:** New Lead\n- **Contact:** jessica.lee@design.studio (Los Angeles, CA)\n\nThe $7,500 estimate is based on typical design agency packages. Create this deal?` },
    ],
  },

  // ──────────────── 71-80. HIGHLEVEL-SPECIFIC FEATURES ──────────
  {
    trigger: 'how do i set up automations in highlevel',
    keywords: ['automations', 'workflow', 'set up automation', 'highlevel automation', 'triggers'],
    steps: [
      { type: 'text', text: `Great question! **HighLevel automations** (called **Workflows**) are one of the platform's most powerful features. Here's a quickstart:\n\n### 🔄 Key Automation Capabilities\n\n1. **Trigger-based workflows**\n   - New contact added → Send welcome SMS\n   - Form submitted → Tag contact + notify team\n   - Appointment booked → Send confirmation email\n   - Pipeline stage changed → Trigger follow-up sequence\n\n2. **Multi-step sequences**\n   - Day 1: SMS → Day 3: Email → Day 5: Voicemail drop\n   - If/then branching based on tag or activity\n\n3. **Integration triggers**\n   - Webhook received → Create contact\n   - API call → Update pipeline\n   - Zapier/Make integration → Sync with other tools\n\n### 💡 Quick Wins to Set Up Now\n- **Speed-to-lead automation:** When a Facebook/Google lead comes in, auto-send SMS within 60 seconds\n- **Follow-up nurture:** 5-email sequence for leads who don't respond within 3 days\n- **Pipeline watcher:** Notify you when a deal is stuck in the same stage for 7+ days\n\nWant me to help you identify which leads in your pipeline would benefit most from automated follow-ups?` },
    ],
  },
  {
    trigger: 'what highlevel features should i be using',
    keywords: ['highlevel features', 'features using', 'gohighlevel features', 'platform features', 'crm features'],
    steps: [
      { type: 'text', text: `Based on your current lead data and pipeline, here are the **HighLevel features** you should leverage most:\n\n### 📱 Already Using (via Copilot)\n- ✅ CRM & Contact management\n- ✅ Pipeline management\n- ✅ SMS & Email outreach\n- ✅ Lead scoring\n\n### 🚀 High-Impact Features to Activate\n\n**1. Workflow Automations**\n- Speed-to-lead auto-SMS for Facebook/Google leads\n- You have 5 Facebook leads who waited hours for first contact — automation fixes this\n\n**2. Reputation Management**\n- After closing deals like Olivia Anderson ($18K), automatically request Google reviews\n- Builds social proof for future leads\n\n**3. Calendar & Booking**\n- Emily Davis and Jessica Lee both booked demos — use HighLevel's calendar to manage these\n- Sends automatic reminders to reduce no-shows\n\n**4. Funnel Builder**\n- Create landing pages for each ad channel (Facebook, Google, LinkedIn)\n- Track source-specific conversion rates\n\n**5. Social Media Planner**\n- Schedule posts to stay top-of-mind with warm leads\n- Content marketing nurtures the 9 warm leads in your pipeline\n\n**6. Reporting Dashboard**\n- Track pipeline velocity and source ROI\n- See which team members close the most deals\n\nWant me to focus on setting up any of these?` },
    ],
  },
  {
    trigger: 'tell me about highlevel pricing',
    keywords: ['highlevel pricing', 'pricing', 'plans', 'how much', 'cost', 'subscription'],
    steps: [
      { type: 'text', text: `Here's a quick overview of **HighLevel's pricing tiers** (as of 2026):\n\n### 💰 Plans\n\n| Plan | Price | Best For |\n|------|-------|----------|\n| **Starter** | $97/mo | Solo entrepreneurs, small businesses |\n| **Unlimited** | $297/mo | Growing agencies, unlimited sub-accounts |\n| **SaaS Pro** | $497/mo | White-label SaaS, resell to clients |\n\n### 🎁 What's Included in All Plans\n- CRM & Pipeline management\n- SMS, Email, & calling\n- Workflow automations\n- Landing page & funnel builder\n- Calendar & booking\n- Reputation management\n- Mobile app\n\n### 🏢 Agency/Enterprise\n- White-label everything\n- Unlimited sub-accounts (Unlimited plan+)\n- Custom domains\n- API access\n- Dedicated support\n\n**Pro tip:** For agencies like Carlos Rodriguez, the Unlimited plan at $297/mo is a no-brainer — he can create sub-accounts for each of his clients and resell at $300-500/mo per client.\n\nWant me to factor pricing into your proposals for any of your current leads?` },
    ],
  },
  {
    trigger: 'how does highlevel compare to hubspot',
    keywords: ['compare hubspot', 'vs hubspot', 'hubspot', 'highlevel vs', 'comparison'],
    steps: [
      { type: 'text', text: `Great question! Here's how **HighLevel** compares to **HubSpot**:\n\n| Feature | HighLevel | HubSpot |\n|---------|-----------|----------|\n| **Starting Price** | $97/mo | $50/mo (free CRM) |\n| **All-in-one?** | Yes — CRM, funnels, SMS, email, calendar, automations | Yes but premium features cost $800-3,600/mo |\n| **SMS Built-in** | ✅ Yes | ❌ Needs integration |\n| **Funnel Builder** | ✅ Included | ❌ Needs $800+/mo tier |\n| **White Label** | ✅ SaaS Pro | ❌ Not available |\n| **Sub-accounts** | ✅ Unlimited ($297/mo) | ❌ Not available |\n| **Automations** | ✅ Unlimited | Limited on free/starter |\n| **Best For** | Agencies, SMBs, local businesses | Enterprise, B2B SaaS |\n| **Learning Curve** | Moderate | Steep |\n\n### 🏆 HighLevel Wins When:\n- You're an **agency** managing multiple clients\n- You need **SMS + funnels + CRM** in one platform\n- You want to **white-label** and resell\n- Your budget is $100-500/mo, not $3,000/mo\n\n### HubSpot Wins When:\n- You're enterprise B2B with complex sales cycles\n- You need deep analytics/attribution\n- You're already in the HubSpot ecosystem\n\nFor your leads — especially agency owners like Carlos Rodriguez and Rachel Thompson — HighLevel is often the better value proposition.` },
    ],
  },
  {
    trigger: 'explain snapshot feature in highlevel',
    keywords: ['snapshot', 'snapshots', 'highlevel snapshot', 'account snapshot', 'template'],
    steps: [
      { type: 'text', text: `**Snapshots** are one of HighLevel's most powerful agency features. Think of them as **complete account templates** you can clone:\n\n### 📸 What's a Snapshot?\nA Snapshot captures your entire sub-account setup:\n- ✅ Funnels & landing pages\n- ✅ Workflow automations\n- ✅ Email/SMS templates\n- ✅ Pipeline configurations\n- ✅ Calendar settings\n- ✅ Custom fields & tags\n- ✅ Form and survey designs\n\n### 🚀 How Agencies Use Them\n\n**1. Industry Templates**\nCreate a "Dental Office" Snapshot with:\n- Patient intake funnels\n- Appointment reminders\n- Review request workflows\n- Reactivation campaigns\n\n**2. Client Onboarding**\n- New client signs up → Load their industry Snapshot → Customize details → Go live in 30 minutes instead of 30 hours\n\n**3. Marketplace**\n- Sell your Snapshots on the HighLevel marketplace\n- Other agencies buy them at $297-997 each\n\n### 💡 For Your Pipeline\nCreate Snapshots for each vertical your leads are in:\n- **Amanda Foster** (real estate) → Real Estate Snapshot\n- **Daniel Garcia** (restaurant) → Restaurant Snapshot\n- **Olivia Anderson** (healthcare) → Healthcare Snapshot\n\nThis dramatically reduces onboarding time and increases your close rate on enterprise deals.` },
    ],
  },
  {
    trigger: 'how to use highlevel for my agency',
    keywords: ['agency', 'agency use', 'agency setup', 'agency highlevel', 'white label', 'saas mode'],
    steps: [
      { type: 'text', text: `Here's the **complete agency playbook** for HighLevel:\n\n### 🏗️ Setup (Week 1)\n1. **Get the Unlimited Plan** ($297/mo) — unlimited sub-accounts\n2. **White-label your login** — your logo, your domain (app.youragency.com)\n3. **Create Snapshots** for your top 3 client verticals\n4. **Set up your sales pipeline** (like the one I manage for you!)\n\n### 💰 Revenue Model\n| Model | Monthly Revenue Per Client |\n|-------|---------------------------|\n| Basic SaaS | $297-497/mo — Platform access only |\n| Managed Services | $997-2,997/mo — Platform + you run campaigns |\n| Done-for-You | $3,000-10,000/mo — Full service |\n\n**Example:** 20 clients at $497/mo = **$9,940/mo** on a $297 platform cost. That's a 33x ROI.\n\n### 📊 Using Your Current Pipeline\nLooking at your leads, here's how to position HighLevel:\n\n- **Carlos Rodriguez** (Agency, $8K deal) — He can resell HighLevel as a white-label SaaS to HIS clients\n- **Rachel Thompson** (Marketing agency) — Workflow automations save her team 20+ hours/week\n- **Amanda Foster** (Real estate) — Funnel builder + automated follow-ups for property leads\n\n### 🎯 Growth Strategy\n1. Close your current 8 deals ($110K pipeline)\n2. Create vertical-specific Snapshots from each successful client\n3. Use those case studies to attract similar clients\n4. Scale to 50+ sub-accounts within 6 months\n\nNeed help positioning HighLevel in your proposals? I can draft custom value props for each lead!` },
    ],
  },
  {
    trigger: 'what integrations does highlevel support',
    keywords: ['integrations', 'integrate', 'zapier', 'api', 'webhooks', 'connect', 'third party'],
    steps: [
      { type: 'text', text: `**HighLevel integrations** are extensive. Here's the full landscape:\n\n### 🔌 Native Integrations\n| Category | Integrations |\n|----------|-------------|\n| **Ads** | Facebook Ads, Google Ads, TikTok Ads |\n| **Social** | Facebook, Instagram, Google Business, TikTok |\n| **Payment** | Stripe, PayPal, Authorize.net |\n| **Calendar** | Google Calendar, Outlook, Zoom, Google Meet |\n| **Email** | Mailgun, SendGrid, SMTP, Gmail, Outlook |\n| **Phone/SMS** | Twilio, LC Phone (built-in) |\n| **Wordpress** | Direct plugin |\n| **eCommerce** | Shopify (via Zapier) |\n\n### 🔗 Middleware (Unlimited)\n- **Zapier** — 6,000+ app connections\n- **Make (Integromat)** — Advanced workflows\n- **Pabbly Connect** — Budget-friendly alternative\n\n### 🛠️ Developer Tools\n- **REST API** — Full CRUD on contacts, opportunities, conversations\n- **Webhooks** — Real-time event triggers\n- **Custom Actions** — Build your own workflow steps\n- **Marketplace Apps** — Extend with community-built tools\n\n### 💡 For Your Leads\n- **Lisa Wang** (tech.ai) — She'll want the API + webhook integrations for her AI stack\n- **Daniel Garcia** (restaurant) — Stripe + Google Business integration for reviews & payments\n- **Amanda Foster** (real estate) — Zillow + MLS integration via Zapier\n\nNeed help planning an integration for any specific lead?` },
    ],
  },
  {
    trigger: 'how to set up webhooks in highlevel',
    keywords: ['webhooks', 'webhook setup', 'webhook trigger', 'webhook endpoint'],
    steps: [
      { type: 'text', text: `Here's how to set up **Webhooks in HighLevel**:\n\n### 📡 Inbound Webhooks (External → HighLevel)\n1. Go to **Settings → Business Info → Integrations**\n2. Find **Inbound Webhook URL** — this is your unique endpoint\n3. Send a POST request with contact data:\n\`\`\`json\n{\n  "first_name": "John",\n  "last_name": "Doe",\n  "email": "john@example.com",\n  "phone": "+15551234567",\n  "tags": ["webhook-lead"]\n}\n\`\`\`\n4. New contact is auto-created in your CRM!\n\n### 📤 Outbound Webhooks (HighLevel → External)\n1. Open **Automations → Create Workflow**\n2. Add trigger (e.g., "Contact Created")\n3. Add action: **Webhook**\n4. Set URL, method (POST), and payload\n5. HighLevel sends data to your endpoint on every trigger\n\n### 🎯 Best Practices\n- **Always verify webhook signatures** for security\n- **Use queues** — don't process webhooks synchronously\n- **Set up retry logic** — webhooks can fail temporarily\n- **Monitor with logging** — track delivery/failure rates\n\n### Use Cases for Your Pipeline\n- Lead form on external site → Webhook → Auto-create contact + SMS\n- Deal closed → Webhook → Create invoice in QuickBooks\n- Appointment booked → Webhook → Send Zoom link\n\nThis Copilot itself uses the HighLevel API to manage your leads — webhooks are the event-driven version of the same system!` },
    ],
  },
  {
    trigger: 'how to track roi on my ad campaigns',
    keywords: ['roi', 'ad tracking', 'campaign roi', 'ad performance', 'tracking', 'attribution'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: '' }, toolOutput: {
        count: 18, sourceBreakdown: { 'Facebook Ads': 5, 'Google Ads': 4, 'LinkedIn': 3, 'Website Form': 3, 'Referral': 3 },
      }, thinkMs: 400 },
      { type: 'text', text: `📊 **Ad Campaign ROI Tracking in HighLevel**\n\nBased on your current lead data, here's how to calculate and improve ROI:\n\n### Your Current Source Metrics\n| Source | Leads | Pipeline Value | Cost (est.) | ROI |\n|--------|-------|---------------|-------------|-----|\n| Facebook Ads | 5 | $5,000 | ~$500 | ~10x potential |\n| Google Ads | 4 | $17,000 | ~$800 | ~21x potential |\n| LinkedIn | 3 | $35,000 | ~$1,200 | ~29x potential |\n| Referral | 3 | $43,000 | ~$0 | ♾️ |\n| Website | 3 | $23,000 | ~$200 | ~115x potential |\n\n### How to Track in HighLevel\n1. **UTM parameters** — Tag all ad links with utm_source, utm_medium, utm_campaign\n2. **HighLevel auto-captures** source from form submissions and ad integrations\n3. **Pipeline attribution** — Each deal traces back to the original source\n4. **Reporting tab** — Revenue by source, cost per lead, conversion rates\n\n### 💡 Insight From Your Data\n- **LinkedIn** has the highest single-deal value ($35K) but highest cost per lead\n- **Google Ads** gives the best balance of volume and deal size\n- **Referrals** are free and have the highest close rate — invest in a referral program!\n\nWant me to break down the numbers further or draft a strategy for any specific channel?` },
    ],
  },

  // ──────────────── 81-85. EDGE CASES & SPECIAL QUERIES ─────────
  {
    trigger: 'no',
    keywords: ['no', 'cancel', 'dont', 'nevermind', 'nah', 'reject', 'stop'],
    steps: [
      { type: 'text', text: `No problem! I've cancelled that action. 🙅‍♂️\n\nWhat else can I help you with? I'm here for lead management, pipeline updates, messaging, or analytics.` },
    ],
  },
  {
    trigger: 'undo',
    keywords: ['undo', 'revert', 'take back', 'rollback'],
    steps: [
      { type: 'text', text: `I can handle that! For safety, HighLevel Copilot asks for confirmation before every action. If something was already sent or updated, here's what I can do:\n\n- **SMS/Email sent** → I can't unsend, but I can send a follow-up correction\n- **Pipeline stage moved** → I can move it back to the previous stage\n- **Opportunity created** → I can update the details or value\n\nWhat specifically would you like to reverse?` },
    ],
  },
  {
    trigger: 'how many leads do i have total',
    keywords: ['total leads', 'how many leads', 'contact count', 'lead count', 'total contacts'],
    steps: [
      { type: 'tool', toolName: 'get_new_leads', toolInput: { hoursAgo: 8760 }, toolOutput: { count: 18 }, thinkMs: 400 },
      { type: 'text', text: `You have **18 total contacts** in your HighLevel CRM.\n\n**Breakdown:**\n- 🔥 **5 Hot leads** (score 80+) — Immediate action needed\n- 🟡 **9 Warm leads** (score 50-79) — Nurture this week\n- 🧊 **4 Cold leads** (score <50) — Re-engage or archive\n\n**By Source:**\n- Facebook Ads: 5 | Google Ads: 4 | LinkedIn: 3\n- Website Form: 3 | Referral: 3\n\n**With open deals:** 8 contacts ($110,500 pipeline)\n**Without deals:** 10 contacts (potential opportunity gap!)\n\nWant me to create opportunities for the 10 contacts who don't have deals yet?` },
    ],
  },
  {
    trigger: 'show leads from facebook',
    keywords: ['facebook leads', 'facebook contacts', 'fb leads', 'facebook ads leads'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'Facebook Ads' }, toolOutput: {
        count: 5, leads: [LEADS.sarah, LEADS.carlos, LEADS.alex, LEADS.daniel, LEADS.marcus],
      }, thinkMs: 450 },
      { type: 'text', text: `Found **5 leads from Facebook Ads**:\n\n| # | Name | Score | Status | Last Activity |\n|---|------|-------|--------|---------------|\n| 1 | 🔥 **Sarah Johnson** | 87 | Hot, has $5K deal | 2 hours ago |\n| 2 | 🟡 **Carlos Rodriguez** | 58 | Proposal sent, $8K | 3 days ago |\n| 3 | 🟡 **Marcus Hayes** | 55 | Interested | 2 days ago |\n| 4 | 🟡 **Daniel Garcia** | 53 | Small business | 1 day ago |\n| 5 | 🧊 **Alex Martinez** | 45 | Follow-up needed | 4 days ago |\n\n**Facebook Ads Performance:**\n- Total leads: 5\n- Total pipeline value: $13,000 (Sarah $5K + Carlos $8K)\n- Average lead score: 60 (Warm)\n- Average response time: Needs improvement — 3 of 5 haven't been contacted within 24h\n\n**#1 Issue:** Your Facebook leads aren't being contacted fast enough. Data shows Facebook leads that receive SMS within 5 minutes convert at 3x the rate.\n\n💡 I recommend setting up an automation: Facebook lead → auto-SMS within 60 seconds. Want me to help with the first messages?` },
    ],
  },
  {
    trigger: 'who are my referral leads',
    keywords: ['referral leads', 'referral contacts', 'referred leads', 'referrals'],
    steps: [
      { type: 'tool', toolName: 'search_leads', toolInput: { query: 'Referral' }, toolOutput: {
        count: 3, leads: [LEADS.james, LEADS.rachel, LEADS.olivia],
      }, thinkMs: 400 },
      { type: 'text', text: `Your **3 referral leads** — these are your highest-quality prospects:\n\n1. 🔥 **James Wilson** (Score: 92)\n   - Enterprise Package — $25,000 (Contacted stage)\n   - Chicago, IL | Referred by a partner\n\n2. 🟡 **Rachel Thompson** (Score: 68)\n   - Marketing Package — $4,500 (Contacted stage)\n   - Nashville, TN | Referred from industry network\n\n3. 🟡 **Olivia Anderson** (Score: 50)\n   - Healthcare Suite — $18,000 (Negotiation stage!)\n   - Atlanta, GA | Referred, high-value\n\n**Referral Stats:**\n- Total pipeline: **$47,500** (43% of your total pipeline!)\n- Average deal size: **$15,833** (highest of any source)\n- Close rate potential: Referrals close at 3-5x the rate of ads\n\n💡 **Action:** Your referrals are gold. James needs to move to Qualified, Olivia needs to close, and Rachel needs a compelling proposal. Want to work through them?` },
    ],
  },
];
