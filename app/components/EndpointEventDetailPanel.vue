<link rel="stylesheet" href="../assets/css/main.css">
<template>
  <section class="flex h-full flex-col overflow-hidden">
    <header class="px-5 py-5 border-b border-sand-200 flex-shrink-0">
      <div class="flex items-center justify-between gap-3">
        <Button variant="outline" size="icon" class="size-8 shrink-0 text-muted-foreground hover:text-foreground" :aria-label="backLabel" @click="navigateTo(backPath)">
          <PhArrowLeft class="size-3.5" />
        </Button>

        <div class="min-w-0 flex-1 text-center">
          <p class="text-[13px] font-semibold text-navy truncate">{{ event?.path ?? 'Event details' }}</p>
          <p class="text-[10px] text-sand-500 font-mono truncate">{{ endpoint?.name }}</p>
        </div>

        <Button variant="outline" size="icon" class="size-8 shrink-0 text-muted-foreground hover:text-foreground" aria-label="Close event details" @click="navigateTo(closePath)">
          <PhX class="size-3.5" />
        </Button>
      </div>
    </header>

    <div v-if="event" class="event-detail-scroll">
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

          <div class="mt-3 flex items-center gap-2 border-t border-secondary pt-3">
            <Button
              variant="outline"
              size="sm"
              class="h-8"
              :class="{ 'border-brand-500/25 bg-accent text-accent-foreground': copiedCurl }"
              :aria-label="curlLabel"
              :title="curlLabel"
              @click="copyCurl"
            >
              <PhCode class="size-3.5 shrink-0" />
              {{ copiedCurl ? 'Copied' : 'Copy cURL' }}
            </Button>

            <Button
              size="sm"
              class="h-8 bg-brand-500 text-white hover:bg-brand-600"
              :class="{ 'bg-brand-600': published }"
              :aria-label="publishLabel"
              :title="publishLabel"
              @click="publishEvent"
            >
              <PhBroadcast class="size-3.5 shrink-0" />
              {{ published ? 'Published' : 'Publish' }}
            </Button>
          </div>
        </Card>

        <Tabs :model-value="activeTab" class="items-start" @update:model-value="value => setTab(value as 'body' | 'headers')">
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
              <PhCopy class="size-3.5" />
            </Button>
            <pre v-if="hasBody" class="payload-block"><code>{{ formattedPayload }}</code></pre>
            <div v-else class="empty-body">
              <p>No body</p>
            </div>
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
                <TableCell class="font-mono text-[11px] text-sand-700 [overflow-wrap:anywhere]">
                    <button
                      class="header-copy-cell"
                      :class="{ copied: copiedHeaderCell === headerCopyId(header.key, 'key') }"
                      :aria-label="headerCopyLabel(header.key, 'key')"
                      :title="headerCopyLabel(header.key, 'key')"
                      @click="copyHeaderCell(header.key, header.key, 'key')"
                    >
                      {{ header.key }}
                    </button>
                </TableCell>
                <TableCell class="font-mono text-[11px] text-foreground [overflow-wrap:anywhere]">
                    <button
                      class="header-copy-cell"
                      :class="{ copied: copiedHeaderCell === headerCopyId(header.key, 'value') }"
                      :aria-label="headerCopyLabel(header.key, 'value')"
                      :title="headerCopyLabel(header.key, 'value')"
                      @click="copyHeaderCell(header.value, header.key, 'value')"
                    >
                      {{ header.value }}
                    </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2 text-sand-500 p-10 text-center">
      <p class="text-xs">Event not found</p>
      <Button variant="link" size="sm" class="h-auto px-0 py-0 text-[11px] text-brand-500" @click="navigateTo(backPath)">
        Back to endpoint
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PhArrowLeft,
  PhBroadcast,
  PhCode,
  PhCopy,
  PhX,
} from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const route = useRoute()
const router = useRouter()
const { getEndpoint, getEvent, getEventContext } = useEndpoints()

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const isDashboardActivityEventRoute = computed(() => route.path.startsWith('/dashboard/activity/events/'))
const isEventLogRoute = computed(() => route.path.startsWith('/events/'))
const requestedEventId = computed(() => typeof route.params.event_id === 'string' ? route.params.event_id : '')
const explicitEndpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : '')
const eventContext = computed(() => {
  if (explicitEndpointId.value && requestedEventId.value) {
    const endpoint = getEndpoint(explicitEndpointId.value)
    const event = getEvent(explicitEndpointId.value, requestedEventId.value)
    return endpoint && event ? { endpoint, event } : null
  }

  return requestedEventId.value ? getEventContext(requestedEventId.value) : null
})
const endpoint = computed(() => eventContext.value?.endpoint ?? null)
const event = computed(() => eventContext.value?.event ?? null)
const endpointId = computed(() => endpoint.value?.id ?? explicitEndpointId.value)
const activeTab = computed(() => route.query.tab === 'headers' ? 'headers' : 'body')
const copied = ref(false)
const copiedCurl = ref(false)
const copiedHeaderCell = ref('')
const published = ref(false)
const methodClasses = {
  GET: 'bg-[#163126] text-[#9ae6b4]',
  POST: 'bg-[#3b3323] text-[#ffe47a]',
  PUT: 'bg-[#1c2c49] text-[#9fbfff]',
  PATCH: 'bg-[#2d2244] text-[#d8b4fe]',
  DELETE: 'bg-[#3a241f] text-[#ffad9f]',
  HEAD: 'bg-[#163126] text-[#9ae6b4]',
  OPTIONS: 'bg-[#3c2035] text-[#ff8bd1]',
} satisfies Record<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS', string>
const rawPayload = computed(() => event.value?.payload.trim() ?? '')
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
  if (!event.value) return []

  return Object.entries(event.value.headers)
    .map(([key, value]) => ({ key, value }))
    .sort((left, right) => left.key.localeCompare(right.key))
})
const eventUrl = computed(() => {
  if (!event.value) return ''
  if (/^https?:\/\//i.test(event.value.path)) return event.value.path

  const baseUrl = endpoint.value?.url.replace(/\/+$/, '') ?? ''
  const path = event.value.path.startsWith('/') ? event.value.path : `/${event.value.path}`

  return `${baseUrl}${path}`
})
const curlCommand = computed(() => {
  if (!event.value) return ''

  const parts = [
    `curl -X ${event.value.method} ${shellQuote(eventUrl.value)}`,
    ...headerRows.value.map(header => `  -H ${shellQuote(`${header.key}: ${header.value}`)}`),
  ]

  if (hasBody.value) {
    parts.push(`  --data-raw ${shellQuote(rawPayload.value)}`)
  }

  return parts.join(' \\\n')
})
const copyLabel = computed(() => {
  if (!hasBody.value) return 'No body to copy'
  return copied.value ? 'Copied JSON' : 'Copy JSON'
})
const curlLabel = computed(() => copiedCurl.value ? 'Copied cURL command' : 'Copy cURL command')
const publishLabel = computed(() => published.value ? 'Event published' : 'Publish event')
const backPath = computed(() => {
  if (isDashboardActivityEventRoute.value) return '/dashboard/activity'
  if (isEventLogRoute.value) return '/events'
  if (isDashboardRoute.value) return endpointId.value ? `/dashboard/endpoints/${endpointId.value}` : '/dashboard'
  return endpointId.value ? `/endpoints/${endpointId.value}` : '/endpoints'
})
const closePath = computed(() => {
  if (isEventLogRoute.value) return '/events'
  return isDashboardRoute.value ? '/dashboard' : '/endpoints'
})
const backLabel = computed(() => isEventLogRoute.value || isDashboardActivityEventRoute.value ? 'Back to event log' : 'Back to endpoint details')

type HeaderCellKind = 'key' | 'value'

function setTab(tab: 'body' | 'headers') {
  router.replace({
    path: route.path,
    query: tab === 'body' ? {} : { tab },
  })
}

async function copyBody() {
  if (!hasBody.value) return

  await navigator.clipboard.writeText(formattedPayload.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

async function copyCurl() {
  if (!curlCommand.value) return

  await navigator.clipboard.writeText(curlCommand.value)
  copiedCurl.value = true
  window.setTimeout(() => {
    copiedCurl.value = false
  }, 1200)
}

function publishEvent() {
  if (!event.value) return

  published.value = true
  window.setTimeout(() => {
    published.value = false
  }, 1400)
}

function headerCopyId(headerKey: string, kind: HeaderCellKind) {
  return `${kind}:${headerKey}`
}

function headerCopyLabel(headerKey: string, kind: HeaderCellKind) {
  return copiedHeaderCell.value === headerCopyId(headerKey, kind)
    ? `Copied ${headerKey} header ${kind}`
    : `Copy ${headerKey} header ${kind}`
}

async function copyHeaderCell(text: string, headerKey: string, kind: HeaderCellKind) {
  await navigator.clipboard.writeText(text)
  copiedHeaderCell.value = headerCopyId(headerKey, kind)
  window.setTimeout(() => {
    if (copiedHeaderCell.value === headerCopyId(headerKey, kind)) copiedHeaderCell.value = ''
  }, 1200)
}

function shellQuote(value: string) {
  return `'${value.replace(/'/g, `'\\''`)}'`
}
</script>

<style scoped>
.panel-icon-btn {
  width: 30px;
  height: 30px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888780;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}
.panel-icon-btn:hover { color: #1a1a2e; }

.event-detail-scroll {
  flex: 1;
  overflow-y: auto;
}

.event-detail-content {
  min-height: 100%;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-summary-card {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  overflow: hidden;
}

.event-summary-card { padding: 14px; }

.event-request-line {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding-bottom: 12px;
  border-bottom: 0.5px solid #f0eee8;
}

.event-path {
  min-width: 0;
  color: #1a1a2e;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
  overflow-wrap: anywhere;
}

.detail-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding-top: 12px;
}

.metric-cell {
  min-width: 0;
}
.metric-cell span {
  display: block;
  color: #9e9c96;
  font-size: 10px;
  margin-bottom: 3px;
}
.metric-cell strong {
  display: block;
  color: #1a1a2e;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.event-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 0.5px solid #f0eee8;
}

.event-action-btn {
  min-width: 0;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  padding: 0 10px;
  color: #5f5e5a;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: background 0.1s, border-color 0.1s, color 0.1s, box-shadow 0.1s;
}
.event-action-btn:hover,
.event-action-btn:focus-visible,
.event-action-btn.copied {
  border-color: rgba(83, 74, 183, 0.22);
  background: #f5f4f0;
  color: #534ab7;
}
.event-action-btn.primary {
  border-color: #534ab7;
  background: #534ab7;
  color: white;
  box-shadow: 0 1px 2px rgba(26, 26, 46, 0.08);
}
.event-action-btn.primary:hover,
.event-action-btn.primary:focus-visible,
.event-action-btn.primary.published {
  border-color: #3d2fa3;
  background: #3d2fa3;
  color: white;
}
.event-action-btn:focus-visible {
  outline: 2px solid rgba(83, 74, 183, 0.18);
  outline-offset: 2px;
}

.detail-panel {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
}

.body-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.headers-panel {
  overflow: hidden;
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

.tab-list {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  width: fit-content;
  padding: 3px;
  border: 0.5px solid #e2e0d8;
  background: #f5f4f0;
  border-radius: 10px;
}
.tab-btn {
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 5px 13px;
  color: #5f5e5a;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.1s, color 0.1s;
}
.tab-btn:hover { background: white; }
.tab-btn.active {
  background: white;
  color: #1a1a2e;
  box-shadow: 0 1px 2px rgba(26, 26, 46, 0.08);
}

.payload-format {
  border: 0.5px solid #e2e0d8;
  border-radius: 6px;
  padding: 2px 6px;
  color: #9e9c96;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
}

.header-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  border: 0.5px solid #e2e0d8;
  border-radius: 999px;
  color: #9e9c96;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
}

.method-badge {
  display: inline-flex;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
  padding: 1px 4px;
  border-radius: 4px;
  min-width: 32px;
}
.method-badge.get { background: #163126; color: #9ae6b4; }
.method-badge.post { background: #3b3323; color: #ffe47a; }
.method-badge.put { background: #1c2c49; color: #9fbfff; }
.method-badge.patch { background: #2d2244; color: #d8b4fe; }
.method-badge.delete { background: #3a241f; color: #ffad9f; }
.method-badge.head { background: #163126; color: #9ae6b4; }
.method-badge.options { background: #3c2035; color: #ff8bd1; }

.code-viewer {
  position: relative;
  min-height: 180px;
  background: #1a1a2e;
}

.copy-code-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 28px;
  height: 28px;
  border: 0.5px solid rgba(232, 228, 255, 0.18);
  background: rgba(26, 26, 46, 0.8);
  color: #e8e4ff;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
}
.copy-code-btn:hover,
.copy-code-btn:focus-visible {
  background: rgba(83, 74, 183, 0.85);
  border-color: rgba(232, 228, 255, 0.35);
}
.copy-code-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.copy-code-btn:disabled:hover {
  background: rgba(26, 26, 46, 0.8);
  border-color: rgba(232, 228, 255, 0.18);
}
.copy-code-btn:focus-visible {
  outline: 2px solid rgba(232, 228, 255, 0.35);
  outline-offset: 2px;
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

.empty-body {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 14px;
  color: rgba(232, 228, 255, 0.58);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
}
.empty-body p { margin: 0; }

.headers-table-wrap {
  overflow-x: auto;
}

.headers-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.headers-table th,
.headers-table td {
  border-bottom: 0.5px solid #f0eee8;
  padding: 10px 14px;
  text-align: left;
  vertical-align: top;
}
.headers-table th {
  color: #9e9c96;
  font-size: 10px;
  font-weight: 500;
}
.headers-table td {
  color: #1a1a2e;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.headers-table th:first-child,
.headers-table td:first-child {
  width: 38%;
  color: #5f5e5a;
}
.headers-table tbody tr:last-child td {
  border-bottom: 0;
}

.header-copy-cell {
  display: inline;
  max-width: 100%;
  margin: -3px -5px;
  padding: 3px 5px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  cursor: copy;
  font: inherit;
  line-height: inherit;
  text-align: left;
  overflow-wrap: anywhere;
  transition: background 0.1s, color 0.1s, box-shadow 0.1s;
}
.header-copy-cell:hover,
.header-copy-cell:focus-visible {
  background: #f5f4f0;
  color: #534ab7;
}
.header-copy-cell:focus-visible {
  outline: 2px solid rgba(83, 74, 183, 0.16);
  outline-offset: 1px;
}
.header-copy-cell.copied {
  background: #ede9ff;
  color: #534ab7;
  box-shadow: inset 0 0 0 0.5px rgba(83, 74, 183, 0.16);
}
</style>
