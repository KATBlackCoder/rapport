<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2 transition-colors"
    :class="inverted ? 'text-inverted hover:text-primary' : 'text-highlighted hover:text-primary'"
  >
    <UIcon
      name="i-lucide-clipboard-list"
      class="size-7 shrink-0"
    />
    <span class="font-semibold text-lg leading-tight">
      Rapport
      <span v-if="showSubtitle" class="block text-sm font-normal" :class="inverted ? 'text-inverted/90' : 'text-muted'">
        Gestion Questionnaires
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    showSubtitle?: boolean
    inverted?: boolean
  }>(),
  {
    to: '/',
    showSubtitle: false,
    inverted: false,
  }
)
</script>
