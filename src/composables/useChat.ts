import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { ref, computed, watch, shallowRef } from 'vue';
import { useChatHistory } from './useChatHistory';

export interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  state: string;
}

// Module-level singleton — survives component re-mounts, swappable per conversation
const _chatRef = shallowRef<InstanceType<typeof Chat<UIMessage>> | null>(null);
let _boundConvId = '';

function buildChat(saved?: UIMessage[]): InstanceType<typeof Chat<UIMessage>> {
  return new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    ...(saved?.length ? { messages: saved } : {}),
  });
}

export function useCopilotChat() {
  const history = useChatHistory();
  const showReasoning = ref(true);
  const input = ref('');
  const sidebarOpen = ref(false);

  // Ensure a Chat instance exists for the active conversation
  function ensureChat(): InstanceType<typeof Chat<UIMessage>> {
    const convId = history.activeId.value;
    if (!_chatRef.value || _boundConvId !== convId) {
      try { _chatRef.value?.stop(); } catch { /* noop */ }
      const conv = history.conversations.value.find(c => c.id === convId);
      _chatRef.value = buildChat(conv?.messages?.length ? (conv.messages as UIMessage[]) : undefined);
      _boundConvId = convId;
    }
    return _chatRef.value;
  }

  // React to conversation switches
  watch(() => history.activeId.value, () => ensureChat(), { immediate: true });

  // Reactive state derived from the current Chat instance
  const messages = computed(() => _chatRef.value?.messages ?? []);
  const status = computed(() => _chatRef.value?.status ?? ('ready' as const));
  const error = computed(() => _chatRef.value?.error ?? null);
  const isLoading = computed(() => status.value === 'submitted' || status.value === 'streaming');

  // Persist messages when streaming finishes
  function persistNow() {
    const msgs = messages.value;
    if (msgs.length > 0 && history.activeId.value) {
      history.saveMessages(history.activeId.value, msgs);
    }
  }

  watch(status, (cur, prev) => {
    if (prev === 'streaming' && cur === 'ready') persistNow();
  });

  // ── Actions ──────────────────────────────────────────────────

  async function handleSubmit(_e?: Event) {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    try {
      await ensureChat().sendMessage({ text });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
    persistNow();
  }

  async function sendQuickPrompt(text: string) {
    input.value = '';
    try {
      await ensureChat().sendMessage({ text });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
    persistNow();
  }

  async function retry() {
    const msgs = messages.value;
    const lastUser = [...msgs].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    const text =
      lastUser.parts
        ?.filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('') ?? '';
    if (!text) return;
    try {
      await ensureChat().sendMessage({ text });
    } catch (err) {
      console.error('Retry failed:', err);
    }
    persistNow();
  }

  function newChat() {
    try { _chatRef.value?.stop(); } catch { /* noop */ }
    history.createConversation();
    // The watch on activeId fires → ensureChat() creates a fresh Chat
  }

  function switchConversation(id: string) {
    try { _chatRef.value?.stop(); } catch { /* noop */ }
    history.setActive(id);
    sidebarOpen.value = false;
  }

  function deleteConversation(id: string) {
    if (_boundConvId === id) {
      try { _chatRef.value?.stop(); } catch { /* noop */ }
      _chatRef.value = null;
      _boundConvId = '';
    }
    history.removeConversation(id);
  }

  // ── Tool Invocations ─────────────────────────────────────────

  const allToolInvocations = computed(() => {
    const invocations: ToolInvocation[] = [];
    for (const msg of messages.value) {
      if (!msg.parts) continue;
      for (const part of msg.parts) {
        const p = part as any;
        if (p.type === 'dynamic-tool' || (typeof p.type === 'string' && p.type.startsWith('tool-'))) {
          const toolName = p.toolName ?? (typeof p.type === 'string' ? p.type.replace(/^tool-/, '') : 'unknown');
          invocations.push({
            toolName,
            args: p.input ?? {},
            result: p.output ?? undefined,
            state: p.state ?? 'input-available',
          });
        }
      }
    }
    return invocations;
  });

  return {
    messages,
    input,
    handleSubmit,
    isLoading,
    status,
    error,
    showReasoning,
    allToolInvocations,
    sendQuickPrompt,
    stop: () => { try { _chatRef.value?.stop(); } catch { /* noop */ } },
    // Phase 2
    retry,
    newChat,
    switchConversation,
    deleteConversation,
    sidebarOpen,
    conversations: history.conversations,
    activeConversationId: history.activeId,
  };
}
