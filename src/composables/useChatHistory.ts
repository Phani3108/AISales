import { ref, computed } from 'vue';

export interface StoredConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: any[]; // UIMessage[]
}

const STORAGE_KEY = 'copilot-conversations';
const ACTIVE_KEY = 'copilot-active-id';
const MAX_CONVERSATIONS = 50;

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function load(): StoredConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(data: StoredConversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.slice(0, MAX_CONVERSATIONS)));
  } catch {
    // localStorage full — silently fail
  }
}

// Shared reactive state (module-level singleton)
const conversations = ref<StoredConversation[]>(load());
const activeId = ref<string>(localStorage.getItem(ACTIVE_KEY) ?? '');

export function useChatHistory() {
  const activeConversation = computed(() =>
    conversations.value.find(c => c.id === activeId.value) ?? null,
  );

  function setActive(id: string) {
    activeId.value = id;
    localStorage.setItem(ACTIVE_KEY, id);
  }

  function createConversation(): string {
    const id = uid();
    conversations.value = [
      { id, title: 'New Chat', createdAt: Date.now(), updatedAt: Date.now(), messages: [] },
      ...conversations.value,
    ];
    setActive(id);
    persist(conversations.value);
    return id;
  }

  function saveMessages(id: string, messages: any[]) {
    const idx = conversations.value.findIndex(c => c.id === id);
    if (idx === -1) return;

    const conv = { ...conversations.value[idx] };
    conv.messages = JSON.parse(JSON.stringify(messages));
    conv.updatedAt = Date.now();

    // Auto-title from first user message
    if (conv.title === 'New Chat' && messages.length > 0) {
      const firstUser = messages.find((m: any) => m.role === 'user');
      if (firstUser) {
        const text =
          firstUser.parts
            ?.filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('') ?? '';
        if (text) {
          conv.title = text.length > 50 ? text.slice(0, 50) + '…' : text;
        }
      }
    }

    const updated = [...conversations.value];
    updated[idx] = conv;
    conversations.value = updated;
    persist(conversations.value);
  }

  function removeConversation(id: string) {
    conversations.value = conversations.value.filter(c => c.id !== id);
    persist(conversations.value);
    if (activeId.value === id) {
      if (conversations.value.length > 0) {
        setActive(conversations.value[0].id);
      } else {
        createConversation();
      }
    }
  }

  // Bootstrap: ensure there's always an active conversation
  if (!activeId.value || !conversations.value.find(c => c.id === activeId.value)) {
    if (conversations.value.length > 0) {
      setActive(conversations.value[0].id);
    } else {
      createConversation();
    }
  }

  return {
    conversations,
    activeId,
    activeConversation,
    createConversation,
    setActive,
    saveMessages,
    removeConversation,
  };
}
