<template>
  <div>
    <div class="text-weight-medium text-h6">{{ t('device.sensors') }}</div>
    <div v-if="dataPointTagTree.children" class="column q-mt-sm q-gutter-y-sm">
      <q-tree
        v-model:ticked="tickedNodes"
        v-model:expanded="expanded"
        :nodes="dataPointTagTree.children"
        node-key="uid"
        label-key="name"
        tick-strategy="leaf"
        :no-nodes-label="t('device.no_sensors')"
        default-expand-all
        :class="noChildren ? 'no-children' : ''"
      >
        <template #default-header="prop">
          <div
            v-if="prop.node.dataPointTag"
            class="text-weight-medium text-primary cursor-pointer"
            @click="prop.ticked = !prop.ticked"
            @mousedown.prevent
          >
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            {{ prop.node.name }} ({{ prop.node.dataPointTag.unit }})
          </div>
          <div v-else>
            {{ prop.node.name }}
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { extractNodeKeys } from '@/utils/data-point-tag-nodes';
import { computed } from 'vue';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const tickedNodes = defineModel<string[]>('tickedNodes');
const props = defineProps({
  dataPointTagTree: {
    type: Object as PropType<DataPointTagNode>,
    required: true,
  },
});

const { t } = useI18n();

const expanded = ref<string[]>(extractNodeKeys(props.dataPointTagTree));

const noChildren = computed(() => {
  return props.dataPointTagTree.children?.every((node) => node.dataPointTag) ?? false;
});
</script>

<style lang="scss">
.no-children {
  .q-tree__node-header {
    padding-left: 0 !important;
    padding-bottom: 0.5rem;
  }
}
</style>
