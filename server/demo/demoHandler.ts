// ──────────────────────────────────────────────────────────────
// Demo Streaming Handler — streams pre-built conversations
// without needing an OpenAI key. Uses the AI SDK's
// createUIMessageStream + createUIMessageStreamResponse to
// produce a wire-compatible SSE response.
// ──────────────────────────────────────────────────────────────

import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from 'ai';
import { DEMO_CONVERSATIONS, type DemoStep } from './demoConversations.js';

// Simple keyword-based matching: pick the best conversation for the user's input
function matchConversation(userText: string): DemoStep[] | null {
  const t = userText.toLowerCase().trim();

  // Try exact-prefix match first
  for (const conv of DEMO_CONVERSATIONS) {
    const trigger = conv.trigger.toLowerCase();
    if (t === trigger || t.startsWith(trigger) || trigger.startsWith(t)) {
      return conv.steps;
    }
  }

  // Then keyword scoring
  let best: { score: number; steps: DemoStep[] } | null = null;
  for (const conv of DEMO_CONVERSATIONS) {
    const keywords = conv.keywords;
    let score = 0;
    for (const kw of keywords) {
      if (t.includes(kw.toLowerCase())) score++;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, steps: conv.steps };
    }
  }
  if (best) return best.steps;

  // Fallback
  return null;
}

const FALLBACK_TEXT = `I can help you with a wide range of tasks in HighLevel! Here are some things you can ask me:

- **📊 "Any new leads today?"** — I'll fetch your latest contacts
- **🎯 "What should I do next?"** — I'll analyze and prioritize your leads
- **📋 "Show my pipeline"** — View all stages and opportunities
- **📧 "Send a follow-up email to Sarah"** — Draft and send communications
- **📈 "Score my leads"** — AI-powered lead scoring with factor breakdown
- **🔍 "Search for leads from Google Ads"** — Filter contacts by source or tags
- **➕ "Create an opportunity for Mike Chen"** — Manage your pipeline deals

Just ask in plain English and I'll take care of the rest!`;

export async function handleDemoRequest(req: Request): Promise<Response> {
  const body = (await req.json()) as { messages?: any[] };
  const messages = body.messages ?? [];

  // Find the last user message
  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
  let userText = '';
  if (lastUser) {
    if (lastUser.parts) {
      userText = lastUser.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    } else if (lastUser.content) {
      userText = typeof lastUser.content === 'string' ? lastUser.content : '';
    }
  }

  const steps = matchConversation(userText);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      if (!steps) {
        // Fallback response — just stream text
        writer.write({ type: 'start' });
        writer.write({ type: 'start-step' });
        const id = 'text_fallback';
        writer.write({ type: 'text-start', id });
        for (const word of FALLBACK_TEXT.split(' ')) {
          writer.write({ type: 'text-delta', id, delta: word + ' ' });
          await sleep(18);
        }
        writer.write({ type: 'text-end', id });
        writer.write({ type: 'finish-step' });
        writer.write({ type: 'finish', finishReason: 'stop' });
        return;
      }

      writer.write({ type: 'start' });

      let textCounter = 0;
      let toolCounter = 0;

      for (const step of steps) {
        writer.write({ type: 'start-step' });

        if (step.type === 'tool') {
          const toolCallId = `tc_demo_${++toolCounter}`;
          // Show tool call
          writer.write({
            type: 'tool-input-available',
            toolCallId,
            toolName: step.toolName!,
            input: step.toolInput ?? {},
          });
          await sleep(step.thinkMs ?? 400);
          // Show tool result
          writer.write({
            type: 'tool-output-available',
            toolCallId,
            output: step.toolOutput ?? {},
          });
          await sleep(80);
        }

        if (step.type === 'text' && step.text) {
          const id = `text_${++textCounter}`;
          writer.write({ type: 'text-start', id });
          // Stream word by word for realistic feel
          const words = step.text.split(' ');
          for (let i = 0; i < words.length; i++) {
            const suffix = i < words.length - 1 ? ' ' : '';
            writer.write({ type: 'text-delta', id, delta: words[i] + suffix });
            await sleep(step.charDelayMs ?? 15);
          }
          writer.write({ type: 'text-end', id });
        }

        writer.write({ type: 'finish-step' });
      }

      writer.write({ type: 'finish', finishReason: 'stop' });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
