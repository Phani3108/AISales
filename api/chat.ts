import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SYSTEM_PROMPT } from '../server/agent/prompts.js';
import { createTools } from '../server/agent/tools.js';
import { handleDemoRequest } from '../server/demo/demoHandler.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check if OpenAI key is available — if not, use demo mode
    const apiKey = process.env.OPENAI_API_KEY;
    const useDemo = !apiKey || apiKey.startsWith('sk-your') || apiKey === '';

    if (useDemo) {
      return handleDemoRequest(req);
    }

    const body = (await req.json()) as { messages?: UIMessage[] };
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tools = createTools();

    // Convert UIMessages to model messages for the LLM
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(8),
      temperature: 0.3,
      onError: (event) => {
        console.error('Stream error:', event.error);
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
