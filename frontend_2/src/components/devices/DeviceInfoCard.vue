<template>
  <div v-if="props.device" class="column">
    <div class="text-weight-medium text-h6">{{ t('global.info') }}</div>
    <div class="q-mt-sm q-gutter-y-sm column justify-between no-wrap">
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('global.name') }}</div>
        <div class="col-7">{{ props.device.name }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('device.mac_address') }}</div>
        <div class="col-7">{{ props.device.mac }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('device.type') }}</div>
        <div class="col-7">{{ props.device.type }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('device.version') }}</div>
        <div class="col-7">
          {{ props.device.version }}
        </div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('device.firmware') }}</div>
        <div class="col-7">
          {{ props.device.firmware }}
        </div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">{{ t('device.api_key') }}</div>
        <div class="col-7">
          {{ props.device.initApiKey }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Device } from '@/models/Device';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
});

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
