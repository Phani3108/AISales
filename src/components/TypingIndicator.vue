<template>
  <div class="flex items-center gap-2 py-2 px-1">
    <div class="flex items-center gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 rounded-full bg-ghl-text-muted"
        :style="{ animation: `bounce-dot 1.2s ease-in-out ${(i - 1) * 0.2}s infinite` }"
      />
    </div>
    <span class="text-xs text-ghl-text-muted">Thinking...</span>
  </div>
</template>
