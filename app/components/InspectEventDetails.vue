<template>
  <section class="flex h-full min-w-0 flex-col overflow-hidden bg-white">
    <header v-if="event" class="shrink-0 border-b border-border px-5 py-5">
      <div class="flex min-w-0 items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[13px] font-semibold text-navy">{{ event.path }}</p>
          <p class="truncate font-mono text-[10px] text-sand-500">{{ endpoint?.name }}</p>
        </div>

        <Button
          v-if="showClose"
          variant="ghost"
          size="icon"
          class="size-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close event details"
          title="Close event details"
          @click="$emit('close')"
        >
          <PhX class="size-3.5" />
        </Button>
      </div>
    </header>

    <ScrollArea v-if="event" class="flex-1">
      <div class="event-detail-content">
        <Card class="p-3.5">
          <div class="flex min-w-0 items-center gap-2.5 border-b border-secondary pb-3">
            <Badge
              variant="outline"
              :class="cn('min-w-8 justify-center border-transparent px-1 py-0 font-mono text-[9px] font-semibold', methodClasses[event.method])"
            >
              {{ event.method }}
            </Badge>
            <p class="m-0 min-w-0 font-mono text-[13px] leading-relaxed text-foreground [overflow-wrap:anywhere]">{{ event.path }}</p>
          </div>

          <div class="grid grid-cols-3 gap-2 pt-3">
            <div class="min-w-0">
              <span class="mb-1 block text-[10px] text-muted-foreground">Received</span>
              <strong class="block font-mono text-[11px] font-medium leading-snug text-foreground [overflow-wrap:anywhere]">{{ event.receivedAt }}</strong>
            </div>
            <div class="min-w-0">
              <span class="mb-1 block text-[10px] text-muted-foreground">Size</span>
              <strong class="block font-mono text-[11px] font-medium leading-snug text-foreground [overflow-wrap:anywhere]">{{ event.size }}</strong>
            </div>
            <div class="min-w-0">
              <span class="mb-1 block text-[10px] text-muted-foreground">Source</span>
              <strong class="block font-mono text-[11px] font-medium leading-snug text-foreground [overflow-wrap:anywhere]">{{ event.source }}</strong>
            </div>
          </div>
        </Card>

        <Tabs :model-value="activeTab" class="items-start" @update:model-value="value => activeTab = value as 'body' | 'headers'">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card v-if="activeTab === 'body'" class="overflow-hidden">
          <div class="payload-header">
            <p class="panel-section-title">Body</p>
            <Badge variant="outline" class="font-mono text-[9px] text-muted-foreground">JSON</Badge>
          </div>

          <div class="code-viewer">
            <Button
              variant="outline"
              size="icon"
              class="absolute right-2.5 top-2.5 z-10 size-7 border-brand-100/20 bg-navy/80 text-brand-100 hover:bg-brand-500 hover:text-white"
              :disabled="!hasBody"
              :aria-label="copyLabel"
              :title="copyLabel"
              @click="copyBody"
            >
              <Transition name="copy-icon" mode="out-in">
                <PhCheck v-if="copied" key="json-check" class="size-3.5 text-success-600" weight="bold" />
                <PhCopy v-else key="json-copy" class="size-3.5" />
              </Transition>
            </Button>
            <pre v-if="hasBody" class="payload-block"><code>{{ formattedPayload }}</code></pre>
            <Empty v-else class="min-h-[180px] p-12 text-brand-100/60">
              <EmptyTitle class="font-mono text-[11px] text-brand-100/70">No body</EmptyTitle>
            </Empty>
          </div>
        </Card>

        <Card v-else class="overflow-hidden">
          <div class="payload-header">
            <p class="panel-section-title">Headers</p>
            <Badge variant="outline" class="rounded-full font-mono text-[9px] text-muted-foreground">{{ headerRows.length }}</Badge>
          </div>

          <Table class="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead class="w-[38%]">Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="header in headerRows" :key="header.key">
                <TableCell class="font-mono text-[11px] text-sand-700 [overflow-wrap:anywhere]">{{ header.key }}</TableCell>
                <TableCell class="font-mono text-[11px] text-foreground [overflow-wrap:anywhere]">{{ header.value }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </ScrollArea>

    <Empty v-else class="flex-1 bg-white">
      <EmptyTitle>Select an event</EmptyTitle>
    </Empty>
  </section>
</template>

<script setup lang="ts">
import { PhCheck, PhCopy, PhX } from '@phosphor-icons/vue'
import type { Endpoint, EndpointEvent } from '@/composables/useEndpoints'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = withDefaults(defineProps<{
  endpoint: Endpoint | null
  event: EndpointEvent | null
  showClose?: boolean
}>(), {
  showClose: false,
})

defineEmits<{
  close: []
}>()

const activeTab = ref<'body' | 'headers'>('body')
const { copied, copyText } = useCopyAction({
  errorMessage: 'Could not copy JSON body',
  resetAfterMs: 2000,
})

const methodClasses = {
  GET: 'bg-[#163126] text-[#9ae6b4]',
  POST: 'bg-[#3b3323] text-[#ffe47a]',
  PUT: 'bg-[#1c2c49] text-[#9fbfff]',
  PATCH: 'bg-[#2d2244] text-[#d8b4fe]',
  DELETE: 'bg-[#3a241f] text-[#ffad9f]',
  HEAD: 'bg-[#163126] text-[#9ae6b4]',
  OPTIONS: 'bg-[#3c2035] text-[#ff8bd1]',
} satisfies Record<EndpointEvent['method'], string>

const rawPayload = computed(() => props.event?.payload.trim() ?? '')
const hasBody = computed(() => rawPayload.value.length > 0)
const formattedPayload = computed(() => {
  if (!hasBody.value) return ''

  try {
    return JSON.stringify(JSON.parse(rawPayload.value), null, 2)
  } catch {
    return rawPayload.value
  }
})
const headerRows = computed(() => {
  if (!props.event) return []

  return Object.entries(props.event.headers)
    .map(([key, value]) => ({ key, value }))
    .sort((left, right) => left.key.localeCompare(right.key))
})
const copyLabel = computed(() => {
  if (!hasBody.value) return 'No body to copy'
  return copied.value ? 'Copied' : 'Copy JSON'
})

async function copyBody() {
  if (!hasBody.value) return

  await copyText(formattedPayload.value)
}
</script>

<style scoped>
.event-detail-content {
  min-height: 100%;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-section-title {
  font-size: 10px;
  font-weight: 500;
  color: #9e9c96;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
}

.payload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 0.5px solid #e2e0d8;
}

.code-viewer {
  position: relative;
  min-height: 180px;
  background: #1a1a2e;
}

.payload-block {
  color: #e8e4ff;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
  overflow: auto;
  padding: 14px 48px 14px 14px;
  white-space: pre-wrap;
}

.copy-icon-enter-active,
.copy-icon-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.copy-icon-enter-from {
  opacity: 0;
  transform: scale(0.72) rotate(-10deg);
}

.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.72) rotate(10deg);
}
</style>
