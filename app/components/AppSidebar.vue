<template>
  <aside class="w-[240px] min-w-[240px] bg-white border-r border-sand-200 flex flex-col">

    <!-- Logo -->
    <div class="px-5 py-5 pb-4 border-b border-sand-200 flex items-center gap-2.5 flex-shrink-0">
      <div class="w-7 h-7 bg-navy rounded-[7px] flex items-center justify-center flex-shrink-0">
        <PhPaperPlaneTilt class="size-4 text-brand-200" weight="fill" />
      </div>
      <span class="text-[15px] font-semibold tracking-[-0.3px] text-navy">Pigeon</span>
    </div>

    <!-- Nav -->
    <nav class="px-3 py-3.5 flex-1 overflow-y-auto">

      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <PhSquaresFour class="size-4 shrink-0" />
        Dashboard
      </NuxtLink>

      <p class="nav-label mt-3">Workspace</p>

      <NuxtLink to="/endpoints" class="nav-item" active-class="active">
        <PhStack class="size-4 shrink-0" />
        Endpoints
        <span class="ml-auto bg-brand-700 text-brand-300 text-[10px] font-medium px-1.5 py-px rounded-full font-mono">5</span>
      </NuxtLink>

      <a href="#" class="nav-item">
        <PhListBullets class="size-4 shrink-0" />
        Event log
      </a>

      <a href="#" class="nav-item">
        <PhClockCounterClockwise class="size-4 shrink-0" />
        Delivery history
      </a>

      <p class="nav-label mt-4">Account</p>

      <a href="#" class="nav-item">
        <PhDesktop class="size-4 shrink-0" />
        Devices
      </a>

      <a href="#" class="nav-item">
        <PhGearSix class="size-4 shrink-0" />
        Settings
      </a>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-sand-200 flex items-center gap-2.5 flex-shrink-0">
      <div class="w-7 h-7 rounded-full bg-brand-200 flex items-center justify-center text-[11px] font-medium text-brand-500 flex-shrink-0">
        AO
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-navy truncate">Ade Okonkwo</p>
        <p class="text-[11px] text-sand-500">Pro plan</p>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import {
  PhClockCounterClockwise,
  PhDesktop,
  PhGearSix,
  PhListBullets,
  PhPaperPlaneTilt,
  PhSquaresFour,
  PhStack,
} from '@phosphor-icons/vue'
</script>

<style scoped>
.nav-label {
  font-size: 10px;
  font-weight: 500;
  color: #9e9c96;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 10px;
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #5f5e5a;
  cursor: pointer;
  transition: background 0.1s;
  text-decoration: none;
}

.nav-item:hover {
  background: #f5f4f0;
}

.nav-item.active {
  background: #ede9ff;
  color: #534ab7;
  box-shadow: inset 3px 0 0 #534ab7;
}

.nav-item.active svg path {
  stroke: #534ab7;
}
</style>
