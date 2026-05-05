<template>
  <div class="w-full max-w-sm px-4">

    <div class="bg-white border border-sand-200 rounded-xl p-8 shadow-sm">

      <!-- Brand -->
      <div class="flex items-center justify-center gap-2.5 mb-7">
        <div class="w-8 h-8 bg-navy rounded-[8px] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.8 2 4 3.6 4 5.6C4 7.2 5 8.6 6.5 9.1L6 14H10L9.5 9.1C11 8.6 12 7.2 12 5.6C12 3.6 10.2 2 8 2Z" fill="#a89fe8"/>
            <circle cx="8" cy="5.5" r="1.5" fill="#e8e4ff"/>
          </svg>
        </div>
        <span class="text-[17px] font-semibold text-navy tracking-tight">Pigeon</span>
      </div>

      <h1 class="text-[15px] font-semibold text-navy text-center mb-1.5">Sign in to Pigeon</h1>
      <p class="text-[13px] text-sand-500 text-center mb-6">Manage your webhooks and local relays.</p>

      <!-- Auth buttons -->
      <div class="flex flex-col gap-3">
        <button class="auth-btn" @click="navigateTo('/endpoints')">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.123 17.64 11.815 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button class="auth-btn" @click="navigateTo('/endpoints')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
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

<script setup>
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
  padding: 10px 16px;
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
