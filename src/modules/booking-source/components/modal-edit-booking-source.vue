<template>
  <q-dialog v-model="dialogVisible" @hide="onDialogHide">
    <q-card class="custom-size-dialog hight-block-loading">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>
            <div class="text-h6 q-ma-none text-weight-bold">
              {{ t('edit_booking_source') }}
            </div>
          </q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div>
        <div v-if="isLoadingBookingSourceEdit" class="wrapper q-pa-md">
          <q-inner-loading
            :showing="isLoadingBookingSourceEdit"
            label="Please wait..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </div>
        <q-form v-else ref="editBookingSource" class="q-gutter-md" @submit.prevent.stop="onSubmit">
          <q-inner-loading v-if="isLoadingBookingSourceEdit" showing color="red" />
          <q-card-section class="row">
            <div class="col-12 col-md-6 q-pa-sm">
              <p class="q-ma-none text-weight-bold">{{ t('booking_source_name') }}<span>*</span></p>
              <q-input
                v-model="dataForm.name"
                filled
                dense
                :placeholder="t('input_booking_source_name')"
                lazy-rules
                :rules="[...isRequiredRules, ...isLengthFrom1To50Rules]"
              />
            </div>
            <div class="col-12 col-md-6 q-pa-sm">
              <p class="q-ma-none text-weight-bold">{{ t('booking_source_code') }}<span>*</span></p>
              <q-input
                v-model="dataForm.code"
                filled
                dense
                :placeholder="t('input_booking_source_code')"
                lazy-rules
                :rules="[...isRequiredRules, ...isLengthFrom1To20Rules]"
              />
            </div>
            <div class="col-12 col-md-12 q-pa-sm">
              <p class="q-ma-none text-weight-bold">{{ t('description') }}</p>
              <q-input
                ref="description"
                v-model="dataForm.description"
                filled
                dense
                :placeholder="t('input_description')"
                lazy-rules
                :rules="isLengthFrom1To50Rules"
                :error="descriptionErr"
              >
                <template #error>
                  <p>
                    {{ t('the_length_is_from_0_to_50_characters') }}
                  </p>
                </template>
              </q-input>
            </div>
            <div class="row col-md-12 justify-end q-pa-md">
              <q-btn
                v-close-popup
                :label="t('cancel')"
                dense
                class="q-mr-md"
                outline
                no-caps
                color="grey-8"
                style="padding: 8px 20px"
                @click="onCancel"
              />
              <q-btn :label="t('save')" type="submit" no-caps color="negative" />
            </div>
          </q-card-section>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useUpdateBookingSourceMutation } from '../api/useUpdateBookingSourceMutation';
import { useBookingSourceByIdQuery, IBookingSourceByIdQuery } from '../api/getBookingSourceById';
import { useQuasar } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { useRule } from '~/composable/useValidate';

const { t } = useI18n();
const $q = useQuasar();
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
const editBookingSource = ref<HTMLFormElement>();
const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
const mutation = useUpdateBookingSourceMutation();
// data
const bookingId = ref(-1);
const enabledBookingSourcesQuery = computed(() => {
  return !!bookingId.value;
});
const dataForm = ref<IBookingSourceByIdQuery>({
  code: '',
  description: '',
  name: '',
  sn: 0,
});
const { notifyUpdateSuccess } = useNotify();
const setupBookingSourceEditDialog = async (sn: number) => {
  bookingId.value = sn;
  refetchBookingSource.value();
};
defineExpose({
  setupBookingSourceEditDialog,
});
const {
  data: dataBooking,
  isLoading: isLoadingBookingSourceEdit,
  refetch: refetchBookingSource,
} = useBookingSourceByIdQuery(bookingId, {
  enabled: enabledBookingSourcesQuery.value,
});

watch(dataBooking, () => {
  dataForm.value = JSON.parse(dataBooking.value || '[]');
  dataForm.value.description === null
    ? (dataForm.value.description = '')
    : dataForm.value.description;
});

const { isRequiredRules, isLengthFrom1To50Rules, isLengthFrom1To20Rules } = useRule();

const descriptionErr = computed(() => dataForm.value?.description?.length > 50);
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
// watch
// methos
const onDialogHide = () => {
  onCancel();
};
const onCancel = () => {
  dataForm.value = JSON.parse(dataBooking.value || '[]');
};
const onSubmit = () => {
  editBookingSource.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      const dataFormEdit = ref({
        bookingSourceSn: 0,
        ...dataForm.value,
      });
      dataFormEdit.value.bookingSourceSn = dataForm.value.sn;
      mutation.mutate(dataFormEdit.value, {
        onSuccess: (response: any) => {
          if (response?.code === 1) {
            notifyUpdateSuccess();
            setTimeout(() => {
              emits('close');
            }, 600);
          } else if (response?.code === 2) {
            const err = response?.error;
            err.forEach(
              (val: {
                message: string | undefined;
                [key: string]: string | object | undefined;
              }) => {
                $q.notify({
                  message: val.message,
                  position: 'top',
                  type: 'negative',
                  actions: [{ color: 'white' }],
                });
              },
            );
          }
          //
        },
      });
    }
  });
};
</script>
<style lang="sass" scoped>
.custom-size-dialog
  width: 876px

.q-dialog__inner--minimized div
  max-width: 876px
</style>
