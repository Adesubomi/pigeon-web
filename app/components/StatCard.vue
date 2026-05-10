<template>
  <Card class="p-4">
    <p class="mb-1 text-[11px] font-medium text-muted-foreground">{{ label }}</p>
    <p class="font-mono text-[22px] font-semibold leading-none tracking-tight text-foreground">{{ value }}</p>
    <p class="mt-1.5 flex items-center text-[11px] text-muted-foreground" :class="subClass">
      <span v-if="dotClass" class="mr-1.5 size-1.5 shrink-0 rounded-full" :class="dotClass" />
      {{ sub }}
    </p>
  </Card>
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
