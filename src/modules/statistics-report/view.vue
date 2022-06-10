<script setup lang="ts">
import ColumnChart from './components/ColumnChart.vue';
import PieChart from './components/PieChart.vue';
import { useI18n } from '~/composable/useI18n';
import { computed, ref, reactive, watch } from 'vue';
import { date } from 'quasar';
import { useRevenueReportQuery, IParamsREQ } from './apis/getRevenueReport';
import { useOccupancyReportQuery } from './apis/getOccupancyReport ';
import {
  // FORMAT_DATE_TIME_PICKER,
  FORMAT_DATE_UI,
  // ClientOffset,
  FORMAT_DATE_PICKER,
} from '~/constants';
import { getHours } from './composable/getDateRangeType';
import { i18n } from '~/plugins/i18n';
// import { convertTimeZone } from '~/composables/useCreateDate';

interface IDetailData {
  data: number[];
  name: string;
}
interface ITotalEfficiencyList {
  name: string;
  value: number;
}
interface ITotalRevenueList extends ITotalEfficiencyList {}
interface IExtraData {
  detailData: IDetailData[];
  totalEfficiencyList: ITotalEfficiencyList[];
  totalRevenueList: ITotalRevenueList[];
  totalEfficiency: number;
  totalRevenue: number;
}
// data
const $date = date.formatDate;
const { t } = useI18n();
const dateOfWeek = computed(() => [
  t('monday'),
  t('tuesday'),
  t('wednesday'),
  t('thursday'),
  t('friday'),
  t('saturday'),
  t('sunday'),
]);
const monthOfYear = computed(() => [
  t('january'),
  t('february'),
  t('march'),
  t('april'),
  t('may'),
  t('june'),
  t('july'),
  t('august'),
  t('september'),
  t('october'),
  t('november'),
  t('december'),
]);
// const now = ref<number>(convertTimeZone(Date.now()));
const now = ref<number>(Date.now());

const qDateRef = ref<any>(null);
const rangeDateSelected = ref<number | null>(0);
const categorySn = ref<number>(1);
const xaxis = ref<string[]>(getHours());
const params = reactive<IParamsREQ>({
  // startDate: now.value / 1000,
  // endDate: now.value / 1000,
  startDate: Number(date.formatDate(now.value, 'X')),
  endDate: Number(date.formatDate(now.value, 'X')),

  dataFilterBy: 1,
  detailDataBy: 1,
});
const chartData = ref<IExtraData | null>(null);
const preposition = ref(t('at'));
const {
  data: dataRevenueReport,
  isFetching: isFetchingRevenue,
  refetch: refetchRevenue,
} = useRevenueReportQuery(params, categorySn);
const {
  data: dataOccupancyReport,
  isFetching: isFetchingOccupancy,
  refetch: refetchOccupancy,
} = useOccupancyReportQuery(params, categorySn);

// computed
const dateRange = computed({
  get: () => {
    return {
      // from: date.formatDate(
      //   new Date(convertTimeZone(params.startDate * 1000, false)),
      //   FORMAT_DATE_TIME_PICKER,
      // ),
      // to: date.formatDate(
      //   new Date(convertTimeZone(params.endDate * 1000, false)),
      //   FORMAT_DATE_TIME_PICKER,
      // ),
      from: date.formatDate(new Date(params.startDate * 1000), FORMAT_DATE_PICKER),
      to: date.formatDate(new Date(params.endDate * 1000), FORMAT_DATE_PICKER),
    };
  },
  set: (val: any) => {
    rangeDateSelected.value = null;
    if (val) {
      // const startDateTime = new Date((val.from || val) + ` 12:00`);
      // const endDateTime = new Date((val.to || val) + ` 12:00`);
      // params.startDate = Number(date.formatDate(convertTimeZone(startDateTime.getTime()), 'X'));
      // params.endDate = Number(date.formatDate(convertTimeZone(endDateTime.getTime()), 'X'));
      // checkPreposition(
      //   date.formatDate(convertTimeZone(startDateTime.getTime()), FORMAT_DATE_UI),
      //   date.formatDate(convertTimeZone(endDateTime.getTime()), FORMAT_DATE_UI),
      // ); // return at or in or on on label total of column chart
      // getHorizontal(
      //   date.formatDate(convertTimeZone(startDateTime.getTime()), 'YYYY-MM-DD'),
      //   date.formatDate(convertTimeZone(endDateTime.getTime()), 'YYYY-MM-DD'),
      // ); // return array Horizontal of chart like date from -> to if range date <= 31, return month if > 31
      params.startDate =
        Number(date.formatDate(new Date(val.from), 'X')) ||
        Number(date.formatDate(new Date(val), 'X'));
      params.endDate =
        Number(date.formatDate(new Date(val.to), 'X')) ||
        Number(date.formatDate(new Date(val), 'X'));
      checkPreposition(
        date.formatDate(new Date(val.from || val), FORMAT_DATE_UI),
        date.formatDate(new Date(val.to || val), FORMAT_DATE_UI),
      );
      getHorizontal(
        date.formatDate(new Date(val.from || val), 'YYYY-MM-DD'),
        date.formatDate(new Date(val.to || val), 'YYYY-MM-DD'),
      );
    } else {
      // params.startDate = params.endDate = Number(
      //   date.formatDate(convertTimeZone(new Date(now.value).getTime()), 'X'),
      // ); // set current date if have no data
      params.startDate = params.endDate = Number(date.formatDate(now.value, 'X'));
      rangeDateSelected.value = 0;
    }
  },
});
const rangeDateOption = computed(() => [
  {
    value: 0,
    name: t('today'),
  },
  {
    value: 1,
    name: t('this_week'),
  },
  {
    value: 2,
    name: t('this_month'),
  },
  {
    value: 3,
    name: t('previous_month'),
  },
  {
    value: 4,
    name: t('this_quarter'),
  },
  {
    value: 5,
    name: t('previous_quarter'),
  },
  {
    value: 6,
    name: t('this_year'),
  },
  {
    value: 7,
    name: t('last_year'),
  },
]);
const detailDataOption = computed(() => [
  {
    value: 1,
    name: t('booking_type'),
  },
  {
    value: 2,
    name: t('booking_source'),
  },
]);
// watch
watch(rangeDateSelected, (val) => {
  switch (val) {
    case 0:
      params.startDate = params.endDate = Number(date.formatDate(now.value, 'X'));
      xaxis.value = getHours();
      break;
    case 1:
      getDayOfWeek(); // return Date on monday and date on sunday
      break;
    case 2:
      geStartEndCurrentsMonth(); // return array start date to end date of current month
      break;
    case 3:
      getStartEndPreviousMonth(); // return array start date to end date of previous month
      break;
    case 4:
      getStartEndDateCurrentQuarter(); // return start date of first month and end date of last month of current quarter
      break;
    case 5:
      getStartEndDatePreviousQuarter(); // // return start date of first month and end date of last month of previous quarter
      break;
    case 6:
      getStartEndDateCurrentYear(); // return start date, end date of current year
      break;
    case 7:
      getStartEndDatePreviousYear(); // return start date, end date of previous year
      break;
  }
  checkPreposition(
    date.formatDate(new Date(params.startDate * 1000), FORMAT_DATE_UI),
    date.formatDate(new Date(params.endDate * 1000), FORMAT_DATE_UI),
  ); // return at or in or on on label total of column chart
});
watch(categorySn, (val) => {
  rangeDateSelected.value = 0;
  // params.startDate = Number(date.formatDate(convertTimeZone(now.value), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(now.value), 'X'));
  (params.startDate = Number(date.formatDate(now.value, 'X'))),
    (params.endDate = Number(date.formatDate(now.value, 'X'))),
    (params.dataFilterBy = 1);
  params.detailDataBy = 1;
  switch (val) {
    case 1:
      refetchRevenue.value();
      break;
    case 2:
      refetchOccupancy.value();
      break;
  }
});
watch(isFetchingRevenue, () => {
  chartData.value = dataRevenueReport.value;
});
watch(isFetchingOccupancy, () => {
  chartData.value = dataOccupancyReport.value;
});
// method
const onOpenDatePopUp = () => {
  qDateRef?.value.show();
};
const isPieChartEmpty = (arr: ITotalEfficiencyList[] = []) => {
  return arr.some((val: { value: number }) => {
    return val.value !== 0;
  });
}; // check if data array have no value != 0
const isColChartEmpty = (arr: IDetailData[] = []) => {
  return arr.some((val: { data: number[] }) => {
    return val.data.some((val: number) => {
      return val !== 0;
    });
  });
}; // check if data array have no value != 0
const getDayOfWeek = () => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay();
  const last = first + 6;
  // var firstDate = new Date(new Date().setDate(first + 1));
  // var endDate = new Date(new Date().setDate(last + 1));
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  var firstDay = new Date(new Date().setDate(first + 1));
  var lastDay = new Date(new Date().setDate(last + 1));
  params.startDate = Number(date.formatDate(firstDay, 'X'));
  params.endDate = Number(date.formatDate(lastDay, 'X'));
  xaxis.value = dateOfWeek.value;
};
const geStartEndCurrentsMonth = () => {
  const curr = new Date();
  // const firstDate = new Date(curr.getFullYear(), curr.getMonth(), 1, Math.abs(ClientOffset / 60));
  // const endDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, Math.abs(ClientOffset / 60));
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
  const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
  params.startDate = Number(date.formatDate(firstDay, 'X'));
  params.endDate = Number(date.formatDate(lastDay, 'X'));
  xaxis.value = getAllDaysInMonth(curr.getFullYear(), curr.getMonth());
};
const getStartEndPreviousMonth = () => {
  const curr = new Date();
  // const firstDate = new Date(
  //   curr.getFullYear(),
  //   curr.getMonth() - 1,
  //   1,
  //   Math.abs(ClientOffset / 60),
  // );
  // const endDate = new Date(curr.getFullYear(), curr.getMonth(), 0, Math.abs(ClientOffset / 60));
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  const firstDay = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
  const lastDay = new Date(curr.getFullYear(), curr.getMonth(), 0);
  params.startDate = Number(date.formatDate(firstDay, 'X'));
  params.endDate = Number(date.formatDate(lastDay, 'X'));
  xaxis.value = getAllDaysInMonth(curr.getFullYear(), curr.getMonth() - 1);
};
const getStartEndDateCurrentQuarter = () => {
  var now = new Date();
  var quarter = Math.floor(now.getMonth() / 3);
  // var firstDate = new Date(now.getFullYear(), quarter * 3, 1, Math.abs(ClientOffset / 60));
  // var endDate = new Date(
  //   firstDate.getFullYear(),
  //   firstDate.getMonth() + 3,
  //   0,
  //   Math.abs(ClientOffset / 60),
  // );
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  var firstDate = new Date(now.getFullYear(), quarter * 3, 1);
  var endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);
  params.startDate = Number(date.formatDate(firstDate, 'X'));
  params.endDate = Number(date.formatDate(endDate, 'X'));
  xaxis.value = getMonthOfQuarter(quarter + 1).value;
};
const getStartEndDatePreviousQuarter = () => {
  var now = new Date();
  // var quarter = Math.floor(now.getMonth() / 3);
  // var firstDate = new Date(now.getFullYear(), quarter * 3 - 3, 1, Math.abs(ClientOffset / 60));
  // var endDate = new Date(
  //   firstDate.getFullYear(),
  //   firstDate.getMonth() + 3,
  //   0,
  //   Math.abs(ClientOffset / 60),
  // );
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  var quarter = Math.floor(now.getMonth() / 3) * 3 + 1;
  var firstDate = new Date(now.getFullYear(), quarter * 3, 1);
  var endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);
  params.startDate = Number(date.formatDate(firstDate, 'X'));
  params.endDate = Number(date.formatDate(endDate, 'X'));
  xaxis.value = getMonthOfQuarter(quarter).value;
};
const getStartEndDateCurrentYear = () => {
  // const firstDate = new Date(new Date().getFullYear(), 0, 1, Math.abs(ClientOffset / 60));
  // const endDate = new Date(new Date().getFullYear(), 11, 31, Math.abs(ClientOffset / 60));
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  const firstDay = new Date(new Date().getFullYear(), 0, 1);
  const lastDay = new Date(new Date().getFullYear(), 11, 31);
  params.startDate = Number(date.formatDate(firstDay, 'X'));
  params.endDate = Number(date.formatDate(lastDay, 'X'));
  xaxis.value = monthOfYear.value;
};
const getStartEndDatePreviousYear = () => {
  // const firstDate = new Date(new Date().getFullYear() - 1, 0, 1, Math.abs(ClientOffset / 60));
  // const endDate = new Date(new Date().getFullYear() - 1, 11, 31, Math.abs(ClientOffset / 60));
  // params.startDate = Number(date.formatDate(convertTimeZone(firstDate.getTime()), 'X'));
  // params.endDate = Number(date.formatDate(convertTimeZone(endDate.getTime()), 'X'));
  const firstDay = new Date(new Date().getFullYear() - 1, 0, 1);
  const lastDay = new Date(new Date().getFullYear() - 1, 11, 31);
  params.startDate = Number(date.formatDate(firstDay, 'X'));
  params.endDate = Number(date.formatDate(lastDay, 'X'));
  xaxis.value = monthOfYear.value;
};
const getAllDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    const [day, month] = $date(date, FORMAT_DATE_UI).split('/');
    dates.push(`${day}/${month}`);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};
const getArrDaysInMonth = (startDate: Date, endDate: Date) => {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    const [day, month] = $date(date, FORMAT_DATE_UI).split('/');
    dates.push(`${day}/${month}`);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};
const getMonthOfQuarter = (quarter: number) =>
  computed(() => {
    switch (quarter) {
      case 1:
        return [t('january'), t('february'), t('march')];
      case 2:
        return [t('april'), t('may'), t('june')];
      case 3:
        return [t('july'), t('august'), t('september')];
      case 4:
        return [t('october'), t('november'), t('december')];
      default:
        return [];
    }
  });
const checkPreposition = (startDate: string, endDate: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [daySt, monthSt, yearSt] = startDate.split('/');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dayEd, monthEd, yearEd] = endDate.split('/');
  if (daySt === dayEd && monthSt === monthEd) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    preposition.value = 'at';
  } else if (daySt !== dayEd && monthSt === monthEd) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    preposition.value = 'on';
  } else {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    preposition.value = 'in';
  }
  return preposition.value;
};
const language = ref('');
watch(
  () => (i18n.global.locale as any).value,
  (valueI18n) => {
    language.value = valueI18n;
    refetchRevenue.value();
    refetchOccupancy.value();

    const valRange = rangeDateSelected.value;
    switch (valRange) {
      case 0:
        params.startDate = params.endDate = Number(date.formatDate(now.value, 'X'));
        xaxis.value = getHours();
        break;
      case 1:
        getDayOfWeek(); // return Date on monday and date on sunday
        break;
      case 2:
        geStartEndCurrentsMonth(); // return array start date to end date of current month
        break;
      case 3:
        getStartEndPreviousMonth(); // return array start date to end date of previous month
        break;
      case 4:
        getStartEndDateCurrentQuarter(); // return start date of first month and end date of last month of current quarter
        break;
      case 5:
        getStartEndDatePreviousQuarter(); // // return start date of first month and end date of last month of previous quarter
        break;
      case 6:
        getStartEndDateCurrentYear(); // return start date, end date of current year
        break;
      case 7:
        getStartEndDatePreviousYear(); // return start date, end date of previous year
        break;
    }
  },
);
const getHorizontal = (startDate: string, endDate: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [yearSt, monthSt, daySt] = startDate.split('-');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [yearEd, monthEd, dayEd] = endDate.split('-');
  // const newStartDate = convertTimeZone(new Date(startDate + ` 12:00`).getTime());
  // const newEndDate = convertTimeZone(new Date(endDate + ` 12:00`).getTime());
  // const totalDates = (newEndDate - newStartDate) / (1000 * 3600 * 24);
  // if (daySt === dayEd && monthSt === monthEd) {
  //   xaxis.value = getHours(); // push 24 hours
  // } else if (totalDates < 31) {
  //   xaxis.value = getArrDaysInMonth(new Date(newStartDate), new Date(newEndDate)); // push arr dates between start and end date
  // } else if (totalDates >= 31) {
  //   xaxis.value = monthOfYear.filter(
  //     (element, index) => index >= Number(monthSt) - 1 && index <= Number(monthEd) - 1,
  //   ); // push month of year between start and end date
  // }
  const totalDates =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
  if (daySt === dayEd && monthSt === monthEd) {
    xaxis.value = getHours(); // push 24 hours
  } else if (totalDates < 31) {
    xaxis.value = getArrDaysInMonth(new Date(startDate), new Date(endDate)); // push arr dates between start and end date
  } else if (totalDates >= 31) {
    let monthArr = [];
    monthArr = monthOfYear.value.filter(
      (element, index) => index >= Number(monthSt) - 1 && index <= Number(monthEd) - 1,
    );
    xaxis.value = monthArr; // push arr month between start and end date
  }
};
</script>
<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md justify-between">
        <div v-if="categorySn === 1" class="text-h5 text-bold">
          {{ t('statistics_revenue_report') }}
        </div>
        <div v-else class="text-h5 text-bold">{{ t('statistics_occupancy_report') }}</div>
        <div class="q-gutter-y-sm custom-row rounded-borders">
          <q-btn
            :label="t('revenue')"
            class="col custom-tab text-bold"
            :class="categorySn === 1 ? 'active' : ''"
            no-caps
            dense
            @click="categorySn = 1"
          />

          <q-btn
            :label="t('occupancy')"
            class="col custom-tab text-bold"
            :class="categorySn === 2 ? 'active' : ''"
            no-caps
            dense
            @click="categorySn = 2"
          />
        </div>
      </div>

      <div class="row items-center q-mb-md">
        <div class="col-md-2 col-sm-4 col-xs-12 q-pb-sm">
          <q-select
            v-model="rangeDateSelected"
            class="q-mr-md"
            :options="rangeDateOption"
            :label="t('select_time_range')"
            filled
            dense
            emit-value
            map-options
            input-debounce="0"
            option-value="value"
            option-label="name"
          />
        </div>
        <div class="col-md-3 col-sm-2 col-xs-12 q-pb-sm">
          <q-field
            :placeholder="t('select_date_time')"
            dense
            stack-label
            filled
            class="block q-mr-md"
            @focus="onOpenDatePopUp"
          >
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ $date(dateRange.from, FORMAT_DATE_UI) }} -
                {{ $date(dateRange.to, FORMAT_DATE_UI) }}
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
        <div class="col-md-2 col-sm-4 col-xs-12 q-pb-sm">
          <q-select
            v-model="params.detailDataBy"
            class="q-mr-md"
            :options="detailDataOption"
            filled
            dense
            emit-value
            map-options
            input-debounce="0"
            option-value="value"
            option-label="name"
          />
        </div>
        <div class="custom-row rounded-borders q-mb-sm">
          <q-btn
            :label="t('checked_in_time')"
            class="col custom-tab text-bold"
            :class="params.dataFilterBy === 1 ? 'active' : ''"
            no-caps
            dense
            @click="params.dataFilterBy = 1"
          />
          <q-btn
            :label="t('checked_out_time')"
            class="col custom-tab text-bold"
            :class="params.dataFilterBy === 2 ? 'active' : ''"
            no-caps
            dense
            @click="params.dataFilterBy = 2"
          />
        </div>
      </div>
    </template>
    <div>
      <div>
        <pie-chart
          :data="chartData"
          :is-empty="{
            isEfficiencyEmpty: isPieChartEmpty(chartData?.totalEfficiencyList),
            isRevenueEmpty: isPieChartEmpty(chartData?.totalRevenueList),
          }"
        />
      </div>
      <div>
        <column-chart
          :data="chartData"
          :category="categorySn"
          :is-empty="isColChartEmpty(chartData?.detailData)"
          :horizontal-col="xaxis"
          :preposition="preposition"
        />
      </div>
    </div>
  </pms-sections>
</template>
<style lang="scss" scoped>
.custom-tab {
  width: 186px;
  color: #9a9a9a;
  font-size: 16px;

  &.active {
    background-color: $deep-orange-12;
    color: white;
  }
}

.custom-row {
  display: inline-block;
  line-height: normal;
  vertical-align: middle;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.q-btn:before {
  box-shadow: none;
}
</style>
