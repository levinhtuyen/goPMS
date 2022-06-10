<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, watch } from 'vue';
import { useBookingArrivalsQuery } from './apis/useBookingArrivalsQuery';
import { useBookingDeparturesQuery } from './apis/useBookingDeparturesQuery';
import { useBookingInHouseGuestQuery } from './apis/useBookingInHouseGuestsQuery';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { useI18n } from '~/composable/useI18n';
import { i18n } from '~/plugins/i18n';

const { t } = useI18n();
const tab = ref<string>('arrival');
const LIMIT = 10;
interface IBookingArrivalsRow {
  arrivalDatetime: string;
  bookingNo: number;
  departureDatetime: string;
  guestName: string;
  guestSn: number;
  roomName: string;
  roomSn: number;
  sn: number;
  timeToStay: string;
}
const now = ref<Date>(new Date());
onMounted(() => {
  setRealTime(false);
});
onUnmounted(() => {
  setRealTime(true);
});
const setRealTime = (pause: boolean) => {
  if (pause) {
    return;
  }
  setTimeout(() => {
    now.value = new Date();
    setRealTime(false);
  }, 60000);
};
const { formatDate } = date;
const pageBookingArrival = ref(1);
const pageDepartures = ref(1);
const pageInHouseGuest = ref(1);
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const enabledArrivalQuery = computed(() => tab.value === 'arrival');
const enabledDepartureQuery = computed(() => tab.value === 'departure');
const enabledBookingInHouseQuery = computed(() => tab.value === 'inHouseGuest');
// vue-query
const {
  data: bookingArrivalsData,
  isFetching: isFetchingBookingArrival,
  refetch: refetchBookingArrival,
} = useBookingArrivalsQuery(pageBookingArrival, LIMIT, enabledArrivalQuery);
const {
  data: bookingDeparturesData,
  isFetching: isFetchingBookingDepartures,
  refetch: refetchBookingDepartures,
} = useBookingDeparturesQuery(pageDepartures, LIMIT, enabledDepartureQuery);
const {
  data: bookingInHouseGuestData,
  isFetching: isFetchingBookingInHouseGuest,
  refetch: refetchBookingInHouseGuest,
} = useBookingInHouseGuestQuery(pageInHouseGuest, LIMIT, enabledBookingInHouseQuery);
const bookingArrivals = computed(() => {
  if (!bookingArrivalsData.value?.bookingList) {
    return [];
  }
  let rows = [] as IBookingArrivalsRow[];
  rows = rows?.concat(
    bookingArrivalsData.value?.bookingList.map((r, index) => ({
      ...r,
      index: index + pageBookingArrival.value,
    })),
  );
  return rows;
});
const bookingInHouseGuest = computed(() => {
  if (!bookingInHouseGuestData.value?.bookingList) {
    return [];
  }
  let rows = [] as IBookingArrivalsRow[];
  rows = rows?.concat(
    bookingInHouseGuestData.value?.bookingList.map((r, index) => ({
      ...r,
      index:
        pageInHouseGuest.value < 2 ? index + 1 : `${pageInHouseGuest.value - 1}` + `${index + 1}`,
    })),
  );
  return rows;
});
const bookingDepartures = computed(() => {
  if (!bookingDeparturesData.value?.bookingList) {
    return [];
  }
  let rows = [] as IBookingArrivalsRow[];
  rows = rows?.concat(
    bookingDeparturesData.value?.bookingList.map((r, index) => ({
      ...r,
      index: index + pageBookingArrival.value,
    })),
  );
  return rows;
});
// const actualCheckIn = computed(() => {
//   return (actualCheckIn: string) => {
//     if (!actualCheckIn) {
//       return '';
//     }
//     const dateActualCheckIn = new Date(actualCheckIn);
//     const diffDay = getDateDiff(now.value, dateActualCheckIn, 'days');
//     const diffHour = getDateDiff(now.value, dateActualCheckIn, 'hours');
//     const diffMinute = getDateDiff(now.value, dateActualCheckIn, 'minutes');
//     return `${diffDay} day(s), ${diffHour % 24} hour(s), ${(diffMinute % 1440) % 60} minute(s)`;
//   };
// });

watch(
  () => (i18n.global.locale as any).value,
  () => {
    refetchBookingArrival.value();
    refetchBookingDepartures.value();
    refetchBookingInHouseGuest.value();
  },
);

const columns = computed(() => {
  const labelArrivalDateTime =
    tab.value === 'arrival' ? 'arrival_date_time' : 'actual_checked_in_date_time';
  const fieldArrivalDateTime = tab.value === 'arrival' ? 'arrivalDatetime' : 'actualCheckIn';
  return [
    {
      name: 'index',
      label: t('no'),
      field: 'index',
      align: 'center' as TAlignColumn,
    },
    {
      name: 'roomName',
      required: true,
      label: t('room'),
      align: 'left' as TAlignColumn,
      field: 'roomName',
    },
    {
      name: 'bookingNo',
      align: 'left' as TAlignColumn,
      label: t('booking_no'),
      field: 'bookingNo',
      style: 'color: #C2410C',
    },
    {
      name: 'guestName',
      align: 'left' as TAlignColumn,
      label: t('guest_name'),
      field: 'guestName',
    },
    {
      name: fieldArrivalDateTime,
      align: 'left' as TAlignColumn,
      label: t(labelArrivalDateTime),
      field: fieldArrivalDateTime,
      format: (val: number) => `${formatDate(Number(val * 1000), FORMAT_DATE_TIME_UI)}`,
    },
    {
      name: 'departureDatetime',
      align: 'left' as TAlignColumn,
      label: t('departure_date_time'),
      field: 'departureDatetime',
      format: (val: number) => `${formatDate(Number(val * 1000), FORMAT_DATE_TIME_UI)}`,
    },
    {
      name: 'timeToStay',
      align: 'left' as TAlignColumn,
      label: t('time_to_stay'),
      field: 'timeToStay',
    },
  ];
});
</script>
<template>
  <pms-sections>
    <div class="row justify-center q-mb-md">
      <q-tabs
        v-model="tab"
        dense
        active-color="white"
        align="justify"
        indicator-color="transparent"
        class="box-shadow-tabs col-xs-11 col-md-6 col-lg-4 col-sm-02 row"
        active-bg-color="negative"
      >
        <q-tab name="arrival" :label="t('arrival')" class="col custom-tab" no-caps />
        <q-tab name="departure" :label="t('departure')" class="col custom-tab" no-caps />
        <q-tab name="inHouseGuest" :label="t('inhouse_guest')" class="col custom-tab" no-caps />
      </q-tabs>
    </div>
    <div>
      <q-tab-panels v-model="tab">
        <!-- arrival -->
        <q-tab-panel name="arrival">
          <q-table
            table-header-class="custom-header"
            row-key="roomName"
            :rows="bookingArrivals"
            :columns="columns"
            hide-pagination
            no-data-label="No data"
            :rows-per-page-options="[0]"
            hide-bottom
          >
            <template #header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body-cell="props">
              <q-td v-if="props.col.name === 'bookingNo'">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{ name: 'BookingDetails', params: { sn: props.row?.sn } }"
                >
                  {{ props.value }}
                </router-link>
              </q-td>
              <q-td v-else :props="props"> {{ props.value }} </q-td>
            </template>
          </q-table>
          <div class="q-mt-md row justify-end">
            <q-pagination
              v-model="pageBookingArrival"
              color="negative"
              :max="bookingArrivalsData?.meta?.lastPage || 1"
              :max-pages="5"
              boundary-numbers
              direction-links
              push
            />
          </div>
          <q-inner-loading :showing="isFetchingBookingArrival" style="height: 500px">
            <div lass="full-width full-height q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>
        </q-tab-panel>
        <!-- departure -->
        <q-tab-panel name="departure">
          <q-table
            row-key="roomName"
            :rows="bookingDepartures"
            :columns="columns"
            no-data-label="No data"
            hide-pagination
            :rows-per-page-options="[0]"
            hide-bottom
          >
            <template #header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body-cell="props">
              <q-td v-if="props.col.name === 'bookingNo'">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{ name: 'BookingDetails', params: { sn: props.row?.sn } }"
                >
                  {{ props.value }}
                </router-link>
              </q-td>
              <q-td v-else-if="props.col.name === 'timeToStay' && tab !== 'arrival'">
                {{ props.row.timeToStay }}
              </q-td>
              <q-td v-else :props="props"> {{ props.value }} </q-td>
            </template>
          </q-table>
          <div class="q-mt-md row justify-end">
            <q-pagination
              v-model="pageDepartures"
              color="negative"
              :max="bookingDeparturesData?.meta?.lastPage || 1"
              :max-pages="5"
              boundary-numbers
              direction-links
              push
            />
          </div>
          <q-inner-loading :showing="isFetchingBookingDepartures" style="height: 500px">
            <div lass="full-width full-height q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>
        </q-tab-panel>
        <q-tab-panel name="inHouseGuest">
          <q-table
            row-key="roomName"
            :rows="bookingInHouseGuest"
            :columns="columns"
            hide-pagination
            :rows-per-page-options="[0]"
            hide-bottom
          >
            <template #header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body-cell="props">
              <q-td v-if="props.col.name === 'bookingNo'">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{ name: 'BookingDetails', params: { sn: props.row?.sn } }"
                >
                  {{ props.value }}
                </router-link>
              </q-td>
              <q-td v-else-if="props.col.name === 'timeToStay' && tab !== 'arrival'">
                {{ props.row.timeToStay }}
              </q-td>
              <q-td v-else :props="props"> {{ props.value }} </q-td>
            </template>
          </q-table>
          <div class="q-mt-md row justify-end">
            <q-pagination
              v-model="pageInHouseGuest"
              color="negative"
              no-data-label="No data"
              :max="bookingInHouseGuestData?.meta?.lastPage || 1"
              :max-pages="5"
              boundary-numbers
              direction-links
              push
            />
          </div>
          <q-inner-loading :showing="isFetchingBookingInHouseGuest" style="height: 500px">
            <div lass="full-width full-height q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </pms-sections>
</template>
<style lang="scss" scoped>
.custom-link {
  &:hover {
    font-weight: 600;
  }
}

.box-shadow-tabs {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.custom-tab {
  color: #9a9a9a;
  width: 176px;
  border-radius: 4px;
}

.q-tab-panel {
  padding: 6px;
}
</style>
