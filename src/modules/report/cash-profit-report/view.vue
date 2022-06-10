<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('cash_profit_report') }}</div>
      </div>

      <div class="row q-mb-lg q-gutter-md">
        <div class="col col-md-4 col-lg-2 col-sm-6 col-xs-12">
          <q-select
            v-model="valueTime"
            name="accepted_genres"
            :options="TIME_OPTIONS"
            filled
            dense
            :label="t('select_time_range')"
            emit-value
            map-options
            input-debounce="0"
            behavior="menu"
            option-value="id"
            option-label="key"
            @update:model-value="changeTimeInfo"
          ></q-select>
        </div>
        <div class="col col-md-4 col-lg-3 col-sm-6 col-xs-12">
          <q-field
            :placeholder="t('select_date_time')"
            dense
            stack-label
            style="width: 100%"
            filled
            class="q-mr-md inline-block"
            mask="date"
            @focus="onOpenDatePopUp"
          >
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ dateRange.from }} - {{ dateRange.to }}
              </div>
            </template>
            <template #prepend>
              <q-icon name="event" class="no-pointer-events">
                <q-popup-proxy ref="qDateRef" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="dateRange"
                    mask="DD/MM/YYYY"
                    range
                    @range-start="updateRangeTime"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-field>
        </div>
      </div>
    </template>

    <div class="relative-position">
      <q-inner-loading
        :showing="loadingCashProfitReport"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!loadingCashProfitReport">
        <div class="q-gutter-sm custom-content">
          <div class="row justify-center q-mt-none q-ml-none style-border-header">
            <div class="col-md-9 col-sm-6 col-xs-6">
              <p class="q-mb-none q-pa-md q-pl-lg text-bold">{{ t('description') }}</p>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <p class="q-mb-none q-pa-md custom-padding-right q-mr-md float-right text-bold">
                {{ t('amount') }}
              </p>
            </div>
          </div>
          <div v-if="dataCashProfitReport" class="q-ma-none q-pa-none">
            <q-list bordered class="style-scroll-product q-pa-none">
              <q-expansion-item
                switch-toggle-side
                expand-separator
                class="custom-icon"
                :class="dataCashProfitReport?.cashReceiptList?.length > 0 ? '' : 'disable-icon'"
              >
                <template #header>
                  <q-item-section
                    ><div class="q-py-sm">1. {{ t('cash_receipt') }}</div></q-item-section
                  >

                  <q-item-section side>
                    <div class="row items-center">
                      <div class="custom-padding-right style-color">
                        {{ formatMoney(dataCashProfitReport?.totalCashReceipt) }} VND
                      </div>
                    </div>
                  </q-item-section>
                </template>
                <q-card v-for="(child, index) in dataCashProfitReport.cashReceiptList" :key="index">
                  <div class="row justify-between">
                    <div class="col-8 custom-section-left">
                      <q-card-section class="q-pr-lg">
                        {{
                          t(`${handleRederDataLanguage(child.cashieringReceiptTypeName)}`)
                        }}</q-card-section
                      >
                    </div>
                    <div class="col-4 custom-section-right">
                      <q-card-section class="float-right custom-padding-right q-mr-md">
                        {{ formatMoney(child.cashieringReceiptTypeTotalPrice) }}
                        VND</q-card-section
                      >
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                switch-toggle-side
                expand-separator
                class="custom-icon"
                :class="dataCashProfitReport?.cashPaymentList?.length > 0 ? '' : 'disable-icon'"
              >
                <template #header>
                  <q-item-section
                    ><div class="q-py-sm">2. {{ t('cash_payment') }}</div></q-item-section
                  >

                  <q-item-section side>
                    <div class="row items-center">
                      <div class="custom-padding-right style-color">
                        {{ formatMoney(dataCashProfitReport?.totalCashPayment) }} VND
                      </div>
                    </div>
                  </q-item-section>
                </template>
                <q-card v-for="(child, index) in dataCashProfitReport.cashPaymentList" :key="index">
                  <div class="row justify-between">
                    <div class="col-8 custom-section-left">
                      <q-card-section class="q-pr-lg">
                        {{ child.cashieringReceiptTypeName }}</q-card-section
                      >
                    </div>
                    <div class="col-4 custom-section-right">
                      <q-card-section class="float-right custom-padding-right q-mr-md">
                        {{ formatMoney(child.cashieringReceiptTypeTotalPrice) }}
                        VND</q-card-section
                      >
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                switch-toggle-side
                expand-separator
                class="custom-icon disable-icon"
              >
                <template #header>
                  <q-item-section
                    ><div class="q-py-sm">3. {{ t('profit') }} (1-2)</div></q-item-section
                  >

                  <q-item-section side>
                    <div class="row items-center">
                      <div class="custom-padding-right style-color">
                        {{ formatMoney(dataCashProfitReport?.profit) }} VND
                      </div>
                    </div>
                  </q-item-section>
                </template>
              </q-expansion-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>
  </pms-sections>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar';
import { formatMoney } from '~/composable/useFormat';
import { useShiftHanoverReportQuery } from './api/useCashProfitReportQuery';
import { useI18n } from '~/composable/useI18n';
import { FORMAT_DATE_UI } from '~/constants';

const { t } = useI18n();

const $date = date.formatDate;
const qDateRef = ref<any>(null);
const TIME_OPTIONS = computed(() => [
  // { key: 'Select Time range', id: 0 },
  { key: t('today'), id: 1 },
  { key: t('this_week'), id: 2 },
  { key: t('this_month'), id: 3 },
  { key: t('this_year'), id: 4 },
]);
let valueTime = ref(1);
let today = new Date();
let startDate = ref($date(Date.now(), FORMAT_DATE_UI));
let endDate = ref($date(Date.now(), FORMAT_DATE_UI));
let pagination = ref({
  currentPage: 1,
  lastPage: 1,
});
let {
  data: dataCashProfitReport,
  isLoading: loadingCashProfitReport,
  refetch: refetchCashProfitReport,
} = useShiftHanoverReportQuery({
  page: pagination,
  startTime: startDate,
  endTime: endDate,
});
const onOpenDatePopUp = () => {
  qDateRef?.value.show();
  refetchCashProfitReport.value();
};
const dateRange = computed({
  get: () => {
    return {
      from: startDate.value,
      to: endDate.value,
    };
  },
  set: (val) => {
    if (typeof val === 'object') {
      startDate.value = val?.from;
      endDate.value = val?.to;
    } else {
      startDate.value = val as any;
      endDate.value = val as any;
    }
  },
});
const chooseThisWeek = () => {
  const curr = new Date();
  var firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  var lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
  startDate.value = $date(firstDay, FORMAT_DATE_UI);
  endDate.value = $date(lastDay, FORMAT_DATE_UI);
};
const chooseThisMonth = () => {
  if (today.getDate() > 1) {
    endDate.value = $date(new Date(today.getFullYear(), today.getMonth() + 1, 0), FORMAT_DATE_UI);
    today.setDate(1);
    startDate.value = $date(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      FORMAT_DATE_UI,
    );
  } else if (today.getDate() === 1) {
    endDate.value = $date(new Date(today.getFullYear(), today.getMonth() + 1, 0), FORMAT_DATE_UI);
    today.setDate(1);
    startDate.value = $date(
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
      FORMAT_DATE_UI,
    );
  }
};
const chooseThisYear = () => {
  startDate.value = $date(new Date(today.getFullYear() - 1, 12, 1), FORMAT_DATE_UI);
  endDate.value = $date(new Date(new Date().getFullYear(), 11, 31), FORMAT_DATE_UI);
};
const changeTimeInfo = (val: any) => {
  if (val === 1) {
    startDate.value = $date(Date.now(), FORMAT_DATE_UI);
    endDate.value = $date(Date.now(), FORMAT_DATE_UI);
  } else if (val === 2) {
    chooseThisWeek();
  } else if (val === 3) {
    chooseThisMonth();
  } else if (val === 4) {
    chooseThisYear();
  }

  onSubmit();
};
const updateRangeTime = () => {
  valueTime.value = null as any;
};
const onSubmit = () => {
  // refetchCashProfitReport.value();
};

const handleRederDataLanguage = (text: string) => {
  if (!text) {
    return;
  }
  let str = text.replace(/\s/g, '');
  switch (str) {
    case 'Roomsale-Deposit':
      return 'sale_deposit';
    case 'Roomsale':
      return 'room_sale';
    case 'Retail':
      return 'retail';
    default:
      return text;
  }
};
</script>
<style lang="scss" scoped>
.custom-icon :deep(.q-icon) {
  color: #ff6400;
  margin-left: 16px;
}
.disable-icon :deep(.q-item__section--side > .q-icon) {
  display: none !important;
}
</style>
<style lang="sass" scoped>
.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 250px
  text-align: center
.custom-content
  margin-left: 0px
  border:1px solid #989289
  min-height:55vh
.style-scroll-product
  margin: -1px
.custom-section-left
  .q-card__section--vert
    padding-left:87px
.custom-padding-right
  padding-right:0px
  @media screen and (min-width: $breakpoint-sm-min)
    padding-right:100px
.style-color
  color: #000000
.q-expansion-item,.q-card
  border-top: 1px solid #0000001f
  margin-top: -1px
.style-border-header
  border-bottom: 1px solid #0000001f
</style>
