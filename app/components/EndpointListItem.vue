<template>
  <div class="endpoint-item">
    <div class="status-pill" :class="endpoint.status"></div>

    <div class="flex-1 min-w-0">
      <NuxtLink
        v-if="to"
        class="ep-name-link"
        :to="to"
      >
        <span class="ep-name" :class="{ muted: endpoint.status === 'inactive' }">{{ endpoint.name }}</span>
      </NuxtLink>
      <button
        v-else
        class="ep-name-link ep-name-button"
        type="button"
        @click="$emit('open', endpoint)"
      >
        <span class="ep-name" :class="{ muted: endpoint.status === 'inactive' }">{{ endpoint.name }}</span>
      </button>
      <div class="ep-url-row">
        <span class="ep-url">{{ endpoint.url }}</span>
        <button
          v-if="showCopyControl"
          class="copy-url-btn"
          title="Copy URL"
          @click.stop="$emit('copy', endpoint)"
        >
          <PhCopy class="size-3" />
        </button>
      </div>
    </div>

    <div class="shrink-0 flex items-center gap-2.5">
      <span
        v-if="showEventCount"
        class="event-count"
        :class="endpoint.status === 'inactive' ? 'muted' : ''"
      >
        {{ formattedEventCount }}
      </span>

      <DeviceBadge
        v-if="showDeviceCount"
        :count="deviceCount"
        :error="endpoint.status === 'error'"
      />

      <div class="ep-actions">
        <button
          v-if="showPlaybackControl"
          class="icon-btn"
          :title="endpoint.status === 'inactive' ? 'Resume' : 'Pause'"
          @click.stop="$emit('togglePlayback', endpoint)"
        >
          <PhPlay v-if="endpoint.status === 'inactive'" class="size-3" weight="fill" />
          <PhPause v-else class="size-3" weight="fill" />
        </button>

        <a
          v-if="showOpenControl"
          class="icon-btn"
          :href="previewUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Open monitoring screen"
          aria-label="Open monitoring screen"
        >
          <PhArrowSquareOut class="size-3" />
        </a>

        <button
          v-if="showDeleteControl"
          class="icon-btn"
          title="Delete"
          @click.stop="$emit('delete', endpoint)"
        >
          <PhTrash class="size-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhArrowSquareOut, PhCopy, PhPause, PhPlay, PhTrash } from '@phosphor-icons/vue'

interface EndpointListEndpoint {
  id?: string
  name: string
  url: string
  status: 'active' | 'inactive' | 'error'
  devices?: number
  events?: number | null
  eventsToday?: number | null
}

const props = withDefaults(defineProps<{
  endpoint: {
    id?: string
    name: string
    url: string
    status: 'active' | 'inactive' | 'error'
    devices?: number
    events?: number | null
    eventsToday?: number | null
  }
  showDeviceCount?: boolean
  showEventCount?: boolean
  showPlaybackControl?: boolean
  showCopyControl?: boolean
  showOpenControl?: boolean
  showDeleteControl?: boolean
  previewUrl?: string
  to?: string
}>(), {
  showDeviceCount: false,
  showEventCount: true,
  showPlaybackControl: false,
  showCopyControl: true,
  showOpenControl: true,
  showDeleteControl: false,
  previewUrl: undefined,
  to: undefined,
})

defineEmits<{
  copy: [endpoint: EndpointListEndpoint]
  open: [endpoint: EndpointListEndpoint]
  togglePlayback: [endpoint: EndpointListEndpoint]
  delete: [endpoint: EndpointListEndpoint]
}>()

const deviceCount = computed(() => props.endpoint.devices ?? 0)
const eventCount = computed(() => props.endpoint.eventsToday ?? props.endpoint.events ?? null)
const formattedEventCount = computed(() => eventCount.value == null ? '-' : eventCount.value.toLocaleString())
const previewUrl = computed(() => props.previewUrl ?? props.endpoint.url)
</script>

<style scoped>
.endpoint-item {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.15s;
}
.endpoint-item:hover { border-color: #b4b2a9; }

.status-pill {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-pill.active   { background: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.15); }
.status-pill.inactive { background: #b4b2a9; }
.status-pill.error    { background: #e24b4a; box-shadow: 0 0 0 3px rgba(226,75,74,0.12); }

.ep-name-link {
  display: inline-flex;
  max-width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  font: inherit;
}
.ep-name-link:hover .ep-name,
.ep-name-link:focus-visible .ep-name {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ep-name-link:focus-visible {
  outline: 2px solid rgba(83, 74, 183, 0.22);
  outline-offset: 2px;
  border-radius: 4px;
}
.ep-name-button {
  font-family: inherit;
}
.ep-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ep-name.muted { color: #9e9c96; }

.ep-url-row {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.ep-url {
  font-size: 11px;
  color: #9e9c96;
  font-family: 'IBM Plex Mono', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-url-btn {
  width: 18px; height: 18px;
  border: 0;
  background: transparent;
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #9e9c96;
  flex-shrink: 0;
  padding: 0;
  transition: background 0.1s, color 0.1s;
}
.copy-url-btn:hover { background: #f5f4f0; color: #534ab7; }

.event-count {
  font-size: 12px;
  color: #1a1a2e;
  font-family: 'IBM Plex Mono', monospace;
}
.event-count.muted { color: #9e9c96; }

.ep-actions {
  display: flex;
  gap: 3px;
}

.icon-btn {
  width: 34px; height: 34px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #888780;
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
}
.icon-btn:hover { background: #f5f4f0; color: #1a1a2e; }
</style>
