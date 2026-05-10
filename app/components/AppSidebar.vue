<template>
  <aside class="flex w-[240px] min-w-[240px] flex-col border-r border-border bg-card">

    <!-- Logo -->
    <div class="flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-5 pb-4">
      <div class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
        <PhPaperPlaneTilt class="size-4 text-brand-200" weight="fill" />
      </div>
      <span class="text-[15px] font-semibold text-foreground">Pigeon</span>
    </div>

    <!-- Nav -->
    <nav class="px-3 py-3.5 flex-1 overflow-y-auto">

      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <PhSquaresFour class="size-4 shrink-0" />
        Dashboard
      </NuxtLink>

      <p class="nav-label mt-3 px-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Workspace</p>

      <NuxtLink to="/endpoints" class="nav-item" active-class="active">
        <PhStack class="size-4 shrink-0" />
        Endpoints
        <Badge class="ml-auto rounded-full bg-brand-700 px-1.5 py-px font-mono text-[10px] text-brand-300">5</Badge>
      </NuxtLink>

      <NuxtLink to="/events" class="nav-item" active-class="active">
        <PhListBullets class="size-4 shrink-0" />
        Event log
      </NuxtLink>

      <p class="nav-label mt-4 px-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Account</p>

      <NuxtLink to="/settings" class="nav-item" active-class="active">
        <PhGearSix class="size-4 shrink-0" />
        Settings
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <NuxtLink to="/profile" class="footer-profile" active-class="active">
      <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-accent-foreground">
        AO
      </div>
      <div class="min-w-0">
        <p class="truncate text-xs font-medium text-foreground">Ade Okonkwo</p>
        <p class="text-[11px] text-muted-foreground">Pro plan</p>
      </div>
    </NuxtLink>

  </aside>
</template>

<script setup lang="ts">
import {
  PhGearSix,
  PhListBullets,
  PhPaperPlaneTilt,
  PhSquaresFour,
  PhStack,
} from '@phosphor-icons/vue'
</script>

<style scoped>
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
  background: var(--muted);
}

.nav-item.active {
  background: var(--accent);
  color: var(--accent-foreground);
  box-shadow: inset 3px 0 0 var(--accent-foreground);
}

.nav-item.active svg path {
  stroke: #534ab7;
}

.footer-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 10px;
  border: 0.5px solid transparent;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
  text-decoration: none;
}

.footer-profile:hover {
  background: var(--muted);
}

.footer-profile.active {
  background: var(--accent);
  border-color: rgba(83, 74, 183, 0.15);
}
</style>
