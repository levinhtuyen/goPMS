<script setup lang="ts">
import { toRefs, computed } from 'vue';
import ApexCharts from 'vue3-apexcharts';
// interface
interface IProps {
  data?: number;
  chartColor: string;
}
// data
const props = defineProps<IProps>();
const chartData = toRefs(props).data;
const checkChartColor = toRefs(props).chartColor;
// computed
const series = computed(() => {
  return [chartData?.value || 0];
});
const chartOptions = {
  chart: {
    type: 'radialBar',
  },
  colors: [checkChartColor.value],
  plotOptions: {
    radialBar: {
      offsetX: 0,
      offsetY: -20,
      hollow: {
        margin: 5,
        size: '50%',
        background: 'transparent',
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: '16px',
          fontFamily: 'Open-san',
          fontWeight: 600,
          color: undefined,
          offsetY: -10,
        },
        value: {
          show: true,
          fontSize: '16px',
          fontFamily: undefined,
          fontWeight: 600,
          color: undefined,
          offsetY: -10,
          formatter: function (val: number) {
            return val + '%';
          },
        },
      },
    },
  },
  labels: [''],
};

// method
</script>
<template>
  <apex-charts type="radialBar" :options="chartOptions" :series="series" width="150" height="150" />
</template>
<style lang="scss"></style>
