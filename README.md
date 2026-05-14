# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application that helps professionals automate everyday workplace tasks using AI. Draft emails, summarize meetings, plan tasks, run quick research, and chat with an AI copilot — all from a clean dashboard.

---

## 📌 Project Overview

The **AI Workplace Productivity Assistant** ("Workhub AI") is a single-workspace web app built around five AI-powered tools. It uses **structured prompts** on the server, returns **editable AI outputs** to the user, and ships with a built-in **Responsible AI disclaimer** so users always know to review what AI produces.

- Clean, modern, professional SaaS UI (Emerald Prestige theme)
- Sidebar navigation + dashboard layout
- Fully responsive (mobile → desktop)
- Real AI responses via the **Lovable AI Gateway** (Google Gemini)
- Threaded chat history, persisted in the browser (localStorage)

---

## ✨ Features

### 1. Smart Email Generator (`/email`)
Draft professional emails in any tone (formal, friendly, persuasive, concise) from a short brief. Output is editable before sending.

### 2. Meeting Notes Summarizer (`/summarizer`)
Paste a transcript or rough notes and get a structured markdown summary: overview, key points, decisions, action items, and open questions.

### 3. AI Task Planner (`/planner`)
Turn a goal into a prioritized, structured task list with owners, dependencies, and suggested timelines.

### 4. AI Research Assistant (`/research`)
Get a fast briefing on any topic with key points, considerations, and follow-up questions to explore.

### 5. AI Chatbot Interface (`/chat`)
Conversational copilot with **threaded chat history** saved in `localStorage`. Each thread has its own URL (`/chat/:threadId`) with **streaming AI responses**.

### Cross-cutting features
- ✅ Modern dashboard UI with hero section and tool cards
- ✅ Collapsible sidebar navigation
- ✅ Responsive design (mobile-first)
- ✅ Structured server-side prompts (system + user template per tool)
- ✅ Editable AI outputs (textarea + copy + regenerate)
- ✅ Responsible AI disclaimer on every output
- ✅ Emerald Prestige color theme with semantic design tokens

---

## 🛠️ Tools & Tech Stack

| Layer | Technology |
|---|---|
| Framework | **TanStack Start v1** (React 19, file-based routing, SSR) |
| Build tool | **Vite 7** |
| Language | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS v4** + semantic tokens in `src/styles.css` |
| UI components | **shadcn/ui** (Radix primitives) + **lucide-react** icons |
| AI SDK | **Vercel AI SDK** (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) |
| AI provider | **Lovable AI Gateway** → `google/gemini-3-flash-preview` |
| Notifications | **sonner** (toast) |
| Persistence | Browser **localStorage** (chat threads) |
| Runtime | Edge / Cloudflare Workers (via TanStack Start) |
| Package manager | **bun** |

### Project structure (key files)
```
src/
├── routes/
│   ├── __root.tsx               # Root layout (sidebar shell)
│   ├── index.tsx                # Dashboard
│   ├── email.tsx                # Smart Email Generator
│   ├── summarizer.tsx           # Meeting Notes Summarizer
│   ├── planner.tsx              # AI Task Planner
│   ├── research.tsx             # AI Research Assistant
│   ├── chat.tsx                 # Chat layout (thread list)
│   ├── chat.index.tsx           # Chat landing
│   ├── chat.$threadId.tsx       # Threaded chat with streaming
│   └── api/
│       ├── generate.ts          # Server route — one-shot generation
│       └── chat.ts              # Server route — streaming chat
├── components/
│   ├── AppSidebar.tsx           # Sidebar nav
│   ├── AiToolForm.tsx           # Reusable input/output tool form
│   ├── PageHeader.tsx
│   ├── ResponsibleAi.tsx        # Disclaimer
│   ├── ai-elements/             # Conversation, message, prompt-input
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── ai-gateway.ts            # Lovable AI Gateway provider
│   ├── ai-client.ts             # Browser → /api/generate helper
│   └── threads.ts               # localStorage chat threads
└── styles.css                   # Design tokens (Emerald Prestige theme)
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js 20+** and **Bun** installed (`curl -fsSL https://bun.sh/install | bash`)
- A **Lovable AI Gateway** API key (auto-provisioned when you build on Lovable; for local dev, set `LOVABLE_API_KEY`)

### 1. Install dependencies
```bash
bun install
```

### 2. Configure environment variables
Create a `.env` file in the project root:
```bash
LOVABLE_API_KEY=your_lovable_api_key_here
```
> ⚠️ Keep this key **server-side only**. Never expose it with a `VITE_` prefix.

### 3. Run the dev server
```bash
bun run dev
```
Open http://localhost:5173 — the app boots with the dashboard.

### 4. Build for production
```bash
bun run build
```

### 5. Deploy
The app targets **edge runtimes** (Cloudflare Workers via `wrangler.jsonc`). Publish directly from Lovable, or deploy the build output to your edge host of choice.

---

## 🧠 How the AI integration works

- The browser calls `/api/generate` (one-shot) or `/api/chat` (streaming).
- Each server route uses `createLovableAiGatewayProvider(LOVABLE_API_KEY)` to talk to `https://ai.gateway.lovable.dev/v1`.
- Default model: `google/gemini-3-flash-preview`.
- Each tool sends a **structured system prompt + templated user prompt** so outputs are predictable and easy to edit.
- Errors (`429` rate limit, `402` credits exhausted) are surfaced to the UI via toast.

---

## ⚖️ Responsible AI

Every AI output is shown with a disclaimer reminding users that AI can be inaccurate or biased. For sensitive topics (HR, legal, medical, financial), the assistant is instructed to recommend verifying with a qualified human. **Always review AI outputs before using them in real workplace decisions.**

---

## 📄 License

MIT — use freely for personal and commercial projects.
