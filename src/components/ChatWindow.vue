<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue';
import { useCopilotChat } from '../composables/useChat';
import ChatMessage from './ChatMessage.vue';
import ReasoningPanel from './ReasoningPanel.vue';
import TypingIndicator from './TypingIndicator.vue';

const {
  messages,
  input,
  handleSubmit,
  isLoading,
  showReasoning,
  allToolInvocations,
  sendQuickPrompt,
  error,
  // Phase 2
  retry,
  newChat,
  switchConversation,
  deleteConversation,
  sidebarOpen,
  conversations,
  activeConversationId,
} = useCopilotChat();

const messagesContainer = ref<HTMLElement | null>(null);
const userScrolledUp = ref(false);

const suggestedPrompts = [
  { icon: '📊', text: 'Any new leads today?' },
  { icon: '🎯', text: 'What should I do next?' },
  { icon: '📋', text: 'Show my pipeline' },
  { icon: '📈', text: 'Top priority leads' },
];

// Hide typing indicator once text starts streaming
const hasStreamingText = computed(() => {
  if (!isLoading.value) return false;
  const last = messages.value[messages.value.length - 1];
  if (!last || last.role !== 'assistant') return false;
  return last.parts?.some((p: any) => p.type === 'text' && p.text?.length > 0) ?? false;
});

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  async () => {
    if (!userScrolledUp.value) {
      await nextTick();
      scrollToBottom();
    }
  },
);

// Also scroll on streaming content updates
watch(
  () => {
    const last = messages.value[messages.value.length - 1];
    if (!last?.parts) return 0;
    let len = last.parts.length;
    for (const p of last.parts) {
      if ((p as any).type === 'text') len += ((p as any).text?.length ?? 0);
    }
    return len;
  },
  async () => {
    if (!userScrolledUp.value) {
      await nextTick();
      scrollToBottom();
    }
  },
);

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function onScroll() {
  if (!messagesContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  userScrolledUp.value = scrollHeight - scrollTop - clientHeight > 100;
}

function onSubmit(e: Event) {
  e.preventDefault();
  if (!input.value.trim() || isLoading.value) return;
  userScrolledUp.value = false;
  handleSubmit(e);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSubmit(e);
  }
}

function handleApproveAction() {
  sendQuickPrompt('Yes, go ahead and send it.');
}

function handleRejectAction() {
  sendQuickPrompt('No, cancel that action.');
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
</script>

<template>
  <div class="flex h-full w-full relative">
    <!-- Sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-30 transition-opacity"
      @click="sidebarOpen = false"
    />

    <!-- Conversation sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 bg-ghl-bg-secondary border-r border-ghl-border flex flex-col transition-transform duration-200"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-ghl-border shrink-0">
        <span class="text-sm font-semibold text-ghl-text-primary">Conversations</span>
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-ghl-text-muted hover:text-ghl-text-primary hover:bg-ghl-bg-tertiary transition-colors"
          @click="sidebarOpen = false"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- New Chat button -->
      <div class="px-3 py-2 shrink-0">
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-ghl-border text-ghl-text-secondary hover:text-ghl-text-primary hover:border-ghl-accent hover:bg-ghl-accent/10 transition-all"
          @click="newChat"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Chat
        </button>
      </div>

      <!-- Conversation list -->
      <div class="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        <button
          v-for="conv in conversations"
          :key="conv.id"
          class="w-full group flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors"
          :class="conv.id === activeConversationId ? 'bg-ghl-accent/15 text-ghl-text-primary' : 'text-ghl-text-secondary hover:bg-ghl-bg-tertiary hover:text-ghl-text-primary'"
          @click="switchConversation(conv.id)"
        >
          <span class="text-xs opacity-60 shrink-0">💬</span>
          <div class="flex-1 min-w-0">
            <div class="truncate text-[13px]">{{ conv.title }}</div>
            <div class="text-[10px] text-ghl-text-muted">{{ relativeTime(conv.updatedAt) }}</div>
          </div>
          <button
            class="shrink-0 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 text-ghl-text-muted hover:text-ghl-danger transition-all"
            @click.stop="deleteConversation(conv.id)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </button>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <div class="flex flex-1 flex-col min-w-0">
      <!-- Header -->
      <header class="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-ghl-border bg-ghl-bg-secondary shrink-0">
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Sidebar toggle -->
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-ghl-text-muted hover:text-ghl-text-primary hover:bg-ghl-bg-tertiary transition-colors"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div class="w-8 h-8 rounded-lg bg-ghl-accent flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
          <div>
            <h1 class="text-base font-semibold text-ghl-text-primary">HighLevel Copilot</h1>
            <p class="text-xs text-ghl-text-muted hidden sm:block">AI-powered lead management</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- New Chat shortcut -->
          <button
            class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-ghl-border text-ghl-text-secondary hover:text-ghl-text-primary hover:border-ghl-accent hover:bg-ghl-accent/10 transition-colors"
            @click="newChat"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
          <!-- Reasoning toggle -->
          <button
            class="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-ghl-border text-ghl-text-secondary hover:text-ghl-text-primary hover:border-ghl-text-muted transition-colors"
            @click="showReasoning = !showReasoning"
          >
            <span>{{ showReasoning ? '🔍' : '🔎' }}</span>
            {{ showReasoning ? 'Hide' : 'Show' }} Reasoning
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-3 sm:px-4 py-6 space-y-1"
        @scroll="onScroll"
      >
        <!-- Welcome state -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto px-4">
          <div class="w-16 h-16 rounded-2xl bg-ghl-accent/20 flex items-center justify-center mb-5">
            <span class="text-3xl">🤖</span>
          </div>
          <h2 class="text-xl font-semibold text-ghl-text-primary mb-2">Welcome to HighLevel Copilot</h2>
          <p class="text-sm text-ghl-text-secondary mb-8">
            I can help you manage leads, analyze your pipeline, and take actions — all through conversation.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
            <button
              v-for="prompt in suggestedPrompts"
              :key="prompt.text"
              class="flex items-center gap-2 px-4 py-3 text-sm text-left rounded-xl border border-ghl-border bg-ghl-bg-tertiary hover:border-ghl-accent hover:bg-ghl-accent/10 transition-all text-ghl-text-secondary hover:text-ghl-text-primary"
              @click="sendQuickPrompt(prompt.text)"
            >
              <span>{{ prompt.icon }}</span>
              <span>{{ prompt.text }}</span>
            </button>
          </div>
        </div>

        <!-- Message list -->
        <template v-for="(message, idx) in messages" :key="message.id">
          <ChatMessage
            :message="message"
            :is-streaming="message.role === 'assistant' && idx === messages.length - 1 && isLoading"
            @approve="handleApproveAction"
            @reject="handleRejectAction"
          />
        </template>

        <!-- Typing indicator (hidden once text starts streaming) -->
        <TypingIndicator v-if="isLoading && messages.length > 0 && !hasStreamingText" />
      </div>

      <!-- Error banner with retry -->
      <div v-if="error" class="mx-3 sm:mx-4 mb-2 px-4 py-2.5 rounded-lg bg-ghl-danger/10 border border-ghl-danger/30 flex items-center justify-between gap-3">
        <span class="text-sm text-ghl-danger">⚠️ {{ error.message || 'Something went wrong.' }}</span>
        <button
          class="shrink-0 px-3 py-1 text-xs font-medium rounded-md bg-ghl-danger/20 text-ghl-danger hover:bg-ghl-danger/30 transition-colors"
          @click="retry"
        >
          Retry
        </button>
      </div>

      <!-- Input area -->
      <form
        class="border-t border-ghl-border bg-ghl-bg-secondary px-3 sm:px-4 py-3 shrink-0"
        @submit="onSubmit"
      >
        <div class="flex items-end gap-2 sm:gap-3 max-w-3xl mx-auto">
          <div class="flex-1 relative">
            <textarea
              v-model="input"
              rows="1"
              placeholder="Ask about your leads, pipeline, or next actions..."
              class="w-full resize-none rounded-xl border border-ghl-border bg-ghl-bg-primary px-4 py-3 text-sm text-ghl-text-primary placeholder:text-ghl-text-muted focus:outline-none focus:border-ghl-accent focus:ring-1 focus:ring-ghl-accent/50 transition-colors"
              :disabled="isLoading"
              @keydown="onKeydown"
              @input="autoResize"
            />
          </div>
          <button
            type="submit"
            :disabled="!input.trim() || isLoading"
            class="shrink-0 w-10 h-10 rounded-xl bg-ghl-accent hover:bg-ghl-accent-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>

      <!-- Copyright footer -->
      <div class="px-3 sm:px-4 py-2 text-center text-[11px] text-ghl-text-muted shrink-0">
        © {{ new Date().getFullYear() }} Built by
        <a href="https://linkedin.com/in/phani-marupaka" target="_blank" rel="noopener noreferrer" class="text-ghl-accent hover:underline">Phani Marupaka</a>
      </div>
    </div>

    <!-- Reasoning Panel (desktop only) -->
    <ReasoningPanel
      v-if="showReasoning"
      :tool-invocations="allToolInvocations"
      class="hidden md:flex"
    />
  </div>
</template>
