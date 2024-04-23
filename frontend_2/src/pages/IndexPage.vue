<template>
  <PageLayout :title="t('global.home')">
    <template #default> </template>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
