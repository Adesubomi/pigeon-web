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
      <div class="grid w-full max-w-xl gap-4 lg:max-w-5xl lg:grid-cols-3">
        <Card
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col p-5"
          :class="plan.active ? 'border-brand-300 bg-brand-50 shadow-sm' : 'bg-card'"
        >
          <div class="mb-3 flex h-6 items-start justify-end">
            <Badge v-if="plan.active" class="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] text-brand-600">Active</Badge>
          </div>

          <div class="mb-5">
            <h2 class="text-sm font-semibold text-navy">{{ plan.name }}</h2>
            <p class="mt-1 text-xs leading-relaxed text-sand-500">{{ plan.summary }}</p>
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
            :variant="plan.active || plan.name === 'Solo' ? 'secondary' : 'default'"
            :disabled="plan.active || isPlanButtonDisabled(plan.name)"
            @click="handlePlanAction(plan)"
          >
            {{ getPlanButtonLabel(plan) }}
          </Button>
        </Card>
      </div>
    </div>

    <AlertDialog :open="downgradeDialogOpen" @update:open="handleDowngradeDialogOpenChange">
      <AlertDialogContent class="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Downgrade to Free?</AlertDialogTitle>
          <AlertDialogDescription>
            Tell us what changed so we can make Pigeon better for teams like yours.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="mt-4 space-y-4">
          <div class="space-y-2">
            <Label class="text-xs font-medium text-foreground">What made you decide to stop paying?</Label>
            <div class="grid gap-2 sm:grid-cols-2">
              <label
                v-for="reason in downgradeReasons"
                :key="reason.id"
                class="flex min-h-12 cursor-pointer items-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs leading-relaxed transition-colors hover:bg-accent"
                :class="selectedDowngradeReasons.includes(reason.id) ? 'border-brand-300 bg-brand-50 text-navy' : 'text-muted-foreground'"
              >
                <input
                  type="checkbox"
                  class="mt-0.5 size-3.5 rounded border-input accent-primary"
                  :checked="selectedDowngradeReasons.includes(reason.id)"
                  @change="toggleDowngradeReason(reason.id)"
                >
                <span>{{ reason.label }}</span>
              </label>
            </div>
          </div>

          <div class="space-y-1.5">
            <Label for="downgrade-comment">Anything else?</Label>
            <textarea
              id="downgrade-comment"
              :value="downgradeComment"
              class="flex min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Share the context behind your decision..."
              @input="updateDowngradeComment"
            />
          </div>

          <p v-if="showDowngradeReasonError" class="text-[11px] text-danger-800">
            Select at least one reason before downgrading.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep {{ activePlan }}</AlertDialogCancel>
          <Button
            size="sm"
            variant="destructive"
            :disabled="!canSubmitDowngrade || downgradePending"
            @click="confirmDowngrade"
          >
            {{ downgradePending ? 'Downgrading...' : 'Downgrade to Free' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog :open="supportDialogOpen" @update:open="handleSupportDialogOpenChange">
      <AlertDialogContent class="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Contact Support</AlertDialogTitle>
          <AlertDialogDescription>
            Tell us what you need from the Business plan so the team can follow up with the right context.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="mt-4 space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label for="support-name">Name</Label>
              <Input
                id="support-name"
                :value="supportForm.name"
                placeholder="Ade Okonkwo"
                @input="updateSupportField('name', $event)"
              />
            </div>
            <div class="space-y-1.5">
              <Label for="support-email">Email</Label>
              <Input
                id="support-email"
                type="email"
                :value="supportForm.email"
                placeholder="ade@example.com"
                @input="updateSupportField('email', $event)"
              />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label for="support-company">Company</Label>
              <Input
                id="support-company"
                :value="supportForm.company"
                placeholder="Company name"
                @input="updateSupportField('company', $event)"
              />
            </div>
            <div class="space-y-1.5">
              <Label for="support-usage">Expected usage</Label>
              <Input
                id="support-usage"
                :value="supportForm.expectedUsage"
                placeholder="Events, endpoints, retention..."
                @input="updateSupportField('expectedUsage', $event)"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <Label for="support-message">What should we know?</Label>
            <textarea
              id="support-message"
              :value="supportForm.message"
              class="flex min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Share your timeline, security needs, or volume requirements..."
              @input="updateSupportField('message', $event)"
            />
          </div>

          <p v-if="showSupportFormError" class="text-[11px] text-danger-800">
            Add your name, email, and a short note before sending.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            size="sm"
            :disabled="!canSubmitSupportRequest || supportRequestPending"
            @click="submitSupportRequest"
          >
            {{ supportRequestPending ? 'Sending...' : 'Send Request' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhCheck } from '@phosphor-icons/vue'
import { toast } from 'vue-sonner'
import { pricingContactSupportActionKey, pricingDowngradeActionKey } from '@/composables/usePricingActions'
import type { WorkspacePlanName } from '@/composables/useWorkspacePlan'
import { pricingPlans, type PricingPlan } from '@/services/pricing-plans'

definePageMeta({ layout: 'default' })

const downgradeDialogOpen = ref(false)
const selectedDowngradeReasons = ref<DowngradeReasonId[]>([])
const downgradeComment = ref('')
const downgradeSubmitted = ref(false)
const supportDialogOpen = ref(false)
const supportSubmitted = ref(false)
const workspaceContact = {
  name: 'Ade Okonkwo',
  email: 'ade@example.com',
}
const supportForm = ref({
  name: workspaceContact.name,
  email: workspaceContact.email,
  company: '',
  expectedUsage: '',
  message: '',
})
const paymentOpening = ref(false)

const { contactPlanSupport, downgradePlan, isPricingActionPending } = usePricingActions()
const { activePlan, setActivePlan } = useWorkspacePlan()
const paymentConfig = usePaymentConfig()

type PricingPlanCard = PricingPlan & {
  active: boolean
  actionLabel: string
}

const downgradeReasons = [
  { id: 'short_project', label: 'I only needed this for a short project' },
  { id: 'too_expensive', label: 'The paid plan is too expensive' },
  { id: 'missing_features', label: 'It is missing features I need' },
  { id: 'usage_changed', label: 'My usage has dropped or changed' },
  { id: 'too_complex', label: 'The product feels too complex' },
  { id: 'switching_tools', label: 'I am moving to another tool' },
] as const

type DowngradeReasonId = typeof downgradeReasons[number]['id']

const plans = computed<PricingPlanCard[]>(() => pricingPlans.map((plan) => {
  const active = plan.name === activePlan.value

  return {
    ...plan,
    active,
    actionLabel: getPlanActionLabel(plan.name, active),
  }
}))

const downgradePending = computed(() => isPricingActionPending(pricingDowngradeActionKey()))
const supportRequestPending = computed(() => isPricingActionPending(pricingContactSupportActionKey()))
const canSubmitDowngrade = computed(() => selectedDowngradeReasons.value.length > 0)
const showDowngradeReasonError = computed(() => downgradeSubmitted.value && !canSubmitDowngrade.value)
const canSubmitSupportRequest = computed(() => (
  supportForm.value.name.trim().length > 0
  && supportForm.value.email.trim().length > 0
  && supportForm.value.message.trim().length > 0
))
const showSupportFormError = computed(() => supportSubmitted.value && !canSubmitSupportRequest.value)

function handlePlanAction(plan: PricingPlanCard) {
  if (plan.active) return

  const planName = plan.name

  if (planName === 'Solo') {
    openDowngradeDialog()
    return
  }

  if (planName === 'Builder') {
    openBuilderCheckout(plan)
    return
  }

  if (planName === 'Business') {
    openSupportDialog()
    return
  }

  setActivePlan(planName)
}

function getPlanActionLabel(planName: WorkspacePlanName, active: boolean) {
  if (active) return 'Active plan'
  if (planName === 'Solo') return 'Downgrade'
  if (planName === 'Builder' && activePlan.value === 'Solo') return 'Upgrade'
  if (planName === 'Business') return 'Contact Support'
  return 'Select plan'
}

function getPlanButtonLabel(plan: PricingPlanCard) {
  if (plan.name === 'Builder' && paymentOpening.value) return 'Opening Paystack...'
  return plan.actionLabel
}

function isPlanButtonDisabled(planName: WorkspacePlanName) {
  return (planName === 'Builder' && paymentOpening.value)
    || (planName === 'Business' && supportRequestPending.value)
}

function openDowngradeDialog() {
  resetDowngradeForm()
  downgradeDialogOpen.value = true
}

function handleDowngradeDialogOpenChange(open: boolean) {
  downgradeDialogOpen.value = open

  if (!open) {
    resetDowngradeForm()
  }
}

function resetDowngradeForm() {
  selectedDowngradeReasons.value = []
  downgradeComment.value = ''
  downgradeSubmitted.value = false
}

function toggleDowngradeReason(reasonId: DowngradeReasonId) {
  selectedDowngradeReasons.value = selectedDowngradeReasons.value.includes(reasonId)
    ? selectedDowngradeReasons.value.filter(selectedReason => selectedReason !== reasonId)
    : [...selectedDowngradeReasons.value, reasonId]
}

function updateDowngradeComment(event: Event) {
  downgradeComment.value = event.target instanceof HTMLTextAreaElement ? event.target.value : ''
}

function openSupportDialog() {
  resetSupportForm()
  supportDialogOpen.value = true
}

function handleSupportDialogOpenChange(open: boolean) {
  supportDialogOpen.value = open

  if (!open) {
    resetSupportForm()
  }
}

function resetSupportForm() {
  supportForm.value = {
    name: workspaceContact.name,
    email: workspaceContact.email,
    company: '',
    expectedUsage: '',
    message: '',
  }
  supportSubmitted.value = false
}

function updateSupportField(field: keyof typeof supportForm.value, event: Event) {
  const target = event.target
  const value = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement ? target.value : ''

  supportForm.value = {
    ...supportForm.value,
    [field]: value,
  }
}

async function confirmDowngrade(event?: Event) {
  downgradeSubmitted.value = true

  if (!canSubmitDowngrade.value || downgradePending.value) {
    event?.preventDefault()
    return
  }

  try {
    await downgradePlan({
      fromPlan: activePlan.value,
      toPlan: 'Solo',
      reasons: selectedDowngradeReasons.value.map(reasonId => (
        downgradeReasons.find(reason => reason.id === reasonId)?.label ?? reasonId
      )),
      comment: downgradeComment.value.trim(),
    })
  } catch {
    return
  }

  setActivePlan('Solo')
  handleDowngradeDialogOpenChange(false)
}

async function submitSupportRequest(event?: Event) {
  supportSubmitted.value = true

  if (!canSubmitSupportRequest.value || supportRequestPending.value) {
    event?.preventDefault()
    return
  }

  try {
    await contactPlanSupport({
      planName: 'Business',
      name: supportForm.value.name.trim(),
      email: supportForm.value.email.trim(),
      company: supportForm.value.company.trim(),
      expectedUsage: supportForm.value.expectedUsage.trim(),
      message: supportForm.value.message.trim(),
    })
  } catch {
    return
  }

  handleSupportDialogOpenChange(false)
}

async function openBuilderCheckout(plan: PricingPlanCard) {
  if (!import.meta.client) return

  if (!paymentConfig.paystackPublicKey) {
    toast.error('Paystack is not configured', {
      description: 'Add NUXT_PAYSTACK_PUBLIC_KEY before starting checkout.',
    })
    return
  }

  if (!plan.subscription_plan_id) {
    toast.error('Builder plan is missing a Paystack plan code')
    return
  }

  paymentOpening.value = true

  try {
    const PaystackPop = await loadPaystackInline()
    const popup = new PaystackPop()

    popup.newTransaction({
      key: paymentConfig.paystackPublicKey,
      email: workspaceContact.email,
      amount: 570000,
      currency: 'NGN',
      planCode: plan.subscription_plan_id,
      metadata: {
        workspacePlan: plan.name,
      },
      onLoad: () => {
        paymentOpening.value = false
      },
      onSuccess: () => {
        paymentOpening.value = false
        setActivePlan('Builder')
        toast.success('Builder plan activated')
      },
      onCancel: () => {
        paymentOpening.value = false
      },
      onError: (error) => {
        paymentOpening.value = false
        toast.error('Could not open Paystack', {
          description: error instanceof Error ? error.message : 'Please try again.',
        })
      },
    })
  } catch (error) {
    paymentOpening.value = false
    toast.error('Could not load Paystack', {
      description: error instanceof Error ? error.message : 'Please try again.',
    })
  }
}

interface PaystackTransactionOptions {
  key: string
  email: string
  amount: number
  currency?: string
  planCode?: string
  metadata?: Record<string, unknown>
  onLoad?: () => void
  onSuccess?: (transaction: unknown) => void
  onCancel?: () => void
  onError?: (error: unknown) => void
}

interface PaystackInline {
  newTransaction: (options: PaystackTransactionOptions) => unknown
}

interface PaystackConstructor {
  new (): PaystackInline
}

declare global {
  interface Window {
    Paystack?: PaystackConstructor
    PaystackPop?: PaystackConstructor
  }
}

let paystackLoadPromise: Promise<PaystackConstructor> | null = null

function loadPaystackInline() {
  const existingPaystack = getPaystackInline()

  if (existingPaystack) return Promise.resolve(existingPaystack)

  paystackLoadPromise ??= new Promise<PaystackConstructor>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://js.paystack.co/v2/inline.js"]')
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Paystack did not initialize.'))
    }, 10000)

    const resolveLoadedPaystack = () => {
      const loadedPaystack = getPaystackInline()

      window.clearTimeout(timeoutId)
      loadedPaystack ? resolve(loadedPaystack) : reject(new Error('Paystack did not initialize.'))
    }

    const rejectPaystackLoad = () => {
      window.clearTimeout(timeoutId)
      reject(new Error('Paystack failed to load.'))
    }

    if (existingScript) {
      const loadedPaystack = getPaystackInline()

      if (loadedPaystack) {
        window.clearTimeout(timeoutId)
        resolve(loadedPaystack)
        return
      }

      existingScript.addEventListener('load', resolveLoadedPaystack, { once: true })
      existingScript.addEventListener('error', rejectPaystackLoad, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.addEventListener('load', resolveLoadedPaystack, { once: true })
    script.addEventListener('error', rejectPaystackLoad, { once: true })
    document.head.appendChild(script)
  }).catch((error) => {
    paystackLoadPromise = null
    throw error
  })

  return paystackLoadPromise
}

function getPaystackInline() {
  return window.PaystackPop ?? window.Paystack
}
</script>
