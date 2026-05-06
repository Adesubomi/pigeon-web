<template>
  <div class="w-full max-w-sm px-4">

    <div class="bg-white border border-sand-200 rounded-xl p-8 shadow-sm">

      <!-- Brand -->
      <div class="flex items-center justify-center gap-2.5 mb-7">
        <div class="w-8 h-8 bg-navy rounded-[8px] flex items-center justify-center flex-shrink-0">
          <PhPaperPlaneTilt class="size-[18px] text-brand-200" weight="fill" />
        </div>
        <span class="text-[17px] font-semibold text-navy tracking-tight">Pigeon</span>
      </div>

      <h1 class="text-[15px] font-semibold text-navy text-center mb-1.5">Sign in to Pigeon</h1>
      <p class="text-[13px] text-sand-500 text-center mb-6">Manage your webhooks and local relays.</p>

      <!-- Auth buttons -->
      <div class="flex flex-col gap-3">
        <button class="auth-btn" @click="navigateTo('/endpoints')">
          <PhGoogleLogo class="size-[18px] shrink-0 text-brand-500" />
          Continue with Google
        </button>

        <button class="auth-btn" @click="navigateTo('/endpoints')">
          <PhGithubLogo class="size-[18px] shrink-0 text-navy" weight="fill" />
          Continue with GitHub
        </button>
      </div>

    </div>

    <p class="text-center text-[11px] text-sand-500 mt-4">
      By continuing, you agree to our
      <a href="#" class="text-brand-500 hover:underline">Terms of Service</a>.
    </p>

  </div>
</template>

<script setup lang="ts">
import { PhGithubLogo, PhGoogleLogo, PhPaperPlaneTilt } from '@phosphor-icons/vue'

definePageMeta({ layout: 'auth' })
</script>

<style scoped>
.auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0.5px solid #e2e0d8;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  background: #ffffff;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04);
  transition: background 0.1s;
}

.auth-btn:hover {
  background: #f5f4f0;
}
</style>
