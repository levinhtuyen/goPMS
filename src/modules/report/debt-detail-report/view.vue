<template>
  <pms-sections>
    <template #header>
      <div class="q-px-md q-pb-lg row">
        <div class="text-h5 text-bold">{{ t('debt_detail_report') }}</div>
      </div>

      <div class="q-px-md q-pb-lg row q-gutter-md">
        <div style="min-width: 16%">
          <q-select
            v-model="formValues.bookingSourceSn"
            :loading="useBookingSourcesFetching"
            outlined
            dense
            :options="bookingSourceOptions"
            option-value="sn"
            option-label="name"
            map-options
            emit-value
            placeholder="Select Booking Source"
            @update:model-value="onApply()"
          />
        </div>
        <div style="min-width: 16%">
          <q-field
            placeholder="Select date time"
            dense
            stack-label
            outlined
            @focus="onOpenDatePopUp"
          >
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

      <div v-if="!isFetching" class="q-px-md">
        <q-table
          :rows-per-page-options="[0]"
          :rows="data?.debtDetailList"
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
              <q-td key="checkOutActual" :props="props">
                {{ newDateStamp(props.row.checkOutActual, FORMAT_DATE_UI) }}
              </q-td>
              <q-td key="sn" :props="props">
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
              <q-td key="fullName" :props="props">
                <div class="ellipsis" style="width: 300px">
                  <span>
                    <q-tooltip> {{ props.row.fullName }} </q-tooltip>
                    {{ props.row.fullName }}
                  </span>
                </div>
              </q-td>
              <q-td key="roomTypeName" :props="props">
                <div class="ellipsis" style="width: 300px">
                  <span>
                    <q-tooltip> {{ props.row.roomTypeName }} </q-tooltip>
                    {{ props.row.roomTypeName }}
                  </span>
                </div>
              </q-td>
              <q-td key="roomName" :props="props">
                <div class="ellipsis" style="width: 300px">
                  <span>
                    <q-tooltip> {{ props.row.roomName }} </q-tooltip>
                    {{ props.row.roomName }}
                  </span>
                </div>
              </q-td>
              <q-td key="debtPrice" :props="props">
                {{ formatMoney(props.row.debtPrice) }} VND
              </q-td>
              <q-td key="note" :props="props">
                <div class="ellipsis" style="width: 300px">
                  <span>
                    <q-tooltip> {{ props.row.note }} </q-tooltip>
                    {{ props.row.note }}
                  </span>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="q-py-md row justify-end">
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

        <div class="q-px-md q-px-md q-pt-md text-bold" style="background: #fff3eb">
          <div class="row justify-between">
            <p>1. {{ t('debt_starting_balance') }}</p>
            <p>{{ formatMoney(data?.additionalData?.debtStarting) }} VND</p>
          </div>
          <div class="row justify-between">
            <p>2. {{ t('debt_in_the_period') }}</p>
            <p>{{ formatMoney(data?.additionalData?.debtPeriod) }} VND</p>
          </div>
          <div class="row justify-between">
            <p>3. {{ t('debt_end_balance_1_2') }}</p>
            <p>{{ formatMoney(data?.additionalData?.debtEnd) }} VND</p>
          </div>
        </div>
      </div>
    </div>
  </pms-sections>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useBookingSourcesQuery } from '~/apis/commons/useAppendixQuery';
import {
  useDebtDetailReportQuery,
  IDebtDetailReportMutationVariables,
} from './apis/useDebtDetailReportQuery';
import { formatIndexTable, formatMoney } from '~/composable/useFormat';
import { date } from 'quasar';
import { useRoute } from 'vue-router';
import {
  FORMAT_DATE_UI,
  FORMAT_DATE_PICKER,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
import {
  newDateStamp,
  // convertTimeZone
} from '~/composable/useCreateDate';

// interface IColumn {
//   name: string;
//   label: string;
//   align: 'left' | 'right' | 'center' | undefined;
//   field: string;
// }

export default {
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const { data: bookingSourceOptions, isFetching: useBookingSourcesFetching } =
      useBookingSourcesQuery({ enabled: true });

    // handle filter date from - to
    // const now = ref<number>(convertTimeZone(new Date().getTime()));
    const now = ref<number>(Date.now());

    // const dayNow =
    //   date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

    const formValues = reactive<IDebtDetailReportMutationVariables>({
      page: 1,
      limit: 10,
      bookingSourceSn: Number(route.params.sn) || '',
      // startDate: route.query.startDate
      //   ? Number(route.query.startDate)
      //   : Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      // endDate: route.query.startDate
      //   ? Number(route.query.endDate)
      //   : Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      startDate: route.query.startDate
        ? Number(route.query.startDate)
        : Number(date.formatDate(now.value, 'X')),
      endDate: route.query.startDate
        ? Number(route.query.endDate)
        : Number(date.formatDate(now.value, 'X')),
    });

    const qDateRef = ref<any>(null);
    const dateRangeType = ref<number>(0);

    const { data, isFetching } = useDebtDetailReportQuery(formValues, true);

    const onOpenDatePopUp = () => {
      qDateRef?.value.show();
    };

    const dateRange = computed({
      get: () => {
        return {
          // from: formValues.startDate
          //   ? date.formatDate(
          //       new Date(convertTimeZone(formValues.startDate * 1000, false)),
          //       FORMAT_DATE_TIME_PICKER,
          //     )
          //   : null,
          // to: formValues.endDate
          //   ? date.formatDate(
          //       new Date(convertTimeZone(formValues.endDate * 1000, false)),
          //       FORMAT_DATE_TIME_PICKER,
          //     )
          //   : null,
          from: formValues.startDate
            ? date.formatDate(new Date(formValues.startDate * 1000), FORMAT_DATE_PICKER)
            : '',
          to: formValues.endDate
            ? date.formatDate(new Date(formValues.endDate * 1000), FORMAT_DATE_PICKER)
            : '',
        };
      },
      set: (val: any) => {
        dateRangeType.value = 0;
        if (val) {
          // const startDateTime = new Date((val.from || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);
          // const endDateTime = new Date((val.to || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);

          // formValues.startDate = Number(
          //   date.formatDate(convertTimeZone(startDateTime.getTime()), 'X'),
          // );
          // formValues.endDate = Number(date.formatDate(convertTimeZone(endDateTime.getTime()), 'X'));
          formValues.startDate =
            Number(date.formatDate(new Date(val.from), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
          formValues.endDate =
            Number(date.formatDate(new Date(val.to), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
        } else {
          formValues.startDate = formValues.endDate = null;
        }
        onApply();
      },
    });
    type TAlignColumn = 'left' | 'right' | 'center' | undefined;
    const columns = computed(() => [
      {
        name: 'no',
        label: t('no'),
        align: 'left' as TAlignColumn,
        field: '',
      },
      {
        name: 'checkOutActual',
        label: t('checked_out_date'),
        align: 'left' as TAlignColumn,
        field: 'checkOutActual',
      },
      {
        name: 'sn',
        align: 'left' as TAlignColumn,
        label: t('booking_no'),
        field: 'sn',
      },
      {
        name: 'fullName',
        align: 'left' as TAlignColumn,
        label: t('guest_name'),
        field: 'fullName',
      },
      {
        name: 'roomTypeName',
        align: 'left' as TAlignColumn,
        label: t('room_types'),
        field: 'roomTypeName',
      },
      { name: 'roomName', align: 'left' as TAlignColumn, label: t('rooms'), field: 'roomName' },
      {
        name: 'debtPrice',
        align: 'right' as TAlignColumn,
        label: t('debt_price'),
        field: 'debtPrice',
      },
      { name: 'note', align: 'left' as TAlignColumn, label: t('booking_note'), field: 'note' },
    ]);

    const onApply = () => {
      formValues.page = 1;
    };

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
      bookingSourceOptions,
      useBookingSourcesFetching,

      FORMAT_DATE_UI,
      newDateStamp,
      date,
      onApply,
      formatMoney,
    };
  },
};
</script>
