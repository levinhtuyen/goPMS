<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useNotify } from '~/composable/useNotify';
import { createNewDate } from '~/composable/useCreateDate';
import { isMinStartSmallerThanEnd } from '~/composable/useValidate';
import { date } from 'quasar';
import { useChangeStayDateMutation } from '../apis/useChangeStayDateMutation';
import { useI18n } from '~/composable/useI18n';
import { FORMAT_DATE_TIME_UI, FORMAT_DATE_TIME_PICKER } from '~/constants';
import { useRoute } from 'vue-router';
export interface ICancelReservationDialog {
  setupChangeStayDateDialog(
    bookingSn: number | null,
    name: string | null,
    guest: string | null,
    checkIn: number,
    checkOut: number,
    roomStatusSn: number | null,
  ): void;
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'changeSuccess'): void;
}
interface Props {
  modelValue: boolean;
}
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
const { t } = useI18n();
const roomStatusSn = ref<number | null>(null);
const { notifyUpdateSuccess } = useNotify();
const changeStayDateMutation = useChangeStayDateMutation();
const guestName = ref<string | null>('');
const roomName = ref<string | null>('');
const changeStayDateFomRef = ref<HTMLFormElement>();
const { formatDate, subtractFromDate } = date;
// const { t } = useI18n();
const formData = reactive({
  sn: null as number | null,
  checkIn: (Date.now() / 1000) as number,
  checkOut: (Date.now() / 1000) as number,
});
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
// computed
const checkIn = computed({
  get: () => {
    return formatDate(new Date(formData.checkIn * 1000), FORMAT_DATE_TIME_PICKER);
  },
  set: (val) => {
    formData.checkIn = Number(formatDate(new Date(val), 'X'));
  },
});
const checkOut = computed({
  get: () => {
    return formatDate(new Date(formData.checkOut * 1000), FORMAT_DATE_TIME_PICKER);
  },
  set: (val) => {
    formData.checkOut = Number(formatDate(new Date(val), 'X'));
  },
});
const setReadonlyForCheckIn = computed(() => {
  const route = useRoute();
  if ((route.name === 'BookingDetails' || route.name === 'RoomView') && roomStatusSn.value === 3) {
    return true;
  } else if (
    (route.name === 'BookingDetails' || route.name === 'RoomView') &&
    roomStatusSn.value === 5
  ) {
    return true;
  } else if (
    (route.name === 'BookingDetails' || route.name === 'RoomView') &&
    roomStatusSn.value === 6
  ) {
    return true;
  }
  return false;
});
// methods
const checkInOptions = (date: string) => {
  return new Date(date) >= subtractFromDate(new Date(), { day: 1 });
};
const checkOutOptions = (date: string) => {
  const checkInOptions = checkIn.value
    ? createNewDate(formatDate(checkIn.value, FORMAT_DATE_TIME_UI))
    : '';
  if (checkInOptions) {
    checkInOptions.setHours(0, 0, 0);
  }
  return checkInOptions ? new Date(date) >= checkInOptions : new Date(date) >= new Date();
};
const changeStayDate = () => {
  changeStayDateFomRef.value?.validate().then((success: boolean) => {
    if (success) {
      changeStayDateMutation.mutate(
        {
          sn: formData.sn,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
        },
        {
          onSuccess: (data: any) => {
            if (data) {
              notifyUpdateSuccess();
              emits('changeSuccess');
            }
          },
        },
      );
    } else {
      return false;
    }
  });
  // changeStayDateMutation.mutate(() => {});
};
const setupChangeStayDateDialog = async (
  bookingSn: number | null,
  name: string | null,
  guest: string | null,
  checkIn: number,
  checkOut: number,
  roomStatus: number | null,
) => {
  formData.sn = bookingSn;
  guestName.value = guest;
  roomName.value = name;
  formData.checkIn = checkIn;
  formData.checkOut = checkOut;
  roomStatusSn.value = roomStatus;
  // refetchReservationList.value();
};
// defineExpose
defineExpose<ICancelReservationDialog>({
  setupChangeStayDateDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="padding: 0 32px 24px 32px; width: 486px">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">{{ t('change_stay_date') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator />
      <div class="row items-center justify-between q-mt-md">
        <p class="text-bold text-body1">{{ roomName }}</p>
        <p class="text-bold text-body1">{{ guestName }}</p>
      </div>
      <q-card-section class="q-pa-none q-py-md">
        <q-form ref="changeStayDateFomRef" class="q-gutter-md">
          <div class="col">
            <p class="q-mb-xs">{{ t('arrival_date_time') }}*</p>
            <q-field
              v-model="checkIn"
              :placeholder="t('select_date_time')"
              filled
              dense
              class="custom-input-readonly"
              debounce="500"
              :rules="[
                (val) => !!val || 'Please input Arrival date time',
                () =>
                  isMinStartSmallerThanEnd(
                    formatDate(new Date(), 'DD/MM/YYYY HH:mm'),
                    formatDate(checkIn, FORMAT_DATE_TIME_UI),
                  ) || t('the_time_must_be_greater_than_current_time'),
              ]"
              :bg-color="setReadonlyForCheckIn ? 'grey-5' : ''"
              :readonly="setReadonlyForCheckIn"
              :disable="setReadonlyForCheckIn"
            >
              <template #prepend>
                <q-icon name="event" :class="setReadonlyForCheckIn ? '' : 'cursor-pointer'">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="checkIn"
                      :mask="FORMAT_DATE_TIME_PICKER"
                      :options="checkInOptions"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formatDate(checkIn, FORMAT_DATE_TIME_UI) }}
                </div>
              </template>
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="checkIn" :mask="FORMAT_DATE_TIME_PICKER" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
          </div>
          <div class="col">
            <p class="q-mb-xs">{{ t('departure_date_time') }}*</p>
            <q-field
              v-model="checkOut"
              placeholder="Select date time"
              filled
              dense
              debounce="500"
              :rules="[
                (val) => !!val || 'Please input Departure date time',
                (val) =>
                  isMinStartSmallerThanEnd(
                    formatDate(checkIn, FORMAT_DATE_TIME_UI),
                    formatDate(checkOut, FORMAT_DATE_TIME_UI),
                  ) || t('the_time_must_be_greater_than_arrival_date_time'),
              ]"
            >
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="checkOut"
                      :mask="FORMAT_DATE_TIME_PICKER"
                      :options="checkOutOptions"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formatDate(checkOut, FORMAT_DATE_TIME_UI) }}
                </div>
              </template>
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="checkOut" :mask="FORMAT_DATE_TIME_PICKER" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal text-right">
        <q-btn v-close-popup no-caps outline color="grey-8" style="padding: 8px 20px">
          {{ t('cancel') }}</q-btn
        >
        <q-btn no-caps color="negative" style="padding: 8px 20px" @click="changeStayDate">{{
          t('save')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.custom-input-readonly :deep(.q-field__control) {
  &::before {
    border: none;
  }
}
</style>
