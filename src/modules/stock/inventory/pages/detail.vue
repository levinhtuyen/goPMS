<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { computed, ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import ExportDetailModal from '../../components/export-detail-modal.vue';
import type { IImportExportStock } from '../apis/useInventoryQuery';
import { useInventoryQuery } from '../apis/useInventoryQuery';
import ImportStockEditModal from '../../components/import-stock-edit-modal.vue';
import { Emitter } from 'mitt';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { date } from 'quasar';

interface ILastRow {
  isLast?: boolean;
}
const route = useRoute();
const startTime = ref<any>();
const endTime = ref<any>();
const { t } = useI18n();
const emitter = inject('emitter') as Emitter<any>;
const getDateTime = () => {
  if (route?.query?.startTime) {
    startTime.value = route?.query?.startTime;
    endTime.value = route?.query?.endTime;
  }
};
getDateTime();
const importStockEditModal = ref<InstanceType<typeof ImportStockEditModal> | null>(null);
const isImportStockEditModalOpen = ref(false);

const exportDetailModal = ref<InstanceType<typeof ExportDetailModal> | null>(null);

const onClickReceiptId = (receiptType: 1 | 2, stockSn: number) => {
  if (receiptType === 1) {
    isImportStockEditModalOpen.value = true;
    // 'as any' is used because vue-tsc fails to handle it.
    // https://github.com/vuejs/core/issues/4397
    (importStockEditModal.value as any)?.setupEditImportStockDialog(stockSn);
  } else {
    // 'as any' is used because vue-tsc fails to handle it.
    // https://github.com/vuejs/core/issues/4397
    (exportDetailModal.value as any)?.open(stockSn);
  }
};
const closePopupEditImportStock = () => {
  isImportStockEditModalOpen.value = false;
  onHide();
  emitter.emit('closeDetailInventory');
};
const router = useRouter();
const { data, isLoading } = useInventoryQuery({
  startTime: startTime,
  endTime: endTime,
  productSn: route?.params?.productSn,
});

const rows = computed<(IImportExportStock | ILastRow)[] | undefined>(() =>
  data.value && data.value.importExportStockList.length !== 0
    ? [...data.value.importExportStockList, { isLast: true }]
    : undefined,
);

const columns = computed<QTableColumn<IImportExportStock>[]>(() => [
  {
    name: 'receiptType',
    label: t('receipt_type'),
    field: (row) => row.receiptType,
  },
  {
    name: 'dateTime',
    label: t('receipt_date_time'),
    field: (row) => row.receiptDate,
  },
  {
    name: 'receiptSn',
    label: t('receipt_ID'),
    field: (row) => row.receiptId,
  },
  {
    name: 'importQuantity',
    label: t('import_quantity'),
    field: (row) => row.importQuantity,
  },
  {
    name: 'importPrice',
    label: t('import_price'),
    field: (row) => row.importPrice,
  },
  {
    name: 'exportQuantity',
    label: t('export_quantity'),
    field: (row) => row.exportQuantity,
  },
  {
    name: 'exportPrice',
    label: t('export_price'),
    field: (row) => row.exportPrice,
  },
  {
    name: 'note',
    label: t('note'),
    field: (row) => row.note,
  },
]);

const onHide = () =>
  router.replace({ path: '/settings/stock/inventory', query: { ...route.query } });
</script>

<template>
  <q-dialog :model-value="true" @hide="onHide">
    <q-card style="width: 1360px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ t('import_export_detail') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="q-mb-md flex q-gutter-x-md text-weight-bold">
          <span>{{ router.options.history.state.productName }}</span>
          <span>{{ t('unit') }}: {{ router.options.history.state.productUnitName }}</span>
          <div v-if="startTime && endTime">
            <span> {{ t('from') }} {{ startTime }} {{ t('to') }} {{ endTime }} </span>
          </div>
        </div>
        <q-table
          :loading="isLoading"
          :columns="columns"
          :rows="rows"
          :rows-per-page-options="[0]"
          hide-pagination
          hide-bottom
          no-data-label="No data"
          flat
        >
          <template #header="props">
            <q-tr>
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="th">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr
              :props="props"
              :class="props.row.isLast ? 'bg-white text-weight-bolder' : ''"
              no-hover
            >
              <q-td key="receiptType" :props="props" class="td">
                {{
                  props.row.isLast
                    ? t('total')
                    : props.row.receiptType === 1
                    ? t('import_stock')
                    : props.row.receiptType === 2
                    ? t('export_stock')
                    : ''
                }}
              </q-td>
              <q-td key="dateTime" :props="props" class="td">
                {{ date.formatDate(props.row.receiptDate * 1000, FORMAT_DATE_TIME_UI) }}
              </q-td>
              <q-td key="receiptSn" :props="props" class="td">
                <q-btn
                  :label="props.row.receiptId"
                  flat
                  dense
                  color="orange-10"
                  @click="onClickReceiptId(props.row.receiptType, props.row.stockSn)"
                />
              </q-td>
              <q-td key="importQuantity" :props="props" class="td">
                {{ props.row.isLast ? data?.total.importQuantity : props.row.importQuantity }}
              </q-td>
              <q-td key="importPrice" :props="props" class="td">
                {{
                  props.row.isLast
                    ? formatMoney(data?.total.importPrice)
                    : formatMoney(props.row.importPrice)
                }}
                VND
              </q-td>
              <q-td key="exportQuantity" :props="props" class="td">
                {{ props.row.isLast ? data?.total.exportQuantity : props.row.exportQuantity }}
              </q-td>
              <q-td key="exportPrice" :props="props" class="td">
                {{
                  props.row.isLast
                    ? formatMoney(data?.total.exportPrice)
                    : formatMoney(props.row.exportPrice)
                }}
                VND
              </q-td>
              <q-td key="note" :props="props" class="td">
                <p class="note">{{ props.row.note }}</p>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
  <ExportDetailModal ref="exportDetailModal" />
  <ImportStockEditModal
    ref="importStockEditModal"
    v-model="isImportStockEditModalOpen"
    @close="closePopupEditImportStock"
  />
</template>

<style scoped lang="scss">
.th {
  height: 42px;
  font-size: 14px;
  font-weight: bold;
  text-align: start;
}

.td {
  height: 48px;
  text-align: start;
  .note {
    margin: 0;
    width: 100%;
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
  }
}
</style>
