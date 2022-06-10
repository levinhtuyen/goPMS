<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import { i18n } from '~/plugins/i18n';
const { t } = useI18n();
// interface
interface ITotalEfficiencyList {
  name: string;
  value: number;
}
interface ITotalRevenueList extends ITotalEfficiencyList {}
interface IExtraData {
  totalEfficiencyList: ITotalEfficiencyList[] | null;
  totalRevenueList: ITotalRevenueList[] | null;
  totalEfficiency: number;
  totalRevenue: number;
}
interface ICheckEmpty {
  isEfficiencyEmpty: boolean;
  isRevenueEmpty: boolean;
}
interface IProps {
  data: IExtraData | null;
  isEmpty: ICheckEmpty;
}
// prop, emits
const props = defineProps<IProps>();
const chartData = toRefs(props).data;
const chartCheckData = toRefs(props).isEmpty;
let totalEfficiencyList = ref<number[]>([]);
let totalRevenueList = ref<number[]>([]);
const label = ref<string[]>([]);
const optionsEfficiency = {
  chart: {
    id: 'apex-donut',
    type: 'pie',
  },
  legend: {
    show: true,
    height: '300px',
    onItemHover: {
      highlightDataSeries: false,
    },
    onItemClick: {
      toggleDataSeries: false,
    },
    formatter: (seriesName: string, opts: { seriesIndex: number }) => {
      return label.value[opts.seriesIndex];
    },
  },
  tooltip: {
    enabled: true,
    custom: ({ series, w }: { series: []; w: any }) => {
      let textContent = '';
      series.map((val: any, index: number) => {
        textContent += `<p class="series"><span class="color-box" style="background-color: ${
          w.globals.colors[index]
        }"></span> <span class="content-label ellipsis q-pl-xs">${
          label.value[index]
        }:</span><span class="content-value text-right">${formatMoney(val)} %</span></p>`;
      });
      const text = `
        <div class="q-pa-md bg-white text-black pie-chart-tooltip-efficiency">
          <p class="series"><span class="color-box col-md-2"> </span><span class="content-label ellipsis q-pl-xs col-md-6">${t(
            'total_efficiency',
          )}:</span><span class="content-value col-md-4 text-right"> ${
        chartData.value?.totalEfficiency
      } %</span> </p>
          ${textContent}
        </div>`;
      return text;
    },
  },
};
const optionsRevenue = {
  chart: {
    id: 'apex-donut',
    type: 'pie',
  },
  legend: {
    show: false,
  },
  labels: [],
  tooltip: {
    enabled: true,
    custom: ({ series, w }: { series: number[]; w: any }) => {
      let textContent = '';
      series.map((val: any, index: number) => {
        textContent += `<p class="series"><span class="color-box col-md-2" style="background-color: ${
          w.globals.colors[index]
        }"></span> <span class="content-label ellipsis q-pl-xs col-md-4">${
          label.value[index]
        }:</span><span class="content-value col-md-6 text-right">${formatMoney(
          val,
        )} VND</span></p>`;
      });
      const text = `
        <div class="q-pa-md bg-white text-black pie-chart-tooltip-revenue">
          <p class="series"><span class="color-box col-md-2"> </span><span class="content-label ellipsis q-pl-xs col-md-4"> ${t(
            'total_revenue',
          )}:</span><span class="content-value col-md-6 text-right"> ${formatMoney(
        chartData.value?.totalRevenue,
      )} VND</span> </p>
          ${textContent}
        </div>`;
      return text;
    },
  },
};

// watch
watch(chartData, () => {
  if (chartData.value) {
    totalEfficiencyList.value = chartData.value?.totalEfficiencyList?.map((val) => val.value) || [];
    totalRevenueList.value = chartData.value?.totalRevenueList?.map((val) => val.value) || [];
    const tmpTotalEfficiencyListWithLocale: Array<string> = [];

    chartData.value.totalEfficiencyList?.forEach(function (val, idx) {
      tmpTotalEfficiencyListWithLocale[idx] = val.name;
    });

    label.value = tmpTotalEfficiencyListWithLocale;
  }
});
const language = ref('');
watch(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => (i18n.global.locale as any).value,
  (val) => {
    if (chartData.value) {
      const tmpTotalEfficiencyListWithLocale: Array<string> = [];

      chartData.value.totalEfficiencyList?.forEach(function (val, idx) {
        tmpTotalEfficiencyListWithLocale[idx] = val.name;
      });

      label.value = tmpTotalEfficiencyListWithLocale;

      language.value = val;
    }
  },
);
// method
</script>
<template>
  <div :key="language" class="row">
    <div v-if="totalRevenueList.length > 0" class="col-md-4 col-sm-12 col-xs-12">
      <div v-if="chartCheckData.isRevenueEmpty">
        <apex-charts height="300" :options="optionsRevenue" :series="totalRevenueList" />
        <p class="text-center">{{ t('chart_label_total_revenue') }}</p>
      </div>

      <div v-else full-height class="q-mt-md row justify-center full-width">
        {{ t('no_data') }}
      </div>
    </div>
    <div class="col-md-8 col-sm-12 col-xs-12 custom-chart">
      <div v-if="chartCheckData.isEfficiencyEmpty">
        <apex-charts height="300" :options="optionsEfficiency" :series="totalEfficiencyList" />
        <p class="text-center q-mr-xl q-pr-xl">{{ t('chart_label_total_efficiency') }}</p>
      </div>
      <div v-else full-height class="q-mt-md row justify-center full-width">
        {{ t('no_data') }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.series {
  .color-box {
    width: 20px;
    height: 20px;
    display: inline-block;
  }
  .content-value {
    float: right;
  }
}
.pie-chart-tooltip-revenue {
  width: 337px;
}
.pie-chart-tooltip-efficiency {
  width: 274px;
}
.custom-chart {
  display: inline-block;
}
</style>
