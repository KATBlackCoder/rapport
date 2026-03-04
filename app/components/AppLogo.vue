<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2.5 transition-opacity hover:opacity-80"
    :class="inverted ? 'text-inverted' : 'text-highlighted'"
  >
    <div
      class="flex items-center justify-center size-8 rounded-lg shrink-0"
      :class="inverted ? 'bg-inverted/10' : 'bg-primary/10'"
    >
      <UIcon
        name="i-lucide-clipboard-list"
        class="size-5"
        :class="inverted ? 'text-inverted' : 'text-primary'"
      />
    </div>
    <div class="leading-tight">
      <span class="font-bold text-base" :class="inverted ? 'text-inverted' : 'text-highlighted'">
        Rapport
      </span>
      <span
        v-if="showSubtitle"
        class="block text-xs font-normal"
        :class="inverted ? 'text-inverted/70' : 'text-muted'"
      >
        Gestion Questionnaires
      </span>
    </div>
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
