<template>
  <div class="space-y-1" :class="inverted ? 'text-inverted' : ''">
    <h1 class="text-xl font-bold tracking-tight" :class="inverted ? 'text-inverted' : 'text-highlighted'">
      {{ title }}
    </h1>
    <p v-if="description" class="text-sm" :class="inverted ? 'text-inverted/80' : 'text-muted'">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    inverted?: boolean
  }>(),
  { inverted: false }
)
</script>
