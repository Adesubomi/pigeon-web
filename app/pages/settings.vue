<template>
  <div class="flex flex-1 overflow-hidden">
    <!-- Main content area -->
    <div class="flex-1 lg:flex-[2] flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="px-5 sm:px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Settings</h1>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-5 sm:px-7 pt-4 pb-7">
        <!-- Tab navigation -->
        <Tabs :model-value="activeTab" class="mb-6 items-start" @update:model-value="setActiveTab">
          <TabsList>
            <TabsTrigger
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
          >
            {{ tab.label }}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <!-- Usage Tab -->
        <div v-if="activeTab === 'usage'" class="max-w-3xl space-y-4">
          <!-- Current Plan -->
          <Card class="p-6">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-[13px] font-semibold text-navy">Current Plan</h2>
                <p class="text-xs text-sand-500 mt-0.5">You are on the {{ activePlan }} plan</p>
              </div>
              <div class="inline-flex shrink-0 items-center rounded-full bg-sand-50 p-0.5">
                <Badge
                  v-for="plan in usagePlanLabels"
                  :key="plan.name"
                  class="rounded-full border-0 px-3 py-0.5 text-xs shadow-none"
                  :class="plan.active ? 'bg-brand-100 text-brand-600' : 'bg-transparent text-sand-500'"
                  variant="secondary"
                >
                  {{ plan.name }}
                </Badge>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-sand-100">
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Events</p>
                <p class="text-lg font-semibold text-navy font-mono">9,840</p>
                <p class="text-xs text-sand-500">of 50,000 / month</p>
                <Progress :model-value="20" indicator-class="bg-brand-500" class="mt-2 bg-sand-100" />
              </div>
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Endpoints</p>
                <p class="text-lg font-semibold text-navy font-mono">5</p>
                <p class="text-xs text-sand-500">of 20 / account</p>
                <Progress :model-value="25" indicator-class="bg-success-600" class="mt-2 bg-sand-100" />
              </div>
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Storage</p>
                <p class="text-lg font-semibold text-navy font-mono">2.4 GB</p>
                <p class="text-xs text-sand-500">of 10 GB / account</p>
                <Progress :model-value="24" indicator-class="bg-brand-500" class="mt-2 bg-sand-100" />
              </div>
            </div>

            <div class="pt-4">
              <Button @click="navigateTo('/pricing')">
                Change Plan
              </Button>
            </div>
          </Card>

          <!-- API Usage -->
          <Card class="usage-card p-6">
            <div class="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="text-[13px] font-semibold text-navy">API Usage</h2>
                <p class="mt-1 text-xs text-sand-500">{{ selectedUsageMetric.label }} over the selected date range</p>
              </div>

              <div ref="usageRangePickerRef" class="usage-range-picker">
                <Button
                  variant="outline"
                  class="usage-range-trigger"
                  :aria-expanded="isUsageRangeMenuOpen"
                  aria-haspopup="dialog"
                  @click="toggleUsageRangeMenu"
                >
                  <PhCalendarBlank class="size-3.5 text-sand-400" />
                  <span class="usage-range-trigger-label">{{ usageRangeLabel }}</span>
                  <PhCaretDown class="size-3 text-sand-400" />
                </Button>

                <div
                  v-if="isUsageRangeMenuOpen"
                  class="usage-range-menu"
                  :style="usageRangeMenuStyle"
                  role="dialog"
                  aria-label="Select usage date range"
                >
                  <div class="usage-range-presets">
                    <button
                      v-for="preset in usageRangePresets"
                      :key="preset.id"
                      type="button"
                      class="usage-range-preset"
                      :class="{ 'is-active': activeUsageRangePresetId === preset.id }"
                      @click="selectUsageRangePreset(preset.id)"
                    >
                      <span>{{ preset.label }}</span>
                      <PhCheck v-if="activeUsageRangePresetId === preset.id" class="size-3.5" />
                    </button>
                  </div>

                  <div v-if="isCustomUsageRangeActive" class="usage-calendar-panel">
                    <div class="usage-calendar-header">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="size-7 text-sand-500"
                        aria-label="Previous month"
                        :disabled="!canShowPreviousUsageMonth"
                        @click="showPreviousUsageMonth"
                      >
                        <PhCaretLeft class="size-3.5" />
                      </Button>
                      <p class="text-xs font-semibold text-navy">{{ visibleUsageMonthLabel }}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="size-7 text-sand-500"
                        aria-label="Next month"
                        :disabled="!canShowNextUsageMonth"
                        @click="showNextUsageMonth"
                      >
                        <PhCaretRight class="size-3.5" />
                      </Button>
                    </div>

                    <div class="usage-calendar-grid" aria-hidden="true">
                      <span v-for="weekday in usageCalendarWeekdays" :key="weekday">{{ weekday }}</span>
                    </div>
                    <div class="usage-calendar-grid">
                      <button
                        v-for="day in visibleUsageCalendarDays"
                        :key="day.key"
                        type="button"
                        class="usage-calendar-day"
                        :class="day.class"
                        :disabled="day.isDisabled"
                        @click="selectCustomUsageDate(day.date)"
                      >
                        {{ day.label }}
                      </button>
                    </div>

                    <div class="usage-calendar-footer">
                      <div class="min-w-0">
                        <p class="text-[10px] font-medium uppercase text-sand-500">Selected range</p>
                        <p class="truncate font-mono text-[11px] text-navy">{{ customUsageRangeLabel }}</p>
                      </div>
                      <Button size="sm" class="h-8 px-3" :disabled="!canApplyCustomUsageRange" @click="applyCustomUsageRange">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ChartContainer :config="usageChartConfig" cursor class="usage-chart-wrap h-[220px] !aspect-auto">
              <VisXYContainer
                :data="usageChartData"
                :height="220"
                :margin="{ top: 18, right: 20, bottom: 30, left: 44 }"
                :y-domain="usageYDomain"
                :aria-label="`${selectedUsageMetric.label} usage graph`"
              >
                <VisArea
                  :x="usageX"
                  :y="usageY"
                  :color="usageChartColor"
                  :opacity="0.08"
                  :line="false"
                  curve-type="linear"
                />
                <VisLine
                  :x="usageX"
                  :y="usageY"
                  :color="usageChartLineColor"
                  :line-width="1.5"
                  curve-type="linear"
                />
                <VisAxis
                  type="x"
                  :x="usageX"
                  :tick-line="false"
                  :domain-line="false"
                  :grid-line="false"
                  :tick-values="usageXAxisTickValues"
                  :tick-format="formatUsageDate"
                />
                <VisAxis
                  type="y"
                  :tick-line="false"
                  :domain-line="false"
                  :grid-line="true"
                  :tick-format="formatCompactNumber"
                />
                <ChartTooltip />
                <ChartCrosshair
                  :template="componentToString(usageChartConfig, ChartTooltipContent, { labelFormatter: formatUsageDate })"
                  :color="[usageChartLineColor]"
                />
              </VisXYContainer>
            </ChartContainer>
          </Card>
        </div>

        <!-- Billing Tab -->
        <div v-if="activeTab === 'billing'" class="max-w-3xl space-y-4">
          <!-- Payment Method -->
          <Card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-[13px] font-semibold text-navy">Payment Method</h2>
              <Button variant="link" size="sm" class="h-auto px-0 py-0 text-xs text-brand-500">Update</Button>
            </div>
            
            <Item class="bg-sand-50">
              <ItemMedia class="h-6 w-10 rounded border bg-white text-xs font-bold text-navy">
                VISA
              </ItemMedia>
              <ItemContent>
                <ItemTitle class="font-normal">•••• 4242</ItemTitle>
                <ItemDescription>Expires 12/25</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="success" class="bg-success-50 text-[10px]">Default</Badge>
              </ItemActions>
            </Item>
          </Card>

          <!-- Billing History -->
          <Card class="p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-4">Billing History</h2>
            
            <div class="space-y-2">
              <Item v-for="invoice in invoices" :key="invoice.id" class="border-0 border-b border-sand-100 bg-transparent px-0 py-3 last:border-0">
                <ItemMedia class="min-w-[60px] flex-col gap-1 text-center">
                    <p class="text-lg font-semibold leading-none text-navy">{{ invoice.month }}</p>
                    <p class="text-[10px] leading-none text-sand-500">{{ invoice.day }}</p>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle class="font-normal">{{ invoice.description }}</ItemTitle>
                  <ItemDescription>{{ invoice.status }}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <span class="text-sm font-medium text-navy font-mono">{{ invoice.amount }}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" class="size-8 text-sand-400 hover:text-foreground" aria-label="Download invoice">
                          <PhDownload class="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download invoice</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </ItemActions>
              </Item>
            </div>
          </Card>

          <!-- Cancel Subscription -->
          <Card class="p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-2">Cancel Subscription</h2>
            <p class="text-xs text-sand-500 mb-4">If you cancel, you will lose access to Pro features at the end of your billing period.</p>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" class="text-sand-600">Cancel Subscription</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Pro access remains active until the end of your current billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Plan</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Cancel Subscription</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>

        <!-- Team Tab (Placeholder) -->
        <div v-if="activeTab === 'team'" class="max-w-3xl">
          <Card class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-[13px] font-semibold text-navy">Team Members</h2>
                <p class="text-xs text-sand-500 mt-0.5">Manage access to your workspace</p>
              </div>
              <Button size="sm" disabled>
                Invite Member
              </Button>
            </div>

            <div class="space-y-2">
              <Item class="border-0 border-b border-sand-100 bg-transparent px-0 py-3">
                <Avatar class="size-8">
                  <AvatarFallback>AO</AvatarFallback>
                </Avatar>
                <ItemContent>
                  <ItemTitle class="font-normal">Ade Okonkwo</ItemTitle>
                  <ItemDescription>ade@example.com • Owner</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <span class="text-xs text-sand-400">You</span>
                </ItemActions>
              </Item>
            </div>

            <Empty class="mt-4 rounded-lg border border-dashed border-sand-200 bg-sand-50 p-4">
              <EmptyDescription>Team collaboration is coming soon. For now, this is a single-user workspace.</EmptyDescription>
            </Empty>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { PhCalendarBlank, PhCaretDown, PhCaretLeft, PhCaretRight, PhCheck, PhDownload } from '@phosphor-icons/vue'
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString, type ChartConfig } from '@/components/ui/chart'

definePageMeta({ layout: 'default' })

const tabs = [
  { id: 'usage', label: 'Usage' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
] as const

const activeTab = ref<typeof tabs[number]['id']>('usage')

function setActiveTab(value: string) {
  if (tabs.some(tab => tab.id === value)) activeTab.value = value as typeof tabs[number]['id']
}

const invoices = [
  { id: 1, month: 'May', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 2, month: 'Apr', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 3, month: 'Mar', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 4, month: 'Feb', day: '01', description: 'Pro Plan (Prorated)', status: 'Paid', amount: '$14.50' },
]

const { activePlan } = useWorkspacePlan()
const usagePlanLabels = computed(() => [
  { name: 'Solo', active: activePlan.value === 'Solo' },
  { name: 'Builder', active: activePlan.value === 'Builder' },
  { name: 'Business', active: activePlan.value === 'Business' },
] as const)

type UsageMetricId = 'ingestion' | 'delivery' | 'queries'
type UsageRow = {
  date: string
  ingestion: number
  delivery: number
  queries: number
}
type UsageChartDatum = {
  date: Date
  value: number
}
type UsageRangePresetId = 'last7' | 'last14' | 'last30' | 'thisMonth' | 'custom'

const usageMetricOptions = [
  { id: 'ingestion', label: 'Event Ingestion', color: '#534ab7' },
  { id: 'delivery', label: 'Relay Delivery', color: '#1d9e75' },
  { id: 'queries', label: 'API Queries', color: '#888780' },
] as const satisfies readonly {
  id: UsageMetricId
  label: string
  color: string
}[]

const usageRows: UsageRow[] = [
  { date: '2026-04-11', ingestion: 188, delivery: 684, queries: 28 },
  { date: '2026-04-12', ingestion: 214, delivery: 716, queries: 31 },
  { date: '2026-04-13', ingestion: 236, delivery: 755, queries: 35 },
  { date: '2026-04-14', ingestion: 242, delivery: 801, queries: 38 },
  { date: '2026-04-15', ingestion: 261, delivery: 826, queries: 42 },
  { date: '2026-04-16', ingestion: 248, delivery: 790, queries: 37 },
  { date: '2026-04-17', ingestion: 276, delivery: 834, queries: 39 },
  { date: '2026-04-18', ingestion: 301, delivery: 881, queries: 44 },
  { date: '2026-04-19', ingestion: 284, delivery: 846, queries: 41 },
  { date: '2026-04-20', ingestion: 295, delivery: 868, queries: 45 },
  { date: '2026-04-21', ingestion: 318, delivery: 914, queries: 48 },
  { date: '2026-04-22', ingestion: 327, delivery: 938, queries: 52 },
  { date: '2026-04-23', ingestion: 309, delivery: 899, queries: 46 },
  { date: '2026-04-24', ingestion: 342, delivery: 974, queries: 55 },
  { date: '2026-04-25', ingestion: 355, delivery: 1006, queries: 58 },
  { date: '2026-04-26', ingestion: 336, delivery: 968, queries: 51 },
  { date: '2026-04-27', ingestion: 361, delivery: 1022, queries: 57 },
  { date: '2026-04-28', ingestion: 347, delivery: 996, queries: 53 },
  { date: '2026-04-29', ingestion: 322, delivery: 943, queries: 47 },
  { date: '2026-04-30', ingestion: 311, delivery: 918, queries: 44 },
  { date: '2026-05-01', ingestion: 286, delivery: 862, queries: 40 },
  { date: '2026-05-02', ingestion: 274, delivery: 837, queries: 38 },
  { date: '2026-05-03', ingestion: 256, delivery: 792, queries: 34 },
  { date: '2026-05-04', ingestion: 268, delivery: 815, queries: 36 },
  { date: '2026-05-05', ingestion: 281, delivery: 844, queries: 39 },
  { date: '2026-05-06', ingestion: 293, delivery: 872, queries: 43 },
  { date: '2026-05-07', ingestion: 307, delivery: 913, queries: 46 },
  { date: '2026-05-08', ingestion: 319, delivery: 948, queries: 50 },
  { date: '2026-05-09', ingestion: 311, delivery: 935, queries: 48 },
  { date: '2026-05-10', ingestion: 224, delivery: 754, queries: 34 },
]

const activeUsageMetric = ref<UsageMetricId>('ingestion')
const usageRange = reactive({
  start: usageRows[0]?.date ?? '',
  end: usageRows.at(-1)?.date ?? '',
})
const usageDateBounds = {
  min: usageRows[0]?.date ?? '',
  max: usageRows.at(-1)?.date ?? '',
}
const selectedUsageMetric = computed(() => usageMetricOptions.find(metric => metric.id === activeUsageMetric.value) ?? usageMetricOptions[0])
const filteredUsageRows = computed(() => usageRows.filter(row => row.date >= usageRange.start && row.date <= usageRange.end))
const usageValues = computed(() => filteredUsageRows.value.map(row => row[activeUsageMetric.value]))
const usagePeak = computed(() => Math.max(0, ...usageValues.value))
const usageChartColor = computed(() => selectedUsageMetric.value.color)
const usageChartLineColor = computed(() => `${selectedUsageMetric.value.color}cc`)
const usageChartConfig = computed(() => ({
  value: {
    label: selectedUsageMetric.value.label,
    color: selectedUsageMetric.value.color,
  },
}) satisfies ChartConfig)
const usageChartData = computed<UsageChartDatum[]>(() => filteredUsageRows.value.map(row => ({
  date: new Date(`${row.date}T00:00:00`),
  value: row[activeUsageMetric.value],
})))
const usageYDomain = computed(() => [0, Math.max(1, usagePeak.value)])
const usageXAxisTickValues = computed(() => {
  const data = usageChartData.value
  if (!data.length) return []
  const first = data[0]
  if (!first) return []
  if (data.length === 1) return [first.date]

  const middle = data[Math.floor((data.length - 1) / 2)] ?? first
  const last = data[data.length - 1] ?? first

  return [
    first.date,
    middle.date,
    last.date,
  ]
})
const usageX = (datum: UsageChartDatum) => datum.date
const usageY = (datum: UsageChartDatum) => datum.value
const usageRangePickerRef = ref<HTMLElement | null>(null)
const isUsageRangeMenuOpen = ref(false)
const isCustomUsageRangeActive = ref(false)
const usageRangeMenuPosition = reactive({
  top: 0,
  left: 0,
  width: 344,
  maxHeight: 420,
})
const pendingCustomUsageRange = reactive({
  start: usageRange.start,
  end: usageRange.end,
})
const visibleUsageMonth = ref(startOfMonth(parseUsageDate(usageRange.end || usageDateBounds.max)))
const usageCalendarWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const usageRangePresets = [
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last14', label: 'Last 14 days' },
  { id: 'last30', label: 'Last 30 days' },
  { id: 'thisMonth', label: 'This month' },
  { id: 'custom', label: 'Custom Range' },
] as const satisfies readonly {
  id: UsageRangePresetId
  label: string
}[]

const presetUsageRanges = computed<Record<Exclude<UsageRangePresetId, 'custom'>, { start: string, end: string }>>(() => {
  const maxDate = usageDateBounds.max
  return {
    last7: buildBoundedUsageRange(addUsageDays(maxDate, -6), maxDate),
    last14: buildBoundedUsageRange(addUsageDays(maxDate, -13), maxDate),
    last30: buildBoundedUsageRange(addUsageDays(maxDate, -29), maxDate),
    thisMonth: buildBoundedUsageRange(formatUsageDateInput(startOfMonth(parseUsageDate(maxDate))), maxDate),
  }
})

const activeUsageRangePresetId = computed<UsageRangePresetId>(() => {
  const matchedPreset = Object.entries(presetUsageRanges.value).find(([, range]) => (
    range.start === usageRange.start && range.end === usageRange.end
  ))

  return (matchedPreset?.[0] as UsageRangePresetId | undefined) ?? 'custom'
})

const usageRangeLabel = computed(() => {
  const activePreset = usageRangePresets.find(preset => preset.id === activeUsageRangePresetId.value)
  const rangeLabel = `${formatUsageRangeDate(usageRange.start)} - ${formatUsageRangeDate(usageRange.end)}`

  return activePreset && activePreset.id !== 'custom' ? `${activePreset.label}: ${rangeLabel}` : rangeLabel
})

const visibleUsageMonthLabel = computed(() => (
  new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(visibleUsageMonth.value)
))

const firstVisibleUsageMonth = computed(() => startOfMonth(parseUsageDate(usageDateBounds.min)))
const lastVisibleUsageMonth = computed(() => startOfMonth(parseUsageDate(usageDateBounds.max)))
const canShowPreviousUsageMonth = computed(() => visibleUsageMonth.value > firstVisibleUsageMonth.value)
const canShowNextUsageMonth = computed(() => visibleUsageMonth.value < lastVisibleUsageMonth.value)
const visibleUsageCalendarDays = computed(() => buildUsageCalendarDays(visibleUsageMonth.value))
const canApplyCustomUsageRange = computed(() => Boolean(pendingCustomUsageRange.start && pendingCustomUsageRange.end))
const customUsageRangeLabel = computed(() => {
  if (!pendingCustomUsageRange.start) return 'Choose a start date'
  if (!pendingCustomUsageRange.end) return `${formatUsageRangeDate(pendingCustomUsageRange.start)} - choose end`
  return `${formatUsageRangeDate(pendingCustomUsageRange.start)} - ${formatUsageRangeDate(pendingCustomUsageRange.end)}`
})
const usageRangeMenuStyle = computed(() => ({
  top: `${usageRangeMenuPosition.top}px`,
  left: `${usageRangeMenuPosition.left}px`,
  width: `${usageRangeMenuPosition.width}px`,
  maxHeight: `${usageRangeMenuPosition.maxHeight}px`,
}))

onClickOutside(usageRangePickerRef, () => {
  isUsageRangeMenuOpen.value = false
})

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function formatUsageDate(value: number | Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function toggleUsageRangeMenu() {
  isUsageRangeMenuOpen.value = !isUsageRangeMenuOpen.value
  if (isUsageRangeMenuOpen.value) {
    syncPendingCustomUsageRange()
    isCustomUsageRangeActive.value = activeUsageRangePresetId.value === 'custom'
    nextTick(updateUsageRangeMenuPlacement)
  }
}

function selectUsageRangePreset(presetId: UsageRangePresetId) {
  if (presetId === 'custom') {
    isCustomUsageRangeActive.value = true
    syncPendingCustomUsageRange()
    nextTick(updateUsageRangeMenuPlacement)
    return
  }

  const selectedRange = presetUsageRanges.value[presetId]
  usageRange.start = selectedRange.start
  usageRange.end = selectedRange.end
  syncPendingCustomUsageRange()
  isCustomUsageRangeActive.value = false
  isUsageRangeMenuOpen.value = false
}

function selectCustomUsageDate(date: string) {
  if (!pendingCustomUsageRange.start || pendingCustomUsageRange.end || date < pendingCustomUsageRange.start) {
    pendingCustomUsageRange.start = date
    pendingCustomUsageRange.end = ''
    return
  }

  pendingCustomUsageRange.end = date
}

function applyCustomUsageRange() {
  if (!canApplyCustomUsageRange.value) return

  usageRange.start = pendingCustomUsageRange.start
  usageRange.end = pendingCustomUsageRange.end
  isUsageRangeMenuOpen.value = false
}

function syncPendingCustomUsageRange() {
  pendingCustomUsageRange.start = usageRange.start
  pendingCustomUsageRange.end = usageRange.end
  visibleUsageMonth.value = startOfMonth(parseUsageDate(usageRange.start || usageDateBounds.min))
}

function updateUsageRangeMenuPlacement() {
  const pickerRect = usageRangePickerRef.value?.getBoundingClientRect()
  if (!pickerRect) return

  const gap = 8
  const viewportPadding = 16
  const menuWidth = Math.min(344, window.innerWidth - (viewportPadding * 2))
  const maxLeft = window.innerWidth - menuWidth - viewportPadding
  const spaceBelow = window.innerHeight - pickerRect.bottom - gap - viewportPadding
  usageRangeMenuPosition.top = Math.floor(pickerRect.bottom + gap)
  usageRangeMenuPosition.left = Math.floor(Math.min(Math.max(viewportPadding, pickerRect.right - menuWidth), maxLeft))
  usageRangeMenuPosition.width = Math.floor(menuWidth)
  usageRangeMenuPosition.maxHeight = Math.max(220, Math.floor(spaceBelow))
}

function showPreviousUsageMonth() {
  if (!canShowPreviousUsageMonth.value) return
  visibleUsageMonth.value = addUsageMonths(visibleUsageMonth.value, -1)
}

function showNextUsageMonth() {
  if (!canShowNextUsageMonth.value) return
  visibleUsageMonth.value = addUsageMonths(visibleUsageMonth.value, 1)
}

function buildUsageCalendarDays(month: Date) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const firstDayOffset = new Date(year, monthIndex, 1).getDay()
  const blankDays = Array.from({ length: firstDayOffset }, (_, index) => ({
    key: `blank-${index}`,
    label: '',
    date: '',
    isDisabled: true,
    class: 'is-empty',
  }))
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => {
    const date = formatUsageDateInput(new Date(year, monthIndex, index + 1))
    const isDisabled = date < usageDateBounds.min || date > usageDateBounds.max
    const isStart = date === pendingCustomUsageRange.start
    const isEnd = date === pendingCustomUsageRange.end
    const isInRange = Boolean(
      pendingCustomUsageRange.start
      && pendingCustomUsageRange.end
      && date > pendingCustomUsageRange.start
      && date < pendingCustomUsageRange.end,
    )

    return {
      key: date,
      label: String(index + 1),
      date,
      isDisabled,
      class: {
        'is-selected': isStart || isEnd,
        'is-in-range': isInRange,
        'is-disabled': isDisabled,
      },
    }
  })

  return [...blankDays, ...monthDays]
}

function buildBoundedUsageRange(start: string, end: string) {
  return {
    start: start < usageDateBounds.min ? usageDateBounds.min : start,
    end: end > usageDateBounds.max ? usageDateBounds.max : end,
  }
}

function parseUsageDate(value: string) {
  return new Date(`${value}T00:00:00`)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addUsageDays(value: string, days: number) {
  const date = parseUsageDate(value)
  date.setDate(date.getDate() + days)
  return formatUsageDateInput(date)
}

function addUsageMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function formatUsageDateInput(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

function formatUsageRangeDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseUsageDate(value))
}
</script>

<style scoped>
.usage-chart-wrap {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #f0eee8;
  border-radius: 8px;
  background: #ffffff;
}

.usage-range-picker {
  position: relative;
  width: 100%;
}

.usage-range-trigger {
  width: 100%;
  min-width: 242px;
  justify-content: space-between;
  border-color: #e2e0d8;
  background: #ffffff;
  color: #1a1a2e;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  box-shadow: none;
}

.usage-range-trigger-label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
}

.usage-range-menu {
  position: fixed;
  z-index: 60;
  overflow-y: auto;
  border: 1px solid #e2e0d8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 36px rgb(26 26 46 / 12%);
}

.usage-range-presets {
  padding: 6px;
}

.usage-range-preset {
  display: flex;
  min-height: 34px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 6px;
  padding: 0 9px;
  color: #444441;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  transition: background 120ms ease, color 120ms ease;
}

.usage-range-preset:hover,
.usage-range-preset.is-active {
  background: #ede9ff;
  color: #534ab7;
}

.usage-calendar-panel {
  border-top: 1px solid #f0eee8;
  padding: 10px;
}

.usage-calendar-header,
.usage-calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.usage-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 3px;
  margin-top: 8px;
}

.usage-calendar-grid span {
  color: #9e9c96;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
}

.usage-calendar-day {
  display: flex;
  aspect-ratio: 1;
  min-width: 0;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #444441;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  transition: background 120ms ease, color 120ms ease;
}

.usage-calendar-day:hover:not(:disabled) {
  background: #f0eee8;
}

.usage-calendar-day.is-selected {
  background: #1a1a2e;
  color: #ffffff;
}

.usage-calendar-day.is-in-range {
  background: #ede9ff;
  color: #534ab7;
}

.usage-calendar-day.is-disabled {
  color: #d3d1c7;
}

.usage-calendar-day.is-empty {
  pointer-events: none;
}

.usage-calendar-footer {
  margin-top: 10px;
  border-top: 1px solid #f0eee8;
  padding-top: 10px;
}

@media (min-width: 768px) {
  .usage-range-picker {
    width: auto;
  }
}
</style>
