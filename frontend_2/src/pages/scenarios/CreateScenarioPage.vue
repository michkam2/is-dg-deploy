<template>
  <PageLayout :title="t('global.create')" :previous-title="t('scenario.label', 2)" previous-route="/scenarios">
    <ScenarioForm />
  </PageLayout>
</template>

<script setup lang="ts">
import ScenarioForm from '@/components/scenarios/ScenarioForm.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
