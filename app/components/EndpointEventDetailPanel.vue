<template>
  <section class="flex h-full flex-col overflow-hidden">
    <header class="px-5 py-5 border-b border-sand-200 flex-shrink-0">
      <div class="flex items-center justify-between gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" class="size-8 shrink-0 text-muted-foreground hover:text-foreground" :aria-label="backLabel" @click="navigateTo(backPath)">
                <PhArrowLeft class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ backLabel }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div class="min-w-0 flex-1 text-center">
          <p class="text-[13px] font-semibold text-navy truncate">{{ event?.path ?? 'Event details' }}</p>
          <p class="text-[10px] text-sand-500 font-mono truncate">{{ endpoint?.name }}</p>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" class="size-8 shrink-0 text-muted-foreground hover:text-foreground" aria-label="Close event details" @click="navigateTo(closePath)">
                <PhX class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close event details</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              <Transition name="copy-icon" mode="out-in">
                <PhCheck v-if="copiedCurl" key="curl-check" class="size-3.5 shrink-0 text-success-600" weight="bold" />
                <PhCode v-else key="curl-code" class="size-3.5 shrink-0" />
              </Transition>
              Copy cURL
            </Button>

            <Button
              size="sm"
              class="h-8 bg-brand-500 text-white hover:bg-brand-600"
              :class="{ 'bg-brand-600': publishing }"
              :aria-label="publishLabel"
              :title="publishLabel"
              :disabled="publishing"
              @click="publishEvent"
            >
              <PhBroadcast class="size-3.5 shrink-0" :class="{ 'broadcast-blink': publishing }" />
              Publish
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    class="absolute right-2.5 top-2.5 z-10 size-7 border-brand-100/20 bg-navy/80 text-brand-100 hover:bg-brand-500 hover:text-white"
                    :disabled="!hasBody"
                    :aria-label="copyLabel"
                    @click="copyBody"
                  >
                    <Transition name="copy-icon" mode="out-in">
                      <PhCheck v-if="copied" key="json-check" class="size-3.5 text-success-600" weight="bold" />
                      <PhCopy v-else key="json-copy" class="size-3.5" />
                    </Transition>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ copyLabel }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <TableCell class="font-mono text-[11px] text-sand-700 [overflow-wrap:anywhere]">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="header-copy-cell h-auto min-h-0"
                      :class="{ copied: copiedHeaderCell === headerCopyId(header.key, 'key') }"
                      :aria-label="headerCopyLabel(header.key, 'key')"
                      @click="copyHeaderCell(header.key, header.key, 'key')"
                    >
                      {{ header.key }}
                    </Button>
                </TableCell>
                <TableCell class="font-mono text-[11px] text-foreground [overflow-wrap:anywhere]">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="header-copy-cell h-auto min-h-0"
                      :class="{ copied: copiedHeaderCell === headerCopyId(header.key, 'value') }"
                      :aria-label="headerCopyLabel(header.key, 'value')"
                      @click="copyHeaderCell(header.value, header.key, 'value')"
                    >
                      {{ header.value }}
                    </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </ScrollArea>

    <Empty v-else class="flex-1">
      <EmptyTitle>Event not found</EmptyTitle>
      <Button variant="link" size="sm" class="h-auto px-0 py-0 text-[11px] text-brand-500" @click="navigateTo(backPath)">
        Back to endpoint
      </Button>
    </Empty>
  </section>
</template>

<script setup lang="ts">
import {
  PhArrowLeft,
  PhBroadcast,
  PhCheck,
  PhCode,
  PhCopy,
  PhX,
} from '@phosphor-icons/vue'
import { cn } from '@/lib/utils'
import { endpointEventActionKey } from '@/composables/useEndpointActions'
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
const { isEndpointActionPending, publishEndpointEvent } = useEndpointActions()

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
const { getEndpointPreviewUrl } = useEndpointPreviewUrl()
const activeTab = computed(() => route.query.tab === 'headers' ? 'headers' : 'body')
const {
  copied,
  copyText: copyBodyText,
} = useCopyAction({
  errorMessage: 'Could not copy JSON body',
  resetAfterMs: 2000,
})
const {
  copied: copiedCurl,
  copyText: copyCurlText,
} = useCopyAction({
  errorMessage: 'Could not copy cURL command',
  resetAfterMs: 2000,
})
const {
  copiedKey: copiedHeaderCell,
  copyText: copyHeaderText,
} = useCopyAction({
  resetAfterMs: 1200,
})
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

  const baseUrl = endpointId.value ? getEndpointPreviewUrl(endpointId.value).replace(/\/+$/, '') : ''
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
  return copied.value ? 'Copied' : 'Copy JSON'
})
const curlLabel = computed(() => copiedCurl.value ? 'Copied' : 'Copy cURL command')
const publishing = computed(() => {
  if (!endpoint.value || !event.value) return false
  return isEndpointActionPending(endpointEventActionKey(endpoint.value.id, event.value.id, 'publish'))
})
const publishLabel = computed(() => publishing.value ? 'Publishing event' : 'Publish event')
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

  await copyBodyText(formattedPayload.value)
}

async function copyCurl() {
  if (!curlCommand.value) return

  await copyCurlText(curlCommand.value)
}

async function publishEvent() {
  if (!endpoint.value || !event.value || publishing.value) return

  try {
    await publishEndpointEvent(endpoint.value, event.value)
  } catch {
    // The action runner owns user-facing error handling.
  }
}

function headerCopyId(headerKey: string, kind: HeaderCellKind) {
  return `${kind}:${headerKey}`
}

function headerCopyLabel(headerKey: string, kind: HeaderCellKind) {
  return copiedHeaderCell.value === headerCopyId(headerKey, kind)
    ? 'Copied'
    : `Copy ${headerKey} header ${kind}`
}

async function copyHeaderCell(text: string, headerKey: string, kind: HeaderCellKind) {
  await copyHeaderText(text, {
    copiedKey: headerCopyId(headerKey, kind),
    errorMessage: `Could not copy ${headerKey} header ${kind}`,
  })
}

function shellQuote(value: string) {
  return `'${value.replace(/'/g, `'\\''`)}'`
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

.broadcast-blink {
  animation: broadcast-blink 0.28s steps(2, end) infinite;
}

@keyframes broadcast-blink {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }
  50% {
    opacity: 0.28;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
  }
}
</style>
