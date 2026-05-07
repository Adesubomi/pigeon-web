<template>
  <section class="flex h-full flex-col overflow-hidden">
    <header class="px-5 py-5 border-b border-sand-200 flex-shrink-0">
      <div class="flex items-center justify-between gap-3">
        <button class="panel-icon-btn" aria-label="Back to endpoint details" @click="navigateTo(backPath)">
          <PhArrowLeft class="size-3.5" />
        </button>

        <div class="min-w-0 flex-1 text-center">
          <p class="text-[13px] font-semibold text-navy truncate">{{ event?.path ?? 'Event details' }}</p>
          <p class="text-[10px] text-sand-500 font-mono truncate">{{ endpoint?.name }}</p>
        </div>

        <button class="panel-icon-btn" aria-label="Close event details" @click="navigateTo(closePath)">
          <PhX class="size-3.5" />
        </button>
      </div>
    </header>

    <div v-if="event" class="event-detail-scroll">
      <div class="event-detail-content">
        <section class="event-summary-card">
          <div class="event-request-line">
            <span class="method-badge" :class="event.method.toLowerCase()">{{ event.method }}</span>
            <p class="event-path">{{ event.path }}</p>
          </div>

          <div class="detail-metrics">
            <div class="metric-cell">
              <span>Received</span>
              <strong>{{ event.time }}</strong>
            </div>
            <div class="metric-cell">
              <span>Size</span>
              <strong>{{ event.size }}</strong>
            </div>
            <div class="metric-cell">
              <span>Source</span>
              <strong>{{ event.source }}</strong>
            </div>
          </div>
        </section>

        <div class="tab-list">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'body' }"
            @click="setTab('body')"
          >
            Body
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'headers' }"
            @click="setTab('headers')"
          >
            Headers
          </button>
        </div>

        <section v-if="activeTab === 'body'" class="detail-panel body-panel">
          <div class="payload-header">
            <p class="panel-section-title">Body</p>
            <span class="payload-format">JSON</span>
          </div>

          <div class="code-viewer">
            <button
              class="copy-code-btn"
              :disabled="!hasBody"
              :aria-label="copyLabel"
              :title="copyLabel"
              @click="copyBody"
            >
              <PhCopy class="size-3.5" />
            </button>
            <pre v-if="hasBody" class="payload-block"><code>{{ formattedPayload }}</code></pre>
            <div v-else class="empty-body">
              <p>No body</p>
            </div>
          </div>
        </section>

        <section v-else class="detail-panel headers-panel">
          <div class="payload-header">
            <p class="panel-section-title">Headers</p>
            <span class="header-count">{{ headerRows.length }}</span>
          </div>

          <div class="headers-table-wrap">
            <table class="headers-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="header in headerRows" :key="header.key">
                  <td>{{ header.key }}</td>
                  <td>{{ header.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2 text-sand-500 p-10 text-center">
      <p class="text-xs">Event not found</p>
      <button class="text-[11px] text-brand-500 bg-transparent border-0 cursor-pointer font-sans hover:underline" @click="navigateTo(backPath)">
        Back to endpoint
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PhArrowLeft,
  PhCopy,
  PhX,
} from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const { getEndpoint, getEvent, getEventContext } = useEndpoints()

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const isDashboardActivityEventRoute = computed(() => route.path.startsWith('/dashboard/activity/events/'))
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
const copyLabel = computed(() => {
  if (!hasBody.value) return 'No body to copy'
  return copied.value ? 'Copied JSON' : 'Copy JSON'
})
const backPath = computed(() => {
  if (isDashboardActivityEventRoute.value) return '/dashboard/activity'
  if (isDashboardRoute.value) return endpointId.value ? `/dashboard/endpoints/${endpointId.value}` : '/dashboard'
  return endpointId.value ? `/endpoints/${endpointId.value}` : '/endpoints'
})
const closePath = computed(() => isDashboardRoute.value ? '/dashboard' : '/endpoints')

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
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
</style>
