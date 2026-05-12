<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
        <PhPaperPlaneTilt class="size-4 text-brand-200" weight="fill" />
      </div>
      <span class="text-[15px] font-semibold text-foreground">Pigeon</span>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton to="/dashboard">
            <PhSquaresFour class="size-4 shrink-0" />
            Dashboard
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton to="/endpoints">
              <PhStack class="size-4 shrink-0" />
              Endpoints
              <Badge class="ml-auto rounded-full bg-brand-700 px-1.5 py-px font-mono text-[10px] text-brand-300">{{ endpoints.length }}</Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton to="/events">
              <PhListBullets class="size-4 shrink-0" />
              Event log
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup class="mt-4">
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton to="/settings">
              <PhGearSix class="size-4 shrink-0" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenuButton to="/profile" class="gap-2.5 px-2.5 py-2">
        <Avatar class="size-7">
          <AvatarFallback class="text-[11px]">AO</AvatarFallback>
        </Avatar>
        <div class="min-w-0">
          <p class="truncate text-xs font-medium text-foreground">Ade Okonkwo</p>
          <p class="text-[11px] text-muted-foreground">Pro plan</p>
        </div>
      </SidebarMenuButton>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import {
  PhGearSix,
  PhListBullets,
  PhPaperPlaneTilt,
  PhSquaresFour,
  PhStack,
} from '@phosphor-icons/vue'

const { endpoints } = useEndpoints()
</script>
