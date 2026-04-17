<script setup lang="ts">
const props = defineProps<{
  action: {
    status?: string;
    action?: string;
    to?: string;
    phone?: string;
    email?: string;
    message?: string;
    subject?: string;
    body?: string;
    name?: string;
    contact?: string;
    opportunity?: any;
    value?: number;
    fromStage?: string;
    toStage?: string;
  };
  status: 'pending' | 'completed';
}>();

const emit = defineEmits<{
  approve: [];
  reject: [];
}>();

function getActionIcon(action?: string) {
  const icons: Record<string, string> = {
    send_sms: '📱',
    send_email: '📧',
    create_opportunity: '🎯',
    update_stage: '📋',
  };
  return icons[action ?? ''] ?? '⚡';
}

function getActionLabel(action?: string) {
  const labels: Record<string, string> = {
    send_sms: 'Send SMS',
    send_email: 'Send Email',
    create_opportunity: 'Create Opportunity',
    update_stage: 'Move Pipeline Stage',
  };
  return labels[action ?? ''] ?? 'Action';
}
</script>

<template>
  <div
    class="rounded-xl border overflow-hidden transition-all duration-200"
    :class="[
      status === 'completed'
        ? 'border-ghl-success/30 bg-ghl-success/5'
        : 'border-ghl-warning/30 bg-ghl-warning/5'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 px-4 py-2.5 border-b"
      :class="status === 'completed' ? 'border-ghl-success/20' : 'border-ghl-warning/20'"
    >
      <span class="text-base">{{ getActionIcon(action.action) }}</span>
      <span class="text-sm font-medium text-ghl-text-primary">
        {{ status === 'completed' ? '✅' : '⏳' }}
        {{ getActionLabel(action.action) }}
      </span>
      <span v-if="status === 'completed'" class="ml-auto text-xs text-ghl-success font-medium">
        Completed
      </span>
    </div>

    <!-- Content preview -->
    <div class="px-4 py-3 text-sm space-y-1.5">
      <div v-if="action.to" class="text-ghl-text-secondary">
        <strong class="text-ghl-text-primary">To:</strong> {{ action.to }}
        <span v-if="action.phone" class="text-ghl-text-muted ml-1">({{ action.phone }})</span>
        <span v-if="action.email" class="text-ghl-text-muted ml-1">({{ action.email }})</span>
      </div>
      <div v-if="action.contact" class="text-ghl-text-secondary">
        <strong class="text-ghl-text-primary">Contact:</strong> {{ action.contact }}
      </div>
      <div v-if="action.subject" class="text-ghl-text-secondary">
        <strong class="text-ghl-text-primary">Subject:</strong> {{ action.subject }}
      </div>
      <div v-if="action.message || action.body" class="text-ghl-text-secondary bg-ghl-bg-primary/50 rounded-lg p-2.5 text-xs mt-2 leading-relaxed">
        "{{ action.message || action.body }}"
      </div>
      <div v-if="action.name" class="text-ghl-text-secondary">
        <strong class="text-ghl-text-primary">Deal:</strong> {{ action.name }}
      </div>
      <div v-if="action.value" class="text-ghl-text-secondary">
        <strong class="text-ghl-text-primary">Value:</strong> ${{ action.value.toLocaleString() }}
      </div>
    </div>

    <!-- Approve / Reject buttons (only for pending) -->
    <div v-if="status === 'pending'" class="flex items-center gap-2 px-4 py-2.5 border-t border-ghl-warning/20">
      <button
        class="flex-1 py-2 rounded-lg text-sm font-medium bg-ghl-success/20 text-ghl-success hover:bg-ghl-success/30 transition-colors"
        @click="emit('approve')"
      >
        ✅ Approve
      </button>
      <button
        class="flex-1 py-2 rounded-lg text-sm font-medium bg-ghl-danger/10 text-ghl-danger hover:bg-ghl-danger/20 transition-colors"
        @click="emit('reject')"
      >
        ❌ Reject
      </button>
    </div>
  </div>
</template>
