<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <header class="flex shrink-0 items-center gap-3 px-5 pb-0 pt-6 sm:px-7">
      <Button
        variant="ghost"
        size="icon"
        class="size-8 text-muted-foreground hover:text-foreground"
        aria-label="Back to settings"
        title="Back to settings"
        @click="navigateTo('/settings')"
      >
        <PhArrowLeft class="size-3.5" />
      </Button>
      <div class="min-w-0 flex-1">
        <h1 class="text-[15px] font-semibold tracking-tight text-navy">Pricing</h1>
        <p class="mt-0.5 text-xs text-sand-500">Compare usage plans for this workspace</p>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto px-5 pb-7 pt-4 sm:px-7">
      <div class="mx-auto grid w-full max-w-xl gap-4 lg:max-w-5xl lg:grid-cols-3">
        <Card
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col p-5"
          :class="plan.active ? 'border-brand-300 bg-brand-50 shadow-sm' : 'bg-card'"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-navy">{{ plan.name }}</h2>
              <p class="mt-1 text-xs text-sand-500">{{ plan.summary }}</p>
            </div>
            <Badge v-if="plan.active" class="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] text-brand-600">Active</Badge>
          </div>

          <div class="mb-5">
            <span class="font-mono text-2xl font-semibold text-navy">{{ plan.price }}</span>
          </div>

          <div class="space-y-3 border-t border-sand-100 pt-4">
            <div v-for="feature in plan.features" :key="feature" class="flex items-start gap-2">
              <span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-700">
                <PhCheck class="size-2.5" weight="bold" />
              </span>
              <span class="text-xs leading-relaxed text-sand-600">{{ feature }}</span>
            </div>
          </div>

          <Button
            class="mt-6 w-full"
            :variant="plan.active ? 'secondary' : 'default'"
            :disabled="plan.active"
            @click="selectPlan(plan.name)"
          >
            {{ plan.actionLabel }}
          </Button>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhCheck } from '@phosphor-icons/vue'

definePageMeta({ layout: 'default' })

const activePlan = ref('Builder')

const planCatalog = [
  {
    name: 'Solo',
    price: 'Free',
    summary: 'For focused webhook testing on a smaller setup.',
    features: [
      '5 endpoints',
      '2 clients',
      '6 hours of client connection lifespan',
      '500 events',
      '7 days retention',
      '50Mb storage capacity',
    ],
  },
  {
    name: 'Builder',
    price: '₦5,700',
    summary: 'For active teams testing multiple integrations.',
    features: [
      '20 endpoints',
      '10 clients',
      '24 hours of client connection lifespan',
      '5,000 events',
      '30 days retention',
      '500Mb storage capacity',
    ],
  },
  {
    name: 'Custom',
    price: 'Contact Support',
    summary: 'For dedicated infrastructure and tailored usage.',
    features: [
      'Dedicated setup',
      'Contact us',
    ],
  },
] as const

const plans = computed(() => planCatalog.map((plan) => {
  const active = plan.name === activePlan.value

  return {
    ...plan,
    active,
    actionLabel: active ? 'Active plan' : plan.name === 'Custom' ? 'Contact Support' : 'Select plan',
  }
}))

function selectPlan(planName: string) {
  activePlan.value = planName
}
</script>
