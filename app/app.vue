<template>
  <UApp>
    <UMain>
      <NuxtLayout>
        <Transition name="page" mode="out-in">
          <div :key="route.path">
            <NuxtPage />
          </div>
        </Transition>
      </NuxtLayout>
    </UMain>
  </UApp>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
