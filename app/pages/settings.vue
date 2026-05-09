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
        <div class="flex items-center gap-1.5 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Usage Tab -->
        <div v-if="activeTab === 'usage'" class="max-w-3xl space-y-4">
          <!-- Current Plan -->
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-[13px] font-semibold text-navy">Current Plan</h2>
                <p class="text-xs text-sand-500 mt-0.5">You are on the Pro plan</p>
              </div>
              <span class="px-3 py-1 bg-brand-100 text-brand-600 text-xs font-medium rounded-full">Pro</span>
            </div>

            <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-sand-100">
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Events</p>
                <p class="text-lg font-semibold text-navy font-mono">9,840</p>
                <p class="text-xs text-sand-500">of 50,000 / month</p>
                <div class="w-full h-1.5 bg-sand-100 rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" style="width: 20%"></div>
                </div>
              </div>
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Endpoints</p>
                <p class="text-lg font-semibold text-navy font-mono">5</p>
                <p class="text-xs text-sand-500">of 20 / account</p>
                <div class="w-full h-1.5 bg-sand-100 rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-success-600 rounded-full" style="width: 25%"></div>
                </div>
              </div>
              <div>
                <p class="text-[11px] text-sand-500 uppercase tracking-wide">Storage</p>
                <p class="text-lg font-semibold text-navy font-mono">2.4 GB</p>
                <p class="text-xs text-sand-500">of 10 GB / account</p>
                <div class="w-full h-1.5 bg-sand-100 rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" style="width: 24%"></div>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button class="px-4 py-2 bg-navy text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                Upgrade Plan
              </button>
            </div>
          </div>

          <!-- API Usage -->
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-4">API Usage (Last 30 Days)</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-brand-500"></div>
                  <span class="text-xs text-navy">Event Ingestion</span>
                </div>
                <span class="text-xs font-mono text-sand-600">8,234 requests</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-success-600"></div>
                  <span class="text-xs text-navy">Relay Delivery</span>
                </div>
                <span class="text-xs font-mono text-sand-600">24,891 requests</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-sand-400"></div>
                  <span class="text-xs text-navy">API Queries</span>
                </div>
                <span class="text-xs font-mono text-sand-600">1,203 requests</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Tab -->
        <div v-if="activeTab === 'billing'" class="max-w-3xl space-y-4">
          <!-- Payment Method -->
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-[13px] font-semibold text-navy">Payment Method</h2>
              <button class="text-xs text-brand-500 hover:underline">Update</button>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-sand-50 rounded-lg">
              <div class="w-10 h-6 bg-white border border-sand-200 rounded flex items-center justify-center text-xs font-bold text-navy">
                VISA
              </div>
              <div class="flex-1">
                <p class="text-[13px] text-navy">•••• 4242</p>
                <p class="text-xs text-sand-500">Expires 12/25</p>
              </div>
              <span class="px-2 py-0.5 bg-success-50 text-success-600 text-[10px] font-medium rounded">Default</span>
            </div>
          </div>

          <!-- Billing History -->
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-4">Billing History</h2>
            
            <div class="space-y-2">
              <div v-for="invoice in invoices" :key="invoice.id" class="flex items-center justify-between py-3 border-b border-sand-100 last:border-0">
                <div class="flex items-center gap-4">
                  <div class="text-center min-w-[60px]">
                    <p class="text-[10px] text-sand-500 uppercase">{{ invoice.month }}</p>
                    <p class="text-lg font-semibold text-navy">{{ invoice.day }}</p>
                  </div>
                  <div>
                    <p class="text-[13px] text-navy">{{ invoice.description }}</p>
                    <p class="text-xs text-sand-500">{{ invoice.status }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-navy font-mono">{{ invoice.amount }}</span>
                  <button class="p-1.5 text-sand-400 hover:text-navy transition-colors">
                    <PhDownload class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancel Subscription -->
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-2">Cancel Subscription</h2>
            <p class="text-xs text-sand-500 mb-4">If you cancel, you will lose access to Pro features at the end of your billing period.</p>
            <button class="px-4 py-2 border border-sand-200 text-sand-600 text-xs font-medium rounded-lg hover:bg-sand-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>

        <!-- Team Tab (Placeholder) -->
        <div v-if="activeTab === 'team'" class="max-w-3xl">
          <div class="bg-white border border-sand-200 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-[13px] font-semibold text-navy">Team Members</h2>
                <p class="text-xs text-sand-500 mt-0.5">Manage access to your workspace</p>
              </div>
              <button class="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                Invite Member
              </button>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between py-3 border-b border-sand-100">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-xs font-medium text-brand-500">
                    AO
                  </div>
                  <div>
                    <p class="text-[13px] text-navy">Ade Okonkwo</p>
                    <p class="text-xs text-sand-500">ade@example.com • Owner</p>
                  </div>
                </div>
                <span class="text-xs text-sand-400">You</span>
              </div>
            </div>

            <div class="mt-4 p-4 bg-sand-50 rounded-lg border border-dashed border-sand-200">
              <p class="text-xs text-sand-500 text-center">Team collaboration is coming soon. For now, this is a single-user workspace.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhDownload } from '@phosphor-icons/vue'

definePageMeta({ layout: 'default' })

const tabs = [
  { id: 'usage', label: 'Usage' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
] as const

const activeTab = ref<typeof tabs[number]['id']>('usage')

const invoices = [
  { id: 1, month: 'May', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 2, month: 'Apr', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 3, month: 'Mar', day: '01', description: 'Pro Plan', status: 'Paid', amount: '$29.00' },
  { id: 4, month: 'Feb', day: '01', description: 'Pro Plan (Prorated)', status: 'Paid', amount: '$14.50' },
]
</script>

<style scoped>
.tab-btn {
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 6px 14px;
  color: #5f5e5a;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.1s, color 0.1s;
}
.tab-btn:hover { background: #f5f4f0; }
.tab-btn.active {
  background: #1a1a2e;
  color: white;
}
</style>
