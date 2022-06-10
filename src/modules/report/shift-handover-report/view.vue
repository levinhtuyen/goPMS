<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('shift_handover_report') }}</div>
      </div>
      <div class="row q-mb-md">
        <div>
          <q-field
            placeholder="Select date time"
            dense
            stack-label
            style="width: 100%"
            filled
            class="q-mr-md inline-block"
            mask="date"
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
        :showing="loadingShiftHandoverReport"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!loadingShiftHandoverReport">
        <q-table
          v-if="dataShiftHandoverReport"
          :rows="dataShiftHandoverReport.shiftHandoverList"
          :columns="columns"
          :table-colspan="9"
          row-key="index"
          no-data-label="No data"
          :virtual-scroll-item-size="48"
          :rows-per-page-options="[0]"
          hide-pagination
          hide-bottom
        >
          <template #header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr>
              <q-td key="id">
                <div class="row items-left justify-left">
                  {{ props.row.id }}
                </div></q-td
              >
              <q-td key="startTime">
                <div class="row items-left justify-left">
                  {{ newDateStamp(props.row.startTime, FORMAT_DATE_TIME_UI) }}
                </div></q-td
              >
              <q-td key="endTime"
                ><div class="row items-left justify-left">
                  {{
                    props.row.endTime ? newDateStamp(props.row.endTime, FORMAT_DATE_TIME_UI) : ''
                  }}
                </div></q-td
              >
              <q-td key="closedBy"
                ><div class="row items-left justify-left">{{ props.row.closedBy }}</div></q-td
              >
              <q-td key="cashReceiver"
                ><div class="row items-left justify-left">{{ props.row.cashReceiver }}</div></q-td
              >
              <q-td key="startingBalance"
                ><div class="text-right">
                  <span>{{ props.row.startingBalance }}</span>
                </div></q-td
              >
              <q-td key="totalCashReceipts"
                ><div class="text-right">
                  <span>{{ props.row.totalCashReceipts }}</span>
                </div></q-td
              >
              <q-td key="totalCashPayments"
                ><div class="text-right">
                  <span>{{ props.row.totalCashPayments }}</span>
                </div></q-td
              >
              <q-td key="endBalance"
                ><div class="text-right">
                  <span>{{ props.row.endBalance }}</span>
                </div></q-td
              >
              <q-td key="cashDifference"
                ><div class="text-right">
                  <span>{{ props.row.cashDifference }}</span>
                </div></q-td
              >
              <q-td key="cashInSafe"
                ><div class="text-right">
                  <span>{{ props.row.cashInSafe }}</span>
                </div></q-td
              >
              <q-td key="handToNextShift"
                ><div class="text-right">
                  <span>{{ props.row.handToNextShift }}</span>
                </div></q-td
              >
              <q-td key="cashWithdrawals"
                ><div class="text-right">
                  <span>{{ props.row.cashWithdrawals }}</span>
                </div></q-td
              >
              <q-td key="note">
                <div class="row items-left justify-left">
                  <div class="limit-text">
                    {{ props.row.note }}
                    <q-tooltip v-if="props.row.note">{{ props.row.note }}</q-tooltip>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row justify-end q-mt-md">
          <q-pagination
            v-model="formValues.page"
            color="negative"
            :max="dataShiftHandoverReport?.meta.lastPage || 1"
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

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { date } from 'quasar';
import {
  useShiftHanoverReportQuery,
  IShiftHandoverReportMutationVariables,
} from './api/useShiftHanoverReportQuery';
import {
  FORMAT_DATE_UI,
  FORMAT_DATE_PICKER,
  FORMAT_DATE_TIME_UI,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
import {
  newDateStamp,
  // convertTimeZone
} from '~/composable/useCreateDate';
import { useI18n } from '~/composable/useI18n';
const { t } = useI18n();

const qDateRef = ref<any>(null);
const dateRangeType = ref<number>(0);

type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed(() => [
  {
    name: 'id',
    label: t('shift_ID'),
    field: 'id',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'startTime',
    label: t('shift_start_time'),
    field: 'startTime',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'endTime',
    label: t('shift_end_time'),
    field: 'endTime',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'closedBy',
    label: t('shift_closed_by'),
    field: 'closedBy',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'cashReceiver',
    label: t('cash_receiver'),
    field: 'cashReceiver',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'startingBalance',
    label: t('starting_balance'),
    field: 'startingBalance',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'totalCashReceipts',
    label: t('total_cash_receipts'),
    field: 'totalCashReceipts',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'totalCashPayments',
    label: t('total_cash_payments'),
    field: 'totalCashPayments',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'endBalance',
    label: t('end_shift_balance'),
    field: 'endBalance',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'cashDifference',
    label: t('cash_difference'),
    field: 'cashDifference',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'cashInSafe',
    label: t('cash_in_safe'),
    field: 'cashInSafe',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'handToNextShift',
    label: t('hand_to_next_shift'),
    field: 'handToNextShift',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'cashWithdrawals',
    label: t('cash_withdrawals'),
    field: 'cashWithdrawals',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'note',
    label: t('note'),
    field: 'note',
    align: 'left' as TAlignColumn,
  },
]);

// handle filter date from - to
// const now = ref<number>(convertTimeZone(new Date().getTime()));
const now = ref<number>(Date.now());

// const dayNow =
// date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

const formValues = reactive<IShiftHandoverReportMutationVariables>({
  page: 1,
  limit: 10,
  // startDate: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  // endDate: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  startDate: Number(date.formatDate(now.value, 'X')),
  endDate: Number(date.formatDate(now.value, 'X')),
});

const { data: dataShiftHandoverReport, isLoading: loadingShiftHandoverReport } =
  useShiftHanoverReportQuery(formValues, true);

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

      // formValues.startDate = Number(date.formatDate(convertTimeZone(startDateTime.getTime()), 'X'));
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

const onApply = () => {
  formValues.page = 1;
};
</script>
<style lang="sass" scoped>
.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 250px
  text-align: left
</style>
