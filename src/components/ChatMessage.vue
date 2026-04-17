<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ActionCard from './ActionCard.vue';
import LeadCard from './LeadCard.vue';

const props = defineProps<{
  message: any;
  isStreaming?: boolean;
}>();

const emit = defineEmits<{
  approve: [];
  reject: [];
}>();

// Extract text content from message parts (AI SDK v6 format)
const textContent = computed(() => {
  if (!props.message.parts) return '';
  return props.message.parts
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('');
});

// Render markdown safely
const renderedContent = computed(() => {
  const content = textContent.value;
  if (!content || props.message.role === 'user') return content;
  const raw = marked.parse(content, { async: false }) as string;
  return DOMPurify.sanitize(raw);
});

// Extract tool invocations from message parts (AI SDK v6 format)
const toolInvocations = computed(() => {
  if (!props.message.parts) return [];
  return props.message.parts
    .filter((p: any) => p.type === 'dynamic-tool' || (typeof p.type === 'string' && p.type.startsWith('tool-')))
    .map((p: any) => ({
      toolName: p.toolName ?? (typeof p.type === 'string' ? p.type.replace(/^tool-/, '') : 'unknown'),
      toolCallId: p.toolCallId,
      state: p.state,
      input: p.input,
      output: p.output,
      errorText: p.errorText,
    }));
});

// Detect pending confirmations or executed actions from tool results
const pendingActions = computed(() =>
  toolInvocations.value.filter(
    (t: any) => t.state === 'output-available' && t.output?.status === 'pending_confirmation'
  )
);

const completedActions = computed(() =>
  toolInvocations.value.filter(
    (t: any) => t.state === 'output-available' && (t.output?.status === 'sent' || t.output?.status === 'created' || t.output?.status === 'updated')
  )
);

// Detect lead lists in tool results
const leadResults = computed(() => {
  const leads: any[] = [];
  for (const t of toolInvocations.value) {
    if (t.state === 'output-available' && t.output?.leads) {
      leads.push(...t.output.leads);
    }
  }
  return leads;
});

// Detect score results
const scoreResults = computed(() =>
  toolInvocations.value
    .filter((t: any) => t.state === 'output-available' && t.output?.score !== undefined)
    .map((t: any) => t.output)
);

// Tool call in-progress indicators
const pendingToolCalls = computed(() =>
  toolInvocations.value.filter((t: any) => t.state === 'input-available' || t.state === 'input-streaming')
);

const toolDisplayNames: Record<string, string> = {
  get_new_leads: 'Searching for new leads',
  get_lead_details: 'Fetching lead details',
  search_leads: 'Searching contacts',
  get_lead_score: 'Calculating lead score',
  send_sms: 'Preparing SMS',
  send_email: 'Preparing email',
  get_pipelines: 'Loading pipelines',
  search_opportunities: 'Searching opportunities',
  create_opportunity: 'Creating opportunity',
  update_opportunity_stage: 'Updating pipeline stage',
};

function getToolDisplayName(name: string) {
  return toolDisplayNames[name] ?? name;
}
</script>

<template>
  <div
    class="animate-slide-up"
    :class="[message.role === 'user' ? 'flex justify-end' : 'flex justify-start']"
  >
    <!-- User message -->
    <div v-if="message.role === 'user'" class="max-w-[80%]">
      <div class="px-4 py-2.5 rounded-2xl bg-ghl-accent text-white text-sm">
        {{ textContent }}
      </div>
    </div>

    <!-- Assistant message -->
    <div v-else class="w-full max-w-3xl space-y-3">
      <!-- In-progress tool calls -->
      <div v-for="tc in pendingToolCalls" :key="tc.toolCallId ?? tc.toolName" class="flex items-center gap-2 text-xs text-ghl-text-muted py-1">
        <span class="inline-block w-3 h-3 border-2 border-ghl-accent border-t-transparent rounded-full animate-spin"></span>
        {{ getToolDisplayName(tc.toolName) }}...
      </div>

      <!-- Lead cards (if leads were fetched) -->
      <div v-if="leadResults.length > 0" class="space-y-2">
        <LeadCard
          v-for="lead in leadResults.slice(0, 8)"
          :key="lead.id"
          :lead="lead"
          :score="scoreResults.find((s: any) => s.contactId === lead.id)"
        />
      </div>

      <!-- Pending action confirmations -->
      <ActionCard
        v-for="(action, i) in pendingActions"
        :key="'pending-' + i"
        :action="action.output"
        status="pending"
        @approve="emit('approve')"
        @reject="emit('reject')"
      />

      <!-- Completed actions -->
      <ActionCard
        v-for="(action, i) in completedActions"
        :key="'done-' + i"
        :action="action.output"
        status="completed"
      />

      <!-- Text content -->
      <div
        v-if="renderedContent"
        :class="['prose-chat text-sm text-ghl-text-primary', props.isStreaming && 'streaming-cursor']"
        v-html="renderedContent"
      />
    </div>
  </div>
</template>
