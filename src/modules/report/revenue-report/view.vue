<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('revenue_report') }}</div>
      </div>

      <div class="row q-mb-md q-gutter-md">
        <div>
          <q-field placeholder="Select date time" dense stack-label filled @focus="onOpenDatePopUp">
            <template #control>
              <div
                v-if="dateRange.from && dateRange.to"
                class="self-center full-width no-outline"
                tabindex="0"
              >
                {{ date.formatDate(dateRange.from, FORMAT_DATE_UI) }} -
                {{ date.formatDate(dateRange.to, FORMAT_DATE_UI) }}
              </div>
            </template>
            <template #prepend>
              <q-icon name="event" class="no-pointer-events">
                <q-popup-proxy ref="qDateRef" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateRange" range />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-field>
        </div>
        <div style="min-width: 16%">
          <q-select
            v-model="formValues.bookingStatusSn"
            :options="arrayBookingStatuses"
            dense
            filled
            option-value="bookingStatusSn"
            option-label="typeName"
            map-options
            emit-value
            @update:model-value="onApply()"
          />
        </div>

        <div style="min-width: 16%">
          <q-select
            v-model="formValues.roomTypeSn"
            :loading="isRoomTypeFetching"
            :options="arrayRoomTypes"
            dense
            filled
            option-value="sn"
            option-label="name"
            map-options
            emit-value
            @update:model-value="onApply()"
          />
        </div>

        <div style="min-width: 16%">
          <q-select
            v-model="formValues.bookingSourceSn"
            :loading="useBookingSourcesFetching"
            filled
            dense
            :options="arrayBookingSources"
            option-value="sn"
            option-label="name"
            map-options
            emit-value
            @update:model-value="onApply()"
          />
        </div>
      </div>
    </template>

    <div class="relative-position">
      <q-inner-loading
        :showing="isFetching"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!isFetching">
        <q-table
          :rows-per-page-options="[0]"
          :rows="data?.revenueReportList"
          :columns="columns"
          hide-pagination
          hide-bottom
          row-key="no"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="no" :props="props">
                {{ formatIndexTable(formValues.page, props.rowIndex) }}
              </q-td>

              <q-td key="bookingNo" :props="props">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{
                    name: 'BookingDetails',
                    params: { sn: props.row?.sn },
                  }"
                >
                  {{ props.row.bookingNo }}
                </router-link>
              </q-td>

              <q-td key="bookingStatusSn" :props="props">
                <div v-if="props.row.bookingStatusSn === 1" class="text-orange-11">
                  {{ props.row.bookingStatusName }}
                </div>
                <div v-else-if="props.row.bookingStatusSn === 2" class="text-green-11">
                  {{ props.row.bookingStatusName }}
                </div>
                <div v-else-if="props.row.bookingStatusSn === 3" class="text-grey-11">
                  {{ props.row.bookingStatusName }}
                </div>
                <div v-else-if="props.row.bookingStatusSn === 4" class="text-deep-orange-11">
                  {{ props.row.bookingStatusName }}
                </div>
                <div v-else-if="props.row.bookingStatusSn === 5" class="text-amber-11">
                  {{ props.row.bookingStatusName }}
                </div>
                <div v-else-if="props.row.bookingStatusSn === 6" class="text-blue-11">
                  {{ props.row.bookingStatusName }}
                </div>
              </q-td>

              <q-td key="roomTypeName" :props="props" class="unset-white-space">
                <div class="slice-tooltip">
                  <div :data-title="props.row.roomTypeName">
                    {{ props.row.roomTypeName }}
                  </div>
                </div>
              </q-td>

              <q-td key="roomName" :props="props" class="unset-white-space">
                <div class="slice-tooltip">
                  <div :data-title="props.row.roomName">
                    {{ props.row.roomName }}
                  </div>
                </div>
              </q-td>

              <q-td key="bookingSourceName" :props="props" class="unset-white-space">
                <div class="slice-tooltip">
                  <div :data-title="props.row.bookingSourceName">
                    {{ props.row.bookingSourceName }}
                  </div>
                </div>
              </q-td>

              <q-td key="guestName" :props="props" class="unset-white-space">
                <div class="slice-tooltip">
                  <div :data-title="props.row.guestName">
                    {{ props.row.guestName }}
                  </div>
                </div>
              </q-td>

              <q-td key="checkIn" :props="props">
                {{ newDateStamp(props.row.checkIn, FORMAT_DATE_TIME_UI) }}
              </q-td>

              <q-td key="checkOut" :props="props">
                {{ newDateStamp(props.row.checkOut, FORMAT_DATE_TIME_UI) }}
              </q-td>

              <q-td key="roomPrice" :props="props">
                {{ formatMoney(props.row.roomPrice) }} VND
              </q-td>

              <q-td key="servicePrice" :props="props">
                {{ formatMoney(props.row.servicePrice) }} VND
              </q-td>

              <q-td key="extraFee" :props="props"> {{ formatMoney(props.row.extraFee) }} VND </q-td>

              <q-td key="discount" :props="props"> {{ formatMoney(props.row.discount) }} VND </q-td>

              <q-td key="totalRevenue" :props="props">
                {{ formatMoney(props.row.totalRevenue) }} VND
              </q-td>

              <q-td key="cash" :props="props"> {{ formatMoney(props.row.cash) }} VND </q-td>

              <q-td key="creditCard" :props="props">
                {{ formatMoney(props.row.creditCard) }} VND
              </q-td>

              <q-td key="bankTransfer" :props="props">
                {{ formatMoney(props.row.bankTransfer) }} VND
              </q-td>

              <q-td key="debt" :props="props"> {{ formatMoney(props.row.debt) }} VND </q-td>

              <q-td key="note" :props="props" class="unset-white-space">
                <div class="slice-tooltip slice-tooltip-2-line-clamp">
                  <div :data-title="props.row.note">
                    {{ props.row.note }}
                  </div>
                </div>
              </q-td>
              <q-td key="timeToStay" :props="props">
                {{ props.row.pricingPlanName }}
              </q-td>
              <q-td key="timeToStay" :props="props">
                {{ props.row.timeToStay }}
              </q-td>

              <q-td key="createByName" :props="props">
                {{ props.row.createByName }}
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="q-mt-md row justify-end">
          <q-pagination
            v-model="formValues.page"
            color="negative"
            :max="data?.meta.lastPage || 1"
            :max-pages="5"
            boundary-numbers
            direction-links
            push
          />
        </div>
      </div>
    </div>
  </pms-sections>
</template>

<script lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { formatIndexTable } from '~/composable/useFormat';
import { useBookingSourcesQuery, useRoomTypeQuery } from '~/apis/commons/useAppendixQuery';
import { BOOKING_STATUS_TYPES } from '~/modules/booking/room-view/const';
import {
  useRevenueReportQuery,
  IRevenueReportMutationVariables,
} from './apis/useRevenueReportQuery';
import {
  newDateStamp,
  // convertTimeZone
} from '~/composable/useCreateDate';
import {
  FORMAT_DATE_UI,
  FORMAT_DATE_TIME_UI,
  FORMAT_DATE_PICKER,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
import { formatMoney } from '~/composable/useFormat';
import { date } from 'quasar';
import { i18n } from '~/plugins/i18n';

// interface IColumn {
//   name: string;
//   label: string;
//   align: 'left' | 'right' | 'center' | undefined;
//   field: string;
// }

export default {
  setup() {
    const { data: bookingSourceOptions, isFetching: useBookingSourcesFetching } =
      useBookingSourcesQuery({ enabled: true });
    type TAlignColumn = 'left' | 'right' | 'center' | undefined;
    // handle filter date from - to
    // const now = ref<number>(convertTimeZone(new Date().getTime()));
    const now = ref<number>(Date.now());

    const { data: roomTypeData, isFetching: isRoomTypeFetching } = useRoomTypeQuery({
      enabled: true,
    });

    // const dayNow =
    //   date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

    const formValues = reactive<IRevenueReportMutationVariables>({
      page: 1,
      limit: 10,
      // dateFrom: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      // dateTo: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      dateFrom: Number(date.formatDate(now.value, 'X')),
      dateTo: Number(date.formatDate(now.value, 'X')),
      bookingStatusSn: null,
      roomTypeSn: null,
      bookingSourceSn: null,
    });

    const { t } = useI18n();
    const { data, isFetching } = useRevenueReportQuery(formValues, true);

    const qDateRef = ref<any>(null);
    const dateRangeType = ref<number>(0);

    const onOpenDatePopUp = () => {
      qDateRef?.value.show();
    };

    const dateRange = computed({
      get: () => {
        return {
          // from: formValues.dateFrom
          //   ? date.formatDate(
          //       new Date(convertTimeZone(formValues.dateFrom * 1000, false)),
          //       FORMAT_DATE_TIME_PICKER,
          //     )
          //   : null,
          // to: formValues.dateTo
          //   ? date.formatDate(
          //       new Date(convertTimeZone(formValues.dateTo * 1000, false)),
          //       FORMAT_DATE_TIME_PICKER,
          //     )
          //   : null,
          from: formValues.dateFrom
            ? date.formatDate(new Date(formValues.dateFrom * 1000), FORMAT_DATE_PICKER)
            : '',
          to: formValues.dateTo
            ? date.formatDate(new Date(formValues.dateTo * 1000), FORMAT_DATE_PICKER)
            : '',
        };
      },
      set: (val: any) => {
        dateRangeType.value = 0;
        if (val) {
          formValues.dateFrom =
            Number(date.formatDate(new Date(val.from), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
          formValues.dateTo =
            Number(date.formatDate(new Date(val.to), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
          // const dateFromTime = new Date((val.from || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);
          // const dateToTime = new Date((val.to || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);

          // formValues.dateFrom = Number(
          //   date.formatDate(convertTimeZone(dateFromTime.getTime()), 'X'),
          // );
          // formValues.dateTo = Number(date.formatDate(convertTimeZone(dateToTime.getTime()), 'X'));
        } else {
          formValues.dateFrom = formValues.dateTo = null;
        }
        onApply();
      },
    });

    const columns = computed(() => [
      {
        name: 'no',
        label: t('no'),
        align: 'left' as TAlignColumn,
        field: '',
      },
      {
        name: 'bookingNo',
        label: t('booking_no'),
        align: 'left' as TAlignColumn,
        field: 'bookingNo',
      },
      {
        name: 'bookingStatusSn',
        align: 'left' as TAlignColumn,
        label: t('booking_status'),
        field: 'bookingStatusSn',
      },
      {
        name: 'roomTypeName',
        align: 'left' as TAlignColumn,
        label: t('room_types'),
        field: 'roomTypeName',
      },
      { name: 'roomName', align: 'left' as TAlignColumn, label: t('rooms'), field: 'roomName' },
      {
        name: 'bookingSourceName',
        align: 'left' as TAlignColumn,
        label: t('booking_sources'),
        field: 'bookingSourceName',
      },
      {
        name: 'guestName',
        align: 'left' as TAlignColumn,
        label: t('guest_name'),
        field: 'guestName',
      },
      {
        name: 'checkIn',
        align: 'left' as TAlignColumn,
        label: t('arrival_date_time'),
        field: 'checkIn',
      },
      {
        name: 'checkOut',
        align: 'left' as TAlignColumn,
        label: t('departure_date_time'),
        field: 'checkOut',
      },
      {
        name: 'roomPrice',
        align: 'right' as TAlignColumn,
        label: t('room_price_revenue'),
        field: 'roomPrice',
      },
      {
        name: 'servicePrice',
        align: 'right' as TAlignColumn,
        label: t('services_price'),
        field: 'servicePrice',
      },
      {
        name: 'extraFee',
        align: 'right' as TAlignColumn,
        label: t('extra_fee'),
        field: 'extraFee',
      },
      { name: 'discount', align: 'right' as TAlignColumn, label: t('discount'), field: 'discount' },
      {
        name: 'totalRevenue',
        align: 'right' as TAlignColumn,
        label: t('total_revenue'),
        field: 'totalRevenue',
      },
      { name: 'cash', align: 'right' as TAlignColumn, label: t('cash'), field: 'cash' },
      {
        name: 'creditCard',
        align: 'right' as TAlignColumn,
        label: t('credit_card'),
        field: 'creditCard',
      },
      {
        name: 'bankTransfer',
        align: 'right' as TAlignColumn,
        label: t('bank_transfer'),
        field: 'bankTransfer',
      },
      { name: 'debt', align: 'right' as TAlignColumn, label: t('debt'), field: 'debt' },
      { name: 'note', align: 'left' as TAlignColumn, label: t('booking_note'), field: 'note' },
      {
        name: 'pricingPlanName',
        align: 'left' as TAlignColumn,
        label: t('pricing_plan_name_tb_header'),
        field: 'pricingPlanName',
      },
      {
        name: 'timeToStay',
        align: 'left' as TAlignColumn,
        label: t('time_to_stay'),
        field: 'timeToStay',
      },
      {
        name: 'createByName',
        align: 'left' as TAlignColumn,
        label: t('created_by'),
        field: 'createByName',
      },
    ]);

    const onApply = () => {
      formValues.page = 1;
    };

    const arrayBookingSources = ref<Array<object>>([]);
    const arrayRoomTypes = ref<Array<object>>([]);
    const arrayBookingStatuses = ref<Array<object>>([]);

    watch(useBookingSourcesFetching, () => {
      addNewBookingSources();
    });

    watch(isRoomTypeFetching, () => {
      addNewRoomTypes();
    });

    arrayBookingStatuses.value = [
      {
        typeName: t('all_booking_statuses'),
        bookingStatusSn: null,
      },
      ...BOOKING_STATUS_TYPES,
    ];

    const addNewBookingSources = () => {
      arrayBookingSources.value.push(
        {
          name: t('all_booking_sources'),
          sn: null,
        },
        ...JSON.parse(JSON.stringify(bookingSourceOptions.value)),
      );
    };

    const addNewRoomTypes = () => {
      arrayRoomTypes.value.push(
        {
          name: t('all_room_types'),
          sn: null,
        },
        ...JSON.parse(JSON.stringify(roomTypeData.value)),
      );
    };
    watch(
      () => (i18n.global.locale as any).value,
      () => {
        arrayBookingSources.value[0] = {
          name: t('all_booking_sources'),
          sn: null,
        };
        arrayBookingStatuses.value[0] = {
          typeName: t('all_booking_statuses'),
          bookingStatusSn: null,
        };
        arrayRoomTypes.value[0] = {
          name: t('all_room_types'),
          sn: null,
        };
      },
    );
    return {
      t,
      columns,
      data,
      isFetching,
      formatIndexTable,

      dateRangeType,
      onOpenDatePopUp,
      qDateRef,
      dateRange,
      formValues,

      useBookingSourcesFetching,

      FORMAT_DATE_UI,
      FORMAT_DATE_TIME_UI,
      isRoomTypeFetching,
      newDateStamp,
      date,
      formatMoney,
      onApply,

      arrayBookingSources,
      arrayRoomTypes,
      arrayBookingStatuses,
    };
  },
};
</script>

<style lang="scss" scoped>
.slice-tooltip {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  [data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
  }
  [data-title]:after {
    content: attr(data-title);

    background-color: #343a40;
    color: #ffffff;
    position: absolute;
    left: 0;
    top: 0;
    visibility: hidden;

    width: auto;
    z-index: 1;

    box-sizing: border-box;
    font-weight: normal;
    font-size: 12px;

    padding: 0.8em;
    border: 1px solid #c2c5cc;
    border-radius: 6px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }
}

.slice-tooltip-2-line-clamp {
  -webkit-line-clamp: 2;
}
</style>
