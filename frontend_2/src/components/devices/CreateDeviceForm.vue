<template>
  <q-card class="q-pa-sm shadow">
    <q-stepper ref="stepper" v-model="createStep" animated vertical header-nav keep-alive>
      <q-step :name="1" :title="t('device.device_info')" :icon="mdiPencil">
        <q-form class="q-py-md q-px-sm">
          <div class="row q-col-gutter-y-sm q-col-gutter-x-lg">
            <q-input
              ref="nameRef"
              v-model="deviceInput.name"
              :disable="loadingDevice"
              :rules="nameRules"
              class="col-12"
              :label="t('global.name')"
            />
            <q-select
              ref="typeRef"
              v-model="deviceInput.type"
              :disable="loadingDevice"
              :rules="typeRules"
              class="col-12"
              :label="t('device.device_type')"
              :options="Object.values(DeviceTypeEnum)"
            >
            </q-select>
            <q-input
              ref="macRef"
              v-model="deviceInput.mac"
              :disable="loadingDevice"
              :rules="macRules"
              class="col-12 col-md-6"
              :label="t('device.mac_address')"
            />
            <q-input
              ref="initApiKeyRef"
              v-model="deviceInput.initApiKey"
              :error="false"
              :disable="loadingDevice"
              class="col-12 col-md-6"
              :label="t('device.api_key')"
            />
            <q-input
              ref="firmwareRef"
              v-model="deviceInput.firmware"
              :error="false"
              :disable="loadingDevice"
              class="col-12 col-md-6"
              :label="t('device.firmware')"
            />
            <q-input
              v-model="deviceInput.version"
              :disable="loadingDevice"
              :error="false"
              class="col-12 col-md-6"
              :label="t('device.version')"
            />
          </div>
          <q-card-actions align="left" class="text-primary q-mt-sm q-px-none">
            <q-btn
              unelevated
              color="primary"
              :label="t('global.next')"
              padding="7px 40px"
              no-caps
              type="submit"
              @click.prevent="goToStep(2)"
            />
          </q-card-actions>
        </q-form>
      </q-step>
      <q-step :name="2" :title="t('device.add_sensors')" :icon="matSensors">
        <q-form>
          <div v-for="(dataPointTag, index) in remoteDataPointTags" :key="index">
            <data-point-tag-form
              ref="remoteDataPointTagFormRef"
              v-model="remoteDataPointTags[index]"
              :disable="loadingDevice"
              @remove="deleteRemoteDataPointTag(dataPointTag.uid)"
            />
          </div>
          <div v-for="(dataPointTag, index) in localDataPointTags" :key="index">
            <data-point-tag-form
              ref="remoteDataPointTagFormRef"
              v-model="localDataPointTags[index]"
              :disable="loadingDevice"
              @remove="deleteLocalDataPointTag(index)"
            />
          </div>
          <q-btn
            class="full-width q-mb-md q-mt-sm"
            outline
            :icon="mdiPlusCircle"
            :disable="loadingDevice"
            color="primary"
            no-caps
            padding="12px 30px"
            :label="t('device.add_sensor')"
            @click="addLocalDataPointTag"
          />
          <q-btn
            unelevated
            color="primary"
            :label="t('global.save')"
            :disable="loadingDevice"
            padding="7px 35px"
            :loading="submittingForm"
            no-caps
            type="submit"
            @click.prevent="submitForm"
          />
        </q-form>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script setup lang="ts">
import DeviceTypeEnum from '@/models/DeviceType';
import { DataPointTagInput, DataPointTag } from '@/models/DataPointTag';
import { ref, toRaw } from 'vue';
import { Device, DeviceInput, deviceToInput, getEmptyDeviceInput } from '@/models/Device';
import { toast } from 'vue3-toastify';
import deviceService from '@/services/DeviceService';
import dataPointTagService from '@/services/DataPointTagService';
import { useRouter } from 'vue-router';
import { handleError } from '@/utils/error-handler';
import { useI18n } from 'vue-i18n';
import { QField, QInput } from 'quasar';
import { isFormValid } from '@/utils/form-validation';
import DataPointTagForm from './DataPointTagForm.vue';
import { mdiPencil, mdiPlusCircle } from '@quasar/extras/mdi-v6';
import { matSensors } from '@quasar/extras/material-icons';
import { useDeviceStore } from '@/stores/device-store';

const props = defineProps({
  editingDeviceId: {
    type: String,
    default: null,
  },
});

const { t } = useI18n();
const router = useRouter();
const deviceStore = useDeviceStore();

const loadingDevice = ref(false);
const deviceInput = ref<DeviceInput>(deviceStore.getDeviceById(props.editingDeviceId) ?? getEmptyDeviceInput());
const createStep = ref(1);
const submittingForm = ref(false);

const remoteDataPointTags = ref<DataPointTag[]>([]);
const originalRemoteDataPointTags = ref<DataPointTag[]>([]);
const localDataPointTags = ref<DataPointTagInput[]>([]);

function goToStep(step: number) {
  if (createStep.value == 1) {
    const firstStepForm = [nameRef.value, macRef.value, typeRef.value];
    if (!isFormValid(firstStepForm)) return;
  }
  createStep.value = step;
}

async function createDevice(): Promise<Device | undefined> {
  let createdDevice!: Device;
  try {
    createdDevice = await deviceService.createDevice(deviceInput.value);
  } catch (error) {
    handleError(error, t('device.toasts.create_failed'));
  }
  return createdDevice;
}

async function getEditingDevice() {
  try {
    loadingDevice.value = true;
    const editingDevice = await deviceService.getDevice(props.editingDeviceId);
    deviceInput.value = deviceToInput(editingDevice);
    remoteDataPointTags.value = editingDevice.dataPointTags;
    originalRemoteDataPointTags.value = structuredClone(toRaw(remoteDataPointTags.value));
  } catch (error) {
    handleError(error, t('device.toasts.loading_failed'));
  } finally {
    loadingDevice.value = false;
  }
}
if (props.editingDeviceId) getEditingDevice();

async function updateDevice(): Promise<Device | undefined> {
  let editedDevice!: Device;
  if (!props.editingDeviceId) return;

  try {
    editedDevice = await deviceService.updateDevice(deviceInput.value, props.editingDeviceId);
  } catch (error) {
    handleError(error, t('device.toasts.update_failed'));
  }
  return editedDevice;
}

async function submitForm() {
  const firstStepForm = [nameRef.value, macRef.value, typeRef.value];
  const firstStepValid = isFormValid(firstStepForm);

  const allDataPointTagsValid = localDataPointTagFormRef.value
    .concat(remoteDataPointTagFormRef.value)
    .map((form) => form.validate())
    .every((isValid) => isValid);

  if (!firstStepValid) {
    createStep.value = 1;
    return;
  }

  if (!allDataPointTagsValid) {
    createStep.value = 2;
    return;
  }

  submittingForm.value = true;
  const device = props.editingDeviceId ? await updateDevice() : await createDevice();

  if (!device) {
    submittingForm.value = false;
    return;
  }

  await Promise.all([createDataPointTags(device.uid), updateDataPointTags()]);

  submittingForm.value = false;

  toast.success(props.editingDeviceId ? t('device.toasts.update_success') : t('device.toasts.create_success'));

  router.push(`/devices/${device.uid}`);
}

async function deleteRemoteDataPointTag(id: string) {
  try {
    await dataPointTagService.deleteDataPointTag(id);
    remoteDataPointTags.value = remoteDataPointTags.value.filter((dataPointTag) => dataPointTag.uid !== id);
  } catch (error) {
    handleError(error, t('device.toasts.tag.delete_failed'));
  }
}

function addLocalDataPointTag() {
  localDataPointTags.value.push({
    tag: '',
    name: '',
    unit: '',
    decimal: 0,
  });
}
function deleteLocalDataPointTag(index: number) {
  localDataPointTags.value.splice(index, 1);
}
async function createDataPointTags(deviceUid: string) {
  for (const dataPointTag of localDataPointTags.value) {
    try {
      const createdDataPointTag = await dataPointTagService.createDataPointTag(dataPointTag);
      try {
        await dataPointTagService.addDataPointTagToDevice(deviceUid, createdDataPointTag.uid);
      } catch (error) {
        handleError(error, t('device.toasts.tag.add_tag_to_device_failed'));
      }
    } catch (error) {
      handleError(error, t('device.toasts.tag.create_failed'));
    }
  }
}
async function updateDataPointTags() {
  for (const dataPointTag of remoteDataPointTags.value) {
    const originalTag = originalRemoteDataPointTags.value.find((tag) => tag.uid === dataPointTag.uid);

    //Update only if tag has changed
    if (JSON.stringify(originalTag) !== JSON.stringify(dataPointTag)) {
      try {
        const updatedDataPointTag: DataPointTagInput = {
          tag: dataPointTag.tag,
          name: dataPointTag.name,
          unit: dataPointTag.unit,
          decimal: dataPointTag.decimal,
        };
        await dataPointTagService.updateDataPointTag(updatedDataPointTag, dataPointTag.uid);
      } catch (error) {
        handleError(error, t('device.toasts.tag.update_failed'));
      }
    }
  }
}

// Input validation
const nameRef = ref<QInput>();
const macRef = ref<QInput>();
const typeRef = ref<QField>();

const localDataPointTagFormRef = ref<(typeof DataPointTagForm)[]>([]);
const remoteDataPointTagFormRef = ref<(typeof DataPointTagForm)[]>([]);

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const macRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const typeRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
</script>
