<template>
  <UCard
    class="w-full max-w-md bg-elevated border border-default"
    variant="soft"
    :ui="{ root: 'overflow-hidden' }"
  >
    <template v-if="$slots.header" #header>
      <div class="text-center">
        <slot name="header" />
      </div>
    </template>

    <slot />
  </UCard>
</template>

<script setup lang="ts">
</script>
