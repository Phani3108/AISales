# 🤖 AI Sales Copilot

> A ChatGPT-style AI assistant embedded inside HighLevel CRM for conversational lead management, pipeline actions, and sales intelligence.

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

## 🛠️ Tech Stack

- ⚡ **Frontend** — Vue.js 3 + TypeScript + Vite
- 🎨 **Styling** — Tailwind CSS v4 (HighLevel dark theme)
- 🧠 **AI** — Vercel AI SDK v6 + OpenAI GPT-4o
- 🔧 **Backend** — Node.js edge-compatible API handler
- 🏗️ **Architecture** — 3-layer: Conversation → Decision → Action
- 🔀 **Mock/Live** — Factory pattern swaps mock ↔ real HighLevel APIs

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set OPENAI_API_KEY in .env

# 3. Start dev server
npm run dev
# → Frontend: http://localhost:5173
# → API: http://localhost:3001
```

## 📁 Project Structure

```
├── src/                    # Vue.js frontend
│   ├── components/         # ChatWindow, ChatMessage, LeadCard, ActionCard, ReasoningPanel
│   ├── composables/        # useChat (AI SDK), useChatHistory (persistence)
│   └── assets/             # Tailwind CSS + animations
├── server/                 # Backend
│   ├── agent/              # System prompt, 10 AI tools (Zod schemas)
│   ├── scoring/            # Lead scoring engine
│   └── services/           # Mock + real HighLevel service implementations
├── api/                    # Vercel serverless entry point
├── widget/                 # Embeddable chat widget script
└── public/                 # Static assets
```

## 📜 License

**All Rights Reserved © 2026 [Phani Marupaka](https://linkedin.com/in/phani-marupaka)**

This project is proprietary. No part of this codebase may be reproduced, distributed, or transmitted in any form without prior written permission. See [LICENSE](LICENSE) for details.
