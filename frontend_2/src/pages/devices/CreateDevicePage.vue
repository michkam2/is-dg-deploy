<template>
  <PageLayout :title="t('global.add')" :previous-title="t('device.label', 2)" previous-route="/devices">
    <create-device-form class="q-mt-md" />
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import CreateDeviceForm from '@/components/devices/CreateDeviceForm.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
