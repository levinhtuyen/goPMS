<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import Filter from '../../components/filter.vue';
import type { IExportStock } from '../apis/useExportsQuery';
import { useExportStockQuery } from '../apis/useExportsQuery';
import { useAuth } from '~/composable/useAuth';
import { date } from 'quasar';
import { formatIndexTable } from '~/composable/useFormat';
import { FORMAT_DATE_UI, FORMAT_DATE_TIME_UI } from '~/constants';

const $date = date.formatDate;
const { hasPermission } = useAuth();
const { t } = useI18n();
interface IFormValues {
  keywordSearchBookingNo: string;
  option: {
    key: string;
    id: number;
  };
  startWeek: string;
  startTime: string;
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

const keyword = ref();
let pagination = ref({
  currentPage: 1,
  lastPage: 1,
});
let today = new Date();
let startTime = ref($date(Date.now(), FORMAT_DATE_UI));
let endTime = ref($date(Date.now(), FORMAT_DATE_UI));
let startWeek = ref(
  $date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), FORMAT_DATE_UI),
);

const route = useRoute();
const { data: dataExportStock, isLoading } = useExportStockQuery({
  page: pagination,
  limit: 10,
  keyword: keyword,
  startWeek: startWeek,
  displayType: valuereceipts,
  startTime: !startTime.value ? startWeek : startTime,
  endTime: endTime,
});
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed<QTableColumn<IExportStock>[]>(() => [
  { name: 'no', align: 'left' as TAlignColumn, label: t('no'), field: (row) => row.sn },
  { name: 'exportDatetime', label: t('export_datetime'), field: (row) => row.exportDate },
  {
    name: 'exportReceiptID',
    align: 'left' as TAlignColumn,
    label: t('export_receipt_id'),
    field: (row) => row.receiptId,
  },
  {
    name: 'bookingNo',
    align: 'left' as TAlignColumn,
    label: t('booking_no'),
    field: (row) => row.bookingNo,
  },
  {
    name: 'total',
    label: t('total'),
    align: 'right' as TAlignColumn,
    field: (row) => row.totalPrice,
  },
  { name: 'note', align: 'left' as TAlignColumn, label: t('note'), field: (row) => row.note },
  { name: 'isDeleted', align: 'left' as TAlignColumn, label: '', field: () => '' },
]);

const changeSuccess = (val: IFormValues) => {
  keyword.value = val.keywordSearchBookingNo;
  startWeek.value = val.startWeek;
  startTime.value = val.startTime;
  endTime.value = val.endTime;
  valuereceipts.value = val.valuereceipts;
};

watch(startTime, () => {
  pagination.value.currentPage = 1;
});

watch(keyword, () => {
  pagination.value.currentPage = 1;
});
watch(valuereceipts, () => {
  pagination.value.currentPage = 1;
});
</script>

<template>
  <div>
    <Filter
      :booking-no-field="true"
      :is-category="false"
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
        v-if="dataExportStock?.data?.exportStockList"
        :loading="isLoading"
        :columns="columns"
        :rows="dataExportStock?.data?.exportStockList"
        :rows-per-page-options="[0]"
        no-data-label="No data"
        hide-pagination
        hide-bottom
      >
        <template #header="props">
          <q-tr>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :class="col.label === 'Total' ? 'th-end' : 'th'"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td key="no" :props="props" class="td" :data-isDeleted="!!props.row.deleteTime">
              {{ formatIndexTable(pagination.currentPage, props.pageIndex) }}
            </q-td>
            <q-td
              key="exportDatetime"
              :props="props"
              class="td"
              :data-isDeleted="!!props.row.deleteTime"
            >
              {{ date.formatDate(props.row.exportDate * 1000, FORMAT_DATE_TIME_UI) }}
            </q-td>
            <q-td
              key="exportReceiptID"
              :props="props"
              class="td"
              :data-isDeleted="!!props.row.deleteTime"
            >
              <q-btn
                v-if="hasPermission('view-export-receipt-detail')"
                :label="props.row.receiptId"
                :to="{ path: `/settings/stock/export/${props.row.sn}`, query: { ...route.query } }"
                flat
                dense
                :disable="!!props.row.deleteTime"
                :color="props.row.deleteTime ? '' : 'orange-10'"
              />
              <span v-else :disable="!!props.row.deleteTime"> {{ props.row.receiptId }}</span>
            </q-td>
            <q-td
              key="bookingNo"
              :props="props"
              class="td"
              :data-isDeleted="!!props.row.deleteTime"
            >
              <q-btn
                :label="props.row.bookingNo"
                :to="{ path: `/booking-details/${props.row.bookingSn}` }"
                target="_blank"
                flat
                dense
                :disable="!!props.row.deleteTime"
                :color="props.row.deleteTime ? '' : 'orange-10'"
              />
            </q-td>
            <q-td
              key="total"
              :props="props"
              class="td-end"
              :data-isDeleted="!!props.row.deleteTime"
            >
              {{ formatMoney(props.row.totalPrice) }} VND
            </q-td>
            <q-td key="note" :props="props" class="td" :data-isDeleted="!!props.row.deleteTime">
              <div class="limit-text">
                <p class="note">{{ props.row.note }}</p>
              </div>
            </q-td>
            <q-td
              key="isDeleted"
              :props="props"
              class="action-detail"
              :data-isDeleted="!!props.row.deleteTime"
            >
              <q-btn
                v-if="props.row.deleteTime"
                :class="hasPermission('view-export-receipt-detail') === false ? 'hidden' : ''"
                icon="visibility"
                :to="{ path: `/settings/stock/export/${props.row.sn}`, query: { ...route.query } }"
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
          :max="dataExportStock?.data?.meta.lastPage || 1"
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
.th-end {
  text-align: right;
}
.td {
  border: none;
  text-align: start;
  .note {
    margin: 0;
    width: 100%;
    min-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
  }
}
.action-detail {
  border: none;
  text-align: start;
}
.td-end {
  border: none;
  text-align: right;
  .note {
    margin: 0;
    width: 100%;
    min-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
}
.limit-text {
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 350px;
  text-align: left;
}
.td[data-isDeleted='true'] {
  opacity: 0.4;
}
.td-end[data-isDeleted='true'] {
  opacity: 0.4;
}
.q-btn {
  font-size: unset;
}
</style>
