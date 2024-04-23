<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="q-pa-xs" :style="dialogStyle">
      <q-card-section>
        <div class="text-h6">
          <slot name="title" />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <slot />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="primary"
          :label="actionLabel"
          no-caps
          :loading="loading"
          padding="6px 20px"
          @click="emit('onSubmit')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  actionLabel: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  minWidth: {
    type: String,
    required: false,
    default: '350px',
  },
});
const emit = defineEmits(['onSubmit']);

const { t } = useI18n();
const $q = useQuasar();

const dialogStyle = computed(() => ({
  minWidth: $q.screen.gt.sm ? props.minWidth : undefined,
  width: !$q.screen.gt.sm ? '100%' : undefined,
}));
</script>
