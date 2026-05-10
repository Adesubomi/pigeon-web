<template>
  <div class="flex flex-1 overflow-hidden">
    <!-- Main content area -->
    <div class="flex-1 lg:flex-[2] flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="px-5 sm:px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Profile</h1>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-5 sm:px-7 pt-4 pb-7">
        <div class="max-w-2xl">
          <Card class="p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-4">Account Information</h2>
            
            <div class="space-y-4">
              <div class="flex items-center gap-4 pb-4 border-b border-sand-100">
                <div class="w-16 h-16 rounded-full bg-brand-200 flex items-center justify-center text-xl font-semibold text-brand-500">
                  AO
                </div>
                <div>
                  <p class="text-[13px] font-medium text-navy">Ade Okonkwo</p>
                  <p class="text-xs text-sand-500">Pro plan</p>
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-[11px] font-medium text-sand-500 uppercase tracking-wide mb-1.5">Email</label>
                  <p class="text-[13px] text-navy">ade@example.com</p>
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-sand-500 uppercase tracking-wide mb-1.5">Full Name</label>
                  <Input
                    type="text" 
                    value="Ade Okonkwo"
                    class="text-[13px]"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-sand-500 uppercase tracking-wide mb-1.5">Timezone</label>
                  <p class="text-[13px] text-navy">UTC ( detected )</p>
                </div>
              </div>

              <div class="pt-4 border-t border-sand-100 flex gap-3">
                <Button>
                  Save Changes
                </Button>
                <Button variant="outline" class="text-sand-600">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          <Card class="mt-4 p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-4">Connected Accounts</h2>
            <p class="text-xs text-sand-500 mb-6">Connect your accounts to enable sign-in and integrations.</p>
            
            <div class="space-y-3">
              <!-- Google -->
              <div class="flex items-center justify-between p-4 border border-sand-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white border border-sand-200 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M17.64 9.204c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614Z" />
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.182l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
                      <path fill="#EA4335" d="M9 3.58c1.322 0 2.508.454 3.44 1.346l2.581-2.582C13.463.892 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13px] font-medium text-navy">Google</p>
                    <p class="text-xs text-sand-500">Connected as ade@example.com</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" class="border-danger-500 text-danger-500 hover:bg-danger-50 hover:text-danger-500">
                  Disconnect
                </Button>
              </div>

              <!-- GitHub -->
              <div class="flex items-center justify-between p-4 border border-sand-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#24292f] rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.51 0 12.31c0 5.44 3.44 10.05 8.2 11.68.6.11.82-.27.82-.59 0-.29-.01-1.06-.02-2.09-3.34.75-4.04-1.65-4.04-1.65-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.74.08-.74 1.2.09 1.84 1.27 1.84 1.27 1.07 1.88 2.81 1.34 3.5 1.02.11-.79.42-1.34.76-1.65-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.12-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.26A11.24 11.24 0 0 1 12 5.93c1.02.01 2.04.14 3 .41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.7.24 2.96.12 3.27.77.86 1.24 1.96 1.24 3.31 0 4.74-2.81 5.78-5.49 6.09.43.38.82 1.14.82 2.3 0 1.66-.02 3-.02 3.41 0 .33.22.71.83.59C20.57 22.36 24 17.75 24 12.31 24 5.51 18.63 0 12 0Z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13px] font-medium text-navy">GitHub</p>
                    <p class="text-xs text-sand-500">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </Card>

          <Card class="mt-4 p-6">
            <h2 class="text-[13px] font-semibold text-navy mb-2">Danger Zone</h2>
            <p class="text-xs text-sand-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="outline" class="border-danger-500 text-danger-500 hover:bg-danger-50 hover:text-danger-500">
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>
