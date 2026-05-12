<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster
    close-button
    close-button-position="top-right"
    rich-colors
    class="pointer-events-auto toast-wrap-content"
    position="top-center"
  />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
