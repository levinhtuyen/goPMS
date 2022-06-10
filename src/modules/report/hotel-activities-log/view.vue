<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('hotel_activities_log') }}</div>
      </div>

      <div class="row q-mb-md q-gutter-md">
        <div class="col col-md-2 col-sm-6 col-xs-12">
          <q-input
            v-model="formValues.id"
            filled
            dense
            class="rounded-borders"
            debounce="300"
            :placeholder="t('search_by_ID')"
          >
            <template #prepend>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="col col-md-3 col-sm-6 col-xs-12">
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
                  <q-date v-model="dateRange" range @range-end="resetPage" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-field>
        </div>

        <div :key="language" class="col col-md-2 col-sm-6 col-xs-12">
          <q-select
            v-model="formValues.accountSn"
            :options="dataAccountOption"
            filled
            map-options
            emit-value
            dense
            option-value="sn"
            option-label="fullName"
            @update:model-value="onSubmit"
          ></q-select>
        </div>

        <div class="col col-md-2 col-sm-6 col-xs-12">
          <q-select
            v-model="formValues.activitySn"
            :options="ACTIVITIESOPTION"
            dense
            filled
            option-value="value"
            option-label="label"
            map-options
            emit-value
            @update:model-value="onSubmit"
          ></q-select>
        </div>
      </div>
    </template>

    <div class="relative-position">
      <q-inner-loading
        :showing="loadingHotelActivitiesLog"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!loadingHotelActivitiesLog">
        <q-table
          v-if="dataHotelActivitiesLog"
          :rows="dataHotelActivitiesLog.hotelActivityList"
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
              <q-td key="index" :props="props" :class="!props.row.deleteTime ? '' : 'opacity-view'">
                {{ formatIndexTable(formValues.page, props.pageIndex) }}
              </q-td>
              <q-td key="name">
                <div class="row items-left justify-left">
                  <div class="limit-text">
                    {{ getLanguageData(props.row.name) }}
                    <q-tooltip v-if="props.row.name">{{ props.row.name }}</q-tooltip>
                  </div>
                </div>
              </q-td>
              <q-td key="id">
                <div
                  v-if="
                    props.row.activitySn === 6 ||
                    props.row.activitySn === 7 ||
                    props.row.activitySn === 8 ||
                    props.row.activitySn === 9 ||
                    props.row.activitySn === 10 ||
                    props.row.activitySn === 11 ||
                    props.row.activitySn === 12 ||
                    props.row.activitySn === 13 ||
                    props.row.activitySn === 14 ||
                    props.row.activitySn === 15
                  "
                  class="row items-left justify-left"
                  :class="'doc-link'"
                >
                  <div
                    @click="
                      $router.push({
                        name: 'BookingDetails',
                        params: { sn: props.row.sn },
                      })
                    "
                  >
                    {{ props.row.id }}
                  </div>
                </div>
                <div
                  v-else-if="
                    props.row.activitySn === 16 ||
                    props.row.activitySn === 17 ||
                    props.row.activitySn === 18
                  "
                  class="row items-left justify-left"
                  :class="'doc-link'"
                >
                  <div
                    @click="
                      $router.push({
                        name: 'CashTransactions',
                        params: { sn: props.row.sn, activitiesSn: props.row.activitySn },
                      })
                    "
                  >
                    {{ props.row.id }}
                  </div>
                </div>
                <div
                  v-else-if="
                    props.row.activitySn === 19 ||
                    props.row.activitySn === 20 ||
                    props.row.activitySn === 21
                  "
                  class="row items-left justify-left"
                  :class="'doc-link'"
                >
                  <div
                    @click="
                      $router.push({
                        name: 'CashTransactions',
                        params: { sn: props.row.sn, activitiesSn: props.row.activitySn },
                      })
                    "
                  >
                    {{ props.row.id }}
                  </div>
                </div>
              </q-td>
              <q-td key="description">
                <div class="row items-left justify-left">
                  <div class="limit-text">
                    {{ props.row.description }}
                    <q-tooltip v-if="props.row.description">{{ props.row.description }}</q-tooltip>
                  </div>
                </div>
              </q-td>
              <q-td key="actionAtBy">
                <div class="text-left">
                  <span>{{
                    date.formatDate(new Date(props.row.actionAt * 1000), FORMAT_DATE_TIME_UI)
                  }}</span>
                  <br />
                  <span>{{ props.row.actionBy }}</span>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row justify-end q-mt-md">
          <q-pagination
            v-model="formValues.page"
            color="negative"
            :max="dataHotelActivitiesLog?.meta.lastPage || 1"
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
import { ref, computed, watch, reactive } from 'vue';
import { date } from 'quasar';
import {
  useHotelActivitiesLogQuery,
  IHotelActivitiesLogMutationVariables,
} from './api/useHotelActivitiesLogQuery';
import { formatIndexTable } from '~/composable/useFormat';
import { useStaffQuery } from './api/useStaffQuery';
// import { ACTIVITIESOPTION } from './const';
import { i18n } from '~/plugins/i18n';

import {
  FORMAT_DATE_UI,
  FORMAT_DATE_TIME_UI,
  FORMAT_DATE_PICKER,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
import { useI18n } from '~/composable/useI18n';
// import { convertTimeZone } from '~/composables/useCreateDate';

const { t } = useI18n();

const qDateRef = ref<any>(null);
const dateRangeType = ref<number>(0);

// colum table
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'name',
    label: t('activities'),
    field: 'name',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'id',
    label: t('ID'),
    field: 'id',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'description',
    label: t('description'),
    field: 'description',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'actionAtBy',
    label: t('action_at_by'),
    field: 'actionAtBy',
    align: 'left' as TAlignColumn,
  },
]);

// data

// handle filter date from - to
// const now = ref<number>(convertTimeZone(new Date().getTime()));
const now = ref<number>(Date.now());

// const dayNow =
// date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

const formValues = reactive<IHotelActivitiesLogMutationVariables>({
  page: 1,
  limit: 10,
  // dateFrom: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  // dateTo: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  dateFrom: Number(date.formatDate(now.value, 'X')),
  dateTo: Number(date.formatDate(now.value, 'X')),
  accountSn: 0,
  activitySn: 0,
  id: '',
});

let { data: AccountOption } = useStaffQuery();

const resetPage = () => {
  formValues.page = 1; // reset to page 1
};

// computed
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
      // const dateFromTime = new Date((val.from || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);
      // const dateToTime = new Date((val.to || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);

      // formValues.dateFrom = Number(date.formatDate(convertTimeZone(dateFromTime.getTime()), 'X'));
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
  },
});
const ACTIVITIESOPTION = computed(() => [
  {
    label: t('all_activities'),
    value: 0,
  },
  {
    label: t('configuration_create_new_pricing_plan'),
    value: 1,
  },
  {
    label: t('configuration_edit_pricing_plan'),
    value: 2,
  },
  {
    label: t('configuration_duplicate_pricing_plan'),
    value: 3,
  },
  {
    label: t('configuration_delete_pricing_plan'),
    value: 4,
  },
  {
    label: t('configuration_edit_policy'),
    value: 5,
  },
  {
    label: t('booking_make_a_reservation'),
    value: 6,
  },
  {
    label: t('booking_check_in'),
    value: 7,
  },
  {
    label: t('booking_change_stay_date'),
    value: 8,
  },
  {
    label: t('booking_change_room'),
    value: 9,
  },
  {
    label: t('booking_cancel'),
    value: 10,
  },
  {
    label: t('booking_check_out'),
    value: 11,
  },
  {
    label: t('booking_change_extra_fee'),
    value: 12,
  },
  {
    label: t('booking_change_deposit'),
    value: 13,
  },
  {
    label: t('booking_change_discount'),
    value: 14,
  },
  {
    label: t('booking_add_services'),
    value: 15,
  },
  {
    label: t('cash_transaction_ad_new_cash_receipt'),
    value: 16,
  },
  {
    label: t('cash_transaction_edit_cash_receipt'),
    value: 17,
  },
  {
    label: t('cash_transaction_delete_cash_receipt'),
    value: 18,
  },
  {
    label: t('cash_transaction_add_new_cash_payment'),
    value: 19,
  },
  {
    label: t('cash_transaction_edit_cash_payment'),
    value: 20,
  },
  {
    label: t('cash_transaction_delete_cash_payment'),
    value: 21,
  },
]);
const getLanguageData = (name: string) => {
  if (!name) {
    return;
  }
  return name;
};
const dataAccountOption = ref<any>();
watch(AccountOption, () => {
  dataAccountOption.value = AccountOption?.value;
  if (dataAccountOption.value[0].sn !== 0) {
    dataAccountOption.value.unshift({
      fullName: t('all_accounts'),
      sn: 0,
    });
  }
});
const language = ref('');
watch(
  () => (i18n.global.locale as any).value,
  (val) => {
    language.value = val;
    refetchHotelActivitiesLog.value();
    if (dataAccountOption.value[0].sn === 0) {
      dataAccountOption.value[0] = {
        fullName: t('all_accounts'),
        sn: 0,
      };
    }
  },
);
// action
let {
  data: dataHotelActivitiesLog,
  isLoading: loadingHotelActivitiesLog,
  refetch: refetchHotelActivitiesLog,
} = useHotelActivitiesLogQuery(formValues, true);

const onSubmit = () => {
  formValues.page = 1;
};

const onOpenDatePopUp = () => {
  qDateRef?.value.show();
  // formValues.page = 1;
};
</script>
<style lang="sass" scoped>
.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 300px
  text-align: left
.opacity-view
  opacity: .4
.doc-link
  color: #ff6400
  font-weight: 500
  outline: 0
  text-decoration: none
  transition: opacity .2s
  white-space: nowrap
  cursor: pointer
</style>
