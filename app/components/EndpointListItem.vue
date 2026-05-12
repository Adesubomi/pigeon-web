<template>
  <div class="endpoint-item flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-sand-400">
    <div class="size-2 shrink-0 rounded-full" :class="statusClasses[endpoint.status]" />

    <div class="flex-1 min-w-0">
      <NuxtLink
        v-if="to"
        class="inline-flex max-w-full rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
        :to="to"
      >
        <span
          class="truncate text-[13px] font-medium underline-offset-4 hover:underline"
          :class="endpoint.status === 'inactive' ? 'text-muted-foreground' : 'text-foreground'"
        >
          {{ endpoint.name }}
        </span>
      </NuxtLink>
      <Button
        v-else
        variant="ghost"
        class="h-auto max-w-full justify-start rounded-sm bg-transparent p-0 text-left font-sans hover:bg-transparent focus-visible:ring-ring/25"
        type="button"
        @click="$emit('open', endpoint)"
      >
        <span
          class="truncate text-[13px] font-medium underline-offset-4 hover:underline"
          :class="endpoint.status === 'inactive' ? 'text-muted-foreground' : 'text-foreground'"
        >
          {{ endpoint.name }}
        </span>
      </Button>
      <div class="flex min-w-0 items-center gap-1.5">
        <span class="truncate font-mono text-[11px] text-muted-foreground">{{ endpoint.url }}</span>
        <Button
          v-if="showCopyControl"
          variant="ghost"
          size="icon"
          class="size-5 shrink-0 text-muted-foreground hover:text-accent-foreground"
          :aria-label="copyLabel"
          :title="copyLabel"
          @click.stop="copyEndpointUrl"
        >
          <Transition name="copy-icon" mode="out-in">
            <PhCheck v-if="copiedUrl" key="copied" class="size-3 text-success-600" weight="bold" />
            <PhCopy v-else key="copy" class="size-3" />
          </Transition>
        </Button>
      </div>
    </div>

    <div class="shrink-0 flex items-center gap-2.5">
      <span
        v-if="showEventCount"
        class="font-mono text-xs"
        :class="endpoint.status === 'inactive' ? 'text-muted-foreground' : 'text-foreground'"
      >
        {{ formattedEventCount }}
      </span>

      <DeviceBadge
        v-if="showDeviceCount"
        :count="deviceCount"
      />

      <div class="flex gap-1">
        <Button
          v-if="showPlaybackControl"
          variant="outline"
          size="icon"
          class="size-8 text-muted-foreground hover:text-foreground"
          :title="endpoint.status === 'inactive' ? 'Resume' : 'Pause'"
          :disabled="playbackPending"
          @click.stop="$emit('toggle-playback', endpoint)"
        >
          <PhPlay v-if="endpoint.status === 'inactive'" class="size-3" weight="fill" />
          <PhPause v-else class="size-3" weight="fill" />
        </Button>

        <a
          v-if="showOpenControl"
          class="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :href="previewUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Open monitoring screen"
          aria-label="Open monitoring screen"
        >
          <PhArrowSquareOut class="size-3" />
        </a>

        <Button
          v-if="showDeleteControl"
          variant="outline"
          size="icon"
          class="size-8 text-muted-foreground hover:text-danger-500"
          :aria-label="deleteLabel"
          :title="deleteLabel"
          :disabled="deletePending"
          @click.stop="$emit('delete', endpoint)"
        >
          <Transition name="copy-icon" mode="out-in">
            <PhCircleNotch v-if="deleteLoading" key="delete-loading" class="size-3 animate-spin" />
            <PhTrash v-else key="delete" class="size-3" />
          </Transition>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhArrowSquareOut, PhCheck, PhCircleNotch, PhCopy, PhPause, PhPlay, PhTrash } from '@phosphor-icons/vue'

interface EndpointListEndpoint {
  id: string
  name: string
  url: string
  status: 'active' | 'inactive'
  devices?: number
  events?: number | null
  eventsToday?: number | null
}

const props = withDefaults(defineProps<{
  endpoint: {
    id: string
    name: string
    url: string
    status: 'active' | 'inactive'
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
  playbackPending?: boolean
  deletePending?: boolean
  deleteLoading?: boolean
  previewUrl?: string
  to?: string
}>(), {
  showDeviceCount: false,
  showEventCount: true,
  showPlaybackControl: false,
  showCopyControl: true,
  showOpenControl: true,
  showDeleteControl: false,
  playbackPending: false,
  deletePending: false,
  deleteLoading: false,
  previewUrl: undefined,
  to: undefined,
})

const emit = defineEmits<{
  copy: [endpoint: EndpointListEndpoint]
  open: [endpoint: EndpointListEndpoint]
  'toggle-playback': [endpoint: EndpointListEndpoint]
  delete: [endpoint: EndpointListEndpoint]
}>()

const { copied: copiedUrl, copyText } = useCopyAction({
  errorMessage: 'Could not copy endpoint URL',
})
const deviceCount = computed(() => props.endpoint.devices ?? 0)
const eventCount = computed(() => props.endpoint.eventsToday ?? props.endpoint.events ?? null)
const formattedEventCount = computed(() => eventCount.value == null ? '-' : eventCount.value.toLocaleString())
const previewUrl = computed(() => props.previewUrl ?? props.endpoint.url)
const copyLabel = computed(() => copiedUrl.value ? 'Copied' : 'Copy URL')
const deleteLabel = computed(() => props.deleteLoading ? 'Preparing delete confirmation' : 'Delete')

const statusClasses = {
  active: 'bg-success-600 shadow-[0_0_0_3px_rgba(29,158,117,0.15)]',
  inactive: 'bg-sand-400',
} satisfies Record<EndpointListEndpoint['status'], string>

async function copyEndpointUrl() {
  const copied = await copyText(previewUrl.value)
  if (!copied) return

  emit('copy', props.endpoint)
}
</script>

<style scoped>
.copy-icon-enter-active,
.copy-icon-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.copy-icon-enter-from,
.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.78);
}
</style>
