<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  lead: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    source?: string;
    tags?: string[];
    dateAdded?: string;
    lastActivity?: string;
  };
  score?: {
    score: number;
    bucket: string;
    factors?: { category: string; points: number; reason: string }[];
  };
}>();

const expanded = ref(false);

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getBucketColor(bucket?: string) {
  if (bucket === 'Hot') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (bucket === 'Warm') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

function getBucketEmoji(bucket?: string) {
  if (bucket === 'Hot') return '🔥';
  if (bucket === 'Warm') return '🟡';
  return '🧊';
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const ms = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(ms / 3600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
</script>

<template>
  <div
    class="rounded-xl border border-ghl-border bg-ghl-bg-tertiary overflow-hidden transition-all duration-200 cursor-pointer hover:border-ghl-text-muted/50"
    @click="expanded = !expanded"
  >
    <!-- Compact row -->
    <div class="flex items-center gap-3 px-3 py-2.5">
      <!-- Avatar -->
      <div class="w-9 h-9 rounded-full bg-ghl-accent/20 flex items-center justify-center text-xs font-semibold text-ghl-accent shrink-0">
        {{ getInitials(lead.name) }}
      </div>

      <!-- Name + Source -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-ghl-text-primary truncate">{{ lead.name }}</div>
        <div class="text-xs text-ghl-text-muted truncate">
          {{ lead.source }}<span v-if="lead.dateAdded"> · {{ timeAgo(lead.dateAdded) }}</span>
        </div>
      </div>

      <!-- Score badge -->
      <div
        v-if="score"
        class="shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border"
        :class="getBucketColor(score.bucket)"
      >
        {{ getBucketEmoji(score.bucket) }} {{ score.score }}
      </div>

      <!-- Chevron -->
      <svg
        class="w-4 h-4 text-ghl-text-muted transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': expanded }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Expanded details -->
    <div v-if="expanded" class="px-3 pb-3 pt-1 border-t border-ghl-border space-y-2 animate-fade-in">
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div v-if="lead.email" class="text-ghl-text-secondary">
          📧 <span class="text-ghl-text-primary">{{ lead.email }}</span>
        </div>
        <div v-if="lead.phone" class="text-ghl-text-secondary">
          📱 <span class="text-ghl-text-primary">{{ lead.phone }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="lead.tags?.length" class="flex flex-wrap gap-1">
        <span
          v-for="tag in lead.tags"
          :key="tag"
          class="px-2 py-0.5 text-[10px] rounded-full bg-ghl-bg-primary border border-ghl-border text-ghl-text-muted"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Score factors -->
      <div v-if="score?.factors" class="space-y-1 pt-1">
        <div class="text-[10px] font-semibold uppercase text-ghl-text-muted tracking-wider">Score Breakdown</div>
        <div v-for="f in score.factors" :key="f.category" class="flex items-center justify-between text-xs">
          <span class="text-ghl-text-secondary">{{ f.category }}</span>
          <span class="text-ghl-text-primary font-medium">+{{ f.points }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
