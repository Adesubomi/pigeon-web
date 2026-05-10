<template>
  <div
    class="event-list-item group flex w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-card px-3.5 py-3 transition-colors hover:border-sand-400 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
    role="button"
    tabindex="0"
    @click="$emit('open', event)"
    @keydown.enter="$emit('open', event)"
    @keydown.space.prevent="$emit('open', event)"
  >
    <Badge
      variant="outline"
      :class="cn('min-w-8 shrink-0 justify-center border-transparent px-1 py-0 font-mono text-[9px] font-semibold', methodClasses[event.method])"
    >
      {{ event.method }}
    </Badge>

    <span class="min-w-0 flex-1 truncate font-mono text-[11px] text-sand-700 transition-colors group-hover:text-brand-500">{{ event.path }}</span>

    <div class="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground">
      <span>{{ event.time }}</span>
      <span class="text-sand-400">{{ event.size }}</span>
    </div>

    <PhCaretRight class="size-3 text-sand-400 shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'

interface EventListEvent {
  id?: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  time: string
  size: string
}

defineProps<{
  event: EventListEvent
}>()

defineEmits<{
  open: [event: EventListEvent]
}>()

const methodClasses = {
  GET: 'bg-[#163126] text-[#9ae6b4]',
  POST: 'bg-[#3b3323] text-[#ffe47a]',
  PUT: 'bg-[#1c2c49] text-[#9fbfff]',
  PATCH: 'bg-[#2d2244] text-[#d8b4fe]',
  DELETE: 'bg-[#3a241f] text-[#ffad9f]',
  HEAD: 'bg-[#163126] text-[#9ae6b4]',
  OPTIONS: 'bg-[#3c2035] text-[#ff8bd1]',
} satisfies Record<EventListEvent['method'], string>
</script>
