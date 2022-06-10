<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';

// interface
interface IDetailData {
  data: number[];
  name: string;
}
interface IExtraData {
  detailData: IDetailData[];
}
interface IProps {
  data: IExtraData | null;
  category: number;
  isEmpty: boolean;
  horizontalCol: string[];
  preposition: string;
}
// prop, emits
const { t } = useI18n();
const props = defineProps<IProps>();
const chartData = toRefs(props).data;
const chartCheckData = toRefs(props).isEmpty;
const isPercent = toRefs(props).category;
const chartXAxis = toRefs(props).horizontalCol;

const chartPreposition = toRefs(props).preposition;
// data
const chartKey = ref(0);
const series = ref<IDetailData[]>([]);
const label = ref<string[]>([]);
// computed
const unit = computed(() => {
  return isPercent.value === 1 ? 'VND' : '%';
});
//
const options = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  legend: {
    show: true,
    onItemHover: {
      highlightDataSeries: false,
    },
    onItemClick: {
      toggleDataSeries: false,
    },
  },
  labels: [],
  tooltip: {
    enabled: true,
    custom: ({ series, dataPointIndex, w }: { series: []; dataPointIndex: number; w: any }) => {
      let textContent = '';
      const textRevenue = `<p class="series"><span class="color-box"> </span> <span class="content-text"><span class="content-label">${t(
        'revenue',
      )} ${t(chartPreposition.value)}
      ${chartXAxis.value[dataPointIndex]}:<span><span class="content-value"> ${formatMoney(
        chartData?.value?.detailData[chartData.value?.detailData.length - 2]?.data[dataPointIndex],
      )} ${unit.value}</span> </p>`;
      const textEfficiency = `<p class="series"><span class="color-box"> </span> <span class="content-text"><span class="content-label">${t(
        'efficiency',
      )} ${t(chartPreposition.value)}
      ${chartXAxis.value[dataPointIndex]}:<span><span class="content-value">  ${formatMoney(
        chartData?.value?.detailData[chartData.value?.detailData.length - 1]?.data[dataPointIndex],
      )} %</span> </p>`;
      const textTop = isPercent.value === 1 ? textRevenue + textEfficiency : textEfficiency;
      series.map((val: any, index: number) => {
        textContent += `<p class="series"><span class="color-box" style="background-color: ${
          w.globals.colors[index]
        }""></span> <span class="content-label">${
          label.value[index]
        }:</span><span class="content-value">${formatMoney(val[dataPointIndex])} ${
          unit.value
        }</span></p>`;
      });
      return (
        ' <div class="q-pa-md bg-white text-black col-chart-tooltip">' +
        textTop +
        textContent +
        '</div>'
      );
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
    },
  },
  xaxis: {
    categories: [],
  },
  fill: {
    opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
};
// watch
watch(chartData, () => {
  if (chartData?.value) {
    series.value = chartData.value?.detailData?.filter((val) => {
      return val.name !== 'revenueDetailData' && val.name !== 'efficiencyDetailData';
    });
    const tmpTotalEfficiencyListWithLocale: Array<string> = [];
    chartPreposition.value = t(chartPreposition.value);
    chartData?.value?.detailData?.forEach(function (val, idx) {
      tmpTotalEfficiencyListWithLocale[idx] = val.name;
    });

    label.value = tmpTotalEfficiencyListWithLocale;
    options.xaxis.categories = chartXAxis.value as any;
    chartKey.value++;
  }
});
watch(chartXAxis.value, () => {
  options.xaxis.categories = chartXAxis.value as any;
});
</script>
<template>
  <div>
    <div v-if="series?.length > 0">
      <apex-charts
        v-if="chartCheckData"
        :key="chartKey"
        height="300"
        type="bar"
        :options="options"
        :series="series"
      />
      <div v-else class="q-mt-md row justify-center full-width">
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
    vertical-align: middle;
  }
  .content-value {
    float: right;
  }
}
.col-chart-tooltip {
  width: 337px;
}
.custom-chart {
  display: inline-block;
}
</style>
