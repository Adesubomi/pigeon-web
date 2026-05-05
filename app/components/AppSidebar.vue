<template>
  <aside class="w-[240px] min-w-[240px] bg-white border-r border-sand-200 flex flex-col">

    <!-- Logo -->
    <div class="px-5 py-5 pb-4 border-b border-sand-200 flex items-center gap-2.5 flex-shrink-0">
      <div class="w-7 h-7 bg-navy rounded-[7px] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2C5.8 2 4 3.6 4 5.6C4 7.2 5 8.6 6.5 9.1L6 14H10L9.5 9.1C11 8.6 12 7.2 12 5.6C12 3.6 10.2 2 8 2Z" fill="#a89fe8"/>
          <circle cx="8" cy="5.5" r="1.5" fill="#e8e4ff"/>
        </svg>
      </div>
      <span class="text-[15px] font-semibold tracking-[-0.3px] text-navy">Pigeon</span>
    </div>

    <!-- Nav -->
    <nav class="px-3 py-3.5 flex-1 overflow-y-auto">

      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="7.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="1" y="7.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        Dashboard
      </NuxtLink>

      <p class="nav-label mt-3">Workspace</p>

      <NuxtLink to="/endpoints" class="nav-item" active-class="active">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="8" y="1" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="1" y="8" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="8" y="8" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        Endpoints
        <span class="ml-auto bg-brand-700 text-brand-300 text-[10px] font-medium px-1.5 py-px rounded-full font-mono">5</span>
      </NuxtLink>

      <a href="#" class="nav-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 3h12M1 7h8M1 11h10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Event log
      </a>

      <a href="#" class="nav-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M7 4v3.5l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Delivery history
      </a>

      <p class="nav-label mt-4">Account</p>

      <a href="#" class="nav-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Devices
      </a>

      <a href="#" class="nav-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.636 2.636l1.06 1.06M10.303 10.303l1.06 1.06M2.636 11.364l1.06-1.06M10.303 3.697l1.06-1.06" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
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
  padding: 9px 12px;
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

.nav-item.active svg rect,
.nav-item.active svg path,
.nav-item.active svg circle {
  stroke: #534ab7;
}
</style>
