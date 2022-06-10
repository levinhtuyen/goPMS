<script setup lang="ts">
import { computed, reactive } from 'vue';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { useReservationListQuery, IReservationListParams } from '../apis/useReservationListQuery';
import { useI18n } from '~/composable/useI18n';
// interface
export interface IReservationListDialog {
  setupReservationListDialog(roomSn: number | null, bookingNo: string | null): void;
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}
interface Props {
  modelValue: boolean;
}
const { t } = useI18n();
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
const query = reactive<IReservationListParams>({
  bookingNo: '',
  roomSn: null,
});
const { data: reservationList, isFetching: reservationListFetching } =
  useReservationListQuery(query);
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
const setupReservationListDialog = async (room: number | null, booking: string | null) => {
  query.roomSn = room;
  query.bookingNo = booking;
  // refetchReservationList.value();
};
// defineExpose
defineExpose<IReservationListDialog>({
  setupReservationListDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" :progress="reservationListFetching">
    <div class="bg-white" style="padding: 0 20px 24px 20px; max-width: 1500px; width: 832px">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">{{ t('reservations_list') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator class="q-mb-md" />
      <div>
        <div
          v-if="reservationList && reservationList[0]"
          class="bg-negative text-h6 text-bold text-white"
          style="border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 12px 16px"
        >
          {{ reservationList[0]?.name }}
        </div>
        <div v-if="!reservationList" class="text-grey-7 text-body1">{{ t('no_data') }}</div>
        <div v-else>
          <div
            v-for="(item, index) in reservationList"
            :key="index"
            class="row justify-between q-px-md q-pa-sm"
            style="border: 1px solid #dee2e6; border-top: none"
          >
            <div class="col">
              <div class="text-bold text-body1 q-mb-sm row">
                <p class="q-ma-none">{{ t('booking_no') }}:</p>
                <p class="q-ma-none">{{ item?.bookingNo }}</p>
              </div>
              <div class="text-body1 q-mb-sm row">
                <p class="q-ma-none">{{ t('guest_make') }}:</p>
                <p class="q-ma-none">{{ item?.guestName }}</p>
              </div>
            </div>
            <div class="q-py-sm q-px-md rounded-borders col" style="background-color: #faf7f6">
              <div class="text-body1 q-mb-sm row justify-between">
                <p class="q-ma-none">{{ t('arrival_date_time') }}:</p>
                <p class="q-ma-none">
                  {{ date.formatDate(new Date(Number(item?.checkIn) * 1000), FORMAT_DATE_TIME_UI) }}
                </p>
              </div>
              <div class="text-body1 q-mb-sm row justify-between">
                <p class="q-ma-none">{{ t('departure_date_time') }}:</p>
                <p class="q-ma-none">
                  {{
                    date.formatDate(new Date(Number(item?.checkOut) * 1000), FORMAT_DATE_TIME_UI)
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
