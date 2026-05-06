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
        <button class="auth-btn auth-btn--google" @click="navigateTo('/endpoints')">
          <svg class="auth-logo" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.204c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.182l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
            <path fill="#EA4335" d="M9 3.58c1.322 0 2.508.454 3.44 1.346l2.581-2.582C13.463.892 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
          </svg>
          Continue with Google
        </button>

        <button class="auth-btn auth-btn--github" @click="navigateTo('/endpoints')">
          <svg class="auth-logo" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.51 0 12.31c0 5.44 3.44 10.05 8.2 11.68.6.11.82-.27.82-.59 0-.29-.01-1.06-.02-2.09-3.34.75-4.04-1.65-4.04-1.65-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.74.08-.74 1.2.09 1.84 1.27 1.84 1.27 1.07 1.88 2.81 1.34 3.5 1.02.11-.79.42-1.34.76-1.65-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.12-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.26A11.24 11.24 0 0 1 12 5.93c1.02.01 2.04.14 3 .41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.7.24 2.96.12 3.27.77.86 1.24 1.96 1.24 3.31 0 4.74-2.81 5.78-5.49 6.09.43.38.82 1.14.82 2.3 0 1.66-.02 3-.02 3.41 0 .33.22.71.83.59C20.57 22.36 24 17.75 24 12.31 24 5.51 18.63 0 12 0Z" />
          </svg>
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
import { PhPaperPlaneTilt } from '@phosphor-icons/vue'

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
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s, border-color 0.1s, box-shadow 0.1s;
}

.auth-logo {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.auth-btn--google {
  color: #3c4043;
  background: #ffffff;
  border-color: #dadce0;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 0.08);
}

.auth-btn--google:hover {
  background: #f8fafd;
  border-color: #d2e3fc;
}

.auth-btn--github {
  color: #ffffff;
  background: #24292f;
  border-color: #24292f;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.12);
}

.auth-btn--github:hover {
  background: #1f2328;
  border-color: #1f2328;
}
</style>
