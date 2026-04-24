# 🤖 AI Sales Copilot

> A ChatGPT-style AI assistant embedded inside for conversational lead management, pipeline actions, and sales intelligence.

**Built by [Phani Marupaka](https://linkedin.com/in/phani-marupaka)**

---

## ✨ Features

- 💬 **Conversational Lead Management** — Search, view, and score leads through natural language
- 📊 **AI Lead Scoring** — 0-100 composite score with factor breakdown (recency, source, engagement, pipeline, tags)
- 📧 **Action Execution** — Send emails & SMS with confirmation before dispatch
- 🎯 **Pipeline Management** — View pipelines, search opportunities, create & move deals across stages
- 🧠 **Reasoning Panel** — Real-time visibility into tool calls and agent decision-making
- 💾 **Conversation Persistence** — Chat history saved to localStorage with multi-conversation support
- 🔄 **Error Recovery** — Retry button on failures, graceful error handling across all tools
- ▋ **Streaming Cursor** — Blinking cursor during response streaming for polished UX
- 📱 **Mobile Responsive** — Slide-out sidebar, auto-grow textarea, responsive layout
- 🔌 **Embeddable Widget** — Drop-in `<script>` tag for any website with FAB launcher
- 🛡️ **Security** — XSS sanitization (DOMPurify), URL scheme validation, API key guards
- 🎭 **Demo Mode** — 85+ pre-built conversations with realistic streaming — no API key required

## 🛠️ Tech Stack

- ⚡ **Frontend** — Vue.js 3 + TypeScript + Vite
- 🎨 **Styling** — Tailwind CSS v4 (HighLevel dark theme)
- 🧠 **AI** — Vercel AI SDK v6 + OpenAI GPT-4o (or demo mode)
- 🔧 **Backend** — Node.js edge-compatible API handler
- 🏗️ **Architecture** — 3-layer: Conversation → Decision → Action
- 🔀 **Mock/Live** — Factory pattern swaps mock ↔ real HighLevel APIs

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (demo mode — no API key needed!)
npm run dev
# → Frontend: http://localhost:5173
# → API: http://localhost:3001

# 3. (Optional) For live AI, set your OpenAI key in .env
cp .env.example .env
# Edit .env → OPENAI_API_KEY=sk-...
```

## 🎭 Demo Mode

When no OpenAI API key is configured, the Copilot runs in **demo mode** with 85+ pre-built conversations covering:

- 👋 Greetings & onboarding
- 🔍 Lead search & details (by name, source, tags)
- 📊 Lead scoring with factor breakdowns
- 🚨 Priority & next-action recommendations
- 📱 SMS drafting with confirmation flow
- 📧 Email drafting (proposals, follow-ups, re-engagement)
- 📋 Pipeline views, stage moves, deal creation
- 📈 Analytics (source comparison, forecast, daily summary)
- 🔄 Multi-step workflows (full workup, onboarding, closing strategies)
- 🏢 HighLevel features (automations, snapshots, pricing, integrations, webhooks, agency setup)

## 📁 Project Structure

```
├── src/                    # Vue.js frontend
│   ├── components/         # ChatWindow, ChatMessage, LeadCard, ActionCard, ReasoningPanel
│   ├── composables/        # useChat (AI SDK), useChatHistory (persistence)
│   └── assets/             # Tailwind CSS + animations
├── server/                 # Backend
│   ├── agent/              # System prompt, 10 AI tools (Zod schemas)
│   ├── demo/               # Demo conversations (85+) & streaming handler
│   ├── scoring/            # Lead scoring engine
│   └── services/           # Mock + real HighLevel service implementations
├── api/                    # Vercel serverless entry point
├── widget/                 # Embeddable chat widget script
└── public/                 # Static assets
```

## 🏛️ Architecture

```
┌─────────────────────────────────────────┐
│         Conversation Layer              │
│   Vue.js 3 + AI SDK v6 Chat class      │
│   Multi-turn, streaming, persistence    │
├─────────────────────────────────────────┤
│         Decision Layer                  │
│   GPT-4o / Demo Engine                  │
│   Lead analysis, scoring, reasoning     │
├─────────────────────────────────────────┤
│         Action Layer                    │
│   10 Tools: search, score, SMS, email,  │
│   pipeline CRUD, opportunities          │
│   Factory: mock ↔ real HighLevel APIs   │
└─────────────────────────────────────────┘
```

## 📜 License

**All Rights Reserved © 2026 [Phani Marupaka](https://linkedin.com/in/phani-marupaka)**

This project is proprietary. No part of this codebase may be reproduced, distributed, or transmitted in any form without prior written permission. See [LICENSE](LICENSE) for details.
