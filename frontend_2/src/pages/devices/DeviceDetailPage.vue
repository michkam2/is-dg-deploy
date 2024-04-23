<template>
  <PageLayout
    v-if="device.data"
    :title="device.data.name"
    :previous-title="t('device.label', 2)"
    previous-route="/devices"
  >
    <template #actions>
      <q-btn
        class="shadow bg-white q-ml-md"
        :to="`/devices/${device.data.uid}/jobs`"
        text-color="grey-color"
        unelevated
        no-caps
        size="15px"
        :label="t('job.label', 2)"
        :icon="mdiListStatus"
      />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow q-ml-md"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('global.edit')"
        :icon="mdiPencil"
        :to="`/devices/${device.data.uid}/edit`"
      />
    </template>
    <template #default>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
        <div class="col-12 col-md-12 col-lg-6 col-xl-3">
          <device-info-card :device="device.data" class="shadow container q-pa-lg full-height"></device-info-card>
        </div>
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <current-job-card class="shadow container q-pa-lg full-height" :device="device.data"></current-job-card>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-3">
          <sensor-selection-tree
            v-if="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            :data-point-tag-tree="dataPointTagTree"
            class="shadow container q-pa-lg full-height"
          ></sensor-selection-tree>
        </div>
        <div class="col-12">
          <data-point-chart
            v-if="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            class="bg-white shadow q-pa-lg"
            :data-point-tags="device.data.dataPointTags"
            @refresh="device.refresh()"
          ></data-point-chart>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DeviceInfoCard from '@/components/devices/DeviceInfoCard.vue';
import DataPointChart from '@/components/datapoints/DataPointChart.vue';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { reactive, ref } from 'vue';
import deviceService from 'src/services/DeviceService';
import { deviceToDataPointTagNode, extractNodeKeys } from '@/utils/data-point-tag-nodes';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import CurrentJobCard from '@/components/jobs/CurrentJobCard.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiPencil } from '@quasar/extras/mdi-v6';
import { useDeviceStore } from '@/stores/device-store';
import PageLayout from '@/layouts/PageLayout.vue';
import { useAsyncData } from '@/composables/useAsyncData';

const { t } = useI18n();

const route = useRoute();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const deviceId = route.params.id.toString();
const device = reactive(useAsyncData(getDevice, t('device.toasts.loading_failed')));

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();

async function getDevice() {
  const device = await deviceService.getDevice(deviceId);
  dataPointTagTree.value = deviceToDataPointTagNode(device);
  tickedNodes.value = extractNodeKeys(dataPointTagTree.value);
  return device;
}

function loadStoreDevice(uid: string) {
  const storedDevice = deviceStore.getDeviceById(uid);
  if (storedDevice) {
    device.data = storedDevice;
    dataPointTagTree.value = deviceToDataPointTagNode(device.data);
  }
}
loadStoreDevice(route.params.id.toString());
</script>

<style lang="scss" scoped></style>
