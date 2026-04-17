<script setup lang="ts">
import { ref } from 'vue';
import type { ToolInvocation } from '../composables/useChat';

defineProps<{
  toolInvocations: ToolInvocation[];
}>();

const expandedIndex = ref<number | null>(null);

function toggle(i: number) {
  expandedIndex.value = expandedIndex.value === i ? null : i;
}

const toolIcons: Record<string, string> = {
  get_new_leads: '🔍',
  get_lead_details: '👤',
  search_leads: '🔎',
  get_lead_score: '📊',
  send_sms: '📱',
  send_email: '📧',
  get_pipelines: '📋',
  search_opportunities: '🎯',
  create_opportunity: '➕',
  update_opportunity_stage: '📈',
};

function getIcon(name: string) {
  return toolIcons[name] ?? '⚡';
}

function getShortResult(inv: ToolInvocation): string {
  if (inv.state === 'input-streaming' || inv.state === 'input-available') return 'Running...';
  if (!inv.result) return 'Running...';
  const r = inv.result as any;
  if (r.error) return `❌ ${r.error}`;
  if (r.count !== undefined) return `Found ${r.count} result(s)`;
  if (r.score !== undefined) return `Score: ${r.score} (${r.bucket})`;
  if (r.status === 'pending_confirmation') return '⏳ Awaiting approval';
  if (r.status === 'sent') return '✅ Sent';
  if (r.status === 'created') return '✅ Created';
  if (r.status === 'updated') return '✅ Updated';
  if (r.pipelines) return `${r.pipelines.length} pipeline(s)`;
  return 'Done';
}
</script>

<template>
  <div class="w-80 border-l border-ghl-border bg-ghl-bg-secondary flex flex-col shrink-0 overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-ghl-border shrink-0">
      <h2 class="text-sm font-semibold text-ghl-text-primary flex items-center gap-2">
        🧠 Reasoning
      </h2>
      <p class="text-[10px] text-ghl-text-muted mt-0.5">Tool calls & agent activity</p>
    </div>

    <!-- Tool call list -->
    <div class="flex-1 overflow-y-auto px-3 py-3 space-y-2">
      <div v-if="toolInvocations.length === 0" class="text-xs text-ghl-text-muted text-center py-8">
        Agent activity will appear here as you chat.
      </div>

      <div
        v-for="(inv, i) in toolInvocations"
        :key="i"
        class="rounded-lg border border-ghl-border bg-ghl-bg-primary overflow-hidden animate-slide-up"
      >
        <!-- Row -->
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-ghl-bg-tertiary transition-colors"
          @click="toggle(i)"
        >
          <span class="text-sm">{{ getIcon(inv.toolName) }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-ghl-text-primary truncate">{{ inv.toolName }}</div>
            <div class="text-[10px] text-ghl-text-muted truncate">{{ getShortResult(inv) }}</div>
          </div>
          <span
            v-if="inv.state === 'input-available' || inv.state === 'input-streaming'"
            class="w-3 h-3 border-2 border-ghl-accent border-t-transparent rounded-full animate-spin shrink-0"
          />
          <span v-else class="text-[10px] text-ghl-success shrink-0">✓</span>
        </button>

        <!-- Expanded detail -->
        <div v-if="expandedIndex === i" class="border-t border-ghl-border px-3 py-2 space-y-2 animate-fade-in">
          <div>
            <div class="text-[10px] font-semibold uppercase text-ghl-text-muted tracking-wider mb-1">Input</div>
            <pre class="text-[10px] text-ghl-text-secondary bg-ghl-bg-secondary rounded p-2 overflow-x-auto max-h-24 scrollbar-thin">{{ JSON.stringify(inv.args, null, 2) }}</pre>
          </div>
          <div v-if="inv.result">
            <div class="text-[10px] font-semibold uppercase text-ghl-text-muted tracking-wider mb-1">Output</div>
            <pre class="text-[10px] text-ghl-text-secondary bg-ghl-bg-secondary rounded p-2 overflow-x-auto max-h-32 scrollbar-thin">{{ JSON.stringify(inv.result, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
