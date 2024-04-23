<template>
  <PageLayout :title="t('device.label', 2)">
    <template #actions>
      <SearchBar v-model="filter" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('device.add_device')"
        :icon="mdiPlus"
        to="/devices/create"
      />
    </template>
    <template #default>
      <DevicesTable
        v-if="deviceStore.devices.data"
        v-model="deviceStore.devices.data"
        :loading="deviceStore.devices.isLoading"
        :filter="filter"
        class="shadow"
        @on-change="deviceStore.devices.refresh"
      />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { useDeviceStore } from '@/stores/device-store';
import DevicesTable from '@/components/devices/DevicesTable.vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import PageLayout from '@/layouts/PageLayout.vue';
import { ref } from 'vue';
import SearchBar from '@/components/core/SearchBar.vue';

const { t } = useI18n();

const authStore = useAuthStore();
const deviceStore = useDeviceStore();
deviceStore.devices.refresh();

const filter = ref('');
</script>
