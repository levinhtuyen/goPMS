<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGuestHistoryQuery } from '../apis/getGuestHistoryQuery';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';

interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
const guestId = ref(-1);
const guestName = ref();
const enabledGuestQuery = computed(() => {
  return !!guestId.value;
});
const setupGuestHistoryDialog = async (sn: number, fullName: string) => {
  guestId.value = sn;
  guestName.value = fullName;
  refetchGuest.value();
};
const currentPage = ref(1);
const {
  data: dataGuestHistoryDetail,
  isLoading: isLoadingGuestHistory,
  refetch: refetchGuest,
} = useGuestHistoryQuery(
  {
    guestId: guestId,
    page: currentPage,
  },
  {
    enabled: enabledGuestQuery.value,
  },
);
// const $q = useQuasar();
const { t } = useI18n();

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
defineExpose({
  setupGuestHistoryDialog,
});
const columns = computed(() => [
  {
    name: 'bookingNo',
    label: t('booking_no'),
    field: 'bookingNo',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'roomName',
    label: t('room'),
    field: 'roomName',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'checkIn',
    label: t('arrival_date_time'),
    field: 'checkIn',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'checkOut',
    label: t('departure_date_time'),
    field: 'checkOut',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'bookingStatusSn',
    label: t('booking_status'),
    field: 'bookingStatusSn',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'bookingSourceName',
    label: t('booking_source'),
    field: 'bookingSourceName',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'bookingPrice',
    label: t('booking_price'),
    field: 'bookingPrice',
    align: 'right' as TAlignColumn,
  },
]);
</script>

<template>
  <q-dialog ref="dialogHistory" v-model="dialogVisible" full-width full-height>
    <q-card>
      <q-toolbar full-width full-height>
        <q-toolbar-title
          ><span class="text-weight-bold">{{ t('guest_history') }} - {{ guestName }} </span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div>
        <div>
          <div v-if="isLoadingGuestHistory">
            <q-inner-loading
              :showing="isLoadingGuestHistory"
              label="Please wait..."
              label-class="text-teal"
              label-style="font-size: 1.1em"
            />
          </div>
          <div v-else class="custom-table">
            <q-table
              v-if="dataGuestHistoryDetail?.data"
              full-width
              full-height
              :rows="dataGuestHistoryDetail?.data?.guestHistoryList"
              :columns="columns"
              :table-colspan="9"
              row-key="index"
              class="q-px-md"
              no-data-label="No data"
              virtual-scroll
              :virtual-scroll-item-size="48"
              :rows-per-page-options="[0]"
              hide-pagination
              hide-bottom
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    style="font-size: 14px; font-weight: bold; height: 42px"
                    :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template #body="props">
                <q-tr :props="props" :class="props.rowIndex % 2 ? '' : 'bg-grey-2'">
                  <q-td key="bookingNo" :props="props">
                    {{ props.row.bookingNo }}
                  </q-td>
                  <q-td key="roomName" :props="props">
                    {{ props.row.roomName }}
                  </q-td>
                  <q-td key="checkIn" :props="props">
                    {{
                      date.formatDate(
                        (props.row.checkIn ? props.row.checkIn : undefined) * 1000,
                        FORMAT_DATE_TIME_UI,
                      )
                    }}
                  </q-td>
                  <q-td key="checkOut" :props="props">
                    {{
                      date.formatDate(
                        (props.row.checkOut ? props.row.checkOut : undefined) * 1000,
                        FORMAT_DATE_TIME_UI,
                      )
                    }}
                  </q-td>

                  <q-td key="bookingStatusSn" :props="props">
                    <div v-if="props.row.bookingStatusSn === 1" class="text-orange-11">
                      {{ t('created') }}
                    </div>
                    <div v-else-if="props.row.bookingStatusSn === 2" class="text-green-11">
                      {{ t('checked_in') }}
                    </div>
                    <div v-else-if="props.row.bookingStatusSn === 3" class="text-grey-11">
                      {{ t('cancelled') }}
                    </div>
                    <div v-else-if="props.row.bookingStatusSn === 4" class="text-deep-orange-11">
                      {{ t('not_arrived_yet') }}
                    </div>
                    <div v-else-if="props.row.bookingStatusSn === 5" class="text-amber-11">
                      {{ t('not_gone_yet') }}
                    </div>
                    <div v-else-if="props.row.bookingStatusSn === 6" class="text-blue-11">
                      {{ t('checked_out') }}
                    </div>
                  </q-td>

                  <q-td key="bookingSourceName" :props="props">
                    {{ props.row.bookingSourceName }}
                  </q-td>
                  <q-td key="bookingPrice" :props="props">
                    {{ formatMoney(props.row.bookingPrice) }} VND
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <div class="row justify-center q-mt-md">
              <q-pagination
                v-model="currentPage"
                :max="dataGuestHistoryDetail?.data?.meta?.lastPage || 1"
                :max-pages="6"
                color="negative"
                direction-links
              />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">
.custom-table
  width: 100%
  .q-table__container
    width:100% !important
  .q-dialog__inner--minimized div
    max-width: 100% !important
  .q-table__card
    min-height: 75vh
    box-shadow: unset
</style>
