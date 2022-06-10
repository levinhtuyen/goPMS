<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('debt_summary_report') }}</div>
      </div>

      <div class="row q-mb-md q-gutter-md">
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
        <div style="min-width: 16%">
          <q-field
            :placeholder="t('select_date_time')"
            dense
            stack-label
            filled
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

      <div v-if="!isFetching">
        <q-table
          :rows-per-page-options="[0]"
          :rows="data?.debtSummaryList"
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
              <q-td key="bookingSourceName" :props="props">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{
                    name: 'debt-detail-report',
                    params: { sn: props.row?.bookingSourceSn },
                    query: formValues,
                  }"
                >
                  {{ props.row.bookingSourceName }}
                </router-link>
              </q-td>
              <q-td key="debtStarting" :props="props">
                {{ formatMoney(props.row.debtStarting) }} VND
              </q-td>
              <q-td key="debtPeriod" :props="props">
                {{ formatMoney(props.row.debtPeriod) }} VND
              </q-td>
              <q-td key="debtEnd" :props="props"> {{ formatMoney(props.row.debtEnd) }} VND </q-td>
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
import { useBookingSourcesQuery } from '~/apis/commons/useAppendixQuery';
import {
  useDebtSummaryReportQuery,
  IDebtSummaryReportMutationVariables,
} from './apis/useDebtSummaryReportQuery';
import { formatIndexTable, formatMoney } from '~/composable/useFormat';
import { date } from 'quasar';
import {
  FORMAT_DATE_UI,
  FORMAT_DATE_TIME_UI,
  FORMAT_DATE_PICKER,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
// import { convertTimeZone } from '~/composables/useCreateDate';
// interface IColumn {
//   name: string;
//   label: string;
//   align: 'left' | 'right' | 'center' | undefined;
//   field: string;
// }

export default {
  setup() {
    const { t, locale } = useI18n();
    const { data: bookingSourceOptions, isFetching: useBookingSourcesFetching } =
      useBookingSourcesQuery({ enabled: true });

    // handle filter date from - to
    // const now = ref<number>(convertTimeZone(new Date().getTime()));
    const now = ref<number>(Date.now());

    // const dayNow =
    //   date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

    const formValues = reactive<IDebtSummaryReportMutationVariables>({
      page: 1,
      limit: 10,
      bookingSourceSn: null,
      // startDate: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      // endDate: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      startDate: Number(date.formatDate(now.value, 'X')),
      endDate: Number(date.formatDate(now.value, 'X')),
    });

    const { data, isFetching } = useDebtSummaryReportQuery(formValues, true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qDateRef = ref<any>(null);
    const dateRangeType = ref<number>(0);

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
        name: 'bookingSourceName',
        label: t('booking_sources'),
        align: 'left' as TAlignColumn,
        field: 'bookingSourceName',
      },
      {
        name: 'debtStarting',
        align: 'right' as TAlignColumn,
        label: t('debt_starting_balance'),
        field: 'debtStarting',
      },
      {
        name: 'debtPeriod',
        align: 'right' as TAlignColumn,
        label: t('debt_in_the_period'),
        field: 'debtPeriod',
      },
      {
        name: 'debtEnd',
        align: 'right' as TAlignColumn,
        label: t('debt_end_balance'),
        field: 'debtEnd',
      },
    ]);

    const onApply = () => {
      formValues.page = 1;
    };

    const arrayBookingSources = ref<Array<object>>([]);

    watch(useBookingSourcesFetching, () => {
      addNewBookingSources();
    });

    const addNewBookingSources = () => {
      arrayBookingSources.value.push(
        {
          name: t('all_booking_sources'),
          sn: null,
        },
        ...JSON.parse(JSON.stringify(bookingSourceOptions.value)),
      );
    };
    const language = ref('');
    watch(
      () => locale.value,
      (val) => {
        language.value = val;
        arrayBookingSources.value[0] = {
          name: t('all_booking_sources'),
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

      // option
      useBookingSourcesFetching,

      FORMAT_DATE_TIME_UI,
      FORMAT_DATE_UI,
      date,
      onApply,
      arrayBookingSources,
      formatMoney,
    };
  },
};
</script>

<style lang="css" scoped>
.limit-text {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
