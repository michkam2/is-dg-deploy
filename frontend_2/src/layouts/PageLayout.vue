<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row items-center">
        <router-link
          v-if="previousRoute && previousTitle"
          class="main-text text-accent text-weight-medium z-fab"
          :to="previousRoute"
        >
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ previousTitle }} >&nbsp;
        </router-link>
        <p class="main-text z-index">{{ props.title }}</p>
        <slot name="description" />
        <q-space></q-space>
        <div class="actions">
          <slot name="actions" />
        </div>
      </div>
      <slot />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  previousTitle: {
    type: String,
    default: '',
  },
  previousRoute: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.z-index {
  z-index: 1001;
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
