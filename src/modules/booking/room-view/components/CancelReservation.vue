<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useCancelReservationMutation } from '../apis/useCancelReservationMutation';
import { useNotify } from '~/composable/useNotify';
// interface
export interface ICancelReservationDialog {
  setupCancelReservationDialog(bookingSn: number | null, bookingNo: string | null): void;
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancelSuccess'): void;
}
interface Props {
  modelValue: boolean;
}
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
const cancelReservationFomRef = ref<HTMLFormElement>();
const { t } = useI18n();
const { notifyCreateSuccess } = useNotify();

const formData = reactive({
  sn: null as number | null,
  reason: '' as string,
});
// vue-query
const cancelReservationMutation = useCancelReservationMutation();
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
// methods
const cancelReservation = () => {
  cancelReservationFomRef.value?.validate().then((success: boolean) => {
    if (success) {
      cancelReservationMutation.mutate(formData, {
        onSuccess: (data) => {
          if (data) {
            notifyCreateSuccess();
            emits('cancelSuccess');
          }
        },
      });
    } else {
      return false;
    }
  });
  // cancelReservationMutation.mutate(() => {});
};
const setupCancelReservationDialog = async (bookingSn: number | null) => {
  formData.sn = bookingSn;
  // refetchReservationList.value();
};
const resetFormData = () => {
  formData.sn = null;
  formData.reason = '';
};
// defineExpose
defineExpose<ICancelReservationDialog>({
  setupCancelReservationDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" @hide="resetFormData">
    <q-card class="q-pa-lg text-body1" style="width: 580px">
      <!-- <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">Cancel booking</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator /> -->
      <div class="row justify-start">{{ t('are_you_sure_cancel_booking') }}</div>
      <q-card-section class="q-pa-none q-pt-md">
        <q-form ref="cancelReservationFomRef" class="q-gutter-md">
          <q-input
            v-model="formData.reason"
            :placeholder="t('reason_placeholder')"
            class="col q-mr-md"
            filled
            :rules="[
              (val) => !!val || t('reason_cancel_booking_valid_require'),
              (val) => val.length <= 200 || t('reason_cancel_booking_valid_max'),
            ]"
            type="textarea"
            input-style="height: 100px;"
            style="min-height: 100px"
          >
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal row justify-end">
        <q-btn v-close-popup no-caps outline color="grey-8" style="padding: 8px 20px">
          {{ t('cancel') }}</q-btn
        >
        <q-btn no-caps color="negative" style="padding: 8px 20px" @click="cancelReservation">{{
          t('confirm')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
