<template>
  <q-select
    ref="dateSelect"
    class="date-picker"
    :options="timeRanges"
    :label="t('time_range.label')"
    option-value="timeRange"
    option-label="title"
    outlined
    dense
    map-options
    :model-value="timeRanges[selectedTimeRangeIndex]"
    @update:model-value="setPredefinedTimeRange"
  >
    <template #prepend>
      <q-icon :name="mdiClockOutline" />
    </template>
    <template #after-options>
      <q-item clickable>
        <q-item-section>
          <q-item-label>{{ t('time_range.custom') }}</q-item-label>
        </q-item-section>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date :model-value="customTimeRangeSelected" range @update:model-value="setCustomTimeRange">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn v-close-popup label="OK" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-item>
    </template>
    <template #selected-item="scope">
      <template v-if="isCustomTimeRangeSelected">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        {{ customTimeRangeSelected.from }} - {{ customTimeRangeSelected.to }}
      </template>
      <template v-else-if="scope.opt.name">
        {{ scope.opt.title }}
      </template>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { format, subSeconds } from 'date-fns';
import { computed, ref } from 'vue';
import { PredefinedTimeRange } from '@/models/TimeRange';
import { useI18n } from 'vue-i18n';
import { mdiClockOutline } from '@quasar/extras/mdi-v6';

const emit = defineEmits(['update:modelValue']);
defineExpose({
  emitUpdate,
});

const { t } = useI18n();

const timeRanges = computed(() => [
  {
    title: t('time_range.predefined.last_30min'),
    name: '30m',
    time: 1800,
  },
  {
    title: t('time_range.predefined.last_1h'),
    name: '1h',
    time: 3600,
  },
  {
    title: t('time_range.predefined.last_6h'),
    name: '6h',
    time: 21600,
  },
  {
    title: t('time_range.predefined.last_12h'),
    name: '12h',
    time: 43200,
  },
  {
    title: t('time_range.predefined.last_24h'),
    name: '24h',
    time: 86400,
  },
  {
    title: t('time_range.predefined.last_week'),
    name: '1w',
    time: 604800,
  },
  {
    title: t('time_range.predefined.last_month'),
    name: '1m',
    time: 2592000,
  },
]);

const selectedTimeRangeIndex = ref(1);
const customTimeRangeSelected = ref({
  from: new Date(),
  to: new Date(),
});
const isCustomTimeRangeSelected = ref(false);

function setCustomTimeRange(val: { from: Date; to: Date }) {
  customTimeRangeSelected.value = val;
  isCustomTimeRangeSelected.value = true;
  emitUpdate();
}

function setPredefinedTimeRange(val: PredefinedTimeRange) {
  selectedTimeRangeIndex.value = timeRanges.value.findIndex((r) => r.name === val.name);
  isCustomTimeRangeSelected.value = false;
  emitUpdate();
}

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');
function emitUpdate() {
  let newVal;
  if (isCustomTimeRangeSelected.value) {
    newVal = {
      from: formatDate(new Date(customTimeRangeSelected.value.from)),
      to: formatDate(new Date(customTimeRangeSelected.value.to)),
    };
  } else {
    const now = new Date();
    newVal = {
      from: formatDate(subSeconds(now, timeRanges.value[selectedTimeRangeIndex.value].time)),
      to: formatDate(now),
    };
  }
  emit('update:modelValue', newVal);
}
emitUpdate();
</script>

<style lang="scss" scoped>
.date-picker {
  min-width: 190px;
}
</style>
