<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('services_deletion_report') }}</div>
      </div>

      <div class="row q-mb-md">
        <div>
          <q-field placeholder="Select date time" dense stack-label filled @focus="onOpenDatePopUp">
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ date.formatDate(dateRange.from || '', FORMAT_DATE_UI) }} -
                {{ date.formatDate(dateRange.to || '', FORMAT_DATE_UI) }}
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
          :rows="data?.serviceDeletionReportList"
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

              <q-td key="deleteTime" :props="props">
                <div>{{ newDateStamp(props.row.deleteTime, FORMAT_DATE_TIME_UI) }}</div>
                <div>{{ props.row.deleteByName }}</div>
              </q-td>

              <q-td key="productName" :props="props">
                {{ props.row.productName }}
              </q-td>

              <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td>

              <q-td key="totalPrice" :props="props">
                {{ formatMoney(props.row.totalPrice) }} VND
              </q-td>

              <q-td key="bookingNo" :props="props">
                <router-link
                  style="text-decoration: none"
                  class="custom-link text-negative"
                  :to="{
                    name: 'BookingDetails',
                    params: { sn: props.row?.bookingSn },
                  }"
                >
                  {{ props.row.bookingNo }}
                </router-link>
              </q-td>

              <q-td key="room" :props="props" class="unset-white-space">
                <div class="slice-tooltip">
                  <div :data-title="props.row.room">
                    {{ props.row.room }}
                  </div>
                </div>
              </q-td>

              <q-td key="deleteReason" :props="props" class="unset-white-space">
                <div class="slice-tooltip" style="-webkit-line-clamp: 2">
                  <div :data-title="props.row.deleteReason">
                    {{ props.row.deleteReason }}
                  </div>
                </div>
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
import { ref, reactive, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import {
  useServicesDeletionReportQuery,
  IServicesDeletionReportMutationVariables,
} from './apis/useServicesDeletionReportQuery';
import { formatIndexTable } from '~/composable/useFormat';
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
import { date } from 'quasar';
import { formatMoney } from '~/composable/useFormat';

// interface IColumn {
//   name: string;
//   label: string;
//   align: 'left' | 'right' | 'center' | undefined;
//   field: string;
// }

export default {
  setup() {
    const { t } = useI18n();
    // const now = ref<number>(convertTimeZone(new Date().getTime()));
    const now = ref<number>(Date.now());

    // const dayNow =
    // date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

    const formValues = reactive<IServicesDeletionReportMutationVariables>({
      page: 1,
      limit: 10,
      // dateFrom: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      // dateTo: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
      dateFrom: Number(date.formatDate(now.value, 'X')),
      dateTo: Number(date.formatDate(now.value, 'X')),
    });

    const { data, isFetching } = useServicesDeletionReportQuery(formValues, true);

    // handle filter date from - to
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
          //       new Date(convertTimeZone(Number(formValues.dateFrom) * 1000, false)),
          //       FORMAT_DATE_TIME_PICKER,
          //     )
          //   : null,
          // to: formValues.dateTo
          //   ? date.formatDate(
          //       new Date(convertTimeZone(Number(formValues.dateTo) * 1000, false)),
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
          // const dateFromTime = new Date((val.from || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);
          // const dateToTime = new Date((val.to || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);

          // formValues.dateFrom = Number(
          //   date.formatDate(convertTimeZone(dateFromTime.getTime()), 'X'),
          // );
          // formValues.dateTo = Number(date.formatDate(convertTimeZone(dateToTime.getTime()), 'X'));
          formValues.dateFrom =
            Number(date.formatDate(new Date(val.from), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
          formValues.dateTo =
            Number(date.formatDate(new Date(val.to), 'X')) ||
            Number(date.formatDate(new Date(val), 'X'));
        } else {
          formValues.dateFrom = formValues.dateTo = null;
        }
        onApply();
      },
    });
    type TAlignColumn = 'left' | 'right' | 'center' | undefined;
    // end handle filter date from - to
    const columns = computed(() => [
      {
        name: 'no',
        label: t('no'),
        align: 'left' as TAlignColumn,
        field: '',
      },
      {
        name: 'deleteTime',
        label: t('deleted_at_by'),
        align: 'left' as TAlignColumn,
        field: 'deleteTime',
      },
      {
        name: 'productName',
        align: 'left' as TAlignColumn,
        label: t('products'),
        field: 'productName',
      },
      {
        name: 'quantity',
        align: 'left' as TAlignColumn,
        label: t('quantity_deleted'),
        field: 'quantity',
      },
      {
        name: 'totalPrice',
        align: 'right' as TAlignColumn,
        label: t('total_prices'),
        field: 'totalPrice',
      },
      {
        name: 'bookingNo',
        align: 'left' as TAlignColumn,
        label: t('booking_no'),
        field: 'bookingNo',
      },
      { name: 'room', align: 'left' as TAlignColumn, label: t('rooms'), field: 'room' },
      {
        name: 'deleteReason',
        align: 'left' as TAlignColumn,
        label: t('reason'),
        field: 'deleteReason',
      },
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

      FORMAT_DATE_UI,
      FORMAT_DATE_TIME_UI,
      FORMAT_DATE_PICKER,
      newDateStamp,
      date,
      formatMoney,
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
/* /////////////////////////// */
</style>
