<script setup lang="ts">
import { computed, ref, inject, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Filter from '../../components/filter.vue';
import { useStockInventoryQuery } from '../apis/useInventoriesQuery';
import type { IInventoryStock } from '../apis/useInventoriesQuery';
import { QTableColumn } from 'quasar';
import { useI18n } from '~/composable/useI18n';
import { useAuth } from '~/composable/useAuth';
import { formatIndexTable } from '~/composable/useFormat';
import { date } from 'quasar';
import { Emitter } from 'mitt';
import { FORMAT_DATE_UI } from '~/constants';

const $date = date.formatDate;
const { hasPermission } = useAuth();
const { t } = useI18n();
let pagination = ref({
  currentPage: 1,
  lastPage: 1,
});
const emitter = inject('emitter') as Emitter<any>;
const route = useRoute();
const router = useRouter();
interface IFormValues {
  keywordSearchBookingNo: string;
  option: {
    key: string;
    id: number;
  };
  startWeek: string;
  startTime: string;
  categorySn: string;
  endTime: string;
  valuereceipts: {
    key: string;
    id: number;
  };
}
const valuereceipts = ref({
  key: 'All receipts',
  id: 0,
});
const categorySn = ref('');
let startTime = ref($date(Date.now(), FORMAT_DATE_UI));
let endTime = ref($date(Date.now(), FORMAT_DATE_UI));
const {
  data,
  isLoading,
  refetch: refetchStockInventory,
} = useStockInventoryQuery({
  startTime: startTime,
  endTime: endTime,
  categorySn: categorySn,
  page: pagination,
  limit: 10,
});
router.replace({
  path: '/settings/stock/inventory',
  query: { startTime: startTime.value, endTime: endTime.value },
});
onMounted(() => {
  emitter.on('closeDetailInventory', async () => {
    refetchStockInventory.value();
  });
});
const changeSuccess = (val: IFormValues) => {
  startTime.value = val.startTime;
  endTime.value = val.endTime;
  valuereceipts.value = val.valuereceipts;
  categorySn.value = val.categorySn;
  router.replace({
    path: '/settings/stock/inventory',
    query: { startTime: startTime.value, endTime: endTime.value },
  });
  // refetchExportStockList.value();
};

const columns = computed<QTableColumn<IInventoryStock>[]>(() => [
  {
    name: 'no',
    label: t('no'),
    field: (row) => row.sn,
  },
  {
    name: 'products',
    label: t('product', 99),
    field: (row) => row.productName,
  },
  {
    name: 'unit',
    label: t('unit'),
    field: (row) => row.productUnitName,
  },
  {
    name: 'startInventory',
    label: t('start_inventory'),
    field: (row) => row.startInventory,
  },
  {
    name: 'importQuantity',
    label: t('import_quantity'),
    field: (row) => row.importQuantity,
  },
  {
    name: 'exportQuantity',
    label: t('export_quantity'),
    field: (row) => row.exportQuantity,
  },
  {
    name: 'lastInventory',
    label: t('last_inventory'),
    field: (row) => row.lastInventory,
  },
  {
    name: 'detail',
    label: '',
    field: () => '',
  },
]);
</script>

<template>
  <div>
    <Filter
      :booking-no-field="false"
      :is-category="true"
      :is-add="false"
      @change-success="changeSuccess"
    />
    <q-inner-loading
      :showing="isLoading"
      label="Please"
      label-class="text-teal"
      label-style="font-size:1.1em"
    >
      <div lass="full-width" full-height class="q-mt-md row justify-center">
        <q-spinner color="negative" :thickness="2" size="2em" />
      </div>
    </q-inner-loading>

    <div v-if="!isLoading">
      <q-table
        v-if="data?.stockInventoryList"
        :loading="isLoading"
        :columns="columns"
        :rows="data?.stockInventoryList"
        :rows-per-page-options="[0]"
        hide-pagination
        hide-bottom
        no-data-label="No data"
      >
        <template #header="props">
          <q-tr>
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="th">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td key="no" :props="props" class="td">
              {{ formatIndexTable(pagination.currentPage, props.pageIndex) }}
            </q-td>
            <q-td key="products" :props="props" class="td">
              <div class="limit-text">{{ props.row.productName }}</div>
            </q-td>
            <q-td key="unit" :props="props" class="td">
              {{ props.row.productUnitName }}
            </q-td>
            <q-td key="startInventory" :props="props" class="td">
              {{ props.row.startInventory }}
            </q-td>
            <q-td key="importQuantity" :props="props" class="td">
              {{ props.row.importQuantity }}
            </q-td>
            <q-td key="exportQuantity" :props="props" class="td">
              {{ props.row.exportQuantity }}
            </q-td>
            <q-td key="lastInventory" :props="props" class="td">
              {{ props.row.lastInventory }}
            </q-td>
            <q-td key="detail" :props="props" class="td">
              <q-btn
                :class="hasPermission('import-export-detail') === false ? 'hidden' : ''"
                icon="visibility"
                :to="{
                  path: `/settings/stock/inventory/${props.row.sn}`,
                  query: { ...route.query },
                  state: {
                    productName: props.row.productName,
                    productUnitName: props.row.productUnitName,
                  },
                }"
                dense
                round
                flat
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-end q-mt-md">
        <q-pagination
          v-model="pagination.currentPage"
          color="negative"
          :max="data?.meta.lastPage || 1"
          :max-pages="6"
          direction-links
        />
      </div>
    </div>
  </div>
  <router-view />
</template>

<style scoped lang="scss">
.th {
  text-align: start;
}
.limit-text {
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  text-align: left;
}
.td {
  text-align: start;
}
</style>
