<template>
  <div class="stat-card">
    <p class="stat-label">{{ label }}</p>
    <p class="stat-value">{{ value }}</p>
    <p class="stat-sub" :class="subClass">
      <span v-if="dotClass" class="status-dot" :class="dotClass"></span>
      {{ sub }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  sub?: string
  subClass?: string
  dotClass?: string
}>()
</script>

<style scoped>
.stat-card {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  padding: 16px 18px;
}
.stat-label { font-size: 11px; color: #9e9c96; font-weight: 500; margin-bottom: 5px; }
.stat-value { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; font-family: 'IBM Plex Mono', monospace; line-height: 1; color: #1a1a2e; }
.stat-sub   { font-size: 11px; color: #9e9c96; margin-top: 5px; display: flex; align-items: center; }

.status-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
}
</style>
