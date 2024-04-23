<template>
  <div id="chart">
    <div class="row items-center justify-start q-mb-md q-gutter-x-md">
      <p class="text-weight-medium text-h6">{{ t('chart.label') }}</p>
      <q-space></q-space>
      <chart-time-range-select ref="timeRangeSelect" @update:model-value="updateTimeRange"></chart-time-range-select>
      <q-btn-dropdown padding="0.5rem 1rem" outline no-caps color="grey-7" text-color="grey-5" class="options-dropdown">
        <template #label>
          <div class="text-grey-10 text-weight-regular">
            {{ t('global.options') }}
          </div>
        </template>
        <template #default>
          <q-list>
            <q-item v-close-popup clickable @click="download(csvConfig)(generateCSVData())">
              <q-item-section>
                <q-item-label>{{ t('chart.export_csv') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list></template
        >
      </q-btn-dropdown>
      <q-btn
        text-color="primary"
        outline
        unelevated
        no-caps
        :label="t('global.refresh')"
        padding="0.5rem 1rem"
        :icon="mdiRefresh"
        @click="refreshDevice()"
      ></q-btn>
    </div>
    <apexchart
      ref="chart"
      height="350"
      width="100%"
      type="line"
      :options="chartOptions"
      :series="series"
      @mounted="setChartUpdate"
      @legend-click="legendClick"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, nextTick, ref, watch } from 'vue';
import ChartTimeRangeSelect from '@/components/datapoints/ChartTimeRangeSelect.vue';
import { TimeRange } from '@/models/TimeRange';
import { graphColors } from '@/utils/colors';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { format } from 'date-fns';
import { DataPointTag } from '@/models/DataPointTag';
import { now } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { mdiRefresh } from '@quasar/extras/mdi-v6';

const props = defineProps({
  dataPointTags: {
    type: Array as PropType<DataPointTag[]>,
    required: true,
  },
});
const emit = defineEmits(['refresh']);

const { t } = useI18n();

const selectedTimeRange = ref<TimeRange>();
const timeRangeSelect = ref();
function refreshDevice() {
  emit('refresh');
  timeRangeSelect.value?.emitUpdate();
}

const series = computed(() => {
  return props.dataPointTags.map((tag, index) => ({
    name: `${tag.name} (${tag.unit})`,
    data: tag.storedData.map((data) => ({
      x: data.measureAdd,
      y: data.value,
      unit: tag.unit,
    })),
    color: graphColors[index],
  }));
});

const yaxisLabels = props.dataPointTags.map((tag) => tag.unit) ?? [];

const chartOptions = ref({
  chart: {
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
    },
    toolbar: {
      autoSelected: 'zoom',
      tools: {
        download: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  markers: {
    size: 0,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  yaxis: yaxisLabels.map((unit, index) => ({
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      formatter: function (val: number) {
        return `${val.toFixed(0)} ${unit}`;
      },
      style: {
        colors: graphColors[index],
      },
    },
  })),
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
    },
    min: new Date(selectedTimeRange.value?.from ?? now()).getTime(),
    max: new Date(selectedTimeRange.value?.to ?? now()).getTime(),
  },
  tooltip: {
    shared: false,
    y: yaxisLabels.map((unit) => ({
      formatter: function (val: number) {
        return `${val.toFixed(2)} ${unit}`;
      },
    })),
    x: {
      formatter: function (val: number) {
        return new Date(val).toLocaleString();
      },
    },
  },
});

const chart = ref<ApexCharts | null>(null);
function updateTimeRange(timeRange: TimeRange) {
  selectedTimeRange.value = timeRange;
  if (chart.value) {
    chart.value.updateOptions({
      xaxis: {
        min: new Date(timeRange.from).getTime(),
        max: new Date(timeRange.to).getTime(),
      },
    });
  } else {
    chartOptions.value.xaxis.min = new Date(timeRange.from).getTime();
    chartOptions.value.xaxis.max = new Date(timeRange.to).getTime();
  }
}

//CSV export
const csvConfig = mkConfig({ useKeysAsHeaders: true, fieldSeparator: ';' });

const generateCSVData = () => {
  let allData: {
    name: string;
    unit: string;
    measureAdd: number;
    value: number;
  }[] = [];

  // Combine all data points from each tag
  props.dataPointTags.forEach((tag) => {
    tag.storedData.forEach((data) => {
      allData.push({
        name: tag.name,
        unit: tag.unit,
        measureAdd: data.measureAdd,
        value: data.value,
      });
    });
  });

  // Sort the data by measureAdd (timestamp)
  allData.sort((a, b) => new Date(a.measureAdd).getTime() - new Date(b.measureAdd).getTime());

  // Format the data for CSV export
  let csvData = allData.map((data) => ({
    name: data.name,
    unix: new Date(data.measureAdd).getTime(),
    date: format(new Date(data.measureAdd), 'dd/MM/yyyy'),
    time: format(new Date(data.measureAdd), 'HH:mm:ss'),
    value: data.value,
    unit: data.unit,
  }));

  return generateCsv(csvConfig)(csvData);
};

//Legend control
const tickedNodes = defineModel<string[]>('tickedNodes');
const seriesVisibility = ref<boolean[]>(props.dataPointTags.map(() => true));
const chartCnt = ref();
function setChartUpdate(chartContext: unknown) {
  chartCnt.value = chartContext;
}

function legendClick(_chartContext: unknown, seriesIndex: number) {
  seriesVisibility.value[seriesIndex] = !seriesVisibility.value[seriesIndex];
  tickedNodes.value = props.dataPointTags.filter((_, index) => seriesVisibility.value[index]).map((tag) => tag.uid);
}

function updateSeriesVisibility(tags: DataPointTag[], ticked: string[]) {
  if (!chartCnt.value) return;

  //Disable chart update for performance
  const update = chartCnt.value.update;
  chartCnt.value.update = () => {
    return Promise.resolve();
  };

  if (chart.value) {
    tags.forEach((tag) => {
      const seriesName = `${tag.name} (${tag.unit})`;
      if (ticked.includes(tag.uid)) {
        chart.value?.showSeries(seriesName);
        seriesVisibility.value[tags.indexOf(tag)] = true;
      } else {
        chart.value?.hideSeries(seriesName);
        seriesVisibility.value[tags.indexOf(tag)] = false;
      }
    });
  }

  //Re-enable chart update
  chartCnt.value.update = update;
  chartCnt.value.update();
}

watch(
  () => tickedNodes.value,
  (newTicked) => {
    updateSeriesVisibility(props.dataPointTags, newTicked ?? []);
  },
);

watch(
  () => props.dataPointTags,
  async (newTags) => {
    await nextTick();
    updateSeriesVisibility(newTags, tickedNodes.value ?? []);
  },
);
</script>

<style lang="scss">
.options-dropdown {
  .q-icon {
    color: #757575 !important;
  }
}
</style>
